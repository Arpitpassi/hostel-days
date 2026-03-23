import type { Metadata } from 'next'
import Image from 'next/image'
import { ShoppingBag, ExternalLink } from 'lucide-react'
import merchImg from './merch.jpg'

export const metadata: Metadata = {
  title: 'Merch — Hostel Days 2026',
  description: 'Official Hostel Days 2026 merch collection. Order now using the link for your year.',
}

const YEAR_ORDERS = [
  { label: '1st Year', batch: 'Batch of 2029', url: 'https://forms.gle/eCn6zEinXqxr6ogQ8' },
  { label: '2nd Year', batch: 'Batch of 2028', url: 'https://forms.gle/ZAJ54dpBrYAqtUTCA' },
  { label: '3rd Year', batch: 'Batch of 2027', url: 'https://forms.gle/DspW4W7dJsvHxWeP8' },
  { label: '4th Year', batch: 'Batch of 2026', url: 'https://forms.gle/DSgk3z9241nZkdQs8' },
  { label: 'M.Tech',   batch: null,             url: 'https://forms.gle/MAAncpxnC5xv4eLA8' },
  { label: 'PhD',      batch: null,             url: 'https://forms.gle/K6wrXzXx3FkumfKp7' },
]

export default function MerchPage() {
  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-8">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          <ShoppingBag size={17} className="text-white" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
            Official Merch
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Hostel Days 2026 Collection
          </p>
        </div>
      </div>

      {/* Merch Image */}
      <div className="card overflow-hidden rounded-2xl">
        <Image
          src={merchImg}
          alt="Hostel Days 2026 official merch collection"
          className="w-full object-cover"
          placeholder="blur"
          priority
        />
      </div>

      {/* Description */}
      <div className="card px-5 py-4 space-y-1">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          We are pleased to introduce the <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>official Hostel Days merch collection</span>, thoughtfully designed to reflect the spirit, unity, and legacy of our campus.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          To ensure a smooth ordering process, please use the specific link assigned to your year.
        </p>
      </div>

      {/* Order Links */}
      <div>
        <h2
          className="section-header font-display font-bold text-sm uppercase tracking-wide mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          📍 Select Your Year to Order
        </h2>

        <div className="space-y-2">
          {YEAR_ORDERS.map(({ label, batch, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:border-[var(--border-strong)] active:scale-[0.99] group"
              style={{ textDecoration: 'none' }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </p>
                {batch && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {batch}
                  </p>
                )}
              </div>
              <div
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all group-hover:opacity-70"
                style={{ background: 'var(--border-strong)', color: '#ffffff' }}
              >
                Order
                <ExternalLink size={11} />
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}