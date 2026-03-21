'use client'

import { useState, useEffect, useRef } from 'react'
import { Game, Category } from '@/types'
import { useRealtimeGames } from '@/hooks/useRealtimeGames'
import { useConfetti } from '@/hooks/useConfetti'
import { LiveScoreCard } from '@/components/LiveScoreCard'
import { DAY_THEMES, getCategoryIcon } from '@/lib/utils'
import { Zap, Clock, CheckCircle2, Filter } from 'lucide-react'

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

  // Fire confetti when a game completes
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

  // Simulate connection status
  useEffect(() => {
    const t = setTimeout(() => setConnectionStatus('live'), 1200)
    return () => clearTimeout(t)
  }, [])

  const filtered = games.filter(g => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false
    if (dayFilter !== 'all' && g.day !== dayFilter) return false
    return true
  })

  // Group by day then by sports/cultural
  const days = dayFilter === 'all' ? [1, 2, 3, 4, 5] : [dayFilter]

  const liveCount = games.filter(g => g.status === 'live').length
  const upcomingCount = games.filter(g => g.status === 'upcoming').length
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
          <span className="live-badge text-sm px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--live-color)] live-dot" />
            {liveCount} Live
          </span>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {([
          { key: 'all', label: 'All', count: games.length, icon: null },
          { key: 'live', label: 'Live', count: liveCount, icon: <Zap size={11} /> },
          { key: 'upcoming', label: 'Upcoming', count: upcomingCount, icon: <Clock size={11} /> },
          { key: 'completed', label: 'Done', count: completedCount, icon: <CheckCircle2 size={11} /> },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key as FilterStatus)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              statusFilter === f.key
                ? 'bg-[var(--accent)] text-white border-transparent'
                : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]'
            }`}
          >
            {f.icon}
            {f.label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                statusFilter === f.key ? 'bg-white/20 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Day filter */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        <button
          onClick={() => setDayFilter('all')}
          className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
            dayFilter === 'all'
              ? 'bg-[var(--bg-secondary)] border-[var(--border-strong)] text-[var(--text-primary)]'
              : 'border-[var(--border)] text-[var(--text-muted)]'
          }`}
        >
          All Days
        </button>
        {[1, 2, 3, 4, 5].map(d => (
          <button
            key={d}
            onClick={() => setDayFilter(d as FilterDay)}
            className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              dayFilter === d
                ? 'bg-[var(--bg-secondary)] border-[var(--border-strong)] text-[var(--text-primary)]'
                : 'border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            Day {d}
          </button>
        ))}
      </div>

      {/* Games grouped by day */}
      {days.map(day => {
        const dayGames = filtered.filter(g => g.day === day)
        if (dayGames.length === 0) return null

        const sports = dayGames.filter(g => (g as any).categories?.type === 'sports')
        const cultural = dayGames.filter(g => (g as any).categories?.type === 'cultural')
        const theme = DAY_THEMES[day]

        return (
          <div key={day} className="mb-7">
            {/* Day header */}
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

            {/* Sports section */}
            {sports.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  ⚽ Sports
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sports.map(game => (
                    <div
                      key={game.id}
                      className={`fade-slide-up ${updatedId === game.id ? 'score-flash' : ''}`}
                    >
                      <LiveScoreCard game={game as any} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cultural section */}
            {cultural.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  🎭 Cultural
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cultural.map(game => (
                    <div
                      key={game.id}
                      className={`fade-slide-up ${updatedId === game.id ? 'score-flash' : ''}`}
                    >
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
        <div
          className="card p-10 text-center"
        >
          <p className="text-3xl mb-2">🏆</p>
          <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>No games found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different filter</p>
        </div>
      )}
    </div>
  )
}
