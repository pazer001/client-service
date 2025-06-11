import React, { useEffect, useState } from 'react'
import ReactECharts, { EChartsOption } from 'echarts-for-react'
import { IPrices, ISymbolItem } from '../../stores/symbataStore.types.ts'
import { useSymbataStoreSymbol } from '../../stores/symbataStore.ts'
import { DateTime } from 'luxon'
import { red, green } from '@mui/material/colors'
import type { CallbackDataParams } from 'echarts/types/dist/shared'

const Chart = () => {
  const [option, setOption] = useState<EChartsOption>({
    xAxis: {
      data: [],
    },
    yAxis: {},
    series: [{ type: 'candlestick', data: [] }],
  })
  const symbol: ISymbolItem | undefined = useSymbataStoreSymbol()

  const symbolRestructurePricesToChart = (symbolRestructurePrices?: IPrices) => {
    const xAxisData: (string | null)[] = []
    const seriesData: number[][] = []
    const volumeData: number[] = []

    if (!symbolRestructurePrices || !symbolRestructurePrices.close) return
    const length = symbolRestructurePrices.close.length
    for (let i = 0; i < length; i++) {
      const open = symbolRestructurePrices.open[i]
      const close = symbolRestructurePrices.close[i]
      const low = symbolRestructurePrices.low[i]
      const high = symbolRestructurePrices.high[i]
      const timestamp = symbolRestructurePrices.timestamp[i]
      const volume = symbolRestructurePrices.volume[i]

      xAxisData.push(DateTime.fromMillis(timestamp).toISODate())
      seriesData.push([close, open, low, high])
      volumeData.push(volume)
    }

    // setOption((lastOption) => ({
    //   ...lastOption,
    //   xAxis: {
    //     ...lastOption.xAxis,
    //     data: xAxisData,
    //   },
    //   series: [
    //     {
    //       type: 'candlestick',
    //       data: seriesData,
    //     },
    //   ],
    // }))

    setOption((lastOption: EChartsOption) => {
      return {
        ...lastOption,
        formatter: (params: CallbackDataParams[]) => {
          const dataPoint = params[0]
          const volumePoint = params[1]

          if (!dataPoint || !Array.isArray(dataPoint.data)) return ''

          const [open, close, low, high] = dataPoint.data as [number, number, number, number]
          const volume = volumePoint ? (volumePoint.data as number) : 0

          return `
    <div>
      <div>
        ${dataPoint.name}
      </div>
      <div><b>Open:</b> ${open.toFixed(2)}</div>
      <div><b>High:</b> ${high.toFixed(2)}</div>
      <div><b>Low:</b> ${low.toFixed(2)}</div>
      <div><b>Close:</b> ${close.toFixed(2)}</div>
      <div><b>Volume:</b> ${volume.toLocaleString()}</div>
    </div>
  `
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },

          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000',
          },

          // extraCssText: 'width: 170px'
        },

        // Create a grid layout to separate candlestick and volume
        grid: [
          {
            left: '10%',
            right: '8%',
            height: '65%', // Candlestick takes 65% of height
          },
          {
            left: '10%',
            right: '8%',
            top: '75%', // Volume starts at 75% from top
            height: '20%', // Volume takes 20% of height
          },
        ],
        xAxis: [
          {
            ...lastOption.xAxis,
            data: xAxisData,
            gridIndex: 0, // First grid
          },
          {
            type: 'category',
            data: xAxisData,
            gridIndex: 1, // Second grid
            show: false, // Hide x-axis for volume
          },
        ],
        yAxis: [
          {
            ...lastOption.yAxis,
            gridIndex: 0, // First grid
          },
          {
            type: 'value',
            gridIndex: 1, // Second grid
            splitLine: { show: false },
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 50,
            end: 100,
          },
        ],
        series: [
          {
            type: 'candlestick',
            name: symbol?.symbol,
            data: seriesData,
            xAxisIndex: 0,
            yAxisIndex: 0,
          },
          {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: volumeData.map((volume, index) => ({
              value: volume,
              // Color based on price movement (green for up, red for down)
              itemStyle: {
                color:
                  seriesData[index] && seriesData[index][1] <= seriesData[index][2]
                    ? green[400] // Green for up
                    : red[400], // Red for down
              },
            })),
          },
        ],
      }
    })
  }

  useEffect(() => symbolRestructurePricesToChart(symbol?.recommendation?.symbolRestructurePrices), [symbol])
  return symbol ? <ReactECharts option={option} style={{ width: '100%', height: '100%' }} /> : null
}

export default React.memo(Chart)
