import { GridRowsProp, Toolbar } from '@mui/x-data-grid'
import { ISymbolItem } from '../../../../stores/symbataStore.types'
import { useTableCustomToolbar } from '../../SymbolsTable/SymbolsTableCustomToolbar/SymbolsTableCustomToolbar.hooks.ts'
import {
  Box,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material'
import { LinearProgressToolbar, ScanToolbarButton } from '../../SymbolsTable/SymbolsTableCustomToolbar/SymbolsTableCustomToolbar.tsx'
import {
  useWatchlistStoreActions,
  useWatchlistStoreCurrentWatchlist,
  useWatchlistStoreWatchlists,
} from '../../../../stores/watchlistStore'
import DeleteIcon from '@mui/icons-material/Delete'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import { useEffect } from 'react'

interface IWatchlistCustomToolbarProps {
  rows: GridRowsProp<ISymbolItem>
  symbolsToScan: number
  updateSymbolInList: (symbol: ISymbolItem) => void
}

export const WatchlistCustomToolbar = ({ rows, symbolsToScan, updateSymbolInList }: IWatchlistCustomToolbarProps) => {
  const { handleScanSymbols, isScanning, currentScanSymbolIndex, symbolsChunk } = useTableCustomToolbar({
    rows,
    symbolsToScan,
    updateSymbolInList,
  })
  const watchlists = useWatchlistStoreWatchlists()
  const currentWatchlist = useWatchlistStoreCurrentWatchlist()
  const { setCurrentWatchlist, removeWatchlist } = useWatchlistStoreActions()

  const handleChange = (event: SelectChangeEvent) => {
    const selectedWatchlist = watchlists.find(
      (watchlist) => watchlist.name === (event.target as HTMLInputElement).value,
    )
    if (!selectedWatchlist) return

    setCurrentWatchlist(selectedWatchlist)
  }

  const handleRemoveWatchlist = (watchlistName: string) => () => {
    removeWatchlist(watchlistName)
  }

  useEffect(() => {
    if(watchlists.length && !currentWatchlist) {
      setCurrentWatchlist(watchlists[0])
    }
  }, [])

  return (
    <Box>
      <Toolbar>
        <Box display="flex" flexDirection="column" width="100%">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <ScanToolbarButton
              disabled={isScanning}
              tooltip="Scan Symbols for suggestions"
              handleScanSymbols={handleScanSymbols}
            />
            <Select
              fullWidth
              size="small"
              sx={{ maxWidth: '238px' }}
              value={currentWatchlist?.name || ''}
              onChange={handleChange}
              displayEmpty
              renderValue={(value) => {
                if (value.length === 0) {
                  return (
                    <Box component={'i'} sx={{ opacity: 'var(--mui-opacity-inputPlaceholder)' }}>
                      Select...
                    </Box>
                  )
                }
                const selectedWatchlist = watchlists.find((watchlist) => watchlist.name === value)

                return selectedWatchlist ? selectedWatchlist.name : ''
              }}
              startAdornment={
                <InputAdornment position="start">
                  <StarRateRoundedIcon color={currentWatchlist?.name ? 'warning' : 'inherit'} fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem sx={{ display: 'none' }} value=""></MenuItem>
              {watchlists.map((watchlist) => (
                <MenuItem dense key={watchlist.name} value={watchlist.name}>
                  <ListItemText primary={watchlist.name} />
                  <Tooltip title={`Delete "${watchlist.name}" watchlist`} placement="top">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      size="small"
                      onClick={handleRemoveWatchlist(watchlist.name)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Toolbar>
      <LinearProgressToolbar index={currentScanSymbolIndex} total={symbolsChunk.length} />
    </Box>
  )
}
