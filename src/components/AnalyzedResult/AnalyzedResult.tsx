import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { startCase } from 'lodash'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { io, Socket } from 'socket.io-client'

import {
  useSymbataStoreActions,
  useSymbataStoreProfileValue,
  useSymbataStoreSymbol,
  useSymbataStoreUserId,
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
  text: string
  type: 'general' | 'recommendation' | 'buy' | 'sell'
  timestamp: Date
  /** Only present for 'sell' type messages - positive means profit, negative means loss */
  profit?: number
}

// TODO: Remove mock data generation before production - only for testing virtualization
const USE_MOCK_DATA = false

const mockMessages: readonly string[] = [
  'Analyzing AAPL - checking RSI indicators...',
  'AAPL RSI at 65.3 - within normal range',
  'Scanning MSFT for entry opportunities...',
  'MSFT showing bullish divergence on 4H chart',
  'Executing BUY order for GOOGL @ $142.50',
  'Order filled: 50 shares of GOOGL',
  'Stop loss set at $138.20 for GOOGL position',
  'NVDA triggered resistance level at $480',
  'Monitoring META earnings announcement...',
  'TSLA volatility spike detected - holding position',
  'Portfolio rebalancing initiated...',
  'Closing partial position in AMD - taking profits',
  'AMZN support level holding at $175',
  'Analyzing sector rotation signals...',
  'Tech sector showing relative strength',
]

const generateMockMessage = (): LogMessage => {
  const types: LogMessage['type'][] = ['general', 'recommendation', 'buy', 'sell']
  const type = types[Math.floor(Math.random() * types.length)]

  const message: LogMessage = {
    text: mockMessages[Math.floor(Math.random() * mockMessages.length)],
    type,
    timestamp: new Date(),
  }

  // Add profit only for sell messages (random between -500 and 500)
  if (type === 'sell') {
    message.profit = Math.round((Math.random() - 0.5) * 1000)
  }

  return message
}

const getSellColorByProfit = (profit: number | undefined): { border: string; chip: 'success' | 'error' | 'info' } => {
  if (profit === undefined || profit === 0) return { border: 'info.main', chip: 'info' }
  if (profit > 0) return { border: 'success.main', chip: 'success' }
  return { border: 'error.main', chip: 'error' }
}

const getMessageBorderColor = (msg: LogMessage): string => {
  switch (msg.type) {
    case 'buy':
      return 'info.main'
    case 'sell':
      return getSellColorByProfit(msg.profit).border
    case 'recommendation':
      return 'warning.main'
    case 'general':
    default:
      return 'grey.500'
  }
}

const getMessageChipColor = (msg: LogMessage): 'default' | 'error' | 'warning' | 'info' | 'success' => {
  switch (msg.type) {
    case 'buy':
      return 'info'
    case 'sell':
      return getSellColorByProfit(msg.profit).chip
    case 'recommendation':
      return 'warning'
    case 'general':
    default:
      return 'default'
  }
}

const generateInitialMockMessages = (count: number): LogMessage[] => {
  const messages: LogMessage[] = []
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    const types: LogMessage['type'][] = ['general', 'recommendation', 'buy', 'sell']
    const type = types[Math.floor(Math.random() * types.length)]

    const message: LogMessage = {
      text: `[${i + 1}] ${mockMessages[i % mockMessages.length]}`,
      type,
      // Stagger timestamps by 2 seconds each for realism
      timestamp: new Date(now - (count - i) * 2000),
    }

    // Add profit only for sell messages
    if (type === 'sell') {
      message.profit = Math.round((Math.random() - 0.5) * 1000)
    }

    messages.push(message)
  }
  return messages
}

const Messages = () => {
  const [_, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<LogMessage[]>(() => (USE_MOCK_DATA ? generateInitialMockMessages(50) : []))
  const accountId = useSymbataStoreUserId()
  const virtuosoRef = useRef<VirtuosoHandle>(null)

  // Mock: Add a new message every 2 seconds for testing auto-scroll
  useEffect(() => {
    if (!USE_MOCK_DATA) return

    const interval = setInterval(() => {
      setMessages((prev) => [...prev, generateMockMessage()])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (USE_MOCK_DATA) return // Skip socket connection when using mock data

    // Connect to WebSocket server
    const newSocket = io(import.meta.env.VITE_API_HOST)

    newSocket.on('connect', () => {
      console.log('Connected:', newSocket.id)

      // Register accountId
      newSocket.emit('register', { accountId })
    })

    newSocket.on('algoLog', (message: { type: 'general' | 'recommendation' | 'buy' | 'sell'; message: string }) => {
      console.log('Received:', message)
      setMessages((prev) => [...prev, { text: message.message, type: message.type, timestamp: new Date() }])
    })

    newSocket.on('registered', (data) => {
      console.log('Registered:', data)
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.close()
    }
  }, [accountId])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  return (
    <Card
      elevation={3}
      className="bengedi"
      sx={{
        borderRadius: 2,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div" fontWeight={600} color="text.primary">
            Algo Actions:
          </Typography>
          {/* TODO: Remove mock controls before production */}
          {USE_MOCK_DATA && (
            <Box display="flex" alignItems="center" gap={1}>
              <Chip label={`${messages.length} messages`} size="small" color="info" />
              <Chip
                label="+ Add 10"
                size="small"
                color="primary"
                onClick={() => {
                  const newMessages = Array.from({ length: 10 }, () => generateMockMessage())
                  setMessages((prev) => [...prev, ...newMessages])
                }}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          )}
        </Box>

        <Box display="flex" flex={1} overflow="hidden">
          {messages.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                Waiting for messages...
              </Typography>
            </Box>
          ) : (
            <Virtuoso
              ref={virtuosoRef}
              data={messages}
              style={{ flex: 1 }}
              followOutput="smooth"
              components={{
                // Custom Scroller with scroll-snap for item-based scrolling
                Scroller: ({ style, ...props }) => (
                  <div
                    {...props}
                    style={{
                      ...style,
                      scrollSnapType: 'y mandatory',
                    }}
                  />
                ),
              }}
              itemContent={(index, msg) => (
                <Paper
                  elevation={0}
                  key={index}
                  sx={{
                    p: 1,
                    mb: 1,
                    borderLeft: 4,
                    borderColor: getMessageBorderColor(msg),
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mb={1}>
                        <Chip
                          label={msg.type.charAt(0).toUpperCase() + msg.type.slice(1)}
                          size="small"
                          color={getMessageChipColor(msg)}
                          variant="outlined"
                        />
                        <Chip label={formatTime(msg.timestamp)} size="small" />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                          wordBreak: 'break-word',
                          color: '#ffffff',
                        }}
                      >
                        {msg.text}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
export default AnalyzedResult
