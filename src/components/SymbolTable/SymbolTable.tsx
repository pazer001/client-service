// import { useSymbolTable } from './SymbolTable.hook.ts'
import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab, { tabClasses } from '@mui/material/Tab'
import { buttonBaseClasses } from '@mui/material/ButtonBase'
import Box from '@mui/material/Box'
import ListIcon from '@mui/icons-material/List'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material'
import { useSymbolTable } from './SymbolTable.hook'

// import AddToWatchListButton from './AddToWatchListButton/AddToWatchListButton.tsx'

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

export const SymbolTable = () => {
  const { isLoading, rows, columns } = useSymbolTable()
  const [activeIndex, setActiveIndex] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveIndex(newValue)
  }

  console.log('rows', rows)

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
        Item Two
      </CustomTabPanel>
    </Box>
  )

  // return (
  //   <>
  //     <TabView
  //       pt={{
  //         panelContainer: { className: 'px-0' },
  //       }}
  //       activeIndex={activeIndex}
  //       onTabChange={(e) => setActiveIndex(e.index)}
  //     >
  //       <TabPanel
  //         header="Symbols"
  //         pt={{
  //           content: { style: { height: 'calc(100vh - 281px' } },
  //         }}
  //       >
  //         <DataTable
  //           removableSort
  //           scrollable
  //           pt={{
  //             root: { className: 'h-full' },
  //             wrapper: { className: 'h-full' },
  //           }}
  //           paginator={symbols.length > 0}
  //           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
  //           currentPageReportTemplate="{first} to {last} of {totalRecords} Symbols"
  //           rows={200}
  //           scrollHeight={`calc(100% - 97px)`}
  //           value={symbols}
  //           loading={isLoading}
  //           resizableColumns
  //           size="small"
  //           selectionMode="single"
  //           // onSelectionChange={(e) => setSelectedSymbol(e.value as ISymbolItem[])}
  //           // selection={selectedSymbol}
  //           onRowClick={handleRowClick}
  //           // globalFilter={globalFilter}
  //           header={() => (
  //             <div className="grid gap-2">
  //               <div className="col-12 py-0 flex align-items-center gap-2">
  //                 <Button label="Lookup" icon={symbolsLooking ? 'pi pi-spin pi-spinner' : 'pi pi-play-circle'} />
  //               </div>

  //               {progress !== 0 && <ProgressBar value={progress} className="w-full ml-2 mr-2" />}
  //             </div>
  //           )}
  //         >
  //           <Column field="symbol" header="Symbol" sortable filter dataType="text" />
  //           <Column
  //             field="priorityScore.symbol"
  //             header="Score"
  //             sortable
  //             filter
  //             body={(rowData) => Math.round(rowData.priorityScore.symbol)}
  //           />
  //           <Column
  //             header="Watchlist"
  //             headerStyle={{ width: '10%', minWidth: '8rem' }}
  //             bodyStyle={{ textAlign: 'start' }}
  //             body={(rowData) => <AddToWatchListButton {...rowData} />}
  //           />
  //         </DataTable>
  //       </TabPanel>
  //       <TabPanel header="Watch list">
  //         <p className="m-0">Some content for the Watch list tab. You can add any content you want here.</p>
  //       </TabPanel>
  //     </TabView>
  //   </>
  // )
}
