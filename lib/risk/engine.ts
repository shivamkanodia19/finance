import type { RiskSnapshot } from '@/types'

const SLEEVE_TOTAL = 150
const MAX_POSITIONS = 4
const MIN_TRADE = 10
const MAX_TRADE = 50
const MIN_SLEEVE_REMAINING = 15

export function computeRiskSnapshot(
  sleeveTotal: number,
  deployed: number,
  openPositions: number
): RiskSnapshot {
  const available = sleeveTotal - deployed

  if (openPositions >= MAX_POSITIONS) {
    return { sleeveTotal, deployed, available, openPositions, maxPositions: MAX_POSITIONS, canTrade: false, blockReason: `Max ${MAX_POSITIONS} concurrent positions reached` }
  }

  if (available < MIN_SLEEVE_REMAINING) {
    return { sleeveTotal, deployed, available, openPositions, maxPositions: MAX_POSITIONS, canTrade: false, blockReason: `sleeve cap: only $${available.toFixed(0)} remaining` }
  }

  return { sleeveTotal, deployed, available, openPositions, maxPositions: MAX_POSITIONS, canTrade: true, blockReason: null }
}

export function suggestPositionSize(
  sleeveTotal: number,
  deployed: number,
  confidence: number,
  frictionScore: number
): number {
  const available = sleeveTotal - deployed
  const cap = Math.min(available * 0.35, MAX_TRADE)
  const qualityFactor = confidence * 0.6 + frictionScore * 0.4
  const raw = MIN_TRADE + (cap - MIN_TRADE) * qualityFactor
  return Math.max(MIN_TRADE, Math.min(cap, Math.round(raw / 5) * 5))
}

export function getSleeveDefaults() {
  return { sleeveTotal: SLEEVE_TOTAL, maxPositions: MAX_POSITIONS, minTrade: MIN_TRADE, maxTrade: MAX_TRADE }
}
