import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db/client'
import { SCHEMA_SQL } from '@/lib/db/schema'
import { fetchOHLCV } from '@/lib/alpaca/ohlcv'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

export async function GET() {
  const results: Record<string, unknown> = {}

  // ── 1. Supabase: can we connect and do tables exist? ──────────────────────
  try {
    const { data, error } = await supabase.from('coins').select('symbol').limit(1)
    if (error) {
      results.supabase = { ok: false, error: error.message, hint: 'Tables likely missing. Run SCHEMA_SQL in your Supabase SQL Editor.' }
    } else {
      results.supabase = { ok: true, rowCount: data?.length ?? 0 }
    }
  } catch (e) {
    results.supabase = { ok: false, error: String(e) }
  }

  // ── 2. Alpaca: can we fetch BTC bars? ─────────────────────────────────────
  try {
    const bars = await fetchOHLCV('BTC/USD', '1Day', 5)
    if (bars.length === 0) {
      results.alpaca = { ok: false, error: 'Returned 0 bars — check API key or symbol format' }
    } else {
      results.alpaca = { ok: true, bars: bars.length, latestClose: bars.at(-1)?.close }
    }
  } catch (e) {
    results.alpaca = { ok: false, error: String(e) }
  }

  // ── 3. Anthropic/Haiku: basic call WITHOUT web search ─────────────────────
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const res = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 64,
      messages: [{ role: 'user', content: 'Reply with {"ok":true}' }],
    })
    const text = res.content.find(b => b.type === 'text')?.text ?? ''
    results.haiku_basic = { ok: true, response: text.slice(0, 100) }
  } catch (e) {
    results.haiku_basic = { ok: false, error: String(e) }
  }

  // ── 4. Anthropic/Haiku: call WITH web_search tool ─────────────────────────
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const res = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 128,
      tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
      messages: [{ role: 'user', content: 'Search for "bitcoin price today" and return {"ok":true}' }],
    })
    const text = res.content.find(b => b.type === 'text')?.text ?? ''
    results.haiku_websearch = { ok: true, response: text.slice(0, 200), stopReason: res.stop_reason }
  } catch (e) {
    results.haiku_websearch = { ok: false, error: String(e) }
  }

  // ── 5. Supabase schema (safe to re-run, all IF NOT EXISTS) ─────────────────
  results.schema_sql_available = true
  results.schema_hint = 'If supabase.ok is false, run the SQL at /api/debug?setup=1 to auto-init tables.'

  return NextResponse.json(results, { status: 200 })
}

// POST /api/debug → auto-applies the schema
export async function POST() {
  try {
    // Supabase JS client can't run raw SQL directly — we use the REST API
    const url = `${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''}`,
      },
      body: JSON.stringify({ sql: SCHEMA_SQL }),
    })

    if (!res.ok) {
      const body = await res.text()
      return NextResponse.json({
        ok: false,
        error: body,
        hint: 'Auto-setup failed. Go to your Supabase dashboard → SQL Editor and run the SCHEMA_SQL from lib/db/schema.ts manually.',
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: 'Schema applied successfully.' })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
