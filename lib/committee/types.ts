export type CommitteeStatus = 'actionable' | 'watch' | 'reject'

export type AgentRole =
  | 'scout'
  | 'researcher'
  | 'bull'
  | 'bear'
  | 'execution_analyst'
  | 'risk_manager'
  | 'judge'

export interface AgentVerdict {
  role: AgentRole
  summary: string
  keyPoints: string[]
  confidence: number
  recommendation: 'bullish' | 'bearish' | 'neutral' | 'final_verdict'
}

export interface CommitteeOutput {
  symbol: string
  status: CommitteeStatus
  thesisSummary: string
  mainCatalyst: string
  mainBearObjection: string
  executionNote: string
  riskNote: string
  suggestedSizeUsd: number
  holdWindow: string
  stopPrice: number | null
  targetPrice: number | null
  confidence: number
  disagreementScore: number
  verdicts: AgentVerdict[]
  createdAt: string
}

export interface CoinContext {
  symbol: string
  name: string
  category: string
  lane: string
  tier: string
  currentPrice: number
  breakoutLevel: number
  volumeRatio: number
  atrPct: number
  liquidityScore: number
  frictionScore: number
  signalScore: number
}
