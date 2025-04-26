import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import './index.css'
import App from './App.tsx'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_HOST

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider
    value={{
      ripple: true,
    }}
  >
    <App />
  </PrimeReactProvider>,
)
