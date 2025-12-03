// import { useEffect, useRef } from 'react';
// import { useSymbataStoreInterval, useSymbataStoreTradingViewSymbol } from '../../../stores/symbataStore'

// Extend Window interface to include the Finlogix Widget
import { useSymbataStoreTradingViewSymbol } from '../../../stores/symbataStore.ts';

declare global {
  interface Window {
    Widget?: {
      init: (config: IFinlogixConfig) => void
    };
  }
}

interface IFinlogixConfig {
  widgetId: string;
  type: string;
  language: string;
  symbolName: string;
  hasSearchBar: boolean;
  hasSymbolName: boolean;
  hasSymbolChange: boolean;
  hasButton: boolean;
  chartShape: string;
  timePeriod: string;
  isAdaptive: boolean;
}

// Map interval to Finlogix timePeriod format (M15 for 15-minute, D1 for daily)
// const getTimePeriod = (intervalValue: Interval): string => {
//   return intervalValue === Interval['15m'] ? 'M15' : 'D1'
// }

// function FinlogixWidget() {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const scriptLoadedRef = useRef(false)
//   const symbol = useSymbataStoreTradingViewSymbol()
//   const interval = useSymbataStoreInterval()
//
//   useEffect(() => {
//     if (!symbol || !containerRef.current) return
//
//     // Load the Finlogix widget script only once
//     if (!scriptLoadedRef.current) {
//       const script = document.createElement('script')
//       script.src = 'https://widget.finlogix.com/Widget.js'
//       script.type = 'text/javascript'
//       script.async = true
//       script.onload = () => {
//         scriptLoadedRef.current = true
//         initializeWidget()
//       }
//       document.body.appendChild(script)
//     } else {
//       // Script already loaded, just initialize the widget
//       initializeWidget()
//     }
//
//     function initializeWidget() {
//       if (!window.Widget || !containerRef.current) return
//
//       // Clear previous widget instance
//       if (containerRef.current) {
//         containerRef.current.innerHTML = ''
//         const widgetContainer = document.createElement('div')
//         widgetContainer.className = 'finlogix-container'
//         containerRef.current.appendChild(widgetContainer)
//       }
//
//       // Initialize the Finlogix widget
//       window.Widget.init({
//         widgetId: '5b65b120-d58e-4eeb-a145-52d3d746f632',
//         type: 'BigChart',
//         language: 'en',
//         symbolName: symbol || 'AAPL',
//         hasSearchBar: false,
//         hasSymbolName: false,
//         hasSymbolChange: false,
//         hasButton: false,
//         chartShape: 'candles',
//         timePeriod: "M15",//getTimePeriod(interval),
//         isAdaptive: true,
//       })
//     }
//   }, [symbol, interval])
//
//   return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
// }


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

const DukascopyChart: React.FC<DukascopyChartProps> = () => {
  // const iframeRef = useRef<HTMLIFrameElement>(null);
  //
  // useEffect(() => {
  //   const iframe = iframeRef.current;
  //   if (!iframe) return;
  //
  //   // Wait for iframe to load
  //   const initChart = () => {
  //     const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  //     if (!iframeDoc) return;
  //
  //     // Write the complete HTML structure into the iframe
  //     iframeDoc.open();
  //     iframeDoc.write(`
  //       <!DOCTYPE html>
  //       <html>
  //         <head>
  //           <meta charset="UTF-8">
  //           <style>
  //             body {
  //               margin: 0;
  //               padding: 0;
  //               overflow: hidden;
  //             }
  //           </style>
  //         </head>
  //         <body>
  //           <script type="text/javascript">
  //             DukascopyApplet = ${JSON.stringify({
  //       type: 'chart',
  //       params: {
  //         'showUI': true,
  //         'showTabs': true,
  //         'showParameterToolbar': true,
  //         'showOfferSide': true,
  //         'allowInstrumentChange': true,
  //         'allowPeriodChange': true,
  //         'allowOfferSideChange': true,
  //         'showAdditionalToolbar': true,
  //         'showDetachButton': true,
  //         'presentationType': 'candle',
  //         'axisX': true,
  //         'axisY': true,
  //         'legend': true,
  //         'timeline': true,
  //         'showDateSeparators': true,
  //         'showZoom': true,
  //         'showScrollButtons': true,
  //         'showAutoShiftButton': true,
  //         'crosshair': true,
  //         'borders': false,
  //         'theme': 'Pastelle',
  //         'uiColor': '#000',
  //         'availableInstruments': '*',
  //         'instrument': 'EUR/USD',
  //         'period': '7',
  //         'offerSide': 'BID',
  //         'timezone': 0,
  //         'live': true,
  //         'panLock': false,
  //         'width': '100%',
  //         'height': '100%',
  //         'adv': 'popup',
  //       },
  //     })};
  //           </script>
  //           <script type="text/javascript" src="https://freeserv-static.dukascopy.com/2.0/core.js"></script>
  //         </body>
  //       </html>
  //     `);
  //     iframeDoc.close();
  //   };
  //
  //   // Initialize immediately or wait for iframe load
  //   if (iframe.contentDocument?.readyState === 'complete') {
  //     initChart();
  //   } else {
  //     iframe.onload = initChart;
  //   }
  //
  // }, []);
  const symbol = useSymbataStoreTradingViewSymbol()
  const url = `https://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=0A8BF3CA3828446685FC96FD49870A99&symbol=${symbol}&days=2&displayPrices=Candlestick&dividends=true&splits=true&palette=Relief&width=100%25&height=100%25&showLogo=Title&animate=true&positiveColor=008f0f&negativeColor=a10b0b`
  return (
    <iframe frameBorder='0' scrolling='no' width='100%' height='100%' src={url}></iframe>
  );
};

export default DukascopyChart;
