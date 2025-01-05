import { DataTable } from 'primereact/datatable'
import { ISymbol } from '../../stores/symbolStore'
import { useSymbolTable } from './SymbolTable.hooks'

import './SymbolTable.css'
import { Column } from 'primereact/column'
import { Avatar } from 'primereact/avatar'

export const SymbolTable = () => {
  const { isLoading, data } = useSymbolTable()

  const symbolCell = (rowData: ISymbol): React.ReactNode => {
    return (
      <div className="flex align-items-center gap-2">
        <Avatar image={rowData.logo} shape="circle" />
        <span>{rowData.symbol}</span>
      </div>
    )
  }

  return (
    <DataTable
      scrollable
      style={{ height: 'calc(100vh - 23px)' }}
      paginator={data.length > 0}
      rows={100}
      scrollHeight="calc(100vh - 75px)"
      value={data}
      loading={isLoading}
      resizableColumns
      columnResizeMode="expand"
    >
      <Column field="symbol" header="Symbol" body={symbolCell} />
      <Column field="marketCapitalization" header="Market Cap" />
      <Column field="priorityScore" header="Score" />
    </DataTable>
  )
}
