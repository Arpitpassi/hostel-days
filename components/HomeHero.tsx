'use client'

import { useEffect, useState, useRef } from 'react'
import { getDaysUntilFestival, isFestivalActive, getCurrentFestivalDay, DAY_THEMES } from '@/lib/utils'
import Link from 'next/link'
import BirdAnimation from '@/app/BirdAnimation'

interface Step {
  word: string
  color: string
  finale?: boolean
}

const SEQUENCE: Step[] = [
  // — original sports —
  { word: 'cricket',            color: '#f59e0b' },
  { word: 'football',           color: '#22c55e' },
  { word: 'basketball',         color: '#f97316' },
  { word: 'volleyball',         color: '#3b82f6' },
  { word: 'badminton',          color: '#a855f7' },
  { word: 'table tennis',       color: '#06b6d4' },
  { word: 'chess',              color: '#ec4899' },

  // — new from schedule —
  { word: 'carrom',             color: '#84cc16' },
  { word: 'track events',       color: '#f43f5e' },
  { word: '7 stones',           color: '#fb923c' },
  { word: 'javelin',            color: '#34d399' },
  { word: 'kho kho',            color: '#facc15' },
  { word: 'archery',            color: '#38bdf8' },
  { word: 'duet singing',       color: '#e879f9' },
  { word: 'fashion show',       color: '#f472b6' },
  { word: 'graffiti',           color: '#4ade80' },
  { word: 'sketching',          color: '#fb7185' },
  { word: 'dance',              color: '#c084fc' },
  { word: 'instrumental',       color: '#fbbf24' },
  { word: 'dj night',           color: '#818cf8' },

  // — finale —
  { word: 'the ultimate clash', color: '#ffffff' },
  { word: 'hostel days 2026',   color: '#ecbe19ff', finale: true },
]

const GAME_HOLD     = 100
const ULTIMATE_HOLD = 250
const FADE_MS       = 50

interface Props {
  liveCount: number
  totalGames: number
  completedCount: number
  registrationUrl?: string
}

// ============================================================
//  POSITION CONTROLS — edit these values to reposition
// ============================================================

const BIRD_DESKTOP_TRANSLATE_Y = '-6vh'
const BIRD_MOBILE_TRANSLATE_Y  = '-2vh'

const BIRD_DESKTOP_TRANSLATE_X = '0px'
const BIRD_MOBILE_TRANSLATE_X  = '-8px'   // ← move bird left/right on mobile, e.g. '-10vw' or '5%'

const BIRD_DESKTOP_SCALE       = '1.35'
const BIRD_MOBILE_SCALE        = '1.03'

const TEXT_DESKTOP_PADDING_TOP = '6vh'
const TEXT_MOBILE_PADDING_TOP  = '3vh'

const WORD_DESKTOP_MARGIN_TOP  = '10vh'
const WORD_MOBILE_MARGIN_TOP   = '3.5vh'

const WORD_DESKTOP_PADDING_TOP = 'clamp(10vh, 6vw, 15vh)'
const WORD_MOBILE_PADDING_TOP  = '14vh'

const STATS_DESKTOP_MIN_HEIGHT = '26vh'
const STATS_MOBILE_MIN_HEIGHT  = '14vh'

// ============================================================

export function HomeHero({ liveCount, totalGames, completedCount, registrationUrl = '/Participate' }: Props) {
  const [mounted, setMounted]               = useState(false)
  const [timeLeft, setTimeLeft]             = useState({ h: 0, m: 0, s: 0 })
  const [buttonVisible, setButtonVisible]   = useState(false)
  const [wordOpacity, setWordOpacity]       = useState(1)
  const [displayedWord, setDisplayedWord]   = useState(SEQUENCE[0].word)
  const [displayedColor, setDisplayedColor] = useState(SEQUENCE[0].color)
  const [isMobile, setIsMobile]             = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clear = () => { if (timerRef.current) clearTimeout(timerRef.current) }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const runStep = (i: number) => {
    if (i >= SEQUENCE.length) return
    const s = SEQUENCE[i]

    if (s.finale) {
      setDisplayedWord(s.word)
      setDisplayedColor(s.color)
      setWordOpacity(1)
      timerRef.current = setTimeout(() => {
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
  const _dayTheme      = DAY_THEMES[currentDay] || DAY_THEMES[1]

  const birdTranslateY  = isMobile ? BIRD_MOBILE_TRANSLATE_Y  : BIRD_DESKTOP_TRANSLATE_Y
  const birdTranslateX  = isMobile ? BIRD_MOBILE_TRANSLATE_X  : BIRD_DESKTOP_TRANSLATE_X
  const birdScale       = isMobile ? BIRD_MOBILE_SCALE        : BIRD_DESKTOP_SCALE
  const textPaddingTop  = isMobile ? TEXT_MOBILE_PADDING_TOP  : TEXT_DESKTOP_PADDING_TOP
  const wordMarginTop   = isMobile ? WORD_MOBILE_MARGIN_TOP   : WORD_DESKTOP_MARGIN_TOP
  const wordPaddingTop  = isMobile ? WORD_MOBILE_PADDING_TOP  : WORD_DESKTOP_PADDING_TOP
  const statsMinHeight  = isMobile ? STATS_MOBILE_MIN_HEIGHT  : STATS_DESKTOP_MIN_HEIGHT

  return (
    <section
      className="relative overflow-hidden px-4 sm:px-6 max-w-2xl md:max-w-4xl mx-auto flex flex-col min-h-[40vh] md:min-h-[60vh]"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none z-0"
        style={{ backgroundImage: `radial-gradient(circle at 70% 50%, var(--accent) 0%, transparent 60%)` }}
      />

      {/* Bird */}
      <div
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
        style={{ transform: `translateX(${birdTranslateX}) translateY(${birdTranslateY})` }}
      >
        <div style={{ width: '100%', maxWidth: '500px', transform: `scale(${birdScale})` }}>
          <BirdAnimation />
        </div>
      </div>

      {/* Text + Button + Stats */}
      <div
        className="relative z-10 w-full pointer-events-auto flex flex-col items-center flex-1"
        style={{ paddingTop: textPaddingTop }}
      >

        {/* Live badge */}
        <div className="flex items-center justify-center gap-2 mb-1 w-full">
          {liveCount > 0 && (
            <span className="live-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
              {liveCount} Live
            </span>
          )}
        </div>

        {/* Merch text — mobile only */}
        <p className="md:hidden text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full mr-1 live-dot align-middle"
            style={{ background: '#facc15' }}
          />
          Merch is live —{' '}
          <Link
            href="/merch"
            style={{ color: 'var(--text-primary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            Buy Now
          </Link>
        </p>

        {/* Flashing word block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontFamily: 'var(--font-display)',
            marginTop: wordMarginTop,
            marginBottom: '1rem',
            width: '100%',
          }}
        >
          <p
            style={{
              margin: 0,
              paddingTop: wordPaddingTop,
              fontSize: 'clamp(22px, 7vw, 64px)',
              fontWeight: 400,
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          >
            <span
              style={{
                color: displayedColor,
                fontWeight: 600,
                opacity: wordOpacity,
                transition: `opacity ${FADE_MS}ms ease`,
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
              }}
            >
              {displayedWord}
            </span>
          </p>

          {/* Participate button */}
          <div
            style={{
              display: 'grid',
              gridTemplateRows: buttonVisible ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.4s ease-out',
              width: '100%',
            }}
          >
            <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
              <Link
                href={'https://forms.gle/bwcyvvjDVhTyV72V6'}
                style={{
                  display: 'inline-block',
                  marginTop: 15,
                  marginBottom: 10,
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  padding: '8px 24px',
                  border: '1px solid var(--accent)',
                  borderRadius: 4,
                  background: 'rgba(140, 108, 152, 0.15)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase' as const,
                  opacity: buttonVisible ? 1 : 0,
                  transform: buttonVisible ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                }}
              >
                Participate
              </Link>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" style={{ minHeight: statsMinHeight }} />

        {/* Stats / countdown */}
        {!festivalActive && daysUntil > 0 ? (
          <div className="card w-full sm:w-auto p-4 md:p-6 bg-opacity-80 backdrop-blur-sm shadow-lg mx-auto">
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

            <div className="hidden sm:flex items-center justify-center gap-4 md:gap-8 w-full">
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
          <div className="flex items-center justify-center gap-4 md:gap-10 w-full">
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>{totalGames}</p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Total games</p>
            </div>
            <div className="w-px h-8 md:h-14" style={{ background: 'var(--border)' }} />
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-4xl" style={{ color: liveCount > 0 ? 'var(--live-color)' : 'var(--text-primary)' }}>
                {liveCount}
              </p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Live now</p>
            </div>
            <div className="w-px h-8 md:h-14" style={{ background: 'var(--border)' }} />
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>{completedCount}</p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Completed</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}