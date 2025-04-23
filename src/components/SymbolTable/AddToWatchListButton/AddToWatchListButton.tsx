import { useRef } from 'react'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { Toast } from 'primereact/toast'
import { ISymbolItem } from '../../../stores/symbataStore.types'
import { InputText } from 'primereact/inputtext'

export default function AddToWatchListButton(props: ISymbolItem) {
  const menuLeft = useRef<Menu>(null)
  const toast = useRef<Toast>(null)
  const items: MenuItem[] = [
    {
      label: 'Add to Watchlist',
      items: [
        {
          label: 'Refresh',
          icon: 'pi pi-refresh',
        },
        {
          label: 'Export',
          icon: 'pi pi-upload',
        },
      ],
    },
    {
      label: 'Add Watchlist',
      items: [
        {
          template: () => (
            <div className="p-inputgroup flex-1 px-3 pb-3">
              <InputText placeholder="Name" />
              <Button size="small" icon="pi pi-plus" />
            </div>
          ),
        },
      ],
    },
  ]
  console.log('AddToWatchListButton', props)

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast}></Toast>
      <Menu className="w-full md:w-15rem" model={items} popup ref={menuLeft} id="popup_menu_left" />
      <Button
        icon="pi pi pi-ellipsis-v"
        text
        size="small"
        onClick={(event) => menuLeft?.current?.toggle(event)}
        aria-controls="popup_menu_left"
        aria-haspopup
      />
    </div>
  )
}
