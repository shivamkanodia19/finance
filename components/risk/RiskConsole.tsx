'use client'

import { getSleeveDefaults } from '@/lib/risk/engine'

export function RiskConsole() {
  const defaults = getSleeveDefaults()
  const deployed = 0
  const openPositions = 0
  const deployedPct = (deployed / defaults.sleeveTotal) * 100

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <h1 className="text-lg font-bold">Risk Console</h1>

      <section>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-zinc-400">Sleeve Usage</span>
          <span className="text-white">${deployed} / ${defaults.sleeveTotal}</span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${deployedPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>{deployedPct.toFixed(0)}% deployed</span>
          <span>${defaults.sleeveTotal - deployed} available</span>
        </div>
      </section>

      <section>
        <h2 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Positions</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="text-xs text-zinc-500 mb-1">Open Positions</div>
            <div className="text-2xl font-bold">{openPositions}</div>
            <div className="text-xs text-zinc-600">of {defaults.maxPositions} max</div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="text-xs text-zinc-500 mb-1">Trade Status</div>
            <div className="text-sm font-medium text-emerald-400">Can Trade</div>
            <div className="text-xs text-zinc-600 mt-1">All clear</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Rules</h2>
        <div className="bg-zinc-900 rounded-lg p-4 space-y-2 text-sm">
          {[
            ['Min trade size', `$${defaults.minTrade}`],
            ['Max trade size', `$${defaults.maxTrade}`],
            ['Max positions', String(defaults.maxPositions)],
            ['No averaging down', '✓'],
            ['Manual approval required', '✓'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-zinc-400">{label}</span>
              <span className="text-zinc-200">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
