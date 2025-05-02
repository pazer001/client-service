import { Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover } from '@mui/material'
import { ListTitle } from './WatchListMenu.style'
import DeleteIcon from '@mui/icons-material/Delete'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import { WatchlistAddInput } from './WatchlistAddInput'
import { IWatchlist, useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'
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

  const checkSymbolInWatchlist = (watchlist: IWatchlist) =>
    watchlist.symbols.some((item) => item.symbol === symbolItem.symbol)

  const handleToggleWatchlist =
    (isSymbolInWatchlist: boolean, watchlistName: string, symbolItem: ISymbolItem) => () => {
      if (isSymbolInWatchlist) {
        removeFromWatchlist(watchlistName, symbolItem)
      } else {
        addToWatchlist(watchlistName, symbolItem)
      }
      onClose()
    }

  const handleRemoveWatchlist = (watchlistName: string) => () => {
    removeWatchlist(watchlistName)
    onClose()
  }

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
          <List aria-label="watchlist" dense>
            {watchlists.map((watchlist) => {
              const isSymbolInWatchlist = checkSymbolInWatchlist(watchlist)
              return (
                <ListItem
                  key={watchlist.name}
                  dense
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={handleRemoveWatchlist(watchlist.name)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    sx={{ pl: '12px' }}
                    onClick={handleToggleWatchlist(isSymbolInWatchlist, watchlist.name, symbolItem)}
                  >
                    <ListItemIcon>
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
      <List aria-label="create watchlist" dense>
        <ListItem dense>
          <WatchlistAddInput />
        </ListItem>
      </List>
    </Popover>
  )
}
