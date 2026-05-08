# Product Requirements Document

## Product

**Name:** Robinhood Altcoin Hunter

**Tagline:** A Robinhood-connected altcoin signal feed and trading cockpit with deep research, multi-model debate, and approval-first execution.

## Product Summary

Robinhood Altcoin Hunter is a personal crypto trading product for discovering, researching, ranking, and executing high-beta altcoin trades directly through Robinhood. It is built for a user who wants more upside than a majors-only strategy, but still wants a system that forces discipline, debate, and risk control before money is deployed.

The product is not a generic portfolio dashboard. It is a:

- signal feed
- research terminal
- adversarial AI committee
- trading cockpit
- risk manager

## Problem

Robinhood is good at:

- simple crypto access
- clean execution UX
- retail-friendly account management

Robinhood is weak at:

- full-universe altcoin discovery
- deep, structured research
- systematic bull-vs-bear challenge
- explicit fee and friction awareness
- sleeve-level risk management for speculative trading

The result is that small-coin trading often turns into reactive, low-conviction behavior driven by hype, noise, or shallow chart watching.

## Product Vision

Build a product that feels like "Robinhood crypto, but smarter and more dangerous in the right way":

- more discovery
- more research
- more skepticism
- more clarity
- more control

The app should help the user take selective high-beta swings, not encourage constant overtrading.

## Target User

Primary user:

- personal trader
- Robinhood crypto account
- sleeve size roughly `$100-$200`
- interested in meme coins and small-cap/AI coins
- wants many alerts
- wants few high-conviction trades
- wants manual approval before money moves

## Goals

- Surface the best Robinhood-tradable altcoin opportunities.
- Produce 5-10 ranked alerts at a time.
- Promote only 1-3 as truly actionable.
- Tie every trade suggestion to a real thesis, a real bear case, and a real execution review.
- Keep the product useful on both mobile and desktop.
- Learn over time which setup families and committee arguments produce the best outcomes.

## Non-Goals

- Fully autonomous live trading in v1
- High-frequency trading
- Day-trading-first UX
- Stocks and prediction markets
- Social feed or copy trading
- Broad "AI does everything" black-box behavior

## Product Principles

- Signal feed first, not portfolio dashboard first.
- Research depth matters more than alert volume.
- Many alerts are acceptable; many live trades are not the goal.
- Every live trade should survive both enthusiasm and skepticism.
- A trade is not good if the execution friction destroys the edge.
- The system should help the user skip bad trades as often as it finds good ones.

## Jobs To Be Done

- Tell me which Robinhood-tradable coins actually deserve attention.
- Explain why a coin might move now.
- Tell me why the trade might fail.
- Show me whether Robinhood execution quality is good enough.
- Help me size the trade responsibly within my crypto sleeve.
- Let me approve a live trade quickly once I trust the setup.

## User Stories

- As a user, I want a ranked feed of altcoin opportunities so I do not have to manually scan dozens of coins.
- As a user, I want each alert to include both a bull case and a bear case so I do not blindly chase hype.
- As a user, I want the app to tell me whether a coin is smart-exchange eligible or lower quality for execution on Robinhood.
- As a user, I want suggested size, stop, and target so every trade has a plan.
- As a user, I want the app to separate "interesting" from "actionable" so I do not confuse noise with edge.
- As a user, I want manual approval on every trade in v1 so I stay in control while trust is still being earned.

## Core Product Lanes

### Narrative Momentum

Use for:

- meme coins
- reflexive narrative plays
- fast social-attention setups

System bias:

- higher skepticism
- stronger liquidity requirements
- tighter execution penalties

### Research Beta

Use for:

- AI
- infrastructure
- utility
- thesis-driven small-cap setups

System bias:

- more weight on tokenomics
- more weight on catalyst durability
- more weight on unlock and supply-overhang risk

## Core Workflow

1. Scan the Robinhood crypto universe.
2. Rank coins using market structure, liquidity, and event context.
3. Shortlist the best candidates.
4. Run the AI committee on shortlisted names.
5. Publish 5-10 ranked alerts.
6. Mark only 1-3 as `Actionable`.
7. Let the user open the trading cockpit.
8. Require explicit approval before any live order is sent.
9. Log the result for later evaluation.

## Strategy Direction

Default strategy family:

- slow breakout / continuation
- market-regime filter
- event-aware boost / veto layer

Important implications:

- the product should not buy coins just because they are trending socially
- the product should not buy an event just because it is on a calendar
- event context should strengthen or weaken a trade, not replace price confirmation

## Functional Requirements

### 1. Universe And Metadata

- Pull all Robinhood-tradable crypto pairs.
- Store tradeability metadata.
- Store route / execution-quality metadata.
- Classify coins into categories and lanes.

### 2. Market Data

- Historical OHLCV for signal generation
- Live quote support for execution preview
- Volume and volatility metrics
- Breakout and continuation statistics

### 3. Event Layer

- Regulatory events
- ETF and structural market-access events
- protocol upgrades
- exchange / venue stress
- token unlocks
- security incidents
- narrative classification

### 4. Signal Engine

- breakout / continuation detection
- market-regime gate
- liquidity score
- execution-friction score
- event boost / veto
- lane-aware ranking

### 5. AI Committee

- Scout
- Researcher
- Bull
- Bear
- Execution Analyst
- Risk Manager
- Judge

Output must include:

- status: `Actionable`, `Watch`, `Reject`
- thesis summary
- main catalyst
- main bear objection
- suggested size
- hold window
- stop / invalidation
- target framing

### 6. Signal Feed

- 5-10 ranked alerts
- 1-3 actionable
- alert detail view
- compare view
- mobile-first layout

### 7. Trading Cockpit

- live execution review
- fee and friction estimate
- route quality
- trade plan
- sleeve math
- explicit approval action

### 8. Risk Engine

- sleeve cap
- max concurrent positions
- size suggestion
- daily / weekly lockouts
- no-trade conditions
- kill switch

### 9. Journal And Analytics

- alert history
- approved vs rejected history
- trade outcome logs
- setup-family analysis
- committee-accuracy analysis

## Success Metrics

Primary:

- quality of actionable alerts
- risk-adjusted performance of approved trades
- percent of approved trades that followed plan

Secondary:

- false-positive rate
- number of bad trades blocked by risk or committee logic
- user trust in the feed and cockpit

## Design Constraints

- Mobile should feel familiar to a Robinhood user.
- Desktop should feel more like a compact research terminal.
- The product must handle both flashy meme opportunities and slower thesis-driven setups without making them look identical.
- The UI must make uncertainty visible, not hide it.

## Safety And Risk Constraints

- No live order without approval in v1.
- No averaging down.
- No bypassing sleeve caps.
- No hiding execution-quality problems.
- No promoting weak or thin setups to `Actionable` just because the narrative is strong.

## Dependencies

- Robinhood crypto API
- external market data provider
- external event / news inputs
- Anthropic API
- persistence for research, alerts, journal, and outcomes

## Release Readiness Conditions For V1

V1 is ready only if:

- the signal feed is useful without feeling noisy
- the committee outputs are structured and credible
- the cockpit shows real fee and route considerations
- the risk engine reliably blocks bad behavior
- the journal can support future strategy refinement
