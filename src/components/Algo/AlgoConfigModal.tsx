import CloseIcon from '@mui/icons-material/Close'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { BaseSyntheticEvent } from 'react'
import {
  supportedAlgoIntervals,
  useSymbataStoreActions,
  useSymbataStoreIncludePrePostMarket,
  useSymbataStoreInterval,
  useSymbataStoreIsCryptoMode,
} from '../../stores/symbataStore.ts'
import { Interval } from '../interfaces.ts'

interface AlgoConfigModalProps {
  open: boolean
  onClose: () => void
}

export const AlgoConfigModal = ({ open, onClose }: AlgoConfigModalProps) => {
  const interval = useSymbataStoreInterval()
  const isCryptoMode = useSymbataStoreIsCryptoMode()
  const includePrePostMarket = useSymbataStoreIncludePrePostMarket()
  const { setInterval, setIsCryptoMode, setIncludePrePostMarket } = useSymbataStoreActions()

  const handleIntervalChange = (event: BaseSyntheticEvent) => {
    if (event.target.value) {
      setInterval(event.target.value as Interval)
    }
  }

  console.log({ interval, isCryptoMode, includePrePostMarket })
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Algo Configuration
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Interval</Typography>
            <ToggleButtonGroup value={interval} size="small" exclusive onChange={handleIntervalChange}>
              {supportedAlgoIntervals.map((intervalValue) => (
                <ToggleButton key={intervalValue} size="small" value={intervalValue}>
                  {intervalValue}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          <FormControlLabel
            control={<Switch checked={isCryptoMode} onChange={(e) => setIsCryptoMode(e.target.checked)} />}
            label="Crypto Mode"
          />

          <FormControlLabel
            control={
              <Switch checked={includePrePostMarket} onChange={(e) => setIncludePrePostMarket(e.target.checked)} />
            }
            label="Include Pre/Post Market"
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
