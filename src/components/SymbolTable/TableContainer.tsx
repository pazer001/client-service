import { useMemo, useState } from 'react'
import { useWatchlistStoreWatchlists } from '../../stores/watchlistStore'
import { Box, Tab, Tabs } from '@mui/material'
import ListIcon from '@mui/icons-material/List'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import { Watchlists } from './Watchlists/Watchlists'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { IPriorityScore, ISymbolItem } from '../../stores/symbataStore.types'
import AddToWatchListButton from './AddToWatchListButton/AddToWatchListButton'
import { grey } from '@mui/material/colors'
import { SymbolTable } from './SymbolTable'

interface CustomTabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
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

export const columns: GridColDef<ISymbolItem>[] = [
  { field: 'symbol', headerName: 'Symbol' },
  {
    field: 'priorityScore',
    headerName: 'Priority Score',
    valueGetter: (priorityScore: IPriorityScore) => priorityScore.symbol,
    renderCell: (params) => params.row.priorityScore.symbol,
  },
  {
    field: 'watchlist',
    headerName: 'Watchlist',
    renderCell: (params: GridRenderCellParams<ISymbolItem>) => <AddToWatchListButton {...params.row} />,
  },
]

export const TableContainer = () => {
  const watchlists = useWatchlistStoreWatchlists()
  const [activeIndex, setActiveIndex] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveIndex(newValue)
  }

  const watchlistsDisabled = useMemo(() => watchlists.some(({ symbols }) => symbols.length > 0) === false, [watchlists])

  return (
    <Box sx={{ height: 'inherit' }}>
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
        <SymbolTable columns={columns} />
      </CustomTabPanel>
      <CustomTabPanel value={activeIndex} index={1}>
        <Watchlists columns={columns} />
      </CustomTabPanel>
    </Box>
  )
}
