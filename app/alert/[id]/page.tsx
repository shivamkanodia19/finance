import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ResearchView } from '@/components/research/ResearchView'
import type { Alert } from '@/types'

async function getAlert(id: string): Promise<Alert | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/alert/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function AlertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const alert = await getAlert(id)
  if (!alert) notFound()

  return (
    <div>
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
          ← Feed
        </Link>
      </div>
      <ResearchView alert={alert} />
    </div>
  )
}
