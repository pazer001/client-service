import { useMemo, useState } from 'react'
import { useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'
import { FormControl, FormHelperText, IconButton, InputAdornment, TextField } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'

export const WatchlistAddInput = () => {
  const [value, setValue] = useState('')
  const { addWatchlist } = useWatchlistStoreActions()
  const watchlists = useWatchlistStoreWatchlists()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  const handleClick = () => {
    addWatchlist(value)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isWatchlistExists && value.length > 0) {
      handleClick()
    }
  }

  const isWatchlistExists = useMemo(() => watchlists.some((watchlist) => watchlist.name === value), [value])

  return (
    <FormControl error={isWatchlistExists} variant="standard">
      <TextField
        fullWidth
        sx={{ maxWidth: '200px' }}
        autoFocus={watchlists.length === 0}
        size="small"
        placeholder="Create Watchlist"
        name="watchlist"
        id="watchlist"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-describedby="component-error-text"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  color="primary"
                  disabled={value.length === 0 || isWatchlistExists}
                  onClick={handleClick}
                >
                  <AddBoxIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      {isWatchlistExists && <FormHelperText id="component-error-text">Watchlist already exists</FormHelperText>}
    </FormControl>
  )
}
