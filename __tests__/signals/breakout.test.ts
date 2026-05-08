import { describe, it, expect } from 'vitest'
import { detectBreakout } from '@/lib/signals/breakout'
import type { OHLCVBar } from '@/lib/alpaca/ohlcv'

function makeBars(closes: number[], volumeMultiplier = 1): OHLCVBar[] {
  return closes.map((c, i) => ({
    ts: new Date(Date.now() - (closes.length - i) * 86400000).toISOString(),
    open: c * 0.99, high: c * 1.02, low: c * 0.97, close: c,
    volume: 1000000 * volumeMultiplier,
  }))
}

describe('detectBreakout', () => {
  it('returns no_setup when fewer than 30 bars', () => {
    const signal = detectBreakout('BTC', makeBars([100, 101, 102]))
    expect(signal.setupType).toBe('no_setup')
    expect(signal.score).toBe(0)
  })

  it('detects breakout_continuation when price exceeds 20-day high', () => {
    const closes = Array(29).fill(100).concat([115])
    const signal = detectBreakout('SOL', makeBars(closes, 2))
    expect(signal.setupType).toBe('breakout_continuation')
    expect(signal.score).toBeGreaterThan(0.5)
  })

  it('returns no_setup when price is below 20-day high', () => {
    const closes = Array(29).fill(100).concat([90])
    expect(detectBreakout('ETH', makeBars(closes)).setupType).toBe('no_setup')
  })

  it('score is higher with volume confirmation', () => {
    const closes = Array(29).fill(100).concat([112])
    const lowVol = detectBreakout('BTC', makeBars(closes, 0.5))
    const highVol = detectBreakout('BTC', makeBars(closes, 3))
    expect(highVol.score).toBeGreaterThan(lowVol.score)
  })
})
