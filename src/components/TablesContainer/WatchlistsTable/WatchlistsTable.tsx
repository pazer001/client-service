import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridRowSelectionModel,
  GridRowsProp,
  GridSlotsComponent,
} from '@mui/x-data-grid'
import { useMemo } from 'react'
import { useSymbataStoreActions, useSymbataStoreSymbols } from '../../../stores/symbataStore.ts'
import { ISymbolItem } from '../../../stores/symbataStore.types.ts'
import { useWatchlistStoreActions, useWatchlistStoreCurrentWatchlist } from '../../../stores/watchlistStore.ts'
import { initErrorRecommendation } from '../TablesContainer.tsx'
import { WatchlistCustomToolbar } from './WatchlistsCustomToolbar.tsx'

interface IWatchlistProps {
  columns: GridColDef<ISymbolItem>[]
}

const watchlistExcludedColumns = ['watchlist']

export const WatchlistsTable = ({ columns }: IWatchlistProps) => {
  const { updateSymbolInCurrentWatchlist } = useWatchlistStoreActions()
  const watchlist = useWatchlistStoreCurrentWatchlist()
  const symbolsRows: GridRowsProp<ISymbolItem> = useSymbataStoreSymbols()
  const watchlistRows = watchlist?.symbols || []
  const { setSymbol, getRecommendation, setSymbols } = useSymbataStoreActions()

  const watchlistColumns = useMemo(
    () => columns.filter((column) => !watchlistExcludedColumns.includes(column.field)),
    [],
  )

  const handleRowClick = async (selectedRow: ISymbolItem, watchlistRowIndex: number, symbolsRowIndex: number) => {
    const loadingRow = { ...selectedRow, loading: true }
    const updateSymbols = (symbol: ISymbolItem) => {
      const symbolsCopiedRows: ISymbolItem[] = [...symbolsRows]
      symbolsCopiedRows[symbolsRowIndex] = symbol

      setSymbols(symbolsCopiedRows)
      updateSymbolInCurrentWatchlist(symbol)
    }

    updateSymbols(loadingRow)

    let symbol: ISymbolItem = selectedRow
    try {
      const recommendation = await getRecommendation(selectedRow) // Fetch recommendation for the selected symbol

      symbol = { ...selectedRow, recommendation, loading: false } // Combine selected row with recommendation
    } catch {
      symbol = {
        ...selectedRow,
        recommendation: initErrorRecommendation,
        loading: false,
      }
    } finally {
      if (watchlistRowIndex !== undefined) {
        updateSymbols(symbol)
      }
      setSymbol(symbol) // Set the selected symbol in the store
    }
  }

  const onRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    const rowId = Array.from(rowSelectionModel.ids)[0]
    if (rowId) {
      const selectedRow = details.api.getRow(rowId)
      const watchlistRowIndex = watchlistRows.findIndex(({ id }) => id === rowId)
      const symbolsRowIndex = symbolsRows.findIndex(({ id }) => id === selectedRow.id)

      if (watchlistRowIndex !== undefined) {
        void handleRowClick(selectedRow, watchlistRowIndex, symbolsRowIndex)
      }
    }
  }

  const slots: Partial<GridSlotsComponent> = {
    toolbar: () => (
      <WatchlistCustomToolbar
        rows={watchlistRows}
        symbolsToScan={watchlistRows.length}
        updateSymbolInList={updateSymbolInCurrentWatchlist}
      />
    ),
  }

  return (
    <DataGrid
      rows={watchlistRows}
      columns={watchlistColumns}
      density="compact"
      slots={slots}
      showToolbar
      onRowSelectionModelChange={onRowSelectionModelChange}
    />
  )
}
