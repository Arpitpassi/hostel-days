'use client'

import { useState, useEffect, useRef } from 'react'
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react'
import { Game } from '@/types'
import { getCategoryIcon } from '@/lib/utils'

// ── Hardcoded leaderboard ─────────────────────────────────────────────────────
const LEADERBOARD = [
  { pos: 1, team: 'Batch Of 2027', points: 1832.5 },
  { pos: 2, team: 'Batch Of 2026', points: 1817.5 },
  { pos: 3, team: 'Batch Of 2028', points: 1615   },
  { pos: 4, team: 'Batch Of 2029', points: 1540   },
  { pos: 5, team: 'M.Tech & PhD',  points: 745    },
]

// ── Scanned results ───────────────────────────────────────────────────────────
const SCANNED_RESULTS: Partial<Game>[] = [
  { id: 1001, event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2027', score_a: 19, score_b: 29, winner: 'Batch Of 2027', categories: { id: 0, name: 'Basketball', type: 'sports' } },
  { id: 1002, event_name: 'League Match 1', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: 2, score_b: 0, winner: 'Batch Of 2027', categories: { id: 0, name: "Men's Table Tennis", type: 'sports' } },
  { id: 1003, event_name: 'League Match 2', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: 0, score_b: 2, winner: 'Batch Of 2028', categories: { id: 0, name: "Men's Table Tennis", type: 'sports' } },
  { id: 1004, event_name: 'League Match 3', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: 2, score_b: 0, winner: 'Batch Of 2027', categories: { id: 0, name: "Men's Table Tennis", type: 'sports' } },
  { id: 1005, event_name: 'League Match 4', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: 1, score_b: 2, winner: 'Batch Of 2028', categories: { id: 0, name: "Men's Table Tennis", type: 'sports' } },
  { id: 1006, event_name: 'League Match 5', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: 2, score_b: 1, winner: 'Batch Of 2027', categories: { id: 0, name: "Men's Table Tennis", type: 'sports' } },
  { id: 1007, event_name: 'League Match', team_a: 'Batch Of 2026', team_b: 'M.tech PhD',    score_a: 2, score_b: 1, winner: 'Batch Of 2026', categories: { id: 0, name: 'Badminton Mixed Doubles', type: 'sports' } },
  { id: 1008, event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: 2, score_b: 0, winner: 'Batch Of 2027', categories: { id: 0, name: 'Badminton Mixed Doubles', type: 'sports' } },
  { id: 1009, event_name: 'League Match', team_a: 'Batch Of 2026', team_b: 'Batch Of 2029', score_a: 1, score_b: 2, winner: 'Batch Of 2029', categories: { id: 0, name: 'Badminton Mixed Doubles', type: 'sports' } },
  { id: 1010, event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'M.tech PhD',    score_a: 2, score_b: 1, winner: 'Batch Of 2027', categories: { id: 0, name: 'Badminton Mixed Doubles', type: 'sports' } },
  { id: 1011, event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'Batch Of 2028', score_a: 1, score_b: 2, winner: 'Batch Of 2028', categories: { id: 0, name: 'Badminton Mixed Doubles', type: 'sports' } },
  { id: 1012, event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'Batch Of 2026', score_a: 2, score_b: 0, winner: 'Batch Of 2027', categories: { id: 0, name: "Women's Table Tennis", type: 'sports' } },
  { id: 1013, event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'M.tech PhD',    score_a: 2, score_b: 0, winner: 'Batch Of 2028', categories: { id: 0, name: "Women's Table Tennis", type: 'sports' } },
  { id: 1014, event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2027', score_a: 2, score_b: 0, winner: 'Batch Of 2028', categories: { id: 0, name: "Women's Table Tennis", type: 'sports' } },
  { id: 1015, event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2029', score_a: 2, score_b: 0, winner: 'Batch Of 2028', categories: { id: 0, name: "Women's Table Tennis", type: 'sports' } },
  { id: 1016, event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2026', score_a: 2, score_b: 0, winner: 'Batch Of 2028', categories: { id: 0, name: "Women's Table Tennis", type: 'sports' } },
  { id: 1017, event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'M.tech PhD',    score_a: 2, score_b: 0, winner: 'Batch Of 2027', categories: { id: 0, name: "Women's Table Tennis", type: 'sports' } },
  { id: 1018, event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'M.tech PhD',    score_a: 0, score_b: 2, winner: 'M.tech PhD',    categories: { id: 0, name: "Women's Table Tennis", type: 'sports' } },
  { id: 1019, event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'Batch Of 2027', score_a: 2, score_b: 0, winner: 'Batch Of 2029', categories: { id: 0, name: "Women's Table Tennis", type: 'sports' } },
  { id: 1020, event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'Batch Of 2026', score_a: 2, score_b: 0, winner: 'Batch Of 2029', categories: { id: 0, name: "Women's Table Tennis", type: 'sports' } },
  { id: 1021, event_name: 'League Match', team_a: 'Batch Of 2026', team_b: 'M.tech PhD',    score_a: 0, score_b: 2, winner: 'M.tech PhD',    categories: { id: 0, name: "Women's Table Tennis", type: 'sports' } },
  { id: 1022, event_name: 'League Match', team_a: 'Batch Of 2026', team_b: 'M.tech PhD',    score_a: 0, score_b: 0, winner: 'Batch Of 2026', categories: { id: 0, name: 'Carrom', type: 'sports' } },
  { id: 1023, event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2027', score_a: 0, score_b: 0, winner: 'Batch Of 2028', categories: { id: 0, name: 'Carrom', type: 'sports' } },
  { id: 1024, event_name: 'League Match', team_a: 'Batch Of 2026', team_b: 'Batch Of 2029', score_a: 0, score_b: 0, winner: 'Batch Of 2026', categories: { id: 0, name: 'Carrom', type: 'sports' } },
  { id: 1025, event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'M.tech PhD',    score_a: 0, score_b: 0, winner: 'Batch Of 2027', categories: { id: 0, name: 'Carrom', type: 'sports' } },
  { id: 1026, event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2029', score_a: 0, score_b: 0, winner: 'Batch Of 2028', categories: { id: 0, name: 'Carrom', type: 'sports' } },
  { id: 1027, event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'M.tech PhD',    score_a: 0, score_b: 0, winner: 'M.tech PhD',    categories: { id: 0, name: 'Carrom', type: 'sports' } },
  { id: 1028, event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2026', score_a: 0, score_b: 0, winner: 'Batch Of 2026', categories: { id: 0, name: 'Carrom', type: 'sports' } },
  { id: 1029, event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'Batch Of 2029', score_a: 0, score_b: 0, winner: 'Batch Of 2027', categories: { id: 0, name: 'Carrom', type: 'sports' } },
  { id: 1030, event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'M.tech PhD',    score_a: 0, score_b: 0, winner: 'M.tech PhD',    categories: { id: 0, name: 'Carrom', type: 'sports' } },
  { id: 1031, event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'Batch Of 2026', score_a: 0, score_b: 0, winner: 'Batch Of 2026', categories: { id: 0, name: 'Carrom', type: 'sports' } },
  { id: 1032, event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2026', score_a: 0, score_b: 2, winner: 'Batch Of 2026', categories: { id: 0, name: 'Volleyball', type: 'sports' } },
  { id: 1033, event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'M.tech PhD',    score_a: 0, score_b: 2, winner: 'M.tech PhD',    categories: { id: 0, name: 'Volleyball', type: 'sports' } },
]

// ── Medal styles ──────────────────────────────────────────────────────────────
const MEDAL: Record<number, { bg: string; text: string; badge: string }> = {
  1: { bg: 'rgba(251,191,36,0.12)',  text: '#b45309', badge: '🥇' },
  2: { bg: 'rgba(156,163,175,0.10)', text: '#9ca3af', badge: '🥈' },
  3: { bg: 'rgba(180,120,60,0.10)',  text: '#b47a3c', badge: '🥉' },
}

const SCRAMBLE_CHARS = '0123456789'
const ROW_HEIGHT_PX  = 60

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface RowItem {
  teamIdx:     number
  team:        string
  points:      number
  finalSlot:   number
  currentSlot: number
  visible:     boolean
  scrambling:  boolean
  revealed:    boolean
  displayVal:  string
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
function LeaderboardTable() {
  const n = LEADERBOARD.length

  const makeInitialRows = (): RowItem[] => {
    const slots = shuffleArray(Array.from({ length: n }, (_, i) => i))
    return LEADERBOARD.map((entry, i) => ({
      teamIdx:     i,
      team:        entry.team,
      points:      entry.points,
      finalSlot:   entry.pos - 1,
      currentSlot: slots[i],
      visible:     false,
      scrambling:  false,
      revealed:    false,
      displayVal:  '—',
    }))
  }

  const [rows, setRows]           = useState<RowItem[]>(makeInitialRows)
  const [statusMsg, setStatusMsg] = useState('')
  const [phase, setPhase]         = useState<'entering' | 'sorting' | 'done'>('entering')
  const [replayKey, setReplayKey] = useState(0)

  const rafRefs = useRef<Record<number, number>>({})

  const updateRow = (teamIdx: number, patch: Partial<RowItem>) =>
    setRows(prev => prev.map(r => r.teamIdx === teamIdx ? { ...r, ...patch } : r))

  const startScramble = (teamIdx: number) => {
    const digits = String(Math.round(LEADERBOARD[teamIdx].points)).length || 1
    const tick = () => {
      let s = ''
      for (let j = 0; j < digits; j++)
        s += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      updateRow(teamIdx, { displayVal: s })
      rafRefs.current[teamIdx] = requestAnimationFrame(tick)
    }
    rafRefs.current[teamIdx] = requestAnimationFrame(tick)
  }

  const stopScramble = (teamIdx: number) => {
    if (rafRefs.current[teamIdx]) {
      cancelAnimationFrame(rafRefs.current[teamIdx])
      delete rafRefs.current[teamIdx]
    }
  }

  useEffect(() => {
    if (phase !== 'entering') return

    const entryOrder = shuffleArray(Array.from({ length: n }, (_, i) => i))
    const ENTRY_MSGS = ['First up…', 'And next…', 'Coming in…', 'Another one…', 'Last to arrive…']

    let step = 0
    const revealNext = () => {
      if (step >= n) {
        setStatusMsg('All teams in — tallying scores…')
        setTimeout(() => setPhase('sorting'), 1000)
        return
      }
      const teamIdx = entryOrder[step]
      setStatusMsg(ENTRY_MSGS[Math.min(step, ENTRY_MSGS.length - 1)])
      updateRow(teamIdx, { visible: true, scrambling: true, displayVal: '——' })
      startScramble(teamIdx)
      step++
      setTimeout(revealNext, 650)
    }

    const t = setTimeout(revealNext, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, replayKey])

  useEffect(() => {
    if (phase !== 'sorting') return

    const SORT_MSGS = [
      'Scores locked in…',
      'Shuffling the standings…',
      'Moving up!',
      'Sliding down…',
      'Locking final positions!',
    ]

    LEADERBOARD.forEach((entry, teamIdx) => {
      setTimeout(() => {
        stopScramble(teamIdx)
        setStatusMsg(SORT_MSGS[Math.min(teamIdx, SORT_MSGS.length - 1)])
        updateRow(teamIdx, {
          scrambling:  false,
          revealed:    true,
          displayVal:  String(entry.points),
          currentSlot: entry.pos - 1,
        })
      }, teamIdx * 150)
    })

    const settleDur = LEADERBOARD.length * 150 + 800
    const t = setTimeout(() => {
      setStatusMsg('Final standings!')
      setPhase('done')
    }, settleDur)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const replay = () => {
    Object.values(rafRefs.current).forEach(id => cancelAnimationFrame(id))
    rafRefs.current = {}
    setRows(makeInitialRows())
    setStatusMsg('')
    setPhase('entering')
    setReplayKey(k => k + 1)
  }

  return (
    <div className="mb-8">
      <div className="card overflow-hidden">

        {/* Header */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
        >
          <Trophy size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Overall Standings
          </span>
          <span
            className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            Live · Day 8
          </span>
        </div>

        {/* Column headers */}
        <div
          className="grid px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wide border-b"
          style={{
            gridTemplateColumns: '2.5rem 1fr 5rem',
            background: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
            borderColor: 'var(--border)',
          }}
        >
          <span>Pos.</span>
          <span>Team</span>
          <span className="text-right">Points</span>
        </div>

        {/* Rows */}
        <div className="relative" style={{ height: n * ROW_HEIGHT_PX }}>
          {rows.map(row => {
            const medal   = row.revealed ? MEDAL[row.finalSlot + 1] : undefined
            const yOffset = row.currentSlot * ROW_HEIGHT_PX

            return (
              <div
                key={row.team}
                className="absolute w-full grid items-center px-4 border-b last:border-0"
                style={{
                  gridTemplateColumns: '2.5rem 1fr 5rem',
                  height: ROW_HEIGHT_PX,
                  top: 0,
                  borderColor: 'var(--border)',
                  background: medal ? medal.bg : 'transparent',
                  opacity: row.visible ? 1 : 0,
                  transform: `translateY(${yOffset}px)`,
                  // ── ANIMATION CHANGE: smoother ease-in-out, no bounce ──
                  transition: row.visible
                    ? 'transform 0.8s cubic-bezier(0.65,0,0.35,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1), background 0.6s ease'
                    : 'opacity 0.3s ease',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Position badge */}
                <div className="flex items-center">
                  {medal ? (
                    <span className="text-xl leading-none">{medal.badge}</span>
                  ) : (
                    <span
                      className="font-display font-bold text-base tabular-nums"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {row.currentSlot + 1}
                    </span>
                  )}
                </div>

                {/* Team name */}
                <p
                  className="font-display font-bold text-sm"
                  style={{ color: medal ? medal.text : 'var(--text-primary)' }}
                >
                  {row.team}
                </p>

                {/* Points */}
                <p
                  className="font-display font-extrabold text-xl tabular-nums text-right"
                  style={{
                    color: row.revealed
                      ? medal ? medal.text : 'var(--text-primary)'
                      : 'var(--text-muted)',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.01em',
                    // ── ANIMATION CHANGE: smoother color transition ──
                    transition: 'color 0.5s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  {row.visible ? row.displayVal : '—'}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status + replay */}
      <div className="mt-2 flex items-center justify-between px-1">
        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {statusMsg}
        </p>
        {phase === 'done' && (
          <button
            onClick={replay}
            className="text-[11px] px-3 py-1 rounded-full border transition-colors hover:bg-[var(--bg-secondary)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            Replay
          </button>
        )}
      </div>
    </div>
  )
}

// ── Round label detection ─────────────────────────────────────────────────────
type RoundType = 'final' | 'semifinal' | 'league' | 'other'

function detectRound(name: string): RoundType {
  const l = name.toLowerCase()
  if (l.includes('final') && !l.includes('semi')) return 'final'
  if (l.includes('semi'))   return 'semifinal'
  if (l.includes('league') || l.includes('group') || l.includes('pool')) return 'league'
  return 'other'
}

const ROUND_STYLE: Record<RoundType, { bg: string; color: string; label: string }> = {
  final:     { bg: 'rgba(251,191,36,0.15)',  color: '#f59e0b', label: 'Final'  },
  semifinal: { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8', label: 'Semi'   },
  league:    { bg: 'rgba(34,197,94,0.10)',   color: '#22c55e', label: 'League' },
  other:     { bg: 'var(--bg-secondary)',    color: 'var(--text-muted)', label: 'Match' },
}

// ── Match result rows ─────────────────────────────────────────────────────────
function SportsResult({ game }: { game: Game }) {
  if (!game.team_a || game.team_a === '-') return null
  const winA = game.winner === game.team_a
  const winB = game.winner === game.team_b
  return (
    <div className="flex items-center gap-3 py-2.5 px-4">
      <div className={`flex-1 flex items-center gap-1.5 min-w-0 ${winA ? '' : 'opacity-50'}`}>
        {winA && <Trophy size={11} className="text-yellow-400 shrink-0" />}
        <p className="font-semibold text-xs truncate" style={{ color: 'var(--text-primary)' }}>{game.team_a}</p>
        <span className="ml-auto font-display font-bold text-base tabular-nums shrink-0"
          style={{ color: winA ? 'var(--live-color)' : 'var(--text-secondary)' }}>
          {game.score_a}
        </span>
      </div>
      <span className="text-[10px] font-bold shrink-0" style={{ color: 'var(--border-strong)' }}>:</span>
      <div className={`flex-1 flex items-center gap-1.5 flex-row-reverse min-w-0 ${winB ? '' : 'opacity-50'}`}>
        {winB && <Trophy size={11} className="text-yellow-400 shrink-0" />}
        <p className="font-semibold text-xs truncate text-right" style={{ color: 'var(--text-primary)' }}>{game.team_b}</p>
        <span className="mr-auto font-display font-bold text-base tabular-nums shrink-0"
          style={{ color: winB ? 'var(--live-color)' : 'var(--text-secondary)' }}>
          {game.score_b}
        </span>
      </div>
    </div>
  )
}

function CulturalResult({ game }: { game: Game }) {
  const positions: [string, string | null][] = [
    ['🥇', game.pos_1], ['🥈', game.pos_2], ['🥉', game.pos_3], ['4th', game.pos_4],
  ]
  const filled = positions.filter(([, v]) => v)
  if (filled.length === 0) return (
    <p className="px-4 py-2 text-xs italic" style={{ color: 'var(--text-muted)' }}>Positions not yet entered.</p>
  )
  return (
    <div className="px-4 py-2.5 space-y-1.5">
      {filled.map(([medal, team]) => (
        <div key={medal} className="flex items-center gap-2.5">
          <span className="text-base w-7 text-center">{medal}</span>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{team}</span>
        </div>
      ))}
    </div>
  )
}

// ── Category Accordion ────────────────────────────────────────────────────────
interface CategoryGroup { categoryName: string; type: string; games: Game[] }

function groupByCategory(games: Game[]): CategoryGroup[] {
  const map: Record<string, CategoryGroup> = {}
  games.forEach(g => {
    const name = g.categories?.name ?? 'Other'
    const type = g.categories?.type ?? 'sports'
    if (!map[name]) map[name] = { categoryName: name, type, games: [] }
    map[name].games.push(g)
  })
  return Object.values(map).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'sports' ? -1 : 1
    return a.categoryName.localeCompare(b.categoryName)
  })
}

function CategoryAccordion({ group }: { group: CategoryGroup }) {
  const [open, setOpen] = useState(false)
  const icon = getCategoryIcon(group.categoryName)
  const isCultural = group.type === 'cultural'

  const finalGame = group.games.find(g => detectRound(g.event_name) === 'final')
    ?? group.games.find(g => g.winner || g.pos_1)
  const topResult = finalGame?.pos_1 ?? finalGame?.winner ?? null

  const sortedGames = [...group.games].sort((a, b) => {
    const order: Record<RoundType, number> = { final: 0, semifinal: 1, league: 2, other: 3 }
    return order[detectRound(a.event_name)] - order[detectRound(b.event_name)]
  })

  return (
    <div className="card overflow-hidden mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--bg-secondary)]"
      >
        <span className="text-lg w-7 text-center shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
            {group.categoryName}
          </p>
          {topResult ? (
            <p className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: '#f59e0b' }}>
              <Trophy size={9} /> {topResult}
            </p>
          ) : (
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {group.games.length} match{group.games.length > 1 ? 'es' : ''}
            </p>
          )}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 mr-1 ${
          isCultural ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
        }`}>
          {group.type}
        </span>
        {open
          ? <ChevronUp   size={15} style={{ color: 'var(--text-muted)' }} />
          : <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />}
      </button>

      {open && (
        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
          {sortedGames.map(game => {
            const round = detectRound(game.event_name)
            const rs    = ROUND_STYLE[round]
            return (
              <div key={game.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div className="px-4 pt-2.5 pb-1 flex items-center gap-2">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: rs.bg, color: rs.color }}
                  >
                    {rs.label}
                  </span>
                  <span className="text-[11px] font-medium truncate" style={{ color: 'var(--text-muted)' }}>
                    {game.event_name}
                  </span>
                  {game.day && (
                    <span className="ml-auto text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>D{game.day}</span>
                  )}
                </div>
                {isCultural
                  ? <CulturalResult game={game} />
                  : <SportsResult   game={game} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Page root ─────────────────────────────────────────────────────────────────
interface Props { completed: Game[] }

export default function ResultsClient({ completed }: Props) {
  const mergedCompleted = [...completed, ...SCANNED_RESULTS as Game[]]
  const groups          = groupByCategory(mergedCompleted)
  const sportsGroups    = groups.filter(g => g.type === 'sports')
  const culturalGroups  = groups.filter(g => g.type === 'cultural')

  return (
    <div className="px-4 sm:px-6 py-4 max-w-2xl mx-auto pb-10">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>
        Results
      </h1>
      <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        {mergedCompleted.length} completed event{mergedCompleted.length !== 1 ? 's' : ''}
      </p>

      <LeaderboardTable />

      {mergedCompleted.length > 0 && (
        <>
          {sportsGroups.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">⚽</span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Sports</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
              {sportsGroups.map(group => (
                <CategoryAccordion key={group.categoryName} group={group} />
              ))}
            </div>
          )}

          {culturalGroups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">🎭</span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Cultural</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
              {culturalGroups.map(group => (
                <CategoryAccordion key={group.categoryName} group={group} />
              ))}
            </div>
          )}
        </>
      )}

      {mergedCompleted.length === 0 && (
        <div className="card p-10 text-center mt-4">
          <p className="text-3xl mb-2">🏆</p>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>No results yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Results will appear here as events complete</p>
        </div>
      )}
    </div>
  )
}