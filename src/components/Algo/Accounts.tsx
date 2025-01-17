import React, { useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'
import { Dropdown } from 'primereact/dropdown'
import { IAccountsProps, ITradeStationGetAccountsResponse } from './interfaces/Algo.interfaces.ts'

const tradeStationAxiosInstance = axios.create({
  baseURL: 'https://sim-api.tradestation.com/v3',
})

const Accounts = ({ brokerAccessToken, accountID, onChange }: IAccountsProps) => {
  const [brokerAccountsIDs, setBrokerAccountsIDs] = React.useState<string[]>([])
  const getAccounts = async () => {
    const response = (await tradeStationAxiosInstance.get('/brokerage/accounts', {
      headers: {
        Authorization: `Bearer ${brokerAccessToken}`,
      },
    })) as AxiosResponse<ITradeStationGetAccountsResponse>
    const accountsIDs = response.data.Accounts.map((account) => account.AccountID)
    setBrokerAccountsIDs(accountsIDs)
  }

  useEffect(() => {
    getAccounts().then(() => {})
  }, [])

  return (
    <Dropdown
      value={accountID}
      onChange={(e) => onChange(e.value)}
      options={brokerAccountsIDs}
      optionLabel="Select Account"
      placeholder="Select Account"
    />
  )
}

export default React.memo(Accounts)
