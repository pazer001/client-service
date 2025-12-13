export interface IPriorityScore {
  symbol: number | null
  sector: number | null
  index: number | null
  sizeValue: number | null
  style: number | null
  symbolLastScore: number | null
  sectorLastScore: number | null
  indexLastScore: number | null
  sizeLastValueScore: number | null
  styleLastScore: number | null
}

export interface ISymbolItem extends ISuggestedSymbols {
  loading?: boolean
  recommendation?: IRecommendation
}

interface ISuggestedSymbols {
  _id: string
  id: string
  symbol: string
  averageVolume: number
  name: string
  priorityScore: {
    symbol: number
  }
  logo: string
}

export interface IPrices {
  date?: Array<Date>
  volume: Array<number>
  high: Array<number>
  low: Array<number>
  close: Array<number>
  open: Array<number>
  timestamp: Array<number>
}

export interface IRecommendation {
  action: EAction
  actions: EAction[]
  stopLoss: number
  shares: number
  usedStrategy: string
  symbolRestructurePrices: IPrices
}

export enum EAction {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
  ERROR = 'ERROR',
}

export interface IOpenPosition {
  buyPrice: number
  currentPrice: number
  currentROR: number
  profit: number
  usedStrategy: string
  symbol: string
  tradeType: 'long' | 'short'
  buyAmount: number
  shares: number
}

// Response is an object with symbol keys mapping to position data
export type IOpenPositionsResponse = Record<string, IOpenPosition>

export interface IAlpacaBalancesResponse {
  currency: string
  buyingPower: number
  cash: number
  equity: number
  lastEquity: number
  todayProfit: number
  todayROR: number
}

export interface IAlgoSession {
  accountId: string
  interval: string
  isCryptoMode: boolean
  includePrePostMarket: boolean
}
