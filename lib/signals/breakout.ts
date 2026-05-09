import type { OHLCVBar } from '@/lib/alpaca/ohlcv'
import type { BreakoutSignal, SetupType } from './types'

export function detectBreakout(symbol: string, bars: OHLCVBar[]): BreakoutSignal {
  const currentClose = bars.at(-1)?.close ?? 0

  if (bars.length < 30) {
    return { symbol, setupType: 'no_setup', breakoutLevel: 0, currentClose, highestHigh20: 0, highestHigh30: 0, atrPct: 0, volumeRatio: 0, score: 0 }
  }

  const recent = bars.slice(-30)
  const prior20 = bars.slice(-21, -1)
  const prior30 = bars.slice(-31, -1)

  const highestHigh20 = Math.max(...prior20.map(b => b.high))
  const highestHigh30 = Math.max(...(prior30.length > 0 ? prior30 : prior20).map(b => b.high))

  const atr = computeATR(recent, 14)
  const atrPct = currentClose > 0 ? atr / currentClose : 0

  const avgVolume = recent.slice(0, -1).reduce((sum, b) => sum + b.volume, 0) / (recent.length - 1)
  const lastVolume = bars.at(-1)?.volume ?? 0
  const volumeRatio = avgVolume > 0 ? lastVolume / avgVolume : 1

  // Absolute volume quality: log-scaled so higher volume meaningfully beats lower volume
  // log10(500K*112)=7.75, log10(3M*112)=8.52 → gives differentiated scores
  const volumeUsd = lastVolume * currentClose
  const logVol = volumeUsd > 0 ? Math.log10(volumeUsd) : 0
  const volumeQuality = Math.min(0.1, Math.max(0, (logVol - 5) / 50))

  let setupType: SetupType = 'no_setup'
  let score = 0

  if (currentClose > highestHigh20) {
    setupType = 'breakout_continuation'
    const breakoutStrength = (currentClose - highestHigh20) / highestHigh20
    score = Math.min(1, 0.4 + breakoutStrength * 2 + Math.min(0.3, (volumeRatio - 1) * 0.15) + volumeQuality)
  } else if (currentClose > highestHigh20 * 0.93) {
    setupType = 'range_compression'
    score = 0.3
  }

  return { symbol, setupType, breakoutLevel: highestHigh20, currentClose, highestHigh20, highestHigh30, atrPct, volumeRatio, score: Math.min(1, Math.max(0, score)) }
}

function computeATR(bars: OHLCVBar[], period: number): number {
  const trueRanges = bars.slice(1).map((bar, i) => {
    const prev = bars[i]
    return Math.max(bar.high - bar.low, Math.abs(bar.high - prev.close), Math.abs(bar.low - prev.close))
  })
  const relevant = trueRanges.slice(-period)
  return relevant.reduce((sum, tr) => sum + tr, 0) / relevant.length
}
