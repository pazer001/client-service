import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Interval } from '../components/interfaces.ts'

interface ISymbolStore {
  interval: Interval
  symbol: string | undefined
  setSymbol: (symbol: string) => void
}

const symbataStore: StateCreator<ISymbolStore> = (set) => ({
  interval: Interval['1d'],
  symbol: undefined,
  setSymbol: (symbol: string) => {
    set((state) => ({ ...state, symbol }))
  },
})

export const useSymbataStore = create<ISymbolStore>()(devtools(symbataStore))
