import { create, StateCreator } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ISymbolItem } from './symbataStore.types.ts'

interface IWatchListStoreActions {
  addWatchlist: (watchlistName: string) => Promise<void>
  addToWatchlist: (watchlistName: string, symbol: ISymbolItem) => Promise<void>
  removeWatchlist: (watchlistName: string) => Promise<void>
  removeFromWatchlist: (watchlistName: string, symbol: ISymbolItem) => Promise<void>
}

interface IWatchlist {
  name: string
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
    addWatchlist: async (name: string) => {
      set((state) => ({
        watchlists: [...state.watchlists, { name, symbols: [] }],
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
      console.log('Removing watchlist:', name)
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
