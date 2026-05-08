import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/client'
import { runMigrations } from '@/lib/db/schema'

export async function GET() {
  try {
    const db = getDb()
    runMigrations(db)

    const alerts = db.prepare(`
      SELECT
        a.*,
        c.name,
        (SELECT summary FROM committee_outputs WHERE alert_id = a.id AND role = 'judge' LIMIT 1) as thesisSummary,
        (SELECT summary FROM committee_outputs WHERE alert_id = a.id AND role = 'bear' LIMIT 1) as mainBearObjection
      FROM alerts a
      JOIN coins c ON a.symbol = c.symbol
      ORDER BY
        CASE a.status WHEN 'actionable' THEN 0 WHEN 'watch' THEN 1 ELSE 2 END,
        a.signal_score DESC
      LIMIT 20
    `).all()

    return NextResponse.json(alerts)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
