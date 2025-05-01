import { useState } from 'react'
import { useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ISymbolItem } from '../../../stores/symbataStore.types'

interface IWatchlistProps {
  columns: GridColDef<ISymbolItem>[]
}

export const Watchlists = ({ columns }: IWatchlistProps) => {
  const watchlists = useWatchlistStoreWatchlists()
  const [watchlistSelectedIndex] = useState<number>(0)
  const [isLoading] = useState(false)
  // const [selectedWatchlist, setSelectedWatchlist] = useState<string>(watchlists[watchlistSelectedIndex]?.name || '')

  return (
    <DataGrid
      rows={watchlists[watchlistSelectedIndex]?.symbols}
      columns={columns}
      loading={isLoading}
      density="compact"
    />
  )
}
