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