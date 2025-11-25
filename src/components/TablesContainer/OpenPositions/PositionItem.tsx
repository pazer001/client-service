import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, CardActionArea, CardContent, Grid, Typography } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { useSymbataStoreActions } from '../../../stores/symbataStore.ts'
import { IOpenPosition } from '../../../stores/symbataStore.types.ts'
import { formatNumber } from '../../../utils/utils.ts'
import { FlashBox, MetricBox, MetricLabel, MetricValue, PositionCard } from './PositionItem.style.ts'

interface PositionItemProps {
  position: IOpenPosition
}

export const PositionItem = ({ position }: PositionItemProps) => {
  const { setTradingViewSymbol } = useSymbataStoreActions()
  const isProfit = position.profit > 0
  const profitColor = isProfit ? green[700] : red[700]
  const profitBgColor = isProfit ? green[50] : red[50]

  return (
    <PositionCard>
      <CardActionArea onClick={() => setTradingViewSymbol(position.symbol)}>
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
                <FlashBox>
                  <MetricValue
                    sx={{
                      color: profitColor,
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                    }}
                  >
                    {isProfit ? '+' : ''}${Math.abs(position.profit).toFixed(2)}
                  </MetricValue>
                </FlashBox>
              </MetricBox>
              <MetricBox sx={{ alignItems: { xs: 'flex-end', sm: 'flex-start' } }}>
                <MetricLabel>ROR</MetricLabel>
                <FlashBox>
                  <MetricValue
                    sx={{
                      color: profitColor,
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                    }}
                  >
                    {position.currentROR > 0 ? '+' : ''}
                    {position.currentROR.toFixed(2)}%
                  </MetricValue>
                </FlashBox>
              </MetricBox>
            </Box>
          </Box>

          {/* Details Grid - Responsive layout */}
          <Grid container spacing={{ xs: 1.5, sm: 2 }} columnGap={2} justifyContent="space-between">
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <MetricBox>
                <MetricLabel>Buy Price</MetricLabel>
                <MetricValue sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>${position.buyPrice}</MetricValue>
              </MetricBox>
            </Grid>

            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <MetricBox>
                <MetricLabel>Current</MetricLabel>
                <FlashBox>
                  <MetricValue sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>${position.currentPrice}</MetricValue>
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
          </Grid>
        </CardContent>
      </CardActionArea>
    </PositionCard>
  )
}
