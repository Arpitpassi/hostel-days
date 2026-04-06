'use client'

import { Game, Category } from '@/types'
import { useRealtimeGames } from '@/hooks/useRealtimeGames'
import { getCategoryIcon, normalizeVenue } from '@/lib/utils'

interface Props { initialGames: Game[]; categories: Category[] }

type LiveGroup = { categoryName: string; type: string; icon: string; games: Game[] }

function groupLiveByCategory(liveGames: Game[]): LiveGroup[] {
  const map: Record<string, LiveGroup> = {}
  liveGames.forEach(g => {
    const name = g.categories?.name ?? 'Other'
    const type = g.categories?.type ?? 'sports'
    if (!map[name]) map[name] = { categoryName: name, type, icon: getCategoryIcon(name), games: [] }
    map[name].games.push(g)
  })
  return Object.values(map)
}

function LiveCategoryCard({ group }: { group: LiveGroup }) {
  const game = group.games[0]
  const isCultural = group.type === 'cultural'

  return (
    <div
      className="card px-4 py-3.5 flex items-center gap-3"
      style={{ borderColor: 'rgba(34,197,94,0.35)', boxShadow: '0 0 0 1px rgba(34,197,94,0.08)' }}
    >
      <span className="text-xl shrink-0">{group.icon}</span>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
          {group.categoryName}
        </p>
        {!isCultural && group.games.length > 1 ? (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {group.games.length} matches in progress
          </p>
        ) : !isCultural && game.team_a !== '-' && game.team_a ? (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {game.team_a} <span style={{ color: 'var(--text-muted)' }}>vs</span> {game.team_b}
          </p>
        ) : (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {group.games.length} event{group.games.length > 1 ? 's' : ''} in progress
          </p>
        )}
        {game.venue && (
  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>📍 {normalizeVenue(game.venue, group.categoryName)}
</p>
        )}
      </div>

      <span className="live-badge shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
        Live
      </span>
    </div>
  )
}

export function LiveScoresClient({ initialGames }: Props) {
  const { games } = useRealtimeGames(initialGames)
  const liveGames  = games.filter(g => g.status === 'live')
  const liveGroups = groupLiveByCategory(liveGames)

  return (
    <div className="px-4 sm:px-6 py-4 max-w-2xl mx-auto space-y-8">
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
              Live Now
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Events currently in progress</p>
          </div>
          {liveGames.length > 0 && (
            <span className="live-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
              {liveGames.length} Live
            </span>
          )}
        </div>

        {liveGroups.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-2xl mb-2">⏳</p>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>No events live right now</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Check the schedule or come back soon</p>
          </div>
        ) : (
          <div className="space-y-2">
            {liveGroups.map(group => (
              <LiveCategoryCard key={group.categoryName} group={group} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}