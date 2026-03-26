import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { NavBar } from '@/components/NavBar'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    default: 'Hostel Days 2026 — College Cultural & Sports Festival',
    template: '%s | Hostel Days 2026',
  },
  description:
    'Live scores, schedules, and results for Hostel Days 2026 — the biggest inter-hostel cultural and sports festival. 5 days of fierce competition!',
  keywords: ['hostel days', 'college festival', 'live scores', 'sports', 'cultural'],
  openGraph: {
    title: 'Hostel Days 2026',
    description: 'Live scores & results for the biggest college fest',
    type: 'website',
  },
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Antic&family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap');
        `}</style>
      </head>
      <body className="overflow-x-hidden">
        <ThemeProvider>
          <NavBar />
          <main className="md:min-h-screen md:pb-0 pb-16">
            {children}
          </main>
        </ThemeProvider>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZVDTBRNJFH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZVDTBRNJFH');
          `}
        </Script>
      </body>
    </html>
  )
}