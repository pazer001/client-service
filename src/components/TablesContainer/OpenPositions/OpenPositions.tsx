import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RefreshIconOutlined from '@mui/icons-material/RefreshOutlined'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {
  Box,
  Chip,
  CircularProgress,
  Collapse,
  chipClasses,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { green, red } from '@mui/material/colors'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowHeightParams, gridClasses } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { POLLING_INTERVAL, useOpenPositionsPolling } from '../../../hooks/useOpenPositionsPolling.ts'
import {
  useSymbataStoreActions,
  // useSymbataStoreOpenPositions,
  useSymbataStoreUserId,
} from '../../../stores/symbataStore.ts';
import { IOpenPosition } from '../../../stores/symbataStore.types.ts'
import { formatNumber } from '../../../utils/utils.ts'
import { mockOpenPositionsData, USE_MOCK_OPEN_POSITIONS } from './OpenPositions.mock.ts'
import HighlightedNumber from '../../HighlightedNumber';
import { io } from 'socket.io-client';

const EmptyState = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="calc(100dvh - 200px)"
    gap={2}
  >
    <Typography variant="h6" color="text.secondary">
      No Open Positions
    </Typography>
    <Typography variant="body2" color="text.secondary">
      You currently have no open positions in your portfolio
    </Typography>
  </Box>
)

const LoadingState = () => (
  <Box display="flex" alignItems="center" justifyContent="center" height="calc(100dvh - 200px)">
    <CircularProgress size={40} />
  </Box>
)

// Height constants for expanded row calculation
const COLLAPSED_ROW_HEIGHT = 52
const EXPANDED_ROW_HEIGHT = 100

interface IPositionDetailPanelProps {
  position: IOpenPosition
}

/**
 * Detail panel component that displays the strategy when row is expanded.
 */
const PositionDetailPanel = ({ position }: IPositionDetailPanelProps) => (
  <Box
    sx={{
      py: 1,
    }}
  >
    <Box display="flex" alignItems="center" gap={1} width="100%">
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        Strategy:
      </Typography>
      <Chip
        label={position.usedStrategy}
        size="small"
        sx={{
          height: 20,
          fontSize: '0.7rem',
          backgroundColor: 'rgba(144, 202, 249, 0.16)',
          maxWidth: 'none',
          [`& .${chipClasses.label}`]: {
            whiteSpace: 'nowrap',
          },
        }}
      />
    </Box>
  </Box>
)

export const OpenPositions = () => {
  // const storeOpenPositions = useSymbataStoreOpenPositions()
  const [storeOpenPositions, setStoreOpenPositions] = useState()
  const { setTradingViewSymbol } = useSymbataStoreActions()
  const isMobile = useMediaQuery('(max-width:900px)')
  const accountId = useSymbataStoreUserId()

  // Track which rows are expanded to show detail panel (all expanded by default)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  // Use mock data when enabled in development mode
  const openPositions = import.meta.env.DEV && USE_MOCK_OPEN_POSITIONS ? mockOpenPositionsData : storeOpenPositions

  // Initialize all rows as expanded by default when positions data loads
  useEffect(() => {
    if (openPositions) {
      const allSymbols = Object.keys(openPositions)
      setExpandedRows(new Set(allSymbols))
    }
  }, [openPositions])

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_HOST)
    newSocket.on('connect', () => {
      console.log('Connected:', newSocket.id)

      // Register accountId
      newSocket.emit('register', { accountId })
    })

    newSocket.on('currentOpenPositions', (positions) => {
      // console.log("Received current open positions:", positions)
      setStoreOpenPositions(positions)
    })
    return () => {
      newSocket.close()
    }
  }, []);

  // Custom hook handles polling and change detection for flash animations
  const { animationKey, refreshOpenPositions } = useOpenPositionsPolling(storeOpenPositions)

  // Simple countdown for display - resets when animationKey changes
  const [remainingSeconds, setRemainingSeconds] = useState(Math.ceil(POLLING_INTERVAL / 1000))

  useEffect(() => {
    setRemainingSeconds(Math.ceil(POLLING_INTERVAL / 1000))
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [animationKey])

  /**
   * Toggle row expansion state. When expanded, shows the detail panel with full info.
   */
  const toggleRowExpand = useCallback((rowId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }, [])

  /**
   * Dynamic row height based on expansion state.
   * Expanded rows need more height to accommodate the detail panel.
   */
  const getRowHeight = useCallback(
    (params: GridRowHeightParams) => {
      return expandedRows.has(params.id as string) ? EXPANDED_ROW_HEIGHT : COLLAPSED_ROW_HEIGHT
    },
    [expandedRows],
  )

  const positionsArray = useMemo(() => {
    if (!openPositions) return []
    // Add symbol as id for DataGrid row identification
    // Filter out positions without a symbol to prevent DataGrid errors
    return Object.values(openPositions).map((position) => ({
      ...position,
      id: position.symbol,
    }))
  }, [openPositions])

  // Type alias for row data with id field
  type TPositionRow = IOpenPosition & { id: string }

  // DataGrid column definitions matching PositionItem display
  const columns: GridColDef<TPositionRow>[] = useMemo(() => {
    const baseColumns: GridColDef<TPositionRow>[] = [
      // Expand/collapse column - always first
      {
        field: 'expand',
        headerName: '',
        width: 40,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<TPositionRow>) => {
          const isExpanded = expandedRows.has(params.row.id)
          return (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation() // Prevent row click from firing
                toggleRowExpand(params.row.id)
              }}
              sx={{ p: 0.5 }}
            >
              {isExpanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          )
        },
      },
      // Symbol column with optional detail panel
      {
        field: 'symbol',
        headerName: 'Symbol',
        width: 100,
        renderCell: (params: GridRenderCellParams<TPositionRow>) => {
          const isProfit = params.row.profit > 0
          const profitColor = isProfit ? green[700] : red[700]
          const profitBgColor = isProfit ? green[50] : red[50]
          const isExpanded = expandedRows.has(params.row.id)

          return (
            <Box display="flex" flexDirection="column" width="100%" height="100%">
              {/* Main symbol content */}
              <Box display="flex" alignItems="center" gap={1} height={COLLAPSED_ROW_HEIGHT} py={1}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: profitBgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isProfit ? (
                    <TrendingUpIcon sx={{ color: profitColor, fontSize: 16 }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: profitColor, fontSize: 16 }} />
                  )}
                </Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="caption" fontWeight="bold" sx={{color: profitColor, fontSize: '0.7rem' }}>
                    {params.row.symbol}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>
                    {params.row.tradeType.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
              {/* Detail panel - shown when expanded */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <PositionDetailPanel position={params.row} />
              </Collapse>
            </Box>
          )
        },
      },
      {
        field: 'profit',
        headerName: 'P/L',
        width: 120,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<TPositionRow>) => {
          const isProfit = params.row.profit > 0
          // const profitColor = isProfit ? green[400] : red[400]
          return (
            <Box display="flex" alignItems="flex-start" height="100%" pt={2}>
              {/*<Typography variant="body2" sx={{ color: profitColor, fontWeight: 700 }}>*/}

              {/*</Typography>*/}
              <Typography>
              {isProfit ? '+' : ''}<HighlightedNumber value={Number(formatNumber(params.row.profit))} />
              </Typography>
            </Box>
          )
        },
      },
      {
        field: 'currentROR',
        headerName: 'ROR',
        width: 90,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<TPositionRow>) => {
          // const isProfit = params.row.currentROR > 0
          // const profitColor = isProfit ? green[400] : red[400]
          return (
            <Box display="flex" alignItems="flex-start" height="100%" pt={2}>
              {/*<Typography variant="body2" sx={{ color: profitColor, fontWeight: 700 }}>*/}
              {/*  {params.row.currentROR > 0 ? '+' : ''}*/}

              {/*</Typography>*/}
              <Typography>
              <HighlightedNumber value={Number(formatNumber(params.row.currentROR))} />%
              </Typography>
            </Box>
          )
        },
      },
      {
        field: 'buyPrice',
        headerName: 'Buy at',
        width: 100,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<TPositionRow>) => (
          <Box display="flex" alignItems="flex-start" height="100%" pt={2}>
            <Typography variant="body2">${params.row.buyPrice}</Typography>
          </Box>
        ),
      },
      {
        field: 'currentPrice',
        headerName: 'Price',
        width: 120,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<TPositionRow>) => (
          <Box display="flex" alignItems="flex-start" height="100%" pt={2}>
            {/*<Typography variant="body2">${params.row.currentPrice}</Typography>*/}
            <HighlightedNumber value={params.row.currentPrice} />
          </Box>
        ),
      },
      {
        field: 'shares',
        headerName: 'Shares',
        width: 100,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<TPositionRow>) => (
          <Box display="flex" alignItems="flex-start" height="100%" pt={2}>
            <Typography variant="body2">{formatNumber(params.row.shares)}</Typography>
          </Box>
        ),
      },
      {
        field: 'buyAmount',
        headerName: 'Invested',
        width: 110,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<TPositionRow>) => (
          <Box display="flex" alignItems="flex-start" height="100%" pt={2}>
            <Typography variant="body2">${formatNumber(params.row.buyAmount)}</Typography>
          </Box>
        ),
      },
      {
        field: 'stopLoss',
        headerName: 'Stop Loss',
        width: 110,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<TPositionRow>) => (
          <Box display="flex" alignItems="flex-start" height="100%" pt={2}>
            {/*<Typography variant="body2">${formatNumber(params.row.stopLoss)}</Typography>*/}
            <HighlightedNumber value={Number(formatNumber(params.row.stopLoss))} />
          </Box>
        ),
      },
    ]

    return baseColumns.filter((col) => col.field !== 'expand')
  }, [expandedRows, isMobile, toggleRowExpand])

  if (!openPositions) {
    return <LoadingState />
  }

  if (positionsArray.length === 0) {
    return <EmptyState />
  }

  return (
    <Box sx={{ pt: 1, height: 'calc(100dvh - 130px)', overflow: isMobile ? 'visible' : 'auto' }}>
      {/* Progress bar indicating time until next fetch */}
      <Box
        display="flex"
        alignItems="center"
        width="100%"
        sx={{
          mb: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#1e1e1e',
          boxShadow: '0px 5px 7px 0px #1E1E1E, 0px -16px 0px 10px #1E1E1E',
        }}
      >
        <Box flex={1}>
          {/* CSS-animated progress bar - smoother than JS-controlled updates */}
          <Box
            sx={{
              height: 6,
              borderRadius: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <Box
              key={animationKey}
              sx={{
                height: '100%',
                borderRadius: 1,
                backgroundColor: 'primary.main',
                // CSS animation from 0% to 100% width over POLLING_INTERVAL
                animation: `progressFill ${POLLING_INTERVAL}ms linear forwards`,
                '@keyframes progressFill': {
                  from: { width: '0%' },
                  to: { width: '100%' },
                },
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Next update: {remainingSeconds}s
            </Typography>
            <IconButton size="small" onClick={refreshOpenPositions} sx={{ display: 'flex', alignItems: 'center' }}>
              <RefreshIconOutlined sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* DataGrid replacing individual PositionItem cards */}
      <Box sx={{ height: 'calc(100% - 57px)', width: '100%' }}>
        <DataGrid
          rows={positionsArray}
          columns={columns}
          disableColumnMenu
          disableRowSelectionOnClick
          getRowHeight={getRowHeight}
          onRowClick={(params) => setTradingViewSymbol(params.row.symbol)}
          density="compact"
          sx={{
            [`& .${gridClasses.row}`]: {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              // Align cells to top when row is expanded
              alignItems: 'flex-start',
            },
            [`& .${gridClasses.cell}`]: {
              padding: '0 8px',
              // Allow content to overflow for expanded rows
              overflow: 'visible',
            },
            // First column (expand icon) should stay top-aligned
            [`& .${gridClasses.cell}:first-of-type`]: {
              alignItems: 'flex-start',
              pt: 1.5,
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </Box>
    </Box>
  )
}
