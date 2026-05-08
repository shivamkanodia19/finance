import { describe, it, expect } from 'vitest'
import { COIN_UNIVERSE, getTierA, getTierB, getByLane, getScanUniverse } from '@/lib/universe/coins'

describe('coin universe', () => {
  it('has at least 30 coins', () => {
    expect(COIN_UNIVERSE.length).toBeGreaterThanOrEqual(30)
  })

  it('every coin has required fields', () => {
    for (const coin of COIN_UNIVERSE) {
      expect(coin.symbol).toBeTruthy()
      expect(coin.name).toBeTruthy()
      expect(['A', 'B', 'C']).toContain(coin.tier)
      expect(['narrative_momentum', 'research_beta']).toContain(coin.lane)
      expect(coin.category).toBeTruthy()
      expect(coin.alpacaSymbol).toMatch(/\/USD$/)
    }
  })

  it('BTC is Tier A', () => {
    expect(COIN_UNIVERSE.find(c => c.symbol === 'BTC')?.tier).toBe('A')
  })

  it('getTierA returns only Tier A coins', () => {
    const tierA = getTierA()
    expect(tierA.every(c => c.tier === 'A')).toBe(true)
    expect(tierA.length).toBeGreaterThan(0)
  })

  it('getByLane filters correctly', () => {
    const meme = getByLane('narrative_momentum')
    expect(meme.every(c => c.lane === 'narrative_momentum')).toBe(true)
  })

  it('getScanUniverse excludes Tier C', () => {
    expect(getScanUniverse().every(c => c.tier !== 'C')).toBe(true)
  })
})
