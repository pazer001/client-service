import { Box, Typography, Grid, Paper, styled, IconButton } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useEffect, useCallback, useState } from 'react'
import { useSymbataStoreActions, useSymbataStoreBalance, useSymbataStoreUserId } from '../../stores/symbataStore.ts'

const BalanceItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}))

const Balance = () => {
  const balance = useSymbataStoreBalance()
  const userId = useSymbataStoreUserId()
  const { getBalance } = useSymbataStoreActions()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!userId) {
      console.warn('Balance: No userId available')
      setError('No user ID available')
      return
    }

    console.log('Balance: Fetching balance for userId:', userId)
    setLoading(true)
    setError(null)

    try {
      await getBalance(userId)
      console.log('Balance: Successfully fetched balance')
    } catch (error) {
      console.error('Balance: Error loading balance:', error)
      setError('Failed to load balance data')
    } finally {
      setLoading(false)
    }
  }, [userId, getBalance])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  if (error || !balance) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography color="error">{error || 'No balance data available'}</Typography>
        <Typography variant="body2" color="text.secondary">
          Check browser console for details
        </Typography>
      </Box>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: balance.currency || 'USD',
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 2 }}>
        <Typography variant="h6">Account Balance</Typography>
        <IconButton
          loading={loading}
          onClick={fetchBalance}
          disabled={loading}
          size="small"
          color="primary"
          aria-label="refresh balance"
        >
          <RefreshIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid size={6}>
          <BalanceItem elevation={1}>
            <Typography variant="body2" color="text.secondary">
              Equity
            </Typography>
            <Typography variant="h6">{formatCurrency(balance.equity)}</Typography>
          </BalanceItem>
        </Grid>
        <Grid size={6}>
          <BalanceItem elevation={1}>
            <Typography variant="body2" color="text.secondary">
              Cash
            </Typography>
            <Typography variant="h6">{formatCurrency(balance.cash)}</Typography>
          </BalanceItem>
        </Grid>
        <Grid size={6}>
          <BalanceItem elevation={1}>
            <Typography variant="body2" color="text.secondary">
              Buying Power
            </Typography>
            <Typography variant="h6">{formatCurrency(balance.buyingPower)}</Typography>
          </BalanceItem>
        </Grid>
        <Grid size={6}>
          <BalanceItem elevation={1}>
            <Typography variant="body2" color="text.secondary">
              Last Equity
            </Typography>
            <Typography variant="h6">{formatCurrency(balance.lastEquity)}</Typography>
          </BalanceItem>
        </Grid>
        <Grid size={6}>
          <BalanceItem
            elevation={1}
            sx={{
              backgroundColor: balance.todayProfit >= 0 ? 'success.light' : 'error.light',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Today&apos;s Profit
            </Typography>
            <Typography variant="h6">{formatCurrency(balance.todayProfit)}</Typography>
          </BalanceItem>
        </Grid>
        <Grid size={6}>
          <BalanceItem
            elevation={1}
            sx={{
              backgroundColor: balance.todayROR >= 0 ? 'success.light' : 'error.light',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Today&apos;s ROR
            </Typography>
            <Typography variant="h6">{formatPercentage(balance.todayROR)}</Typography>
          </BalanceItem>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Balance
