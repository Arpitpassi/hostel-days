import { createClient } from '@/lib/supabase/server'
import { LiveScoresClient } from './LiveScoresClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live Scores',
  description: 'Real-time live scores for all Hostel Days 2025 matches. Auto-updating scores with no refresh needed.',
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
