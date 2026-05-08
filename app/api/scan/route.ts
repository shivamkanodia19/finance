import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/client'
import { runMigrations } from '@/lib/db/schema'
import { COIN_UNIVERSE } from '@/lib/universe/coins'
import { runScan } from '@/lib/signals/scanner'
import { classifyRegime } from '@/lib/signals/regime'
import { fetchOHLCV } from '@/lib/alpaca/ohlcv'
import { runCommittee } from '@/lib/committee/orchestrator'
import { suggestPositionSize } from '@/lib/risk/engine'
import { frictionGrade } from '@/lib/signals/friction'
import { nanoid } from 'nanoid'

export const maxDuration = 300

export async function POST() {
  try {
    const db = getDb()
    runMigrations(db)

    // Seed coins
    const insertCoin = db.prepare(
      `INSERT OR IGNORE INTO coins (symbol, name, tier, lane, category) VALUES (@symbol, @name, @tier, @lane, @category)`
    )
    for (const coin of COIN_UNIVERSE) {
      insertCoin.run({ symbol: coin.symbol, name: coin.name, tier: coin.tier, lane: coin.lane, category: coin.category })
    }

    // Classify regime from BTC
    const btcBars = await fetchOHLCV('BTC/USD', '1Day', 55)
    const regime = classifyRegime(btcBars)

    // Run signal scan
    const candidates = await runScan(regime)
    const shortlist = candidates.slice(0, 8)

    const insertAlert = db.prepare(`
      INSERT INTO alerts (id, symbol, status, lane, setup_type, catalyst, confidence, liquidity_grade, route_grade, hold_window, suggested_size, stop_price, target_price, signal_score)
      VALUES (@id, @symbol, @status, @lane, @setupType, @catalyst, @confidence, @liquidityGrade, @routeGrade, @holdWindow, @suggestedSize, @stopPrice, @targetPrice, @signalScore)
    `)

    const insertVerdict = db.prepare(
      `INSERT INTO committee_outputs (alert_id, role, verdict, summary) VALUES (@alertId, @role, @verdict, @summary)`
    )

    for (const candidate of shortlist) {
      const { coin, breakout, liquidityScore, frictionScore, totalScore } = candidate

      const coinCtx = {
        symbol: coin.symbol,
        name: coin.name,
        category: coin.category,
        lane: coin.lane,
        tier: coin.tier,
        currentPrice: breakout.currentClose,
        breakoutLevel: breakout.breakoutLevel,
        volumeRatio: breakout.volumeRatio,
        atrPct: breakout.atrPct,
        liquidityScore,
        frictionScore,
        signalScore: totalScore,
      }

      const committee = await runCommittee(coinCtx)
      const suggestedSize = suggestPositionSize(150, 0, committee.confidence, frictionScore)
      const alertId = nanoid()

      insertAlert.run({
        id: alertId,
        symbol: coin.symbol,
        status: committee.status,
        lane: coin.lane,
        setupType: breakout.setupType,
        catalyst: committee.mainCatalyst || `${breakout.setupType.replace(/_/g, ' ')} — ${coin.name}`,
        confidence: committee.confidence,
        liquidityGrade: liquidityScore >= 0.7 ? 'Good' : liquidityScore >= 0.4 ? 'Fair' : 'Poor',
        routeGrade: frictionGrade(frictionScore),
        holdWindow: committee.holdWindow,
        suggestedSize,
        stopPrice: committee.stopPrice,
        targetPrice: committee.targetPrice,
        signalScore: totalScore,
      })

      for (const verdict of committee.verdicts) {
        insertVerdict.run({
          alertId,
          role: verdict.role,
          verdict: verdict.recommendation,
          summary: verdict.summary,
        })
      }
    }

    return NextResponse.json({ ok: true, scanned: shortlist.length, regime })
  } catch (err) {
    console.error('Scan error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
