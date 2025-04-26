import { useRef, useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { Toast } from 'primereact/toast'
import { ISymbolItem } from '../../../stores/symbataStore.types'
import { IWatchlist, useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'
import { WatchlistMenu } from '../Watchlist/WatchlistMenu/WatchlistMenu'

const AddToWatchListButton = (props: ISymbolItem) => {
  const menuLeft = useRef<Menu>(null)
  const toast = useRef<Toast>(null)
  const watchlists = useWatchlistStoreWatchlists()
  const { addToWatchlist, removeFromWatchlist } = useWatchlistStoreActions()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 'create-new-watchlist',
      label: 'Create new Watchlist',
      items: [
        {
          template: WatchlistMenu,
        },
      ],
    },
  ])

  const checkSymbolInWatchlist = (watchlist: IWatchlist) =>
    watchlist.symbols.some((symbol) => symbol.symbol === props.symbol)

  useEffect(() => {
    if (watchlists.length > 0) {
      // Add the watchlist items to the menu
      const items = watchlists.map((watchlist): MenuItem => {
        const isSymbolInWatchlist = checkSymbolInWatchlist(watchlist)
        return {
          label: watchlist.name,
          icon: `pi ${isSymbolInWatchlist ? 'pi-star-fill text-yellow-500' : 'pi-star'}`,
          command: () => {
            if (isSymbolInWatchlist) {
              removeFromWatchlist(watchlist.name, props)
              toast.current?.show({
                severity: 'info',
                summary: 'Removed from Watchlist',
                detail: `Removed ${props.symbol} from ${watchlist.name}`,
                life: 3000,
              })
              return
            }

            addToWatchlist(watchlist.name, props)
            toast.current?.show({
              severity: 'success',
              summary: 'Added to Watchlist',
              detail: `Added ${props.symbol} to ${watchlist.name}`,
              life: 3000,
            })
          },
        }
      })

      setMenuItems((prevItems) => [
        {
          id: 'add-to-watchlist',
          label: 'Add to Watchlist',
          items,
        },
        ...prevItems.filter((item) => item.id !== 'add-to-watchlist'),
      ])
    }
  }, [watchlists])

  const isSymbolInWatchlist = watchlists.some(checkSymbolInWatchlist)

  return (
    <>
      <Toast ref={toast}></Toast>
      <Menu className="w-full md:w-15rem" model={menuItems} popup ref={menuLeft} id="popup_menu_left" />
      <Button
        icon={`pi ${isSymbolInWatchlist ? 'pi-star-fill' : 'pi-star'}`}
        text
        severity={isSymbolInWatchlist ? undefined : 'secondary'}
        size="small"
        onClick={(event) => menuLeft?.current?.toggle(event)}
        aria-controls="popup_menu_left"
        aria-haspopup
      />
    </>
  )
}
// TODO: extract the toast to the root component and add the toast ref to main store (symbataStore.ts) to be used in all components

export default AddToWatchListButton
