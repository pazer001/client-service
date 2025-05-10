import { DataGrid, GridCallbackDetails, GridColDef, GridRowSelectionModel, GridSlotsComponent } from '@mui/x-data-grid'
import { useSymbolTable } from './SymbolTable.hook'
import { ISymbolItem } from '../../stores/symbataStore.types'
import { useSymbataStoreActions } from './../../stores/symbataStore'
import { TableCustomToolbar } from './TableCustomToolbar/TableCustomToolbar'

interface ISymbolTableProps {
  columns: GridColDef<ISymbolItem>[]
}

const symbolsToScan = 200

export const SymbolTable = ({ columns }: ISymbolTableProps) => {
  const { isLoading, rows, handleRowClick } = useSymbolTable()
  const { updateSymbolInList } = useSymbataStoreActions()

  const onRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    const rowId = Array.from(rowSelectionModel.ids)[0]
    if (rowId) {
      const selectedRow = details.api.getRow(rowId)
      const rowIndex = rows.findIndex(({ id }) => id === rowId)

      if (rowIndex !== undefined) {
        handleRowClick(selectedRow, rowIndex)
      }
    }
  }

  const slots: Partial<GridSlotsComponent> = {
    toolbar: () => (
      <TableCustomToolbar rows={rows} symbolsToScan={symbolsToScan} updateSymbolInList={updateSymbolInList} />
    ),
  }

  return (
    <DataGrid
      showToolbar
      slots={slots}
      density="compact"
      loading={isLoading}
      rows={rows}
      columns={columns}
      onRowSelectionModelChange={onRowSelectionModelChange}
    />
  )
}
