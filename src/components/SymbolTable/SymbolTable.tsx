// import { useSymbolTable } from './SymbolTable.hook.ts'
import { useMemo, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab, { tabClasses, TabProps } from '@mui/material/Tab'
import { buttonBaseClasses } from '@mui/material/ButtonBase'
import Box from '@mui/material/Box'
import ListIcon from '@mui/icons-material/List'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { styled } from '@mui/material'
import { useSymbolTable } from './SymbolTable.hook'
import { IPriorityScore, ISymbolItem } from '../../stores/symbataStore.types'
import AddToWatchListButton from './AddToWatchListButton/AddToWatchListButton'
import { Watchlists } from './Watchlists/Watchlists'
import { useWatchlistStoreWatchlists } from '../../stores/watchlistStore'
import { grey } from '@mui/material/colors'

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
        <Box sx={{ pt: 1, boxShadow: `0px -1px 0px 0px ${grey[500]}`, height: 'calc(100vh - 130px)' }}>{children}</Box>
      )}
    </Box>
  )
}
// also from MUI documentation
function a11yProps(index: number) {
  return {
    id: `table-tab-${index}`,
    'aria-controls': `table-tabpanel-${index}`,
  }
}

// tabs with icons are too big by default, so we need to override the default styles
const TabStyled = styled(Tab)<TabProps>(() => {
  return {
    [`&.${buttonBaseClasses.root}.${tabClasses.root}`]: {
      minHeight: '49px',
    },
  }
})

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
        <TabStyled iconPosition="start" icon={<ListIcon />} label="Symbols" {...a11yProps(0)} />
        <TabStyled
          disabled={watchlistsDisabled}
          iconPosition="start"
          icon={<FolderSpecialIcon color={watchlistsDisabled ? 'inherit' : 'warning'} />}
          label="Watchlist"
          {...a11yProps(1)}
        />
      </Tabs>
      <CustomTabPanel value={activeIndex} index={0}>
        <DataGrid density="compact" loading={isLoading} rows={rows} columns={columns} />
      </CustomTabPanel>
      <CustomTabPanel value={activeIndex} index={1}>
        <Watchlists columns={columns} />
      </CustomTabPanel>
    </Box>
  )
}
