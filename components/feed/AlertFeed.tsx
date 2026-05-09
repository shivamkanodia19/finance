'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCard } from './AlertCard'
import { FilterBar } from './FilterBar'
import type { Alert } from '@/types'

interface ScanResult {
  ok: boolean
  scanned?: number
  regime?: string
  error?: string
}

export function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [laneFilter, setLaneFilter] = useState('all')
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch('/api/alerts')
        const data = await res.json()
        if (!cancelled) setAlerts(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setAlerts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [refreshKey])

  async function triggerScan() {
    setScanning(true)
    setScanResult(null)
    try {
      const res = await fetch('/api/scan', { method: 'POST' })
      const data = await res.json()
      setScanResult(data)
      if (res.ok) setRefreshKey(k => k + 1)
    } catch {
      setScanResult({ ok: false, error: 'Network error — scan failed' })
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
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-rh-border">
        <div>
          <h1 className="text-lg font-heading font-bold text-rh-text">Signal Feed</h1>
          {actionableCount > 0 && (
            <p className="text-xs text-rh-green font-medium">{actionableCount} actionable</p>
          )}
        </div>
        <button
          onClick={triggerScan}
          disabled={scanning}
          className="px-4 py-2 bg-rh-text text-white disabled:opacity-50 rounded-lg text-sm font-medium transition-all hover:bg-rh-text/80 cursor-pointer"
        >
          {scanning ? 'Scanning…' : 'Run Scan'}
        </button>
      </div>

      {/* Scan feedback banner */}
      {scanResult && (
        <div className={`px-4 py-2 text-xs border-b ${
          scanResult.ok
            ? 'bg-green-50 border-green-100 text-green-700'
            : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {scanResult.ok
            ? `Found ${scanResult.scanned} signal${scanResult.scanned !== 1 ? 's' : ''} · Market: ${scanResult.regime ?? '—'}`
            : `Scan failed: ${scanResult.error ?? 'unknown error'}`}
        </div>
      )}

      {scanResult?.ok && scanResult.scanned === 0 && (
        <div className="px-4 py-2 text-xs border-b bg-amber-50 border-amber-100 text-amber-700">
          No breakout setups detected. Market may be quiet — try again later.
        </div>
      )}

      <FilterBar
        activeStatus={statusFilter}
        activeLane={laneFilter}
        onStatusChange={setStatusFilter}
        onLaneChange={setLaneFilter}
      />

      <div className="px-4 py-4 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-rh-surface animate-pulse border border-rh-border" />
          ))
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-rh-muted text-sm">No alerts match your filters.</p>
            <p className="text-rh-muted/60 text-xs mt-1">
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
