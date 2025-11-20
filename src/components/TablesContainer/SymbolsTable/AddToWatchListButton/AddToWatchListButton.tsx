import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import { IconButton } from '@mui/material'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { ISymbolItem } from '../../../../stores/symbataStore.types.ts'
import { IWatchlist, useWatchlistStoreWatchlists } from '../../../../stores/watchlistStore.ts'
import { WatchlistMenu } from './WatchlistMenu.tsx'

const AddToWatchListButton = (props: ISymbolItem): ReactNode => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const watchlists = useWatchlistStoreWatchlists()

  const checkSymbolInWatchlist = useCallback(
    (watchlist: IWatchlist) => watchlist.symbols.some((symbol) => symbol.symbol === props.symbol),
    [],
  )

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isSymbolInWatchlist = useMemo(
    () => watchlists.some(checkSymbolInWatchlist),
    [watchlists, checkSymbolInWatchlist],
  )

  const open = Boolean(anchorEl)
  const id = open ? 'watchlist-menu-popper' : undefined

  return (
    <>
      <IconButton
        color={isSymbolInWatchlist ? 'warning' : 'default'}
        aria-label="add to watchlist"
        id={id}
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'watchlist-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {isSymbolInWatchlist ? <StarRateRoundedIcon /> : <StarOutlineRoundedIcon />}
      </IconButton>
      <WatchlistMenu id={id} symbolItem={props} onClose={handleClose} anchorEl={anchorEl} open={open} />
    </>
  )
}
// TODO: extract the toast to the root component and add the toast ref to main store (symbataStore.ts) to be used in all components

export default AddToWatchListButton
