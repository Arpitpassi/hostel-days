import { createClient } from '@/lib/supabase/server'
import { timeAgo } from '@/lib/utils'
import { Megaphone, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import { Announcement } from '@/types'

export const metadata: Metadata = { title: 'Info & Rules' }
export const revalidate = 60

export default async function InfoPage() {
  const supabase = await createClient()
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  const ann = (announcements as unknown as Announcement[]) || []

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

      {/* About */}
      <section>
        <h2 className="section-header font-display font-bold text-sm uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
          About
        </h2>
        <div className="card px-4 py-4 space-y-3">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Hostel Days 2026 marks a landmark celebration at the National Institute of Technology Goa, uniting students across hostels in a vibrant display of talent, teamwork, and competitive spirit.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            From adrenaline-filled sports to electrifying cultural showcases, the event is designed to foster unity, creativity, and sportsmanship. It&apos;s not just an event—it&apos;s an experience that builds memories, friendships, and legacy.
          </p>
        </div>
      </section>

      {/* Venue */}
      <section>
        <h2 className="section-header font-display font-bold text-sm uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
          Venues
        </h2>
        <div className="card divide-y divide-[var(--border)]">
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

      {/* Contact */}
      <section>
        <h2 className="section-header font-display font-bold text-sm uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
          Contact
        </h2>
        <div className="card divide-y divide-[var(--border)]">
          {[
           { role: 'Event Manager',          name: 'Atharva Kant Yogi', phone: '+917666274691'   },
           { role: 'Event Manager',          name: 'Lav Kumar',         phone: '+917564031103'   },
          ].map(c => (
            <div key={c.name} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.role}</p>
              </div>
              <a
                href={`tel:${c.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                style={{ background: 'var(--bg-secondary)', color: '#ffffff' }}
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