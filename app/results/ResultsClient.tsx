'use client'

import { useState } from 'react'
import { Trophy, ChevronDown, ChevronUp, Medal } from 'lucide-react'
import { Game } from '@/types'
import { getCategoryIcon } from '@/lib/utils'

// ── Hardcoded leaderboard ─────────────────────────────────────────────────────
// Update these numbers manually as standings change
const LEADERBOARD = [
  { pos: 1,  team: 'M.Tech & PhD',   points: 600 },
  { pos: 2,  team: 'Batch Of 2026',  points: 450 },
  { pos: 3,  team: 'Batch Of 2027',  points: 300 },
  { pos: 4,  team: 'Batch Of 2028',  points: 150 },
  { pos: 5,  team: 'Batch Of 2029',  points: 0   },
]

// ── Image Data Extracted ──────────────────────────────────────────────────────
const SCANNED_RESULTS: Partial<Game>[] = [
  // 🏀 Basketball
  { id: 'bball-1', event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2027', score_a: '19', score_b: '29', winner: 'Batch Of 2027', categories: { name: 'Basketball', type: 'sports' } as any },

  // 🏓 Men's Table Tennis
  { id: 'mtt-1', event_name: 'League Match 1', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: '2', score_b: '0', winner: 'Batch Of 2027', categories: { name: 'Men\'s Table Tennis', type: 'sports' } as any },
  { id: 'mtt-2', event_name: 'League Match 2', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: '0', score_b: '2', winner: 'Batch Of 2028', categories: { name: 'Men\'s Table Tennis', type: 'sports' } as any },
  { id: 'mtt-3', event_name: 'League Match 3', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: '2', score_b: '0', winner: 'Batch Of 2027', categories: { name: 'Men\'s Table Tennis', type: 'sports' } as any },
  { id: 'mtt-4', event_name: 'League Match 4', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: '1', score_b: '2', winner: 'Batch Of 2028', categories: { name: 'Men\'s Table Tennis', type: 'sports' } as any },
  { id: 'mtt-5', event_name: 'League Match 5', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: '2', score_b: '1', winner: 'Batch Of 2027', categories: { name: 'Men\'s Table Tennis', type: 'sports' } as any },

  // 🏸 Badminton Mixed Doubles
  { id: 'bmd-1', event_name: 'League Match', team_a: 'Batch Of 2026', team_b: 'M.tech PhD', score_a: '2', score_b: '1', winner: 'Batch Of 2026', categories: { name: 'Badminton Mixed Doubles', type: 'sports' } as any },
  { id: 'bmd-2', event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'Batch Of 2028', score_a: '2', score_b: '0', winner: 'Batch Of 2027', categories: { name: 'Badminton Mixed Doubles', type: 'sports' } as any },
  { id: 'bmd-3', event_name: 'League Match', team_a: 'Batch Of 2026', team_b: 'Batch Of 2029', score_a: '1', score_b: '2', winner: 'Batch Of 2029', categories: { name: 'Badminton Mixed Doubles', type: 'sports' } as any },
  { id: 'bmd-4', event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'M.tech PhD', score_a: '2', score_b: '1', winner: 'Batch Of 2027', categories: { name: 'Badminton Mixed Doubles', type: 'sports' } as any },
  { id: 'bmd-5', event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'Batch Of 2028', score_a: '1', score_b: '2', winner: 'Batch Of 2028', categories: { name: 'Badminton Mixed Doubles', type: 'sports' } as any },

  // 🏓 Table Tennis Women's
  { id: 'wtt-1', event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'Batch Of 2026', score_a: '2', score_b: '0', winner: 'Batch Of 2027', categories: { name: 'Women\'s Table Tennis', type: 'sports' } as any },
  { id: 'wtt-2', event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'M.tech PhD', score_a: '2', score_b: '0', winner: 'Batch Of 2028', categories: { name: 'Women\'s Table Tennis', type: 'sports' } as any },
  { id: 'wtt-3', event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2027', score_a: '2', score_b: '0', winner: 'Batch Of 2028', categories: { name: 'Women\'s Table Tennis', type: 'sports' } as any },
  { id: 'wtt-4', event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2029', score_a: '2', score_b: '0', winner: 'Batch Of 2028', categories: { name: 'Women\'s Table Tennis', type: 'sports' } as any },
  { id: 'wtt-5', event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2026', score_a: '2', score_b: '0', winner: 'Batch Of 2028', categories: { name: 'Women\'s Table Tennis', type: 'sports' } as any },
  { id: 'wtt-6', event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'M.tech PhD', score_a: '2', score_b: '0', winner: 'Batch Of 2027', categories: { name: 'Women\'s Table Tennis', type: 'sports' } as any },
  { id: 'wtt-7', event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'M.tech PhD', score_a: '0', score_b: '2', winner: 'M.tech PhD', categories: { name: 'Women\'s Table Tennis', type: 'sports' } as any },
  { id: 'wtt-8', event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'Batch Of 2027', score_a: '2', score_b: '0', winner: 'Batch Of 2029', categories: { name: 'Women\'s Table Tennis', type: 'sports' } as any },
  { id: 'wtt-9', event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'Batch Of 2026', score_a: '2', score_b: '0', winner: 'Batch Of 2029', categories: { name: 'Women\'s Table Tennis', type: 'sports' } as any },
  { id: 'wtt-10', event_name: 'League Match', team_a: 'Batch Of 2026', team_b: 'M.tech PhD', score_a: '0', score_b: '2', winner: 'M.tech PhD', categories: { name: 'Women\'s Table Tennis', type: 'sports' } as any },

  // 🎯 Carrom
  { id: 'car-1', event_name: 'League Match', team_a: 'Batch Of 2026', team_b: 'M.tech PhD', score_a: '', score_b: '', winner: 'Batch Of 2026', categories: { name: 'Carrom', type: 'sports' } as any },
  { id: 'car-2', event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2027', score_a: '', score_b: '', winner: 'Batch Of 2028', categories: { name: 'Carrom', type: 'sports' } as any },
  { id: 'car-3', event_name: 'League Match', team_a: 'Batch Of 2026', team_b: 'Batch Of 2029', score_a: '', score_b: '', winner: 'Batch Of 2026', categories: { name: 'Carrom', type: 'sports' } as any },
  { id: 'car-4', event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'M.tech PhD', score_a: '', score_b: '', winner: 'Batch Of 2027', categories: { name: 'Carrom', type: 'sports' } as any },
  { id: 'car-5', event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2029', score_a: '', score_b: '', winner: 'Batch Of 2028', categories: { name: 'Carrom', type: 'sports' } as any },
  { id: 'car-6', event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'M.tech PhD', score_a: '', score_b: '', winner: 'M.tech PhD', categories: { name: 'Carrom', type: 'sports' } as any },
  { id: 'car-7', event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2026', score_a: '', score_b: '', winner: 'Batch Of 2026', categories: { name: 'Carrom', type: 'sports' } as any },
  { id: 'car-8', event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'Batch Of 2029', score_a: '', score_b: '', winner: 'Batch Of 2027', categories: { name: 'Carrom', type: 'sports' } as any },
  { id: 'car-9', event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'M.tech PhD', score_a: '', score_b: '', winner: 'M.tech PhD', categories: { name: 'Carrom', type: 'sports' } as any },
  { id: 'car-10', event_name: 'League Match', team_a: 'Batch Of 2027', team_b: 'Batch Of 2026', score_a: '', score_b: '', winner: 'Batch Of 2026', categories: { name: 'Carrom', type: 'sports' } as any },

  // 🏐 Volleyball
  { id: 'vol-1', event_name: 'League Match', team_a: 'Batch Of 2028', team_b: 'Batch Of 2026', score_a: '0', score_b: '2', winner: 'Batch Of 2026', categories: { name: 'Volleyball', type: 'sports' } as any },
  { id: 'vol-2', event_name: 'League Match', team_a: 'Batch Of 2029', team_b: 'M.tech PhD', score_a: '0', score_b: '2', winner: 'M.tech PhD', categories: { name: 'Volleyball', type: 'sports' } as any }
]

// ── Medal styles ──────────────────────────────────────────────────────────────
const MEDAL: Record<number, { bg: string; text: string; badge: string }> = {
  1: { bg: 'rgba(251,191,36,0.12)',  text: '#f59e0b', badge: '🥇' },
  2: { bg: 'rgba(156,163,175,0.10)', text: '#9ca3af', badge: '🥈' },
  3: { bg: 'rgba(180,120,60,0.10)',  text: '#b47a3c', badge: '🥉' },
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
  final:     { bg: 'rgba(251,191,36,0.15)',  color: '#f59e0b', label: 'Final'    },
  semifinal: { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8', label: 'Semi'     },
  league:    { bg: 'rgba(34,197,94,0.10)',   color: '#22c55e', label: 'League'   },
  other:     { bg: 'var(--bg-secondary)',    color: 'var(--text-muted)', label: 'Match' },
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
function LeaderboardTable() {
  return (
    <div className="card overflow-hidden mb-8">
      <div className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <Trophy size={14} style={{ color: 'var(--text-muted)' }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Overall Standings
        </span>
        <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          Live · Day 1
        </span>
      </div>

      <div className="grid px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wide border-b"
        style={{ gridTemplateColumns: '2.5rem 1fr 5rem', background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
        <span>Pos.</span>
        <span>Team</span>
        <span className="text-right">Points</span>
      </div>

      {LEADERBOARD.map(entry => {
        const medal = MEDAL[entry.pos]
        return (
          <div key={entry.pos}
            className="grid items-center px-4 py-3.5 border-b last:border-0"
            style={{ gridTemplateColumns: '2.5rem 1fr 5rem', borderColor: 'var(--border)', background: medal ? medal.bg : 'transparent' }}>
            <div className="flex items-center">
              {medal
                ? <span className="text-xl leading-none">{medal.badge}</span>
                : <span className="font-display font-bold text-base tabular-nums" style={{ color: 'var(--text-muted)' }}>{entry.pos}</span>}
            </div>
            <p className="font-display font-bold text-sm" style={{ color: medal ? medal.text : 'var(--text-primary)' }}>
              {entry.team}
            </p>
            <p className="font-display font-extrabold text-xl tabular-nums text-right" style={{ color: medal ? medal.text : 'var(--text-primary)' }}>
              {entry.points}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ── Individual match result rows ──────────────────────────────────────────────
function SportsResult({ game }: { game: Game }) {
  if (game.team_a === '-' || !game.team_a) return null
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
  const set = positions.filter(([, v]) => v)
  if (set.length === 0) return (
    <p className="px-4 py-2 text-xs italic" style={{ color: 'var(--text-muted)' }}>Positions not yet entered.</p>
  )
  return (
    <div className="px-4 py-2.5 space-y-1.5">
      {set.map(([medal, team]) => (
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
    // Finals first within sports, then alphabetical
    if (a.type !== b.type) return a.type === 'sports' ? -1 : 1
    return a.categoryName.localeCompare(b.categoryName)
  })
}

function CategoryAccordion({ group }: { group: CategoryGroup }) {
  const [open, setOpen] = useState(false)
  const icon = getCategoryIcon(group.categoryName)
  const isCultural = group.type === 'cultural'

  // Find the highest-priority result (final winner, or pos_1 for cultural)
  const finalGame = group.games.find(g => detectRound(g.event_name) === 'final')
    ?? group.games.find(g => g.winner || g.pos_1)
  const topResult = finalGame?.pos_1 ?? finalGame?.winner ?? null

  // Sort: finals first, then semis, then league/other
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

        {open ? <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />}
      </button>

      {open && (
        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
          {sortedGames.map((game, i) => {
            const round = detectRound(game.event_name)
            const rs    = ROUND_STYLE[round]
            return (
              <div key={game.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                {/* Match header */}
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
                {/* Result */}
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
  // Merge live Supabase data with the hardcoded scanned matches 
  const mergedCompleted = [...completed, ...SCANNED_RESULTS as Game[]]
  
  const groups = groupByCategory(mergedCompleted)
  const sportsGroups   = groups.filter(g => g.type === 'sports')
  const culturalGroups = groups.filter(g => g.type === 'cultural')

  return (
    <div className="px-4 sm:px-6 py-4 max-w-2xl mx-auto pb-10">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>
        Results
      </h1>
      <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        {mergedCompleted.length} completed event{mergedCompleted.length !== 1 ? 's' : ''}
      </p>

      {/* Hardcoded leaderboard */}
      <LeaderboardTable />

      {/* By-event accordion */}
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