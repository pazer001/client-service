import Box from '@mui/material/Box'
import {
  DataGrid,
  GridColDef,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  Toolbar,
  ToolbarButton,
} from '@mui/x-data-grid'
import { InputAdornment, LinearProgress, TextField, Tooltip } from '@mui/material'
import { useSymbolTable } from './SymbolTable.hook'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel'
import { ISymbolItem } from '../../stores/symbataStore.types'
import { chunk } from 'lodash'
import { useMemo, useState } from 'react'
import { useSymbataStoreActions } from './../../stores/symbataStore'

interface ISymbolTableProps {
  columns: GridColDef<ISymbolItem>[]
}

const chunksOf = 200

interface ICustomToolbarProps {
  isLoadingScan?: boolean
  handleScanSymbols?: () => void
}

export const CustomToolbar = ({ handleScanSymbols, isLoadingScan }: ICustomToolbarProps) => {
  return (
    <Toolbar>
      <Box display="flex" flexDirection="column" width="100%">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Tooltip title="Scan Symbols for suggestions" placement="top">
            <span>
              <ToolbarButton disabled={isLoadingScan} onClick={handleScanSymbols}>
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
  )
}

export const SymbolTable = ({ columns }: ISymbolTableProps) => {
  const { isLoading, rows, handleRowClick, setSymbols } = useSymbolTable()
  const { updateSymbolInList, getRecommendation } = useSymbataStoreActions()
  const [isLoadingScan, setIsLoadingScan] = useState(false)
  const [chunkIndex, setChunkIndex] = useState(0)
  const maxChuckIndex = Math.ceil(rows.length / chunksOf)
  const [currentScanSymbolIndex, setCurrentSymbolIndex] = useState(0)
  const symbolsChunk = useMemo(() => chunk(rows, chunksOf)[chunkIndex], [chunkIndex, rows]) ?? []

  const handleScanSymbols = async () => {
    setIsLoadingScan(true)

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
    setIsLoadingScan(false)
    if (chunkIndex < maxChuckIndex - 1) {
      setChunkIndex(chunkIndex + 1)
      setCurrentSymbolIndex(0)
    } else if (chunkIndex === maxChuckIndex - 1) {
      setChunkIndex(0)
      setCurrentSymbolIndex(0)
    }
  }

  return (
    <DataGrid
      showToolbar
      slots={{
        toolbar: () => (
          <Box>
            <CustomToolbar isLoadingScan={isLoadingScan} handleScanSymbols={handleScanSymbols} />
            <LinearProgress
              variant="determinate"
              value={(currentScanSymbolIndex / symbolsChunk.length) * 100}
              sx={{ marginInline: '-5px' }}
            />
          </Box>
        ),
      }}
      density="compact"
      loading={isLoading}
      rows={rows}
      columns={columns}
      onRowSelectionModelChange={(newRowSelectionModel, details) => {
        const rowId = Array.from(newRowSelectionModel.ids)[0]
        if (rowId) {
          const rowIndex = rows.findIndex((row) => row.id === rowId)
          if (rowIndex !== undefined) {
            const selectedRow = details.api.getRow(rowId)
            const copiedRows: ISymbolItem[] = [...rows]
            copiedRows[rowIndex] = { ...selectedRow, loading: true }

            setSymbols(copiedRows)
            handleRowClick(selectedRow, rowIndex)
          }
        }
      }}
    />
  )
}
