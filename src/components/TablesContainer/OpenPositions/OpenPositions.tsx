import { useEffect, useMemo, useState, useRef } from 'react'
import { Box, Card, CardContent, CircularProgress, Grid, styled, Typography, keyframes } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { useSymbataStoreActions, useSymbataStoreOpenPositions } from '../../../stores/symbataStore.ts'
import { IOpenPosition } from '../../../stores/symbataStore.types.ts'
import { formatNumber } from '../../../utils/utils.ts'
import { green, red, yellow } from '@mui/material/colors'

// Flash animation for updated values
const flashAnimation = keyframes`
  0% {
    background-color: ${yellow[200]};
  }
  100% {
    background-color: transparent;
  }
`

const PositionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}))

const FlashBox = styled(Box)<{ flash?: boolean }>(({ flash }) => ({
  animation: flash ? `${flashAnimation} 1s ease-out` : 'none',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
}))

const MetricBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}))

const MetricLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}))

const MetricValue = styled(Typography)(() => ({
  fontSize: '1rem',
  fontWeight: 600,
}))

interface PositionItemProps {
  position: IOpenPosition
  flashingFields: Set<string>
}

const PositionItem = ({ position, flashingFields }: PositionItemProps) => {
  const isProfit = position.profit > 0
  const profitColor = isProfit ? green[700] : red[700]
  const profitBgColor = isProfit ? green[50] : red[50]

  // Check if specific fields are flashing for this symbol
  const isCurrentPriceFlashing = flashingFields.has(`${position.symbol}-currentPrice`)
  const isProfitFlashing = flashingFields.has(`${position.symbol}-profit`)
  const isRORFlashing = flashingFields.has(`${position.symbol}-currentROR`)

  return (
    <PositionCard>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        {/* Header: Symbol, Icon and Main Stats - Always visible on top */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: '50%',
                bgcolor: profitBgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isProfit ? (
                <TrendingUpIcon sx={{ color: profitColor, fontSize: { xs: 24, sm: 28 } }} />
              ) : (
                <TrendingDownIcon sx={{ color: profitColor, fontSize: { xs: 24, sm: 28 } }} />
              )}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {position.symbol}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {position.tradeType.toUpperCase()}
              </Typography>
            </Box>
          </Box>

          {/* Profit/Loss - Prominent on the right */}
          <Box display="flex" gap={2}>
            <MetricBox sx={{ alignItems: { xs: 'flex-end', sm: 'flex-start' } }}>
              <MetricLabel>Profit/Loss</MetricLabel>
              <FlashBox flash={isProfitFlashing}>
                <MetricValue sx={{ color: profitColor, fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                  {isProfit ? '+' : ''}${Math.abs(position.profit).toFixed(2)}
                </MetricValue>
              </FlashBox>
            </MetricBox>
            <MetricBox sx={{ alignItems: { xs: 'flex-end', sm: 'flex-start' } }}>
              <MetricLabel>ROR</MetricLabel>
              <FlashBox flash={isRORFlashing}>
                <MetricValue sx={{ color: profitColor, fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                  {position.currentROR > 0 ? '+' : ''}
                  {position.currentROR.toFixed(2)}%
                </MetricValue>
              </FlashBox>
            </MetricBox>
          </Box>
        </Box>

        {/* Details Grid - Responsive layout */}
        <Grid container spacing={{ xs: 1.5, sm: 2 }} columnGap={3}>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <MetricBox>
              <MetricLabel>Buy Price</MetricLabel>
              <MetricValue sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                ${position.buyPrice.toFixed(2)}
              </MetricValue>
            </MetricBox>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <MetricBox>
              <MetricLabel>Current</MetricLabel>
              <FlashBox flash={isCurrentPriceFlashing}>
                <MetricValue sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  ${position.currentPrice.toFixed(2)}
                </MetricValue>
              </FlashBox>
            </MetricBox>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <MetricBox>
              <MetricLabel>Shares</MetricLabel>
              <MetricValue sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {formatNumber(position.shares)}
              </MetricValue>
            </MetricBox>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <MetricBox>
              <MetricLabel>Invested</MetricLabel>
              <MetricValue sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                ${formatNumber(position.buyAmount)}
              </MetricValue>
            </MetricBox>
          </Grid>

          <Grid size={12}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              {position.usedStrategy}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </PositionCard>
  )
}

const EmptyState = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="calc(100dvh - 200px)"
    gap={2}
  >
    <Typography variant="h6" color="text.secondary">
      No Open Positions
    </Typography>
    <Typography variant="body2" color="text.secondary">
      You currently have no open positions in your portfolio
    </Typography>
  </Box>
)

const LoadingState = () => (
  <Box display="flex" alignItems="center" justifyContent="center" height="calc(100dvh - 200px)">
    <CircularProgress size={40} />
  </Box>
)

export const OpenPositions = () => {
  const { getOpenPositions } = useSymbataStoreActions()
  const openPositions = useSymbataStoreOpenPositions()
  const [flashingFields, setFlashingFields] = useState<Set<string>>(new Set())
  const previousPositionsRef = useRef<Record<string, IOpenPosition>>({})

  useEffect(() => {
    // Fetch immediately on mount
    getOpenPositions()

    // Set up polling every 1 minute (60000ms)
    const intervalId = setInterval(() => {
      getOpenPositions()
    }, 60000)

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [getOpenPositions])

  // Detect changes and trigger flash animation
  useEffect(() => {
    if (!openPositions) return

    const newFlashingFields = new Set<string>()

    // Compare current positions with previous positions
    Object.keys(openPositions).forEach((symbol) => {
      const currentPos = openPositions[symbol]
      const previousPos = previousPositionsRef.current[symbol]

      if (previousPos) {
        // Check if currentPrice changed
        if (currentPos.currentPrice !== previousPos.currentPrice) {
          newFlashingFields.add(`${symbol}-currentPrice`)
        }
        // Check if profit changed
        if (currentPos.profit !== previousPos.profit) {
          newFlashingFields.add(`${symbol}-profit`)
        }
        // Check if ROR changed
        if (currentPos.currentROR !== previousPos.currentROR) {
          newFlashingFields.add(`${symbol}-currentROR`)
        }
      }
    })

    // Update flashing fields if there are changes
    if (newFlashingFields.size > 0) {
      setFlashingFields(newFlashingFields)

      // Clear flashing after animation completes (1 second)
      setTimeout(() => {
        setFlashingFields(new Set())
      }, 1000)
    }

    // Update previous positions reference
    previousPositionsRef.current = { ...openPositions }
  }, [openPositions])

  const positionsArray = useMemo(() => {
    if (!openPositions) return []
    return Object.values(openPositions)
  }, [openPositions])

  if (!openPositions) {
    return <LoadingState />
  }

  if (positionsArray.length === 0) {
    return <EmptyState />
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, height: 'calc(100dvh - 75px)', overflow: 'auto' }}>
      <Box display="flex" flexDirection="column" gap={{ xs: 1.5, sm: 2 }}>
        {positionsArray.map((position) => (
          <PositionItem key={position.symbol} position={position} flashingFields={flashingFields} />
        ))}
      </Box>
    </Box>
  )
}
