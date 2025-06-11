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

export interface ISymbolItem extends ISuggestedSymbols{
  loading?: boolean
  recommendation?: IRecommendation
}

interface ISuggestedSymbols {
  _id: string;
  id: string;
  symbol: string;
  priorityScore: {
    symbol: number;
  };
  logo: string;
}

export interface IPrices {
  date?: Array<Date>;
  volume: Array<number>;
  high: Array<number>;
  low: Array<number>;
  close: Array<number>;
  open: Array<number>;
  timestamp: Array<number>;
}

export interface IRecommendation {
  action: EAction;
  stopLoss: number;
  shares: number;
  usedStrategy: string;
  symbolRestructurePrices: IPrices;
}

export enum EAction {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
  ERROR = 'ERROR',
}
