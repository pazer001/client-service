import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded'
import ScaleIcon from '@mui/icons-material/Scale'
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart'
import { BottomNavigation, BottomNavigationAction, Grid, Stack } from '@mui/material'
import React, { Activity, useState } from 'react'
import ActionMessages from '../ActionMessages/ActionMessages.tsx'
import Balance from '../Balance/Balance.tsx'
import TradingViewWidget from '../Chart/TradingViewWidget.tsx'
import { TablesContainer } from '../TablesContainer/TablesContainer.tsx'

interface MobileViewProps {
  Item: React.ComponentType<{ isMobile?: boolean; children: React.ReactNode }>
  spacingBetween: number
}

export const MobileView = ({ Item, spacingBetween }: MobileViewProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <Grid container spacing={spacingBetween} sx={{ flex: 1 }}>
        <Grid size={12} sx={{ height: 'inherit' }}>
          <Stack spacing={spacingBetween} sx={{ height: '100%' }}>
            <Item isMobile={true}>
              <Activity mode={activeIndex === 0 ? 'visible' : 'hidden'}>
                <TradingViewWidget />
              </Activity>
              <Activity mode={activeIndex === 1 ? 'visible' : 'hidden'}>
                <Balance />
              </Activity>
              <Activity mode={activeIndex === 2 ? 'visible' : 'hidden'}>
                <ActionMessages />
              </Activity>
              <Activity mode={activeIndex === 3 ? 'visible' : 'hidden'}>
                <TablesContainer />
              </Activity>
            </Item>
          </Stack>
        </Grid>
      </Grid>
      <BottomNavigation
        showLabels
        value={activeIndex}
        onChange={(_event, newValue) => {
          setActiveIndex(newValue)
        }}
      >
        <BottomNavigationAction label="Chart" icon={<WaterfallChartIcon />} />
        <BottomNavigationAction label="Balance" icon={<ScaleIcon />} />
        <BottomNavigationAction label="Actions" icon={<BusinessCenterIcon />} />
        <BottomNavigationAction label="Positions" icon={<CurrencyExchangeRoundedIcon />} />
      </BottomNavigation>
    </>
  )
}
