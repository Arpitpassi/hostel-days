'use client'

import { Game } from '@/types'
import { getCategoryIcon } from '@/lib/utils'

interface Props {
  games: Game[]
}

export function LiveTicker({ games }: Props) {
  const liveGames = games.filter(g => g.status === 'live')

  if (liveGames.length === 0) return null

  // Duplicate for seamless loop
  const items = [...liveGames, ...liveGames]

  return (
    <div
      className="overflow-hidden relative"
      style={{
        background: 'var(--accent)',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      {/* Gradient fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, var(--accent), transparent)',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(270deg, var(--accent), transparent)',
        }}
      />

      <div className="flex items-center gap-0 py-2">
        <span className="shrink-0 px-3 text-xs font-bold uppercase tracking-widest text-white/80 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white live-dot inline-block" />
          Live
        </span>

        <div className="flex-1 overflow-hidden">
          <div
            className="ticker-animate flex gap-8 whitespace-nowrap"
            style={{ width: 'max-content' }}
          >
            {items.map((game, i) => (
              <span
                key={`${game.id}-${i}`}
                className="inline-flex items-center gap-2 text-sm text-white font-medium"
              >
                {/* Category icon handled inline since no prop from categories */}
                <span>{game.event_name}</span>
                <span className="opacity-70">·</span>
                <span className="font-bold tabular-nums">{game.team_a} {game.score_a}</span>
                <span className="opacity-50 text-xs">vs</span>
                <span className="font-bold tabular-nums">{game.score_b} {game.team_b}</span>
                <span className="opacity-40 ml-2">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
