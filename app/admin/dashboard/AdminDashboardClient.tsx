'use client'

import { useState } from 'react'
import { Game, Category, Database } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  LogOut, Plus, Minus,
  Zap, Shield,
  Loader2, X,
} from 'lucide-react'

interface Props {
  games: Game[]
  categories: Category[]
  adminName: string
}

export function AdminDashboardClient({ games: initialGames, categories, adminName }: Props) {
  const [games, setGames] = useState(initialGames)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<number | null>(null)
  const [filterDay, setFilterDay] = useState<number | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
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

  // Cast the whole query builder to any to bypass broken type inference
  const { data, error } = await (supabase as any)
    .from('games')
    .update(dbUpdates)
    .eq('id', gameId)
    .select('*, categories(id, name, type)')
    .single()

  if (!error && data) {
    setGames(prev => prev.map(g => g.id === gameId ? { ...g, ...data } : g))
    setSelectedGame(prev => prev?.id === gameId ? { ...prev, ...data } : prev)
    setSavedId(gameId)
    setTimeout(() => setSavedId(null), 2000)
  }
  setSaving(false)
}

  const filtered = games.filter(g => {
    if (filterDay !== 'all' && g.day !== filterDay) return false
    if (filterStatus !== 'all' && g.status !== filterStatus) return false
    return true
  })

  const liveCount = games.filter(g => g.status === 'live').length
  const completedCount = games.filter(g => g.status === 'completed').length

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Admin TopBar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 h-14 border-b"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent)' }}
          >
            <Shield size={14} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Admin Dashboard
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {adminName}
            </p>
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
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      </header>

      <div className="px-4 sm:px-6 py-4 max-w-4xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={String(filterDay)}
            onChange={e => setFilterDay(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-xs px-3 py-1.5 rounded-lg border outline-none"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Days</option>
            {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>Day {d}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border outline-none"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>

          <span
            className="ml-auto text-xs flex items-center"
            style={{ color: 'var(--text-muted)' }}
          >
            {filtered.length} games
          </span>
        </div>

        {/* Games table */}
        <div className="card overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  {['Day', 'Event', 'Teams', 'Score', 'Status', ''].map(h => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((game, i) => {
                  const isLive = game.status === 'live'
                  const isDone = game.status === 'completed'

                  return (
                    <tr
                      key={game.id}
                      style={{
                        borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                        background: savedId === game.id ? 'rgba(34,197,94,0.06)' : 'transparent',
                      }}
                    >
                      <td className="px-3 py-2.5">
                        <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                          D{game.day}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-xs leading-tight" style={{ color: 'var(--text-primary)' }}>
                          {game.event_name}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {(game as any).categories?.name}
                        </p>
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {game.team_a} vs {game.team_b}
                        </p>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="font-display font-bold text-sm tabular-nums"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {game.score_a} – {game.score_b}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                            isLive
                              ? 'bg-[rgba(34,197,94,0.15)] text-[var(--live-color)]'
                              : isDone
                              ? 'bg-[rgba(99,102,241,0.15)] text-indigo-400'
                              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                          }`}
                        >
                          {isLive && <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-[var(--live-color)] mr-1" />}
                          {game.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          onClick={() => setSelectedGame(game)}
                          className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
                          style={{
                            background: 'var(--accent-glow)',
                            color: 'var(--accent)',
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedGame && (
        <GameEditModal
          game={selectedGame}
          categories={categories}
          saving={saving}
          onUpdate={updateGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  )
}

// ── Game Edit Modal ──────────────────────────────────────────────────────────

interface ModalProps {
  game: Game
  categories: Category[]
  saving: boolean
  onUpdate: (id: number, updates: Partial<Game>) => Promise<void>
  onClose: () => void
}

function GameEditModal({ game, categories, saving, onUpdate, onClose }: ModalProps) {
  const [scoreA, setScoreA] = useState(game.score_a)
  const [scoreB, setScoreB] = useState(game.score_b)
  const [status, setStatus] = useState(game.status)
  const [winner, setWinner] = useState(game.winner || '')
  const [startTime, setStartTime] = useState(
    game.start_time ? new Date(game.start_time).toISOString().slice(0, 16) : ''
  )

  const hasChanges =
    scoreA !== game.score_a ||
    scoreB !== game.score_b ||
    status !== game.status ||
    winner !== (game.winner || '') ||
    startTime !== (game.start_time ? new Date(game.start_time).toISOString().slice(0, 16) : '')

  const handleSave = async () => {
    await onUpdate(game.id, {
      score_a: scoreA,
      score_b: scoreB,
      status,
      winner: winner || null,
      start_time: startTime ? new Date(startTime).toISOString() : null,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <p className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              {game.event_name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Day {game.day} · {(game as any).categories?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Score controls */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
              Scores
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Team A */}
              <div
                className="rounded-xl p-3"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs font-medium mb-2 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {game.team_a}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setScoreA(s => Math.max(0, s - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-display font-bold text-2xl tabular-nums" style={{ color: 'var(--text-primary)' }}>
                    {scoreA}
                  </span>
                  <button
                    onClick={() => setScoreA(s => s + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Team B */}
              <div
                className="rounded-xl p-3"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs font-medium mb-2 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {game.team_b}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setScoreB(s => Math.max(0, s - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-display font-bold text-2xl tabular-nums" style={{ color: 'var(--text-primary)' }}>
                    {scoreB}
                  </span>
                  <button
                    onClick={() => setScoreB(s => s + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
              Status
            </p>
            <div className="flex gap-2">
              {(['upcoming', 'live', 'completed'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    status === s
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

          {/* Winner (if completed) */}
          {status === 'completed' && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
                Winner
              </p>
              <div className="flex gap-2">
                {[game.team_a, game.team_b, 'Draw'].map(t => (
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

          {/* Start time */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
              Start Time
            </p>
            <input
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            style={{ background: hasChanges ? 'var(--accent)' : 'var(--bg-secondary)' }}
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <>
                <Zap size={14} />
                Push Live
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}