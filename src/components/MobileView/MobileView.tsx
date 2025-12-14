import React, { useRef, useState } from 'react'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import 'swiper/css' // Import Swiper styles
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded'
import ScaleIcon from '@mui/icons-material/Scale'
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart'
import { BottomNavigation, BottomNavigationAction, Grid, Stack } from '@mui/material'
import ActionMessages from '../ActionMessages/ActionMessages.tsx'
import Balance from '../Balance/Balance.tsx'
import { TablesContainer } from '../TablesContainer/TablesContainer.tsx'
import 'swiper/css' // Import Swiper styles
import TradingViewWidget from '../Chart/TradingViewWidget.tsx'

interface MobileViewProps {
  Item: React.ComponentType<{ isMobile?: boolean; children: React.ReactNode }>
  spacingBetween: number
}

export const MobileView = ({ Item, spacingBetween }: MobileViewProps) => {
  const swiperRef = useRef<SwiperRef | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleSlideTo = (index: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index)
      setActiveIndex(index) // Update local state to reflect change
    }
  }

  return (
    <>
      <Grid container spacing={spacingBetween} sx={{ flex: 1 }}>
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = { swiper })}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          style={{ height: 'inherit' }}
        >
          <SwiperSlide>
            <Grid size={12} sx={{ height: 'inherit' }}>
              <Stack spacing={spacingBetween} sx={{ height: 'inherit' }}>
                <Item isMobile={true}>
                  <TradingViewWidget />
                </Item>
              </Stack>
            </Grid>
          </SwiperSlide>
          <SwiperSlide>
            <Grid size={12} sx={{ height: 'inherit' }}>
              <Stack spacing={spacingBetween} sx={{ height: 'inherit' }}>
                <Item isMobile={true}>
                  <Balance />
                </Item>
              </Stack>
            </Grid>
          </SwiperSlide>
          <SwiperSlide>
            <Grid size={12} sx={{ height: 'inherit' }}>
              <Stack spacing={spacingBetween} sx={{ height: 'inherit' }}>
                <Item isMobile={true}>
                  <ActionMessages />
                </Item>
              </Stack>
            </Grid>
          </SwiperSlide>
          <SwiperSlide>
            <Grid size={12} sx={{ height: 'inherit' }}>
              <Stack spacing={spacingBetween} sx={{ height: 'inherit' }}>
                <Item isMobile={true}>
                  <TablesContainer />
                </Item>
              </Stack>
            </Grid>
          </SwiperSlide>
        </Swiper>
      </Grid>
      <BottomNavigation
        showLabels
        value={activeIndex}
        onChange={(_event, newValue) => {
          handleSlideTo(newValue)
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
