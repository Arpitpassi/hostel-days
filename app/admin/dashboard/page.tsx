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