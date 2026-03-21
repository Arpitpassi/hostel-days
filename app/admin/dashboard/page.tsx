import { createClient } from '@/lib/supabase/server'
import { AdminDashboardClient } from './AdminDashboardClient'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/?error=unauthorized')

  const { data: games } = await supabase
    .from('games')
    .select('*, categories(id, name, type)')
    .order('day')
    .order('start_time')

  const { data: categories } = await supabase
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
