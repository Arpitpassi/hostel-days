'use client'

import { useEffect, useState } from 'react'

interface Props {
  target: string   // 'YYYY-MM-DDTHH:MM:SS'
  label: string
}

export function ScheduleCountdown({ target, label }: Props) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [expired, setExpired]   = useState(false)

  useEffect(() => {
    const targetMs = new Date(target).getTime()

    const tick = () => {
      const diff = targetMs - Date.now()
      if (diff <= 0) { setExpired(true); return }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000)  / 60000),
        s: Math.floor((diff % 60000)    / 1000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  // Hide once the event has started
  if (expired) return null

  const units = [
    { value: String(timeLeft.d).padStart(2, '0'), label: 'days' },
    { value: String(timeLeft.h).padStart(2, '0'), label: 'hrs'  },
    { value: String(timeLeft.m).padStart(2, '0'), label: 'min'  },
    { value: String(timeLeft.s).padStart(2, '0'), label: 'sec'  },
  ]

  return (
    <div
      className="mb-5 rounded-xl px-4 py-4"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs uppercase tracking-wider font-semibold mb-3 text-center" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-3 sm:gap-6">
            <div className="text-center">
              <p
                className="font-display font-bold tabular-nums text-3xl sm:text-4xl"
                style={{ color: 'var(--accent)' }}
              >
                {u.value}
              </p>
              <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {u.label}
              </p>
            </div>
            {i < units.length - 1 && (
              <span className="text-xl font-bold pb-4" style={{ color: 'var(--border-strong)' }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}