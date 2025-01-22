import { IAnalyzedSignalsAndLines } from '../AnalyzedResult/AnalyzedResult.interfaces.ts'

export interface ISymbolTableItem extends ISymbolItem {
  key: string
}

export interface ISymbolItem {
  marketCapitalization: number
  id: number
  symbol: string
  score: number
  verdict: string
  recommendation: 'Buy' | 'Sell' | 'Hold' | ''
  updatedAt: string
  nextEarningReport: number
  averageVolume: number
  isPennyStock: boolean
  logo: string
  priorityScore: number
  analyzedSignalsAndLines: IAnalyzedSignalsAndLines
}
