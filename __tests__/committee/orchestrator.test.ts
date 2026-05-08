import { describe, it, expect, vi } from 'vitest'
import { runCommittee } from '@/lib/committee/orchestrator'
import type { CoinContext } from '@/lib/committee/types'

const mockCtx: CoinContext = {
  symbol: 'SOL', name: 'Solana', category: 'layer1', lane: 'research_beta',
  tier: 'A', currentPrice: 150, breakoutLevel: 140, volumeRatio: 2.1,
  atrPct: 0.04, liquidityScore: 0.85, frictionScore: 0.75, signalScore: 0.72,
}

vi.mock('@/lib/committee/run-agent', () => ({
  runAgent: vi.fn().mockImplementation(async (role: string) => ({
    role,
    summary: `${role} analysis complete.`,
    keyPoints: ['Point 1', 'Point 2'],
    confidence: 0.7,
    recommendation: role === 'bear' ? 'bearish' : role === 'judge' ? 'final_verdict' : 'bullish',
    ...(role === 'judge' ? {
      status: 'watch',
      thesisSummary: 'SOL breaking out above key resistance.',
      mainCatalyst: 'Volume-confirmed breakout above 20-day high.',
      mainBearObjection: 'Market maker only — spread risk on Robinhood.',
      executionNote: 'Tier A, acceptable friction.',
      riskNote: 'High ATR — position sizing critical.',
      suggestedSizeUsd: 30,
      holdWindow: '3-5 days',
      stopPricePct: -0.08,
      targetPricePct: 0.20,
    } : {}),
  }))
}))

describe('runCommittee', () => {
  it('runs all 7 roles and returns CommitteeOutput', async () => {
    const output = await runCommittee(mockCtx)
    expect(output.symbol).toBe('SOL')
    expect(output.verdicts).toHaveLength(7)
    expect(['actionable', 'watch', 'reject']).toContain(output.status)
  })

  it('computes disagreement score between bull and bear', async () => {
    const output = await runCommittee(mockCtx)
    expect(output.disagreementScore).toBeGreaterThanOrEqual(0)
    expect(output.disagreementScore).toBeLessThanOrEqual(1)
  })

  it('uses judge status when present', async () => {
    const output = await runCommittee(mockCtx)
    expect(output.status).toBe('watch')
    expect(output.holdWindow).toBe('3-5 days')
    expect(output.suggestedSizeUsd).toBe(30)
  })

  it('computes stop and target prices from percentages', async () => {
    const output = await runCommittee(mockCtx)
    expect(output.stopPrice).toBeCloseTo(150 * 0.92, 1)
    expect(output.targetPrice).toBeCloseTo(150 * 1.20, 1)
  })
})
