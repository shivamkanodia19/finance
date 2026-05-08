# Robinhood Altcoin Hunter

This file is the living master build brief for the future product codebase.

If this planning folder is later turned into a real repo, copy this file to the repo root as `./CLAUDE.md` so Claude Code loads it automatically at session start.

## Instructions For Claude Code

- Treat this document as the source of truth for product intent, build order, and guardrails.
- Before making product or code changes, read this file first and identify the current active phase.
- Use `explore -> plan -> implement -> verify` as the default workflow. Do not jump straight into code when the task is ambiguous.
- Give yourself a way to verify work on every phase: tests, scripts, fixtures, screenshots, or explicit acceptance checks.
- Use subagents for bounded research or verification tasks so the main implementation context stays clean.
- Manage context aggressively. If the session gets messy or you have corrected the same issue twice, summarize what matters, update this file if needed, then restart with a cleaner prompt.
- Keep the system simple until complexity is justified by eval results. Prefer a small number of strong patterns over a sprawling architecture.
- Start with one orchestrator plus specialized workers. Do not create an uncontrolled mesh of agents.
- Start wide, then narrow: broad scan first, shortlist second, deep debate third, execution last.
- Keep human approval in the loop for all live trades in v1, even if the rest of the system is highly agentic.
- Never silently change product goals. If a product decision changes, update:
  - `Current Decisions`
  - any affected phase definitions
  - `Open Questions`
  - `Change Log`
- When the same clarification or correction would need to be repeated next session, add it here.
- Preserve this file as a living document. Improve it as you learn, but do not overwrite settled product intent without recording why.

## How To Maintain This File

- Update this file whenever:
  - the user makes a new product decision
  - a major technical constraint is discovered
  - a phase completes and the next phase becomes active
  - eval evidence proves a strategy or product assumption wrong
- When updating:
  - keep the diff small and targeted
  - append a dated note to `Change Log`
  - do not delete prior decisions without recording why they changed
- Add a new item to `Decision Register` when:
  - the user explicitly chooses between options
  - the build team commits to a material architecture choice
  - risk controls or trading rules materially change

## Product Summary

**Name:** Robinhood Altcoin Hunter

**One-line product:** A Robinhood-connected crypto signal feed and trading cockpit for high-beta altcoins, backed by a multi-model research committee and hard risk guardrails.

**Primary user:** A personal Robinhood crypto trader with a roughly `$100-$200` crypto sleeve, seeking higher-upside meme and small-cap/AI opportunities with researched alerts and approval-first execution.

**Product shape:**

- signal feed first
- trading cockpit second
- research committee underneath both
- risk manager wrapped around all live execution

## Product Goals

- Surface the best Robinhood-tradable altcoin opportunities, not the most active ones.
- Produce many researched alerts, but only a few `Actionable` trades.
- Help the user take calculated high-beta risk without trading on pure impulse.
- Connect ideas directly to Robinhood execution and portfolio context.
- Learn over time which setup families, model arguments, and filters actually work.

## Non-Goals For V1

- Full trading autonomy
- High-frequency or intraday scalping
- Stocks or prediction markets
- Cross-broker support
- Social feed or copy-trading
- Tax optimization
- Multi-exchange arbitrage

## Research-Backed Product Principles

These principles come from current primary-source guidance on agentic systems and the crypto-specific research gathered on May 8, 2026.

- Start simple and add complexity only when it improves outcomes.
  - Anthropic advises finding the simplest solution possible and increasing complexity only when needed.
  - OpenAI recommends maximizing a single agent first, then splitting into multi-agent systems when logic or tool load demands it.
- Use workflows where predictable structure exists and agents where flexible judgment is needed.
- Parallelize independent workstreams, then synthesize.
- Build layered guardrails rather than trusting a single safety mechanism.
- Build evals early and treat them as first-class product requirements.
- Keep agent tools explicit, well-documented, and easy to verify.

## Product Thesis

Robinhood is strong at consumer-facing crypto execution, but weak at:

- full-universe discovery
- altcoin-specific research synthesis
- adversarial trade review
- explicit fee and friction awareness
- disciplined sleeve-level risk management

This product fills that gap.

## Current Decisions

- Scope is `Robinhood crypto only`.
- Universe scan includes `all Robinhood-tradable coins`.
- Product emphasis is `signal feed first`, `trading cockpit second`.
- The feed should support both:
  - `Narrative Momentum`
  - `Research Beta`
- Alerts can be numerous, but all should be deeply researched before promotion to `Actionable`.
- Design center for the live crypto sleeve is `$150`.
- Allowed sleeve range is roughly `$100-$200`.
- V1 execution remains `manual approval required for all live orders`.
- Mobile UX should feel close to Robinhood's interaction model.
- Desktop UX should prioritize research depth, comparison, and oversight.

## Product Constraints

As verified on May 8, 2026:

- Robinhood offers an official Crypto Trading API.
- Robinhood does not expose an equivalent public stock-trading API for this project scope.
- Tradability and routing quality vary by coin.
- Some coins are smart-exchange eligible, others are market-maker-only.
- Robinhood API is suitable for execution and account sync, but not by itself for historical research and backtesting.
- Therefore the product must combine:
  - Robinhood for execution and account truth
  - external market and event data for scanning, research, and evals

## Product Lanes

### Narrative Momentum

Focus:

- meme coins
- reflexive attention-driven setups
- social narrative acceleration
- short-lived but explosive continuation

Requirements:

- stronger liquidity filter
- stricter execution-quality penalties
- faster invalidation
- more skeptical bear review

### Research Beta

Focus:

- small-cap AI
- infrastructure
- utility
- higher-theory altcoin setups where narrative alone is not enough

Requirements:

- more weight on tokenomics
- more weight on catalyst durability
- more weight on unlock and supply-overhang risk

## Strategy Requirements

### Core Strategy Family

Default v1 strategy family:

- slow breakout / continuation
- market-regime gate
- event-aware boost / veto layer

This means:

- do not buy a coin because it merely exists in a narrative
- do not buy an event just because it is on the calendar
- prefer price-confirmed continuation over premature guessing

### Strategy Rules To Build Around

Initial strategy direction:

- primary trigger: 20-30 day breakout / continuation structure
- secondary filter: broader crypto regime must not be hostile
- event overlay:
  - positive structural events can boost conviction
  - negative systemic events can veto fresh entries
- max hold target: roughly 2 days to 6 weeks

### Important Strategic Truths

- Many alerts are acceptable.
- Many trades are not the goal.
- Small-coin edge is fragile after fees, spreads, and poor routing.
- The system should help the user skip bad trades at least as often as it finds good ones.

## Universe And Execution Tiers

All Robinhood-tradable coins may be scanned, but not all should be treated equally.

### Tier A

- smart-exchange eligible
- acceptable liquidity
- preferred for live execution

### Tier B

- tradable but market-maker-only
- lower execution-quality score
- eligible for alerts, but penalized in ranking

### Tier C

- technically tradable or watchable, but poor execution quality or weak liquidity
- watchlist only or blocked from live action

## AI Committee Architecture

Use an orchestrator-workers pattern rather than a flat swarm.

### Roles

- `Scout`
  - broad scan
  - unusual movers
  - breakout candidates
  - narrative clusters
- `Researcher`
  - what the coin is
  - tokenomics
  - project quality
  - recent catalysts
- `Bull`
  - strongest upside case
- `Bear`
  - strongest downside case
  - fraud, unlock, overhype, dilution-by-supply, thin liquidity
- `Execution Analyst`
  - Robinhood route quality
  - fee drag
  - slippage risk
  - order-type realism
- `Risk Manager`
  - sleeve exposure
  - suggested size
  - concurrency
  - lockouts
- `Judge`
  - final status and ranking

### Committee Output Contract

Every fully reviewed candidate must produce:

- status: `Actionable`, `Watch`, or `Reject`
- thesis summary
- main catalyst
- main bear objection
- execution-quality note
- risk note
- suggested size
- hold window
- stop / invalidation
- target framing

## Signal Feed Requirements

The feed is the product home.

### Feed Intensity

- show 5-10 ranked alerts
- promote only 1-3 as `Actionable`

### Card Fields

- coin
- category
- lane
- setup type
- catalyst summary
- committee confidence
- liquidity grade
- route / execution grade
- suggested size
- stop
- target
- expected hold window
- estimated fee / friction
- status

### Status Meanings

- `Actionable`
  - passes committee, risk, and execution checks
- `Watch`
  - interesting but incomplete or lower-quality
- `Reject`
  - not worth trading now

## Trading Cockpit Requirements

Every `Actionable` alert must resolve into a concrete execution review.

### Cockpit Must Show

- live quote context
- estimated fee and friction
- route quality
- order type
- exact sleeve usage
- position size recommendation
- stop / invalidation
- target / exit plan
- reason this trade is eligible now
- reason it might still fail

### V1 Live Execution Rule

- all entries require explicit user approval
- all exits require explicit user approval
- the system may recommend exits automatically, but it does not place them autonomously in v1

## Risk Engine Requirements

### Defaults

- sleeve design center: `$150`
- allowed range: `$100-$200`
- max concurrent positions: `3-4`
- default position size: `$20-$40`
- max single position: `$35-$50`
- no trades under `$10`

### Hard Rules

- no averaging down
- no bypassing sleeve cap
- no fresh trades after lockout triggers
- downgrade or block poor execution-quality names
- enforce no-trade conditions explicitly

### Lockouts

Implement configurable:

- daily realized loss limit
- weekly realized loss limit
- losing-streak pause
- market-regime veto mode

## Data Backbone Requirements

The product needs reliable truth sources before agentic logic.

Required data classes:

- Robinhood account and order data
- Robinhood tradable-pair metadata
- historical OHLCV from external provider(s)
- live quote data
- volatility and volume metrics
- coin metadata and category labels
- event and catalyst calendar
- research and committee output cache

## Eval Doctrine

Build evals early. This product should use eval-driven development.

### Why

Anthropic's guidance on agent evals recommends distinguishing:

- capability evals
- regression evals

Capability evals answer:

- what can the system do well?

Regression evals answer:

- does it still do what it used to do reliably?

### Eval Types To Include

- deterministic checks
  - schema validity
  - risk-rule enforcement
  - ordering and ranking integrity
  - route-quality gating
- model-based graders
  - research quality
  - committee usefulness
  - thesis clarity
  - whether bear arguments are substantive
- human spot checks
  - especially on `Actionable` alerts

### Minimum Eval Suites

- universe integrity suite
- signal-engine capability suite
- risk-engine regression suite
- committee quality suite
- feed-ranking regression suite
- execution-preview correctness suite

## Claude Code Workflow Doctrine

These working rules should guide all implementation sessions.

### Explore, Then Plan, Then Code

- first inspect the codebase and current phase state
- then produce a concrete plan
- then implement
- then verify

### Give Claude A Way To Verify Work

- every task should end with tests, assertions, fixtures, screenshots, or explicit output checks
- do not accept "looks right" without verification

### Use Subagents For Investigation

- offload parallel research, code reading, or verification tasks to subagents
- keep the main context focused on synthesis and implementation

### Manage Context Aggressively

- use short sessions per bounded task
- summarize decisions back into this file
- clear or compact context when stale information starts to dominate

### Keep CLAUDE.md Useful

- concise beats bloated
- rules should be specific
- avoid duplicating behavior Claude already does correctly

## Phase Plan

This project should be built in gated phases, not by arbitrary calendar weeks.

### Phase 1: Foundation

**Goal**

- lock entities, scope, terminology, and risk boundaries

**Artifacts**

- data model
- alert schema
- committee schema
- risk config schema
- decision register

**Definition of done**

- downstream phases can build without re-litigating core product scope

### Phase 2: Data Backbone

**Goal**

- establish reliable truth sources

**Artifacts**

- Robinhood sync layer
- external market data layer
- coin metadata store
- event input layer

**Definition of done**

- system can answer what is tradable, what is held, what the price structure is, and what major events are relevant

### Phase 3: Signal Engine

**Goal**

- convert raw data into ranked candidates

**Artifacts**

- breakout detectors
- regime filter
- liquidity scoring
- execution-friction scoring
- event boost / veto rules
- lane classification

**Definition of done**

- full-universe scan returns a ranked list that meaningfully penalizes weak execution-quality setups

### Phase 4: AI Committee

**Goal**

- convert shortlisted candidates into researched verdicts

**Artifacts**

- committee prompts
- orchestration flow
- caching
- structured outputs
- disagreement scoring

**Definition of done**

- shortlisted coins reliably produce usable `Actionable / Watch / Reject` outputs with clear reasons

### Phase 5: Signal Feed UX

**Goal**

- make the system usable as a daily product

**Artifacts**

- mobile-first feed
- alert cards
- deep research view
- desktop compare view

**Definition of done**

- the user can understand what matters, what is actionable, and why

### Phase 6: Trading Cockpit And Risk Console

**Goal**

- turn research into a safe execution workflow

**Artifacts**

- order review sheet
- approval flow
- fee and friction display
- sleeve math
- risk console and kill switch

**Definition of done**

- every live trade can be reviewed as a complete plan before approval

### Phase 7: Journal And Evaluation

**Goal**

- close the learning loop

**Artifacts**

- trade journal
- alert journal
- setup-family analytics
- committee accuracy tracking
- eval harness

**Definition of done**

- the system can tell which setups and filters are working and which should be cut

### Phase 8: Shadow Mode

**Goal**

- run the full recommendation stack in realistic conditions before relying on it

**Artifacts**

- live feed operation
- live committee operation
- approval-ready recommendations
- monitoring

**Definition of done**

- signal quality and process quality are acceptable under live conditions

### Phase 9: Limited Live Deployment

**Goal**

- validate the full loop with small real trades

**Artifacts**

- live approval flow
- post-trade reviews
- fill-quality monitoring

**Definition of done**

- the system improves real trading decisions without encouraging sloppy overtrading

### Phase 10: Controlled Automation

**Goal**

- only after trust is earned, automate narrow parts of execution

**Possible order**

- automated exit alerts
- optional rules-based exits
- semi-automated execution for highest-confidence setups
- later, guarded autonomy

**Definition of done**

- autonomy is only expanded if evals and live usage prove the system deserves it

## Decision Register

- 2026-05-08: Focus product on Robinhood crypto only.
- 2026-05-08: Product emphasis is signal feed first, trading cockpit second.
- 2026-05-08: Scan all Robinhood-tradable coins.
- 2026-05-08: Support both meme/narrative plays and small-cap/AI/research-beta plays.
- 2026-05-08: Increase design sleeve from the initial `$50` idea to a working range of `$100-$200`.
- 2026-05-08: Feed intensity set to rich feed, not firehose; show 5-10 ranked alerts.
- 2026-05-08: V1 should remain approval-first for all live trades.
- 2026-05-08: AI committee agents (especially Scout and Researcher) must search the open web broadly — not just crypto feeds. Macro news, regulatory events, geopolitical events, tech news, Fed decisions, and anything else that can cause crypto price spikes are all in scope. Tool: Anthropic API native web_search (no separate search API needed).
- 2026-05-08: Market data provider: Alpaca (OHLCV + live quotes). No separate news/event APIs — Claude web search covers all of that. Persistence: SQLite (single user, no server).
- 2026-05-08: Robinhood API integration deferred indefinitely. App is recommendation-only. User executes trades manually on Robinhood. Trading Cockpit, live execution, and automation phases (6, 9, 10, 11) are deferred until Robinhood API becomes viable.

## Open Questions

- Should market-maker-only coins ever reach `Actionable`, or should they be capped at `Watch` unless manually overridden?
- Should v1 start with static position-sizing rules or adaptive risk sizing based on historical volatility?
- Which Anthropic model mix should power the committee roles (broad scan vs deep research vs judging)?

## Resolved Questions

- Market data: Alpaca (OHLCV + live quotes).
- Event/news feeds: none — Claude web_search tool handles all open-web research.
- Robinhood API: deferred. App is recommendation-only for now.

## Source Notes

This build brief incorporates current best practices from primary sources, including:

- Anthropic, **Building effective agents**, published Dec 19, 2024
  - https://www.anthropic.com/engineering/building-effective-agents
- Anthropic, **How we built our multi-agent research system**, published Jun 13, 2025
  - https://www.anthropic.com/engineering/how-we-built-our-multi-agent-research-system
- Anthropic, **Demystifying evals for AI agents**, published Jan 09, 2026
  - https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- Anthropic Claude Code docs:
  - memory: https://docs.anthropic.com/en/docs/claude-code/memory
  - best practices: https://www.anthropic.com/engineering/claude-code-best-practices
- OpenAI, **A practical guide to building AI agents**
  - https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/

These sources support the following design choices:

- start simple, increase complexity when justified
- use explicit workflows and guardrails
- parallelize independent workstreams
- evaluate agents with both capability and regression suites
- keep persistent instructions in `CLAUDE.md`
- separate exploration/planning from implementation

## Change Log

- 2026-05-08: Initial living master build brief created from product-definition work, crypto strategy research, Robinhood constraint review, and agentic-development best-practice research.
