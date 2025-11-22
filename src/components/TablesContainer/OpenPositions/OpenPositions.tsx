import RefreshIconOutlined from '@mui/icons-material/RefreshOutlined'
import {
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useMemo } from 'react'
import { useOpenPositionsPolling } from '../../../hooks/useOpenPositionsPolling.ts'
import { useSymbataStoreActions, useSymbataStoreOpenPositions } from '../../../stores/symbataStore.ts'
import { PositionItem } from './PositionItem.tsx'

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
  const isMobile = useMediaQuery('(max-width:900px)')

  // Custom hook handles polling and change detection for flash animations
  const { flashingFields, progress, refreshOpenPositions } = useOpenPositionsPolling(openPositions, getOpenPositions)

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
    <Box sx={{ p: { xs: 1, sm: 2 }, height: 'calc(100dvh - 75px)', overflow: isMobile ? 'visible' : 'auto' }}>
      {/* Progress bar indicating time until next fetch */}
      <Box
        display="flex"
        alignItems="center"
        width="100%"
        sx={{
          mb: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#1e1e1e',
          boxShadow: '0px 5px 7px 0px #1E1E1E',
        }}
      >
        <Box flex={1}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              [`& .${linearProgressClasses.bar}`]: {
                borderRadius: 1,
                transition: 'transform 0.1s linear',
              },
            }}
          />
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Next update: {Math.ceil((60000 - (progress / 100) * 60000) / 1000)}s
            </Typography>
            <IconButton size="small" onClick={refreshOpenPositions} sx={{ display: 'flex', alignItems: 'center' }}>
              <RefreshIconOutlined sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={{ xs: 1.5, sm: 2 }}>
        {positionsArray.map((position) => (
          <PositionItem key={position.symbol} position={position} flashingFields={flashingFields} />
        ))}
      </Box>
    </Box>
  )
}
