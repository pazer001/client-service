import { AxiosResponse } from 'axios'
import { create, StateCreator } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import axios from '../axios'
import { Interval } from '../components/interfaces.ts'
import { users } from '../utils/utils.ts'
import {
  IAlgoSession,
  IAlpacaBalancesResponse,
  IOpenPositionsResponse,
  IRecommendation,
  ISymbolItem,
} from './symbataStore.types.ts'

export interface IStoreActions {
  setSymbol: (symbol: ISymbolItem) => void
  setSymbols: (symbols: ISymbolItem[]) => void
  updateSymbolInList: (symbol: ISymbolItem) => void
  getRecommendation: (symbol: ISymbolItem) => Promise<IRecommendation>
  getSuggestedSymbols: () => Promise<void>
  getOpenPositions: () => Promise<void>
  getBalance: (userId: string) => Promise<void>
  getAlgoSession: (userId: string) => Promise<void>
  setProfileValue: (value: number) => void
  setInterval: (interval: Interval) => void
  startAlgo: (userId: string) => Promise<boolean>
  stopAlgo: (userId: string) => Promise<boolean>
  setIsAlgoStarted: (isAlgoStarted: boolean) => void
  setUserId: (userId: string) => void
  setTradingViewSymbol: (symbol: string) => void
  setIsCryptoMode: (value: boolean) => void
  setIncludePrePostMarket: (value: boolean) => void
}

export interface ISymbolStore {
  interval: Interval
  profileValue: number
  tradingViewSymbol: string | undefined
  symbol: ISymbolItem | undefined
  symbols: ISymbolItem[]
  openPositions: IOpenPositionsResponse | undefined
  balance: IAlpacaBalancesResponse | undefined
  isAlgoStarted: boolean
  userId: string
  isCryptoMode: boolean
  includePrePostMarket: boolean
  actions: IStoreActions
}

const algoApiUrl: Record<Interval, { start: string; stop: string }> = {
  [Interval['5m']]: { start: 'algo/runIntraday/', stop: 'algo/stopIntraday/' },
  [Interval['15m']]: { start: 'algo/runIntraday/', stop: 'algo/stopIntraday/' },
  [Interval['1d']]: { start: 'algo/runSwing/', stop: 'algo/stopSwing/' },
}

// Exported for use in IntervalController - order matches algoApiUrl definition
export const supportedAlgoIntervals = Object.keys(algoApiUrl) as Interval[]

const symbataStore: StateCreator<ISymbolStore> = (set, get) => ({
  interval: Interval['15m'],
  profileValue: 100_000,
  tradingViewSymbol: 'SPY',
  symbol: undefined,
  symbols: [],
  openPositions: undefined,
  balance: undefined,
  isAlgoStarted: false,
  userId: users.pazStocks.id,
  isCryptoMode: false,
  includePrePostMarket: false,
  actions: {
    setTradingViewSymbol: (symbol: string) => {
      set({ tradingViewSymbol: symbol })
    },
    setUserId: (userId: string) => {
      set({ userId })
    },
    setIsCryptoMode: (value: boolean) => {
      set({ isCryptoMode: value })
    },
    setIncludePrePostMarket: (value: boolean) => {
      set({ includePrePostMarket: value })
    },
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
      const { userId } = get()
      try {
        const result: AxiosResponse<IOpenPositionsResponse> = await axios.get('algo/getCurrentOpenPositions/' + userId)
        set({ openPositions: result.data })
      } catch (error) {
        console.error('Error fetching open positions:', error)
      }
    },
    getBalance: async (userId: string) => {
      try {
        const result: AxiosResponse<IAlpacaBalancesResponse> = await axios.get(`algo/balances/${userId}`)
        set({ balance: result.data })
      } catch (error) {
        console.error('Error fetching balance:', error)
        throw error
      }
    },
    getAlgoSession: async (userId: string) => {
      try {
        const result: AxiosResponse<IAlgoSession> = await axios.get(`algo/algoSession/${userId}`)
        set({
          interval: result.data.interval as Interval,
          isCryptoMode: result.data.isCryptoMode,
          includePrePostMarket: result.data.includePrePostMarket,
        })
      } catch (error) {
        console.error('Error fetching algo session:', error)
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
    setIsAlgoStarted: (isAlgoStarted: boolean) => {
      set({ isAlgoStarted })
    },
    startAlgo: async (userId: string) => {
      try {
        const { interval, isCryptoMode, includePrePostMarket } = get()
        const url = algoApiUrl[interval].start + userId
        const result: AxiosResponse<boolean> = await axios.post(url, {
          interval,
          isCryptoMode,
          includePrePostMarket,
        })
        set({ isAlgoStarted: result.data })
        return result.data
      } catch (error) {
        console.error('Error starting algo:', error)
        throw error
      }
    },
    stopAlgo: async (userId: string) => {
      try {
        const { interval } = get()
        const url = algoApiUrl[interval].stop + userId
        const result: AxiosResponse<boolean> = await axios.post(url)
        set({ isAlgoStarted: !result.data })
        return result.data
      } catch (error) {
        console.error('Error stopping algo:', error)
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
export const useSymbataStoreBalance = () => useSymbataStore((state) => state.balance)
export const useSymbataStoreIsAlgoStarted = () => useSymbataStore((state) => state.isAlgoStarted)
export const useSymbataStoreUserId = () => useSymbataStore((state) => state.userId)
export const useSymbataStoreTradingViewSymbol = () => useSymbataStore((state) => state.tradingViewSymbol)
export const useSymbataStoreIsCryptoMode = () => useSymbataStore((state) => state.isCryptoMode)
export const useSymbataStoreIncludePrePostMarket = () => useSymbataStore((state) => state.includePrePostMarket)
