import { alpacaFetch } from './client'

export interface OHLCVBar {
  ts: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export async function fetchOHLCV(
  alpacaSymbol: string,
  timeframe: '1Day' | '1Hour' | '4Hour',
  limit: number
): Promise<OHLCVBar[]> {
  const end = new Date().toISOString()
  const start = new Date(Date.now() - limit * 24 * 60 * 60 * 1000).toISOString()

  const data = await alpacaFetch('/v1beta3/crypto/us/bars', {
    symbols: alpacaSymbol,
    timeframe,
    start,
    end,
    limit: String(limit),
    sort: 'asc',
  }) as { bars?: Record<string, Array<{ t: string; o: number; h: number; l: number; c: number; v: number }>> }

  const rawBars = data.bars?.[alpacaSymbol] ?? []
  return rawBars.map(b => ({ ts: b.t, open: b.o, high: b.h, low: b.l, close: b.c, volume: b.v }))
}
