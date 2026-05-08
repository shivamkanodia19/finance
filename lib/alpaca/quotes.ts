import { alpacaFetch } from './client'

export interface LiveQuote {
  symbol: string
  askPrice: number
  bidPrice: number
  spread: number
  spreadPct: number
  timestamp: string
}

export async function fetchLatestQuote(alpacaSymbol: string): Promise<LiveQuote | null> {
  try {
    const data = await alpacaFetch('/v1beta3/crypto/us/latest/quotes', {
      symbols: alpacaSymbol,
    }) as { quotes?: Record<string, { ap: number; bp: number; t: string }> }

    const quote = data.quotes?.[alpacaSymbol]
    if (!quote) return null
    const spread = quote.ap - quote.bp
    const mid = (quote.ap + quote.bp) / 2
    return {
      symbol: alpacaSymbol,
      askPrice: quote.ap,
      bidPrice: quote.bp,
      spread,
      spreadPct: mid > 0 ? spread / mid : 0,
      timestamp: quote.t,
    }
  } catch {
    return null
  }
}
