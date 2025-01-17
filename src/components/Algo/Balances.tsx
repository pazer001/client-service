import React, { useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import { Broker } from './interfaces/Algo.interfaces.ts'

const tradeStationAxiosInstance = axios.create({
  baseURL: 'https://sim-api.tradestation.com/v3',
})

interface TradeStationBalancesResponse {
  Balances: Array<{
    AccountID: string
    AccountType: string
    CashBalance: string
    BuyingPower: string
    Equity: string
    MarketValue: string
    TodaysProfitLoss: string
    UnclearedDeposit: string
    BalanceDetail: {
      CostOfPositions: string
      DayTrades: string
      MaintenanceRate: string
      OptionBuyingPower: string
      OptionsMarketValue: string
      OvernightBuyingPower: string
      RequiredMargin: string
      UnsettledFunds: string
      DayTradeExcess: string
      RealizedProfitLoss: string
      UnrealizedProfitLoss: string
    }
    Commission: string
  }>
  Errors: string[]
}

interface Balance {
  accountID: string
  accountType: string
  cashBalance: number
  buyingPower: number
  equity: number
  marketValue: number
  todaysProfitLoss: number
  unclearedDeposit: number
  balanceDetail: {
    costOfPositions: number
    dayTrades: number
    maintenanceRate: number
    optionBuyingPower: number
    optionsMarketValue: number
    overnightBuyingPower: number
    requiredMargin: number
    unsettledFunds: number
    dayTradeExcess: number
    realizedProfitLoss: number
    unrealizedProfitLoss: number
  }
}

interface IBalancesProps {
  brokerAccessToken: string
  accountID: string
  brokerName: Broker | undefined
}

const Balances = ({ brokerAccessToken, accountID, brokerName }: IBalancesProps) => {
  const [balance, setBalance] = React.useState<Balance>()
  const getBalances = async () => {
    switch (brokerName) {
      case Broker.TradeStation: {
        const balanceResponse = (await tradeStationAxiosInstance.get(`/brokerage/accounts/${accountID}/balances`, {
          headers: {
            Authorization: `Bearer ${brokerAccessToken}`,
          },
        })) as AxiosResponse<TradeStationBalancesResponse>

        const newBalance: Balance = {
          accountID: balanceResponse.data.Balances[0].AccountID,
          accountType: balanceResponse.data.Balances[0].AccountType,
          cashBalance: Number(balanceResponse.data.Balances[0].CashBalance),
          buyingPower: Number(balanceResponse.data.Balances[0].BuyingPower),
          equity: Number(balanceResponse.data.Balances[0].Equity),
          marketValue: Number(balanceResponse.data.Balances[0].MarketValue),
          todaysProfitLoss: Number(balanceResponse.data.Balances[0].TodaysProfitLoss),
          unclearedDeposit: Number(balanceResponse.data.Balances[0].UnclearedDeposit),
          balanceDetail: {
            costOfPositions: Number(balanceResponse.data.Balances[0].BalanceDetail.CostOfPositions),
            dayTrades: Number(balanceResponse.data.Balances[0].BalanceDetail.DayTrades),
            maintenanceRate: Number(balanceResponse.data.Balances[0].BalanceDetail.MaintenanceRate),
            optionBuyingPower: Number(balanceResponse.data.Balances[0].BalanceDetail.OptionBuyingPower),
            optionsMarketValue: Number(balanceResponse.data.Balances[0].BalanceDetail.OptionsMarketValue),
            overnightBuyingPower: Number(balanceResponse.data.Balances[0].BalanceDetail.OvernightBuyingPower),
            requiredMargin: Number(balanceResponse.data.Balances[0].BalanceDetail.RequiredMargin),
            unsettledFunds: Number(balanceResponse.data.Balances[0].BalanceDetail.UnsettledFunds),
            dayTradeExcess: Number(balanceResponse.data.Balances[0].BalanceDetail.DayTradeExcess),
            realizedProfitLoss: Number(balanceResponse.data.Balances[0].BalanceDetail.RealizedProfitLoss),
            unrealizedProfitLoss: Number(balanceResponse.data.Balances[0].BalanceDetail.UnrealizedProfitLoss),
          },
        }
        setBalance(newBalance)
      }
    }
  }

  useEffect(() => {
    getBalances().then(() => {})
    const interval = setInterval(getBalances, 10000)

    return () => clearInterval(interval)
  }, [accountID])

  return (
    <div>
      <h3>Overall Balance:</h3>
      <b>Account ID: </b> {accountID}
      <br />
      <b>Account Type: </b> {balance?.accountType}
      <br />
      <b>Cash Balance: </b> {balance?.cashBalance.toFixed(2)}
      <br />
      <b>Buying Power: </b> {balance?.buyingPower.toFixed(2)}
      <br />
      <b>Equity: </b> {balance?.equity.toFixed(2)}
      <br />
      <b>Market Value: </b> {balance?.marketValue.toFixed(2)}
      <br />
      <b>Today Profit Loss: </b> {balance?.todaysProfitLoss.toFixed(2)}
      <br />
      <b>Uncleared Deposit: </b> {balance?.unclearedDeposit.toFixed(2)}
      <br />
      <br />
      <h3>Balance Detail: </h3>
      <b>Cost Of Positions: </b> {balance?.balanceDetail.costOfPositions.toFixed(2)}
      <br />
      <b>Day Trades: </b> {balance?.balanceDetail.dayTrades.toFixed(2)}
      <br />
      <b>Maintenance Rate: </b> {balance?.balanceDetail.maintenanceRate.toFixed(2)}
      <br />
      <b>Option Buying Power: </b> {balance?.balanceDetail.optionBuyingPower.toFixed(2)}
      <br />
      <b>Options Market Value: </b> {balance?.balanceDetail.optionsMarketValue.toFixed(2)}
      <br />
      <b>Overnight Buying Power: </b> {balance?.balanceDetail.overnightBuyingPower.toFixed(2)}
      <br />
      <b>Required Margin: </b> {balance?.balanceDetail.requiredMargin.toFixed(2)}
      <br />
      <b>Unsettled Funds: </b> {balance?.balanceDetail.unsettledFunds.toFixed(2)}
      <br />
      <b>Day Trade Excess: </b> {balance?.balanceDetail.dayTradeExcess.toFixed(2)}
      <br />
      <b>Realized Profit Loss: </b> {balance?.balanceDetail.realizedProfitLoss.toFixed(2)}
      <br />
      <b>Unrealized Profit Loss: </b> {balance?.balanceDetail.unrealizedProfitLoss.toFixed(2)}
    </div>
  )
}

export default React.memo(Balances)
