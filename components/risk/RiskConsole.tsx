'use client'

import { getSleeveDefaults } from '@/lib/risk/engine'

export function RiskConsole() {
  const defaults = getSleeveDefaults()
  const deployed = 0
  const openPositions = 0
  const deployedPct = (deployed / defaults.sleeveTotal) * 100
  const available = defaults.sleeveTotal - deployed

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
        Risk Console
      </h1>

      {/* Sleeve usage */}
      <section className="bg-white border border-[#E8E8E3] rounded-xl p-4">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-[#717171] font-medium">Sleeve Usage</span>
          <span
            className="font-semibold text-[#1A1A1A]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ${deployed} / ${defaults.sleeveTotal}
          </span>
        </div>
        <div className="h-2.5 bg-[#F4F4F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00C805] rounded-full transition-all"
            style={{ width: `${Math.max(deployedPct, 0)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#717171] mt-2">
          <span>{deployedPct.toFixed(0)}% deployed</span>
          <span
            className="text-[#00C805] font-medium"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ${available} available
          </span>
        </div>
      </section>

      {/* Position stats */}
      <section>
        <div className="text-[10px] font-semibold text-[#717171] uppercase tracking-widest mb-3">Positions</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-[#E8E8E3] rounded-xl p-4">
            <div className="text-xs text-[#717171] mb-1.5">Open Positions</div>
            <div
              className="text-3xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {openPositions}
            </div>
            <div className="text-xs text-[#717171] mt-1">of {defaults.maxPositions} max</div>
          </div>
          <div className="bg-white border border-[#E8E8E3] rounded-xl p-4">
            <div className="text-xs text-[#717171] mb-1.5">Trade Status</div>
            <div className="text-sm font-semibold text-[#00C805]">Can Trade</div>
            <div className="text-xs text-[#717171] mt-1">All clear</div>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section>
        <div className="text-[10px] font-semibold text-[#717171] uppercase tracking-widest mb-3">Rules</div>
        <div className="bg-white border border-[#E8E8E3] rounded-xl divide-y divide-[#F4F4F0]">
          {[
            ['Min trade size', `$${defaults.minTrade}`],
            ['Max trade size', `$${defaults.maxTrade}`],
            ['Max positions', String(defaults.maxPositions)],
            ['No averaging down', 'Enforced'],
            ['Manual approval required', 'Enforced'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-[#717171]">{label}</span>
              <span
                className="text-sm font-medium text-[#1A1A1A]"
                style={value.startsWith('$') ? { fontFamily: "'JetBrains Mono', monospace" } : {}}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
