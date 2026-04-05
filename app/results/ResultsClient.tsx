'use client'

import { useState } from 'react'
import { Trophy, ChevronDown, ChevronUp, Medal } from 'lucide-react'
import { Game } from '@/types'
import { getCategoryIcon } from '@/lib/utils'

// ── Hardcoded leaderboard (update as standings change) ────────────────────────
const LEADERBOARD = [
  { pos: 1,  team: 'M.Tech & PhD',   points: 600 },
  { pos: 2,  team: 'Batch Of 2026',  points: 450 },
  { pos: 3,  team: 'Batch Of 2027',  points: 300 },
  { pos: 4,  team: 'Batch Of 2028',  points: 150 },
  { pos: 5,  team: 'Batch Of 2029',  points: 0   },
]

// ── Medal styles ──────────────────────────────────────────────────────────────
const MEDAL: Record<number, { bg: string; text: string; badge: string }> = {
  1: { bg: 'rgba(251,191,36,0.12)',  text: '#f59e0b', badge: '🥇' },
  2: { bg: 'rgba(156,163,175,0.10)', text: '#9ca3af', badge: '🥈' },
  3: { bg: 'rgba(180,120,60,0.10)',  text: '#b47a3c', badge: '🥉' },
}

// ── Round detection (for by-event section) ────────────────────────────────────
type RoundType = 'final' | 'semifinal' | 'other'
function detectRound(name: string): RoundType {
  const l = name.toLowerCase()
  if (l.includes('semi')) return 'semifinal'
  if (l.includes('final')) return 'final'
  return 'other'
}

const ROUND_STYLE: Record<RoundType, { bg: string; color: string; label: string }> = {
  final:     { bg: 'rgba(251,191,36,0.15)', color: '#f59e0b',           label: 'Final' },
  semifinal: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8',           label: 'Semi'  },
  other:     { bg: 'var(--bg-secondary)',    color: 'var(--text-muted)', label: 'Group' },
}

const POS_LABEL: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' }

// ── Leaderboard component ─────────────────────────────────────────────────────
function LeaderboardTable() {
  return (
    <div className="card overflow-hidden mb-8">
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
          Live · Day 1
        </span>
      </div>

      {/* Column labels */}
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
      {LEADERBOARD.map(entry => {
        const medal = MEDAL[entry.pos]
        return (
          <div
            key={entry.pos}
            className="grid items-center px-4 py-3.5 border-b last:border-0 transition-colors"
            style={{
              gridTemplateColumns: '2.5rem 1fr 5rem',
              borderColor: 'var(--border)',
              background: medal ? medal.bg : 'transparent',
            }}
          >
            {/* Position */}
            <div className="flex items-center">
              {medal ? (
                <span className="text-xl leading-none">{medal.badge}</span>
              ) : (
                <span
                  className="font-display font-bold text-base tabular-nums"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {entry.pos}
                </span>
              )}
            </div>

            {/* Team */}
            <p
              className="font-display font-bold text-sm"
              style={{ color: medal ? medal.text : 'var(--text-primary)' }}
            >
              {entry.team}
            </p>

            {/* Points */}
            <p
              className="font-display font-extrabold text-xl tabular-nums text-right"
              style={{ color: medal ? medal.text : 'var(--text-primary)' }}
            >
              {entry.points}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ── By-event section ──────────────────────────────────────────────────────────
interface CategoryGroup { categoryName: string; type: string; games: Game[] }

function groupByCategory(games: Game[]): CategoryGroup[] {
  const map: Record<string, CategoryGroup> = {}
  games.forEach(g => {
    const name = g.categories?.name ?? 'Other'
    const type = g.categories?.type ?? 'sports'
    if (!map[name]) map[name] = { categoryName: name, type, games: [] }
    map[name].games.push(g)
  })
  return Object.values(map).sort((a, b) => a.categoryName.localeCompare(b.categoryName))
}

function CulturalResult({ game }: { game: Game }) {
  const positions: [string, string | null][] = [
    ['🥇', game.pos_1], ['🥈', game.pos_2], ['🥉', game.pos_3], ['4th', game.pos_4],
  ]
  const set = positions.filter(([, v]) => v)
  if (set.length === 0) {
    return (
      <p className="px-4 py-3 text-xs italic" style={{ color: 'var(--text-muted)' }}>
        Positions not yet entered.
      </p>
    )
  }
  return (
    <div className="px-4 py-3 space-y-1.5">
      {set.map(([medal, team]) => (
        <div key={medal} className="flex items-center gap-3">
          <span className="text-base w-7 text-center">{medal}</span>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{team}</span>
        </div>
      ))}
    </div>
  )
}

function SportsResult({ game }: { game: Game }) {
  const winA = game.winner === game.team_a
  const winB = game.winner === game.team_b
  if (game.team_a === '-' || !game.team_a) return null
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <div className={`flex-1 flex items-center gap-1.5 min-w-0 ${winA ? '' : 'opacity-50'}`}>
        {winA && <Trophy size={11} className="text-yellow-400 shrink-0" />}
        <p className="font-semibold text-xs truncate" style={{ color: 'var(--text-primary)' }}>{game.team_a}</p>
        <span
          className="ml-auto font-display font-bold text-base tabular-nums shrink-0"
          style={{ color: winA ? 'var(--live-color)' : 'var(--text-secondary)' }}
        >
          {game.score_a}
        </span>
      </div>
      <span className="text-[10px] font-bold shrink-0" style={{ color: 'var(--border-strong)' }}>:</span>
      <div className={`flex-1 flex items-center gap-1.5 flex-row-reverse min-w-0 ${winB ? '' : 'opacity-50'}`}>
        {winB && <Trophy size={11} className="text-yellow-400 shrink-0" />}
        <p className="font-semibold text-xs truncate text-right" style={{ color: 'var(--text-primary)' }}>{game.team_b}</p>
        <span
          className="mr-auto font-display font-bold text-base tabular-nums shrink-0"
          style={{ color: winB ? 'var(--live-color)' : 'var(--text-secondary)' }}
        >
          {game.score_b}
        </span>
      </div>
    </div>
  )
}

function CategoryAccordion({ group }: { group: CategoryGroup }) {
  const [open, setOpen] = useState(false)
  const icon  = getCategoryIcon(group.categoryName)
  const first = group.games.find(g => g.pos_1 || g.winner)
  const topTeam = first?.pos_1 ?? first?.winner ?? null

  return (
    <div className="card overflow-hidden mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-secondary)]"
      >
        <span className="text-base w-7 text-center shrink-0">{icon}</span>

        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            {group.categoryName}
          </p>
          {topTeam && (
            <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: '#f59e0b' }}>
              <Trophy size={9} />{topTeam}
            </p>
          )}
        </div>

        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
          group.type === 'cultural' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
        }`}>
          {group.type}
        </span>

        <span className="text-xs tabular-nums shrink-0" style={{ color: 'var(--text-muted)' }}>
          {group.games.length}
        </span>

        <span style={{ color: 'var(--text-muted)' }}>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {open && (
        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
          {group.games.map(game => {
            const round = detectRound(game.event_name)
            const rs    = ROUND_STYLE[round]
            return (
              <div key={game.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div className="px-4 pt-2 pb-1 flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {game.event_type === 'sports' && (
                    <span
                      className="font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-[9px]"
                      style={{ background: rs.bg, color: rs.color }}
                    >
                      {rs.label}
                    </span>
                  )}
                  <span>{game.event_name}</span>
                </div>
                {game.event_type === 'cultural'
                  ? <CulturalResult game={game} />
                  : <SportsResult   game={game} />
                }
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
  const groups = groupByCategory(completed)

  return (
    <div className="px-4 sm:px-6 py-4 max-w-2xl mx-auto pb-10">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>
        Results
      </h1>
      <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        {completed.length} completed event{completed.length !== 1 ? 's' : ''}
      </p>

      {/* Always-visible hardcoded leaderboard */}
      <LeaderboardTable />

      {/* By-event accordion — only shown once events complete */}
      {completed.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Medal size={13} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              By Event
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {groups.map(group => (
            <CategoryAccordion key={group.categoryName} group={group} />
          ))}
        </>
      )}
    </div>
  )
}