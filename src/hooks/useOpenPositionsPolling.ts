import { useCallback, useEffect, useRef, useState } from 'react'
import { useSymbataStoreActions, useSymbataStoreUserId } from '../stores/symbataStore.ts'
import { IOpenPosition, IOpenPositionsResponse } from '../stores/symbataStore.types.ts'

export const POLLING_INTERVAL = 30_000 // 30 seconds

/**
 * Custom hook to handle polling open positions and detecting changes
 */
export const useOpenPositionsPolling = (openPositions: IOpenPositionsResponse | undefined) => {
  const userId = useSymbataStoreUserId()
  const { getBalance, getOpenPositions } = useSymbataStoreActions()
  const [animationKey, setAnimationKey] = useState(0)
  const previousPositionsRef = useRef<Record<string, IOpenPosition>>({})
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Store latest userId in ref
  const userIdRef = useRef(userId)
  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  const fetchData = useCallback(async () => {
    try {
      await getOpenPositions()
      await getBalance(userIdRef.current)
    } catch (error) {
      console.error('Error refreshing open positions:', error)
    }
  }, [getOpenPositions, getBalance])

  const resetAndScheduleNext = useCallback(() => {
    setAnimationKey((prev) => prev + 1)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      await fetchData()
      resetAndScheduleNext()
    }, POLLING_INTERVAL)
  }, [fetchData])

  const refreshOpenPositions = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    await fetchData()
    resetAndScheduleNext()
  }, [fetchData, resetAndScheduleNext])

  // Initial fetch and start polling
  useEffect(() => {
    fetchData()
    resetAndScheduleNext()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [fetchData, resetAndScheduleNext])

  // Detect changes in positions
  useEffect(() => {
    if (!openPositions) return

    for (const symbol in openPositions) {
      const currentPos = openPositions[symbol]
      const previousPos = previousPositionsRef.current[symbol]

      if (previousPos) {
        if (currentPos.currentPrice !== previousPos.currentPrice) {
          // Could trigger flash animation here
        }
      }
    }

    previousPositionsRef.current = { ...openPositions }
  }, [openPositions])

  return {
    animationKey,
    refreshOpenPositions,
  }
}
