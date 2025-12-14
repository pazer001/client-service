export interface IAnalyzedSignalsAndLines {
  analyzedSignals: IAnalyzedSignal[]
  lines: Lines
  stopLoss: number
}
export interface IAnalyzedSignal {
  signal: number
  info: IAnalyzedSignalInfo
  OHLCV: OHLCV
}

export interface OHLCV {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Lines {
  minBuy: number
  minSell: number
}

interface IAnalyzedSignalInfo {
  eodNewsTraderModule: EODNewsTraderScoreInfo
  upgradeDowngradeModule: UpgradeDowngradeScoreInfo
  insiderTransactionsSentimentModule: InsiderTransactionsSentimentScoreInfo
  finnhubSocialSentimentModule: FinnhubSocialSentimentScoreInfo
  optimizedTechnicalAnalysisModule: IOptimizedTechnicalAnalysisScoreInfo
  defaultTechnicalAnalysisModule: IDefaultTechnicalAnalysisScoreInfo
}

interface EODNewsTraderScoreInfo {
  signal: number
  info: EODNewsTraderItem[]
}

interface EODNewsTraderItem {
  date: string
  title: string
  content: string
  link: string
  symbols: string[]
}

interface UpgradeDowngradeScoreInfo {
  signal: number
  info: UpgradeDowngradeItem[]
}

interface UpgradeDowngradeItem {
  epochGradeDate: string
  firm: string
  toGrade: string
  fromGrade: string
  action: string
}

interface InsiderTransactionsSentimentScoreInfo {
  signal: number
  info: InsiderTransactionsSentimentItem[]
}

interface InsiderTransactionsSentimentItem {
  filerName: string
  filerRelation: string
  filerUrl: string
  maxAge: number
  moneyText: string
  ownership: string
  shares: { raw: number; fmt: string; longFmt: string }
  startDate: { raw: number; fmt: string }
  symbol: string
  transactionText: string
  value: { raw: number; fmt: string; longFmt: string }
  action: 'Buy' | 'Sell'
}

interface FinnhubSocialSentimentScoreInfo {
  signal: number
  info: FinnhubSocialSentimentItem
}

interface FinnhubSocialSentimentItem {
  date: string
  atTime: string
  mention: number
  positiveScore: number
  negativeScore: number
  positiveMention: number
  negativeMention: number
  score: number
}

interface IOptimizedTechnicalAnalysisScoreInfo {
  signal: number
  info: IOptimizedTechnicalAnalysisItem
}

interface IOptimizedTechnicalAnalysisItem {
  buyReasons: string[]
  sellReasons: string[]
}

interface IDefaultTechnicalAnalysisScoreInfo {
  signal: number
  info: IDefaultTechnicalAnalysisItem
}

interface IDefaultTechnicalAnalysisItem {
  buyReasons: string[]
  sellReasons: string[]
}



