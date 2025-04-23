import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ISymbolItem } from './symbataStore.types.ts'

interface IWatchListStoreActions {
  addWatchlist: (name: string) => Promise<void>
  removeWatchlist: (name: string) => Promise<void>
}

interface IWatchlist {
  name: string
  symbols: ISymbolItem[]
}

interface IWatchListStore {
  currentWatchlist: string | undefined
  watchlists: IWatchlist[]
  actions: IWatchListStoreActions
}

const watchlistStore: StateCreator<IWatchListStore> = () => ({
  currentWatchlist: undefined,
  watchlists: [],
  actions: {
    addWatchlist: async (name: string) => {
      console.log('Adding watchlist:', name)
    },
    removeWatchlist: async (name: string) => {
      console.log('Removing watchlist:', name)
    },
  },
})

const useWatchlistStore = create<IWatchListStore>()(devtools(watchlistStore, { name: 'watchlistStore' }))
export const useWatchlistStoreActions = () => useWatchlistStore((state) => state.actions)
export const useWatchlistStoreCurrentWatchlist = () => useWatchlistStore((state) => state.currentWatchlist)
export const useWatchlistStoreWatchlists = () => useWatchlistStore((state) => state.watchlists)
