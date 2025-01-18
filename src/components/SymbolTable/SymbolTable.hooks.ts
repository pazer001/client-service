import { useState, useEffect } from 'react'
import { useSymbolStore } from '../../stores/symbolStore'
import type { ISymbolTableItem } from './SymbolTable.types'

interface IReturnSymbolTableHook {
  isLoading: boolean
  data: ISymbolTableItem[]
  tableWrapperEdgesHeight: number
}

/**
 * Custom hook to fetch and manage symbol table data.
 *
 * @returns {IReturnSymbolTableHook} An object containing loading state and symbol table data.
 */
export const useSymbolTable = (): IReturnSymbolTableHook => {
  const [isLoading, setIsLoading] = useState(false)
  const [tableWrapperEdgesHeight, setTableWrapperEdgesHeight] = useState(137)
  const [data, setData] = useState<ISymbolTableItem[]>([])
  const { getSuggestedSymbols, symbols } = useSymbolStore()

  useEffect(() => {
    setIsLoading(true)
    getSuggestedSymbols().finally(() => {
      setIsLoading(false)
      setTimeout(() => {
        const tableHeaderHeight = document.querySelector('.symbol-table .p-datatable-header')?.clientHeight ?? 0
        const tablePaginatorHeight = document.querySelector('.symbol-table .p-paginator')?.clientHeight ?? 0
        setTableWrapperEdgesHeight(tableHeaderHeight + tablePaginatorHeight)
      }, 0)
    })
  }, [])

  useEffect(() => {
    // table data must have a unique key property for row selections
    setData(symbols.map((item) => ({ ...item, key: item.symbol })))
  }, [symbols.length])

  return {
    isLoading,
    data,
    tableWrapperEdgesHeight,
  }
}
