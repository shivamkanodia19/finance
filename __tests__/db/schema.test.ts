import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getDb, closeDb } from '@/lib/db/client'
import { runMigrations } from '@/lib/db/schema'
import fs from 'fs'

const TEST_DB = './data/test.db'

beforeAll(() => {
  process.env.DATABASE_PATH = TEST_DB
  fs.mkdirSync('./data', { recursive: true })
})

afterAll(() => {
  closeDb()
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB)
})

describe('database schema', () => {
  it('runs migrations without error', () => {
    const db = getDb()
    expect(() => runMigrations(db)).not.toThrow()
  })

  it('creates all required tables', () => {
    const db = getDb()
    runMigrations(db)
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[]
    const names = tables.map(t => t.name)
    expect(names).toContain('coins')
    expect(names).toContain('alerts')
    expect(names).toContain('committee_outputs')
    expect(names).toContain('price_bars')
    expect(names).toContain('journal_entries')
  })

  it('inserts and retrieves a coin', () => {
    const db = getDb()
    runMigrations(db)
    db.prepare(`INSERT OR IGNORE INTO coins (symbol, name, tier, lane, category) VALUES (?, ?, ?, ?, ?)`).run('BTC', 'Bitcoin', 'A', 'research_beta', 'layer1')
    const coin = db.prepare('SELECT * FROM coins WHERE symbol = ?').get('BTC') as { symbol: string }
    expect(coin.symbol).toBe('BTC')
  })

  it('enforces tier constraint', () => {
    const db = getDb()
    runMigrations(db)
    expect(() => {
      db.prepare(`INSERT INTO coins (symbol, name, tier, lane, category) VALUES (?, ?, ?, ?, ?)`).run('BAD', 'Bad', 'Z', 'research_beta', 'test')
    }).toThrow()
  })
})
