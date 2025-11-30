import { Avatar, Box, FormControl, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material'
import { startCase } from 'lodash'
import { ReactElement, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import {
  useSymbataStoreActions,
  useSymbataStoreProfileValue,
  useSymbataStoreSymbol,
} from '../../stores/symbataStore.ts'
import { EAction, ISymbolItem } from '../../stores/symbataStore.types.ts'
import { formatNumber, getShares } from '../../utils/utils.ts'

function createData(label: string, value: number | string | undefined, renderCell?: () => ReactElement) {
  return { label, value, renderCell }
}

const ActionLabel = (action: EAction): ReactElement => {
  switch (action) {
    case EAction.BUY:
      return <Typography color="success">Buy</Typography>
    case EAction.SELL:
      return <Typography color="error">Sell</Typography>
    case EAction.HOLD:
      return <Typography>Hold</Typography>
    case EAction.ERROR:
      return <Typography color="warning">Error</Typography>
    default:
      return <Typography color="info">Unknown Action</Typography>
  }
}

const AnalyzedResult = () => {
  const symbol: ISymbolItem | undefined = useSymbataStoreSymbol()
  const profileValue = useSymbataStoreProfileValue()
  const { setProfileValue } = useSymbataStoreActions()

  const closeValue =
    symbol?.recommendation?.symbolRestructurePrices.close[
      symbol?.recommendation?.symbolRestructurePrices.close.length - 1
    ] ?? 0
  const stopLoss = symbol?.recommendation?.stopLoss ?? 0
  const stopLossDifference = closeValue - stopLoss

  const stopLossPercentage = (stopLossDifference * 100) / closeValue
  const shares = getShares(profileValue, symbol?.recommendation?.stopLoss ?? 0, 0.02, closeValue)

  const initRows = [
    createData('Symbol', symbol?.symbol, () => (
      <Box height={'100%'} display="flex" alignItems="center" gap={1}>
        <Avatar sx={{ width: 24, height: 24 }} src={symbol?.logo}>
          {symbol?.symbol.charAt(0).toUpperCase()}
        </Avatar>
        <Typography>{symbol?.symbol}</Typography>
      </Box>
    )),
    createData('Company Name', symbol?.name),
    createData('Action', symbol?.recommendation?.action, () =>
      ActionLabel(symbol?.recommendation?.action ?? EAction.ERROR),
    ),
  ]

  const rows =
    symbol?.recommendation?.action === EAction.BUY
      ? [
          ...initRows,
          createData('Stop Loss', `${formatNumber(stopLossPercentage)}%`),
          createData('Buy Shares', shares),
          createData('Strategy', startCase(symbol.recommendation.usedStrategy)),
        ]
      : initRows

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <WebsocketTest />
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
              <TableRow key={row.label}>
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

const WebsocketTest = () => {
  const [_, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [accountId] = useState("1f71bd6d-be84-456f-89e5-925528431139"); // Your account ID

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io('http://localhost:3000');

    newSocket.on('connect', () => {
      console.log('Connected:', newSocket.id);

      // Register accountId
      newSocket.emit('register', { accountId });
    });

    // Listen for messages
    newSocket.on('msgToClient', (message: string) => {
      console.log('Received:', message);
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('algoStatus', (message: string) => {
      console.log('Received:', message);
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('registered', (data) => {
      console.log('Registered:', data);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [accountId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Account: {accountId}</h2>
      <div>
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
}

export default AnalyzedResult
