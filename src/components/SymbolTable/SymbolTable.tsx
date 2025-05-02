// import { useSymbolTable } from './SymbolTable.hook.ts'
import { useMemo, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import ListIcon from '@mui/icons-material/List'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  Toolbar,
  ToolbarButton,
  ToolbarProps,
} from '@mui/x-data-grid'
import { InputAdornment, TextField, Tooltip } from '@mui/material'
import { useSymbolTable } from './SymbolTable.hook'
import { IPriorityScore, ISymbolItem } from '../../stores/symbataStore.types'
import AddToWatchListButton from './AddToWatchListButton/AddToWatchListButton'
import { Watchlists } from './Watchlists/Watchlists'
import { useWatchlistStoreWatchlists } from '../../stores/watchlistStore'
import { grey } from '@mui/material/colors'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel'

interface CustomTabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

interface ICustomToolbarProps extends ToolbarProps {
  onScanSymbols: () => void
}

const TabHorizontalIconLabel = ({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {icon}
    {children}
  </Box>
)

export function CustomToolbar({ onScanSymbols }: ICustomToolbarProps) {
  return (
    <Toolbar>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Tooltip title="Scan Symbols for suggestions" placement="top">
          <ToolbarButton onClick={onScanSymbols}>
            <QueryStatsIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>
        <QuickFilter expanded>
          <QuickFilterControl
            render={({ ref, ...other }) => (
              <TextField
                {...other}
                inputRef={ref}
                aria-label="Search"
                placeholder="Search..."
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: other.value ? (
                      <InputAdornment position="end">
                        <QuickFilterClear edge="end" size="small" aria-label="Clear search">
                          <CancelIcon fontSize="small" />
                        </QuickFilterClear>
                      </InputAdornment>
                    ) : null,
                    ...other.slotProps?.input,
                  },
                  ...other.slotProps,
                }}
              />
            )}
          />
        </QuickFilter>
      </Box>
    </Toolbar>
  )
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

export const SymbolTable = () => {
  const watchlists = useWatchlistStoreWatchlists()
  const { isLoading, rows } = useSymbolTable()
  const [activeIndex, setActiveIndex] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveIndex(newValue)
  }

  const watchlistsDisabled = useMemo(() => watchlists.some(({ symbols }) => symbols.length > 0) === false, [watchlists])

  return (
    <Box sx={{ height: 'inherit' }}>
      <Tabs variant="fullWidth" value={activeIndex} onChange={handleChange} aria-label="basic tabs example">
        <Tab label={<TabHorizontalIconLabel icon={<ListIcon />}>Symbols</TabHorizontalIconLabel>} />
        <Tab
          disabled={watchlistsDisabled}
          label={
            <TabHorizontalIconLabel icon={<FolderSpecialIcon color={watchlistsDisabled ? 'inherit' : 'warning'} />}>
              Watchlist
            </TabHorizontalIconLabel>
          }
        />
      </Tabs>
      <CustomTabPanel value={activeIndex} index={0}>
        <DataGrid
          showToolbar
          slots={{ toolbar: () => <CustomToolbar onScanSymbols={() => console.log('Scan Symbols')} /> }}
          density="compact"
          loading={isLoading}
          rows={rows}
          columns={columns}
        />
      </CustomTabPanel>
      <CustomTabPanel value={activeIndex} index={1}>
        <Watchlists columns={columns} />
      </CustomTabPanel>
    </Box>
  )
}
