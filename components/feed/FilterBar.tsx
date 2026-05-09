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

const STATUS_ACTIVE: Record<string, string> = {
  all:        'bg-[#1A1A1A] text-white',
  actionable: 'bg-[#E8FADF] text-[#166534] ring-1 ring-[#00C805]/30',
  watch:      'bg-[#FFFBEB] text-[#92400E] ring-1 ring-[#D97706]/30',
  reject:     'bg-[#FEF2F2] text-[#991B1B] ring-1 ring-[#DC2626]/30',
}

export function FilterBar({ activeStatus, activeLane, onStatusChange, onLaneChange }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-[#FAFAF7]/95 backdrop-blur border-b border-[#E8E8E3] px-4 py-3">
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
              activeStatus === s
                ? (STATUS_ACTIVE[s] ?? 'bg-[#1A1A1A] text-white')
                : 'bg-[#F4F4F0] text-[#717171] hover:bg-[#E8E8E3] hover:text-[#1A1A1A]'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <div className="w-px bg-[#E8E8E3] mx-1 shrink-0" />
        {LANE_OPTIONS.map(l => (
          <button
            key={l}
            onClick={() => onLaneChange(l)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
              activeLane === l
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#F4F4F0] text-[#717171] hover:bg-[#E8E8E3] hover:text-[#1A1A1A]'
            }`}
          >
            {LANE_LABELS[l]}
          </button>
        ))}
      </div>
    </div>
  )
}
