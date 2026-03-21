'use client'

import { useEffect, useRef, useState } from 'react'
import { Game } from '@/types'
import { cn, formatGameTime, getCategoryIcon } from '@/lib/utils'
import { Clock, Trophy } from 'lucide-react'

interface Props {
  game: Game & { categories?: { name: string; type: string } }
}

export function LiveScoreCard({ game }: Props) {
  const [scoreA, setScoreA] = useState(game.score_a)
  const [scoreB, setScoreB] = useState(game.score_b)
  const [flashA, setFlashA] = useState(false)
  const [flashB, setFlashB] = useState(false)
  const [popA, setPopA] = useState(false)
  const [popB, setPopB] = useState(false)
  const prevA = useRef(game.score_a)
  const prevB = useRef(game.score_b)

  useEffect(() => {
    if (game.score_a !== prevA.current) {
      setScoreA(game.score_a)
      setFlashA(true)
      setPopA(true)
      prevA.current = game.score_a
      setTimeout(() => { setFlashA(false); setPopA(false) }, 1400)
    }
    if (game.score_b !== prevB.current) {
      setScoreB(game.score_b)
      setFlashB(true)
      setPopB(true)
      prevB.current = game.score_b
      setTimeout(() => { setFlashB(false); setPopB(false) }, 1400)
    }
  }, [game.score_a, game.score_b])

  const isLive = game.status === 'live'
  const isCompleted = game.status === 'completed'
  const icon = game.categories ? getCategoryIcon(game.categories.name) : '🏆'
  const categoryLabel = game.categories?.name || ''

  const winnerIsA = isCompleted && game.winner === game.team_a
  const winnerIsB = isCompleted && game.winner === game.team_b

  return (
    <div
      className={cn(
        'card relative overflow-hidden transition-all duration-200',
        isLive && 'glow-pulse border-[var(--live-color)]/30',
        isCompleted && 'opacity-80'
      )}
    >
      {/* Live top bar */}
      {isLive && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, var(--live-color), transparent)' }}
        />
      )}

      <div className="p-3 sm:p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {categoryLabel}
              </p>
              <p
                className="text-sm font-semibold leading-tight"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                {game.event_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isLive && (
              <span className="live-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
                Live
              </span>
            )}
            {isCompleted && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}
              >
                Final
              </span>
            )}
            {game.status === 'upcoming' && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                <Clock size={11} />
                {formatGameTime(game.start_time)}
              </span>
            )}
          </div>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Team A */}
          <div
            className={cn(
              'flex flex-col items-center p-2.5 rounded-lg transition-all duration-300',
              flashA && 'score-flash',
              winnerIsA && 'ring-1 ring-yellow-400/60'
            )}
            style={{ background: 'var(--bg-secondary)' }}
          >
            {winnerIsA && <Trophy size={11} className="text-yellow-400 mb-1" />}
            <p
              className={cn(
                'text-xl sm:text-2xl font-display font-bold tabular-nums transition-all',
                popA && 'score-pop',
                isLive && scoreA > scoreB && 'text-[var(--live-color)]'
              )}
              style={{ color: popA ? 'var(--live-color)' : 'var(--text-primary)' }}
            >
              {scoreA}
            </p>
            <p
              className="text-xs font-medium mt-0.5 text-center leading-tight line-clamp-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {game.team_a}
            </p>
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center">
            <span
              className="text-xs font-bold tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              VS
            </span>
          </div>

          {/* Team B */}
          <div
            className={cn(
              'flex flex-col items-center p-2.5 rounded-lg transition-all duration-300',
              flashB && 'score-flash',
              winnerIsB && 'ring-1 ring-yellow-400/60'
            )}
            style={{ background: 'var(--bg-secondary)' }}
          >
            {winnerIsB && <Trophy size={11} className="text-yellow-400 mb-1" />}
            <p
              className={cn(
                'text-xl sm:text-2xl font-display font-bold tabular-nums transition-all',
                popB && 'score-pop',
                isLive && scoreB > scoreA && 'text-[var(--live-color)]'
              )}
              style={{ color: popB ? 'var(--live-color)' : 'var(--text-primary)' }}
            >
              {scoreB}
            </p>
            <p
              className="text-xs font-medium mt-0.5 text-center leading-tight line-clamp-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {game.team_b}
            </p>
          </div>
        </div>

        {/* Winner line */}
        {isCompleted && game.winner && (
          <p
            className="mt-2.5 text-center text-xs font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            🏆 <span style={{ color: 'var(--text-primary)' }}>{game.winner}</span> wins!
          </p>
        )}
      </div>
    </div>
  )
}
