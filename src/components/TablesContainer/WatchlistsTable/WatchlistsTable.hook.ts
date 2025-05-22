import { useWatchlistStoreActions, useWatchlistStoreCurrentWatchlist } from '../../../stores/watchlistStore.ts'
import { useMemo } from 'react'
import { GridCallbackDetails, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { EAction, ISymbolItem } from '../../../stores/symbataStore.types.ts'
import { useSymbataStoreActions } from '../../../stores/symbataStore.ts'

interface IUseWatchlistProps {
  columns: GridColDef<ISymbolItem>[]
}

const watchlistExcludedColumns = ['watchlist']

export const useWatchlists = ({columns}:IUseWatchlistProps) => {
  const currentWatchlist = useWatchlistStoreCurrentWatchlist()
  const rows = currentWatchlist?.symbols || []
  const { setSymbol, getRecommendation, setSymbols } = useSymbataStoreActions()
  const { updateSymbolInCurrentWatchlist } = useWatchlistStoreActions()

  const watchlistColumns = useMemo(
    () => columns.filter((column) => !watchlistExcludedColumns.includes(column.field)),
    [],
  )

  const handleRowClick = async (selectedRow: ISymbolItem, rowIndex: number) => {
    const copiedRows: ISymbolItem[] = [...rows]
    copiedRows[rowIndex] = { ...selectedRow, loading: true }
    setSymbols(copiedRows)
    updateSymbolInCurrentWatchlist({ ...selectedRow, loading: true })

    let symbol: ISymbolItem = selectedRow
    try {
      const recommendation = await getRecommendation(selectedRow) // Fetch recommendation for the selected symbol

      symbol = { ...selectedRow, recommendation, loading: false } // Combine selected row with recommendation
    } catch {
      symbol = {
        ...selectedRow,
        recommendation: {
          action: EAction.ERROR,
          stopLoss: 0,
          riskCapitalPercent: 0,
          usedStrategy: '',
        },
        loading: false,
      } // Combine selected row with
    } finally {
      if (rowIndex !== undefined) {
        const copiedRows: ISymbolItem[] = [...rows]
        copiedRows[rowIndex] = symbol
        setSymbols(copiedRows) // Update the rows in the store with the new symbol
        updateSymbolInCurrentWatchlist(symbol) // Update the symbol in the current watchlist
      }
      setSymbol(symbol) // Set the selected symbol in the store
    }
  }


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

  return {
    rows,
    watchlistColumns,
    handleRowClick,
    onRowSelectionModelChange
  }
}