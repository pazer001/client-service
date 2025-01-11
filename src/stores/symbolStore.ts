import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import axios, { AxiosResponse } from 'axios'

interface ISymbolStore {
  interval: Interval
  symbols: ISymbol[]
  getSuggestedSymbols: () => Promise<void>
}

export enum Interval {
  '1m' = '1m',
  '5m' = '5m',
  '15m' = '15m',
  '30m' = '30m',
  '60m' = '60m',
  '1d' = '1d',
}

// interface ISymbolState {
//   selectedSymbol: string;
//   symbolData: SymbolData | undefined;
//   selectedSignal: number;
//   settings: {
//     byType: "byWinRate" | "byProfit";
//     interval: Interval;
//     intervals: Array<Interval>;
//     pricesMode: "normal" | "dividendsAdjusted";
//   };
// };

export interface ISymbol {
  id: number
  symbol: string
  score: number
  recommendation: 'Buy' | 'Sell' | 'Hold' | ''
  updatedAt: string
  nextEarningReport: number
  averageVolume: number
  isPennyStock: boolean
  logo: string
  priorityScore: number
}

const API_HOST = import.meta.env.VITE_API_HOST

const symbolStore: StateCreator<ISymbolStore> = (set, get) => ({
  interval: Interval['1d'],
  symbols: [],
  getSuggestedSymbols: async (): Promise<void> => {
    const { interval } = get()
    const supportedSymbolsResult: AxiosResponse<Array<ISymbol>> = await axios.get(
      `${API_HOST}/analyze/suggestedSymbols/${interval}/byProfit`,
    )

    set({
      symbols: supportedSymbolsResult.data,
    })
  },
})

export const useSymbolStore = create<ISymbolStore>()(devtools(symbolStore))
