import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../axios'
import Brokers from './Brokers.tsx'

const Algo = () => {
  const [broker, setBroker] = useState(sessionStorage.getItem('broker'))
  const [brokerAuthData, setBrokerAuthData] = useState(
    sessionStorage.getItem('brokerAuthData') !== undefined
      ? JSON.parse(sessionStorage.getItem('brokerAuthData') as string)
      : undefined,
  )
  const [accounts, setAccounts] = useState<string[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>('')

  const getAccessToken = async (code: string) => {
    const broker = sessionStorage.getItem('broker')
    const redirectUri = location.origin

    try {
      const getAccessTokenResponse = await axiosInstance.post(`/algo/exchangeCodeWithAccessToken`, {
        code,
        redirectUri,
        broker,
      })
      sessionStorage.setItem('brokerAuthData', JSON.stringify(getAccessTokenResponse.data))
      setBrokerAuthData(getAccessTokenResponse.data)
    } catch (e) {
      console.error('Error fetching access token:', e)
      sessionStorage.removeItem('brokerAuthData')
      setBrokerAuthData(undefined)
      location.href = location.origin
    }
  }

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code && !brokerAuthData) {
      getAccessToken(code)
    }
  }, [])

  const fetchAccounts = useCallback(async () => {
    if (broker && brokerAuthData) {
      try {
        const response = await axiosInstance.post(`/algo/accounts/${broker}`, brokerAuthData)
        setAccounts(response.data)
        if (response.data.length > 0) {
          setSelectedAccount(response.data[0])
        }
      } catch (error) {
        console.error('Error fetching accounts:', error)
      }
    }
  }, [broker, brokerAuthData])

  useEffect(() => {
    setBroker(sessionStorage.getItem('broker'))
    if (brokerAuthData) {
      fetchAccounts()
    }
  }, [brokerAuthData, broker, fetchAccounts])

  const handleAccountChange = (event: SelectChangeEvent) => {
    setSelectedAccount(event.target.value)
  }

  const handleRun = async () => {
    if (broker && selectedAccount && brokerAuthData) {
      try {
        const response = await axiosInstance.post(`/algo/run/${broker}/${selectedAccount}`, brokerAuthData)
        console.log('Run response:', response.data)
      } catch (error) {
        console.error('Error running algo:', error)
      }
    }
  }

  return (
    <Box>
      {!brokerAuthData && <Brokers />}
      {brokerAuthData && accounts.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="account-select-label">Account</InputLabel>
            <Select
              labelId="account-select-label"
              id="account-select"
              value={selectedAccount}
              label="Account"
              onChange={handleAccountChange}
            >
              {accounts.map((account) => (
                <MenuItem key={account} value={account}>
                  {account}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleRun} sx={{ mt: 2, height: 56 }}>
            Run
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default React.memo(Algo)
