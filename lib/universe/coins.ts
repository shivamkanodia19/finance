// lib/universe/coins.ts
export type CoinTier = 'A' | 'B' | 'C'
export type CoinLane = 'narrative_momentum' | 'research_beta'

export interface Coin {
  symbol: string
  name: string
  tier: CoinTier       // A = smart-exchange eligible, B = MM only, C = poor liquidity
  lane: CoinLane
  category: string
  alpacaSymbol: string // e.g. "BTC/USD"
}

export const COIN_UNIVERSE: Coin[] = [
  // Tier A
  { symbol: 'BTC',    name: 'Bitcoin',           tier: 'A', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'BTC/USD' },
  { symbol: 'ETH',    name: 'Ethereum',           tier: 'A', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'ETH/USD' },
  { symbol: 'SOL',    name: 'Solana',             tier: 'A', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'SOL/USD' },
  { symbol: 'XRP',    name: 'XRP',                tier: 'A', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'XRP/USD' },
  { symbol: 'DOGE',   name: 'Dogecoin',           tier: 'A', lane: 'narrative_momentum', category: 'meme',           alpacaSymbol: 'DOGE/USD' },
  { symbol: 'ADA',    name: 'Cardano',            tier: 'A', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'ADA/USD' },
  { symbol: 'AVAX',   name: 'Avalanche',          tier: 'A', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'AVAX/USD' },
  { symbol: 'LINK',   name: 'Chainlink',          tier: 'A', lane: 'research_beta',      category: 'infrastructure', alpacaSymbol: 'LINK/USD' },
  { symbol: 'DOT',    name: 'Polkadot',           tier: 'A', lane: 'research_beta',      category: 'layer0',         alpacaSymbol: 'DOT/USD' },
  { symbol: 'MATIC',  name: 'Polygon',            tier: 'A', lane: 'research_beta',      category: 'layer2',         alpacaSymbol: 'MATIC/USD' },
  { symbol: 'UNI',    name: 'Uniswap',            tier: 'A', lane: 'research_beta',      category: 'defi',           alpacaSymbol: 'UNI/USD' },
  { symbol: 'AAVE',   name: 'Aave',               tier: 'A', lane: 'research_beta',      category: 'defi',           alpacaSymbol: 'AAVE/USD' },
  { symbol: 'LTC',    name: 'Litecoin',           tier: 'A', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'LTC/USD' },
  { symbol: 'BCH',    name: 'Bitcoin Cash',       tier: 'A', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'BCH/USD' },
  { symbol: 'XLM',    name: 'Stellar',            tier: 'A', lane: 'research_beta',      category: 'payments',       alpacaSymbol: 'XLM/USD' },
  { symbol: 'ATOM',   name: 'Cosmos',             tier: 'A', lane: 'research_beta',      category: 'layer0',         alpacaSymbol: 'ATOM/USD' },
  { symbol: 'NEAR',   name: 'NEAR Protocol',      tier: 'A', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'NEAR/USD' },
  { symbol: 'FIL',    name: 'Filecoin',           tier: 'A', lane: 'research_beta',      category: 'infrastructure', alpacaSymbol: 'FIL/USD' },
  // Tier B
  { symbol: 'SHIB',   name: 'Shiba Inu',          tier: 'B', lane: 'narrative_momentum', category: 'meme',           alpacaSymbol: 'SHIB/USD' },
  { symbol: 'PEPE',   name: 'Pepe',               tier: 'B', lane: 'narrative_momentum', category: 'meme',           alpacaSymbol: 'PEPE/USD' },
  { symbol: 'WIF',    name: 'dogwifhat',           tier: 'B', lane: 'narrative_momentum', category: 'meme',           alpacaSymbol: 'WIF/USD' },
  { symbol: 'BONK',   name: 'Bonk',               tier: 'B', lane: 'narrative_momentum', category: 'meme',           alpacaSymbol: 'BONK/USD' },
  { symbol: 'APT',    name: 'Aptos',              tier: 'B', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'APT/USD' },
  { symbol: 'OP',     name: 'Optimism',           tier: 'B', lane: 'research_beta',      category: 'layer2',         alpacaSymbol: 'OP/USD' },
  { symbol: 'ARB',    name: 'Arbitrum',           tier: 'B', lane: 'research_beta',      category: 'layer2',         alpacaSymbol: 'ARB/USD' },
  { symbol: 'INJ',    name: 'Injective',          tier: 'B', lane: 'research_beta',      category: 'defi',           alpacaSymbol: 'INJ/USD' },
  { symbol: 'SUI',    name: 'Sui',                tier: 'B', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'SUI/USD' },
  { symbol: 'SEI',    name: 'Sei',                tier: 'B', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'SEI/USD' },
  { symbol: 'TIA',    name: 'Celestia',           tier: 'B', lane: 'research_beta',      category: 'infrastructure', alpacaSymbol: 'TIA/USD' },
  { symbol: 'RENDER', name: 'Render',             tier: 'B', lane: 'research_beta',      category: 'ai',             alpacaSymbol: 'RENDER/USD' },
  { symbol: 'FET',    name: 'Fetch.ai',           tier: 'B', lane: 'research_beta',      category: 'ai',             alpacaSymbol: 'FET/USD' },
  { symbol: 'AGIX',   name: 'SingularityNET',     tier: 'B', lane: 'research_beta',      category: 'ai',             alpacaSymbol: 'AGIX/USD' },
  { symbol: 'JUP',    name: 'Jupiter',            tier: 'B', lane: 'research_beta',      category: 'defi',           alpacaSymbol: 'JUP/USD' },
  { symbol: 'PYTH',   name: 'Pyth Network',       tier: 'B', lane: 'research_beta',      category: 'infrastructure', alpacaSymbol: 'PYTH/USD' },
  { symbol: 'FLOKI',  name: 'Floki',              tier: 'B', lane: 'narrative_momentum', category: 'meme',           alpacaSymbol: 'FLOKI/USD' },
  // Tier C
  { symbol: 'ETC',    name: 'Ethereum Classic',   tier: 'C', lane: 'research_beta',      category: 'layer1',         alpacaSymbol: 'ETC/USD' },
  { symbol: 'COMP',   name: 'Compound',           tier: 'C', lane: 'research_beta',      category: 'defi',           alpacaSymbol: 'COMP/USD' },
  { symbol: 'CRV',    name: 'Curve',              tier: 'C', lane: 'research_beta',      category: 'defi',           alpacaSymbol: 'CRV/USD' },
  { symbol: 'MKR',    name: 'Maker',              tier: 'C', lane: 'research_beta',      category: 'defi',           alpacaSymbol: 'MKR/USD' },
]

export function getTierA(): Coin[] { return COIN_UNIVERSE.filter(c => c.tier === 'A') }
export function getTierB(): Coin[] { return COIN_UNIVERSE.filter(c => c.tier === 'B') }
export function getTierC(): Coin[] { return COIN_UNIVERSE.filter(c => c.tier === 'C') }
export function getByLane(lane: CoinLane): Coin[] { return COIN_UNIVERSE.filter(c => c.lane === lane) }
export function getScanUniverse(): Coin[] { return COIN_UNIVERSE.filter(c => c.tier !== 'C') }
export function getCoinBySymbol(symbol: string): Coin | undefined { return COIN_UNIVERSE.find(c => c.symbol === symbol) }
