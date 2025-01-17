export enum Broker {
  TradeStation = 'tradestation',
}

export interface ITradeStationGetAccountsResponse {
  Accounts: Array<{
    AccountID: string
    Currency: string
    Status: 'Closed' | 'Active'
    AccountType: 'Forex' | 'Futures' | 'Margin'
    AccountDetails: {
      CryptoEnabled: boolean
      DayTradingQualified: boolean
      EnrolledInRegTProgram: boolean
      IsStockLocateEligible: boolean
      OptionApprovalLevel: number
      PatternDayTrader: boolean
      RequiresBuyingPowerWarning: boolean
    }
  }>
}

export interface IAccountsProps {
  brokerAccessToken: string
  accountID: string
  onChange: (accountID: string) => void
}
