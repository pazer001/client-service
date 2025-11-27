import { memo, useEffect, useRef } from 'react'
import { useSymbataStoreInterval, useSymbataStoreTradingViewSymbol } from '../../../stores/symbataStore'
import { Interval } from '../../interfaces'

// Extend Window interface to include the Finlogix Widget
declare global {
  interface Window {
    Widget?: {
      init: (config: IFinlogixConfig) => void
    }
  }
}

interface IFinlogixConfig {
  widgetId: string
  type: string
  language: string
  symbolName: string
  hasSearchBar: boolean
  hasSymbolName: boolean
  hasSymbolChange: boolean
  hasButton: boolean
  chartShape: string
  timePeriod: string
  isAdaptive: boolean
}

// Map interval to Finlogix timePeriod format (M5 for 5-minute, D1 for daily)
const getTimePeriod = (intervalValue: Interval): string => {
  return intervalValue === Interval['5m'] ? 'M5' : 'D1'
}

function FinlogixWidget() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)
  const symbol = useSymbataStoreTradingViewSymbol()
  const interval = useSymbataStoreInterval()

  useEffect(() => {
    if (!symbol || !containerRef.current) return

    // Load the Finlogix widget script only once
    if (!scriptLoadedRef.current) {
      const script = document.createElement('script')
      script.src = 'https://widget.finlogix.com/Widget.js'
      script.type = 'text/javascript'
      script.async = true
      script.onload = () => {
        scriptLoadedRef.current = true
        initializeWidget()
      }
      document.body.appendChild(script)
    } else {
      // Script already loaded, just initialize the widget
      initializeWidget()
    }

    function initializeWidget() {
      if (!window.Widget || !containerRef.current) return

      // Clear previous widget instance
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        const widgetContainer = document.createElement('div')
        widgetContainer.className = 'finlogix-container'
        containerRef.current.appendChild(widgetContainer)
      }

      // Initialize the Finlogix widget
      window.Widget.init({
        widgetId: '5b65b120-d58e-4eeb-a145-52d3d746f632',
        type: 'BigChart',
        language: 'en',
        symbolName: symbol || 'AAPL',
        hasSearchBar: false,
        hasSymbolName: false,
        hasSymbolChange: false,
        hasButton: false,
        chartShape: 'candles',
        timePeriod: getTimePeriod(interval),
        isAdaptive: true,
      })
    }
  }, [symbol, interval])

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
}

export default memo(FinlogixWidget)
