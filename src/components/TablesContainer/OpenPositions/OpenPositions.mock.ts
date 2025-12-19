import { IOpenPosition, IOpenPositionsResponse } from '../../../stores/symbataStore.types.ts'

/**
 * Toggle this flag to enable/disable mock data for OpenPositions component.
 * When enabled, the component will use mock data instead of real API data.
 * Only works in development mode for safety.
 */
export const USE_MOCK_OPEN_POSITIONS = false

// Sample mock positions with varied scenarios (profitable, losing, different strategies)
const mockPositions: IOpenPosition[] = [
  {
    symbol: 'AAPL',
    buyPrice: 175.25,
    currentPrice: 189.5,
    currentROR: 8.13,
    profit: 1425.0,
    usedStrategy: 'Momentum Breakout',
    tradeType: 'long',
    buyAmount: 17525.0,
    shares: 100,
  },
  {
    symbol: 'TSLA',
    buyPrice: 245.8,
    currentPrice: 231.45,
    currentROR: -5.84,
    profit: -718.75,
    usedStrategy: 'Mean Reversion',
    tradeType: 'long',
    buyAmount: 12290.0,
    shares: 50,
  },
  {
    symbol: 'NVDA',
    buyPrice: 480.0,
    currentPrice: 545.2,
    currentROR: 13.58,
    profit: 3260.0,
    usedStrategy: 'Trend Following',
    tradeType: 'long',
    buyAmount: 24000.0,
    shares: 50,
  },
  {
    symbol: 'MSFT',
    buyPrice: 378.5,
    currentPrice: 385.75,
    currentROR: 1.91,
    profit: 362.5,
    usedStrategy: 'Value Investing',
    tradeType: 'long',
    buyAmount: 18925.0,
    shares: 50,
  },
  {
    symbol: 'META',
    buyPrice: 505.0,
    currentPrice: 475.3,
    currentROR: -5.88,
    profit: -891.0,
    usedStrategy: 'Swing Trade',
    tradeType: 'long',
    buyAmount: 15150.0,
    shares: 30,
  },
  {
    symbol: 'AMZN',
    buyPrice: 178.2,
    currentPrice: 186.45,
    currentROR: 4.63,
    profit: 825.0,
    usedStrategy: 'Momentum Breakout',
    tradeType: 'long',
    buyAmount: 17820.0,
    shares: 100,
  },
  {
    symbol: 'GOOGL',
    buyPrice: 141.5,
    currentPrice: 138.2,
    currentROR: -2.33,
    profit: -330.0,
    usedStrategy: 'Mean Reversion',
    tradeType: 'long',
    buyAmount: 14150.0,
    shares: 100,
  },
  {
    symbol: 'AMD',
    buyPrice: 155.0,
    currentPrice: 142.8,
    currentROR: -7.87,
    profit: -610.0,
    usedStrategy: 'Trend Following',
    tradeType: 'short',
    buyAmount: 7750.0,
    shares: 50,
  },
  {
    symbol: 'SPY',
    buyPrice: 485.0,
    currentPrice: 498.5,
    currentROR: 2.78,
    profit: 675.0,
    usedStrategy: 'Index Tracking',
    tradeType: 'long',
    buyAmount: 24250.0,
    shares: 50,
  },
  {
    symbol: 'QQQ',
    buyPrice: 420.75,
    currentPrice: 435.9,
    currentROR: 3.6,
    profit: 756.25,
    usedStrategy: 'Index Tracking',
    tradeType: 'long',
    buyAmount: 21037.5,
    shares: 50,
  },
]

/**
 * Converts the mock positions array to the expected IOpenPositionsResponse format.
 * The API returns an object keyed by symbol.
 */
export const mockOpenPositionsData: IOpenPositionsResponse = mockPositions.reduce((acc, position) => {
  acc[position.symbol] = position
  return acc
}, {} as IOpenPositionsResponse)
