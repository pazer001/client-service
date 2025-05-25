import { DataGrid, GridColDef, GridSlotsComponent } from '@mui/x-data-grid'
import { SymbolsTableCustomToolbar } from './SymbolsTableCustomToolbar.tsx'
import { useEffect, useState } from 'react'
import { EAction, ISymbolItem } from '../../../stores/symbataStore.types.ts'
import { useSymbataStoreActions, useSymbataStoreSymbols } from '../../../stores/symbataStore.ts'
import { GridCallbackDetails, GridRowSelectionModel, GridRowsProp } from '@mui/x-data-grid'
import { useWatchlistStoreActions } from '../../../stores/watchlistStore.ts'

interface ISymbolTableProps {
  columns: GridColDef<ISymbolItem>[]
}

const symbolsToScan = 200

export const SymbolsTable = ({ columns }: ISymbolTableProps) => {
  const { updateSymbolInList } = useSymbataStoreActions()
  const [isLoading, setIsLoading] = useState(false)
  const rows: GridRowsProp<ISymbolItem> = useSymbataStoreSymbols()
  const { getSuggestedSymbols, setSymbol, getRecommendation, setSymbols } = useSymbataStoreActions()
  const { updateSymbolInCurrentWatchlist } = useWatchlistStoreActions()

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

  useEffect(() => {
    if (rows.length) return
    const getSymbolsList = async () => {
      setIsLoading(true)
      await getSuggestedSymbols()
      setIsLoading(false)
    }

    void getSymbolsList()
  }, [])

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
