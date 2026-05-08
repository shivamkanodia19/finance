import { describe, it, expect, vi } from 'vitest'
import { fetchOHLCV } from '@/lib/alpaca/ohlcv'

vi.mock('@/lib/alpaca/client', () => ({
  alpacaFetch: vi.fn().mockResolvedValue({
    bars: {
      'BTC/USD': [
        { t: '2026-05-01T00:00:00Z', o: 60000, h: 61000, l: 59000, c: 60500, v: 1234.5 },
        { t: '2026-05-02T00:00:00Z', o: 60500, h: 62000, l: 60000, c: 61500, v: 987.2 },
      ]
    }
  })
}))

describe('fetchOHLCV', () => {
  it('returns normalized bars', async () => {
    const bars = await fetchOHLCV('BTC/USD', '1Day', 30)
    expect(bars).toHaveLength(2)
    expect(bars[0]).toMatchObject({ ts: '2026-05-01T00:00:00Z', open: 60000, high: 61000, low: 59000, close: 60500, volume: 1234.5 })
  })

  it('returns empty array when no bars', async () => {
    const { alpacaFetch } = await import('@/lib/alpaca/client')
    vi.mocked(alpacaFetch).mockResolvedValueOnce({ bars: {} })
    const bars = await fetchOHLCV('UNKNOWN/USD', '1Day', 30)
    expect(bars).toEqual([])
  })
})
