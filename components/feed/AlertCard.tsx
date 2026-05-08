'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Alert } from '@/types'

interface Props {
  alert: Alert
  onClick?: () => void
}

const STATUS_STYLES: Record<string, string> = {
  actionable: 'bg-emerald-500 text-white',
  watch: 'bg-amber-500 text-white',
  reject: 'bg-red-600 text-white',
}

const GRADE_STYLES: Record<string, string> = {
  Good: 'text-emerald-400',
  Fair: 'text-amber-400',
  Poor: 'text-red-400',
}

export function AlertCard({ alert, onClick }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-zinc-600 transition-colors"
      onClick={() => { setExpanded(!expanded); onClick?.() }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{alert.symbol}</span>
              <span className="text-sm text-zinc-400">{alert.name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Badge className={STATUS_STYLES[alert.status] ?? 'bg-zinc-600'}>
                {alert.status.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">
                {alert.lane === 'narrative_momentum' ? 'Narrative' : 'Research Beta'}
              </Badge>
              <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">
                {alert.setup_type.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-medium text-zinc-300">
              {(alert.confidence * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-zinc-500">confidence</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-zinc-300 mb-3 line-clamp-2">{alert.catalyst}</p>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-zinc-500">Liquidity</div>
            <div className={GRADE_STYLES[alert.liquidity_grade] ?? 'text-zinc-400'}>
              {alert.liquidity_grade}
            </div>
          </div>
          <div>
            <div className="text-zinc-500">Execution</div>
            <div className={GRADE_STYLES[alert.route_grade] ?? 'text-zinc-400'}>
              {alert.route_grade}
            </div>
          </div>
          <div>
            <div className="text-zinc-500">Hold</div>
            <div className="text-zinc-300">{alert.hold_window}</div>
          </div>
        </div>

        {expanded && (
          <>
            <Separator className="my-3 bg-zinc-800" />
            <div className="space-y-3 text-sm">
              {alert.thesisSummary && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider">Thesis</div>
                  <p className="text-zinc-300">{alert.thesisSummary}</p>
                </div>
              )}
              {alert.mainBearObjection && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1 uppercase tracking-wider">Main Risk</div>
                  <p className="text-zinc-400">{alert.mainBearObjection}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {alert.suggested_size != null && (
                  <div>
                    <div className="text-zinc-500">Size</div>
                    <div className="text-white font-medium">${alert.suggested_size}</div>
                  </div>
                )}
                {alert.stop_price != null && (
                  <div>
                    <div className="text-zinc-500">Stop</div>
                    <div className="text-red-400">${alert.stop_price.toFixed(4)}</div>
                  </div>
                )}
                {alert.target_price != null && (
                  <div>
                    <div className="text-zinc-500">Target</div>
                    <div className="text-emerald-400">${alert.target_price.toFixed(4)}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
