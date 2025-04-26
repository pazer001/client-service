import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Interval } from '../components/interfaces.ts'
import axios, { AxiosResponse } from 'axios'
import { IRecommendation, ISymbolItem } from './symbataStore.types.ts'

const API_HOST = import.meta.env.VITE_API_HOST

export interface IStoreActions {
  setSymbol: (symbol: ISymbolItem) => void
  getRecommendation: (symbol: ISymbolItem) => Promise<IRecommendation>
  getSuggestedSymbols: () => Promise<void>
}

export interface ISymbolStore {
  interval: Interval
  symbol: ISymbolItem | undefined
  symbols: ISymbolItem[]
  actions: IStoreActions
}

const symbataStore: StateCreator<ISymbolStore> = (set) => ({
  interval: Interval['1d'],
  symbol: undefined,
  symbols: [],
  actions: {
    setSymbol: (symbol: ISymbolItem) => {
      set({ symbol })
    },
    getSuggestedSymbols: async () => {
      try {
        const supportedSymbolsResult: AxiosResponse<ISymbolItem[]> = await axios.get(
          `${API_HOST}/analyze/suggestedSymbols`,
        )
        set((state) => ({ ...state, symbols: supportedSymbolsResult.data }))
      } catch (error) {
        console.error('Error fetching suggested symbols:', error)
      }
    },
    getRecommendation: async (rowData) => {
      try {
        const req = await axios.get(`${import.meta.env.VITE_API_HOST}/analyze/recommendation`, {
          params: {
            symbol: rowData.symbol,
            usedStrategy: rowData?.recommendation?.usedStrategy ?? '',
          },
        })
        const recommendation = req.data as IRecommendation
        return recommendation
      } catch (error) {
        console.error('Error fetching recommendation:', error)
        throw error
      }
    },
  },
})

export const useSymbataStore = create<ISymbolStore>()(devtools(symbataStore))
export const useSymbataStoreActions = () => useSymbataStore((state) => state.actions)
export const useSymbataStoreSymbol = () => useSymbataStore((state) => state.symbol)
export const useSymbataStoreSymbols = () => useSymbataStore((state) => state.symbols)
export const useSymbataStoreInterval = () => useSymbataStore((state) => state.interval)
