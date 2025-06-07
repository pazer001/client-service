import { Box, FormControl, TextField, Typography } from '@mui/material'
import {
  useSymbataStoreActions,
  useSymbataStoreProfileValue,
  useSymbataStoreSymbol
} from '../../stores/symbataStore.ts'
import { ISymbolItem } from '../../stores/symbataStore.types.ts'
import { getShares } from '../../utils/utils.ts'

const AnalyzedResult = () => {
  const symbol: ISymbolItem | undefined = useSymbataStoreSymbol()
  const profileValue = useSymbataStoreProfileValue()
  const { setProfileValue } = useSymbataStoreActions()

  const shares = getShares(profileValue, symbol?.recommendation?.stopLoss ?? 0, 0.02, 20.05)

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FormControl>
        <TextField
          size="small"
          type="number"
          id="component-outlined"
          value={profileValue}
          onChange={(e) => setProfileValue(Number(e.target.value))}
          label="Profile Value"
        />
      </FormControl>
      {symbol?.recommendation ? (
        <Box>
          <Typography>Symbol: {symbol?.symbol}</Typography>
          <Typography>Sector Last Score: {symbol?.priorityScore?.sectorLastScore ?? 0}</Typography>
          <Typography>Stop Loss: {100 - (symbol.recommendation.stopLoss / 20.05 * 100)}%</Typography>
          <Typography>Amount of Shares: {shares}</Typography>
        </Box>
      ) : (
        <Typography>No symbol selected</Typography>
      )}
    </Box>
  )
}

export default AnalyzedResult
