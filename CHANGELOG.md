# Changelog

## v3.53.3 — Mobile Viewport Containment

- Removed the Step 5 Focus control from phone layouts at the JavaScript source.
- Added hard viewport containment for all Step 5 cards and controls.
- Prevented inherited desktop positioning, transforms, and widths from shifting the mobile workspace.
- Preserved desktop Focus mode and the full-width desktop Findings layout.


## v3.53.3 — Desktop Width Balance

- Expanded the primary Findings workspace across the full Step 5 card on desktop.
- Kept Save and Explain in balanced secondary columns.
- Let Export use the full row for clearer report actions.
- Preserved the v3.53.1 iPhone portrait accordion and width constraints.

## v3.53.1 — iPhone Portrait Repair

- Rebuilt Step 5 around a simple-by-default, powerful-on-demand model.
- Added mobile accordions for Findings, Save or Compare, Explain, and Export or Reset.
- Kept Findings open by default while collapsing secondary tools on phones.
- Replaced technical labels with clearer everyday language.
- Added a compact mobile shortcut bar and horizontally scrollable progress, severity, and filter controls.
- Combined trust-boundary explanations into one optional disclosure.
- Preserved all existing scanner, session, explanation, export, and reset control IDs and behavior.

## v3.52.2 — Learning Clarity

- Renamed the static “Learning Mode” description to “Plain-language guidance” because it is not a selectable mode.
- Renamed the result-level “Learning Note” to “Safety Takeaway.”
- Clarified that the guidance card explains presentation behavior, while the takeaway is generated from each scan.
- Removed the duplicate Interpreted / Why it matters card from the guided summary.
- Kept the existing report-level Why it matters explanation as the single source of truth.
- Simplified the guided boundary layout to Observed and Not verified.
- Preserved confidence, recommended next action, supporting evidence, scanner scoring, and evidence logic.

## v3.52.0 — Guided Results + Indexing Foundation
- Added a plain-language guided result summary.
- Separated observed evidence, local interpretation, and unverified external facts.
- Added confidence and recommended next action cues.
- Made technical finding evidence collapsible.
- Added canonical, Open Graph, robots.txt, and sitemap.xml support.

## v3.50.0 — Validation Foundation

- Added a current capability matrix covering inspected inputs, evidence sources, limitations, and privacy behavior.
- Added a keyboard-visible “Skip to scanner” entry point and a focusable main region.
- Connected the universal scanner input to its live detection status and help text.
- Corrected the hero product mark from “Proxuma ID” to “Proxuma IT.”
- Added a current v3.50.0 regression test instead of relying only on historical version-pinned tests.
- Updated release metadata across the app, README, and optional RDAP bridge.
- Preserved scanner rules, storage keys, exports, and consent boundaries.


## v3.49.0 — Stable Code Cleanup

- Removed an unused embedded release-roadmap array from the production scanner script.
- Removed dead internal build-banner and offline sample-lab code whose UI no longer exists.
- Removed stale DOM references to deleted developer-only controls.
- Aligned current release metadata across the app, documentation, exports, and optional RDAP bridge.
- Preserved storage keys and case-packet schema identifiers for backward compatibility.
- Preserved the working v3.48.1 responsive layout and scan behavior.
