import { create, StateCreator } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ISymbolItem } from './symbataStore.types.ts'

interface IWatchListStoreActions {
  addWatchlist: (watchlistName: string, source: TWatchlistSource) => Promise<void>
  addToWatchlist: (watchlistName: string, symbol: ISymbolItem) => Promise<void>
  removeWatchlist: (watchlistName: string) => Promise<void>
  removeFromWatchlist: (watchlistName: string, symbol: ISymbolItem) => Promise<void>
}

type TWatchlistSource = 'manual' | 'broker'
export interface IWatchlist {
  name: string
  source: TWatchlistSource
  symbols: ISymbolItem[]
}

interface IWatchListStore {
  currentWatchlist: IWatchlist | null
  watchlists: IWatchlist[]
  actions: IWatchListStoreActions
}

const watchlistStore: StateCreator<IWatchListStore> = (set) => ({
  currentWatchlist: null,
  watchlists: [],
  actions: {
    addWatchlist: async (name: string, source) => {
      set((state) => ({
        watchlists: [...state.watchlists, { name, source, symbols: [] }],
      }))
    },
    addToWatchlist: async (name: string, symbol: ISymbolItem) => {
      set((state) => {
        const watchlist = state.watchlists.find((watchlist) => watchlist.name === name)
        if (watchlist) {
          return {
            watchlists: state.watchlists.map((wl) =>
              wl.name === name ? { ...wl, symbols: [...wl.symbols, symbol] } : wl,
            ),
          }
        }
        return state
      })
    },
    removeFromWatchlist: async (name: string, symbol: ISymbolItem) => {
      set((state) => {
        const watchlist = state.watchlists.find((watchlist) => watchlist.name === name)
        if (watchlist) {
          return {
            watchlists: state.watchlists.map((wl) =>
              wl.name === name ? { ...wl, symbols: wl.symbols.filter((s) => s.symbol !== symbol.symbol) } : wl,
            ),
          }
        }
        return state
      })
    },
    removeWatchlist: async (name: string) => {
      set((state) => {
        return {
          watchlists: state.watchlists.filter((watchlist) => watchlist.name !== name),
        }
      })
    },
  },
})

const useWatchlistStore = create<IWatchListStore>()(
  persist(watchlistStore, {
    name: 'watchlistStore',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      watchlists: state.watchlists,
    }),
  }),
)
export const useWatchlistStoreActions = () => useWatchlistStore((state) => state.actions)
export const useWatchlistStoreCurrentWatchlist = () => useWatchlistStore((state) => state.currentWatchlist)
export const useWatchlistStoreWatchlists = () => useWatchlistStore((state) => state.watchlists)
