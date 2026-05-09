'use client'

import { useState } from 'react'
import type { Alert } from '@/types'

interface Props {
  alert: Alert
  onClick?: () => void
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  actionable: { label: 'ACTIONABLE', bg: 'bg-[#E8FADF]', text: 'text-[#166534]', dot: 'bg-[#00C805]' },
  watch:      { label: 'WATCH',      bg: 'bg-[#FFFBEB]', text: 'text-[#92400E]', dot: 'bg-[#D97706]' },
  reject:     { label: 'REJECT',     bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]', dot: 'bg-[#DC2626]' },
}

const GRADE_COLORS: Record<string, string> = {
  Good: 'text-[#00C805]',
  Fair: 'text-[#D97706]',
  Poor: 'text-[#DC2626]',
}

export function AlertCard({ alert, onClick }: Props) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_CONFIG[alert.status] ?? { label: alert.status.toUpperCase(), bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' }

  return (
    <div
      className="bg-white border border-[#E8E8E3] rounded-xl cursor-pointer hover:border-[#1A1A1A]/30 hover:shadow-sm transition-all duration-200"
      onClick={() => { setExpanded(!expanded); onClick?.() }}
    >
      {/* Card header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-base font-bold tracking-tight"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {alert.symbol}
              </span>
              <span className="text-xs text-[#717171] truncate">{alert.name}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Status badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${status.bg} ${status.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F4F4F0] text-[#717171]">
                {alert.lane === 'narrative_momentum' ? 'Narrative' : 'Research Beta'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F4F4F0] text-[#717171]">
                {alert.setup_type.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div
              className="text-sm font-semibold text-[#1A1A1A]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {(alert.confidence * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-[#717171]">confidence</div>
          </div>
        </div>
      </div>

      {/* Catalyst */}
      <div className="px-4 pb-3">
        <p className="text-sm text-[#1A1A1A] leading-snug line-clamp-2">{alert.catalyst}</p>
      </div>

      {/* Metrics row */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-3 text-xs border-t border-[#F4F4F0] pt-3">
        <div>
          <div className="text-[#717171] mb-0.5">Liquidity</div>
          <div className={`font-medium ${GRADE_COLORS[alert.liquidity_grade] ?? 'text-[#1A1A1A]'}`}>
            {alert.liquidity_grade}
          </div>
        </div>
        <div>
          <div className="text-[#717171] mb-0.5">Execution</div>
          <div className={`font-medium ${GRADE_COLORS[alert.route_grade] ?? 'text-[#1A1A1A]'}`}>
            {alert.route_grade}
          </div>
        </div>
        <div>
          <div className="text-[#717171] mb-0.5">Hold</div>
          <div className="font-medium text-[#1A1A1A]">{alert.hold_window}</div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#E8E8E3] px-4 py-4 space-y-4">
          {alert.thesisSummary && (
            <div>
              <div className="text-[10px] font-semibold text-[#717171] uppercase tracking-widest mb-1.5">Thesis</div>
              <p className="text-sm text-[#1A1A1A] leading-relaxed">{alert.thesisSummary}</p>
            </div>
          )}
          {alert.mainBearObjection && (
            <div className="bg-[#FEF2F2] rounded-lg px-3 py-2.5">
              <div className="text-[10px] font-semibold text-[#991B1B] uppercase tracking-widest mb-1">Main Risk</div>
              <p className="text-sm text-[#7F1D1D]">{alert.mainBearObjection}</p>
            </div>
          )}
          <div className="grid grid-cols-3 gap-3 text-xs">
            {alert.suggested_size != null && (
              <div>
                <div className="text-[#717171] mb-0.5">Size</div>
                <div className="font-semibold text-[#1A1A1A]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  ${alert.suggested_size}
                </div>
              </div>
            )}
            {alert.stop_price != null && (
              <div>
                <div className="text-[#717171] mb-0.5">Stop</div>
                <div className="font-semibold text-[#DC2626]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  ${alert.stop_price.toFixed(4)}
                </div>
              </div>
            )}
            {alert.target_price != null && (
              <div>
                <div className="text-[#717171] mb-0.5">Target</div>
                <div className="font-semibold text-[#00C805]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  ${alert.target_price.toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
