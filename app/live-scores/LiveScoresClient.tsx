'use client'

import { useState, useEffect, useRef } from 'react'
import { Game, Category } from '@/types'
import { useRealtimeGames } from '@/hooks/useRealtimeGames'
import { useConfetti } from '@/hooks/useConfetti'
import { LiveScoreCard } from '@/components/LiveScoreCard'
import { DAY_THEMES } from '@/lib/utils'
import { Zap, Clock, CheckCircle2 } from 'lucide-react'

interface Props {
  initialGames: Game[]
  categories: Category[]
}

type FilterStatus = 'all' | 'live' | 'upcoming' | 'completed'
type FilterDay = 'all' | 1 | 2 | 3 | 4 | 5

export function LiveScoresClient({ initialGames, categories }: Props) {
  const { games, updatedId } = useRealtimeGames(initialGames)
  const { fire: fireConfetti } = useConfetti()
  const prevGamesRef = useRef<Game[]>(initialGames)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [dayFilter, setDayFilter] = useState<FilterDay>('all')
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'live' | 'error'>('connecting')

  useEffect(() => {
    const prev = prevGamesRef.current
    games.forEach(game => {
      const prevGame = prev.find(g => g.id === game.id)
      if (prevGame && prevGame.status !== 'completed' && game.status === 'completed') {
        fireConfetti()
      }
    })
    prevGamesRef.current = games
  }, [games, fireConfetti])

  useEffect(() => {
    const t = setTimeout(() => setConnectionStatus('live'), 1200)
    return () => clearTimeout(t)
  }, [])

  const filtered = games.filter(g => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false
    if (dayFilter !== 'all' && g.day !== dayFilter) return false
    return true
  })

  const days = dayFilter === 'all' ? [1, 2, 3, 4, 5] : [dayFilter]

  const liveCount      = games.filter(g => g.status === 'live').length
  const upcomingCount  = games.filter(g => g.status === 'upcoming').length
  const completedCount = games.filter(g => g.status === 'completed').length

  return (
    <div className="px-4 sm:px-6 py-4 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
            Live Scores
          </h1>
          <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${connectionStatus === 'live' ? 'bg-[var(--live-color)] live-dot' : 'bg-yellow-400'}`}
            />
            {connectionStatus === 'live' ? 'Real-time connected' : 'Connecting…'}
          </p>
        </div>
        {liveCount > 0 && (
          <span className="live-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
            {liveCount} Live
          </span>
        )}
      </div>

      {/* Status filter pills — no count badge, icon only on active, fits in one row */}
      <div className="flex gap-1.5 mb-3">
        {([
          { key: 'all',       label: 'All',      count: games.length,   icon: null },
          { key: 'live',      label: 'Live',     count: liveCount,      icon: <Zap size={10} /> },
          { key: 'upcoming',  label: 'Upcoming', count: upcomingCount,  icon: <Clock size={10} /> },
          { key: 'completed', label: 'Done',     count: completedCount, icon: <CheckCircle2 size={10} /> },
        ] as const).map(f => {
          const active = statusFilter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key as FilterStatus)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                active
                  ? 'bg-[var(--accent)] text-white border-transparent'
                  : 'border-[var(--border)] text-[var(--text-muted)]'
              }`}
            >
              {active && f.icon}
              {f.label}
              {active && f.count > 0 && (
                <span className="text-[9px] font-bold opacity-80">{f.count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Day filter — compact, fits all 6 buttons */}
      <div className="flex gap-1 mb-5">
        {(['all', 1, 2, 3, 4, 5] as const).map(d => (
          <button
            key={d}
            onClick={() => setDayFilter(d as FilterDay)}
            className={`flex-1 py-1 rounded-lg text-[11px] font-medium border transition-all ${
              dayFilter === d
                ? 'bg-[var(--bg-secondary)] border-[var(--border-strong)] text-[var(--text-primary)]'
                : 'border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            {d === 'all' ? 'All' : `D${d}`}
          </button>
        ))}
      </div>

      {/* Games grouped by day */}
      {days.map(day => {
        const dayGames = filtered.filter(g => g.day === day)
        if (dayGames.length === 0) return null

        const sports   = dayGames.filter(g => (g as any).categories?.type === 'sports')
        const cultural = dayGames.filter(g => (g as any).categories?.type === 'cultural')
        const theme    = DAY_THEMES[day]

        return (
          <div key={day} className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Day {day}
              </h2>
              {theme && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  · {theme.label}
                </span>
              )}
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            {sports.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  ⚽ Sports
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sports.map(game => (
                    <div key={game.id} className={`fade-slide-up ${updatedId === game.id ? 'score-flash' : ''}`}>
                      <LiveScoreCard game={game as any} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cultural.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  🎭 Cultural
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cultural.map(game => (
                    <div key={game.id} className={`fade-slide-up ${updatedId === game.id ? 'score-flash' : ''}`}>
                      <LiveScoreCard game={game as any} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {filtered.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-3xl mb-2">🏆</p>
          <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>No games found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different filter</p>
        </div>
      )}
    </div>
  )
}