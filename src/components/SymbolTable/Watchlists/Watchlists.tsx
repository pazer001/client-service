import { useMemo, useState } from 'react'
import { useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ISymbolItem } from '../../../stores/symbataStore.types'

interface IWatchlistProps {
  columns: GridColDef<ISymbolItem>[]
}

const watchlistExcludedColumns = ['watchlist']

export const Watchlists = ({ columns }: IWatchlistProps) => {
  const watchlists = useWatchlistStoreWatchlists()
  const [watchlistSelectedIndex] = useState<number>(0)
  const [isLoading] = useState(false)

  const watchlistColumns = useMemo(
    () => columns.filter((column) => !watchlistExcludedColumns.includes(column.field)),
    [],
  )

  return (
    <DataGrid
      rows={watchlists[watchlistSelectedIndex]?.symbols}
      columns={watchlistColumns}
      loading={isLoading}
      density="compact"
    />
  )
}
