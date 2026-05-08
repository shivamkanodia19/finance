import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db
  const dbPath = process.env.DATABASE_PATH ?? './data/altcoin_hunter.db'
  const dir = path.dirname(dbPath)
  fs.mkdirSync(dir, { recursive: true })
  _db = new Database(dbPath)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  return _db
}

export function closeDb(): void {
  if (_db) {
    _db.close()
    _db = null
  }
}
