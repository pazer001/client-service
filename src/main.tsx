import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      // 1. Use dark algorithm
      // algorithm: theme.darkAlgorithm,

      // 2. Combine dark algorithm and compact algorithm
      algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    }}
  >
    <App />
  </ConfigProvider>,
)
