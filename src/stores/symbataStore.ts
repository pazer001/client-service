import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Interval } from '../components/interfaces.ts'
import axios, { AxiosResponse } from 'axios'
import { EAction, IRecommendation, ISymbolItem } from './symbataStore.types.ts'

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
      set((state) => ({ ...state, symbol }))
    },
    getSuggestedSymbols: async () => {
      try {
        const supportedSymbolsResult: AxiosResponse<Array<ISymbolItem>> = await axios.get(
          `${API_HOST}/analyze/suggestedSymbols`,
        )
        set((state) => ({ ...state, symbols: supportedSymbolsResult.data }))
      } catch (error) {
        console.error('Error fetching suggested symbols:', error)
        // Mock data to return in case of failure
        const mockSymbols: ISymbolItem[] = [
          {
            _id: '1',
            symbol: 'AAPL',
            __v: 0,
            averageVolume: 1000000,
            createdAt: new Date().toISOString(),
            priorityScore: {
              symbol: null,
              sector: null,
              index: null,
              sizeValue: null,
              style: null,
              symbolLastScore: null,
              sectorLastScore: null,
              indexLastScore: null,
              sizeLastValueScore: null,
              styleLastScore: null,
            },
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '2',
            symbol: 'GOOGL',
            __v: 0,
            averageVolume: 2000000,
            createdAt: new Date().toISOString(),
            priorityScore: {
              symbol: null,
              sector: null,
              index: null,
              sizeValue: null,
              style: null,
              symbolLastScore: null,
              sectorLastScore: null,
              indexLastScore: null,
              sizeLastValueScore: null,
              styleLastScore: null,
            },
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '3',
            symbol: 'MSFT',
            __v: 0,
            averageVolume: 1500000,
            createdAt: new Date().toISOString(),
            priorityScore: {
              symbol: null,
              sector: null,
              index: null,
              sizeValue: null,
              style: null,
              symbolLastScore: null,
              sectorLastScore: null,
              indexLastScore: null,
              sizeLastValueScore: null,
              styleLastScore: null,
            },
            updatedAt: new Date().toISOString(),
          },
        ]
        set((state) => ({ ...state, symbols: mockSymbols }))
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
        // Mock data to return in case of failure
        return {
          usedStrategy: 'default',
          action: EAction.HOLD, // Updated to use the correct enum value
          stopLoss: 0,
          riskCapitalPercent: 0,
        } as IRecommendation
      }
    },
  },
})

export const useSymbataStore = create<ISymbolStore>()(devtools(symbataStore))
export const useSymbataStoreActions = () => useSymbataStore((state) => state.actions)
export const useSymbataStoreSymbol = () => useSymbataStore((state) => state.symbol)
export const useSymbataStoreSymbols = () => useSymbataStore((state) => state.symbols)
export const useSymbataStoreInterval = () => useSymbataStore((state) => state.interval)
