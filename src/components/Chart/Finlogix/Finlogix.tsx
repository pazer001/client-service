import { memo, useEffect, useRef } from 'react'
import { useSymbataStoreInterval, useSymbataStoreTradingViewSymbol } from '../../../stores/symbataStore'

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

// Map interval to Finlogix timePeriod format (M15 for 15-minute, D1 for daily)
// const getTimePeriod = (intervalValue: Interval): string => {
//   return intervalValue === Interval['15m'] ? 'M15' : 'D1'
// }

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
        timePeriod: "M15",//getTimePeriod(interval),
        isAdaptive: true,
      })
    }
  }, [symbol, interval])

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
}


declare global {
  interface Window {
    DukascopyApplet?: {
      type: string;
      params: Record<string, any>;
    };
  }
}

interface DukascopyChartProps {
  instrument?: string;
  period?: string;
  height?: string;
  width?: string;
  theme?: string;
  offerSide?: string;
  live?: boolean;
  presentationType?: string;
}

const DukascopyChart: React.FC<DukascopyChartProps> = ({
                                                         instrument = "EUR/USD",
                                                         period = "7",
                                                         height = "600",
                                                         width = "100%",
                                                         theme = "Pastelle",
                                                         offerSide = "BID",
                                                         live = true,
                                                         presentationType = "candle"
                                                       }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent double loading in React StrictMode
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    // Define the global DukascopyApplet configuration
    window.DukascopyApplet = {
      type: "chart",
      params: {
        showUI: true,
        showTabs: true,
        showParameterToolbar: true,
        showOfferSide: true,
        allowInstrumentChange: true,
        allowPeriodChange: true,
        allowOfferSideChange: true,
        showAdditionalToolbar: true,
        showDetachButton: true,
        presentationType: presentationType,
        axisX: true,
        axisY: true,
        legend: true,
        timeline: true,
        showDateSeparators: true,
        showZoom: true,
        showScrollButtons: true,
        showAutoShiftButton: true,
        crosshair: true,
        borders: false,
        theme: theme,
        uiColor: "#000",
        availableInstruments: "l:",
        instrument: instrument,
        period: period,
        offerSide: offerSide,
        timezone: 0,
        live: live,
        panLock: false,
        width: width,
        height: height,
        adv: "popup"
      }
    };

    // Load the Dukascopy script into body
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://freeserv-static.dukascopy.com/2.0/core.js';
    script.async = false; // Make it synchronous

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[src*="dukascopy"]');
      scripts.forEach(s => s.remove());

      if (window.DukascopyApplet) {
        delete window.DukascopyApplet;
      }

      scriptLoadedRef.current = false;
    };
  }, [instrument, period, height, width, theme, offerSide, live, presentationType]);

  return (
    <div
      ref={containerRef}
      style={{ width: width, height: height }}
      id="dukascopy-chart-container"
    />
  );
};

export default DukascopyChart
