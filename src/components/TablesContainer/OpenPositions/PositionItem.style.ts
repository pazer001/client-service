import { Box, Card, keyframes, styled, Typography } from '@mui/material'
import { yellow } from '@mui/material/colors'

// Flash animation for updated values
export const flashAnimation = keyframes`
  0% {
    background-color: ${yellow[200]};
  }
  100% {
    background-color: transparent;
  }
`

export const PositionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}))

export const FlashBox = styled(Box)<{ flash?: boolean }>(({ flash }) => ({
  animation: flash ? `${flashAnimation} 1s ease-out` : 'none',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
}))

export const MetricBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}))

export const MetricLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}))

export const MetricValue = styled(Typography)(() => ({
  fontSize: '1rem',
  fontWeight: 600,
}))
