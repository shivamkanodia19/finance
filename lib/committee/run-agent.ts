import Anthropic from '@anthropic-ai/sdk'
import { getSystemPrompt } from './prompts'
import type { AgentRole, AgentVerdict, CoinContext } from './types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function runAgent(
  role: AgentRole,
  coinContext: CoinContext,
  priorVerdicts: AgentVerdict[]
): Promise<AgentVerdict> {
  const userMessage = buildUserMessage(coinContext, priorVerdicts, role)

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: getSystemPrompt(role),
    tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
    messages: [{ role: 'user', content: userMessage }],
  })

  // Find the text block — may come after tool_use blocks
  const textBlock = response.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error(`Agent ${role} returned no text content`)
  }

  // Strip markdown fences if model wraps in them despite instructions
  const raw = textBlock.text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    // Spread ALL parsed fields so orchestrator can access judge-specific fields
    // (status, thesisSummary, mainCatalyst, stopPricePct, etc.) without stripping them
    return {
      ...parsed,
      role: (parsed.role as AgentRole) ?? role,
      summary: (parsed.summary as string) ?? '',
      keyPoints: (parsed.keyPoints as string[]) ?? [],
      confidence: Math.min(1, Math.max(0, (parsed.confidence as number) ?? 0.5)),
      recommendation: (parsed.recommendation as AgentVerdict['recommendation']) ?? 'neutral',
    } as AgentVerdict & Record<string, unknown>
  } catch {
    throw new Error(`Agent ${role} returned invalid JSON: ${raw.slice(0, 300)}`)
  }
}

function buildUserMessage(ctx: CoinContext, priorVerdicts: AgentVerdict[], role: AgentRole): string {
  const contextBlock = `COIN: ${ctx.symbol} (${ctx.name})
Category: ${ctx.category} | Lane: ${ctx.lane} | Tier: ${ctx.tier}
Current Price: $${ctx.currentPrice}
Breakout Level: $${ctx.breakoutLevel}
Volume Ratio (vs 20-day avg): ${ctx.volumeRatio.toFixed(2)}x
ATR%: ${(ctx.atrPct * 100).toFixed(2)}%
Liquidity Score: ${ctx.liquidityScore.toFixed(2)}/1.0
Friction Score: ${ctx.frictionScore.toFixed(2)}/1.0
Signal Score: ${ctx.signalScore.toFixed(2)}/1.0`

  if (priorVerdicts.length === 0) {
    return `${contextBlock}\n\nResearch this coin and return your analysis as JSON.`
  }

  const priorSummary = priorVerdicts
    .map(v => `[${v.role.toUpperCase()}] (confidence: ${v.confidence.toFixed(2)}): ${v.summary}`)
    .join('\n\n')

  return `${contextBlock}\n\nPRIOR COMMITTEE VERDICTS:\n${priorSummary}\n\nBased on the above, return your ${role} analysis as JSON.`
}
