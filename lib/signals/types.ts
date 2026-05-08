import type { Coin } from '@/lib/universe/coins'
import type { OHLCVBar } from '@/lib/alpaca/ohlcv'

export type SetupType =
  | 'breakout_continuation'
  | 'range_compression'
  | 'momentum_pullback'
  | 'no_setup'

export interface BreakoutSignal {
  symbol: string
  setupType: SetupType
  breakoutLevel: number
  currentClose: number
  highestHigh20: number
  highestHigh30: number
  atrPct: number
  volumeRatio: number
  score: number
}

export interface CandidateCoin {
  coin: Coin
  bars: OHLCVBar[]
  breakout: BreakoutSignal
  liquidityScore: number
  frictionScore: number
  laneScore: number
  totalScore: number
  regimeVeto: boolean
}
