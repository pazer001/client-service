import { useEffect, useState } from 'react'
import { IAnalyzedResultProps } from './AnalyzedResult.tsx'
import { IAnalyzedSignalsAndLines } from './AnalyzedResult.interfaces.ts'
import axios, { AxiosResponse } from 'axios'

const API_HOST = import.meta.env.VITE_API_HOST

export const useAnalyzedResult = (props: IAnalyzedResultProps) => {
  const { symbol, interval } = props

  const [analyzedSignalsAndLines, setAnalyzedSignalsAndLines] = useState<IAnalyzedSignalsAndLines>()

  const getAnalyzedResult = async () => {
    if (symbol && interval) {
      try {
        const analyzedResult = (await axios.post(`${API_HOST}/analyze/analyzedSignalsAndLines/${symbol}/${interval}`, {
          period: 'medium',
        })) as AxiosResponse<IAnalyzedSignalsAndLines>
        setAnalyzedSignalsAndLines(analyzedResult.data)
      } catch (error) {
        console.error('Error while fetching analyzed signals and lines', error)
      }
    }
  }

  useEffect(() => {
    getAnalyzedResult()
  }, [symbol])

  return {
    analyzedSignalsAndLines,
  }
}
