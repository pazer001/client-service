import { Avatar, Box, ButtonBase, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { Broker } from './interfaces/algo.interfaces.ts'
const brokers = [
  { id: Broker.charlesSchwab, name: 'Charles Schwab', logo: 'https://developer.schwab.com/assets/schwab-logo.svg' },
  {
    id: Broker.tradeStationLive,
    name: 'TradeStation Live',
    logo: 'https://logowik.com/content/uploads/images/tradestation8545.logowik.com.webp',
  },
  {
    id: Broker.tradeStationDemo,
    name: 'TradeStation Demo',
    logo: 'https://logowik.com/content/uploads/images/tradestation8545.logowik.com.webp',
  },
]

// interface IBrokerProps {
//   onSelectedBroker: (broker: Broker) => void
// }

const brokerAuth = (broker: Broker) => {
  switch (broker) {
    case Broker.charlesSchwab: {
      sessionStorage.setItem('broker', broker)
      const appKey = `FWGg2IXdb4sKv2dNfZHAZnbeI9YBMont`
      const redirectUri = encodeURIComponent(location.origin)

      // Add all required OAuth parameters
      const authUrl = `https://api.schwabapi.com/v1/oauth/authorize?client_id=${appKey}&redirect_uri=${redirectUri}&response_type=code&scope=readonly&state=${Date.now()}`

      location.href = authUrl
      break
    }
    case Broker.tradeStationLive: {
      sessionStorage.setItem('broker', broker)
      const appKey = 'vJehUJUnvo3soMzTVAQruwwdFXFtsDC1'
      const redirectUri = location.origin

      // Add all required OAuth parameters
      const authUrl = `https://signin.tradestation.com/authorize?response_type=code&client_id=${appKey}&redirect_uri=${redirectUri}&audience=https://api.tradestation.com&state=STATE&scope=openid offline_access profile MarketData ReadAccount Trade Matrix OptionSpreads`

      location.href = authUrl
      break
    }
    case Broker.tradeStationDemo: {
      sessionStorage.setItem('broker', broker)
      const appKey = 'vJehUJUnvo3soMzTVAQruwwdFXFtsDC1'
      const redirectUri = location.origin

      // Add all required OAuth parameters
      const authUrl = `https://signin.tradestation.com/authorize?response_type=code&client_id=${appKey}&redirect_uri=${redirectUri}&audience=https://api.tradestation.com&state=STATE&scope=openid offline_access profile MarketData ReadAccount Trade Matrix OptionSpreads`

      location.href = authUrl
      break
    }
  }
}

const Brokers = () => {
  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {brokers.map((broker) => (
        <ButtonBase key={broker.name} onClick={() => brokerAuth(broker.id)}>
          <Card>
            <Avatar src={broker.logo} sx={{ mx: 'auto' }} />
            <CardContent>
              <Typography variant="body2">{broker.name}</Typography>
            </CardContent>
          </Card>
        </ButtonBase>
      ))}
    </Box>
  )
}

export default React.memo(Brokers)
