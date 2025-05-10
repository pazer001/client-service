import { create, StateCreator } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ISymbolItem } from './symbataStore.types.ts'

interface IWatchListStoreActions {
  addWatchlist: (watchlistName: string, source: TWatchlistSource) => void
  addToWatchlist: (watchlistName: string, symbol: ISymbolItem) => void
  removeWatchlist: (watchlistName: string) => void
  removeFromWatchlist: (watchlistName: string, symbol: ISymbolItem) => void
  updateSymbolInList: (symbol: ISymbolItem) => void
  getWatchlist: (watchlistName: string) => IWatchlist | undefined
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

const watchlistStore: StateCreator<IWatchListStore> = (set, get) => ({
  currentWatchlist: null,
  watchlists: [],
  actions: {
    addWatchlist: (name: string, source) => {
      set((state) => ({
        watchlists: [...state.watchlists, { name, source, symbols: [] }],
      }))
    },
    addToWatchlist: (name, symbol) => {
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
    updateSymbolInList: (symbolWithRecommendation: ISymbolItem) => {
      const currentWatchlist = get().currentWatchlist
      if (!currentWatchlist) {
        console.error('Cannot update symbol: no watchlist is selected')
        return
      }

      const name = currentWatchlist.name
      set((state) => {
        const watchlist = state.watchlists.find((watchlist) => watchlist.name === name)

        if (watchlist) {
          return {
            watchlists: state.watchlists.map((wl) =>
              wl.name === name
                ? {
                    ...wl,
                    symbols: wl.symbols.map((s) =>
                      s.symbol === symbolWithRecommendation.symbol ? symbolWithRecommendation : s,
                    ),
                  }
                : wl,
            ),
          }
        }
        return state
      })
    },
    getWatchlist: (name: string) => {
      return get().watchlists.find((watchlist) => watchlist.name === name)
    },
    removeFromWatchlist: (name: string, symbol: ISymbolItem) => {
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
    removeWatchlist: (name: string) => {
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
export const useWatchlistStoreWatchlists = () => useWatchlistStore((state) => state.watchlists)
