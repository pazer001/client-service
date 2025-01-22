import { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { ISymbolTableProps } from './SymbolTable.tsx'
import { ISymbolItem } from './SymbolTable.interfaces.ts'
import { IAnalyzedSignalsAndLines } from '../AnalyzedResult/AnalyzedResult.interfaces.ts'

interface IReturnSymbolTableHook {
  isLoading: boolean
  symbols: ISymbolItem[]
  analyzeSymbols: () => void
  symbolsLooking: boolean
  progress: number
}
const API_HOST = import.meta.env.VITE_API_HOST

export const useSymbolTable = (props: ISymbolTableProps): IReturnSymbolTableHook => {
  const [isLoading, setIsLoading] = useState(false)
  const [symbolsLooking, setSymbolsLooking] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [symbols, setSymbols] = useState<ISymbolItem[]>([])
  const { interval } = props
  const getSymbolsList = async () => {
    setIsLoading(true)
    const supportedSymbolsResult: AxiosResponse<Array<ISymbolItem>> = await axios.get(
      `${API_HOST}/analyze/suggestedSymbols/${interval}/byProfit`,
    )
    setSymbols(supportedSymbolsResult.data)
    setIsLoading(false)
  }

  const analyzeSymbols = async () => {
    setSymbolsLooking(true)
    for (let index = 0; index < symbols.length; index++) {
      const symbol = symbols[index].symbol
      const analyzedResult = (await axios.post(`${API_HOST}/analyze/analyzedSignalsAndLines/${symbol}/${interval}`, {
        period: 'medium',
      })) as AxiosResponse<IAnalyzedSignalsAndLines>

      symbols[index].analyzedSignalsAndLines = analyzedResult.data

      setSymbols([...symbols])
      setProgress(((index + 1) / symbols.length) * 100)
    }
    setSymbolsLooking(false)
  }

  useEffect(() => {
    getSymbolsList()
  }, [])

  return {
    symbols,
    isLoading,
    analyzeSymbols,
    symbolsLooking,
    progress,
  }
}
