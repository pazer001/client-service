import { Activity, useMemo, useState } from 'react'
import { useWatchlistStoreWatchlists } from '../../stores/watchlistStore'
import { Avatar, Box, CircularProgress, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import ListIcon from '@mui/icons-material/List'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import { WatchlistsTable } from './WatchlistsTable/WatchlistsTable.tsx'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { EAction, IPriorityScore, IRecommendation, ISymbolItem } from '../../stores/symbataStore.types'
import AddToWatchListButton from './SymbolsTable/AddToWatchListButton/AddToWatchListButton'
import { grey } from '@mui/material/colors'
import { SymbolsTable } from './SymbolsTable/SymbolsTable.tsx'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import SyncProblemIcon from '@mui/icons-material/SyncProblem'
import { formatNumber } from '../../utils/utils.ts'
import { useSymbataStoreInterval } from '../../stores/symbataStore.ts'
import { Interval } from '../interfaces.ts'
import { OpenPositions } from './OpenPositions/OpenPositions.tsx'

interface CustomTabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export const initErrorRecommendation: IRecommendation = {
  action: EAction.ERROR,
  actions: [],
  stopLoss: 0,
  usedStrategy: '',
  shares: 0,
  symbolRestructurePrices: {
    date: [],
    volume: [],
    high: [],
    low: [],
    close: [],
    open: [],
    timestamp: [],
  },
}

// this is an example code from MUI documentation
// https://mui.com/material-ui/react-tabs/#introduction (first example)
// the Mui TabPanel component has to much padding by default, so we need to create our own, since the table doesn't have enough space
const CustomTabPanel = (props: CustomTabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`table-tabpanel-${index}`}
      aria-labelledby={`table-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 1, boxShadow: `0px -1px 0px 0px ${grey[500]}`, height: 'calc(100dvh - 155px)' }}>{children}</Box>
      )}
    </Box>
  )
}

const columns: GridColDef<ISymbolItem>[] = [
  {
    field: 'symbol',
    headerName: 'Symbol',
    renderCell: (params: GridRenderCellParams<ISymbolItem>) => {
      return (
        <Tooltip placement="left" title={params.row.name} arrow>
          <Box height={'100%'} display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 24, height: 24 }} src={params.row.logo}>
              {params.row.symbol.charAt(0).toUpperCase()}
            </Avatar>
            <Typography>{params.row.symbol}</Typography>
          </Box>
        </Tooltip>
      )
    },
  },
  {
    field: 'recommendation',
    headerName: 'Recommendation',
    width: 60,
    renderCell: (params: GridRenderCellParams<ISymbolItem>) => {
      let Elm = <Box />
      let title = undefined

      if (params.row.loading) {
        Elm = <CircularProgress size={20} />
      }
      if (!params.row.loading && params.row.recommendation) {
        switch (params.row.recommendation.action) {
          case EAction.BUY:
            title = 'Buy'
            Elm = <TrendingUpIcon color="success" />

            break
          case EAction.SELL:
            title = 'Sell'
            Elm = <TrendingDownIcon color="error" />

            break
          case EAction.HOLD:
            title = 'Hold'
            Elm = <TrendingFlatIcon />

            break
          case EAction.ERROR:
            title = 'Something want wrong, try again'
            Elm = <SyncProblemIcon color="warning" />

            break
        }
      }

      return (
        <Box display="flex" alignItems="center" height="100%">
          <Tooltip placement="right" title={title}>
            {Elm}
          </Tooltip>
        </Box>
      )
    },
  },
  {
    field: 'priorityScore',
    headerName: 'Priority Score',
    valueGetter: (priorityScore: IPriorityScore) => priorityScore.symbol,
    renderCell: (params) => formatNumber(params.row.priorityScore.symbol),
  },
  {
    field: 'averageVolume',
    headerName: 'Avg. Volume',
    width: 110,
    valueGetter: (averageVolume: number) => averageVolume,
    renderCell: (params) => formatNumber(params.row.averageVolume),
  },
  {
    field: 'watchlist',
    headerName: 'Watchlist',
    renderCell: (params: GridRenderCellParams<ISymbolItem>) => <AddToWatchListButton {...params.row} />,
  },
]

export const TablesContainer = () => {
  const interval = useSymbataStoreInterval()
  const watchlists = useWatchlistStoreWatchlists()
  const [activeIndex, setActiveIndex] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveIndex(newValue)
  }

  const watchlistsDisabled = useMemo(() => !watchlists.some(({ symbols }) => symbols.length > 0), [watchlists])

  return (
    <Box sx={{ height: 'calc(100vh - 82px)' }}>
      <Activity mode={interval === Interval['1d'] ? 'visible' : 'hidden'}>
        <Tabs variant="fullWidth" value={activeIndex} onChange={handleChange} aria-label="basic tabs example">
          <Tab iconPosition="start" icon={<ListIcon />} label="Symbols" />
          <Tab
            iconPosition="start"
            disabled={watchlistsDisabled}
            icon={<FolderSpecialIcon color={watchlistsDisabled ? 'inherit' : 'warning'} />}
            label="Watchlists"
          />
        </Tabs>
        <CustomTabPanel value={activeIndex} index={0}>
          <SymbolsTable columns={columns} />
        </CustomTabPanel>
        <CustomTabPanel value={activeIndex} index={1}>
          <WatchlistsTable columns={columns} />
        </CustomTabPanel>
      </Activity>
      <Activity mode={interval === Interval['5m'] ? 'visible' : 'hidden'}>
        <OpenPositions />
      </Activity>
    </Box>
  )
}
