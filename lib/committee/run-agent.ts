import Anthropic from '@anthropic-ai/sdk'
import { getSystemPrompt } from './prompts'
import type { AgentRole, AgentVerdict, CoinContext } from './types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Only Scout and Researcher benefit from live web search.
// Synthesis agents (Bull/Bear/Execution/Risk/Judge) work from prior verdicts only —
// removing web_search ensures they return clean JSON without pre-tool thinking prose.
const WEB_SEARCH_ROLES: AgentRole[] = ['scout', 'researcher']

export async function runAgent(
  role: AgentRole,
  coinContext: CoinContext,
  priorVerdicts: AgentVerdict[]
): Promise<AgentVerdict> {
  const useWebSearch = WEB_SEARCH_ROLES.includes(role)
  const userMessage = buildUserMessage(coinContext, priorVerdicts, role)

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: getSystemPrompt(role),
    ...(useWebSearch
      ? { tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }] }
      : {}),
    messages: [{ role: 'user', content: userMessage }],
  })

  // When web_search is active, Haiku emits a pre-tool thinking text block BEFORE
  // the search runs ("I'll research this..."), then the actual JSON response AFTER.
  // Always use the LAST text block to get the post-search response.
  const textBlocks = response.content.filter(b => b.type === 'text')
  const textBlock = textBlocks.at(-1)
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error(`Agent ${role} returned no text content`)
  }

  const raw = extractJson(textBlock.text)

  try {
    return parseVerdict(JSON.parse(raw) as Record<string, unknown>, role)
  } catch {
    throw new Error(`Agent ${role} returned invalid JSON: ${raw.slice(0, 400)}`)
  }
}

// Extracts a JSON object from potentially mixed text.
// Handles: plain JSON, ```json fences, prose-wrapped JSON ("Based on research, {...}")
function extractJson(text: string): string {
  // 1. Fenced code block
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenceMatch) return fenceMatch[1].trim()

  // 2. Outermost { ... } — handles "Based on results, {...}" or trailing prose
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first !== -1 && last > first) return text.slice(first, last + 1).trim()

  return text.trim()
}

function parseVerdict(parsed: Record<string, unknown>, role: AgentRole): AgentVerdict {
  return {
    ...parsed,
    role: (parsed.role as AgentRole) ?? role,
    summary: (parsed.summary as string) ?? '',
    keyPoints: (parsed.keyPoints as string[]) ?? [],
    confidence: Math.min(1, Math.max(0, (parsed.confidence as number) ?? 0.5)),
    recommendation: (parsed.recommendation as AgentVerdict['recommendation']) ?? 'neutral',
  } as AgentVerdict & Record<string, unknown>
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
