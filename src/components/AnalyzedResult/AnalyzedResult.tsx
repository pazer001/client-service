import { Avatar, Box, FormControl, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material'
import {
  useSymbataStoreActions,
  useSymbataStoreProfileValue,
  useSymbataStoreSymbol
} from '../../stores/symbataStore.ts'
import { EAction, ISymbolItem } from '../../stores/symbataStore.types.ts'
import { formatNumber, getShares } from '../../utils/utils.ts'
import { startCase } from 'lodash'
import { ReactElement } from 'react'

function createData(
  label: string,
  value: number | string | undefined,
  renderCell?: () => ReactElement
) {
  return { label, value, renderCell };
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

  const initRows = [
    createData('Symbol', symbol?.symbol, () => (
      <Box height={"100%"} display="flex" alignItems="center" gap={1}>
        <Avatar sx={{ width: 24, height: 24 }} src={symbol?.logo}>
          {symbol?.symbol.charAt(0).toUpperCase()}
        </Avatar>
        <Typography>{symbol?.symbol}</Typography>
      </Box>
    )),
    createData('Company Name', symbol?.name),
  ]

  const rows = symbol?.recommendation?.action === EAction.BUY
    ? [
      ...initRows,
        createData('Stop Loss', `${formatNumber(stopLossPercentage)}%`),
        createData('Buy Shares', shares),
        createData('Strategy', startCase(symbol.recommendation.usedStrategy)),
      ]
    : initRows;

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
                <TableCell>{row?.renderCell ? row?.renderCell() : row.value}</TableCell>
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
