import FilterListIcon from '@mui/icons-material/FilterList'
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom'
import { Box, Chip, IconButton, Menu, MenuItem, Paper, Tooltip, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'

interface IActionMessagesProps {
  messages: LogMessage[]
}

const ActionMessages = (props:IActionMessagesProps) => {
  return <Messages messages={props.messages} />
}

export interface LogMessage {
  id: string
  text: string
  type: 'general' | 'recommendation' | 'buy' | 'sell'
  timestamp: Date
  /** Only present for 'sell' type messages - positive means profit, negative means loss */
  profit?: number
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

interface MessageItemProps {
  msg: LogMessage
  isNew: boolean
  formatTime: (date: Date) => string
}

/** Separate component to handle slide animation state */
const MessageItem = ({ msg, isNew, formatTime }: MessageItemProps) => {
  // Start with in={false} for new messages, then animate to in={true}
  const [slideIn, setSlideIn] = useState(!isNew)

  useEffect(() => {
    if (isNew && !slideIn) {
      // Trigger animation after component mounts
      const timer = requestAnimationFrame(() => setSlideIn(true))
      return () => cancelAnimationFrame(timer)
    }
  }, [isNew, slideIn])

  return (
    <Box sx={{ overflow: 'hidden', mb: 1, scrollSnapAlign: 'start' }}>
      <Paper
        elevation={0}
        sx={{
          p: 1,
          borderLeft: 4,
          borderColor: getMessageBorderColor(msg),
          borderRadius: 1,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box flex={1}>
            <Tooltip title={msg.text} placement="top" enterDelay={500}>
              <Typography
                variant="body2"
                mb={1}
                sx={{
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: '#ffffff',
                  // Fixed 2-line height with ellipsis for overflow
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // Height = lineHeight (1.6) * fontSize (0.875rem) * 2 lines
                  minHeight: 'calc(0.875rem * 1.6 * 2)',
                }}
              >
                {msg.text}
              </Typography>
            </Tooltip>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
              <Chip
                label={msg.type.charAt(0).toUpperCase() + msg.type.slice(1)}
                size="small"
                color={getMessageChipColor(msg)}
                variant="outlined"
              />
              <Chip label={formatTime(msg.timestamp)} size="small" />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

interface IMessagesProps {
  messages: LogMessage[]
}

const Messages = (props: IMessagesProps) => {
  // Generate initial messages and pre-populate rendered set to avoid animating existing messages
  const [initialMessages] = useState<LogMessage[]>([])


  // Track which messages have been rendered to avoid re-animating on scroll
  // Pre-populate with initial message IDs so they don't animate
  const renderedMessagesRef = useRef<Set<string>>(new Set(initialMessages.map((m) => m.id)))
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [activeFilter, setActiveFilter] = useState<LogMessage['type'] | 'all' | 'sell-positive' | 'sell-negative'>(
    'all',
  )
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null)
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)


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
        return props.messages
      case 'sell':
        return props.messages.filter((m) => m.type === 'sell')
      case 'sell-positive':
        // Include break-even (profit === 0) with positive results since no money was lost
        return props.messages.filter((m) => m.type === 'sell' && m.profit !== undefined && m.profit >= 0)
      case 'sell-negative':
        return props.messages.filter((m) => m.type === 'sell' && m.profit !== undefined && m.profit < 0)
      default:
        return props.messages.filter((m) => m.type === activeFilter)
    }
  }, [props.messages, activeFilter])

  // Reset animation tracking when filter changes to prevent stale state
  // Pre-populate with current filtered messages so only new arrivals animate
  useEffect(() => {
    renderedMessagesRef.current = new Set(filteredMessages.map((m) => m.id))
  }, [activeFilter]) // Only reset on filter change, not on new messages

  // Clean up renderedMessagesRef when messages are removed to prevent memory leak
  // This syncs the Set with current message IDs, removing stale entries
  useEffect(() => {
    const currentIds = new Set(props.messages.map((m) => m.id))
    for (const id of renderedMessagesRef.current) {
      if (!currentIds.has(id)) {
        renderedMessagesRef.current.delete(id)
      }
    }
  }, [props.messages])

  // Auto-scroll to bottom when enabled and new messages arrive
  useEffect(() => {
    if (autoScrollEnabled && filteredMessages.length > 0) {
      requestAnimationFrame(() => {
        virtuosoRef.current?.scrollToIndex({
          index: filteredMessages.length - 1,
          behavior: 'smooth',
        })
      })
    }
  }, [autoScrollEnabled, filteredMessages.length])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" component="div" fontWeight={600} color="text.primary">
          Algo Actions:
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" gap={0.5} mb={1}>
        <Chip
          label={(() => {
            const count = filteredMessages.length.toLocaleString()
            switch (activeFilter) {
              case 'all':
                return `All (${count})`
              case 'sell':
                return `Sell / All (${count})`
              case 'sell-positive':
                return `Sell / Positive (${count})`
              case 'sell-negative':
                return `Sell / Negative (${count})`
              default:
                return `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} (${count})`
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
        <Box display="flex" alignItems="center">
          <Tooltip title="Filter messages" placement="top">
            <IconButton
              id="filter-menu-button"
              size="small"
              aria-label="Open filter menu"
              aria-controls={filterMenuAnchor ? 'filter-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={filterMenuAnchor ? 'true' : undefined}
              onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={autoScrollEnabled ? 'Disable auto-scroll' : 'Enable auto-scroll'} placement="top">
            <IconButton
              size="small"
              aria-label={autoScrollEnabled ? 'Disable auto-scroll' : 'Enable auto-scroll'}
              onClick={() => setAutoScrollEnabled((prev) => !prev)}
              color={autoScrollEnabled ? 'primary' : 'default'}
              sx={{
                transition: 'all 0.2s ease',
                bgcolor: autoScrollEnabled ? 'primary.main' : 'transparent',
                '&:hover': {
                  bgcolor: autoScrollEnabled ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <VerticalAlignBottomIcon fontSize="small" sx={{ color: autoScrollEnabled ? 'white' : 'inherit' }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          id="filter-menu"
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={() => setFilterMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            list: {
              'aria-labelledby': 'filter-menu-button',
            },
          }}
        >
          <MenuItem
            selected={activeFilter === 'all'}
            onClick={() => {
              setActiveFilter('all')
              setFilterMenuAnchor(null)
            }}
          >
            <Chip label="All" size="small" />
          </MenuItem>
          <MenuItem
            selected={activeFilter === 'general'}
            onClick={() => {
              setActiveFilter('general')
              setFilterMenuAnchor(null)
            }}
          >
            <Chip label="General" size="small" color="secondary" />
          </MenuItem>
          <MenuItem
            selected={activeFilter === 'recommendation'}
            onClick={() => {
              setActiveFilter('recommendation')
              setFilterMenuAnchor(null)
            }}
          >
            <Chip label="Recommendation" size="small" color="warning" />
          </MenuItem>
          <MenuItem
            selected={activeFilter === 'buy'}
            onClick={() => {
              setActiveFilter('buy')
              setFilterMenuAnchor(null)
            }}
          >
            <Chip label="Buy" size="small" color="info" />
          </MenuItem>
          <MenuItem
            selected={activeFilter === 'sell'}
            onClick={() => {
              setActiveFilter('sell')
              setFilterMenuAnchor(null)
            }}
          >
            <Chip label="Sell / All" size="small" color="info" />
          </MenuItem>
          <MenuItem
            selected={activeFilter === 'sell-positive'}
            onClick={() => {
              setActiveFilter('sell-positive')
              setFilterMenuAnchor(null)
            }}
          >
            <Chip label="Sell / Positive" size="small" color="success" />
          </MenuItem>
          <MenuItem
            selected={activeFilter === 'sell-negative'}
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
              {props.messages.length === 0 ? 'Waiting for messages...' : 'No messages match the filter'}
            </Typography>
          </Box>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={filteredMessages}
            style={{ flex: 1 }}
            itemContent={(_index, msg) => {
              // Check if this message has been rendered before
              const isNewMessage = !renderedMessagesRef.current.has(msg.id)
              if (isNewMessage) {
                renderedMessagesRef.current.add(msg.id)
              }

              return <MessageItem msg={msg} isNew={isNewMessage} formatTime={formatTime} />
            }}
          />
        )}
      </Box>
    </Box>
  )
}
export default ActionMessages
