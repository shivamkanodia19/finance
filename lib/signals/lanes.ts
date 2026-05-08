import type { Coin } from '@/lib/universe/coins'
import type { BreakoutSignal } from './types'

export function computeLaneScore(coin: Coin, breakout: BreakoutSignal): number {
  if (coin.lane === 'narrative_momentum') {
    const volumeBonus = Math.min(0.2, (breakout.volumeRatio - 1) * 0.1)
    return 0.7 + volumeBonus
  }
  const volatilityPenalty = Math.min(0.3, breakout.atrPct * 5)
  return Math.max(0.5, 0.9 - volatilityPenalty)
}
