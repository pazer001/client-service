import { useState } from 'react'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Button } from 'primereact/button'

export const Watchlist = () => {
  const [selectedWatchlist, setSelectedWatchlist] = useState<string>('')

  const wishlistOnChange = (e: DropdownChangeEvent) => {
    setSelectedWatchlist(e.value)
  }

  return (
    <div className="p-inputgroup flex-1">
      <Dropdown
        value={selectedWatchlist}
        onChange={wishlistOnChange}
        options={[]}
        optionLabel="list"
        placeholder="Select a watchlist"
        className="w-full"
      />
      <Button icon="pi pi-plus-circle" className="p-inputgroup-addon" />
      <Button icon="pi pi-trash" className="p-button-danger p-inputgroup-addon" />
    </div>
  )
}
