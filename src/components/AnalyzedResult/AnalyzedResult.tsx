import FilterListIcon from '@mui/icons-material/FilterList'
import { Box, Card, CardContent, Chip, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { io, Socket } from 'socket.io-client'
import { useSymbataStoreUserId } from '../../stores/symbataStore'

const AnalyzedResult = () => {
  return <Messages />
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
      return 'secondary.main'
    default:
      return 'grey.500'
  }
}

const getMessageChipColor = (msg: LogMessage): 'default' | 'error' | 'warning' | 'info' | 'success' | 'secondary' => {
  switch (msg.type) {
    case 'buy':
      return 'info'
    case 'sell':
      return getSellColorByProfit(msg.profit).chip
    case 'recommendation':
      return 'warning'
    case 'general':
      return 'secondary'
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
  const [activeFilter, setActiveFilter] = useState<LogMessage['type'] | 'all' | 'sell-positive' | 'sell-negative'>(
    'all',
  )
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null)

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

    newSocket.on(
      'algoLog',
      (message: { type: 'general' | 'recommendation' | 'buy' | 'sell'; message: string; profit?: number }) => {
        console.log('Received:', message)
        setMessages((prev) => [
          ...prev,
          {
            text: message.message,
            type: message.type,
            timestamp: new Date(),
            // Include profit for sell messages if provided by server
            ...(message.type === 'sell' && message.profit !== undefined ? { profit: message.profit } : {}),
          },
        ])
      },
    )

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

  const filteredMessages = useMemo(() => {
    switch (activeFilter) {
      case 'all':
        return messages
      case 'sell':
        return messages.filter((m) => m.type === 'sell')
      case 'sell-positive':
        return messages.filter((m) => m.type === 'sell' && m.profit !== undefined && m.profit > 0)
      case 'sell-negative':
        return messages.filter((m) => m.type === 'sell' && m.profit !== undefined && m.profit < 0)
      default:
        return messages.filter((m) => m.type === activeFilter)
    }
  }, [messages, activeFilter])

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div" fontWeight={600} color="text.primary">
            Algo Actions:
          </Typography>
          {/* TODO: Remove mock controls before production */}
          {USE_MOCK_DATA && (
            <Box display="flex" alignItems="center" gap={1}>
              <Chip label={`${filteredMessages.length} / ${messages.length} messages`} size="small" color="info" />
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

        <Box display="flex" alignItems="center" justifyContent="space-between" gap={0.5} mb={1}>
          <Chip
            label={(() => {
              switch (activeFilter) {
                case 'all':
                  return 'All'
                case 'sell':
                  return 'Sell / All'
                case 'sell-positive':
                  return 'Sell / Positive'
                case 'sell-negative':
                  return 'Sell / Negative'
                default:
                  return activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)
              }
            })()}
            size="small"
            color={(() => {
              switch (activeFilter) {
                case 'all':
                  return 'default'
                case 'sell':
                  return 'info'
                case 'sell-positive':
                  return 'success'
                case 'sell-negative':
                  return 'error'
                default:
                  return getMessageChipColor({ type: activeFilter } as LogMessage)
              }
            })()}
          />
          <IconButton size="small" aria-label="Open filter menu" onClick={(e) => setFilterMenuAnchor(e.currentTarget)}>
            <FilterListIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={() => setFilterMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                setActiveFilter('all')
                setFilterMenuAnchor(null)
              }}
            >
              <Chip label="All" size="small" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setActiveFilter('general')
                setFilterMenuAnchor(null)
              }}
            >
              <Chip label="General" size="small" color="secondary" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setActiveFilter('recommendation')
                setFilterMenuAnchor(null)
              }}
            >
              <Chip label="Recommendation" size="small" color="warning" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setActiveFilter('buy')
                setFilterMenuAnchor(null)
              }}
            >
              <Chip label="Buy" size="small" color="info" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setActiveFilter('sell')
                setFilterMenuAnchor(null)
              }}
            >
              <Chip label="Sell / All" size="small" color="info" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setActiveFilter('sell-positive')
                setFilterMenuAnchor(null)
              }}
            >
              <Chip label="Sell / Positive" size="small" color="success" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setActiveFilter('sell-negative')
                setFilterMenuAnchor(null)
              }}
            >
              <Chip label="Sell / Negative" size="small" color="error" />
            </MenuItem>
          </Menu>
        </Box>

        <Box display="flex" flex={1} overflow="hidden">
          {filteredMessages.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                {messages.length === 0 ? 'Waiting for messages...' : 'No messages match the filter'}
              </Typography>
            </Box>
          ) : (
            <Virtuoso
              ref={virtuosoRef}
              data={filteredMessages}
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
              itemContent={(_index, msg) => (
                <Paper
                  elevation={0}
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
