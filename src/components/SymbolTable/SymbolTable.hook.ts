import { useEffect, useState } from 'react'
import { ISymbolItem } from '../../stores/symbataStore.types.ts'
import { useSymbataStoreActions, useSymbataStoreSymbols } from '../../stores/symbataStore.ts'
import { GridRowsProp } from '@mui/x-data-grid'

export interface IReturnSymbolTableHook {
  isLoading: boolean
  rows: GridRowsProp<ISymbolItem>
  symbolsLooking: boolean
  progress: number
  handleRowClick: (selectedRow: ISymbolItem) => Promise<void>
}

export const useSymbolTable = (): IReturnSymbolTableHook => {
  const [isLoading, setIsLoading] = useState(false)
  const [symbolsLooking] = useState<boolean>(false)
  const [progress] = useState<number>(0)
  const rows: GridRowsProp<ISymbolItem> = useSymbataStoreSymbols()
  const { getSuggestedSymbols, setSymbol, getRecommendation } = useSymbataStoreActions()

  const handleRowClick = async (selectedRow: ISymbolItem) => {
    const recommendation = await getRecommendation(selectedRow) // Fetch recommendation for the selected symbol
    const symbol = { ...selectedRow, recommendation } // Combine selected row with recommendation
    console.log('symbol', symbol)

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
    rows,
    isLoading,
    symbolsLooking,
    progress,
    handleRowClick,
  }
}
