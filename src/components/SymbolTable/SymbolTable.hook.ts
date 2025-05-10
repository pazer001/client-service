import { useEffect, useState } from 'react'
import { EAction, ISymbolItem } from '../../stores/symbataStore.types.ts'
import { useSymbataStoreActions, useSymbataStoreSymbols } from '../../stores/symbataStore.ts'
import { GridRowsProp } from '@mui/x-data-grid'

export interface IReturnSymbolTableHook {
  isLoading: boolean
  rows: GridRowsProp<ISymbolItem>
  handleRowClick: (selectedRow: ISymbolItem, rowIndex: number) => Promise<void>
}

export const useSymbolTable = (): IReturnSymbolTableHook => {
  const [isLoading, setIsLoading] = useState(false)
  const rows: GridRowsProp<ISymbolItem> = useSymbataStoreSymbols()
  const { getSuggestedSymbols, setSymbol, getRecommendation, setSymbols } = useSymbataStoreActions()

  const handleRowClick = async (selectedRow: ISymbolItem, rowIndex: number) => {
    const copiedRows: ISymbolItem[] = [...rows]
    copiedRows[rowIndex] = { ...selectedRow, loading: true }

    setSymbols(copiedRows)

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
      }
      setSymbol(symbol) // Set the selected symbol in the store
    }
  }

  useEffect(() => {
    if (rows.length) return
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
    handleRowClick,
  }
}
