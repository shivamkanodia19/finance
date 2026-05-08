import type { OHLCVBar } from '@/lib/alpaca/ohlcv'

export type RegimeState = 'bull' | 'bear' | 'neutral'

export function classifyRegime(btcBars: OHLCVBar[]): RegimeState {
  if (btcBars.length < 51) return 'neutral'
  const closes = btcBars.map(b => b.close)
  const price = closes.at(-1)!
  const ma20 = sma(closes.slice(-20))
  const ma50 = sma(closes.slice(-50))
  if (price > ma20 && ma20 > ma50) return 'bull'
  if (price < ma20 && ma20 < ma50) return 'bear'
  return 'neutral'
}

function sma(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length
}
