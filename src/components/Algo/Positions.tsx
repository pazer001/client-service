import React, { useEffect } from 'react'
import { Broker } from './interfaces/Algo.interfaces.ts'
import axios, { AxiosResponse } from 'axios'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

const tradeStationAxiosInstance = axios.create({
  baseURL: 'https://sim-api.tradestation.com/v3',
})

interface TradeStationPositionsResponse {
  Positions: Array<{
    AccountID: string
    AveragePrice: string
    AssetType: string
    Last: string
    Bid: string
    Ask: string
    ConversionRate: string
    DayTradeRequirement: string
    InitialRequirement: string
    MaintenanceMargin: string
    PositionID: string
    LongShort: string
    Quantity: string
    Symbol: string
    Timestamp: string
    TodaysProfitLoss: string
    TotalCost: string
    MarketValue: string
    MarkToMarketPrice: string
    UnrealizedProfitLoss: string
    UnrealizedProfitLossPercent: string
    UnrealizedProfitLossQty: string
  }>
  Errors: Array<{
    AccountID: string
    Error: string
    Message: string
  }>
}

interface IPosition {
  averagePrice: number
  assetType: string
  last: number
  bid: number
  ask: number
  conversionRate: number
  dayTradeRequirement: number
  initialRequirement: number
  maintenanceMargin: number
  positionID: string
  longShort: string
  quantity: number
  symbol: string
  timestamp: string
  todaysProfitLoss: number
  totalCost: number
  marketValue: number
  markToMarketPrice: number
  unrealizedProfitLoss: number
  unrealizedProfitLossPercent: number
  unrealizedProfitLossQty: number
}

interface IPositionsProps {
  brokerAccessToken: string
  accountID: string
  brokerName: Broker | undefined
}

const Positions = ({ brokerAccessToken, accountID, brokerName }: IPositionsProps) => {
  const [positions, setPositions] = React.useState<IPosition[]>()

  const getPositions = async () => {
    switch (brokerName) {
      case Broker.TradeStation: {
        try {
          const positionsResponse = (await tradeStationAxiosInstance.get(`/brokerage/accounts/${accountID}/positions`, {
            headers: {
              Authorization: `Bearer ${brokerAccessToken}`,
            },
          })) as AxiosResponse<TradeStationPositionsResponse>

          const newPositions: IPosition[] = positionsResponse.data.Positions.map((position) => {
            return {
              averagePrice: Number(Number(position.AveragePrice).toFixed(2)),
              assetType: position.AssetType,
              last: Number(Number(position.Last).toFixed(2)),
              bid: Number(Number(position.Bid).toFixed(2)),
              ask: Number(Number(position.Ask).toFixed(2)),
              conversionRate: Number(Number(position.ConversionRate).toFixed(2)),
              dayTradeRequirement: Number(Number(position.DayTradeRequirement).toFixed(2)),
              initialRequirement: Number(Number(position.InitialRequirement).toFixed(2)),
              maintenanceMargin: Number(Number(position.MaintenanceMargin).toFixed(2)),
              positionID: position.PositionID,
              longShort: position.LongShort,
              quantity: Number(Number(position.Quantity).toFixed(2)),
              symbol: position.Symbol,
              timestamp: position.Timestamp,
              todaysProfitLoss: Number(Number(position.TodaysProfitLoss).toFixed(2)),
              totalCost: Number(Number(position.TotalCost).toFixed(2)),
              marketValue: Number(Number(position.MarketValue).toFixed(2)),
              markToMarketPrice: Number(Number(position.MarkToMarketPrice).toFixed(2)),
              unrealizedProfitLoss: Number(Number(position.UnrealizedProfitLoss).toFixed(2)),
              unrealizedProfitLossPercent: Number(Number(position.UnrealizedProfitLossPercent).toFixed(2)),
              unrealizedProfitLossQty: Number(Number(position.UnrealizedProfitLossQty).toFixed(2)),
            }
          })

          setPositions(newPositions)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }

  useEffect(() => {
    getPositions().then(() => {})
    const interval = setInterval(() => getPositions, 10000)

    return () => clearInterval(interval)
  }, [accountID])

  return (
    <DataTable value={positions}>
      <Column field="symbol" header="Symbol"></Column>
      <Column field="averagePrice" header="Average Price"></Column>
      <Column
        field="longShort"
        header="Long/Short"
        body={(rowData) => (
          <div style={{ color: rowData.longShort === 'Long' ? 'var(--green-400)' : 'var(--red-400)' }}>
            {rowData.longShort}
          </div>
        )}
      />
      <Column field="quantity" header="Quantity"></Column>
      <Column
        field="unrealizedProfitLoss"
        header="Open P/L"
        body={(rowData) => (
          <div style={{ color: rowData.unrealizedProfitLoss > 0 ? 'var(--green-400)' : 'var(--red-400)' }}>
            {rowData.unrealizedProfitLoss}
          </div>
        )}
      />

      <Column
        field="todaysProfitLoss"
        header="Todays Open P/L"
        body={(rowData) => (
          <div style={{ color: rowData.todaysProfitLoss > 0 ? 'var(--green-400)' : 'var(--red-400)' }}>
            {rowData.unrealizedProfitLoss}
          </div>
        )}
      />
      <Column
        field="unrealizedProfitLossPercent"
        header="Open P/L %"
        body={(rowData) => (
          <div style={{ color: rowData.unrealizedProfitLossPercent > 0 ? 'var(--green-400)' : 'var(--red-400)' }}>
            {rowData.unrealizedProfitLoss}
          </div>
        )}
      />
      <Column field="totalCost" header="Total Cost"></Column>
      <Column field="marketValue" header="Market Value"></Column>
    </DataTable>
  )
}

export default React.memo(Positions)
