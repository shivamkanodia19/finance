import Database from 'better-sqlite3'

export function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS coins (
      symbol      TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      tier        TEXT NOT NULL CHECK(tier IN ('A', 'B', 'C')),
      lane        TEXT NOT NULL CHECK(lane IN ('narrative_momentum', 'research_beta')),
      category    TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS price_bars (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol      TEXT NOT NULL REFERENCES coins(symbol),
      timeframe   TEXT NOT NULL,
      ts          TEXT NOT NULL,
      open        REAL NOT NULL,
      high        REAL NOT NULL,
      low         REAL NOT NULL,
      close       REAL NOT NULL,
      volume      REAL NOT NULL,
      UNIQUE(symbol, timeframe, ts)
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id              TEXT PRIMARY KEY,
      symbol          TEXT NOT NULL REFERENCES coins(symbol),
      status          TEXT NOT NULL CHECK(status IN ('actionable', 'watch', 'reject')),
      lane            TEXT NOT NULL,
      setup_type      TEXT NOT NULL,
      catalyst        TEXT NOT NULL,
      confidence      REAL NOT NULL,
      liquidity_grade TEXT NOT NULL,
      route_grade     TEXT NOT NULL,
      hold_window     TEXT NOT NULL,
      suggested_size  REAL,
      stop_price      REAL,
      target_price    REAL,
      signal_score    REAL NOT NULL,
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at      TEXT
    );

    CREATE TABLE IF NOT EXISTS committee_outputs (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      alert_id        TEXT NOT NULL REFERENCES alerts(id),
      role            TEXT NOT NULL,
      verdict         TEXT NOT NULL,
      summary         TEXT NOT NULL,
      created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      alert_id        TEXT NOT NULL REFERENCES alerts(id),
      action          TEXT NOT NULL CHECK(action IN ('approved', 'rejected', 'watched')),
      entry_price     REAL,
      exit_price      REAL,
      outcome         TEXT,
      notes           TEXT,
      created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
    CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at);
    CREATE INDEX IF NOT EXISTS idx_price_bars_symbol ON price_bars(symbol, timeframe);
    CREATE INDEX IF NOT EXISTS idx_committee_alert ON committee_outputs(alert_id);
  `)
}
