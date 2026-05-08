import { describe, it, expect, vi } from 'vitest'

const mockCreate = vi.hoisted(() =>
  vi.fn().mockResolvedValue({
    content: [{
      type: 'text',
      text: JSON.stringify({
        role: 'scout',
        summary: 'SOL showing strong momentum after breakout above $140.',
        keyPoints: ['High volume breakout', 'DeFi TVL growing', 'ETF speculation'],
        confidence: 0.72,
        recommendation: 'bullish',
      })
    }]
  })
)

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: function MockAnthropic() {
      return {
        messages: { create: mockCreate }
      }
    }
  }
})

import { runAgent } from '@/lib/committee/run-agent'
import type { CoinContext } from '@/lib/committee/types'

const mockCtx: CoinContext = {
  symbol: 'SOL', name: 'Solana', category: 'layer1', lane: 'research_beta',
  tier: 'A', currentPrice: 150, breakoutLevel: 140, volumeRatio: 2.1,
  atrPct: 0.04, liquidityScore: 0.85, frictionScore: 0.75, signalScore: 0.72,
}

describe('runAgent', () => {
  it('returns a parsed AgentVerdict', async () => {
    const verdict = await runAgent('scout', mockCtx, [])
    expect(verdict.role).toBe('scout')
    expect(verdict.summary).toBeTruthy()
    expect(verdict.confidence).toBeGreaterThanOrEqual(0)
    expect(verdict.confidence).toBeLessThanOrEqual(1)
    expect(verdict.keyPoints.length).toBeGreaterThan(0)
  })

  it('clamps confidence to 0-1', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify({ role: 'scout', summary: 'test', keyPoints: [], confidence: 5.0, recommendation: 'bullish' }) }]
    })
    const verdict = await runAgent('scout', mockCtx, [])
    expect(verdict.confidence).toBeLessThanOrEqual(1)
  })
})
