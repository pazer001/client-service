import { Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover } from '@mui/material'
import { ListTitle } from './WatchListMenu.style'
import DeleteIcon from '@mui/icons-material/Delete'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import { WatchlistAddInput } from '../Watchlist/WatchlistMenu/WatchlistAddInput'
import { IWatchlist, useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'
import { useCallback } from 'react'
import { ISymbolItem } from '../../../stores/symbataStore.types'

interface IWatchlistMenuProps {
  id: string | undefined
  symbolItem: ISymbolItem
  onClose: () => void
  anchorEl: HTMLButtonElement | null
  open: boolean
}

export const WatchlistMenu = ({ id, symbolItem, onClose, anchorEl, open }: IWatchlistMenuProps) => {
  const watchlists = useWatchlistStoreWatchlists()
  const { addToWatchlist, removeFromWatchlist, removeWatchlist } = useWatchlistStoreActions()

  const checkSymbolInWatchlist = useCallback(
    (watchlist: IWatchlist) => watchlist.symbols.some((item) => item.symbol === symbolItem.symbol),
    [],
  )

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      elevation={8}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      {watchlists.length > 0 && (
        <>
          <ListTitle>Add to Watchlist</ListTitle>
          <List sx={{ p: 0 }} aria-label="watchlist" dense>
            {watchlists.map((watchlist) => {
              const isSymbolInWatchlist = checkSymbolInWatchlist(watchlist)
              return (
                <ListItem
                  sx={{ p: 0 }}
                  key={watchlist.name}
                  dense
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeWatchlist(watchlist.name)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    sx={{ pl: '12px' }}
                    onClick={() => {
                      if (isSymbolInWatchlist) {
                        removeFromWatchlist(watchlist.name, symbolItem)
                      } else {
                        addToWatchlist(watchlist.name, symbolItem)
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                      {isSymbolInWatchlist ? <StarRateRoundedIcon color="warning" /> : <StarOutlineRoundedIcon />}
                    </ListItemIcon>
                    <ListItemText primary={watchlist.name} />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
          <Divider />
        </>
      )}
      <ListTitle>Create Watchlist</ListTitle>
      <List sx={{ padding: 0 }} aria-label="create watchlist" dense>
        <ListItem sx={{ px: 1, pb: 1 }} dense>
          <WatchlistAddInput />
        </ListItem>
      </List>
    </Popover>
  )
}
