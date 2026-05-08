import { Badge } from '@/components/ui/badge'
import { DebateSection } from './DebateSection'
import type { Alert } from '@/types'

const STATUS_STYLES: Record<string, string> = {
  actionable: 'bg-emerald-500 text-white',
  watch: 'bg-amber-500 text-white',
  reject: 'bg-red-600 text-white',
}

export function ResearchView({ alert }: { alert: Alert }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{alert.symbol}</h1>
          <Badge className={STATUS_STYLES[alert.status] ?? 'bg-zinc-600'}>
            {alert.status.toUpperCase()}
          </Badge>
        </div>
        <p className="text-zinc-400 text-sm">{alert.name}</p>
      </div>

      {alert.thesisSummary && (
        <section>
          <h2 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Thesis</h2>
          <p className="text-zinc-200 text-sm leading-relaxed">{alert.thesisSummary}</p>
        </section>
      )}

      <section>
        <h2 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Trade Plan</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Suggested Size', value: alert.suggested_size != null ? `$${alert.suggested_size}` : '—' },
            { label: 'Hold Window', value: alert.hold_window },
            { label: 'Stop', value: alert.stop_price != null ? `$${alert.stop_price.toFixed(4)}` : '—', color: 'text-red-400' },
            { label: 'Target', value: alert.target_price != null ? `$${alert.target_price.toFixed(4)}` : '—', color: 'text-emerald-400' },
            { label: 'Liquidity', value: alert.liquidity_grade },
            { label: 'Execution', value: alert.route_grade },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-zinc-900 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-1">{label}</div>
              <div className={`text-sm font-medium ${color ?? 'text-white'}`}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {alert.mainBearObjection && (
        <section>
          <h2 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Main Risk</h2>
          <div className="border border-red-900 rounded-lg p-3">
            <p className="text-red-300 text-sm">{alert.mainBearObjection}</p>
          </div>
        </section>
      )}

      {alert.verdicts && alert.verdicts.length > 0 && (
        <section>
          <h2 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Committee Debate</h2>
          <DebateSection verdicts={alert.verdicts} />
        </section>
      )}
    </div>
  )
}
