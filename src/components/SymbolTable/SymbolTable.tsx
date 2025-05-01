// import { useSymbolTable } from './SymbolTable.hook.ts'
import { ReactNode, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab, { tabClasses } from '@mui/material/Tab'
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

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

// this is an example code from MUI documentation
// https://mui.com/material-ui/react-tabs/#introduction (first example)
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Box
      sx={{ height: 'calc(100% - 50px)' }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, paddingTop: 1, height: '100%', maxHeight: 'calc(100vh - 130px)' }}>{children}</Box>
      )}
    </Box>
  )
}
// also from MUI documentation
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

// tabs with icons are too big by default, so we need to override the default styles
const TabStyled = styled(Tab)(() => ({
  [`&.${buttonBaseClasses.root}.${tabClasses.root}`]: {
    minHeight: '49px',
  },
}))

export const columns: GridColDef<ISymbolItem>[] = [
  { field: 'symbol', headerName: 'Symbol' },
  {
    field: 'priorityScore',
    headerName: 'Priority Score',
    valueGetter: (priorityScore: IPriorityScore) => {
      return priorityScore.symbol
    },
    renderCell: (params) => params.row.priorityScore.symbol,
  },
  {
    field: 'watchlist',
    headerName: 'Watchlist',
    renderCell: (params: GridRenderCellParams<ISymbolItem>): ReactNode => {
      const symbol: ISymbolItem = params.row
      return <AddToWatchListButton {...symbol} />
    },
  },
]

export const SymbolTable = () => {
  const { isLoading, rows } = useSymbolTable()
  const [activeIndex, setActiveIndex] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveIndex(newValue)
  }

  return (
    <Box sx={{ height: 'inherit' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs variant="fullWidth" value={activeIndex} onChange={handleChange} aria-label="basic tabs example">
          <TabStyled iconPosition="start" icon={<ListIcon />} label="Symbols" {...a11yProps(0)} />
          <TabStyled iconPosition="start" icon={<FolderSpecialIcon />} label="Watchlist" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={activeIndex} index={0}>
        <DataGrid density="compact" loading={isLoading} rows={rows} columns={columns} />
      </CustomTabPanel>
      <CustomTabPanel value={activeIndex} index={1}>
        <Watchlists columns={columns} />
      </CustomTabPanel>
    </Box>
  )
}
