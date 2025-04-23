import { useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { Toast } from 'primereact/toast'
import { ISymbolItem } from '../../../stores/symbataStore.types'
import { InputText } from 'primereact/inputtext'
import { useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'

export default function AddToWatchListButton(props: ISymbolItem) {
  const watchlists = useWatchlistStoreWatchlists()
  const menuLeft = useRef<Menu>(null)
  const toast = useRef<Toast>(null)

  const addWatchlistItems = watchlists.map((watchlist) => ({
    label: watchlist.name,
    icon: 'pi pi-star',
  }))

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

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast}></Toast>
      <Menu className="w-full md:w-15rem" model={items} popup ref={menuLeft} id="popup_menu_left" />
      <Button
        icon="pi pi-star"
        text
        severity="secondary"
        size="small"
        onClick={(event) => menuLeft?.current?.toggle(event)}
        aria-controls="popup_menu_left"
        aria-haspopup
      />
    </div>
  )
}
