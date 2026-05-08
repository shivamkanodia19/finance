export interface Alert {
  id: string
  symbol: string
  name: string
  status: 'actionable' | 'watch' | 'reject'
  lane: string
  setup_type: string
  catalyst: string
  confidence: number
  liquidity_grade: string
  route_grade: string
  hold_window: string
  suggested_size: number | null
  stop_price: number | null
  target_price: number | null
  signal_score: number
  created_at: string
  // Populated from joins
  thesisSummary?: string
  mainBearObjection?: string
  executionNote?: string
  riskNote?: string
  disagreementScore?: number
  verdicts?: Array<{ role: string; verdict: string; summary: string }>
}

export interface RiskSnapshot {
  sleeveTotal: number
  deployed: number
  available: number
  openPositions: number
  maxPositions: number
  canTrade: boolean
  blockReason: string | null
}
