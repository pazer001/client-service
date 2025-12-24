import { useEffect, useRef, useState } from 'react'
import {  Typography } from '@mui/material';
import { green, red } from '@mui/material/colors'


interface HighlightedNumberProps {
  value: number
}

interface DigitHighlight {
  index: number
  color: 'green' | 'red'
}

const HighlightedNumber = ({ value }: HighlightedNumberProps) => {
  const [highlights, setHighlights] = useState<DigitHighlight[]>([])
  const prevValueRef = useRef<number | null>(null)

  useEffect(() => {
    if (prevValueRef.current !== null && prevValueRef.current !== value) {
      const prevStr = String(prevValueRef.current)
      const currentStr = String(value)
      const newHighlights: DigitHighlight[] = []

      // Compare strings character by character
      const maxLength = Math.max(prevStr.length, currentStr.length)
      for (let i = 0; i < maxLength; i++) {
        const prevChar = prevStr[i] || ''
        const currentChar = currentStr[i] || ''

        if (prevChar !== currentChar) {
          // Determine color: green if value increased, red if decreased
          const color = value > prevValueRef.current ? 'green' : 'red'
          newHighlights.push({ index: i, color })
        }
      }

      setHighlights(newHighlights)

      // Clear highlights after 250ms
      const timer = setTimeout(() => {
        setHighlights([])
      }, 250)

      return () => clearTimeout(timer)
    }

    prevValueRef.current = value
  }, [value])

  const valueStr = String(value)

  return (
    <>
      {valueStr.split('').map((char, index) => {
        const highlight = highlights.find((h) => h.index === index)
        return (
          <Typography
            key={index}
            component="span"
            variant="body2"
            sx={{
              backgroundColor: 'transparent',
              color: highlight ? highlight.color === 'green' ? green[400] : red[400] : 'inherit',
              transition: 'background-color 0.25s ease, color 0.25s ease',
            }}
          >
            {char}
          </Typography>
        )
      })}
    </>
  )
}

export default HighlightedNumber
