import { createClient } from '@/lib/supabase/server'
import { HomeHero } from '@/components/HomeHero'
import Link from 'next/link'
import { Zap, Calendar, Trophy, Info } from 'lucide-react'
import { Game } from '@/types'

export const revalidate = 0

function HomeFooter() {
  return (
    <footer
      className="mt-8 border-t"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
    >
      <div className="max-w-2xl md:max-w-4xl mx-auto px-4 sm:px-6 py-8">

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
          <div>
            <p className="font-display font-extrabold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
              Hostel Days 2026
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              NIT Goa's biggest inter-hostel festival.
              <br />5 days · 25+ events · one champion.
            </p>
          </div>

          <div className="flex gap-10 sm:gap-14">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                Navigate
              </p>
              {[
                { href: '/',            label: 'Home' },
                { href: '/live-scores', label: 'Live Scores' },
                { href: '/schedule',    label: 'Schedule' },
                { href: '/results',     label: 'Results' },
                { href: '/info',        label: 'Info & Rules' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm transition-colors hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                Contact
              </p>
              {[
                { label: 'Sports Coordinator',   value: '+91 98765 43210' },
                { label: 'Cultural Coordinator', value: '+91 87654 32109' },
                { label: 'General Enquiries',    value: 'hosteldaysnitg@gmail.com' },
              ].map(c => (
                <div key={c.label} className="mb-1">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.label}</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{c.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px w-full mb-5" style={{ background: 'var(--border)' }} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 Hostel Days, NIT Goa. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Live updates powered by Supabase Realtime
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: games } = await supabase
    .from('games')
    .select('*, categories(name, type)')
    .order('day', { ascending: true })
    .order('start_time', { ascending: true })

  const allGames       = (games as unknown as Game[]) || []
  const liveGames      = allGames.filter(g => g.status === 'live')
  const completedGames = allGames.filter(g => g.status === 'completed')

  return (
    <div>
      {/* Hero */}
      <HomeHero
        liveCount={liveGames.length}
        totalGames={allGames.length}
        completedCount={completedGames.length}
      />

      {/* Quick Nav Cards */}
      <section className="px-4 sm:px-6 py-6 max-w-2xl md:max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Link
            href="/live-scores"
            className="card p-4 md:p-6 flex flex-col gap-2 md:gap-4 hover:border-[var(--accent)] transition-all active:scale-95 group"
          >
            <div
              className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
            >
              <Zap size={18} className="md:hidden" style={{ color: 'var(--accent)' }} />
              <Zap size={24} className="hidden md:block" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="font-display font-bold text-sm md:text-lg" style={{ color: 'var(--text-primary)' }}>
                Live Events
              </p>
              {liveGames.length > 0 ? (
                <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--live-color)' }}>
                  {liveGames.length} match{liveGames.length !== 1 ? 'es' : ''} live now
                </p>
              ) : (
                <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  All scores & updates
                </p>
              )}
            </div>
          </Link>

          <Link
            href="/schedule"
            className="card p-4 md:p-6 flex flex-col gap-2 md:gap-4 hover:border-[var(--accent)] transition-all active:scale-95 group"
          >
            <div
              className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <Calendar size={18} className="md:hidden" style={{ color: 'var(--text-secondary)' }} />
              <Calendar size={24} className="hidden md:block" style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <p className="font-display font-bold text-sm md:text-lg" style={{ color: 'var(--text-primary)' }}>
                Schedule
              </p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Full timetable
              </p>
            </div>
          </Link>

          <Link
            href="/results"
            className="card p-4 md:p-6 flex flex-col gap-2 md:gap-4 hover:border-[var(--accent)] transition-all active:scale-95 group"
          >
            <div
              className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <Trophy size={18} className="md:hidden" style={{ color: 'var(--text-secondary)' }} />
              <Trophy size={24} className="hidden md:block" style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <p className="font-display font-bold text-sm md:text-lg" style={{ color: 'var(--text-primary)' }}>
                Results
              </p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {completedGames.length} completed
              </p>
            </div>
          </Link>

          <Link
            href="/info"
            className="card p-4 md:p-6 flex flex-col gap-2 md:gap-4 hover:border-[var(--accent)] transition-all active:scale-95 group"
          >
            <div
              className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <Info size={18} className="md:hidden" style={{ color: 'var(--text-secondary)' }} />
              <Info size={24} className="hidden md:block" style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <p className="font-display font-bold text-sm md:text-lg" style={{ color: 'var(--text-primary)' }}>
                Info
              </p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Rules & contacts
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer — desktop only */}
      <div className="hidden md:block">
        <HomeFooter />
      </div>
    </div>
  )
}