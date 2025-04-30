import { useEffect, useState } from 'react'
import { IPriorityScore, ISymbolItem } from '../../stores/symbataStore.types.ts'
import { useSymbataStoreActions, useSymbataStoreSymbols } from '../../stores/symbataStore.ts'
import { GridColDef, GridRowsProp } from '@mui/x-data-grid'
import AddToWatchListButton from './AddToWatchListButton/AddToWatchListButton'

export interface IReturnSymbolTableHook {
  isLoading: boolean
  rows: GridRowsProp<ISymbolItem>
  symbolsLooking: boolean
  progress: number
  columns: GridColDef<ISymbolItem>[]
  handleRowClick: (selectedRow: ISymbolItem) => Promise<void>
}

const columns: GridColDef<ISymbolItem>[] = [
  { field: 'symbol', headerName: 'Symbol' },
  {
    field: 'priorityScore',
    headerName: 'Priority Score',
    valueGetter: (priorityScore: IPriorityScore) => {
      return priorityScore.symbol
    },
    renderCell: (params) => params.row.priorityScore.symbol,
  },
  {
    field: 'watchlist',
    headerName: 'Watchlist',
    renderCell: AddToWatchListButton,
  },
]

export const useSymbolTable = (): IReturnSymbolTableHook => {
  const [isLoading, setIsLoading] = useState(false)
  const [symbolsLooking] = useState<boolean>(false)
  const [progress] = useState<number>(0)
  const rows: GridRowsProp<ISymbolItem> = useSymbataStoreSymbols()
  const { getSuggestedSymbols, setSymbol, getRecommendation } = useSymbataStoreActions()

  const handleRowClick = async (selectedRow: ISymbolItem) => {
    const recommendation = await getRecommendation(selectedRow) // Fetch recommendation for the selected symbol
    const symbol = { ...selectedRow, recommendation } // Combine selected row with recommendation
    setSymbol(symbol) // Set the selected symbol in the store
  }

  useEffect(() => {
    const getSymbolsList = async () => {
      setIsLoading(true)
      await getSuggestedSymbols()
      setIsLoading(false)
    }

    getSymbolsList()
  }, [])

  return {
    columns,
    rows,
    isLoading,
    symbolsLooking,
    progress,
    handleRowClick,
  }
}
