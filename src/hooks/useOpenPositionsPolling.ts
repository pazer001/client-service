import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { IOpenPosition, IOpenPositionsResponse } from '../stores/symbataStore.types.ts'

/**
 * Custom hook to handle polling open positions and detecting changes
 * Polls every 60 seconds and tracks field changes to trigger flash animations
 */
export const useOpenPositionsPolling = (
  openPositions: IOpenPositionsResponse | undefined,
  getOpenPositions: () => Promise<void>,
) => {
  const [flashingFields, setFlashingFields] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState(0)
  const previousPositionsRef = useRef<Record<string, IOpenPosition>>({})
  const startTimeRef = useRef<number>(Date.now())

  // Async wrapper to ensure timer resets only after API call completes
  const refreshOpenPositions = useEffectEvent(async () => {
    try {
      await getOpenPositions()
    } catch (error) {
      console.error('Error refreshing open positions:', error)
    } finally {
      // Reset timer and progress only after API call completes (success or failure)
      startTimeRef.current = Date.now()
      setProgress(0)
    }
  })

  // Poll open positions every 60 seconds with progress tracking
  useEffect(() => {
    // Fetch immediately on mount
    getOpenPositions()
    startTimeRef.current = Date.now()

    // Set up polling every 1 minute (60000ms)
    const intervalId = setInterval(() => {
      refreshOpenPositions()
    }, 60000)

    // Update progress bar every 100ms for smooth animation
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min((elapsed / 60000) * 100, 100)
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

    // Update flashing fields if there are changes
    if (newFlashingFields.size > 0) {
      setFlashingFields(newFlashingFields)

      // Clear flashing after animation completes (1 second)
      setTimeout(() => {
        setFlashingFields(new Set())
      }, 1000)
    }

    // Update previous positions reference
    previousPositionsRef.current = { ...openPositions }
  }, [openPositions])

  return {
    flashingFields,
    progress,
    refreshOpenPositions,
  }
}
