'use client'

import { useEffect, useState, useRef } from 'react'
import { getDaysUntilFestival, isFestivalActive, getCurrentFestivalDay, DAY_THEMES } from '@/lib/utils'
import Link from 'next/link'

interface Step {
  static: string
  word: string
  color: string
  finale?: boolean
}

const SEQUENCE: Step[] = [
  { static: 'get ready for', word: 'cricket',            color: '#f59e0b' },
  { static: 'get ready for', word: 'football',           color: '#22c55e' },
  { static: 'get ready for', word: 'basketball',         color: '#f97316' },
  { static: 'get ready for', word: 'volleyball',         color: '#3b82f6' },
  { static: 'get ready for', word: 'badminton',          color: '#a855f7' },
  { static: 'get ready for', word: 'table tennis',       color: '#06b6d4' },
  { static: 'get ready for', word: 'chess',              color: '#ec4899' },
  { static: 'get ready for', word: 'the ultimate clash', color: '#ffffff' },
  { static: 'get ready for', word: 'hostel days 2026',   color: '#fbbf24', finale: true },
]

const GAME_HOLD     = 100
const ULTIMATE_HOLD = 150
const FADE_MS       = 0

interface Props {
  liveCount: number
  totalGames: number
  completedCount: number
  registrationUrl?: string
}

export function HomeHero({ liveCount, totalGames, completedCount, registrationUrl = '/register' }: Props) {
  const [mounted, setMounted]               = useState(false)
  const [timeLeft, setTimeLeft]             = useState({ h: 0, m: 0, s: 0 })
  const [animDone, setAnimDone]             = useState(false)
  const [buttonVisible, setButtonVisible]   = useState(false)
  const [wordOpacity, setWordOpacity]       = useState(1)
  const [displayedWord, setDisplayedWord]   = useState(SEQUENCE[0].word)
  const [displayedColor, setDisplayedColor] = useState(SEQUENCE[0].color)
  const [prefix, setPrefix]                 = useState(SEQUENCE[0].static)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clear = () => { if (timerRef.current) clearTimeout(timerRef.current) }

  const runStep = (i: number) => {
    if (i >= SEQUENCE.length) return
    const s = SEQUENCE[i]
    setPrefix(s.static)

    if (s.finale) {
      setDisplayedWord(s.word)
      setDisplayedColor(s.color)
      setWordOpacity(1)
      timerRef.current = setTimeout(() => {
        setAnimDone(true)
        setTimeout(() => setButtonVisible(true), 300)
      }, 500)
      return
    }

    setWordOpacity(0)
    timerRef.current = setTimeout(() => {
      setDisplayedWord(s.word)
      setDisplayedColor(s.color)
      setWordOpacity(1)
      scheduleNext(i, s)
    }, FADE_MS)
  }

  const scheduleNext = (i: number, s: Step) => {
    const hold = s.word === 'the ultimate clash' ? ULTIMATE_HOLD : GAME_HOLD
    timerRef.current = setTimeout(() => runStep(i + 1), hold)
  }

  useEffect(() => {
    setMounted(true)
    setDisplayedWord(SEQUENCE[0].word)
    setDisplayedColor(SEQUENCE[0].color)
    setPrefix(SEQUENCE[0].static)
    setWordOpacity(0)
    timerRef.current = setTimeout(() => {
      setWordOpacity(1)
      scheduleNext(0, SEQUENCE[0])
    }, FADE_MS)
    return () => clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mounted) return
    const festivalStart = new Date(process.env.NEXT_PUBLIC_FESTIVAL_START_DATE || '2026-03-10')
    const tick = () => {
      const now  = new Date()
      const diff = festivalStart.getTime() - now.getTime()
      if (diff <= 0) return
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [mounted])

  const festivalActive = mounted ? isFestivalActive()      : false
  const daysUntil      = mounted ? getDaysUntilFestival()  : 0
  const currentDay     = mounted ? getCurrentFestivalDay() : 1
  const dayTheme       = DAY_THEMES[currentDay] || DAY_THEMES[1]

  return (
    <section
      className="relative overflow-hidden px-4 sm:px-6 max-w-2xl md:max-w-4xl mx-auto"
      style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '2.5rem' }}
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 70% 50%, var(--accent) 0%, transparent 60%)` }}
      />

      {/* All content sits at the bottom half */}
      <div className="relative">

        {/* Live badge */}
        <div className="flex items-center gap-2 mb-3">
          {liveCount > 0 && (
            <span className="live-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
              {liveCount} Live
            </span>
          )}
        </div>

        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600&display=swap"
          rel="stylesheet"
        />

        {/* Flash-text block */}
        <div
          style={{
            minHeight: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            fontFamily: "'Barlow Condensed', var(--font-display), sans-serif",
            marginBottom: '1.25rem',
            width: '100%',
          }}
        >
          {!animDone ? (
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(22px, 7vw, 72px)',
                fontWeight: 400,
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                color: 'var(--text-primary)',
                textAlign: 'left',
                lineHeight: 1.15,
              }}
            >
              <span>{prefix}</span>
              <span> </span>
              <span
                style={{
                  color: displayedColor,
                  fontWeight: 600,
                  opacity: wordOpacity,
                  transition: `opacity ${FADE_MS}ms ease`,
                }}
              >
                {displayedWord}
              </span>
            </p>
          ) : (
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'clamp(22px, 7vw, 72px)',
                  fontWeight: 400,
                  whiteSpace: 'normal',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  lineHeight: 1.15,
                }}
              >
                <span>{prefix}</span>
                <span> </span>
                <span style={{ color: displayedColor, fontWeight: 600 }}>
                  {displayedWord}
                </span>
              </p>

              {/* Register button — original inline style, left aligned */}
              <Link
                href={registrationUrl}
                style={{
                  display: 'inline-block',
                  marginTop: 20,
                  fontFamily: "'Barlow Condensed', var(--font-display), sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  padding: '8px 24px',
                  border: '1px solid var(--accent)',
                  borderRadius: 4,
                  background: 'var(--accent-glow)',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase' as const,
                  opacity: buttonVisible ? 1 : 0,
                  transform: buttonVisible ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                }}
              >
                Register ↗
              </Link>
            </div>
          )}
        </div>

        {/* Stats / countdown */}
        {!festivalActive && daysUntil > 0 ? (
          <div className="card w-full sm:w-auto p-4 md:p-6">
            {/* Mobile: 2×2 grid */}
            <div className="grid grid-cols-2 gap-4 sm:hidden">
              {[
                { value: String(timeLeft.h).padStart(2, '0'), label: 'hrs' },
                { value: String(timeLeft.m).padStart(2, '0'), label: 'min' },
                { value: String(timeLeft.s).padStart(2, '0'), label: 'sec', accent: true },
                { value: `${daysUntil}d`, label: 'to go' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p
                    className="font-display font-bold tabular-nums text-3xl"
                    style={{ color: item.accent ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {item.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop: single row */}
            <div className="hidden sm:inline-flex items-center gap-4 md:gap-8">
              <div className="text-center">
                <p className="font-display font-bold tabular-nums text-2xl md:text-5xl" style={{ color: 'var(--text-primary)' }}>
                  {String(timeLeft.h).padStart(2, '0')}
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>hrs</p>
              </div>
              <span className="text-xl md:text-3xl font-bold" style={{ color: 'var(--border-strong)' }}>:</span>
              <div className="text-center">
                <p className="font-display font-bold tabular-nums text-2xl md:text-5xl" style={{ color: 'var(--text-primary)' }}>
                  {String(timeLeft.m).padStart(2, '0')}
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>min</p>
              </div>
              <span className="text-xl md:text-3xl font-bold" style={{ color: 'var(--border-strong)' }}>:</span>
              <div className="text-center">
                <p className="font-display font-bold tabular-nums text-2xl md:text-5xl" style={{ color: 'var(--accent)' }}>
                  {String(timeLeft.s).padStart(2, '0')}
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>sec</p>
              </div>
              <div className="ml-2 pl-4 md:pl-8 border-l" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs md:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{daysUntil}d to go</p>
                <p className="text-[10px] md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>until kickoff</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 md:gap-10">
            <div>
              <p className="font-display font-bold text-2xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>{totalGames}</p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Total games</p>
            </div>
            <div className="w-px h-8 md:h-14" style={{ background: 'var(--border)' }} />
            <div>
              <p className="font-display font-bold text-2xl md:text-4xl" style={{ color: liveCount > 0 ? 'var(--live-color)' : 'var(--text-primary)' }}>
                {liveCount}
              </p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Live now</p>
            </div>
            <div className="w-px h-8 md:h-14" style={{ background: 'var(--border)' }} />
            <div>
              <p className="font-display font-bold text-2xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>{completedCount}</p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Completed</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}