const BASE_URL = process.env.ALPACA_BASE_URL ?? 'https://data.alpaca.markets'
const API_KEY = process.env.ALPACA_API_KEY ?? ''
const API_SECRET = process.env.ALPACA_API_SECRET ?? ''

export async function alpacaFetch(path: string, params?: Record<string, string>): Promise<unknown> {
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v)
    }
  }
  const res = await fetch(url.toString(), {
    headers: {
      'APCA-API-KEY-ID': API_KEY,
      'APCA-API-SECRET-KEY': API_SECRET,
      'Accept': 'application/json',
    },
  })
  if (!res.ok) {
    throw new Error(`Alpaca API error ${res.status}: ${await res.text()}`)
  }
  return res.json()
}
