import { useRef, useState } from 'react'
import { useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../../stores/watchlistStore'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

export const WatchlistMenu = () => {
  const [value, setValue] = useState('')
  const { addWatchlist } = useWatchlistStoreActions()
  const watchlists = useWatchlistStoreWatchlists()
  const toast = useRef<Toast>(null)

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
    <>
      <Toast ref={toast}></Toast>
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
    </>
  )
}
