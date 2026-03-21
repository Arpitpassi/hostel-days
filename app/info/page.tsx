import { createClient } from '@/lib/supabase/server'
import { timeAgo } from '@/lib/utils'
import { Megaphone, MapPin, Phone, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Info & Rules' }
export const revalidate = 60

export default async function InfoPage() {
  const supabase = await createClient()
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  const ann = announcements || []

  return (
    <div className="px-4 sm:px-6 py-4 max-w-2xl mx-auto space-y-6">
      <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
        Info
      </h1>

      {/* Announcements */}
      {ann.length > 0 && (
        <section>
          <h2 className="section-header font-display font-bold text-sm uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
            Announcements
          </h2>
          <div className="space-y-2">
            {ann.map(a => (
              <div key={a.id} className="card px-4 py-3">
                <div className="flex items-start gap-2">
                  <Megaphone size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                  <div>
                    {a.title && (
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {a.title}
                      </p>
                    )}
                    {a.body && (
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {a.body}
                      </p>
                    )}
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {timeAgo(a.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Venue */}
      <section>
        <h2 className="section-header font-display font-bold text-sm uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
          Venues
        </h2>
        <div className="card divide-y" style={{ divideColor: 'var(--border)' }}>
          {[
            { name: 'Main Ground', events: 'Cricket, Football, Athletics', icon: '🏟️' },
            { name: 'Sports Complex', events: 'Badminton, TT, Basketball', icon: '🏢' },
            { name: 'Hostel Lawn', events: 'Tug of War, Volleyball', icon: '🌿' },
            { name: 'Auditorium', events: 'Dance, Drama, Fashion, Singing', icon: '🎭' },
            { name: 'Common Room', events: 'Quiz, Debate, Art', icon: '🏛️' },
          ].map(v => (
            <div key={v.name} className="px-4 py-3 flex items-center gap-3">
              <span className="text-xl">{v.icon}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {v.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {v.events}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* General Rules */}
      <section>
        <h2 className="section-header font-display font-bold text-sm uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
          General Rules
        </h2>
        <div className="card px-4 py-3 space-y-2.5">
          {[
            'Each hostel can enter a maximum of 2 teams per event.',
            'Players must be currently enrolled students — ID card required.',
            'Report to the venue 15 minutes before your scheduled game.',
            'Disputes must be raised with the event coordinator immediately.',
            'Decision of the referee / judges is final.',
            'Unsportsmanlike behavior will result in immediate disqualification.',
            'Points: Win = 3 pts · Draw = 1 pt · Loss = 0 pts',
            'Tiebreakers decided by goal/point difference, then head-to-head.',
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
              >
                {i + 1}
              </span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {rule}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="section-header font-display font-bold text-sm uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
          Contact
        </h2>
        <div className="card divide-y" style={{ divideColor: 'var(--border)' }}>
          {[
            { role: 'Sports Coordinator', name: 'Arjun Mehta', phone: '+91 98765 43210' },
            { role: 'Cultural Coordinator', name: 'Priya Sharma', phone: '+91 87654 32109' },
            { role: 'Overall Convenor', name: 'Dr. Suresh Kumar', phone: '+91 76543 21098' },
          ].map(c => (
            <div key={c.name} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.role}</p>
              </div>
              <a
                href={`tel:${c.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}
              >
                <Phone size={11} />
                Call
              </a>
            </div>
          ))}
        </div>
      </section>

      <div className="h-4" />
    </div>
  )
}
