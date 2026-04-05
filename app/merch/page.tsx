import type { Metadata } from 'next'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import merchImg from './merch.jpg'

export const metadata: Metadata = {
  title: 'Merch — Hostel Days 2026',
  description: 'Official Hostel Days 2026 merch collection.',
}

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

    </div>
  )
}