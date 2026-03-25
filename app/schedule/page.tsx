'use client'

import React, { useState, useEffect } from 'react'

// ============================================================
// DATA
// ============================================================
// You can add a `brochureUrl` to specific events if they have unique PDFs.
// For now, it defaults to a fallback PDF url.
const FALLBACK_PDF_URL = '/HOSTEL_DAYS_SCHEDULE_DRAFT_1.pdf'

const DAYS = [
  
  {
    num: 1, label: 'Day 1', date: 'Sunday, 5 April', dateISO: '2026-04-05',
    venues: [
      { name: 'BD Court', events: [{ name: 'Badminton MM & FF League', icon: '🏸', time: '21:00', endTime: '23:00' }] }
    ]
  },
  {
    num: 2, label: 'Day 2', date: 'Monday, 6 April', dateISO: '2026-04-06',
    venues: [
      { name: 'BA Court', events: [{ name: 'Basketball League', icon: '🏀', time: '06:00', endTime: '08:00' }] },
      { name: 'Ground', events: [{ name: 'Football League', icon: '⚽', time: '17:00', endTime: '19:00' }] },
      { name: 'EB Point', events: [{ name: '7 Stones', icon: '🪨', time: '17:00', endTime: '18:00' }] },
      { name: 'Gyan Mandir', events: [{ name: 'Carrom League', icon: '🎯', time: '18:00', endTime: '20:00' }] },
      { name: 'BD Court', events: [{ name: 'Table Tennis M & F League', icon: '🏓', time: '18:00', endTime: '19:00' }] },
      { name: 'BA Court', events: [{ name: 'Basketball League', icon: '🏀', time: '21:00', endTime: '23:00' }] },
      { name: 'BD Court', events: [{ name: 'Badminton MM & FF League', icon: '🏸', time: '21:00', endTime: '23:00' }] },


    ]
  },
  {
    num: 3, label: 'Day 3', date: 'Tuesday, 7 April', dateISO: '2026-04-07',
    venues: [
      { name: 'BA Court', events: [{ name: 'Basketball League', icon: '🏀', time: '06:00', endTime: '08:00' }] },
      { name: 'Sports Room', events: [{ name: 'Javelin', icon: '🎯', time: '06:00', endTime: '08:00' }] },
      { name: 'Ground', events: [{ name: 'Football League & Final', icon: '⚽', time: '17:00', endTime: '19:00' }] },
      { name: 'Gyan Mandir', events: [{ name: 'Carrom', icon: '🎯', time: '17:00', endTime: '20:00' }] },
      { name: 'BD Court', events: [{ name: 'Table Tennis M & F League', icon: '🏓', time: '17:00', endTime: '20:00' }] },
      { name: 'BA Court', events: [{ name: 'Basketball League', icon: '🏀', time: '21:00', endTime: '23:00' }] },
      { name: 'BD Court', events: [{ name: 'Badminton MM & FF League', icon: '🏸', time: '21:00', endTime: '23:00' }] },

    ]
  },
  {
    num: 4, label: 'Day 4', date: 'Wednesday, 8 April', dateISO: '2026-04-08',
    venues: [
      { name: 'BA Court', events: [{ name: 'Basketball League', icon: '🏀', time: '07:00', endTime: '08:00' }] },
      { name: 'EB Point', events: [{ name: 'Tug of War', icon: '💪', time: '07:00', endTime: '08:00' }] },
      { name: 'BD Court', events: [{ name: 'Badminton MF League', icon: '🏸', time: '09:00', endTime: '11:00' }] },
      { name: 'V Court', events: [{ name: 'Volley League', icon: '🏐', time: '17:00', endTime: '20:00' }] },
      { name: 'Gyan Mandir', events: [
        { name: 'Table Tennis M & F League & Final', icon: '🏓', time: '17:00', endTime: '20:00' },
        { name: "Kho Kho Men's", icon: '🏃', time: '17:00', endTime: '19:00' }
      ]}
    ]
  },
  {
    num: 5, label: 'Day 5', date: 'Thursday, 9 April', dateISO: '2026-04-09',
    venues: [
      { name: 'NIT Goa', events: [{ name: 'Track Events', icon: '🏃', time: '06:00', endTime: '08:00' }] },
      { name: 'V Court', events: [{ name: 'Volley League & Final', icon: '🏐', time: '17:00', endTime: '20:00' }] },
      { name: 'BA Court', events: [{ name: 'Basketball Finals / 1st & 2nd Year Girls', icon: '🏀', time: '21:00', endTime: '23:00' }] },
      { name: 'BD Court', events: [{ name: 'Badminton MM FF MF Final', icon: '🏸', time: '09:00', endTime: '11:00' }] },
      { name: 'Gyan Mandir', events: [{ name: "Kho Kho Women's", icon: '🏃', time: '17:00', endTime: '19:00' }] }
    ]
  },
  {
    num: 6, label: 'Day 6', date: 'Friday, 10 April', dateISO: '2026-04-10',
    venues: [
      { name: 'Ground', events: [{ name: 'Cricket League', icon: '🏏', time: '06:00', endTime: '19:00' }] },
      { name: 'Chapora Hall', events: [
        { name: 'Duet Singing', icon: '🎤', time: '17:00', endTime: '18:30' },
        { name: 'Fashion Show', icon: '👗', time: '18:30', endTime: '20:30' }
      ]},
      { name: 'NIT Goa', events: [{ name: 'Instrumental', icon: '🎸', time: '21:00', endTime: '23:00' }] }
    ]
  },
  {
    num: 7, label: 'Day 7', date: 'Saturday, 11 April', dateISO: '2026-04-11',
    venues: [
      { name: 'Ground', events: [{ name: 'Cricket League', icon: '🏏', time: '06:00', endTime: '13:00' }] },
      { name: 'EB Point', events: [{ name: 'Sketching', icon: '✏️', time: '09:00', endTime: '12:00' }] },
      { name: 'Gyan Mandir', events: [{ name: 'Chess', icon: '♟️', time: '08:00', endTime: '13:00' }] },
      { name: 'NIT Goa', events: [
        { name: 'Treasure Hunt', icon: '🗺️', time: '08:00', endTime: '13:00' },
        { name: 'Group + Solo + Duet Dance', icon: '💃', time: '19:00', endTime: '23:00' }
      ]}
    ]
  },
  {
    num: 8, label: 'Day 8', date: 'Sunday, 12 April', dateISO: '2026-04-12',
    venues: [
      { name: 'Ground', events: [{ name: 'Cricket Final', icon: '🏏', time: '06:00', endTime: '19:00' }] },
      { name: 'EB Point', events: [{ name: 'Painting', icon: '🎨', time: '09:00', endTime: '12:00' }] },
      { name: 'Gyan Mandir', events: [{ name: 'Graffiti', icon: '🖌️', time: '13:00', endTime: '16:00' }] },
      { name: 'BA Court', events: [{ name: 'Archery', icon: '🏹', time: '08:00', endTime: '11:00' }] },
      { name: 'NIT Goa', events: [
        { name: 'Award Distribution', icon: '🏆', time: '17:00', endTime: '19:00' },
        { name: 'DJ Night', icon: '🎧', time: '20:00', endTime: '22:00' }
      ]}
    ]
  }
]

// ============================================================
// HELPERS
// ============================================================
function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function getEventTargetDate(dateISO: string, timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const target = new Date(dateISO)
  target.setHours(h, m, 0, 0)
  return target
}

// ============================================================
// COMPONENTS
// ============================================================
function CountdownDisplay({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false })

  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0, expired: true })
        return
      }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false
      })
    }
    
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (timeLeft.expired) {
    return <div className="text-center text-[13px] text-[var(--live-color)] font-semibold">Event is happening now!</div>
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex justify-center items-center gap-2.5">
      <div className="text-center">
        <div className="font-display font-extrabold text-4xl text-[var(--text-primary)] leading-none tabular-nums">{pad(timeLeft.d)}</div>
        <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)] mt-1.5 font-medium">days</div>
      </div>
      <span className="font-display font-bold text-xl text-[var(--border-strong)] pb-4 opacity-70">:</span>
      
      <div className="text-center">
        <div className="font-display font-extrabold text-4xl text-[var(--text-primary)] leading-none tabular-nums">{pad(timeLeft.h)}</div>
        <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)] mt-1.5 font-medium">hrs</div>
      </div>
      <span className="font-display font-bold text-xl text-[var(--border-strong)] pb-4 opacity-70">:</span>
      
      <div className="text-center">
        <div className="font-display font-extrabold text-4xl text-[var(--text-primary)] leading-none tabular-nums">{pad(timeLeft.m)}</div>
        <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)] mt-1.5 font-medium">min</div>
      </div>
      <span className="font-display font-bold text-xl text-[var(--border-strong)] pb-4 opacity-70">:</span>
      
      <div className="text-center">
        <div className="font-display font-extrabold text-4xl text-[var(--text-primary)] leading-none tabular-nums">{pad(timeLeft.s)}</div>
        <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)] mt-1.5 font-medium">sec</div>
      </div>
    </div>
  )
}

export default function SchedulePage() {
  const [activeDayIdx, setActiveDayIdx] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isPdfOpen, setIsPdfOpen] = useState(false)

  const activeDay = DAYS[activeDayIdx]
  const totalEvents = activeDay.venues.reduce((acc, v) => acc + v.events.length, 0)

  // Handle escape key to close modals sequentially
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPdfOpen) setIsPdfOpen(false)
        else if (selectedEvent) setSelectedEvent(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isPdfOpen, selectedEvent])

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (selectedEvent || isPdfOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [selectedEvent, isPdfOpen])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-body text-[var(--text-primary)] transition-colors duration-300">
      <div className="max-w-[720px] mx-auto px-4 py-5 pb-16">
        
        {/* ── Header ── */}
        <h1 className="font-display font-extrabold text-[26px] tracking-tight leading-tight mb-0.5">
          Schedule
        </h1>
        <p className="text-xs text-[var(--text-muted)] mb-5">
          Hostel Days 2026 — 7 days · All events
        </p>

        {/* ── Day Tabs ── */}
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {DAYS.map((day, idx) => {
            const isActive = idx === activeDayIdx;
            return (
              <button
                key={day.num}
                onClick={() => setActiveDayIdx(idx)}
                className={`shrink-0 px-4 py-1.5 rounded-full border font-display text-xs font-semibold transition-all whitespace-nowrap
                  ${isActive 
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm' 
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {day.label}
              </button>
            )
          })}
        </div>

        {/* ── Active Day Section ── */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] mb-3.5 transition-colors">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-[var(--accent)] text-white flex items-center justify-center font-display font-extrabold text-sm shrink-0 shadow-sm">
              {activeDay.num}
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[var(--text-primary)]">{activeDay.label}</div>
              <div className="text-[11px] text-[var(--text-muted)]">{activeDay.date}</div>
            </div>
            <div className="ml-auto text-[11px] text-[var(--text-muted)] font-medium">
              {totalEvents} event{totalEvents !== 1 && 's'}
            </div>
          </div>

          {/* Venues & Events */}
          {activeDay.venues.map((venue, vIdx) => (
            <div key={vIdx} className="mb-4.5">
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-1.5 pl-0.5">
                📍 {venue.name}
              </div>
              
              {venue.events.map((ev, eIdx) => (
                <div
                  key={eIdx}
                  onClick={() => setSelectedEvent({ ev, day: activeDay, venue })}
                  className="group flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] mb-1.5 cursor-pointer hover:border-[var(--border-strong)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-[1px] transition-all overflow-hidden animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${eIdx * 40}ms`, animationFillMode: 'both' }}
                >
                  <div className="w-[34px] h-[34px] rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-base shrink-0 transition-colors">
                    {ev.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-[13px] text-[var(--text-primary)] truncate transition-colors">
                      {ev.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-[1px] transition-colors">
                      {venue.name} · {formatTime(ev.time)}
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-sm shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">›</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── EVENT MODAL ── */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/55 dark:bg-black/80 backdrop-blur-[6px] z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedEvent(null) }}
        >
          <div className="w-full max-w-[440px] rounded-[24px] bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 shadow-xl">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-[var(--border)]">
              <div>
                <div className="font-display font-bold text-[18px] text-[var(--text-primary)]">
                  {selectedEvent.ev.name}
                </div>
                <div className="text-[13px] text-[var(--text-muted)] mt-1">
                  {selectedEvent.day.label} · {selectedEvent.venue.name} · {formatTime(selectedEvent.ev.time)}
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-base text-[var(--text-muted)] hover:bg-[var(--border)] transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Countdown Box */}
            <div className="border-b border-[var(--border)] px-6 py-6">
              <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-[var(--text-muted)] text-center mb-4">
                Starts in
              </div>
              <CountdownDisplay 
                targetDate={getEventTargetDate(selectedEvent.day.dateISO, selectedEvent.ev.time)} 
              />
            </div>

            {/* Event Brochure Button */}
            <div className="p-5 px-6 pb-6">
              <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-[var(--text-muted)] mb-3">
                Event Details
              </div>
              <div 
                onClick={() => setIsPdfOpen(true)}
                className="flex items-center gap-4 p-3.5 px-4 rounded-[12px] bg-[var(--bg-secondary)] border border-[var(--border)] cursor-pointer hover:border-[var(--border-strong)] transition-colors"
              >
                {/* Accent Icon Box */}
                <div className="w-[42px] h-[42px] rounded-[10px] bg-[var(--accent)] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-display font-semibold text-[14px] text-[var(--text-primary)]">
                    Event Brochure
                  </div>
                  <div className="text-[12px] text-[var(--text-muted)] mt-0.5">
                    Tap to view guidelines & rules
                  </div>
                </div>
                <span className="text-[var(--text-muted)] text-sm opacity-50">›</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── PDF VIEWER OVERLAY ── */}
      {isPdfOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-5 animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setIsPdfOpen(false) }}
        >
          <div className="w-full max-w-[700px] h-[85vh] rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] flex flex-col animate-in zoom-in-95 duration-200 shadow-2xl">
            
            {/* PDF Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-[13px] text-[var(--text-primary)]">
                  {selectedEvent?.ev.name || 'Event'} — Brochure
                </span>
              </div>
              <button 
                onClick={() => setIsPdfOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border-strong)] flex items-center justify-center text-base text-[var(--text-muted)] hover:border-[var(--text-muted)] transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Iframe for PDF display */}
            <iframe
              className="flex-1 w-full border-none bg-white min-h-0"
              src={selectedEvent?.ev.brochureUrl || FALLBACK_PDF_URL}
              title={`${selectedEvent?.ev.name || 'Event'} Brochure`}
            />
            
          </div>
        </div>
      )}
    </div>
  )
}