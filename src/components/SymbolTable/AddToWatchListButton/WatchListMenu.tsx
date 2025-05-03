import { Box, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
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
    <Menu
      id="watchlist-menu"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        paper: {
          'aria-labelledby': id,
        },
      }}
    >
      {watchlists.length > 0 && (
        <Box>
          {watchlists.map((watchlist) => {
            const isSymbolInWatchlist = checkSymbolInWatchlist(watchlist)
            return (
              <MenuItem
                key={watchlist.name}
                dense
                onClick={handleToggleWatchlist(isSymbolInWatchlist, watchlist.name, symbolItem)}
              >
                <ListItemIcon>
                  {isSymbolInWatchlist ? <StarRateRoundedIcon color="warning" /> : <StarOutlineRoundedIcon />}
                </ListItemIcon>
                <ListItemText primary={watchlist.name} />
                <IconButton edge="end" aria-label="delete" size="small" onClick={handleRemoveWatchlist(watchlist.name)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </MenuItem>
            )
          })}
          <Divider />
        </Box>
      )}
      <ListItem dense>
        <WatchlistAddInput />
      </ListItem>
    </Menu>
  )
}
