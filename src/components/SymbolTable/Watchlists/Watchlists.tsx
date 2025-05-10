import { useMemo, useState } from 'react'
import { useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'
import { DataGrid, GridCallbackDetails, GridColDef, GridRowSelectionModel, GridSlotsComponent } from '@mui/x-data-grid'
import { ISymbolItem } from '../../../stores/symbataStore.types'
import { useSymbolTable } from '../SymbolTable.hook'
import { WatchlistCustomToolbar } from './WatchlistsCustomToolbar/WatchlistsCustomToolbar'

interface IWatchlistProps {
  columns: GridColDef<ISymbolItem>[]
}

const watchlistExcludedColumns = ['watchlist']

export const Watchlists = ({ columns }: IWatchlistProps) => {
  const { handleRowClick } = useSymbolTable()
  const watchlists = useWatchlistStoreWatchlists()
  const { updateSymbolInList } = useWatchlistStoreActions()
  const [watchlistSelectedIndex] = useState<number>(0)
  const [isLoading] = useState(false)

  const rows = watchlists[watchlistSelectedIndex]?.symbols

  const watchlistColumns = useMemo(
    () => columns.filter((column) => !watchlistExcludedColumns.includes(column.field)),
    [],
  )

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
      <WatchlistCustomToolbar rows={rows} symbolsToScan={rows.length} updateSymbolInList={updateSymbolInList} />
    ),
  }

  return (
    <DataGrid
      rows={rows}
      columns={watchlistColumns}
      loading={isLoading}
      density="compact"
      slots={slots}
      showToolbar
      onRowSelectionModelChange={onRowSelectionModelChange}
    />
  )
}
