# Proxuma IT v3.44.0 — Next Handoff

## Locked baseline

Version 3.44.0 is the stable design foundation. Do not begin the next phase by changing spacing, adding panels, or creating more buttons. First validate what the product can truthfully do and what users actually understand.

## Product direction

Proxuma should become a **trust-centered investigation assistant**, not simply another scanner with more alerts.

Its most valuable differentiators are:

1. **Observed evidence separated from interpretation**
2. **Confidence stated clearly**
3. **Reasoning and limitations explained**
4. **A case file that preserves investigation context**
5. **Actionable remediation instead of unexplained warnings**

## Next best phase: Validation and Boundaries

### 1. Build a capability matrix

For every scanner feature, document:

- Input accepted
- What is actually inspected
- Data source used
- Browser or network limitation
- Output produced
- Confidence method
- Failure state
- Privacy implications
- Whether the capability is Observed, Inferred, User supplied, External intelligence, Unavailable, or Guidance

Do not ship a claim that cannot be placed in this matrix.

### 2. Perform a technical review

Ask a JavaScript and web-security reviewer to examine:

- Scanner logic and evidence generation
- Input handling and output escaping
- DOM injection risks
- Local-storage behavior
- Export safety
- Network requests and third-party dependencies
- Permission and authorization language
- False-positive and false-negative risks
- Whether labels accurately describe the underlying capability

Use GitHub issues or pull requests so the review becomes visible professional evidence.

### 3. Run first-time-user tests

Give the app to 3–5 people without explaining it first. Ask them to:

1. Identify what Proxuma does.
2. Enter a permitted target.
3. Run an analysis.
4. Explain the main result.
5. Find the supporting evidence.
6. Open Deep Analysis.
7. Create or review a Case File.
8. Save or export the result.

Record where they hesitate, misinterpret a label, or cannot find the next action. Fix repeated problems, not individual preferences.

### 4. Define the result model

Create one shared schema for every finding:

- Finding title
- Severity
- Confidence
- Evidence source
- Observed fact
- Interpretation
- Limitation
- Recommended action
- Remediation status
- Timestamp

Metrics, Supporting Evidence, Deep Analysis, Case File, and Export should all read from this same model. This prevents duplicated or conflicting information.

### 5. Add tests before features

Prioritize:

- Empty-state tests
- Long-content overflow tests
- Mobile navigation tests
- Selector-state tests
- Export consistency tests
- Local-storage recovery tests
- Unsafe-input tests
- Accessibility keyboard tests

A new feature should not enter the product unless its failure behavior is known.

## Recommended release sequence

### v3.44.1 — Stability and accessibility

- Keyboard navigation audit
- Focus visibility
- Screen-reader labels
- Mobile overflow and internal-scroll verification
- Empty, loading, error, and long-result states
- No feature additions

### v3.45.0 — Unified finding model

- One canonical finding schema
- Evidence labels and confidence levels
- Consistent rendering across all views
- Consistent exports

### v3.46.0 — Reviewer-ready validation build

- Capability matrix included
- Technical limitations visible
- Test fixtures and expected results
- Security review checklist
- Issue templates for reviewers

### v3.47.0 — Real-world workflow refinement

Only after user tests:

- Improve the top three repeated navigation problems
- Remove unused controls
- Refine remediation workflow
- Improve case-file continuity

## Features to avoid for now

- More dashboards
- More nested cards
- Additional Open/Close controls
- Unverified threat-intelligence claims
- AI-generated certainty without evidence labels
- Accounts, cloud sync, or backend storage before privacy and security design
- Paid plans before the core workflow is validated

## Professional portfolio path

To make Proxuma useful for career opportunities, maintain:

- A clear README explaining the problem and boundaries
- Screenshots or a short demonstration
- A public roadmap
- Meaningful GitHub issues
- Reviewable pull requests
- A security policy
- A capability matrix
- Test evidence
- A brief case study describing design decisions and lessons learned

Employers and collaborators often value disciplined reasoning, honest limitations, iteration, documentation, and response to review as much as raw feature count.

## Decision rule

Before any future change, answer:

1. What user problem does this solve?
2. What existing control already serves that purpose?
3. What evidence proves users need it?
4. What is the failure state?
5. How will it be tested?
6. Does it strengthen Proxuma's trust-centered differentiation?

When those answers are unclear, do not build the feature yet.
