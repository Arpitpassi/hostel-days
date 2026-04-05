import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { Game } from '@/types'
import ResultsClient from './ResultsClient'

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

  return <ResultsClient completed={completed} />
}