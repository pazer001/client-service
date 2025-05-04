import Box from '@mui/material/Box'
import {
  DataGrid,
  GridColDef,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  Toolbar,
  ToolbarButton,
  ToolbarProps,
} from '@mui/x-data-grid'
import { InputAdornment, TextField, Tooltip } from '@mui/material'
import { useSymbolTable } from './SymbolTable.hook'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel'
import { ISymbolItem } from '../../stores/symbataStore.types'

interface ICustomToolbarProps extends ToolbarProps {
  onScanSymbols: () => void
}

interface ISymbolTableProps {
  columns: GridColDef<ISymbolItem>[]
}

export function CustomToolbar({ onScanSymbols }: ICustomToolbarProps) {
  return (
    <Toolbar>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Tooltip title="Scan Symbols for suggestions" placement="top">
          <ToolbarButton onClick={onScanSymbols}>
            <QueryStatsIcon fontSize="small" />
          </ToolbarButton>
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
    </Toolbar>
  )
}

export const SymbolTable = ({ columns }: ISymbolTableProps) => {
  const { isLoading, rows } = useSymbolTable()

  return (
    <DataGrid
      showToolbar
      slots={{ toolbar: () => <CustomToolbar onScanSymbols={() => console.log('Scan Symbols')} /> }}
      density="compact"
      loading={isLoading}
      rows={rows}
      columns={columns}
    />
  )
}
