import { GridRowsProp } from '@mui/x-data-grid'
import { chunk } from 'lodash'
import { useMemo, useState } from 'react'
import { useSymbataStoreActions } from '../stores/symbataStore.ts'
import { ISymbolItem } from '../stores/symbataStore.types.ts'

interface ITableCustomToolbarProps {
  rows: GridRowsProp<ISymbolItem>
  symbolsToScan: number
  updateSymbolInList: (symbol: ISymbolItem) => void
}

interface ITableCustomToolbarReturn {
  currentScanSymbolIndex: number
  handleScanSymbols: () => Promise<void>
  isScanning: boolean
  symbolsChunk: ISymbolItem[]
}

export const useTableCustomToolbar = ({
  rows,
  symbolsToScan,
  updateSymbolInList,
}: ITableCustomToolbarProps): ITableCustomToolbarReturn => {
  const { getRecommendation } = useSymbataStoreActions()
  const [isScanning, setIsScanning] = useState(false)
  const [chunkIndex, setChunkIndex] = useState(0)
  const maxChuckIndex = Math.ceil(rows.length / symbolsToScan)
  const [currentScanSymbolIndex, setCurrentSymbolIndex] = useState(0)
  const symbolsChunk = useMemo(() => chunk(rows, symbolsToScan)[chunkIndex], [chunkIndex, rows]) ?? []

  const handleScanSymbols = async () => {
    setIsScanning(true)

    for (const symbol of symbolsChunk) {
      const symbolLoading = { ...symbol, loading: true }
      updateSymbolInList(symbolLoading)
      try {
        const recommendation = await getRecommendation(symbol)

        const symbolWithRecommendation = { ...symbol, recommendation, loading: false }
        updateSymbolInList(symbolWithRecommendation)
        setCurrentSymbolIndex((p) => p + 1)
      } catch (error) {
        console.error(error)
      }
    }
    setIsScanning(false)
    if (chunkIndex < maxChuckIndex - 1) {
      setChunkIndex(chunkIndex + 1)
      setCurrentSymbolIndex(0)
    } else if (chunkIndex === maxChuckIndex - 1) {
      setChunkIndex(0)
      setCurrentSymbolIndex(0)
    }
  }

  return {
    handleScanSymbols,
    isScanning,
    currentScanSymbolIndex,
    symbolsChunk,
  }
}
