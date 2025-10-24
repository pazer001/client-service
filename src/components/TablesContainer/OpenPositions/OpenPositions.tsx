import { useEffect, useMemo } from 'react'
import { Box, Card, CardContent, CircularProgress, Grid, styled, Typography } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { useSymbataStoreActions, useSymbataStoreOpenPositions } from '../../../stores/symbataStore.ts'
import { IOpenPosition } from '../../../stores/symbataStore.types.ts'
import { formatNumber } from '../../../utils/utils.ts'
import { green, red } from '@mui/material/colors'

const PositionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
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
}

const PositionItem = ({ position }: PositionItemProps) => {
  const isProfit = position.profit > 0
  const profitColor = isProfit ? green[700] : red[700]
  const profitBgColor = isProfit ? green[50] : red[50]

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
              <MetricValue sx={{ color: profitColor, fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                {isProfit ? '+' : ''}${Math.abs(position.profit).toFixed(2)}
              </MetricValue>
            </MetricBox>
            <MetricBox sx={{ alignItems: { xs: 'flex-end', sm: 'flex-start' } }}>
              <MetricLabel>ROR</MetricLabel>
              <MetricValue sx={{ color: profitColor, fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                {position.currentROR > 0 ? '+' : ''}
                {position.currentROR.toFixed(2)}%
              </MetricValue>
            </MetricBox>
          </Box>
        </Box>

        {/* Details Grid - Responsive layout */}
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
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
              <MetricValue sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                ${position.currentPrice.toFixed(2)}
              </MetricValue>
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
    <Box sx={{ p: { xs: 1, sm: 2 }, height: 'calc(100dvh - 155px)', overflow: 'auto' }}>
      <Box display="flex" flexDirection="column" gap={{ xs: 1.5, sm: 2 }}>
        {positionsArray.map((position) => (
          <PositionItem key={position.symbol} position={position} />
        ))}
      </Box>
    </Box>
  )
}
