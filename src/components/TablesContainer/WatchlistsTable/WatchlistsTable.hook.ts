import { useWatchlistStoreCurrentWatchlist } from '../../../stores/watchlistStore.ts'
import { useMemo } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { ISymbolItem } from '../../../stores/symbataStore.types.ts'

interface IUseWatchlistProps {
  columns: GridColDef<ISymbolItem>[]
}

const watchlistExcludedColumns = ['watchlist']

export const useWatchlists = ({columns}:IUseWatchlistProps) => {
  const currentWatchlist = useWatchlistStoreCurrentWatchlist()
  const rows = currentWatchlist?.symbols || []
  const watchlistColumns = useMemo(
    () => columns.filter((column) => !watchlistExcludedColumns.includes(column.field)),
    [],
  )

  return {
    rows,
    watchlistColumns
  }
}