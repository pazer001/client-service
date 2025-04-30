import { useMemo, useState } from 'react'
import { useWatchlistStoreActions, useWatchlistStoreWatchlists } from '../../../../stores/watchlistStore'
import { Box, Button, FormControl, FormHelperText, InputAdornment, TextField } from '@mui/material'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'

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
    if (e.key === 'Enter') {
      handleClick()
    }
  }

  const isWatchlistExists = useMemo(() => watchlists.some((watchlist) => watchlist.name === value), [value])

  return (
    <FormControl fullWidth error={isWatchlistExists} variant="standard">
      <Box>
        <TextField
          fullWidth
          autoFocus
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
                    variant="text"
                    disabled={value.length === 0 || isWatchlistExists}
                    onClick={handleClick}
                  >
                    <AddBoxRoundedIcon />
                  </Button>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      {isWatchlistExists && <FormHelperText id="component-error-text">Watchlist already exists</FormHelperText>}
    </FormControl>
  )
}
