import { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { useSymbolTable } from './SymbolTable.hook.ts'

import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { Button } from 'primereact/button'
import { Watchlist } from './Watchlist/Watchlist'
import { useSymbataStore } from '../../stores/symbataStore.ts'
import { ProgressBar } from 'primereact/progressbar'
import millify from 'millify'

export const SymbolTable = () => {
  const { isLoading, symbols, symbolsLooking, progress } = useSymbolTable()
  const { setSymbol } = useSymbataStore()
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value)
  }

  return (
    <DataTable
      removableSort
      showGridlines
      scrollable
      pt={{
        root: { className: 'h-full' },
        wrapper: { className: 'h-full' },
      }}
      paginator={symbols.length > 0}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      currentPageReportTemplate="{first} to {last} of {totalRecords} Symbols"
      rows={200}
      scrollHeight={`calc(100% - 155px)`}
      value={symbols}
      loading={isLoading}
      resizableColumns
      size="small"
      selectionMode="single"
      // onSelectionChange={(e) => setSelectedSymbol(e.value as ISymbolItem[])}
      // selection={selectedSymbol}
      onRowClick={(e) => setSymbol(e.data.symbol)}
      globalFilter={globalFilter}
      filterDelay={400}
      header={() => (
        <div className="grid gap-2">
          <div className="col-12 pb-0">
            <Watchlist />
          </div>
          <div className="col-12 py-0 flex align-items-center gap-2">
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilter} onChange={handleSearchChange} placeholder="Search..." />
            </IconField>
            <Button label="Lookup" icon={symbolsLooking ? 'pi pi-spin pi-spinner' : 'pi pi-play-circle'} />
          </div>

          {progress !== 0 && <ProgressBar value={progress} className="w-full ml-2 mr-2" />}
        </div>
      )}
    >
      <Column field="symbol" header="Symbol" sortable filter dataType="text" />
      <Column
        field="averageVolume"
        header="Avg Volume"
        sortable
        filter
        filterPlaceholder="Less than 50000"
        dataType="numeric"
        body={(rowData) => millify(rowData.averageVolume)}
      />
      <Column
        field="priorityScore.symbol"
        header="Score"
        sortable
        filter
        body={(rowData) => Math.round(rowData.priorityScore.symbol)}
      />
    </DataTable>
  )
}
