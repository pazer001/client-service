import { useCallback, useEffect, useRef, useState } from 'react'
import { useSymbataStoreActions, useSymbataStoreUserId } from '../stores/symbataStore.ts'
import { IOpenPosition, IOpenPositionsResponse } from '../stores/symbataStore.types.ts'

export const POLLING_INTERVAL = 30_000 // 30 seconds

/**
 * Custom hook to handle polling open positions and detecting changes
 * Uses recursive setTimeout to ensure next poll starts only after previous completes
 */
export const useOpenPositionsPolling = (openPositions: IOpenPositionsResponse | undefined) => {
  const userId = useSymbataStoreUserId()
  const { getBalance, getOpenPositions } = useSymbataStoreActions()
  // Key that changes to restart CSS animation (more performant than JS-controlled progress)
  const [animationKey, setAnimationKey] = useState(0)
  // Track remaining seconds for display
  const [remainingSeconds, setRemainingSeconds] = useState(Math.ceil(POLLING_INTERVAL / 1000))
  const previousPositionsRef = useRef<Record<string, IOpenPosition>>({})
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(true)

  // Store latest userId in ref to avoid recreating callbacks when it changes
  const userIdRef = useRef(userId)
  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  /**
   * Fetches open positions and balance data
   */
  const fetchData = useCallback(async () => {
    try {
      await getOpenPositions()
      await getBalance(userIdRef.current)
    } catch (error) {
      console.error('Error refreshing open positions:', error)
    }
  }, [getOpenPositions, getBalance])

  /**
   * Resets the animation and schedules the next poll
   */
  const resetAndScheduleNext = useCallback(() => {
    if (!isMountedRef.current) return

    // Increment key to restart CSS animation
    setAnimationKey((prev) => prev + 1)
    setRemainingSeconds(Math.ceil(POLLING_INTERVAL / 1000))

    // Clear any existing timeout before scheduling new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      await fetchData()
      resetAndScheduleNext()
    }, POLLING_INTERVAL)
  }, [fetchData])

  /**
   * Manual refresh - cancels current timeout and fetches immediately
   */
  const refreshOpenPositions = useCallback(async () => {
    // Cancel any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    await fetchData()
    resetAndScheduleNext()
  }, [fetchData, resetAndScheduleNext])

  // Initial fetch and start polling (runs only once on mount)
  useEffect(() => {
    isMountedRef.current = true

    // Fetch immediately on mount
    fetchData()

    // Start recursive polling
    resetAndScheduleNext()

    // Update remaining seconds every second (just for display, not animation)
    const countdownIntervalId = setInterval(() => {
      if (!isMountedRef.current) return
      setRemainingSeconds((prev) => Math.max(prev - 1, 0))
    }, 1000)

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      clearInterval(countdownIntervalId)
    }
  }, [fetchData, resetAndScheduleNext])

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

  return {
    animationKey,
    remainingSeconds,
    refreshOpenPositions,
  }
}
