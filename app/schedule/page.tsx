import { createClient } from '@/lib/supabase/server'
import { DAY_THEMES, formatGameTime, getCategoryIcon } from '@/lib/utils'
import { Clock } from 'lucide-react'
import type { Metadata } from 'next'
import { Game, GameStatus } from '@/types'

export const metadata: Metadata = { title: 'Schedule' }
export const revalidate = 60

export default async function SchedulePage() {
  const supabase = await createClient()
  const { data: games } = await supabase
    .from('games')
    .select('*, categories(id, name, type)')
    .order('day')
    .order('start_time')

  const allGames = (games as unknown as Game[]) || []
  const days = [1, 2, 3, 4, 5]

  return (
    <div className="px-4 sm:px-6 py-4 max-w-2xl mx-auto">
      <h1
        className="font-display font-extrabold text-2xl mb-1"
        style={{ color: 'var(--text-primary)' }}
      >
        Schedule
      </h1>
      <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
        All events across 5 days — Hostel Days 2026
      </p>

      {days.map(day => {
        const dayGames = allGames.filter(g => g.day === day)
        if (dayGames.length === 0) return null
        const theme = DAY_THEMES[day]
        const sports = dayGames.filter(g => g.categories?.type === 'sports')
        const cultural = dayGames.filter(g => g.categories?.type === 'cultural')

        return (
          <section key={day} className="mb-8">
            {/* Day header */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-3"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
                style={{ background: 'var(--accent)' }}
              >
                {day}
              </div>
              <div>
                <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Day {day}
                </p>
                {theme && (
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {theme.label}
                  </p>
                )}
              </div>
              <div className="ml-auto text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {dayGames.length} events
              </div>
            </div>

            {/* Sports */}
            {sports.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-bold uppercase tracking-wider mb-1.5 px-1" style={{ color: 'var(--text-muted)' }}>
                  ⚽ Sports
                </p>
                <div className="space-y-1.5">
                  {sports.map(game => (
                    <ScheduleRow key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}

            {/* Cultural */}
            {cultural.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1.5 px-1" style={{ color: 'var(--text-muted)' }}>
                  🎭 Cultural
                </p>
                <div className="space-y-1.5">
                  {cultural.map(game => (
                    <ScheduleRow key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

function ScheduleRow({ game }: { game: Game }) {
  const icon = game.categories ? getCategoryIcon(game.categories.name) : '🏆'
  const statusColors: Record<GameStatus, { bg: string; text: string; dot: string }> = {
    upcoming:  { bg: 'var(--bg-secondary)',      text: 'var(--text-muted)',  dot: '#6b7280' },
    live:      { bg: 'rgba(34,197,94,0.1)',       text: 'var(--live-color)', dot: 'var(--live-color)' },
    completed: { bg: 'rgba(99,102,241,0.1)',      text: '#818cf8',           dot: '#818cf8' },
  }
  const s = statusColors[game.status]

  return (
    <div className="card px-3 py-2.5 flex items-center gap-3">
      <span className="text-lg shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
          {game.team_a} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs</span> {game.team_b}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
          {game.event_name} · {game.categories?.name}
        </p>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1">
        {game.start_time && (
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Clock size={10} />
            {formatGameTime(game.start_time)}
          </span>
        )}
        <span
          className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{ background: s.bg, color: s.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
          {game.status}
        </span>
      </div>
    </div>
  )
}