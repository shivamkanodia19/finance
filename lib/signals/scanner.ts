import { getScanUniverse } from '@/lib/universe/coins'
import { fetchOHLCV } from '@/lib/alpaca/ohlcv'
import { fetchLatestQuote } from '@/lib/alpaca/quotes'
import { detectBreakout } from './breakout'
import { computeLiquidityScore } from './liquidity'
import { computeFrictionScore } from './friction'
import { computeLaneScore } from './lanes'
import type { CandidateCoin } from './types'
import type { RegimeState } from './regime'

export async function runScan(regime: RegimeState): Promise<CandidateCoin[]> {
  const coins = getScanUniverse()
  const candidates: CandidateCoin[] = []

  await Promise.allSettled(
    coins.map(async coin => {
      try {
        const [bars, quote] = await Promise.all([
          fetchOHLCV(coin.alpacaSymbol, '1Day', 35),
          fetchLatestQuote(coin.alpacaSymbol),
        ])

        const breakout = detectBreakout(coin.symbol, bars)
        if (breakout.setupType === 'no_setup') return

        const spreadPct = quote?.spreadPct ?? 0.005
        const liquidityScore = computeLiquidityScore(bars, spreadPct)
        const frictionScore = computeFrictionScore(coin.tier, spreadPct)
        const laneScore = computeLaneScore(coin, breakout)

        const regimeVeto = regime === 'bear' && coin.tier === 'B'
        const regimePenalty = regime === 'bear' ? 0.5 : regime === 'neutral' ? 0.85 : 1.0

        const totalScore = regimeVeto
          ? 0
          : breakout.score * 0.4 * regimePenalty +
            liquidityScore * 0.25 +
            frictionScore * 0.20 +
            laneScore * 0.15

        candidates.push({ coin, bars, breakout, liquidityScore, frictionScore, laneScore, totalScore, regimeVeto })
      } catch {
        // skip coins that fail data fetch
      }
    })
  )

  return candidates.filter(c => !c.regimeVeto).sort((a, b) => b.totalScore - a.totalScore)
}
