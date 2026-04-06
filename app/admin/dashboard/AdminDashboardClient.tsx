'use client'

import { useState, useMemo } from 'react'
import { Game, Category, EventType, GameStatus } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  LogOut, Plus, Minus, Zap, Shield, Loader2, X,
  Trophy, Search, ChevronDown, CheckCircle2, Clock,
} from 'lucide-react'

// ── Constants ─────────────────────────────────────────────────────────────────
const HOSTELS = [
  'Ashoka Block', 'Kaveri Block', 'Narmada Hall', 'CVR Hostel',
  'LBS Hall', 'Batch Of 2026', 'Batch Of 2027', 'Batch Of 2028',
  'Batch Of 2029', 'M.Tech & PhD',
]

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  games: Game[]
  categories: Category[]
  adminName: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusColor(status: GameStatus) {
  if (status === 'live')      return { bg: 'rgba(34,197,94,0.15)',  text: 'var(--live-color)' }
  if (status === 'completed') return { bg: 'rgba(99,102,241,0.15)', text: '#818cf8' }
  return                             { bg: 'var(--bg-secondary)',    text: 'var(--text-muted)' }
}

// ── Hostel Selector ───────────────────────────────────────────────────────────
function HostelSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none text-sm px-3 py-2 rounded-xl border outline-none pr-8"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="">— Not set —</option>
          {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
      </div>
    </div>
  )
}

// ── Status Picker ─────────────────────────────────────────────────────────────
function StatusPicker({ value, onChange }: { value: GameStatus; onChange: (s: GameStatus) => void }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Status</p>
      <div className="flex gap-1.5">
        {(['upcoming', 'live', 'completed'] as const).map(s => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
              value === s
                ? s === 'live'
                  ? 'bg-[rgba(34,197,94,0.15)] border-[rgba(34,197,94,0.4)] text-[var(--live-color)]'
                  : s === 'completed'
                  ? 'bg-[rgba(99,102,241,0.15)] border-[rgba(99,102,241,0.4)] text-indigo-400'
                  : 'bg-[var(--accent-glow)] border-[var(--accent)] text-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            {s === 'live' && '● '}{s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Sports Inline Editor ──────────────────────────────────────────────────────
function SportsEditor({ game, saving, onUpdate, onClose }: {
  game: Game; saving: boolean
  onUpdate: (id: number, u: Partial<Game>) => Promise<void>; onClose: () => void
}) {
  const [teamA,  setTeamA]  = useState(game.team_a === '-' ? '' : game.team_a)
  const [teamB,  setTeamB]  = useState(game.team_b === '-' ? '' : game.team_b)
  const [scoreA, setScoreA] = useState(game.score_a)
  const [scoreB, setScoreB] = useState(game.score_b)
  const [status, setStatus] = useState<GameStatus>(game.status)
  const [winner, setWinner] = useState(game.winner || '')

  const hasChanges =
    teamA  !== (game.team_a === '-' ? '' : game.team_a) ||
    teamB  !== (game.team_b === '-' ? '' : game.team_b) ||
    scoreA !== game.score_a || scoreB !== game.score_b ||
    status !== game.status  || winner !== (game.winner || '')

  const tA = teamA || 'Team A'
  const tB = teamB || 'Team B'

  return (
    <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="pt-3 grid grid-cols-2 gap-3">
        <HostelSelect label="Team A" value={teamA} onChange={setTeamA} />
        <HostelSelect label="Team B" value={teamB} onChange={setTeamB} />
      </div>

      {/* Score controls */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: tA, score: scoreA, setScore: setScoreA },
          { label: tB, score: scoreB, setScore: setScoreB },
        ].map(({ label, score, setScore }) => (
          <div key={label} className="rounded-xl p-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <p className="text-[10px] font-medium mb-2 truncate" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setScore(s => Math.max(0, s - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              ><Minus size={14} /></button>
              <span className="font-display font-bold text-2xl tabular-nums" style={{ color: 'var(--text-primary)' }}>{score}</span>
              <button
                onClick={() => setScore(s => s + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ background: 'var(--accent)' }}
              ><Plus size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <StatusPicker value={status} onChange={setStatus} />

      {status === 'completed' && teamA && teamB && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Winner</p>
          <div className="flex gap-2">
            {[teamA, teamB, 'Draw'].map(t => (
              <button
                key={t}
                onClick={() => setWinner(t === 'Draw' ? '' : t)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all truncate ${
                  (t === 'Draw' && !winner) || winner === t
                    ? 'bg-[rgba(251,191,36,0.15)] border-yellow-400/50 text-yellow-400'
                    : 'border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                {t === 'Draw' ? '🤝 Draw' : `🏆 ${t}`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-xl text-sm font-medium border transition-all"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >Cancel</button>
        <button
          onClick={() => onUpdate(game.id, {
            team_a: teamA || '-', team_b: teamB || '-',
            score_a: scoreA, score_b: scoreB,
            status, winner: winner || null,
          })}
          disabled={saving || !hasChanges}
          className="flex-1 py-2 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          style={{ background: hasChanges ? 'var(--accent)' : 'var(--bg-secondary)' }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <><Zap size={13} /> Save</>}
        </button>
      </div>
    </div>
  )
}

// ── Cultural Inline Editor ────────────────────────────────────────────────────
function CulturalEditor({ game, saving, onUpdate, onClose }: {
  game: Game; saving: boolean
  onUpdate: (id: number, u: Partial<Game>) => Promise<void>; onClose: () => void
}) {
  const [pos1, setPos1] = useState(game.pos_1 || '')
  const [pos2, setPos2] = useState(game.pos_2 || '')
  const [pos3, setPos3] = useState(game.pos_3 || '')
  const [pos4, setPos4] = useState(game.pos_4 || '')
  const [status, setStatus] = useState<GameStatus>(game.status)

  const hasChanges =
    pos1 !== (game.pos_1 || '') || pos2 !== (game.pos_2 || '') ||
    pos3 !== (game.pos_3 || '') || pos4 !== (game.pos_4 || '') ||
    status !== game.status

  return (
    <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="pt-3 space-y-3">
        {([
          ['🥇 1st Place', pos1, setPos1],
          ['🥈 2nd Place', pos2, setPos2],
          ['🥉 3rd Place', pos3, setPos3],
          ['4th Place',    pos4, setPos4],
        ] as [string, string, (v: string) => void][]).map(([label, val, set]) => (
          <HostelSelect key={label} label={label} value={val} onChange={set} />
        ))}
      </div>
      <StatusPicker value={status} onChange={setStatus} />
      <div className="flex gap-2 pt-1">
        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-xl text-sm font-medium border transition-all"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >Cancel</button>
        <button
          onClick={() => onUpdate(game.id, {
            pos_1: pos1 || null, pos_2: pos2 || null,
            pos_3: pos3 || null, pos_4: pos4 || null,
            winner: pos1 || null, status,
          })}
          disabled={saving || !hasChanges}
          className="flex-1 py-2 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          style={{ background: hasChanges ? 'var(--accent)' : 'var(--bg-secondary)' }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <><Zap size={13} /> Save</>}
        </button>
      </div>
    </div>
  )
}

// ── Game Card (selectable) ────────────────────────────────────────────────────
function GameCard({ game, saving, savedId, onUpdate }: {
  game: Game; saving: boolean; savedId: number | null
  onUpdate: (id: number, u: Partial<Game>) => Promise<void>
}) {
  const [expanded, setExpanded] = useState(false)
  const sc = statusColor(game.status)
  const isCultural = game.event_type === 'cultural'
  const isSaved = savedId === game.id

  return (
    <div
      className="card overflow-hidden transition-all"
      style={{
        borderColor: expanded ? 'var(--accent)' : isSaved ? 'rgba(34,197,94,0.4)' : 'var(--border)',
      }}
    >
      {/* Clickable header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-secondary)]"
      >
        {/* Status dot */}
        <div className="mt-1 shrink-0">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
            style={{ background: sc.bg, color: sc.text }}
          >
            {game.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />}
            {game.status}
          </span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
            {game.event_name}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Day {game.day}
            {game.categories?.name ? ` · ${game.categories.name}` : ''}
            {game.venue ? ` · ${game.venue}` : ''}
          </p>
          {/* Quick preview */}
          {!isCultural && game.team_a !== '-' && game.team_a ? (
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              {game.team_a} <span className="font-display font-bold">{game.score_a}–{game.score_b}</span> {game.team_b}
            </p>
          ) : isCultural && game.pos_1 ? (
            <p className="text-[11px] mt-1" style={{ color: '#f59e0b' }}>🥇 {game.pos_1}</p>
          ) : null}
        </div>

        {/* Type badge + expand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
            isCultural ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
          }`}>
            {game.event_type}
          </span>
          <ChevronDown
            size={14}
            style={{ color: 'var(--text-muted)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </div>
      </button>

      {/* Inline editor */}
      {expanded && (
        isCultural
          ? <CulturalEditor game={game} saving={saving} onUpdate={onUpdate} onClose={() => setExpanded(false)} />
          : <SportsEditor   game={game} saving={saving} onUpdate={onUpdate} onClose={() => setExpanded(false)} />
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AdminDashboardClient({ games: initialGames, categories, adminName }: Props) {
  const [games, setGames]         = useState(initialGames)
  const [saving, setSaving]       = useState(false)
  const [savedId, setSavedId]     = useState<number | null>(null)
  const [filterDay, setFilterDay] = useState<number | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType]     = useState<string>('all')
  const [search, setSearch]       = useState('')
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const updateGame = async (gameId: number, updates: Partial<Game>) => {
    setSaving(true)
    const supabase = createClient()
    const { categories: _, ...dbUpdates } = updates as Partial<Game> & { categories?: unknown }

    const { data, error } = await (supabase as any)
      .from('games')
      .update(dbUpdates)
      .eq('id', gameId)
      .select('*, categories(id, name, type)')
      .single()

    if (!error && data) {
      setGames(prev => prev.map(g => g.id === gameId ? { ...g, ...data } : g))
      setSavedId(gameId)
      setTimeout(() => setSavedId(null), 2500)
    }
    setSaving(false)
  }

  const filtered = useMemo(() => games.filter(g => {
    if (filterDay    !== 'all' && g.day        !== filterDay)    return false
    if (filterStatus !== 'all' && g.status     !== filterStatus) return false
    if (filterType   !== 'all' && g.event_type !== filterType)   return false
    if (search && !g.event_name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [games, filterDay, filterStatus, filterType, search])

  const liveCount      = games.filter(g => g.status === 'live').length
  const completedCount = games.filter(g => g.status === 'completed').length

  // Group filtered games by day
  const days = [...new Set(filtered.map(g => g.day))].sort((a, b) => a - b)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Top Bar ── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 h-14 border-b"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Shield size={14} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Admin</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{adminName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {liveCount > 0 && (
              <span className="live-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
                {liveCount} live
              </span>
            )}
            <span>{completedCount} done</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </header>

      <div className="px-4 sm:px-6 py-4 max-w-3xl mx-auto">

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search event…"
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none w-36"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <select
            value={String(filterDay)}
            onChange={e => setFilterDay(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-xs px-3 py-1.5 rounded-lg border outline-none"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <option value="all">All Days</option>
            {[1,2,3,4,5,6,7,8].map(d => <option key={d} value={d}>Day {d}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border outline-none"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border outline-none"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <option value="all">All Types</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
          </select>

          <span className="ml-auto text-xs flex items-center" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Quick status filter chips ── */}
        <div className="flex gap-1.5 mb-5">
          {[
            { key: 'all',       label: 'All',       count: games.length },
            { key: 'upcoming',  label: 'Upcoming',  count: games.filter(g => g.status === 'upcoming').length, icon: <Clock size={10} /> },
            { key: 'live',      label: 'Live',      count: liveCount,      icon: <Zap size={10} /> },
            { key: 'completed', label: 'Completed', count: completedCount, icon: <CheckCircle2 size={10} /> },
          ].map(f => {
            const active = filterStatus === f.key
            return (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                  active
                    ? 'bg-[var(--accent)] text-white border-transparent'
                    : 'border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                {active && f.icon}
                {f.label}
                {f.count > 0 && (
                  <span className={`text-[9px] font-bold ${active ? 'opacity-80' : 'opacity-60'}`}>{f.count}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Games grouped by day ── */}
        {filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-2xl mb-2">🔍</p>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>No events match</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try a different filter</p>
          </div>
        ) : (
          <div className="space-y-6">
            {days.map(day => {
              const dayGames = filtered.filter(g => g.day === day)
              if (dayGames.length === 0) return null
              return (
                <div key={day}>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-display font-bold text-sm uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Day {day}
                    </h2>
                    <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{dayGames.length} events</span>
                  </div>
                  <div className="space-y-2">
                    {dayGames.map(game => (
                      <GameCard
                        key={game.id}
                        game={game}
                        saving={saving}
                        savedId={savedId}
                        onUpdate={updateGame}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="h-10" />
      </div>
    </div>
  )
}