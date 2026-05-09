import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Altcoin Hunter',
  description: 'Robinhood altcoin signal feed',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF7] text-[#1A1A1A] min-h-screen pb-16" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        {children}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E3] flex">
          <Link
            href="/"
            className="flex-1 py-3 text-center text-xs font-medium text-[#717171] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            Feed
          </Link>
          <Link
            href="/risk"
            className="flex-1 py-3 text-center text-xs font-medium text-[#717171] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            Risk
          </Link>
        </nav>
      </body>
    </html>
  )
}
