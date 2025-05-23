import { create, StateCreator } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ISymbolItem } from './symbataStore.types.ts'

interface IWatchListStoreActions {
  addWatchlist: (watchlistName: string, source: TWatchlistSource) => void
  addToWatchlist: (watchlistName: string, symbol: ISymbolItem) => void
  removeWatchlist: (watchlistName: string) => void
  removeFromWatchlist: (watchlistName: string, symbol: ISymbolItem) => void
  updateSymbolInCurrentWatchlist: (symbol: ISymbolItem) => void
  getWatchlist: (watchlistName: string) => IWatchlist | undefined
  setCurrentWatchlist: (watchlist: IWatchlist) => void
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
            currentWatchlist:
              state.currentWatchlist !== null && state.currentWatchlist.name === name
                ? {
                    ...state.currentWatchlist,
                    symbols: [...state.currentWatchlist.symbols, symbol],
                  }
                : state.currentWatchlist,
          }
        }

        return state
      })
    },
    updateSymbolInCurrentWatchlist: (symbol: ISymbolItem) => {
      const watchlist = get().watchlists.find((watchlist) =>
        watchlist.symbols.some((s) => s.symbol === symbol.symbol),
      )
      if (!watchlist) {
        console.warn('Symbol not found in any watchlist')
        return
      }

      const name = watchlist.name
      set((state) => {
        const watchlist = state.watchlists.find((watchlist) => watchlist.name === name)

        if (watchlist) {
          const watchlists = state.watchlists.map((wl) =>
            wl.name === name
              ? {
                  ...wl,
                  symbols: wl.symbols.map((s) =>
                    s.symbol === symbol.symbol ? symbol : s,
                  ),
                }
              : wl,
          )

          return {
            watchlists,
            currentWatchlist:
              state.currentWatchlist !== null && state.currentWatchlist.name === name
                ? watchlists.find((wl) => wl.name === name)
                : state.currentWatchlist,
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
            currentWatchlist:
              state.currentWatchlist !== null && state.currentWatchlist.name === name
                ? {
                    ...state.currentWatchlist,
                    symbols: state.currentWatchlist.symbols.filter((s) => s.symbol !== symbol.symbol),
                  }
                : state.currentWatchlist,
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
    setCurrentWatchlist: (watchlist: IWatchlist) => {
      set({ currentWatchlist: watchlist })
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
export const useWatchlistStoreCurrentWatchlist = () => useWatchlistStore((state) => state.currentWatchlist)
