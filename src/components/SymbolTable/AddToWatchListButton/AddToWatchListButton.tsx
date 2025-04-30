import {
  useCallback,
  useMemo,
  // useCallback, useMemo,
  useState,
} from 'react'
import { ISymbolItem } from '../../../stores/symbataStore.types'
// import {
//   IWatchlist,
//   // useWatchlistStoreActions,
//   useWatchlistStoreWatchlists,
// } from '../../../stores/watchlistStore'
import { WatchlistAddInput } from '../Watchlist/WatchlistMenu/WatchlistAddInput'
import { Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover } from '@mui/material'
// import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import { GridRowParams } from '@mui/x-data-grid'
import { IWatchlist, useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'

const AddToWatchListButton = (props: GridRowParams<ISymbolItem>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  console.log('AddToWatchListButton props', props)

  const watchlists = useWatchlistStoreWatchlists()
  const { addToWatchlist, removeFromWatchlist } = useWatchlistStoreActions()

  const checkSymbolInWatchlist = useCallback(
    (watchlist: IWatchlist) => watchlist.symbols.some((symbol) => symbol.symbol === props.row.symbol),
    [],
  )

  const isSymbolInWatchlist = useMemo(
    () => watchlists.some(checkSymbolInWatchlist),
    [watchlists, checkSymbolInWatchlist],
  )
  // // TODO: move useEffect to a hook
  // // useEffect(() => {
  // if (watchlists.length > 0) {
  //   // Add the watchlist items to the menu
  //   const items = watchlists.map((watchlist): MenuItem => {
  //     const isSymbolInWatchlist = checkSymbolInWatchlist(watchlist)
  //     return {
  //       label: watchlist.name,
  //       icon: `pi ${isSymbolInWatchlist ? 'pi-star-fill text-yellow-500' : 'pi-star'}`,
  //       command: () => {
  //         if (isSymbolInWatchlist) {
  //           removeFromWatchlist(watchlist.name, props)
  //           return
  //         }

  //         addToWatchlist(watchlist.name, props)
  //       },
  //     }
  //   })

  //   menuItems = [
  //     {
  //       id: 'add-to-watchlist',
  //       label: 'Add to Watchlist',
  //       items,
  //     },
  //     ...menuItems.filter((item) => item.id !== 'add-to-watchlist'),
  //   ]
  // }

  return (
    <>
      <IconButton
        color={isSymbolInWatchlist ? 'warning' : 'default'}
        aria-label="add to watchlist"
        aria-describedby={id}
        onClick={handleClick}
        size="small"
        sx={{ mr: 2 }}
        aria-controls={open ? 'watchlist-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {isSymbolInWatchlist ? <StarRateRoundedIcon /> : <StarOutlineRoundedIcon />}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={9}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List sx={{ padding: 0 }} aria-label="watchlist" dense>
          {watchlists.length > 0 && (
            <>
              {watchlists.map((watchlist) => {
                const isSymbolInWatchlist = checkSymbolInWatchlist(watchlist)
                return (
                  <ListItem sx={{ paddingInline: 1 }} key={watchlist.name} dense>
                    <ListItemButton
                      onClick={() => {
                        if (isSymbolInWatchlist) {
                          removeFromWatchlist(watchlist.name, props.row)
                        } else {
                          addToWatchlist(watchlist.name, props.row)
                        }
                      }}
                    >
                      <ListItemIcon>
                        {isSymbolInWatchlist ? <StarRateRoundedIcon color="warning" /> : <StarOutlineRoundedIcon />}
                      </ListItemIcon>
                      <ListItemText primary={watchlist.name} />
                    </ListItemButton>
                  </ListItem>
                )
              })}
              <Divider />
            </>
          )}
          <ListItem sx={{ paddingInline: 1 }}>
            <WatchlistAddInput />
          </ListItem>
        </List>
      </Popover>
    </>
  )
}
// TODO: extract the toast to the root component and add the toast ref to main store (symbataStore.ts) to be used in all components

export default AddToWatchListButton
