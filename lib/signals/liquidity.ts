import type { OHLCVBar } from '@/lib/alpaca/ohlcv'

export function computeLiquidityScore(bars: OHLCVBar[], spreadPct: number): number {
  if (bars.length === 0) return 0
  const avgVolume = bars.reduce((sum, b) => sum + b.volume, 0) / bars.length
  const avgClose = bars.reduce((sum, b) => sum + b.close, 0) / bars.length
  const volumeUsd = avgVolume * avgClose
  const volumeScore = Math.min(1, volumeUsd / 1_000_000)
  const spreadScore = Math.max(0, 1 - spreadPct * 20)
  return volumeScore * 0.7 + spreadScore * 0.3
}
