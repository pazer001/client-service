import { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { ISymbol } from '../../stores/symbolStore'
import { useSymbolTable } from './SymbolTable.hooks'

import './SymbolTable.css'
import { Column } from 'primereact/column'
import { Avatar } from 'primereact/avatar'
import { InputText } from 'primereact/inputtext'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'

export const SymbolTable = () => {
  const { isLoading, data, tableHeaderHeight } = useSymbolTable()
  const [selectedSymbol, setSelectedSymbol] = useState<ISymbol[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')

  const symbolCell = (rowData: ISymbol): React.ReactNode => {
    return (
      <div className="flex align-items-center gap-2">
        <Avatar image={rowData.logo} label={rowData.symbol.slice(0, 1).toUpperCase()} shape="circle" />
        <span>{rowData.symbol}</span>
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <IconField iconPosition="left" className="w-full">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          className="w-full"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </IconField>
    )
  }

  return (
    <DataTable
      scrollable
      style={{ height: `calc(100vh - 23px - ${tableHeaderHeight}px)` }}
      paginator={data.length > 0}
      rows={100}
      scrollHeight={`calc(100vh - 75px - ${tableHeaderHeight}px)`}
      value={data}
      loading={isLoading}
      resizableColumns
      size="small"
      selectionMode={'multiple'}
      onSelectionChange={(e) => setSelectedSymbol(e.value as ISymbol[])}
      selection={selectedSymbol}
      header={renderHeader()}
      globalFilter={globalFilter}
      filterDelay={400}
    >
      <Column selectionMode="multiple"></Column>
      <Column field="symbol" header="Symbol" body={symbolCell} />
      <Column field="marketCapitalization" header="Market Cap" />
      <Column field="priorityScore" header="Score" />
    </DataTable>
  )
}
