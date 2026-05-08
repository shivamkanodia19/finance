# Development Roadmap

This roadmap is ordered by build sequence, not by calendar time.

Each phase should be completed and verified before the next one is treated as active.

## Build Philosophy

- Build the minimum system that can prove value.
- Lock foundations before adding surface area.
- Prefer stable phases with acceptance gates over overlapping half-finished work.
- Do not start automation before the feed, research, and risk systems are trustworthy.

## Phase 1: Product Foundation

### Goal

Create a stable requirements and architecture foundation.

### Add

- living `CLAUDE.md`
- PRD
- roadmap
- UI/UX specs
- decision register
- data model draft
- committee output contract
- risk configuration schema

### Must Be True Before Moving On

- product scope is frozen enough that downstream work is not thrashing
- core schemas are clear
- live-trading boundaries are explicit

## Phase 2: Data Backbone

### Goal

Make the system capable of knowing what exists before it tries to reason.

### Add

- Robinhood account sync
- holdings sync
- orders sync
- tradable-pair sync
- coin metadata store
- external historical data ingestion
- live quote ingestion
- event input ingestion

### Must Be True Before Moving On

- the app can answer:
  - what can I trade?
  - what do I own?
  - what does recent market structure look like?
  - what events are attached to each coin?

## Phase 3: Signal Engine

### Goal

Turn data into ranked candidate ideas.

### Add

- breakout / continuation detection
- regime filter
- liquidity scoring
- execution-friction scoring
- event boost / veto logic
- lane classification
- ranked full-universe scan

### Must Be True Before Moving On

- the scanner returns a meaningful ranked list
- poor-liquidity / poor-execution names get penalized automatically
- the engine behaves differently for strong vs hostile market regimes

## Phase 4: AI Research Committee

### Goal

Upgrade ranked candidates into researched and challenged trade ideas.

### Add

- Scout role
- Researcher role
- Bull role
- Bear role
- Execution Analyst role
- Risk Manager role
- Judge role
- orchestration logic
- caching layer
- disagreement scoring

### Must Be True Before Moving On

- shortlisted names produce consistent structured outputs
- the committee can clearly separate `Actionable`, `Watch`, and `Reject`
- the bear case is real, not decorative

## Phase 5: Signal Feed

### Goal

Make the core product visible and useful.

### Add

- mobile-first feed
- ranking display
- alert cards
- lane grouping
- status badges
- filter and sort controls
- alert detail view
- compare view

### Must Be True Before Moving On

- 5-10 alerts can be understood quickly
- 1-3 actionable ideas are clearly distinguished
- the feed feels rich, not chaotic

## Phase 6: Trading Cockpit

### Goal

Turn a researched alert into a safe trade decision.

### Add

- live order review sheet
- route-quality display
- fee and friction display
- size recommendation
- sleeve-usage math
- stop / target display
- approval button
- rejection / dismiss actions

### Must Be True Before Moving On

- every actionable alert can be reviewed as a complete execution plan
- the user can understand cost, risk, and trade logic before approving

## Phase 7: Risk Console

### Goal

Expose and enforce portfolio-level trading rules.

### Add

- sleeve cap controls
- max concurrent position controls
- daily loss lockout
- weekly loss lockout
- losing-streak pause
- no-trade conditions
- kill switch

### Must Be True Before Moving On

- the product can block unsafe trades reliably
- the user can understand why something was blocked

## Phase 8: Journal And Evaluation

### Goal

Create a learning loop and measurement layer.

### Add

- alert journal
- trade journal
- approved vs rejected logs
- outcome summaries
- setup-family analytics
- committee-performance analytics
- eval harness

### Must Be True Before Moving On

- the system can explain which setup families and committee patterns are working
- weak logic can be cut based on evidence

## Phase 9: Shadow Operation

### Goal

Run the full stack in production-like conditions before relying on it heavily.

### Add

- live scans
- live committee operation
- live feed updates
- monitoring and incident logging
- process-quality review loop

### Must Be True Before Moving On

- the feed is useful under real conditions
- false positives are manageable
- the user trusts the feed enough to act from it

## Phase 10: Limited Live Trading

### Goal

Use small live trades through the approval workflow.

### Add

- live Robinhood order approval flow
- post-trade review workflow
- live fill-quality observations
- live friction tracking

### Must Be True Before Moving On

- real execution matches expectations closely enough
- the system improves decisions instead of amplifying noise

## Phase 11: Controlled Automation

### Goal

Automate only the narrow parts that have earned trust.

### Add In This Order

- automated exit alerts
- optional rules-based exit placement
- optional semi-automated exits
- optional limited autonomy for only the highest-confidence setups

### Must Be True Before Expanding

- evals remain strong
- the journal shows real edge after friction
- the risk engine is reliable under live conditions

## Feature Priority Order

If a coding agent must choose what to build first inside a phase, use this order:

1. Data integrity
2. Ranking logic
3. Committee reasoning
4. Feed usability
5. Cockpit clarity
6. Risk enforcement
7. Journaling
8. Automation

## Things That Must Not Be Pulled Forward

- full autonomy
- broad auto-ordering across many small coins
- overcomplicated agent meshes
- UI polish before core feed utility
- social features
- high-frequency features
