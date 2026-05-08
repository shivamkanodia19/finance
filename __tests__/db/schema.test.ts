import { describe, it, expect } from 'vitest'
import { SCHEMA_SQL } from '@/lib/db/schema'

describe('schema', () => {
  it('exports the schema SQL string', () => {
    expect(typeof SCHEMA_SQL).toBe('string')
    expect(SCHEMA_SQL).toContain('CREATE TABLE IF NOT EXISTS coins')
    expect(SCHEMA_SQL).toContain('CREATE TABLE IF NOT EXISTS alerts')
    expect(SCHEMA_SQL).toContain('CREATE TABLE IF NOT EXISTS committee_outputs')
  })
})
