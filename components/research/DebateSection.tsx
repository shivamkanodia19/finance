interface Verdict {
  role: string
  verdict: string
  summary: string
}

const ROLE_LABELS: Record<string, string> = {
  scout: 'Scout', researcher: 'Researcher', bull: 'Bull', bear: 'Bear',
  execution_analyst: 'Execution', risk_manager: 'Risk', judge: 'Judge',
}

const ROLE_COLORS: Record<string, string> = {
  bull: 'text-emerald-400 border-emerald-900',
  bear: 'text-red-400 border-red-900',
  judge: 'text-white border-zinc-600',
  scout: 'text-blue-400 border-blue-900',
  researcher: 'text-purple-400 border-purple-900',
  execution_analyst: 'text-amber-400 border-amber-900',
  risk_manager: 'text-orange-400 border-orange-900',
}

export function DebateSection({ verdicts }: { verdicts: Verdict[] }) {
  return (
    <div className="space-y-3">
      {verdicts.map(v => (
        <div key={v.role} className={`border rounded-lg p-3 ${ROLE_COLORS[v.role] ?? 'text-zinc-400 border-zinc-800'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">{ROLE_LABELS[v.role] ?? v.role}</span>
            <span className="text-xs opacity-60 uppercase">{v.verdict}</span>
          </div>
          <p className="text-sm text-zinc-300">{v.summary}</p>
        </div>
      ))}
    </div>
  )
}
