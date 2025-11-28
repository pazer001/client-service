import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useSymbataStoreActions, useSymbataStoreUserId } from '../stores/symbataStore.ts'
import { IOpenPosition, IOpenPositionsResponse } from '../stores/symbataStore.types.ts'

export const POLLING_INTERVAL = 30_000 // 30 seconds

/**
 * Custom hook to handle polling open positions and detecting changes
 * Polls every 30 seconds and tracks field changes to trigger flash animations
 */
export const useOpenPositionsPolling = (openPositions: IOpenPositionsResponse | undefined) => {
  const userId = useSymbataStoreUserId()
  const { getBalance, getOpenPositions } = useSymbataStoreActions()
  const [progress, setProgress] = useState(0)
  const previousPositionsRef = useRef<Record<string, IOpenPosition>>({})
  const startTimeRef = useRef<number>(Date.now())

  // Async wrapper to ensure timer resets only after API call completes
  const refreshOpenPositions = useEffectEvent(async () => {
    try {
      await getOpenPositions()
      await getBalance(userId)
    } catch (error) {
      console.error('Error refreshing open positions:', error)
    } finally {
      // Reset timer and progress only after API call completes (success or failure)
      startTimeRef.current = Date.now()
      setProgress(0)
    }
  })

  // Poll open positions every 30 seconds with progress tracking
  useEffect(() => {
    // Fetch immediately on mount
    getOpenPositions()
    startTimeRef.current = Date.now()

    // Set up polling every 30 seconds
    const intervalId = setInterval(() => {
      refreshOpenPositions()
    }, POLLING_INTERVAL)

    // Update progress bar every 100ms for smooth animation
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min((elapsed / POLLING_INTERVAL) * 100, 100)
      setProgress(newProgress)
    }, 100)

    // Cleanup intervals on unmount
    return () => {
      clearInterval(intervalId)
      clearInterval(progressInterval)
    }
  }, [getOpenPositions])

  // Detect changes in positions and trigger flash animation
  useEffect(() => {
    if (!openPositions) return

    const newFlashingFields = new Set<string>()

    // Compare current positions with previous positions using for...in (most efficient - no conversion)
    for (const symbol in openPositions) {
      const currentPos = openPositions[symbol]
      const previousPos = previousPositionsRef.current[symbol]

      if (previousPos) {
        // Check if currentPrice changed
        if (currentPos.currentPrice !== previousPos.currentPrice) {
          newFlashingFields.add(`${symbol}-currentPrice`)
        }
        // Check if profit changed
        if (currentPos.profit !== previousPos.profit) {
          newFlashingFields.add(`${symbol}-profit`)
        }
        // Check if ROR changed
        if (currentPos.currentROR !== previousPos.currentROR) {
          newFlashingFields.add(`${symbol}-currentROR`)
        }
      }
    }

    // Update previous positions reference
    previousPositionsRef.current = { ...openPositions }
  }, [openPositions])

  useEffect(() => {
    getOpenPositions()
    getBalance(userId)
  }, [userId])

  return {
    progress,
    refreshOpenPositions,
  }
}
