'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Trophy, Calendar, Star, Info, Zap, Moon, Sun, Shield } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Star },
  { href: '/live-scores', label: 'Live', icon: Zap },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/results', label: 'Results', icon: Trophy },
  { href: '/info', label: 'Info', icon: Info },
]

export function NavBar() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return null

  return (
    <>
      {/* ── Desktop Top Nav ── */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-14 items-center justify-between px-6">
        {/* Left — logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--accent)' }}
          >
            HD
          </span>
          <span className="font-display font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Hostel Days
            <span className="ml-1.5 text-xs font-body font-normal" style={{ color: 'var(--text-muted)' }}>
              2026
            </span>
          </span>
        </Link>

        {/* Centre — text-only nav links */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  active
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right — theme toggle + admin */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-secondary)]"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            <Shield size={13} />
            Admin
          </Link>
        </div>
      </header>

      {/* Desktop spacer */}
      <div className="hidden md:block h-14" />

      {/* ── Mobile Top Pill — theme toggle only ── */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all shadow-sm"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark'
            ? <><Sun size={13} /><span>Light</span></>
            : <><Moon size={13} /><span>Dark</span></>
          }
        </button>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 h-16 border-t"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border)',
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-h-[44px] justify-center',
                active
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-muted)]'
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
              {active && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}