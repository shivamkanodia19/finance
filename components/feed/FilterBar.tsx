'use client'

interface Props {
  activeStatus: string
  activeLane: string
  onStatusChange: (s: string) => void
  onLaneChange: (l: string) => void
}

const STATUS_OPTIONS = ['all', 'actionable', 'watch', 'reject']
const LANE_OPTIONS = ['all', 'narrative_momentum', 'research_beta']

const LANE_LABELS: Record<string, string> = {
  all: 'All Lanes',
  narrative_momentum: 'Narrative',
  research_beta: 'Research Beta',
}

export function FilterBar({ activeStatus, activeLane, onStatusChange, onLaneChange }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-black/90 backdrop-blur border-b border-zinc-800 px-4 py-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeStatus === s ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <div className="w-px bg-zinc-800 mx-1 shrink-0" />
        {LANE_OPTIONS.map(l => (
          <button
            key={l}
            onClick={() => onLaneChange(l)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeLane === l ? 'bg-zinc-200 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {LANE_LABELS[l]}
          </button>
        ))}
      </div>
    </div>
  )
}
