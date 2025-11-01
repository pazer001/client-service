import { useState } from 'react'
import { Box, IconButton, TextField, Tooltip } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import {
  useSymbataStoreActions,
  useSymbataStoreIsAlgoStarted,
  useSymbataStoreUserId,
} from '../../stores/symbataStore.ts'

export const StartAlgo = () => {
  const userId = useSymbataStoreUserId()
  const [isLoading, setIsLoading] = useState(false)
  const isAlgoStarted = useSymbataStoreIsAlgoStarted()
  const { startAlgo, stopAlgo, setUserId } = useSymbataStoreActions()

  const handleToggleAlgo = async () => {
    if (!userId.trim()) return

    setIsLoading(true)
    try {
      if (isAlgoStarted) {
        await stopAlgo(userId.trim())
      } else {
        await startAlgo(userId.trim())
      }
    } catch (error) {
      console.error('Error toggling algo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isButtonDisabled = !userId.trim() || isLoading

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <TextField
        size="small"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        disabled={isLoading}
      />
      <Tooltip title={isAlgoStarted ? 'Stop Algo' : 'Start Algo'}>
        <span>
          <IconButton
            color={isAlgoStarted ? 'error' : 'success'}
            disabled={isButtonDisabled}
            onClick={handleToggleAlgo}
            size="small"
          >
            {isAlgoStarted ? <StopIcon /> : <PlayArrowIcon />}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}
