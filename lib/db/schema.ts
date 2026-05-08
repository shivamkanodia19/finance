// Run this SQL in your Supabase SQL Editor to set up the schema.
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS coins (
  symbol      TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  tier        TEXT NOT NULL CHECK(tier IN ('A', 'B', 'C')),
  lane        TEXT NOT NULL CHECK(lane IN ('narrative_momentum', 'research_beta')),
  category    TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_bars (
  id          BIGSERIAL PRIMARY KEY,
  symbol      TEXT NOT NULL REFERENCES coins(symbol),
  timeframe   TEXT NOT NULL,
  ts          TIMESTAMPTZ NOT NULL,
  open        DOUBLE PRECISION NOT NULL,
  high        DOUBLE PRECISION NOT NULL,
  low         DOUBLE PRECISION NOT NULL,
  close       DOUBLE PRECISION NOT NULL,
  volume      DOUBLE PRECISION NOT NULL,
  UNIQUE(symbol, timeframe, ts)
);

CREATE TABLE IF NOT EXISTS alerts (
  id              TEXT PRIMARY KEY,
  symbol          TEXT NOT NULL REFERENCES coins(symbol),
  status          TEXT NOT NULL CHECK(status IN ('actionable', 'watch', 'reject')),
  lane            TEXT NOT NULL,
  setup_type      TEXT NOT NULL,
  catalyst        TEXT NOT NULL,
  confidence      DOUBLE PRECISION NOT NULL,
  liquidity_grade TEXT NOT NULL,
  route_grade     TEXT NOT NULL,
  hold_window     TEXT NOT NULL,
  suggested_size  DOUBLE PRECISION,
  stop_price      DOUBLE PRECISION,
  target_price    DOUBLE PRECISION,
  signal_score    DOUBLE PRECISION NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS committee_outputs (
  id          BIGSERIAL PRIMARY KEY,
  alert_id    TEXT NOT NULL REFERENCES alerts(id),
  role        TEXT NOT NULL,
  verdict     TEXT NOT NULL,
  summary     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id          BIGSERIAL PRIMARY KEY,
  alert_id    TEXT NOT NULL REFERENCES alerts(id),
  action      TEXT NOT NULL CHECK(action IN ('approved', 'rejected', 'watched')),
  entry_price DOUBLE PRECISION,
  exit_price  DOUBLE PRECISION,
  outcome     TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_price_bars_symbol ON price_bars(symbol, timeframe);
CREATE INDEX IF NOT EXISTS idx_committee_alert ON committee_outputs(alert_id);
`
