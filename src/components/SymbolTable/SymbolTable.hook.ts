import { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { ISymbolItem } from './SymbolTable.interfaces.ts'

interface IReturnSymbolTableHook {
  isLoading: boolean
  symbols: ISymbolItem[]
  symbolsLooking: boolean
  progress: number
}
const API_HOST = import.meta.env.VITE_API_HOST

export const useSymbolTable = (): IReturnSymbolTableHook => {
  const [isLoading, setIsLoading] = useState(false)
  const [symbolsLooking] = useState<boolean>(false)
  const [progress] = useState<number>(0)
  const [symbols, setSymbols] = useState<ISymbolItem[]>([])
  const getSymbolsList = async () => {
    setIsLoading(true)
    const supportedSymbolsResult: AxiosResponse<Array<ISymbolItem>> = await axios.get(
      `${API_HOST}/analyze/suggestedSymbols`,
    )
    setSymbols(supportedSymbolsResult.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getSymbolsList()
  }, [])

  return {
    symbols,
    isLoading,
    symbolsLooking,
    progress,
  }
}
