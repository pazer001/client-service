import { GridRowsProp, Toolbar } from '@mui/x-data-grid'
import { ISymbolItem } from '../../../../stores/symbataStore.types'
import { useTableCustomToolbar } from '../../TableCustomToolbar/TableCustomToolbar.hooks'
import { Box } from '@mui/material'
import {
  LinearProgressToolbar,
  QuickFilterToolbar,
  ScanToolbarButton,
} from '../../TableCustomToolbar/TableCusomToolbar'

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
