import RefreshIconOutlined from '@mui/icons-material/RefreshOutlined'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { green, red } from '@mui/material/colors'
import { DataGrid, GridColDef, GridRenderCellParams, gridClasses } from '@mui/x-data-grid'
import { useMemo } from 'react'
import { POLLING_INTERVAL, useOpenPositionsPolling } from '../../../hooks/useOpenPositionsPolling.ts'
import { useSymbataStoreActions, useSymbataStoreOpenPositions } from '../../../stores/symbataStore.ts'
import { IOpenPosition } from '../../../stores/symbataStore.types.ts'
import { formatNumber } from '../../../utils/utils.ts'

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

export const OpenPositions = () => {
  const openPositions = useSymbataStoreOpenPositions()
  const { setTradingViewSymbol } = useSymbataStoreActions()
  const isMobile = useMediaQuery('(max-width:900px)')

  // Custom hook handles polling and change detection for flash animations
  const { progress, refreshOpenPositions } = useOpenPositionsPolling(openPositions)

  const positionsArray = useMemo(() => {
    if (!openPositions) return []
    // Add symbol as id for DataGrid row identification
    return Object.values(openPositions).map((position) => ({
      ...position,
      id: position.symbol,
    }))
  }, [openPositions])

  // DataGrid column definitions matching PositionItem display
  const columns: GridColDef<IOpenPosition & { id: string }>[] = useMemo(
    () => [
      {
        field: 'symbol',
        headerName: 'Symbol',
        width: 100,
        renderCell: (params: GridRenderCellParams<IOpenPosition & { id: string }>) => {
          const isProfit = params.row.profit > 0
          const profitColor = isProfit ? green[700] : red[700]
          const profitBgColor = isProfit ? green[50] : red[50]

          return (
            <Box display="flex" alignItems="center" gap={1}>
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
                <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
                  {params.row.symbol}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.5rem' }}>
                  {params.row.tradeType.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          )
        },
      },
      {
        field: 'profit',
        headerName: 'Profit/Loss',
        width: 120,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<IOpenPosition & { id: string }>) => {
          const isProfit = params.row.profit > 0
          const profitColor = isProfit ? green[400] : red[400]
          return (
            <Typography variant="body2" sx={{ color: profitColor, fontWeight: 700 }}>
              {isProfit ? '+' : ''}${Math.abs(params.row.profit).toFixed(2)}
            </Typography>
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
        renderCell: (params: GridRenderCellParams<IOpenPosition & { id: string }>) => {
          const isProfit = params.row.currentROR > 0
          const profitColor = isProfit ? green[400] : red[400]
          return (
            <Typography variant="body2" sx={{ color: profitColor, fontWeight: 700 }}>
              {params.row.currentROR > 0 ? '+' : ''}
              {params.row.currentROR.toFixed(2)}%
            </Typography>
          )
        },
      },
      {
        field: 'buyPrice',
        headerName: 'Buy Price',
        width: 100,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<IOpenPosition & { id: string }>) => (
          <Typography variant="body2">${params.row.buyPrice}</Typography>
        ),
      },
      {
        field: 'currentPrice',
        headerName: 'Current Price',
        width: 120,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<IOpenPosition & { id: string }>) => (
          <Typography variant="body2">${params.row.currentPrice}</Typography>
        ),
      },
      {
        field: 'shares',
        headerName: 'Shares',
        width: 100,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<IOpenPosition & { id: string }>) => (
          <Typography variant="body2">{formatNumber(params.row.shares)}</Typography>
        ),
      },
      {
        field: 'buyAmount',
        headerName: 'Invested',
        width: 110,
        type: 'number',
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<IOpenPosition & { id: string }>) => (
          <Typography variant="body2">${formatNumber(params.row.buyAmount)}</Typography>
        ),
      },
      {
        field: 'usedStrategy',
        headerName: 'Strategy',
        width: 140,
        align: 'left',
        headerAlign: 'left',
        renderCell: (params: GridRenderCellParams<IOpenPosition & { id: string }>) => (
          <Typography variant="body2">{params.row.usedStrategy}</Typography>
        ),
      },
    ],
    [],
  )

  if (!openPositions) {
    return <LoadingState />
  }

  if (positionsArray.length === 0) {
    return <EmptyState />
  }

  return (
    <Box sx={{ pt: 1, height: 'calc(100dvh - 75px)', overflow: isMobile ? 'visible' : 'auto' }}>
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
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              [`& .${linearProgressClasses.bar}`]: {
                borderRadius: 1,
                transition: 'transform 0.1s linear',
              },
            }}
          />
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Next update: {Math.ceil((POLLING_INTERVAL - (progress / 100) * POLLING_INTERVAL) / 1000)}s
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
          disableRowSelectionOnClick={false}
          onRowClick={(params) => setTradingViewSymbol(params.row.symbol)}
          density="compact"
          sx={{
            [`& .${gridClasses.row}`]: {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
            [`& .${gridClasses.cell}`]: {
              display: 'flex',
              alignItems: 'center',
              padding: '0 8px',
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
