'use client'

import { useCallback } from 'react'

export function useConfetti() {
  const fire = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f97316', '#fb923c', '#fbbf24', '#34d399', '#60a5fa'],
    })
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f97316', '#fbbf24'],
      })
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#34d399', '#60a5fa'],
      })
    }, 250)
  }, [])

  return { fire }
}
