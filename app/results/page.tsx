import { createClient } from '@/lib/supabase/server'
import { getCategoryIcon, DAY_THEMES } from '@/lib/utils'
import { Trophy } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Results' }
export const revalidate = 30

export default async function ResultsPage() {
  const supabase = await createClient()
  const { data: games } = await supabase
    .from('games')
    .select('*, categories(id, name, type)')
    .eq('status', 'completed')
    .order('day')
    .order('start_time')

  const completed = games || []
  const days = [...new Set(completed.map(g => g.day))].sort()

  if (completed.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-10 max-w-2xl mx-auto text-center">
        <p className="text-5xl mb-4">🏆</p>
        <h1 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
          No results yet
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Results will appear here as matches are completed.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 py-4 max-w-2xl mx-auto">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>
        Results
      </h1>
      <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
        {completed.length} completed event{completed.length !== 1 ? 's' : ''}
      </p>

      {days.map(day => {
        const dayGames = completed.filter(g => g.day === day)
        const theme = DAY_THEMES[day]

        return (
          <section key={day} className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Day {day}
              </h2>
              {theme && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {theme.label}</span>}
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            <div className="space-y-2">
              {dayGames.map(game => {
                const icon = (game as any).categories ? getCategoryIcon((game as any).categories.name) : '🏆'
                const scoreA = game.score_a
                const scoreB = game.score_b
                const winnerIsA = game.winner === game.team_a
                const winnerIsB = game.winner === game.team_b

                return (
                  <div key={game.id} className="card px-4 py-3">
                    {/* Event label */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm">{icon}</span>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        {(game as any).categories?.name} · {game.event_name}
                      </p>
                      {game.winner && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold" style={{ color: '#f59e0b' }}>
                          <Trophy size={10} />
                          {game.winner}
                        </span>
                      )}
                    </div>

                    {/* Score row */}
                    <div className="flex items-center gap-3">
                      <div className={`flex-1 flex items-center gap-2 ${winnerIsA ? 'opacity-100' : 'opacity-60'}`}>
                        {winnerIsA && <Trophy size={13} className="text-yellow-400 shrink-0" />}
                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                          {game.team_a}
                        </p>
                        <span
                          className="ml-auto font-display font-bold text-xl tabular-nums"
                          style={{ color: winnerIsA ? 'var(--live-color)' : 'var(--text-secondary)' }}
                        >
                          {scoreA}
                        </span>
                      </div>

                      <span className="text-xs font-bold" style={{ color: 'var(--border-strong)' }}>:</span>

                      <div className={`flex-1 flex items-center gap-2 flex-row-reverse ${winnerIsB ? 'opacity-100' : 'opacity-60'}`}>
                        {winnerIsB && <Trophy size={13} className="text-yellow-400 shrink-0" />}
                        <p className="font-semibold text-sm truncate text-right" style={{ color: 'var(--text-primary)' }}>
                          {game.team_b}
                        </p>
                        <span
                          className="mr-auto font-display font-bold text-xl tabular-nums"
                          style={{ color: winnerIsB ? 'var(--live-color)' : 'var(--text-secondary)' }}
                        >
                          {scoreB}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
