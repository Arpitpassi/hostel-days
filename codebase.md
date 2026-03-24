<codebase>
<project_structure>
.
├── .gitignore
├── app
│   ├── BirdAnimation.tsx
│   ├── admin
│   │   ├── dashboard
│   │   │   ├── AdminDashboardClient.tsx
│   │   │   └── page.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── body.png
│   ├── globals.css
│   ├── info
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── left_wing.png
│   ├── live-scores
│   │   ├── LiveScoresClient.tsx
│   │   └── page.tsx
│   ├── merch
│   │   ├── merch.jpg
│   │   └── page.tsx
│   ├── page.tsx
│   ├── puuch.png
│   ├── results
│   │   └── page.tsx
│   ├── right_wing.png
│   └── schedule
│       ├── ScheduleCountdown.tsx
│       ├── banner.jpeg
│       └── page.tsx
├── components
│   ├── HomeHero.tsx
│   ├── LiveScoreCard.tsx
│   ├── LiveTicker.tsx
│   ├── NavBar.tsx
│   ├── QuickStats.tsx
│   ├── ThemeProvider.tsx
│   └── flashtext.tsx
├── hooks
│   ├── useConfetti.ts
│   └── useRealtimeGames.ts
├── lib
│   ├── supabase
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── session.ts
│   └── utils.ts
├── middleware.ts
├── next.config.ts
├── package.json
├── postcss.config.js
├── supabase
│   └── schema.sql
├── tailwind.config.ts
├── tsconfig.json
├── types
│   └── index.ts
└── vercel.json

15 directories, 44 files
</project_structure>

<file src=".gitignore">
# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

.env.local
.env.example
README.md
*.lock

</file>

<file src="app/BirdAnimation.tsx">
"use client";

import { motion } from "framer-motion";
import rightWingImg from "./right_wing.png";
import leftWingImg  from "./left_wing.png";
import bodyImg      from "./body.png";
import puuchImg     from "./puuch.png";

export default function BirdAnimation() {
  const baseTransition = { repeat: Infinity, ease: "easeInOut" } as const;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      
      <div style={{ position: "relative", width: "100%", maxWidth: "500px", aspectRatio: "1 / 1" }}>

        {/* Left Wing */}
        <motion.img
          src={leftWingImg.src}
          alt="left wing"
          initial={{ scaleX: 1 }}
          animate={{ y: [0, -10, 0], rotate: [0, -15, 0] }}
          transition={{ ...baseTransition, duration: 3.2, delay: 0 }}
          style={{
            position: "absolute",
            width: "50%",
            right: "52%",
            top: "15%",
            transformOrigin: "right center",
          }}
        />

        {/* Right Wing */}
        <motion.img
          src={rightWingImg.src}
          alt="right wing"
          initial={{ scaleX: 1 }}
          animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
          transition={{ ...baseTransition, duration: 3.2, delay: 0 }}
          style={{
            position: "absolute",
            width: "50%",
            left: "52%",
            top: "15%",
            transformOrigin: "left center",
          }}
        />

        {/* Body */}
        <motion.img
          src={bodyImg.src}
          alt="body"
          animate={{ y: [0, -12, 0] }}
          transition={{ ...baseTransition, duration: 3.2, delay: 0 }}
          style={{
            position: "absolute",
            width: "50%",
            left: "25%",
            top: "23%",
            transformOrigin: "center",
          }}
        />

        {/* Tail */}
        <motion.img
          src={puuchImg.src}
          alt="tail"
          animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
          transition={{ ...baseTransition, duration: 3.2, delay: 0.2 }}
          style={{
            position: "absolute",
            width: "33%",
            left: "34%",
            bottom: "8%",
            transformOrigin: "top center",
          }}
        />

      </div>
    </div>
  );
}
</file>

<file src="app/admin/dashboard/AdminDashboardClient.tsx">
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
</file>

<file src="app/admin/dashboard/page.tsx">
import { createClient } from '@/lib/supabase/server'
import { AdminDashboardClient } from './AdminDashboardClient'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/?error=unauthorized')

  const { data: games } = await (supabase as any)
    .from('games')
    .select('*, categories(id, name, type)')
    .order('day')
    .order('start_time')

  const { data: categories } = await (supabase as any)
    .from('categories')
    .select('*')
    .order('type')
    .order('name')

  return (
    <AdminDashboardClient
      games={games || []}
      categories={categories || []}
      adminName={profile.full_name || user.email || 'Admin'}
    />
  )
}
</file>

<file src="app/admin/login/page.tsx">
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const router = useRouter()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setMessage({ type: 'error', text: 'Login failed.' }); setLoading(false); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!(profile as any)?.is_admin) {
      await supabase.auth.signOut()
      setMessage({ type: 'error', text: 'You are not authorized as admin.' })
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Magic link sent! Check your email.' })
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
            style={{ background: 'var(--accent)' }}
          >
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
            Admin Portal
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Hostel Days 2026 — Score Management          </p>
        </div>

        {/* Mode toggle */}
        <div
          className="flex rounded-xl p-1 mb-5"
          style={{ background: 'var(--bg-secondary)' }}
        >
          {(['password', 'magic'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {m === 'password' ? '🔑 Password' : '✉️ Magic Link'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@college.edu"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          {mode === 'password' && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {message && (
            <div
              className="rounded-xl px-3 py-2.5 text-sm"
              style={{
                background: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                color: message.type === 'error' ? '#ef4444' : 'var(--live-color)',
                border: `1px solid ${message.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
              }}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60"
            style={{ background: 'var(--accent)' }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                {mode === 'password' ? 'Sign In' : 'Send Magic Link'}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
          Only authorized administrators can access this portal.
        </p>
      </div>
    </div>
  )
}
</file>

<file src="app/admin/page.tsx">
import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/dashboard')
}

</file>

<file src="app/globals.css">
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-display: 'Inter Tight', 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'DM Mono', monospace;

  /* Light mode tokens */
  --bg-primary: #fafaf9;
  --bg-secondary: #f4f2ef;
  --bg-card: #ffffff;
  --text-primary: #1c1917;
  --text-secondary: #44403c;
  --text-muted: #78716c;
  --border: #e7e5e4;
  --border-strong: #d6d3d1;
  --accent: #e1d3e8;
  --accent-glow: rgba(234, 88, 12, 0.2);
  --live-color: #22c55e;
  --live-glow: rgba(34, 197, 94, 0.25);
  --score-flash: rgba(34, 197, 94, 0.35);
}

.dark {
  --bg-primary: #000000;
  --bg-secondary: #000000;
  --bg-card: #1a1c1e;
  --text-primary: #e6edf3;
  --text-secondary: #c9d1d9;
  --text-muted: #8b949e;
  --border: #30363d;
  --border-strong: #484f58;
  --accent: #e1d3e8;
  --accent-glow: rgba(249, 115, 22, 0.2);
  --live-color: #3fb950;
  --live-glow: rgba(63, 185, 80, 0.2);
  --score-flash: rgba(63, 185, 80, 0.3);
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  letter-spacing: -0.02em;
  line-height: 1.15;
}

/* Score animation */
@keyframes score-flash {
  0% { background-color: transparent; }
  25% { background-color: var(--score-flash); }
  100% { background-color: transparent; }
}

@keyframes score-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.5); color: var(--live-color); }
  100% { transform: scale(1); }
}

@keyframes live-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

@keyframes ticker-move {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes fade-slide-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 12px var(--live-glow); }
  50% { box-shadow: 0 0 24px var(--live-glow), 0 0 40px var(--live-glow); }
}

.score-flash { animation: score-flash 1.4s ease-out; }
.score-pop { animation: score-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.live-dot { animation: live-dot 1.5s ease-in-out infinite; }
.ticker-animate { animation: ticker-move 35s linear infinite; }
.fade-slide-up { animation: fade-slide-up 0.4s ease-out; }
.glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }

/* Card base */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

/* Live badge */
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.15);
  color: var(--live-color);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.dark .live-badge {
  background: rgba(63, 185, 80, 0.15);
  color: #3fb950;
  border-color: rgba(63, 185, 80, 0.3);
}

/* Accent highlight bar */
.section-header {
  position: relative;
  padding-left: 16px;
}
.section-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  height: 80%;
  width: 3px;
  background: var(--accent);
  border-radius: 2px;
}

/* Nav active state */
.nav-active {
  color: var(--accent);
  font-weight: 600;
}

/* Input / select resets */
input, select, textarea {
  font-family: var(--font-body);
}

/* Shimmer loading */
.shimmer {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--border) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Focus visible */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Mobile tap targets */
@media (max-width: 640px) {
  button, a { min-height: 44px; }
}
</file>

<file src="app/info/page.tsx">
import { createClient } from '@/lib/supabase/server'
import { timeAgo } from '@/lib/utils'
import { Megaphone } from 'lucide-react'
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

      {/* Contact */}
      <section>
        <h2 className="section-header font-display font-bold text-sm uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
          Our Team
        </h2>
        <div className="card divide-y divide-[var(--border)]">
          {[
            {  name: 'Sudhanshu Raj '},
            {  name: 'Atharva Kant Yogi'},
            {  name: 'Omprakash Jena'},
            {  name: 'Arpit Passi'},
            {  name: 'Law Kumar'},
            {  name: 'Sanika Bandodkar'},
            {  name: 'Swoyansu Das'},
          ].map(c => (
            <div key={c.name} className="px-4 py-3">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-4" />
    </div>
  )
}
</file>

<file src="app/layout.tsx">
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { NavBar } from '@/components/NavBar'

export const metadata: Metadata = {
  title: {
    default: 'Hostel Days 2026 — College Cultural & Sports Festival',
    template: '%s | Hostel Days 2026',
  },
  description:
    'Live scores, schedules, and results for Hostel Days 2026 — the biggest inter-hostel cultural and sports festival. 5 days of fierce competition!',
  keywords: ['hostel days', 'college festival', 'live scores', 'sports', 'cultural'],
  openGraph: {
    title: 'Hostel Days 2026',
    description: 'Live scores & results for the biggest college fest',
    type: 'website',
  },
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="overflow-x-hidden">
        <ThemeProvider>
          <NavBar />
          <main className="md:min-h-screen md:pb-0 pb-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
</file>

<file src="app/live-scores/LiveScoresClient.tsx">
'use client'

import { useState, useEffect, useRef } from 'react'
import { Game, Category } from '@/types'
import { useRealtimeGames } from '@/hooks/useRealtimeGames'
import { useConfetti } from '@/hooks/useConfetti'
import { LiveScoreCard } from '@/components/LiveScoreCard'
import { DAY_THEMES } from '@/lib/utils'
import { Zap, Clock, CheckCircle2 } from 'lucide-react'

interface Props {
  initialGames: Game[]
  categories: Category[]
}

type FilterStatus = 'all' | 'live' | 'upcoming' | 'completed'
type FilterDay = 'all' | 1 | 2 | 3 | 4 | 5

export function LiveScoresClient({ initialGames, categories }: Props) {
  const { games, updatedId } = useRealtimeGames(initialGames)
  const { fire: fireConfetti } = useConfetti()
  const prevGamesRef = useRef<Game[]>(initialGames)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [dayFilter, setDayFilter] = useState<FilterDay>('all')
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'live' | 'error'>('connecting')

  useEffect(() => {
    const prev = prevGamesRef.current
    games.forEach(game => {
      const prevGame = prev.find(g => g.id === game.id)
      if (prevGame && prevGame.status !== 'completed' && game.status === 'completed') {
        fireConfetti()
      }
    })
    prevGamesRef.current = games
  }, [games, fireConfetti])

  useEffect(() => {
    const t = setTimeout(() => setConnectionStatus('live'), 1200)
    return () => clearTimeout(t)
  }, [])

  const filtered = games.filter(g => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false
    if (dayFilter !== 'all' && g.day !== dayFilter) return false
    return true
  })

  const days = dayFilter === 'all' ? [1, 2, 3, 4, 5] : [dayFilter]

  const liveCount      = games.filter(g => g.status === 'live').length
  const upcomingCount  = games.filter(g => g.status === 'upcoming').length
  const completedCount = games.filter(g => g.status === 'completed').length

  return (
    <div className="px-4 sm:px-6 py-4 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
            Live Scores
          </h1>
          <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${connectionStatus === 'live' ? 'bg-[var(--live-color)] live-dot' : 'bg-yellow-400'}`}
            />
            {connectionStatus === 'live' ? 'Real-time connected' : 'Connecting…'}
          </p>
        </div>
        {liveCount > 0 && (
          <span className="live-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
            {liveCount} Live
          </span>
        )}
      </div>

      {/* Status filter pills — no count badge, icon only on active, fits in one row */}
      <div className="flex gap-1.5 mb-3">
        {([
          { key: 'all',       label: 'All',      count: games.length,   icon: null },
          { key: 'live',      label: 'Live',     count: liveCount,      icon: <Zap size={10} /> },
          { key: 'upcoming',  label: 'Upcoming', count: upcomingCount,  icon: <Clock size={10} /> },
          { key: 'completed', label: 'Done',     count: completedCount, icon: <CheckCircle2 size={10} /> },
        ] as const).map(f => {
          const active = statusFilter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key as FilterStatus)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                active
                  ? 'bg-[var(--accent)] text-white border-transparent'
                  : 'border-[var(--border)] text-[var(--text-muted)]'
              }`}
            >
              {active && f.icon}
              {f.label}
              {active && f.count > 0 && (
                <span className="text-[9px] font-bold opacity-80">{f.count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Day filter — compact, fits all 6 buttons */}
      <div className="flex gap-1 mb-5">
        {(['all', 1, 2, 3, 4, 5] as const).map(d => (
          <button
            key={d}
            onClick={() => setDayFilter(d as FilterDay)}
            className={`flex-1 py-1 rounded-lg text-[11px] font-medium border transition-all ${
              dayFilter === d
                ? 'bg-[var(--bg-secondary)] border-[var(--border-strong)] text-[var(--text-primary)]'
                : 'border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            {d === 'all' ? 'All' : `D${d}`}
          </button>
        ))}
      </div>

      {/* Games grouped by day */}
      {days.map(day => {
        const dayGames = filtered.filter(g => g.day === day)
        if (dayGames.length === 0) return null

        const sports   = dayGames.filter(g => (g as any).categories?.type === 'sports')
        const cultural = dayGames.filter(g => (g as any).categories?.type === 'cultural')
        const theme    = DAY_THEMES[day]

        return (
          <div key={day} className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Day {day}
              </h2>
              {theme && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  · {theme.label}
                </span>
              )}
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            {sports.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  ⚽ Sports
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sports.map(game => (
                    <div key={game.id} className={`fade-slide-up ${updatedId === game.id ? 'score-flash' : ''}`}>
                      <LiveScoreCard game={game as any} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cultural.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  🎭 Cultural
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cultural.map(game => (
                    <div key={game.id} className={`fade-slide-up ${updatedId === game.id ? 'score-flash' : ''}`}>
                      <LiveScoreCard game={game as any} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {filtered.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-3xl mb-2">🏆</p>
          <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>No games found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different filter</p>
        </div>
      )}
    </div>
  )
}
</file>

<file src="app/live-scores/page.tsx">
import { createClient } from '@/lib/supabase/server'
import { LiveScoresClient } from './LiveScoresClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live Scores',
  description: 'Real-time live scores for all Hostel Days 2026 matches. Auto-updating scores with no refresh needed.',
}

export const revalidate = 0

export default async function LiveScoresPage() {
  const supabase = await createClient()

  const { data: games } = await supabase
    .from('games')
    .select('*, categories(id, name, type)')
    .order('day', { ascending: true })
    .order('start_time', { ascending: true })

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('type')
    .order('name')

  return (
    <LiveScoresClient
      initialGames={games || []}
      categories={categories || []}
    />
  )
}

</file>

<file src="app/merch/page.tsx">
import type { Metadata } from 'next'
import Image from 'next/image'
import { ShoppingBag, ExternalLink } from 'lucide-react'
import merchImg from './merch.jpg'

export const metadata: Metadata = {
  title: 'Merch — Hostel Days 2026',
  description: 'Official Hostel Days 2026 merch collection. Order now using the link for your year.',
}

const YEAR_ORDERS = [
  { label: '1st Year', batch: 'Batch of 2029', url: 'https://forms.gle/eCn6zEinXqxr6ogQ8' },
  { label: '2nd Year', batch: 'Batch of 2028', url: 'https://forms.gle/ZAJ54dpBrYAqtUTCA' },
  { label: '3rd Year', batch: 'Batch of 2027', url: 'https://forms.gle/DspW4W7dJsvHxWeP8' },
  { label: '4th Year', batch: 'Batch of 2026', url: 'https://forms.gle/DSgk3z9241nZkdQs8' },
  { label: 'M.Tech',   batch: null,             url: 'https://forms.gle/MAAncpxnC5xv4eLA8' },
  { label: 'PhD',      batch: null,             url: 'https://forms.gle/K6wrXzXx3FkumfKp7' },
]

export default function MerchPage() {
  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-8">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          <ShoppingBag size={17} className="text-white" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
            Official Merch
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Hostel Days 2026 Collection
          </p>
        </div>
      </div>

      {/* Merch Image */}
      <div className="card overflow-hidden rounded-2xl">
        <Image
          src={merchImg}
          alt="Hostel Days 2026 official merch collection"
          className="w-full object-cover"
          placeholder="blur"
          priority
        />
      </div>

      {/* Description */}
      <div className="card px-5 py-4 space-y-1">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          We are pleased to introduce the <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>official Hostel Days merch collection</span>, thoughtfully designed to reflect the spirit, unity, and legacy of our campus.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          To ensure a smooth ordering process, please use the specific link assigned to your year.
        </p>
      </div>

      {/* Order Links */}
      <div>
        <h2
          className="section-header font-display font-bold text-sm uppercase tracking-wide mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          📍 Select Your Year to Order
        </h2>

        <div className="space-y-2">
          {YEAR_ORDERS.map(({ label, batch, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:border-[var(--border-strong)] active:scale-[0.99] group"
              style={{ textDecoration: 'none' }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </p>
                {batch && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {batch}
                  </p>
                )}
              </div>
              <div
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all group-hover:opacity-70"
                style={{ background: 'var(--border-strong)', color: '#ffffff' }}
              >
                Order
                <ExternalLink size={11} />
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
</file>

<file src="app/page.tsx">
import { createClient } from '@/lib/supabase/server'
import { LiveTicker } from '@/components/LiveTicker'
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
      {/* Live Ticker */}
      {liveGames.length > 0 && <LiveTicker games={liveGames} />}

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
                Live Scores
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
</file>

<file src="app/results/page.tsx">
import { createClient } from '@/lib/supabase/server'
import { getCategoryIcon, DAY_THEMES } from '@/lib/utils'
import { Trophy } from 'lucide-react'
import type { Metadata } from 'next'
import { Game } from '@/types'

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

  const completed = (games as unknown as Game[]) || []
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
                const icon = game.categories ? getCategoryIcon(game.categories.name) : '🏆'
                const winnerIsA = game.winner === game.team_a
                const winnerIsB = game.winner === game.team_b

                return (
                  <div key={game.id} className="card px-4 py-3">
                    {/* Event label */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm">{icon}</span>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        {game.categories?.name} · {game.event_name}
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
                          {game.score_a}
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
                          {game.score_b}
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
</file>

<file src="app/schedule/ScheduleCountdown.tsx">
'use client'

import { useEffect, useState } from 'react'

interface Props {
  target: string   // 'YYYY-MM-DDTHH:MM:SS'
  label: string
}

export function ScheduleCountdown({ target, label }: Props) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [expired, setExpired]   = useState(false)

  useEffect(() => {
    const targetMs = new Date(target).getTime()

    const tick = () => {
      const diff = targetMs - Date.now()
      if (diff <= 0) { setExpired(true); return }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000)  / 60000),
        s: Math.floor((diff % 60000)    / 1000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  // Hide once the event has started
  if (expired) return null

  const units = [
    { value: String(timeLeft.d).padStart(2, '0'), label: 'days' },
    { value: String(timeLeft.h).padStart(2, '0'), label: 'hrs'  },
    { value: String(timeLeft.m).padStart(2, '0'), label: 'min'  },
    { value: String(timeLeft.s).padStart(2, '0'), label: 'sec'  },
  ]

  return (
    <div
      className="mb-5 rounded-xl px-4 py-4"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs uppercase tracking-wider font-semibold mb-3 text-center" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-3 sm:gap-6">
            <div className="text-center">
              <p
                className="font-display font-bold tabular-nums text-3xl sm:text-4xl"
                style={{ color: 'var(--accent)' }}
              >
                {u.value}
              </p>
              <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {u.label}
              </p>
            </div>
            {i < units.length - 1 && (
              <span className="text-xl font-bold pb-4" style={{ color: 'var(--border-strong)' }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
</file>

<file src="app/schedule/page.tsx">
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
    num: 1, label: 'Day 1', date: 'Saturday, 5 April', dateISO: '2026-04-05',
    venues: [
      { name: 'Sports Room', events: [{ name: 'Badminton MM & FF League', icon: '🏸', time: '08:00' }] }
    ]
  },
  {
    num: 2, label: 'Day 2', date: 'Sunday, 6 April', dateISO: '2026-04-06',
    venues: [
      { name: 'Ground', events: [{ name: 'Cricket League', icon: '🏏', time: '07:00' }] },
      { name: 'BA Court', events: [{ name: 'Badminton MM & FF League', icon: '🏸', time: '07:00' }] },
      { name: 'BD Court', events: [
          { name: 'Basketball League', icon: '🏀', time: '08:00' },
          { name: 'Table Tennis M & F League', icon: '🏓', time: '10:00' }
      ]}
    ]
  },
  {
    num: 3, label: 'Day 3', date: 'Monday, 7 April', dateISO: '2026-04-07',
    venues: [
      { name: 'Ground', events: [{ name: 'Cricket League', icon: '🏏', time: '07:00' }, { name: 'Football League', icon: '⚽', time: '17:00' }] },
      { name: 'BA Court', events: [{ name: 'Badminton MF League', icon: '🏸', time: '07:00' }] },
      { name: 'BD Court', events: [{ name: 'Basketball League', icon: '🏀', time: '08:00' }, { name: 'Table Tennis M & F League', icon: '🏓', time: '10:00' }] },
      { name: 'V Court', events: [{ name: 'Volley League', icon: '🏐', time: '07:00' }] },
      { name: 'Gyan Mandir', events: [{ name: 'Chess', icon: '♟️', time: '10:00' }, { name: 'Carrom League', icon: '🎯', time: '14:00' }] }
    ]
  },
  {
    num: 4, label: 'Day 4', date: 'Tuesday, 8 April', dateISO: '2026-04-08',
    venues: [
      { name: 'Ground', events: [
          { name: 'Track Events', icon: '🏃', time: '06:00' },
          { name: '7 Stones', icon: '🪨', time: '10:00' },
          { name: 'Javelin', icon: '🎯', time: '10:00' },
          { name: 'Cricket League', icon: '🏏', time: '14:00' },
          { name: 'Football League', icon: '⚽', time: '17:00' }
      ]},
      { name: 'BA Court', events: [{ name: 'Badminton MF League', icon: '🏸', time: '07:00' }] },
      { name: 'BD Court', events: [{ name: 'Basketball League', icon: '🏀', time: '08:00' }, { name: 'Table Tennis M & F League', icon: '🏓', time: '10:00' }] },
      { name: 'V Court', events: [{ name: 'Volley League', icon: '🏐', time: '07:00' }] },
      { name: 'Gyan Mandir', events: [{ name: 'Carrom EB Point', icon: '🎯', time: '10:00' }, { name: "Kho Kho Men's", icon: '🏃', time: '14:00' }] }
    ]
  },
  {
    num: 5, label: 'Day 5', date: 'Wednesday, 9 April', dateISO: '2026-04-09',
    venues: [
      { name: 'Ground', events: [{ name: 'Cricket Final', icon: '🏏', time: '08:00' }, { name: 'Football League & Final', icon: '⚽', time: '15:00' }] },
      { name: 'BA Court', events: [{ name: 'Badminton MM & FF Final', icon: '🏸', time: '08:00' }, { name: 'Badminton MF League', icon: '🏸', time: '14:00' }] },
      { name: 'BD Court', events: [{ name: 'Basketball League', icon: '🏀', time: '08:00' }, { name: 'Table Tennis M & F League & Final', icon: '🏓', time: '10:00' }] },
      { name: 'V Court', events: [{ name: 'Volley League & Final', icon: '🏐', time: '07:00' }] },
      { name: 'Gyan Mandir', events: [{ name: "Kho Kho Women's", icon: '🏃', time: '08:00' }] },
      { name: 'Chapora Hall', events: [{ name: 'Duet Singing (6 PM – 7 PM)', icon: '🎤', time: '18:00' }, { name: 'Fashion Show (7 PM – 8:30 PM)', icon: '👗', time: '19:00' }] }
    ]
  },
  {
    num: 6, label: 'Day 6', date: 'Thursday, 10 April', dateISO: '2026-04-10',
    venues: [
      { name: 'Ground', events: [{ name: 'Archery', icon: '🏹', time: '08:00' }, { name: 'Basketball League', icon: '🏀', time: '10:00' }, { name: 'Basketball Finals / 1st & 2nd Year Girls', icon: '🏀', time: '14:00' }] },
      { name: 'BA Court', events: [{ name: 'Badminton MF Final', icon: '🏸', time: '08:00' }] },
      { name: 'NIT Goa', events: [
          { name: 'Graffiti', icon: '🎨', time: '10:00' },
          { name: 'Sketching & Painting', icon: '🖌️', time: '10:00' },
          { name: 'Group + Solo + Duet Dance', icon: '💃', time: '14:00' },
          { name: 'Instrumental (9 PM – 11 PM)', icon: '🎸', time: '21:00' },
          { name: 'DJ Night', icon: '🎧', time: '21:00' }
      ]}
    ]
  },
  {
    num: 7, label: 'Day 7', date: 'Sunday, 12 April', dateISO: '2026-04-12',
    venues: [
      { name: 'NIT Goa', events: [{ name: 'Award Distribution', icon: '🏆', time: '11:00' }] }
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
</file>

<file src="components/HomeHero.tsx">
'use client'

import { useEffect, useState, useRef } from 'react'
import { getDaysUntilFestival, isFestivalActive, getCurrentFestivalDay, DAY_THEMES } from '@/lib/utils'
import Link from 'next/link'
import BirdAnimation from '@/app/BirdAnimation'

interface Step {
  word: string
  color: string
  finale?: boolean
}

const SEQUENCE: Step[] = [
  { word: 'cricket',            color: '#f59e0b' },
  { word: 'football',           color: '#22c55e' },
  { word: 'basketball',         color: '#f97316' },
  { word: 'volleyball',         color: '#3b82f6' },
  { word: 'badminton',          color: '#a855f7' },
  { word: 'table tennis',       color: '#06b6d4' },
  { word: 'chess',              color: '#ec4899' },
  { word: 'the ultimate clash', color: '#ffffff' },
  { word: 'hostel days 2026',   color: '#ecbe19ff', finale: true },
]

const GAME_HOLD     = 150
const ULTIMATE_HOLD = 250
const FADE_MS       = 50

interface Props {
  liveCount: number
  totalGames: number
  completedCount: number
  registrationUrl?: string
}

// ============================================================
//  POSITION CONTROLS — edit these values to reposition
// ============================================================

const BIRD_DESKTOP_TRANSLATE_Y = '-6vh'
const BIRD_MOBILE_TRANSLATE_Y  = '-2vh'

const BIRD_DESKTOP_TRANSLATE_X = '0px'
const BIRD_MOBILE_TRANSLATE_X  = '-8px'   // ← move bird left/right on mobile, e.g. '-10vw' or '5%'

const BIRD_DESKTOP_SCALE       = '1.35'
const BIRD_MOBILE_SCALE        = '1.03'

const TEXT_DESKTOP_PADDING_TOP = '6vh'
const TEXT_MOBILE_PADDING_TOP  = '3vh'

const WORD_DESKTOP_MARGIN_TOP  = '10vh'
const WORD_MOBILE_MARGIN_TOP   = '3.5vh'

const WORD_DESKTOP_PADDING_TOP = 'clamp(10vh, 6vw, 15vh)'
const WORD_MOBILE_PADDING_TOP  = '14vh'

const STATS_DESKTOP_MIN_HEIGHT = '26vh'
const STATS_MOBILE_MIN_HEIGHT  = '14vh'

// ============================================================

export function HomeHero({ liveCount, totalGames, completedCount, registrationUrl = '/Participate' }: Props) {
  const [mounted, setMounted]               = useState(false)
  const [timeLeft, setTimeLeft]             = useState({ h: 0, m: 0, s: 0 })
  const [buttonVisible, setButtonVisible]   = useState(false)
  const [wordOpacity, setWordOpacity]       = useState(1)
  const [displayedWord, setDisplayedWord]   = useState(SEQUENCE[0].word)
  const [displayedColor, setDisplayedColor] = useState(SEQUENCE[0].color)
  const [isMobile, setIsMobile]             = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clear = () => { if (timerRef.current) clearTimeout(timerRef.current) }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const runStep = (i: number) => {
    if (i >= SEQUENCE.length) return
    const s = SEQUENCE[i]

    if (s.finale) {
      setDisplayedWord(s.word)
      setDisplayedColor(s.color)
      setWordOpacity(1)
      timerRef.current = setTimeout(() => {
        setTimeout(() => setButtonVisible(true), 300)
      }, 500)
      return
    }

    setWordOpacity(0)
    timerRef.current = setTimeout(() => {
      setDisplayedWord(s.word)
      setDisplayedColor(s.color)
      setWordOpacity(1)
      scheduleNext(i, s)
    }, FADE_MS)
  }

  const scheduleNext = (i: number, s: Step) => {
    const hold = s.word === 'the ultimate clash' ? ULTIMATE_HOLD : GAME_HOLD
    timerRef.current = setTimeout(() => runStep(i + 1), hold)
  }

  useEffect(() => {
    setMounted(true)
    setDisplayedWord(SEQUENCE[0].word)
    setDisplayedColor(SEQUENCE[0].color)
    setWordOpacity(0)
    timerRef.current = setTimeout(() => {
      setWordOpacity(1)
      scheduleNext(0, SEQUENCE[0])
    }, FADE_MS)
    return () => clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mounted) return
    const festivalStart = new Date(process.env.NEXT_PUBLIC_FESTIVAL_START_DATE || '2026-03-10')
    const tick = () => {
      const now  = new Date()
      const diff = festivalStart.getTime() - now.getTime()
      if (diff <= 0) return
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [mounted])

  const festivalActive = mounted ? isFestivalActive()      : false
  const daysUntil      = mounted ? getDaysUntilFestival()  : 0
  const currentDay     = mounted ? getCurrentFestivalDay() : 1
  const _dayTheme      = DAY_THEMES[currentDay] || DAY_THEMES[1]

  const birdTranslateY  = isMobile ? BIRD_MOBILE_TRANSLATE_Y  : BIRD_DESKTOP_TRANSLATE_Y
  const birdTranslateX  = isMobile ? BIRD_MOBILE_TRANSLATE_X  : BIRD_DESKTOP_TRANSLATE_X
  const birdScale       = isMobile ? BIRD_MOBILE_SCALE        : BIRD_DESKTOP_SCALE
  const textPaddingTop  = isMobile ? TEXT_MOBILE_PADDING_TOP  : TEXT_DESKTOP_PADDING_TOP
  const wordMarginTop   = isMobile ? WORD_MOBILE_MARGIN_TOP   : WORD_DESKTOP_MARGIN_TOP
  const wordPaddingTop  = isMobile ? WORD_MOBILE_PADDING_TOP  : WORD_DESKTOP_PADDING_TOP
  const statsMinHeight  = isMobile ? STATS_MOBILE_MIN_HEIGHT  : STATS_DESKTOP_MIN_HEIGHT

  return (
    <section
      className="relative overflow-hidden px-4 sm:px-6 max-w-2xl md:max-w-4xl mx-auto flex flex-col min-h-[40vh] md:min-h-[60vh]"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none z-0"
        style={{ backgroundImage: `radial-gradient(circle at 70% 50%, var(--accent) 0%, transparent 60%)` }}
      />

      {/* Bird */}
      <div
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
        style={{ transform: `translateX(${birdTranslateX}) translateY(${birdTranslateY})` }}
      >
        <div style={{ width: '100%', maxWidth: '500px', transform: `scale(${birdScale})` }}>
          <BirdAnimation />
        </div>
      </div>

      {/* Text + Button + Stats */}
      <div
        className="relative z-10 w-full pointer-events-auto flex flex-col items-center flex-1"
        style={{ paddingTop: textPaddingTop }}
      >

        {/* Live badge */}
        <div className="flex items-center justify-center gap-2 mb-1 w-full">
          {liveCount > 0 && (
            <span className="live-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
              {liveCount} Live
            </span>
          )}
        </div>

        {/* Merch text — mobile only */}
        <p className="md:hidden text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full mr-1 live-dot align-middle"
            style={{ background: '#facc15' }}
          />
          Merch is live —{' '}
          <Link
            href="/merch"
            style={{ color: 'var(--text-primary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            Buy Now
          </Link>
        </p>

        {/* Flashing word block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontFamily: 'var(--font-display)',
            marginTop: wordMarginTop,
            marginBottom: '1rem',
            width: '100%',
          }}
        >
          <p
            style={{
              margin: 0,
              paddingTop: wordPaddingTop,
              fontSize: 'clamp(22px, 7vw, 64px)',
              fontWeight: 400,
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          >
            <span
              style={{
                color: displayedColor,
                fontWeight: 600,
                opacity: wordOpacity,
                transition: `opacity ${FADE_MS}ms ease`,
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
              }}
            >
              {displayedWord}
            </span>
          </p>

          {/* Participate button */}
          <div
            style={{
              display: 'grid',
              gridTemplateRows: buttonVisible ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.4s ease-out',
              width: '100%',
            }}
          >
            <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
              <Link
                href={'https://forms.gle/bwcyvvjDVhTyV72V6'}
                style={{
                  display: 'inline-block',
                  marginTop: 15,
                  marginBottom: 10,
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  padding: '8px 24px',
                  border: '1px solid var(--accent)',
                  borderRadius: 4,
                  background: 'rgba(140, 108, 152, 0.15)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase' as const,
                  opacity: buttonVisible ? 1 : 0,
                  transform: buttonVisible ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                }}
              >
                Participate
              </Link>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" style={{ minHeight: statsMinHeight }} />

        {/* Stats / countdown */}
        {!festivalActive && daysUntil > 0 ? (
          <div className="card w-full sm:w-auto p-4 md:p-6 bg-opacity-80 backdrop-blur-sm shadow-lg mx-auto">
            <div className="grid grid-cols-2 gap-4 sm:hidden">
              {[
                { value: String(timeLeft.h).padStart(2, '0'), label: 'hrs' },
                { value: String(timeLeft.m).padStart(2, '0'), label: 'min' },
                { value: String(timeLeft.s).padStart(2, '0'), label: 'sec', accent: true },
                { value: `${daysUntil}d`, label: 'to go' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p
                    className="font-display font-bold tabular-nums text-3xl"
                    style={{ color: item.accent ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {item.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden sm:flex items-center justify-center gap-4 md:gap-8 w-full">
              <div className="text-center">
                <p className="font-display font-bold tabular-nums text-2xl md:text-5xl" style={{ color: 'var(--text-primary)' }}>
                  {String(timeLeft.h).padStart(2, '0')}
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>hrs</p>
              </div>
              <span className="text-xl md:text-3xl font-bold" style={{ color: 'var(--border-strong)' }}>:</span>
              <div className="text-center">
                <p className="font-display font-bold tabular-nums text-2xl md:text-5xl" style={{ color: 'var(--text-primary)' }}>
                  {String(timeLeft.m).padStart(2, '0')}
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>min</p>
              </div>
              <span className="text-xl md:text-3xl font-bold" style={{ color: 'var(--border-strong)' }}>:</span>
              <div className="text-center">
                <p className="font-display font-bold tabular-nums text-2xl md:text-5xl" style={{ color: 'var(--accent)' }}>
                  {String(timeLeft.s).padStart(2, '0')}
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>sec</p>
              </div>
              <div className="ml-2 pl-4 md:pl-8 border-l" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs md:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{daysUntil}d to go</p>
                <p className="text-[10px] md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>until kickoff</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 md:gap-10 w-full">
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>{totalGames}</p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Total games</p>
            </div>
            <div className="w-px h-8 md:h-14" style={{ background: 'var(--border)' }} />
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-4xl" style={{ color: liveCount > 0 ? 'var(--live-color)' : 'var(--text-primary)' }}>
                {liveCount}
              </p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Live now</p>
            </div>
            <div className="w-px h-8 md:h-14" style={{ background: 'var(--border)' }} />
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>{completedCount}</p>
              <p className="text-xs md:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Completed</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
</file>

<file src="components/LiveScoreCard.tsx">
'use client'

import { useEffect, useRef, useState } from 'react'
import { Game } from '@/types'
import { cn, formatGameTime, getCategoryIcon } from '@/lib/utils'
import { Clock, Trophy } from 'lucide-react'

interface Props {
  game: Game & { categories?: { name: string; type: string } }
}

export function LiveScoreCard({ game }: Props) {
  const [scoreA, setScoreA] = useState(game.score_a)
  const [scoreB, setScoreB] = useState(game.score_b)
  const [flashA, setFlashA] = useState(false)
  const [flashB, setFlashB] = useState(false)
  const [popA, setPopA] = useState(false)
  const [popB, setPopB] = useState(false)
  const prevA = useRef(game.score_a)
  const prevB = useRef(game.score_b)

  useEffect(() => {
    if (game.score_a !== prevA.current) {
      setScoreA(game.score_a)
      setFlashA(true)
      setPopA(true)
      prevA.current = game.score_a
      setTimeout(() => { setFlashA(false); setPopA(false) }, 1400)
    }
    if (game.score_b !== prevB.current) {
      setScoreB(game.score_b)
      setFlashB(true)
      setPopB(true)
      prevB.current = game.score_b
      setTimeout(() => { setFlashB(false); setPopB(false) }, 1400)
    }
  }, [game.score_a, game.score_b])

  const isLive = game.status === 'live'
  const isCompleted = game.status === 'completed'
  const icon = game.categories ? getCategoryIcon(game.categories.name) : '🏆'
  const categoryLabel = game.categories?.name || ''

  const winnerIsA = isCompleted && game.winner === game.team_a
  const winnerIsB = isCompleted && game.winner === game.team_b

  return (
    <div
      className={cn(
        'card relative overflow-hidden transition-all duration-200',
        isLive && 'glow-pulse border-[var(--live-color)]/30',
        isCompleted && 'opacity-80'
      )}
    >
      {/* Live top bar */}
      {isLive && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, var(--live-color), transparent)' }}
        />
      )}

      <div className="p-3 sm:p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {categoryLabel}
              </p>
              <p
                className="text-sm font-semibold leading-tight"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                {game.event_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isLive && (
              <span className="live-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--live-color)] live-dot" />
                Live
              </span>
            )}
            {isCompleted && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}
              >
                Final
              </span>
            )}
            {game.status === 'upcoming' && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                <Clock size={11} />
                {formatGameTime(game.start_time)}
              </span>
            )}
          </div>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Team A */}
          <div
            className={cn(
              'flex flex-col items-center p-2.5 rounded-lg transition-all duration-300',
              flashA && 'score-flash',
              winnerIsA && 'ring-1 ring-yellow-400/60'
            )}
            style={{ background: 'var(--bg-secondary)' }}
          >
            {winnerIsA && <Trophy size={11} className="text-yellow-400 mb-1" />}
            <p
              className={cn(
                'text-xl sm:text-2xl font-display font-bold tabular-nums transition-all',
                popA && 'score-pop',
                isLive && scoreA > scoreB && 'text-[var(--live-color)]'
              )}
              style={{ color: popA ? 'var(--live-color)' : 'var(--text-primary)' }}
            >
              {scoreA}
            </p>
            <p
              className="text-xs font-medium mt-0.5 text-center leading-tight line-clamp-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {game.team_a}
            </p>
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center">
            <span
              className="text-xs font-bold tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              VS
            </span>
          </div>

          {/* Team B */}
          <div
            className={cn(
              'flex flex-col items-center p-2.5 rounded-lg transition-all duration-300',
              flashB && 'score-flash',
              winnerIsB && 'ring-1 ring-yellow-400/60'
            )}
            style={{ background: 'var(--bg-secondary)' }}
          >
            {winnerIsB && <Trophy size={11} className="text-yellow-400 mb-1" />}
            <p
              className={cn(
                'text-xl sm:text-2xl font-display font-bold tabular-nums transition-all',
                popB && 'score-pop',
                isLive && scoreB > scoreA && 'text-[var(--live-color)]'
              )}
              style={{ color: popB ? 'var(--live-color)' : 'var(--text-primary)' }}
            >
              {scoreB}
            </p>
            <p
              className="text-xs font-medium mt-0.5 text-center leading-tight line-clamp-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {game.team_b}
            </p>
          </div>
        </div>

        {/* Winner line */}
        {isCompleted && game.winner && (
          <p
            className="mt-2.5 text-center text-xs font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            🏆 <span style={{ color: 'var(--text-primary)' }}>{game.winner}</span> wins!
          </p>
        )}
      </div>
    </div>
  )
}

</file>

<file src="components/LiveTicker.tsx">
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

</file>

<file src="components/NavBar.tsx">
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Trophy, Calendar, Star, Info, Zap, Moon, Sun, Shield, ShoppingBag } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Star },
  { href: '/live-scores', label: 'Live', icon: Zap },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/results', label: 'Results', icon: Trophy },
  { href: '/merch', label: 'Merch', icon: ShoppingBag },
]

export function NavBar() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return null

  return (
    <>
      {/* ── Desktop Top Nav ── */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-14 items-center justify-between px-6">
        {/* Left — logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--accent)' }}
          >
            HD
          </span>
          <span className="font-display font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Hostel Days
            <span className="ml-1.5 text-xs font-body font-normal" style={{ color: 'var(--text-muted)' }}>
              2026
            </span>
          </span>
        </Link>

        {/* Centre — text-only nav links */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  active
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right — theme toggle + admin */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-secondary)]"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            <Shield size={13} />
            Admin
          </Link>
        </div>
      </header>

      {/* Desktop spacer */}
      <div className="hidden md:block h-14" />

      {/* ── Mobile Top Pill — theme toggle only ── */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all shadow-sm"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark'
            ? <><Sun size={13} /><span>Light</span></>
            : <><Moon size={13} /><span>Dark</span></>
          }
        </button>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 h-16 border-t"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border)',
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-h-[44px] justify-center',
                active
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-muted)]'
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
              {active && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
</file>

<file src="components/QuickStats.tsx">
export function QuickStats() {
  return null
}

</file>

<file src="components/ThemeProvider.tsx">
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initial = stored || preferred
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  const toggle = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

</file>

<file src="components/flashtext.tsx">
"use client";

import { useState, useEffect, useRef } from "react";

interface Step {
  static: string;
  word: string;
  color: string;
  finale?: boolean;
}

const SEQUENCE: Step[] = [
  { static: "get ready for", word: "cricket",        color: "#f59e0b" },
  { static: "get ready for", word: "football",       color: "#22c55e" },
  { static: "get ready for", word: "basketball",     color: "#" },
  { static: "get ready for", word: "volleyball",     color: "#3b82f6" },
  { static: "get ready for", word: "badminton",      color: "#a855f7" },
  { static: "get ready for", word: "table tennis",   color: "#06b6d4" },
  { static: "get ready for", word: "chess",          color: "#ec4899" },
  { static: "get ready for", word: "the ultimate clash", color: "#ffffff" },
  { static: "get ready for",        word: "hostel days 2026",    color: "#fbbf24", finale: true },
];

const GAME_HOLD = 100;
const ULTIMATE_HOLD = 100;
const FADE_MS = 0;

export default function HostelDaysAnimation() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [wordOpacity, setWordOpacity] = useState(1);
  const [displayedWord, setDisplayedWord] = useState(SEQUENCE[0].word);
  const [displayedColor, setDisplayedColor] = useState(SEQUENCE[0].color);
  const [prefix, setPrefix] = useState(SEQUENCE[0].static);
  const [done, setDone] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const runStep = (i: number) => {
    if (i >= SEQUENCE.length) return;
    indexRef.current = i;
    const s = SEQUENCE[i];
    const prevPrefix = i > 0 ? SEQUENCE[i - 1].static : null;
    const prefixChanged = prevPrefix !== s.static;

    setStepIndex(i);
    setPrefix(s.static);

    if (prefixChanged) {
      setWordOpacity(0);
      timerRef.current = setTimeout(() => {
        setDisplayedWord(s.word);
        setDisplayedColor(s.color);
        setWordOpacity(1);
        scheduleNext(i, s);
      }, FADE_MS);
    } else {
      setWordOpacity(0);
      timerRef.current = setTimeout(() => {
        setDisplayedWord(s.word);
        setDisplayedColor(s.color);
        setWordOpacity(1);
        scheduleNext(i, s);
      }, FADE_MS);
    }
  };

  const scheduleNext = (i: number, s: Step) => {
    if (s.finale) {
      timerRef.current = setTimeout(() => setDone(true), 500);
      return;
    }
    const hold = s.word === "ultimate clash" ? ULTIMATE_HOLD : GAME_HOLD;
    timerRef.current = setTimeout(() => runStep(i + 1), hold);
  };

  const handleStart = () => {
    setStarted(true);
    setDone(false);
    setStepIndex(0);
    setPrefix(SEQUENCE[0].static);
    setDisplayedWord(SEQUENCE[0].word);
    setDisplayedColor(SEQUENCE[0].color);
    setWordOpacity(0);
    timerRef.current = setTimeout(() => {
      setWordOpacity(1);
      scheduleNext(0, SEQUENCE[0]);
    }, FADE_MS);
  };

  const handleReplay = () => {
    clear();
    setStarted(false);
    setDone(false);
    setStepIndex(0);
    setWordOpacity(1);
    setDisplayedWord(SEQUENCE[0].word);
    setDisplayedColor(SEQUENCE[0].color);
    setPrefix(SEQUENCE[0].static);
  };

  useEffect(() => () => clear(), []);

  return (
    <div
      style={{
        minHeight: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "2rem 2.5rem",
        fontFamily: "'Barlow Condensed', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600&display=swap"
        rel="stylesheet"
      />

      {!started && !done && (
        <button
          onClick={handleStart}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "0.1em",
            padding: "10px 28px",
            border: "1px solid #666",
            borderRadius: 3,
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          play ↗
        </button>
      )}

      {started && !done && (
        <p
          style={{
            margin: 0,
            fontSize: "clamp(22px, 5vw, 36px)",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          <span>{prefix}</span>
          <span> </span>
          <span
            style={{
              color: displayedColor,
              fontWeight: 600,
              opacity: wordOpacity,
              transition: `opacity ${FADE_MS}ms ease`,
            }}
          >
            {displayedWord}
          </span>
        </p>
      )}

      {done && (
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "clamp(22px, 5vw, 36px)",
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            <span>welcome to</span>
            <span> </span>
            <span style={{ color: "#fbbf24", fontWeight: 600 }}>
              hostel days
            </span>
          </p>
          <button
            onClick={handleReplay}
            style={{
              marginTop: 24,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              fontWeight: 400,
              letterSpacing: "0.15em",
              padding: "6px 20px",
              border: "1px solid #555",
              borderRadius: 3,
              background: "transparent",
              color: "inherit",
              opacity: 0.5,
              cursor: "pointer",
            }}
          >
            replay
          </button>
        </div>
      )}
    </div>
  );
}
</file>

<file src="hooks/useConfetti.ts">
'use client'

import { useCallback } from 'react'

export function useConfetti() {
  const fire = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#', '#fb923c', '#fbbf24', '#34d399', '#60a5fa'],
    })
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#', '#fbbf24'],
      })
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#34d399', '#60a5fa'],
      })
    }, 250)
  }, [])

  return { fire }
}

</file>

<file src="hooks/useRealtimeGames.ts">
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Game } from '@/types'

export function useRealtimeGames(initialGames: Game[]) {
  const [games, setGames] = useState<Game[]>(initialGames)
  const [updatedId, setUpdatedId] = useState<number | null>(null)

  const handleUpdate = useCallback((payload: { new: Game }) => {
    const updated = payload.new
    setGames(prev =>
      prev.map(g => (g.id === updated.id ? { ...g, ...updated } : g))
    )
    setUpdatedId(updated.id)
    setTimeout(() => setUpdatedId(null), 1500)
  }, [])

  const handleInsert = useCallback((payload: { new: Game }) => {
    setGames(prev => {
      if (prev.find(g => g.id === payload.new.id)) return prev
      return [...prev, payload.new]
    })
  }, [])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('games-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games' },
        handleUpdate
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'games' },
        handleInsert
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [handleUpdate, handleInsert])

  // Sync if parent pushes fresh initialGames (e.g. after navigation)
  useEffect(() => {
    setGames(initialGames)
  }, [initialGames])

  return { games, updatedId }
}

</file>

<file src="lib/supabase/client.ts">
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
</file>

<file src="lib/supabase/server.ts">
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types'

export async function createClient() {
  const cookieStore = await cookies()  // ← await IS needed in Next.js 15

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — safe to ignore
          }
        },
      },
    }
  )
}
</file>

<file src="lib/supabase/session.ts">
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /admin routes (except /admin/login itself)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // If logged-in user tries to hit /admin/login, check if they're admin
  // and redirect them straight to dashboard
  if (request.nextUrl.pathname.startsWith('/admin/login') && user) {
   const { data: profile } = await supabase
  .from('profiles')
  .select('is_admin')
  .eq('id', user.id)
  .single()

if ((profile as any)?.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
</file>

<file src="lib/utils.ts">
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGameTime(time: string | null): string {
  if (!time) return 'TBD'
  try {
    return format(new Date(time), 'h:mm a')
  } catch {
    return 'TBD'
  }
}

export function formatDate(time: string | null): string {
  if (!time) return ''
  try {
    return format(new Date(time), 'EEE, MMM d')
  } catch {
    return ''
  }
}

export function timeAgo(time: string): string {
  try {
    return formatDistanceToNow(new Date(time), { addSuffix: true })
  } catch {
    return ''
  }
}

export const FESTIVAL_START = new Date(
  process.env.NEXT_PUBLIC_FESTIVAL_START_DATE || '2026-03-10'
)

export const FESTIVAL_END = new Date(
  process.env.NEXT_PUBLIC_FESTIVAL_END_DATE || '2026-03-14'
)

export function getCurrentFestivalDay(): number {
  const now = new Date()
  const diffMs = now.getTime() - FESTIVAL_START.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
  return Math.max(1, Math.min(diffDays, 5))
}

export function getDaysUntilFestival(): number {
  const now = new Date()
  const diffMs = FESTIVAL_START.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

export function isFestivalActive(): boolean {
  const now = new Date()
  return now >= FESTIVAL_START && now <= FESTIVAL_END
}

export const CATEGORY_ICONS: Record<string, string> = {
  Cricket: '🏏',
  Football: '⚽',
  Basketball: '🏀',
  Volleyball: '🏐',
  Badminton: '🏸',
  'Table Tennis': '🏓',
  'Tug of War': '💪',
  Athletics: '🏃',
  Dance: '💃',
  Singing: '🎤',
  Drama: '🎭',
  Music: '🎵',
  Art: '🎨',
  Debate: '🎙️',
  Quiz: '🧠',
  Fashion: '👗',
}

export function getCategoryIcon(name: string): string {
  return CATEGORY_ICONS[name] || '🏆'
}

export const DAY_THEMES: Record<number, { label: string; color: string }> = {
  1: { label: 'Opening Ceremony', color: 'from-orange-500 to-red-600' },
  2: { label: 'Sports Fiesta', color: 'from-blue-500 to-cyan-600' },
  3: { label: 'Cultural Night', color: 'from-purple-500 to-pink-600' },
  4: { label: 'Grand Showdown', color: 'from-green-500 to-teal-600' },
  5: { label: 'Finals & Closing', color: 'from-yellow-500 to-orange-600' },
}

</file>

<file src="middleware.ts">
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/session'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder files (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

</file>

<file src="next.config.ts">
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  experimental: {
    typedRoutes: false,
  },
}

export default nextConfig

</file>

<file src="package.json">
{
  "name": "hostel-days",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.99.3",
    "canvas-confetti": "^1.9.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.38.0",
    "lucide-react": "^0.441.0",
    "next": "16.2.1",
    "ogl": "^1.0.11",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.6.1"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "@types/node": "^20.19.37",
    "@types/react": "^18.3.28",
    "@types/react-dom": "^18.3.7",
    "@types/canvas-confetti": "^1.9.0",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "eslint": "^8.57.1",
    "eslint-config-next": "16.2.1",
    "autoprefixer": "^10.4.27"
  }
}

</file>

<file src="postcss.config.js">
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

</file>

<file src="supabase/schema.sql">
-- ============================================================
-- HOSTEL DAYS 2026 — Complete Supabase SQL Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. ENABLE EXTENSIONS ────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ── 2. TABLES ───────────────────────────────────────────────

-- Profiles (mirrors auth.users, stores admin flag)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Categories (Cricket, Football, Dance, etc.)
create table if not exists public.categories (
  id serial primary key,
  name text unique not null,
  type text not null check (type in ('sports', 'cultural'))
);

-- Games / Matches (heart of real-time)
create table if not exists public.games (
  id serial primary key,
  day integer not null check (day between 1 and 5),
  start_time timestamptz,
  category_id integer references public.categories(id) on delete set null,
  event_name text not null,
  team_a text not null,
  team_b text not null,
  score_a integer not null default 0 check (score_a >= 0),
  score_b integer not null default 0 check (score_b >= 0),
  status text not null default 'upcoming'
    check (status in ('upcoming', 'live', 'completed')),
  winner text,
  created_at timestamptz not null default now()
);

-- Announcements (info page)
create table if not exists public.announcements (
  id serial primary key,
  title text,
  body text,
  created_at timestamptz not null default now()
);

-- Indexes for common query patterns
create index if not exists idx_games_day on public.games(day);
create index if not exists idx_games_status on public.games(status);
create index if not exists idx_games_category on public.games(category_id);
create index if not exists idx_games_day_status on public.games(day, status);


-- ── 3. ROW LEVEL SECURITY ───────────────────────────────────

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.games enable row level security;
alter table public.announcements enable row level security;


-- ── PROFILES policies ──────────────────────────────────────

-- Anyone can read profiles (needed for public leaderboards if added later)
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

-- Users can only insert/update their own profile
create policy "profiles_self_insert"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id);


-- ── CATEGORIES policies ────────────────────────────────────

-- Public read
create policy "categories_public_read"
  on public.categories for select
  using (true);

-- Only admins can mutate
create policy "categories_admin_write"
  on public.categories for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );


-- ── GAMES policies ─────────────────────────────────────────

-- Public can read all games (required for live scores page)
create policy "games_public_read"
  on public.games for select
  using (true);

-- Only admins can insert
create policy "games_admin_insert"
  on public.games for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Only admins can update
create policy "games_admin_update"
  on public.games for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Only admins can delete
create policy "games_admin_delete"
  on public.games for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );


-- ── ANNOUNCEMENTS policies ─────────────────────────────────

create policy "announcements_public_read"
  on public.announcements for select
  using (true);

create policy "announcements_admin_write"
  on public.announcements for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );


-- ── 4. AUTO-CREATE PROFILE TRIGGER ─────────────────────────

-- Automatically creates a profile row when a user signs up
-- Also grants admin if their email is in the allowed list
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  admin_emails text[] := array[
    'admin1@college.edu',
    'admin2@college.edu',
    'admin3@college.edu',
    'admin4@college.edu',
    'admin5@college.edu'
    -- ↑ Replace with your actual 5 admin email addresses
  ];
begin
  insert into public.profiles (id, full_name, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email = any(admin_emails)
  )
  on conflict (id) do update
    set is_admin = new.email = any(admin_emails);

  return new;
end;
$$;

-- Attach trigger to auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 5. ENABLE REALTIME ─────────────────────────────────────
-- Only enable on the games table to minimize bandwidth

-- Add games table to realtime publication
alter publication supabase_realtime add table public.games;

-- (Optional) also enable for announcements so info page updates live
alter publication supabase_realtime add table public.announcements;


-- ── 6. SEED: CATEGORIES ────────────────────────────────────

insert into public.categories (name, type) values
  ('Cricket',       'sports'),
  ('Football',      'sports'),
  ('Basketball',    'sports'),
  ('Volleyball',    'sports'),
  ('Badminton',     'sports'),
  ('Table Tennis',  'sports'),
  ('Tug of War',    'sports'),
  ('Athletics',     'sports'),
  ('Dance',         'cultural'),
  ('Singing',       'cultural'),
  ('Drama',         'cultural'),
  ('Music',         'cultural'),
  ('Art',           'cultural'),
  ('Debate',        'cultural'),
  ('Quiz',          'cultural'),
  ('Fashion',       'cultural')
on conflict (name) do nothing;


-- ── 7. SEED: GAMES (25 sample games across 5 days) ─────────

-- Helper: set FESTIVAL_START to your actual festival start date
-- All times are in IST (UTC+5:30), stored as UTC

do $$
declare
  festival_start date := '2026-03-10';  -- ← Change to your start date
  cricket_id int;
  football_id int;
  basketball_id int;
  volleyball_id int;
  badminton_id int;
  tt_id int;
  tug_id int;
  athletics_id int;
  dance_id int;
  singing_id int;
  drama_id int;
  music_id int;
  art_id int;
  debate_id int;
  quiz_id int;
  fashion_id int;
begin
  select id into cricket_id    from public.categories where name = 'Cricket';
  select id into football_id   from public.categories where name = 'Football';
  select id into basketball_id from public.categories where name = 'Basketball';
  select id into volleyball_id from public.categories where name = 'Volleyball';
  select id into badminton_id  from public.categories where name = 'Badminton';
  select id into tt_id         from public.categories where name = 'Table Tennis';
  select id into tug_id        from public.categories where name = 'Tug of War';
  select id into athletics_id  from public.categories where name = 'Athletics';
  select id into dance_id      from public.categories where name = 'Dance';
  select id into singing_id    from public.categories where name = 'Singing';
  select id into drama_id      from public.categories where name = 'Drama';
  select id into music_id      from public.categories where name = 'Music';
  select id into art_id        from public.categories where name = 'Art';
  select id into debate_id     from public.categories where name = 'Debate';
  select id into quiz_id       from public.categories where name = 'Quiz';
  select id into fashion_id    from public.categories where name = 'Fashion';

  -- DAY 1 — Opening Ceremony + warm-up games
  insert into public.games (day, start_time, category_id, event_name, team_a, team_b, score_a, score_b, status, winner) values
  (1, (festival_start + interval '9 hours 30 minutes')::timestamptz,  football_id,   'Football – Group A',    'Ashoka Block',  'Birla Block',  2, 1, 'completed', 'Ashoka Block'),
  (1, (festival_start + interval '11 hours 00 minutes')::timestamptz, basketball_id, 'Basketball – Pool A',   'CVR Hostel',    'LBS Hall',     45, 38, 'completed', 'CVR Hostel'),
  (1, (festival_start + interval '14 hours 00 minutes')::timestamptz, dance_id,      'Group Dance – Round 1', 'Kaveri Block',  'Godavari Block', 78, 82, 'completed', 'Godavari Block'),
  (1, (festival_start + interval '16 hours 00 minutes')::timestamptz, quiz_id,       'General Quiz – Round 1','Narmada Hall',  'Brahmaputra Block', 35, 28, 'completed', 'Narmada Hall'),
  (1, (festival_start + interval '18 hours 30 minutes')::timestamptz, singing_id,    'Solo Singing – Heat 1', 'Ravi Shankar',  'Priya Menon',  72, 68, 'completed', 'Ravi Shankar');

  -- DAY 2 — Sports Fiesta
  insert into public.games (day, start_time, category_id, event_name, team_a, team_b, score_a, score_b, status, winner) values
  (2, (festival_start + 1 + interval '8 hours 00 minutes')::timestamptz,  cricket_id,   'Cricket T10 – Group A',  'Ashoka Block',  'CVR Hostel',   67, 72, 'completed', 'CVR Hostel'),
  (2, (festival_start + 1 + interval '9 hours 30 minutes')::timestamptz,  volleyball_id,'Volleyball – Pool A',    'LBS Hall',      'Kaveri Block', 2,  1,  'completed', 'LBS Hall'),
  (2, (festival_start + 1 + interval '11 hours 00 minutes')::timestamptz, badminton_id, 'Badminton – Men Singles', 'Arjun Patel',   'Kunal Sharma', 2,  1,  'completed', 'Arjun Patel'),
  (2, (festival_start + 1 + interval '14 hours 00 minutes')::timestamptz, football_id,  'Football – Group B',     'Narmada Hall',  'Godavari Block',1,  1,  'completed', null),
  (2, (festival_start + 1 + interval '16 hours 00 minutes')::timestamptz, tug_id,       'Tug of War – Boys',      'Ashoka Block',  'Birla Block',  0,  0,  'upcoming',  null),
  (2, (festival_start + 1 + interval '17 hours 30 minutes')::timestamptz, athletics_id, '100m Sprint – Men',      'Rahul Singh',   'Aditya Kumar', 0,  0,  'upcoming',  null);

  -- DAY 3 — Cultural Night
  insert into public.games (day, start_time, category_id, event_name, team_a, team_b, score_a, score_b, status, winner) values
  (3, (festival_start + 2 + interval '10 hours 00 minutes')::timestamptz, art_id,       'Poster Making',          'Kaveri Block',  'Brahmaputra Block', 0, 0, 'upcoming', null),
  (3, (festival_start + 2 + interval '11 hours 30 minutes')::timestamptz, debate_id,    'Debate – Semi Final',    'CVR Hostel',    'LBS Hall',     0,  0,  'upcoming',  null),
  (3, (festival_start + 2 + interval '14 hours 00 minutes')::timestamptz, drama_id,     'One Act Play',           'Ashoka Block',  'Narmada Hall', 0,  0,  'upcoming',  null),
  (3, (festival_start + 2 + interval '16 hours 00 minutes')::timestamptz, music_id,     'Band Performance',       'The Acoustics', 'Bass Drop',    0,  0,  'upcoming',  null),
  (3, (festival_start + 2 + interval '18 hours 00 minutes')::timestamptz, fashion_id,   'Hostel Fashion Walk',    'Kaveri Block',  'Godavari Block', 0, 0,  'upcoming',  null),
  (3, (festival_start + 2 + interval '20 hours 00 minutes')::timestamptz, dance_id,     'Group Dance – Semi Final','Ashoka Block', 'CVR Hostel',   0,  0,  'upcoming',  null);

  -- DAY 4 — Grand Showdown
  insert into public.games (day, start_time, category_id, event_name, team_a, team_b, score_a, score_b, status, winner) values
  (4, (festival_start + 3 + interval '9 hours 00 minutes')::timestamptz,  cricket_id,   'Cricket T10 – Semi Final','CVR Hostel',   'LBS Hall',     0,  0,  'upcoming',  null),
  (4, (festival_start + 3 + interval '11 hours 00 minutes')::timestamptz, basketball_id,'Basketball – Semi Final', 'Ashoka Block', 'Narmada Hall', 0,  0,  'upcoming',  null),
  (4, (festival_start + 3 + interval '13 hours 00 minutes')::timestamptz, football_id,  'Football – Semi Final',  'Ashoka Block',  'LBS Hall',     0,  0,  'upcoming',  null),
  (4, (festival_start + 3 + interval '15 hours 30 minutes')::timestamptz, tt_id,        'TT – Men Doubles Final', 'Kaveri Block',  'CVR Hostel',   0,  0,  'upcoming',  null),
  (4, (festival_start + 3 + interval '17 hours 00 minutes')::timestamptz, singing_id,   'Solo Singing – Grand Final','Top 2 Teams','', 0,  0,  'upcoming',  null);

  -- DAY 5 — Finals & Closing
  insert into public.games (day, start_time, category_id, event_name, team_a, team_b, score_a, score_b, status, winner) values
  (5, (festival_start + 4 + interval '9 hours 30 minutes')::timestamptz,  cricket_id,   'Cricket T10 – FINAL',    'TBD',           'TBD',          0,  0,  'upcoming',  null),
  (5, (festival_start + 4 + interval '11 hours 00 minutes')::timestamptz, football_id,  'Football – FINAL',       'TBD',           'TBD',          0,  0,  'upcoming',  null),
  (5, (festival_start + 4 + interval '14 hours 00 minutes')::timestamptz, dance_id,     'Group Dance – GRAND FINAL','TBD',         'TBD',          0,  0,  'upcoming',  null),
  (5, (festival_start + 4 + interval '16 hours 30 minutes')::timestamptz, basketball_id,'Basketball – FINAL',     'TBD',           'TBD',          0,  0,  'upcoming',  null),
  (5, (festival_start + 4 + interval '19 hours 00 minutes')::timestamptz, drama_id,     'Overall Champions – Felicitation', 'All Hostels', '-', 0, 0, 'upcoming', null);

end $$;


-- ── 8. SEED: SAMPLE ANNOUNCEMENTS ──────────────────────────

insert into public.announcements (title, body) values
  ('Welcome to Hostel Days 2026! 🎉', 'The biggest inter-hostel festival is here. 5 days, 25+ events, one champion. May the best hostel win!'),
  ('Cricket & Football venues confirmed', 'All cricket matches will be held at Main Ground. Football matches shifted to the rear ground due to maintenance.'),
  ('Timetable Update – Day 2', 'Badminton Mixed Doubles added to Day 2 afternoon slot. Check the full schedule page.'),
  ('Registration Deadline Reminder', 'Last date for cultural event entries is tonight 10 PM. Contact coordinators immediately.');


-- ── 9. HELPER: Grant admin manually ────────────────────────
-- Run this after a user signs up to manually promote them:
--
-- update public.profiles
-- set is_admin = true
-- where id = (
--   select id from auth.users where email = 'admin@college.edu'
-- );


-- ── 10. VERIFY ──────────────────────────────────────────────
-- Run these to verify setup:
-- select count(*) from public.games;         -- should be 25
-- select count(*) from public.categories;    -- should be 16
-- select count(*) from public.announcements; -- should be 4
-- select * from public.games where status = 'completed' limit 5;

</file>

<file src="tailwind.config.ts">
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        night: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0d1117',
          950: '#010409',
        },
      },
      keyframes: {
        'score-flash': {
          '0%': { backgroundColor: 'transparent' },
          '30%': { backgroundColor: 'rgba(34,197,94,0.4)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'score-count': {
          '0%': { transform: 'scale(1.4)', color: '#22c55e' },
          '100%': { transform: 'scale(1)', color: 'inherit' },
        },
        'live-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'ticker-scroll': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'score-flash': 'score-flash 1.2s ease-out',
        'score-count': 'score-count 0.4s ease-out',
        'live-pulse': 'live-pulse 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'ticker-scroll': 'ticker-scroll 30s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config

</file>

<file src="tsconfig.json">
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "target": "ES2017"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

</file>

<file src="types/index.ts">
export type GameStatus = 'upcoming' | 'live' | 'completed'
export type CategoryType = 'sports' | 'cultural'

export interface Profile {
  id: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  type: CategoryType
}

export interface Game {
  id: number
  day: number
  start_time: string | null
  category_id: number | null
  event_name: string
  team_a: string
  team_b: string
  score_a: number
  score_b: number
  status: GameStatus
  winner: string | null
  created_at: string
  categories?: Category
}

export interface Announcement {
  id: number
  title: string | null
  body: string | null
  created_at: string
}

export interface GameWithCategory extends Game {
  categories: Category
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id'>
        Update: Partial<Omit<Category, 'id'>>
      }
      games: {
        Row: Game
        Insert: Omit<Game, 'id' | 'created_at'>
        Update: Partial<Omit<Game, 'id' | 'created_at'>>
      }
      announcements: {
        Row: Announcement
        Insert: Omit<Announcement, 'id' | 'created_at'>
        Update: Partial<Omit<Announcement, 'id' | 'created_at'>>
      }
    }
  }
}

</file>

<file src="vercel.json">
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "bun install",
  "regions": ["bom1"]
}

</file>

</codebase>
