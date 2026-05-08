import { describe, it, expect } from 'vitest'
import { computeRiskSnapshot, suggestPositionSize } from '@/lib/risk/engine'

describe('computeRiskSnapshot', () => {
  it('allows trading when sleeve is available', () => {
    const s = computeRiskSnapshot(150, 0, 0)
    expect(s.canTrade).toBe(true)
    expect(s.blockReason).toBeNull()
  })

  it('blocks when max positions reached', () => {
    const s = computeRiskSnapshot(150, 100, 4)
    expect(s.canTrade).toBe(false)
    expect(s.blockReason).toContain('positions')
  })

  it('blocks when sleeve is near full', () => {
    const s = computeRiskSnapshot(150, 140, 1)
    expect(s.canTrade).toBe(false)
    expect(s.blockReason).toContain('sleeve')
  })
})

describe('suggestPositionSize', () => {
  it('returns between $10 and $50', () => {
    const size = suggestPositionSize(150, 0, 0.8, 0.7)
    expect(size).toBeGreaterThanOrEqual(10)
    expect(size).toBeLessThanOrEqual(50)
  })

  it('returns smaller size for lower confidence', () => {
    const high = suggestPositionSize(150, 0, 0.9, 0.9)
    const low = suggestPositionSize(150, 0, 0.4, 0.4)
    expect(high).toBeGreaterThan(low)
  })
})
