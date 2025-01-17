import React, { useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Broker } from './interfaces/Algo.interfaces.ts'

const tradeStationAxiosInstance = axios.create({
  baseURL: 'https://sim-api.tradestation.com/v3',
})

interface TradeStationOrdersResponse {
  Orders: Array<{
    AccountID: string
    CommissionFee: string
    Currency: string
    Duration: string
    GoodTillDate: string
    Legs: Array<{
      AssetType: string
      BuyOrSell: string
      ExecQuantity: string
      ExecutionPrice?: string
      ExpirationDate?: string
      OpenOrClose: string
      OptionType?: string
      QuantityOrdered: string
      QuantityRemaining: string
      StrikePrice?: string
      Symbol: string
      Underlying?: string
    }>
    MarketActivationRules?: Array<{
      RuleType: string
      Symbol: string
      Predicate: string
      TriggerKey: string
      Price: string
    }>
    OrderID: string
    OpenedDateTime: string
    OrderType: string
    PriceUsedForBuyingPower: string
    Routing: string
    Status: string
    StatusDescription: string
    AdvancedOptions?: string
    TimeActivationRules?: Array<{
      TimeUtc: string
    }>
    UnbundledRouteFee: string
    ClosedDateTime?: string
    FilledPrice?: string
    LimitPrice?: string
    GroupName?: string
    StopPrice?: string
    ConditionalOrders?: Array<{
      Relationship: string
      OrderID: string
    }>
  }>
  Errors: string[]
  NextToken: string
}

interface Order {
  accountID: string
  orderID: string
  orderType: string
  status: string
  currency: string
  duration: string
  filledPrice?: number
  goodTillDate: string
  limitPrice?: number
  openedDateTime: string
  priceUsedForBuyingPower: number
  routing: string
  statusDescription: string
  commissionFee: string
}

interface IOrdersProps {
  brokerAccessToken: string
  accountID: string
  brokerName: Broker | undefined
}

const Orders = ({ brokerAccessToken, accountID, brokerName }: IOrdersProps) => {
  const [orders, setOrders] = React.useState<Order[]>()
  const getOrders = async () => {
    switch (brokerName) {
      case Broker.TradeStation: {
        const ordersResponse = (await tradeStationAxiosInstance.get(`/brokerage/accounts/${accountID}/orders`, {
          headers: {
            Authorization: `Bearer ${brokerAccessToken}`,
          },
        })) as AxiosResponse<TradeStationOrdersResponse>

        const newOrders: Order[] = ordersResponse.data.Orders.map((order) => {
          return {
            accountID: order.AccountID,
            orderID: order.OrderID,
            orderType: order.OrderType,
            status: order.Status,
            currency: order.Currency,
            duration: order.Duration,
            filledPrice: order.FilledPrice ? Number(order.FilledPrice) : undefined,
            goodTillDate: order.GoodTillDate,
            limitPrice: order.LimitPrice ? Number(order.LimitPrice) : undefined,
            openedDateTime: order.OpenedDateTime,
            priceUsedForBuyingPower: Number(order.PriceUsedForBuyingPower),
            routing: order.Routing,
            statusDescription: order.StatusDescription,
            commissionFee: order.CommissionFee,
          }
        })
        setOrders(newOrders)
      }
    }
  }

  useEffect(() => {
    getOrders().then(() => {})
    const interval = setInterval(getOrders, 10000)

    return () => clearInterval(interval)
  }, [accountID])

  return (
    <DataTable value={orders}>
      <Column field="orderID" header="ID"></Column>
      <Column field="orderType" header="Type"></Column>
      <Column field="statusDescription" header="Status"></Column>
      <Column field="duration" header="Duration"></Column>
      <Column field="duration" header="Duration"></Column>
      <Column field="filledPrice" header="Filled Price"></Column>
      <Column field="goodTillDate" header="Good Till Date"></Column>
    </DataTable>
  )
}

export default React.memo(Orders)
