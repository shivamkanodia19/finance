import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Altcoin Hunter',
  description: 'Robinhood altcoin signal feed',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen pb-16`}>
        {children}
        <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 flex">
          <Link href="/" className="flex-1 py-3 text-center text-xs text-zinc-400 hover:text-white transition-colors">
            Feed
          </Link>
          <Link href="/risk" className="flex-1 py-3 text-center text-xs text-zinc-400 hover:text-white transition-colors">
            Risk
          </Link>
        </nav>
      </body>
    </html>
  )
}
