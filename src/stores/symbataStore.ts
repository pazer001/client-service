import { create, StateCreator } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { Interval } from '../components/interfaces.ts'
import axios from '../axios'
import { AxiosResponse } from 'axios'
import { IRecommendation, ISymbolItem, IOpenPositionsResponse } from './symbataStore.types.ts'

export interface IStoreActions {
  setSymbol: (symbol: ISymbolItem) => void
  setSymbols: (symbols: ISymbolItem[]) => void
  updateSymbolInList: (symbol: ISymbolItem) => void
  getRecommendation: (symbol: ISymbolItem) => Promise<IRecommendation>
  getSuggestedSymbols: () => Promise<void>
  getOpenPositions: () => Promise<void>
  setProfileValue: (value: number) => void
  setInterval: (interval: Interval) => void
}

export interface ISymbolStore {
  interval: Interval
  profileValue: number
  symbol: ISymbolItem | undefined
  symbols: ISymbolItem[]
  openPositions: IOpenPositionsResponse | undefined
  actions: IStoreActions
}

const symbataStore: StateCreator<ISymbolStore> = (set, get) => ({
  interval: Interval['1d'],
  profileValue: 100_000,
  symbol: undefined,
  symbols: [],
  openPositions: undefined,
  actions: {
    setInterval: (interval: Interval) => {
      set({ interval })
    },
    setProfileValue: (value: number) => {
      set({ profileValue: value })
    },
    setSymbol: (symbol: ISymbolItem) => {
      set({ symbol })
    },
    setSymbols: (symbols: ISymbolItem[]) => {
      set({ symbols })
    },
    updateSymbolInList: (symbol: ISymbolItem) => {
      const { symbols } = get()
      const updatedSymbols = symbols.map((item) => (item.symbol === symbol.symbol ? symbol : item))
      set({ symbols: updatedSymbols })
    },
    getSuggestedSymbols: async () => {
      try {
        const supportedSymbolsResult: AxiosResponse<ISymbolItem[]> = await axios.get('analyze/suggestedSymbols')
        set((state) => ({ ...state, symbols: supportedSymbolsResult.data }))
      } catch (error) {
        console.error('Error fetching suggested symbols:', error)
      }
    },
    getOpenPositions: async () => {
      try {
        const result: AxiosResponse<IOpenPositionsResponse> = await axios.get('algo/getCurrentOpenPositions')
        set({ openPositions: result.data })
      } catch (error) {
        console.error('Error fetching open positions:', error)
      }
    },
    getRecommendation: async (rowData) => {
      try {
        const { interval } = get()
        const req = await axios.get(`analyze/recommendation`, {
          params: {
            symbol: rowData.symbol,
            usedStrategy: rowData?.recommendation?.usedStrategy ?? '',
            interval: interval,
          },
        })

        return req.data as IRecommendation
      } catch (error) {
        console.error('Error fetching recommendation:', error)
        throw error
      }
    },
  },
})

// TODO: Remove "persist" before going to PRODUCTION!!! (it is just for development usage)
export const useSymbataStore = import.meta.env.DEV
  ? create<ISymbolStore>()(
      devtools(
        persist(symbataStore, {
          name: 'symbataStore',
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            // symbols: state.symbols,
            interval: state.interval,
            profileValue: state.profileValue,
          }),
        }),
      ),
    )
  : create<ISymbolStore>()(
      devtools(symbataStore, {
        name: 'symbataStore',
        enabled: import.meta.env.DEV, // disable devtools on PRODUCTIONS
        anonymousActionType: 'Unknown',
      }),
    )
export const useSymbataStoreActions = () => useSymbataStore((state) => state.actions)
export const useSymbataStoreSymbol = () => useSymbataStore((state) => state.symbol)
export const useSymbataStoreSymbols = () => useSymbataStore((state) => state.symbols)
export const useSymbataStoreInterval = () => useSymbataStore((state) => state.interval)
export const useSymbataStoreProfileValue = () => useSymbataStore((state) => state.profileValue)
export const useSymbataStoreOpenPositions = () => useSymbataStore((state) => state.openPositions)
