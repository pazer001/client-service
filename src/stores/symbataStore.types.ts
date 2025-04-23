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

export interface ISymbolItem {
  _id: string
  symbol: string
  __v: number
  averageVolume: number
  createdAt: string
  priorityScore: IPriorityScore
  updatedAt: string
  recommendation?: IRecommendation
}

export interface IRecommendation {
  action: EAction
  stopLoss: number
  riskCapitalPercent: number
  usedStrategy: string
}

export enum EAction {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
}
