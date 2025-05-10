import { InputAdornment, Box, TextField, Tooltip, LinearProgress } from '@mui/material'
import {
  GridRowsProp,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  Toolbar,
  ToolbarButton,
} from '@mui/x-data-grid'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel'
import { useMemo, useState } from 'react'
import { useSymbataStoreActions } from '../../../stores/symbataStore'
import { ISymbolItem } from '../../../stores/symbataStore.types'
import { chunk } from 'lodash'

interface ITableCustomToolbarProps {
  rows: GridRowsProp<ISymbolItem>
  symbolsToScan: number
  updateSymbolInList: (symbol: ISymbolItem) => void
}

export const TableCustomToolbar = ({ rows, symbolsToScan, updateSymbolInList }: ITableCustomToolbarProps) => {
  const { getRecommendation } = useSymbataStoreActions()
  const [isScanning, setIsScanning] = useState(false)
  const [chunkIndex, setChunkIndex] = useState(0)
  const maxChuckIndex = Math.ceil(rows.length / symbolsToScan)
  const [currentScanSymbolIndex, setCurrentSymbolIndex] = useState(0)
  const symbolsChunk = useMemo(() => chunk(rows, symbolsToScan)[chunkIndex], [chunkIndex, rows]) ?? []

  const handleScanSymbols = async () => {
    setIsScanning(true)

    for (const symbol of symbolsChunk) {
      const symbolLoading = { ...symbol, loading: true }
      updateSymbolInList(symbolLoading)
      try {
        const recommendation = await getRecommendation(symbol)

        const symbolWithRecommendation = { ...symbol, recommendation, loading: false }
        updateSymbolInList(symbolWithRecommendation)
        setCurrentSymbolIndex((p) => p + 1)
      } catch (error) {
        console.error(error)
      }
    }
    setIsScanning(false)
    if (chunkIndex < maxChuckIndex - 1) {
      setChunkIndex(chunkIndex + 1)
      setCurrentSymbolIndex(0)
    } else if (chunkIndex === maxChuckIndex - 1) {
      setChunkIndex(0)
      setCurrentSymbolIndex(0)
    }
  }

  return (
    <Box>
      <Toolbar>
        <Box display="flex" flexDirection="column" width="100%">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Tooltip title="Scan Symbols for suggestions" placement="top">
              <span>
                <ToolbarButton disabled={isScanning} onClick={handleScanSymbols}>
                  <QueryStatsIcon fontSize="small" />
                </ToolbarButton>
              </span>
            </Tooltip>
            <QuickFilter expanded>
              <QuickFilterControl
                render={({ ref, ...other }) => (
                  <TextField
                    {...other}
                    inputRef={ref}
                    aria-label="Search"
                    placeholder="Search..."
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: other.value ? (
                          <InputAdornment position="end">
                            <QuickFilterClear edge="end" size="small" aria-label="Clear search">
                              <CancelIcon fontSize="small" />
                            </QuickFilterClear>
                          </InputAdornment>
                        ) : null,
                        ...other.slotProps?.input,
                      },
                      ...other.slotProps,
                    }}
                  />
                )}
              />
            </QuickFilter>
          </Box>
        </Box>
      </Toolbar>
      <LinearProgress
        variant="determinate"
        value={(currentScanSymbolIndex / symbolsChunk.length) * 100}
        sx={{ marginInline: '-5px' }}
      />
    </Box>
  )
}
