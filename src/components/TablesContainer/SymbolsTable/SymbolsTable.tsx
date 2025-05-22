import { DataGrid, GridCallbackDetails, GridColDef, GridRowSelectionModel, GridSlotsComponent } from '@mui/x-data-grid'
import { useSymbolTable } from './SymbolsTable.hook.ts'
import { ISymbolItem } from '../../../stores/symbataStore.types.ts'
import { useSymbataStoreActions } from '../../../stores/symbataStore.ts'
import { SymbolsTableCustomToolbar } from './SymbolsTableCustomToolbar/SymbolsTableCustomToolbar.tsx'

interface ISymbolTableProps {
  columns: GridColDef<ISymbolItem>[]
}

const symbolsToScan = 200

export const SymbolsTable = ({ columns }: ISymbolTableProps) => {
  const { isLoading, rows, handleRowClick } = useSymbolTable()
  const { updateSymbolInList } = useSymbataStoreActions()

  const onRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    const rowId = Array.from(rowSelectionModel.ids)[0]
    if (rowId) {
      const selectedRow = details.api.getRow(rowId)
      const rowIndex = rows.findIndex(({ id }) => id === rowId)

      if (rowIndex !== undefined) {
        void handleRowClick(selectedRow, rowIndex)
      }
    }
  }

  const slots: Partial<GridSlotsComponent> = {
    toolbar: () => (
      <SymbolsTableCustomToolbar
        rows={rows}
        symbolsToScan={symbolsToScan}
        updateSymbolInList={updateSymbolInList}
      />
    ),
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={isLoading}
      density="compact"
      slots={slots}
      showToolbar
      onRowSelectionModelChange={onRowSelectionModelChange}
    />
  )
}
