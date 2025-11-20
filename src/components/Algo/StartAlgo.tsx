import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import { Box, IconButton, MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material'
import { useState } from 'react'
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
      <Select
        size="small"
        value={userId}
        onChange={(e: SelectChangeEvent) => setUserId(e.target.value)}
        disabled={isLoading}
      >
        <MenuItem value="1f71bd6d-be84-456f-89e5-925528431139">Paz</MenuItem>
        <MenuItem value="963caa3a-03f8-4730-be71-046cb1b7aaac">Ben</MenuItem>
      </Select>
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
