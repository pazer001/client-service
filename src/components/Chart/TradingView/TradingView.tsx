import { memo, useEffect, useMemo, useRef } from 'react'
import { useSymbataStoreInterval, useSymbataStoreTradingViewSymbol } from '../../../stores/symbataStore'
import { Interval } from '../../interfaces'

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null)
  const symbol = useSymbataStoreTradingViewSymbol()
  const interval = useSymbataStoreInterval()

  const isCrypto = useMemo(() => symbol?.length && symbol?.length >= 6 && symbol?.endsWith('USD'), [symbol])

  useEffect(() => {
    if (!container.current) return
    container.current.innerHTML = ''
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = `
        {
          "allow_symbol_change": true,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "${interval === Interval['5m'] ? '5' : 'D'}",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "${isCrypto ? 'BINANCE:' : ''}${symbol}",
          "theme": "dark",
          "timezone": "Etc/UTC",
          "backgroundColor": "#0F0F0F",
          "gridColor": "rgba(242, 242, 242, 0.06)",
          "watchlist": [],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "autosize": true
        }`
    container.current.appendChild(script)
    console.log('symbol', symbol)
  }, [symbol, interval])

  return <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}></div>
}

export default memo(TradingViewWidget)
