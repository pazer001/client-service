import { useState, useEffect } from 'react'
import { DataTable, DataTableFilterMeta } from 'primereact/datatable'
import { ISymbol } from '../../stores/symbolStore'
import { useSymbolTable } from './SymbolTable.hooks'

import './SymbolTable.css'
import { Column } from 'primereact/column'
import { Avatar } from 'primereact/avatar'
import { InputText } from 'primereact/inputtext'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { useDebounce } from '../../hooks/useDebouce'
import { Watchlist } from './Watchlist/Watchlist'

const MIN_VOLUME = 500000

export const SymbolTable = () => {
  const { isLoading, data, tableHeaderHeight } = useSymbolTable()
  const [selectedSymbol, setSelectedSymbol] = useState<ISymbol[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue, 150)
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    averageVolume: { value: MIN_VOLUME, operator: 'gt', constraints: [{ value: MIN_VOLUME, matchMode: 'gt' }] },
  })

  useEffect(() => {
    setGlobalFilter(debouncedSearch)
  }, [debouncedSearch])

  return (
    <DataTable
      removableSort
      scrollable
      style={{ height: `calc(100dvh - 50px)`, display: 'flex', flexDirection: 'column' }}
      paginator={data.length > 0}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      currentPageReportTemplate="{first} to {last} of {totalRecords} Symbols"
      rows={200}
      scrollHeight={`calc(100dvh - 75px - ${tableHeaderHeight}px)`}
      value={data}
      loading={isLoading}
      resizableColumns
      size="small"
      selectionMode={'multiple'}
      onSelectionChange={(e) => setSelectedSymbol(e.value as ISymbol[])}
      selection={selectedSymbol}
      globalFilter={globalFilter}
      filterDelay={400}
      filters={filters}
      onFilter={(e) => setFilters(e.filters)}
      header={() => {
        return (
          <div className="grid gap-2">
            <div className="col-12 pb-0">
              <Watchlist />
            </div>
            <div className="col-12 py-0">
              <IconField iconPosition="left" className="w-full">
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText
                  className="w-full"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search..."
                />
              </IconField>
            </div>
          </div>
        )
      }}
    >
      <Column
        selectionMode="multiple"
        resizeable={false}
        frozen
        style={{ width: '40px !important', maxWidth: '40px !important' }}
      ></Column>
      <Column
        field="symbol"
        header="Symbol"
        body={(rowData: ISymbol): React.ReactNode => {
          return (
            <div className="flex align-items-center gap-2">
              <Avatar image={rowData.logo} label={rowData.symbol.slice(0, 1).toUpperCase()} shape="circle" />
              <span>{rowData.symbol}</span>
            </div>
          )
        }}
        resizeable={false}
        frozen
        sortable
        filter
        style={{ width: '96px' }}
      />
      <Column field="marketCapitalization" header="Market Cap" sortable filter />
      <Column
        field="averageVolume"
        header="Avg Volume"
        sortable
        filter
        filterPlaceholder="Less than 50000"
        dataType="numeric"
      />
      <Column field="priorityScore" header="Score" sortable filter />
    </DataTable>
  )
}
