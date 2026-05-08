# UI And UX Specifications

## Design Intent

The product should feel like:

- Robinhood-native in familiarity
- more serious in research
- more explicit in risk
- more honest about uncertainty

The user should feel:

- fast access to ideas
- clear understanding of why a coin matters
- clear understanding of why it might fail
- confidence before approval

## Product Architecture

### Primary Surfaces

- Signal Feed
- Alert Detail / Research View
- Trading Cockpit
- Risk Console
- Journal

### Navigation Priority

Mobile:

1. Feed
2. Portfolio / Risk
3. Journal

Desktop:

1. Feed
2. Research / Compare
3. Cockpit
4. Risk / Journal

## Information Hierarchy

The UI should always present information in this order:

1. Is this actionable?
2. Why does it matter now?
3. What is the risk?
4. Can it be executed cleanly on Robinhood?
5. How big should the trade be?

## Visual Direction

### General Tone

- crisp
- dense but readable
- high-signal
- less playful than Robinhood
- still retail-friendly

### Style Guidance

- avoid generic dashboard clutter
- use strong contrast between `Actionable`, `Watch`, and `Reject`
- use typography hierarchy to guide urgency
- surface disagreement, not just confidence
- use whitespace to separate thesis, risk, and execution

### Status Colors

- `Actionable`: vivid green or teal
- `Watch`: amber or gold
- `Reject`: red or muted red

These colors should support fast triage without making every green card feel like a guaranteed win.

## Mobile UX

### Feed

The mobile feed is the home screen.

Each card should show:

- coin ticker and name
- lane label
- setup label
- main catalyst
- committee confidence
- liquidity / execution grade
- status
- suggested hold window

Cards should expand into:

- thesis
- main bear objection
- stop
- target
- suggested size
- estimated friction

### Mobile Interaction Pattern

- tap card -> open detail
- swipe or segmented control for lane filtering
- sticky top filter bar
- floating action for high-priority actionable cards only

### Mobile Trade Flow

- open actionable card
- review trade summary
- open cockpit
- review exact cost / risk
- approve

The path should feel short but not impulsive.

## Desktop UX

### Desktop Feed

Desktop should support:

- ranked list at left
- research and compare panel center
- cockpit or risk side panel right

### Desktop Superpower

Desktop should be best for:

- comparing 2-4 names
- reading deeper committee arguments
- understanding why one idea outranked another

## Signal Feed Specs

### Feed Composition

- 5-10 ranked alerts
- grouped by lane
- only 1-3 actionable

### Card Content

- coin
- category
- lane
- setup type
- catalyst summary
- confidence
- liquidity grade
- route grade
- hold window
- status

### Optional Expanded Content

- thesis snapshot
- main bear objection
- target
- stop
- expected fee drag
- suggested size

### Sorting And Filtering

The feed should allow:

- all / narrative momentum / research beta
- actionable / watch / reject
- highest confidence
- highest upside
- best execution quality
- newest alert

## Research View Specs

### Required Sections

- What this coin is
- Why it may move now
- Bull case
- Bear case
- Tokenomics and unlock risk
- Event and catalyst context
- Chart and market-structure context
- Robinhood execution note
- Suggested plan

### Debate Visualization

Do not flatten disagreement into a single score.

Show:

- confidence
- disagreement
- what the judge liked
- what the judge did not fully trust

## Trading Cockpit Specs

### Core Elements

- coin and status
- current quote context
- route quality
- order type
- estimated fee / friction
- suggested size
- stop / invalidation
- target / exit framing
- sleeve usage
- approval button

### UX Rules

- cost should be impossible to miss
- blocked states should explain why
- approval CTA should only appear when all checks pass
- if execution quality is weak, that weakness should be visually prominent

## Risk Console Specs

### Required Views

- current sleeve usage
- open risk by position
- lockout state
- max concurrent positions
- current risk budget left
- reasons new trades could be blocked

### Design Principle

The risk console should feel managerial, not alarming. It should communicate control, not panic.

## Journal Specs

### Journal Entries Should Capture

- alert snapshot
- committee verdict
- user action
- entry
- exit
- outcome
- what argument was right
- what argument was wrong

### Journal Utility

It should help answer:

- which lane is working better?
- are meme plays actually outperforming research-beta?
- is the committee too bullish or too skeptical?
- which execution grades are still worth trading?

## State Design

### Loading States

- show feed skeletons
- show per-card research pending state
- avoid blank screens

### Empty States

- "No actionable setups right now" should be treated as a healthy product outcome
- show top watchlist names instead of dead emptiness

### Error States

- distinguish data failure from ranking failure from broker failure
- do not collapse all problems into generic errors

### Blocked States

Blocked states should clearly state the reason:

- poor execution quality
- sleeve cap exceeded
- daily or weekly lockout
- insufficient confidence
- too much committee disagreement

## Notifications

### Notifications Should Be Tiered

- `Actionable alert`
- `Watchlist update`
- `Exit suggested`
- `Risk lockout triggered`

### Notification Rules

- do not notify on every scanned candidate
- only notify on material status changes
- make actionable notifications concise but data-rich

## Accessibility

- use color plus labels, never color alone
- support readable type scales on mobile
- support keyboard navigation on desktop
- ensure motion is not required for comprehension

## Motion And Interaction

- use subtle transitions between feed and detail
- use confident but restrained motion
- do not make the app feel like a casino

## Copy Guidelines

- direct
- skeptical
- calm
- never euphoric
- never imply certainty

Examples:

- good: `Breakout confirmed, but execution quality is only moderate`
- bad: `This coin is going to explode`

## Design Acceptance Criteria

The UI/UX is good enough for v1 when:

- the feed is easy to scan quickly
- the top actionable ideas are obviously distinct
- every actionable trade can be understood in under a minute
- costs and risk are visually clear
- disagreement and uncertainty are visible
- mobile feels natural for triage and approval
- desktop feels natural for research and comparison
