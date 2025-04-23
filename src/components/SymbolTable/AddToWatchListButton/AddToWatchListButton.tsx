import { useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { MenuItem, MenuItemCommandEvent } from 'primereact/menuitem'
import { Toast } from 'primereact/toast'
import { ISymbolItem } from '../../../stores/symbataStore.types'
import { InputText } from 'primereact/inputtext'
import { useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'

export default function AddToWatchListButton(props: ISymbolItem) {
  const watchlists = useWatchlistStoreWatchlists()
  const { addToWatchlist, removeFromWatchlist } = useWatchlistStoreActions()
  const menuLeft = useRef<Menu>(null)
  const toast = useRef<Toast>(null)

  const addWatchlistItems = watchlists.map((watchlist) => {
    const isSymbolInWatchlist = watchlist.symbols.some((symbol) => symbol.symbol === props.symbol)
    return {
      label: watchlist.name,
      icon: `pi ${isSymbolInWatchlist ? 'pi-star-fill text-yellow-500' : 'pi-star'}`,
      command: (e: MenuItemCommandEvent) => {
        e.originalEvent.preventDefault()
        e.originalEvent.stopPropagation()
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
    } as MenuItem
  })

  const items: MenuItem[] = [
    {
      label: 'Create new Watchlist',
      items: [
        {
          template: () => {
            const [value, setValue] = useState('')
            const { addWatchlist } = useWatchlistStoreActions()
            const watchlists = useWatchlistStoreWatchlists()
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              setValue(e.target.value)
            }
            const handleClick = () => {
              addWatchlist(value)
              setValue('')
              toast.current?.show({
                severity: 'success',
                summary: 'Watchlist Created',
                detail: `Watchlist ${value} created`,
                life: 3000,
              })
            }

            const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                handleClick()
              }
            }
            return (
              <div className="flex flex-column gap-2 px-3 pb-3">
                <div className="p-inputgroup flex-1">
                  <InputText
                    placeholder="Name"
                    name="watchlist"
                    id="watchlist"
                    aria-describedby="watchlist-help"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full"
                  />
                  <Button
                    size="small"
                    icon="pi pi-plus"
                    disabled={value.length === 0 || watchlists.some((watchlist) => watchlist.name === value)}
                    onClick={handleClick}
                  />
                </div>
                {watchlists.some((watchlist) => watchlist.name === value) && (
                  <small id="watchlist-help" className="text-red-300">
                    Watchlist already exists
                  </small>
                )}
              </div>
            )
          },
        },
      ],
    },
  ]

  if (addWatchlistItems.length > 0) {
    items.unshift(
      {
        label: 'Add to Watchlist',
        items: addWatchlistItems,
      },
      { separator: true },
    )
  }

  console.log('AddToWatchListButton', props)
  console.log('watchlists', watchlists)

  const isSymbolInWatchlist = watchlists.some((watchlist) =>
    watchlist.symbols.some((symbol) => symbol._id === props._id),
  )

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast}></Toast>
      <Menu className="w-full md:w-15rem" model={items} popup ref={menuLeft} id="popup_menu_left" />
      <Button
        icon={`pi ${isSymbolInWatchlist ? 'pi-star-fill' : 'pi-star'}`}
        text
        severity={isSymbolInWatchlist ? undefined : 'secondary'}
        size="small"
        onClick={(event) => menuLeft?.current?.toggle(event)}
        aria-controls="popup_menu_left"
        aria-haspopup
      />
    </div>
  )
}
