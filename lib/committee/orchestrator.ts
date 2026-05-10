import { runAgent } from './run-agent'
import type { AgentRole, AgentVerdict, CoinContext, CommitteeOutput, CommitteeStatus } from './types'

export async function runCommittee(ctx: CoinContext): Promise<CommitteeOutput> {
  // Round 1: scout + researcher in parallel
  const round1Results = await Promise.allSettled([
    runAgent('scout', ctx, []),
    runAgent('researcher', ctx, []),
  ])
  const round1 = settledVerdicts(round1Results, ['scout', 'researcher'])

  // Round 2: synthesis agents in parallel — they see round 1 but don't need web search
  const round2Results = await Promise.allSettled([
    runAgent('bull', ctx, round1),
    runAgent('bear', ctx, round1),
    runAgent('execution_analyst', ctx, round1),
    runAgent('risk_manager', ctx, round1),
  ])
  const round2 = settledVerdicts(round2Results, ['bull', 'bear', 'execution_analyst', 'risk_manager'])

  const allVerdicts: AgentVerdict[] = [...round1, ...round2]

  // Round 3: judge synthesizes everything
  let judgeVerdict: AgentVerdict
  try {
    judgeVerdict = await runAgent('judge', ctx, allVerdicts)
  } catch {
    judgeVerdict = fallbackVerdict('judge', 'Judge analysis unavailable.')
  }

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

// Extracts successful verdicts from Promise.allSettled results, using a fallback for failures.
function settledVerdicts(
  results: PromiseSettledResult<AgentVerdict>[],
  roles: AgentRole[]
): AgentVerdict[] {
  return results.map((result, i) => {
    if (result.status === 'fulfilled') return result.value
    console.error(`Agent ${roles[i]} failed:`, result.reason)
    return fallbackVerdict(roles[i], `${roles[i]} analysis unavailable.`)
  })
}

function fallbackVerdict(role: AgentRole, summary: string): AgentVerdict {
  const recommendation =
    role === 'bull' ? 'bullish' :
    role === 'bear' ? 'bearish' :
    'neutral'
  return { role, summary, keyPoints: [], confidence: 0.5, recommendation }
}

function inferStatus(verdicts: AgentVerdict[]): CommitteeStatus {
  const bullish = verdicts.filter(v => v.recommendation === 'bullish').length
  const bearish = verdicts.filter(v => v.recommendation === 'bearish').length
  if (bullish >= 3) return 'actionable'
  if (bearish >= 3) return 'reject'
  return 'watch'
}
