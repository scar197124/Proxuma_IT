# Changelog

## v3.52.2 — Learning Clarity
- Renamed the static “Learning Mode” description to “Plain-language guidance” because it is not a selectable mode.
- Renamed the result-level “Learning Note” to “Safety Takeaway.”
- Clarified that the guidance card explains presentation behavior, while the takeaway is generated from each scan.
- Scanner scoring and evidence logic are unchanged.

## v3.52.2 — Guided Results Deduplication Patch

- Removed the duplicate Interpreted / Why it matters card from the guided summary.
- Kept the existing report-level Why it matters explanation as the single source of truth.
- Simplified the guided boundary layout to Observed and Not verified.
- Preserved confidence, recommended next action, and supporting evidence.

# Changelog

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
