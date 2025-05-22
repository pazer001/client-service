import { useWatchlistStoreActions } from '../../../stores/watchlistStore'
import { DataGrid, GridColDef, GridSlotsComponent } from '@mui/x-data-grid'
import { ISymbolItem } from '../../../stores/symbataStore.types'
import { WatchlistCustomToolbar } from './WatchlistsCustomToolbar/WatchlistsCustomToolbar'
import { useWatchlists } from './WatchlistsTable.hook.ts'

interface IWatchlistProps {
  columns: GridColDef<ISymbolItem>[]
}

export const WatchlistsTable = ({ columns }: IWatchlistProps) => {
  const { rows, watchlistColumns, onRowSelectionModelChange } = useWatchlists({ columns })
  const { updateSymbolInCurrentWatchlist } = useWatchlistStoreActions()

  const slots: Partial<GridSlotsComponent> = {
    toolbar: () => (
      <WatchlistCustomToolbar
        rows={rows}
        symbolsToScan={rows.length}
        updateSymbolInList={updateSymbolInCurrentWatchlist}
      />
    ),
  }

  return (
    <DataGrid
      rows={rows}
      columns={watchlistColumns}
      density="compact"
      slots={slots}
      showToolbar
      onRowSelectionModelChange={onRowSelectionModelChange}
    />
  )
}
