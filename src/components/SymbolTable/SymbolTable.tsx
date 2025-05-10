import { DataGrid, GridCallbackDetails, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { useSymbolTable } from './SymbolTable.hook'
import { ISymbolItem } from '../../stores/symbataStore.types'
import { useSymbataStoreActions } from './../../stores/symbataStore'
import { TableCustomToolbar } from './TableCustomToolbar/TableCusomToolbar'

interface ISymbolTableProps {
  columns: GridColDef<ISymbolItem>[]
}

const chunksOf = 200

export const SymbolTable = ({ columns }: ISymbolTableProps) => {
  const { isLoading, rows, handleRowClick } = useSymbolTable()
  const { updateSymbolInList } = useSymbataStoreActions()

  const onRowSelectionModelChange = (newRowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    const rowId = Array.from(newRowSelectionModel.ids)[0]
    if (rowId) {
      const rowIndex = rows.findIndex((row) => row.id === rowId)
      if (rowIndex !== undefined) {
        const selectedRow = details.api.getRow(rowId)
        handleRowClick(selectedRow, rowIndex)
      }
    }
  }

  return (
    <DataGrid
      showToolbar
      slots={{
        toolbar: () => <TableCustomToolbar rows={rows} chunksOf={chunksOf} updateSymbolInList={updateSymbolInList} />,
      }}
      density="compact"
      loading={isLoading}
      rows={rows}
      columns={columns}
      onRowSelectionModelChange={onRowSelectionModelChange}
    />
  )
}
