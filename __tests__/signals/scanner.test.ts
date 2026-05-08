import { describe, it, expect, vi } from 'vitest'
import { runScan } from '@/lib/signals/scanner'

vi.mock('@/lib/alpaca/ohlcv', () => ({
  fetchOHLCV: vi.fn().mockImplementation(async () => {
    const closes = Array(34).fill(100).concat([115])
    return closes.map((c, i) => ({
      ts: new Date(i * 86400000).toISOString(),
      open: c * 0.99, high: c * 1.02, low: c * 0.97, close: c, volume: 500000,
    }))
  })
}))

vi.mock('@/lib/alpaca/quotes', () => ({
  fetchLatestQuote: vi.fn().mockResolvedValue({
    symbol: 'BTC/USD', askPrice: 115.05, bidPrice: 114.95,
    spread: 0.10, spreadPct: 0.00087, timestamp: new Date().toISOString(),
  })
}))

describe('runScan', () => {
  it('returns candidates sorted by totalScore descending', async () => {
    const results = await runScan('bull')
    expect(results.length).toBeGreaterThan(0)
    for (let i = 1; i < results.length; i++) {
      expect(results[i].totalScore).toBeLessThanOrEqual(results[i - 1].totalScore)
    }
  })

  it('applies regime veto in bear market for Tier B coins', async () => {
    const results = await runScan('bear')
    expect(results.every(r => r.coin.tier !== 'B')).toBe(true)
  })

  it('returns only coins with real setups', async () => {
    const results = await runScan('bull')
    expect(results.every(r => r.breakout.setupType !== 'no_setup')).toBe(true)
  })
})
