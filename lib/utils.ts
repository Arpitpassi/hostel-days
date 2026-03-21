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
  process.env.NEXT_PUBLIC_FESTIVAL_START_DATE || '2025-03-10'
)

export const FESTIVAL_END = new Date(
  process.env.NEXT_PUBLIC_FESTIVAL_END_DATE || '2025-03-14'
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
