import { DataTable } from 'primereact/datatable'
import { useSymbolTable } from './SymbolTable.hook.ts'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { useState } from 'react'
import { TabPanel, TabView } from 'primereact/tabview'
import AddToWatchListButton from './AddToWatchListButton/AddToWatchListButton.tsx'

export const SymbolTable = () => {
  const { isLoading, symbolsLooking, progress, symbols, handleRowClick } = useSymbolTable()
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <TabView
        pt={{
          panelContainer: { className: 'px-0' },
        }}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel
          header="Symbols"
          pt={{
            content: { style: { height: 'calc(100vh - 281px' } },
          }}
        >
          <DataTable
            removableSort
            scrollable
            pt={{
              root: { className: 'h-full' },
              wrapper: { className: 'h-full' },
            }}
            paginator={symbols.length > 0}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate="{first} to {last} of {totalRecords} Symbols"
            rows={200}
            scrollHeight={`calc(100% - 97px)`}
            value={symbols}
            loading={isLoading}
            resizableColumns
            size="small"
            selectionMode="single"
            // onSelectionChange={(e) => setSelectedSymbol(e.value as ISymbolItem[])}
            // selection={selectedSymbol}
            onRowClick={handleRowClick}
            // globalFilter={globalFilter}
            filterDelay={400}
            header={() => (
              <div className="grid gap-2">
                <div className="col-12 py-0 flex align-items-center gap-2">
                  <Button label="Lookup" icon={symbolsLooking ? 'pi pi-spin pi-spinner' : 'pi pi-play-circle'} />
                </div>

                {progress !== 0 && <ProgressBar value={progress} className="w-full ml-2 mr-2" />}
              </div>
            )}
          >
            <Column field="symbol" header="Symbol" sortable filter dataType="text" />
            <Column
              field="priorityScore.symbol"
              header="Score"
              sortable
              filter
              body={(rowData) => Math.round(rowData.priorityScore.symbol)}
            />
            <Column
              header="Watchlist"
              headerStyle={{ width: '10%', minWidth: '8rem' }}
              bodyStyle={{ textAlign: 'start' }}
              body={(rowData) => <AddToWatchListButton {...rowData} />}
            />
          </DataTable>
        </TabPanel>
        <TabPanel header="Watch list">
          <p className="m-0">Some content for the Watch list tab. You can add any content you want here.</p>
        </TabPanel>
      </TabView>
    </>
  )
}
