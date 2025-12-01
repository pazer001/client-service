import { Avatar, Box, Card, CardContent, Chip, FormControl, Paper, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material'
import { startCase } from 'lodash'
import { ReactElement, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import {
  useSymbataStoreActions,
  useSymbataStoreProfileValue,
  useSymbataStoreSymbol,
  useSymbataStoreUserId
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
return <Messages />
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Messages />
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

interface LogMessage {
  text: string;
  type: 'msgToClient' | 'algoLog';
  timestamp: Date;
}

const Messages = () => {
  const [_, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<LogMessage[]>([]);
  const accountId = useSymbataStoreUserId();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io(import.meta.env.VITE_API_HOST);

    newSocket.on('connect', () => {
      console.log('Connected:', newSocket.id);

      // Register accountId
      newSocket.emit('register', { accountId });
    });

    // Listen for messages
    newSocket.on('msgToClient', (message: string) => {
      console.log('Received:', message);
      setMessages(prev => [...prev, { text: message, type: 'msgToClient', timestamp: new Date() }]);
    });

    newSocket.on('algoLog', (message: string) => {
      console.log('Received:', message);
      setMessages(prev => [...prev, { text: message, type: 'algoLog', timestamp: new Date() }]);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const getMessageTypeColor = (type: LogMessage['type']) => {
    return type === 'algoLog' ? 'primary' : 'secondary';
  };

  // const getMessageTypeLabel = (type: LogMessage['type']) => {
  //   return type === 'algoLog' ? 'Algorithm' : 'Server';
  // };

  return (
    <Card 
      elevation={3}
      sx={{
        borderRadius: 2,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div" fontWeight={600} color="text.primary">
            Algo Actions:
          </Typography>

        </Box>
        
        <Paper 
          variant="outlined" 
          sx={{ 
            // flex: 1,
            overflowY: 'scroll',
            p: 1,
            // borderRadius: 1
          }}
        >
          {messages.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                Waiting for messages...
              </Typography>
            </Box>
          ) : (
            <Box>
              {messages.slice().map((msg, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    p: 1,
                    mb: 1,
                    borderLeft: 4,
                    borderColor: msg.type === 'algoLog' ? '#1976d2' : '#9c27b0',
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                    // '&:hover': {
                    //   boxShadow: 2
                    // },
                    // '&:last-child': {
                    //   mb: 0
                    // }
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Chip
                          label={formatTime(msg.timestamp)}
                          size="small"
                          color={getMessageTypeColor(msg.type)}
                          sx={{ 
                            height: 22, 
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                          wordBreak: 'break-word',
                          color: '#ffffff'
                        }}
                      >
                        {msg.text}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
              <div ref={messagesEndRef} />
            </Box>
          )}
        </Paper>
      </CardContent>
    </Card>
  );
}
export default AnalyzedResult
