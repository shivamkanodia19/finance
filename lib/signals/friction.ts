import type { CoinTier } from '@/lib/universe/coins'

export function computeFrictionScore(tier: CoinTier, spreadPct: number): number {
  const tierBase: Record<CoinTier, number> = { A: 0.8, B: 0.5, C: 0.2 }
  const base = tierBase[tier]
  const spreadPenalty = Math.min(0.4, spreadPct * 10)
  return Math.max(0, base - spreadPenalty)
}

export function frictionGrade(score: number): string {
  if (score >= 0.7) return 'Good'
  if (score >= 0.45) return 'Fair'
  return 'Poor'
}
