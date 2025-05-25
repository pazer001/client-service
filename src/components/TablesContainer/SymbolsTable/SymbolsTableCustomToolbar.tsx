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
import { ISymbolItem } from '../../../stores/symbataStore.types.ts'
import { useTableCustomToolbar } from '../../../hooks/useTableCustomToolbar.ts'

interface ITableCustomToolbarProps {
  rows: GridRowsProp<ISymbolItem>
  symbolsToScan: number
  updateSymbolInList: (symbol: ISymbolItem) => void
}

interface IScanToolbarButtonProps {
  tooltip?: string
  disabled?: boolean
  handleScanSymbols?: () => Promise<void>
}

export const ScanToolbarButton = ({ disabled, tooltip, handleScanSymbols }: IScanToolbarButtonProps) => {
  return (
    <Tooltip title={tooltip} placement="top">
      <span>
        <ToolbarButton disabled={disabled} onClick={handleScanSymbols}>
          <QueryStatsIcon fontSize="small" />
        </ToolbarButton>
      </span>
    </Tooltip>
  )
}

export const QuickFilterToolbar = () => {
  return (
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
  )
}

interface ILinearProgressToolbarProps {
  index: number
  total: number
}

export const LinearProgressToolbar = ({ index, total }: ILinearProgressToolbarProps) => {
  return <LinearProgress variant="determinate" value={(index / total) * 100} sx={{ marginInline: '-5px' }} />
}

export const SymbolsTableCustomToolbar = ({ rows, symbolsToScan, updateSymbolInList }: ITableCustomToolbarProps) => {
  const { handleScanSymbols, isScanning, currentScanSymbolIndex, symbolsChunk } = useTableCustomToolbar({
    rows,
    symbolsToScan,
    updateSymbolInList,
  })

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
            <QuickFilterToolbar />
          </Box>
        </Box>
      </Toolbar>
      <LinearProgressToolbar index={currentScanSymbolIndex} total={symbolsChunk.length} />
    </Box>
  )
}
