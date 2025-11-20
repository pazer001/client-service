import { createRoot } from 'react-dom/client'
import './index.css'
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material'
import App from './App.tsx'

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
  },
})

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
)
