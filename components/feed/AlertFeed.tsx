'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCard } from './AlertCard'
import { FilterBar } from './FilterBar'
import type { Alert } from '@/types'

export function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [laneFilter, setLaneFilter] = useState('all')
  const router = useRouter()

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/alerts')
      const data = await res.json()
      setAlerts(Array.isArray(data) ? data : [])
    } catch {
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAlerts() }, [fetchAlerts])

  async function triggerScan() {
    setScanning(true)
    try {
      await fetch('/api/scan', { method: 'POST' })
      await fetchAlerts()
    } finally {
      setScanning(false)
    }
  }

  const filtered = alerts.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (laneFilter !== 'all' && a.lane !== laneFilter) return false
    return true
  })

  const actionableCount = alerts.filter(a => a.status === 'actionable').length

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-4 py-4 flex items-center justify-between border-b border-zinc-800">
        <div>
          <h1 className="text-lg font-bold">Signal Feed</h1>
          {actionableCount > 0 && (
            <p className="text-xs text-emerald-400">{actionableCount} actionable</p>
          )}
        </div>
        <button
          onClick={triggerScan}
          disabled={scanning}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
        >
          {scanning ? 'Scanning…' : 'Run Scan'}
        </button>
      </div>

      <FilterBar
        activeStatus={statusFilter}
        activeLane={laneFilter}
        onStatusChange={setStatusFilter}
        onLaneChange={setLaneFilter}
      />

      <div className="px-4 py-4 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-zinc-900 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-zinc-500 text-sm">No alerts match your filters.</p>
            <p className="text-zinc-600 text-xs mt-1">
              {alerts.length === 0 ? 'Run a scan to generate alerts.' : 'Try clearing filters.'}
            </p>
          </div>
        ) : (
          filtered.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onClick={() => router.push(`/alert/${alert.id}`)}
            />
          ))
        )}
      </div>
    </div>
  )
}
