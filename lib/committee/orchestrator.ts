import { runAgent } from './run-agent'
import type { AgentRole, AgentVerdict, CoinContext, CommitteeOutput, CommitteeStatus } from './types'

const SEQUENTIAL_ROLES: AgentRole[] = [
  'scout', 'researcher', 'bull', 'bear', 'execution_analyst', 'risk_manager', 'judge',
]

export async function runCommittee(ctx: CoinContext): Promise<CommitteeOutput> {
  const verdicts: AgentVerdict[] = []

  for (const role of SEQUENTIAL_ROLES) {
    const priorForRole = role === 'judge' ? verdicts : verdicts.filter(v => v.role !== 'judge')
    const verdict = await runAgent(role, ctx, priorForRole)
    verdicts.push(verdict)
  }

  const judgeRaw = verdicts.find(v => v.role === 'judge') as AgentVerdict & Record<string, unknown>
  const bullVerdict = verdicts.find(v => v.role === 'bull')
  const bearVerdict = verdicts.find(v => v.role === 'bear')

  const disagreementScore = bullVerdict && bearVerdict
    ? Math.abs(bullVerdict.confidence - bearVerdict.confidence)
    : 0

  const status = (judgeRaw as Record<string, unknown>)?.status as CommitteeStatus ?? inferStatus(verdicts)
  const confidence = (judgeRaw as Record<string, unknown>)?.confidence as number ?? 0.5
  const judgeData = judgeRaw as Record<string, unknown>

  return {
    symbol: ctx.symbol,
    status,
    thesisSummary: (judgeData?.thesisSummary as string) ?? judgeRaw.summary,
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
