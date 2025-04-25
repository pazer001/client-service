import { useEffect, useState } from 'react'
import { ISymbolItem } from '../../stores/symbataStore.types.ts'
import { useSymbataStoreActions, useSymbataStoreSymbols } from '../../stores/symbataStore.ts'
import { DataTableRowClickEvent } from 'primereact/datatable'

export interface IReturnSymbolTableHook {
  isLoading: boolean
  symbols: ISymbolItem[]
  symbolsLooking: boolean
  progress: number
  handleRowClick: (e: DataTableRowClickEvent) => Promise<void>
}

export const useSymbolTable = (): IReturnSymbolTableHook => {
  const [isLoading, setIsLoading] = useState(false)
  const [symbolsLooking] = useState<boolean>(false)
  const [progress] = useState<number>(0)
  const symbols = useSymbataStoreSymbols()
  const { getSuggestedSymbols, setSymbol, getRecommendation } = useSymbataStoreActions()

  const getSymbolsList = async () => {
    setIsLoading(true)
    await getSuggestedSymbols()
    setIsLoading(false)
  }

  const handleRowClick = async (e: DataTableRowClickEvent) => {
    const selectedRow = e.data as ISymbolItem // Cast the data to ISymbolItem type

    const recommendation = await getRecommendation(selectedRow) // Fetch recommendation for the selected symbol
    const symbol = { ...selectedRow, recommendation } // Combine selected row with recommendation
    setSymbol(symbol) // Set the selected symbol in the store
  }

  useEffect(() => {
    getSymbolsList()
  }, [])

  return {
    symbols,
    isLoading,
    symbolsLooking,
    progress,
    handleRowClick,
  }
}
