import { Box, FormControl, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material'
import {
  useSymbataStoreActions,
  useSymbataStoreProfileValue,
  useSymbataStoreSymbol
} from '../../stores/symbataStore.ts'
import { EAction, ISymbolItem } from '../../stores/symbataStore.types.ts'
import { formatNumber, getShares } from '../../utils/utils.ts'

function createData(
  label: string,
  value: number | string | undefined,
) {
  return { label, value };
}

const AnalyzedResult = () => {
  const symbol: ISymbolItem | undefined = useSymbataStoreSymbol()
  const profileValue = useSymbataStoreProfileValue()
  const { setProfileValue } = useSymbataStoreActions()

  const closeValue = symbol?.recommendation?.symbolRestructurePrices.close[symbol?.recommendation?.symbolRestructurePrices.close.length - 1] ?? 0
  const stopLoss = symbol?.recommendation?.stopLoss ?? 0;
  const stopLossDifference = closeValue - stopLoss;

  const stopLossPercentage = (stopLossDifference * 100) / closeValue;
  const shares = getShares(profileValue, symbol?.recommendation?.stopLoss ?? 0, 0.02, closeValue)

  const rows = symbol?.recommendation?.action === EAction.BUY
    ? [
        createData('Symbol', symbol?.symbol),
        createData('Stop Loss', `${formatNumber(stopLossPercentage)}%`),
        createData('Amount of Shares', shares),
        createData('Strategy', symbol.recommendation.usedStrategy),
      ]
    : [
        createData('Symbol', symbol?.symbol)
    ];

  return (
    <Box display="flex" flexDirection="column" gap={1}>
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
        <Table size="small" aria-label="a dense table">
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.label}
              >
                <TableCell component="th" scope="row">
                  {row.label}
                </TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>No symbol selected</Typography>
      )}
    </Box>
  )
}

export default AnalyzedResult
