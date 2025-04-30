import { useMemo, useState } from 'react'
import { inputBaseClasses } from '@mui/material/InputBase'
import { useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../stores/watchlistStore'
import { Button, FormControl, FormHelperText, InputAdornment, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

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
    if (e.key === 'Enter' && !isWatchlistExists) {
      handleClick()
    }
  }

  const isWatchlistExists = useMemo(() => watchlists.some((watchlist) => watchlist.name === value), [value])

  return (
    <FormControl
      fullWidth
      error={isWatchlistExists}
      variant="standard"
      sx={{ [`& .${inputBaseClasses.root}`]: { paddingRight: '4px' } }}
    >
      <TextField
        fullWidth
        autoFocus={watchlists.length === 0}
        size="small"
        placeholder="Name"
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
                <Button
                  sx={{ minWidth: 0 }}
                  size="small"
                  variant="contained"
                  disabled={value.length === 0 || isWatchlistExists}
                  onClick={handleClick}
                >
                  <AddIcon />
                </Button>
              </InputAdornment>
            ),
          },
        }}
      />
      {isWatchlistExists && <FormHelperText id="component-error-text">Watchlist already exists</FormHelperText>}
    </FormControl>
  )
}
