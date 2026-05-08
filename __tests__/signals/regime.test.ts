import { describe, it, expect } from 'vitest'
import { classifyRegime } from '@/lib/signals/regime'
import { computeLiquidityScore } from '@/lib/signals/liquidity'
import { computeFrictionScore } from '@/lib/signals/friction'
import type { OHLCVBar } from '@/lib/alpaca/ohlcv'

function makeBars(closes: number[]): OHLCVBar[] {
  return closes.map((c, i) => ({
    ts: new Date(i * 86400000).toISOString(),
    open: c * 0.99, high: c * 1.01, low: c * 0.98, close: c, volume: 1e9,
  }))
}

describe('classifyRegime', () => {
  it('returns bull when price above both MAs', () => {
    const closes = Array.from({ length: 55 }, (_, i) => 100 + i * 2)
    expect(classifyRegime(makeBars(closes))).toBe('bull')
  })

  it('returns bear when price below both MAs', () => {
    const closes = Array.from({ length: 55 }, (_, i) => 200 - i * 2)
    expect(classifyRegime(makeBars(closes))).toBe('bear')
  })

  it('returns neutral on insufficient data', () => {
    expect(classifyRegime(makeBars([100, 101, 102]))).toBe('neutral')
  })
})

describe('computeLiquidityScore', () => {
  it('returns high score for high volume', () => {
    expect(computeLiquidityScore(makeBars(Array(30).fill(100)), 0.001)).toBeGreaterThan(0.7)
  })

  it('returns low score for low volume coin', () => {
    const lowVolBars = Array(30).fill(0).map((_, i) => ({
      ts: new Date(i * 86400000).toISOString(),
      open: 0.0001, high: 0.00011, low: 0.00009, close: 0.0001, volume: 100,
    }))
    expect(computeLiquidityScore(lowVolBars, 0.05)).toBeLessThan(0.4)
  })
})

describe('computeFrictionScore', () => {
  it('Tier A has higher score than Tier B', () => {
    expect(computeFrictionScore('A', 0.001)).toBeGreaterThan(computeFrictionScore('B', 0.001))
  })

  it('Tier C gets low score', () => {
    expect(computeFrictionScore('C', 0.01)).toBeLessThan(0.4)
  })
})
