import { DebateSection } from './DebateSection'
import type { Alert } from '@/types'

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  actionable: { label: 'ACTIONABLE', bg: 'bg-[#E8FADF]', text: 'text-[#166534]', dot: 'bg-[#00C805]' },
  watch:      { label: 'WATCH',      bg: 'bg-[#FFFBEB]', text: 'text-[#92400E]', dot: 'bg-[#D97706]' },
  reject:     { label: 'REJECT',     bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]', dot: 'bg-[#DC2626]' },
}

export function ResearchView({ alert }: { alert: Alert }) {
  const status = STATUS_CONFIG[alert.status] ?? { label: alert.status.toUpperCase(), bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Hero */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {alert.symbol}
          </h1>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${status.bg} ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>
        <p className="text-[#717171] text-sm">{alert.name}</p>
      </div>

      {/* Thesis */}
      {alert.thesisSummary && (
        <section>
          <div className="text-[10px] font-semibold text-[#717171] uppercase tracking-widest mb-2">Thesis</div>
          <p className="text-[#1A1A1A] text-sm leading-relaxed">{alert.thesisSummary}</p>
        </section>
      )}

      {/* Trade Plan */}
      <section>
        <div className="text-[10px] font-semibold text-[#717171] uppercase tracking-widest mb-3">Trade Plan</div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Suggested Size', value: alert.suggested_size != null ? `$${alert.suggested_size}` : '—', mono: true },
            { label: 'Hold Window', value: alert.hold_window },
            { label: 'Stop', value: alert.stop_price != null ? `$${alert.stop_price.toFixed(4)}` : '—', color: 'text-[#DC2626]', mono: true },
            { label: 'Target', value: alert.target_price != null ? `$${alert.target_price.toFixed(4)}` : '—', color: 'text-[#00C805]', mono: true },
            { label: 'Liquidity', value: alert.liquidity_grade },
            { label: 'Execution', value: alert.route_grade },
          ].map(({ label, value, color, mono }) => (
            <div key={label} className="bg-white border border-[#E8E8E3] rounded-xl p-3">
              <div className="text-[10px] text-[#717171] mb-1">{label}</div>
              <div
                className={`text-sm font-semibold ${color ?? 'text-[#1A1A1A]'}`}
                style={mono ? { fontFamily: "'JetBrains Mono', monospace" } : {}}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Risk */}
      {alert.mainBearObjection && (
        <section>
          <div className="text-[10px] font-semibold text-[#717171] uppercase tracking-widest mb-2">Main Risk</div>
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3">
            <p className="text-sm text-[#7F1D1D] leading-relaxed">{alert.mainBearObjection}</p>
          </div>
        </section>
      )}

      {/* Committee Debate */}
      {alert.verdicts && alert.verdicts.length > 0 && (
        <section>
          <div className="text-[10px] font-semibold text-[#717171] uppercase tracking-widest mb-3">Committee Debate</div>
          <DebateSection verdicts={alert.verdicts} />
        </section>
      )}
    </div>
  )
}
