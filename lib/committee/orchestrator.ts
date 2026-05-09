import { runAgent } from './run-agent'
import type { AgentRole, AgentVerdict, CoinContext, CommitteeOutput, CommitteeStatus } from './types'

export async function runCommittee(ctx: CoinContext): Promise<CommitteeOutput> {
  // Round 1: scout + researcher in parallel (no prior context needed)
  const round1 = await Promise.all([
    runAgent('scout', ctx, []),
    runAgent('researcher', ctx, []),
  ])

  // Round 2: bull, bear, execution_analyst, risk_manager in parallel (see round 1)
  const round2 = await Promise.all([
    runAgent('bull', ctx, round1),
    runAgent('bear', ctx, round1),
    runAgent('execution_analyst', ctx, round1),
    runAgent('risk_manager', ctx, round1),
  ])

  const allVerdicts: AgentVerdict[] = [...round1, ...round2]

  // Round 3: judge sees everything
  const judgeVerdict = await runAgent('judge', ctx, allVerdicts)
  const verdicts = [...allVerdicts, judgeVerdict]

  const bullVerdict = verdicts.find(v => v.role === 'bull')
  const bearVerdict = verdicts.find(v => v.role === 'bear')
  const disagreementScore = bullVerdict && bearVerdict
    ? Math.abs(bullVerdict.confidence - bearVerdict.confidence)
    : 0

  const judgeData = judgeVerdict as AgentVerdict & Record<string, unknown>
  const status = (judgeData?.status as CommitteeStatus) ?? inferStatus(verdicts)
  const confidence = (judgeData?.confidence as number) ?? 0.5

  return {
    symbol: ctx.symbol,
    status,
    thesisSummary: (judgeData?.thesisSummary as string) ?? judgeVerdict.summary,
    mainCatalyst: (judgeData?.mainCatalyst as string) ?? '',
    mainBearObjection: (judgeData?.mainBearObjection as string) ?? '',
    executionNote: (judgeData?.executionNote as string) ?? '',
    riskNote: (judgeData?.riskNote as string) ?? '',
    suggestedSizeUsd: (judgeData?.suggestedSizeUsd as number) ?? 25,
    holdWindow: (judgeData?.holdWindow as string) ?? '3-7 days',
    stopPrice: ctx.currentPrice * (1 + ((judgeData?.stopPricePct as number) ?? -0.08)),
    targetPrice: ctx.currentPrice * (1 + ((judgeData?.targetPricePct as number) ?? 0.20)),
    confidence,
    disagreementScore,
    verdicts,
    createdAt: new Date().toISOString(),
  }
}

function inferStatus(verdicts: AgentVerdict[]): CommitteeStatus {
  const bullish = verdicts.filter(v => v.recommendation === 'bullish').length
  const bearish = verdicts.filter(v => v.recommendation === 'bearish').length
  if (bullish >= 4) return 'actionable'
  if (bearish >= 3) return 'reject'
  return 'watch'
}
