import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/client'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = getDb()

    const alert = db.prepare(`
      SELECT a.*, c.name, c.category, c.tier
      FROM alerts a
      JOIN coins c ON a.symbol = c.symbol
      WHERE a.id = ?
    `).get(id)

    if (!alert) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const verdicts = db.prepare(
      `SELECT role, verdict, summary FROM committee_outputs WHERE alert_id = ? ORDER BY id`
    ).all(id)

    return NextResponse.json({ ...alert, verdicts })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
