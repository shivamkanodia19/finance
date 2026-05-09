import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db/client'
import { COIN_UNIVERSE } from '@/lib/universe/coins'
import { runScan } from '@/lib/signals/scanner'
import { classifyRegime } from '@/lib/signals/regime'
import { fetchOHLCV } from '@/lib/alpaca/ohlcv'
import { runCommittee } from '@/lib/committee/orchestrator'
import { suggestPositionSize } from '@/lib/risk/engine'
import { frictionGrade } from '@/lib/signals/friction'
import { nanoid } from 'nanoid'

export const maxDuration = 60

export async function POST() {
  try {
    // Upsert coin universe
    const coinRows = COIN_UNIVERSE.map(c => ({
      symbol: c.symbol, name: c.name, tier: c.tier, lane: c.lane, category: c.category,
    }))
    const { error: coinErr } = await supabase.from('coins').upsert(coinRows, { onConflict: 'symbol' })
    if (coinErr) throw coinErr

    // Classify regime from BTC
    const btcBars = await fetchOHLCV('BTC/USD', '1Day', 55)
    const regime = classifyRegime(btcBars)

    // Run signal scan
    const candidates = await runScan(regime)
    const shortlist = candidates.slice(0, 8)

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

      const { error: alertErr } = await supabase.from('alerts').insert({
        id: alertId,
        symbol: coin.symbol,
        status: committee.status,
        lane: coin.lane,
        setup_type: breakout.setupType,
        catalyst: committee.mainCatalyst || `${breakout.setupType.replace(/_/g, ' ')} — ${coin.name}`,
        confidence: committee.confidence,
        liquidity_grade: liquidityScore >= 0.7 ? 'Good' : liquidityScore >= 0.4 ? 'Fair' : 'Poor',
        route_grade: frictionGrade(frictionScore),
        hold_window: committee.holdWindow,
        suggested_size: suggestedSize,
        stop_price: committee.stopPrice,
        target_price: committee.targetPrice,
        signal_score: totalScore,
      })
      if (alertErr) throw alertErr

      const verdictRows = committee.verdicts.map(v => ({
        alert_id: alertId,
        role: v.role,
        verdict: v.recommendation,
        summary: v.summary,
      }))
      const { error: verdictErr } = await supabase.from('committee_outputs').insert(verdictRows)
      if (verdictErr) throw verdictErr
    }

    return NextResponse.json({ ok: true, scanned: shortlist.length, regime })
  } catch (err) {
    console.error('Scan error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
