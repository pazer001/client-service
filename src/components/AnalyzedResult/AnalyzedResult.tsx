import { Box, Typography } from '@mui/material'
import { useSymbataStoreSymbol } from '../../stores/symbataStore.ts'
import { ISymbolItem } from '../../stores/symbataStore.types.ts'

const AnalyzedResult = () => {
  const symbol: ISymbolItem | undefined = useSymbataStoreSymbol()

  return (
    <Box>
      {symbol ? (
        <>
          <Typography>Symbol: {symbol?.symbol}</Typography>
          <Typography>Sector Last Score: {symbol?.priorityScore?.sectorLastScore ?? 0}</Typography>
        </>
      ) : (
        <Typography>No symbol selected</Typography>
      )}
    </Box>
  )
}

export default AnalyzedResult
