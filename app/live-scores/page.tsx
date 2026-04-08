import { createClient } from '@/lib/supabase/server'
import { LiveScoresClient } from './LiveScoresClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live Events',
  description: 'Real-time live events for all Hostel Days 2026 matches.',
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
