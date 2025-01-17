import React, { useEffect } from 'react'
import { Button } from 'primereact/button'
import Accounts from './Accounts.tsx'
import axios from 'axios'
import Balances from './Balances.tsx'
import { TabPanel, TabView } from 'primereact/tabview'
import Orders from './Orders.tsx'
import { Broker } from './interfaces/Algo.interfaces.ts'
import Positions from './Positions.tsx'
const apiServiceAxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
})

const Algo = () => {
  const [code, setCode] = React.useState('')
  const [brokerName, setBrokerName] = React.useState<Broker>()
  const [brokerAccessToken, setBrokerAccessToken] = React.useState('')

  const [selectedBrokerAccountId, setSelectedBrokerAccountId] = React.useState<string>('')

  const authorize = (brokerName: Broker) => {
    localStorage.setItem('brokerName', brokerName)
    const tradeStationClientId = 'vJehUJUnvo3soMzTVAQruwwdFXFtsDC1'
    switch (brokerName) {
      case Broker.TradeStation:
        location.href = `https://signin.tradestation.com/authorize?response_type=code&client_id=${tradeStationClientId}&redirect_uri=http://localhost:3001/&audience=https://api.tradestation.com&state=STATE&scope=openid offline_access profile MarketData ReadAccount Trade Matrix OptionSpreads`
        break
      default:
        break
    }
  }

  const getToken = async (code: string, brokerName: Broker) => {
    switch (brokerName) {
      case Broker.TradeStation: {
        const authorizeResponse = await apiServiceAxiosInstance.post('/broker/getToken', {
          code,
          brokerName,
        })
        setBrokerAccessToken(() => authorizeResponse.data.access_token)
      }
    }
  }

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code') || ''
    if (code) {
      setCode(code)
      const brokerName = localStorage.getItem('brokerName') as Broker
      setBrokerName(brokerName)
      if (brokerName && !brokerAccessToken) {
        getToken(code, brokerName).then((r) => console.log(r))
      }
    } else {
      localStorage.removeItem('brokerName')
    }
  }, [])

  return (
    <div>
      {!code && (
        <Button onClick={() => authorize(Broker.TradeStation)}>
          <img src="/tradestation.png" width="56" alt={Broker.TradeStation} />
        </Button>
      )}
      {brokerAccessToken && (
        <Accounts
          brokerAccessToken={brokerAccessToken}
          accountID={selectedBrokerAccountId}
          onChange={setSelectedBrokerAccountId}
        />
      )}
      {brokerAccessToken && selectedBrokerAccountId && (
        <TabView>
          <TabPanel header="Balances">
            {brokerAccessToken && selectedBrokerAccountId && (
              <Balances
                brokerAccessToken={brokerAccessToken}
                accountID={selectedBrokerAccountId}
                brokerName={brokerName}
              />
            )}
          </TabPanel>
          <TabPanel header="Orders">
            {brokerAccessToken && selectedBrokerAccountId && (
              <Orders
                brokerAccessToken={brokerAccessToken}
                accountID={selectedBrokerAccountId}
                brokerName={brokerName}
              />
            )}
          </TabPanel>

          <TabPanel header="Positions">
            {brokerAccessToken && selectedBrokerAccountId && (
              <Positions
                brokerAccessToken={brokerAccessToken}
                accountID={selectedBrokerAccountId}
                brokerName={brokerName}
              />
            )}
          </TabPanel>
        </TabView>
      )}
    </div>
  )
}

export default Algo
