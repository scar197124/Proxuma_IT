## v3.24.0 — No-New-Cards Guardrails

- Added feature map and duplicate-prevention guardrails.
- Added regression test to prevent obvious duplicate UI lanes/cards.
- No public UI cards added.

## v3.22.2 — Compact Scan Report Metrics

## v3.22.4 — Snapshot Chip Border Wrap
- Added subtle privacy-strip-style borders around Scan Center input chips and Report Snapshot values.
- Kept Primary Trigger readable left-to-right while improving separation.
- No engine logic changes.

- Combined short Scan Report metadata into one compact Report Snapshot panel.
- Preserved report IDs and engine logic while reducing empty card space.


## v3.22.0 — QR / Manual Payload UX Upgrade

- Added Manual Payload Helper for decoded QR text, copied message text, and raw payloads.
- Added Load to Target, Scan Payload, and Clear Payload actions.
- Preserved offline-first behavior, local history, case packet export, and no hidden online calls.

# Changelog

### v3.22.5 — Report View Space Cleanup
- Tightened the Report View area into a compact full-width toolbar.
- Removed duplicate active-view text and reduced empty space beside the selector.
- Preserved scan engine, exports, history, offline-first behavior, and v3.22.4 border polish.


## v3.20.0 — Case Packet Export

- Added `Download TXT` inside Signal Evidence for readable local case reports.
- Kept existing `Download JSON` for structured evidence packets.
- Added a local-only TXT packet containing verdict, target, primary trigger, evidence, user steps, preservation checklist, and privacy boundary.
- Preserved offline-first behavior, no telemetry, no hidden online calls, and v3.19.10 mobile Scan Mode density.

## v3.19.6 — UI Wording Clarity Pass

- Further compressed public UI spacing without changing scanner logic.
- Tightened hero, collapsed guide/drawer/card spacing, and mobile vertical rhythm.
- Preserved visible label deduplication and offline-first/no telemetry behavior.

# Changelog — Proxuma IT

## v3.19.10 — Mobile Scan Mode Button Density
- Compact mobile-only Scan Mode pills so Quick Scan, Deep Local Scan, and Optional Online Preview no longer dominate phone screens.
- Desktop layout unchanged.
- Engine logic unchanged.

## v3.19.3 — Compact UI Density Pass

- Compact hero section vertical spacing while preserving the Proxuma IT identity.
- Tighten collapsed App Guide and Deep Analysis cards so the scanner feels cleaner.
- Reduce drawer/tab/panel spacing conservatively for better mobile rhythm.
- Preserve offline-first engine behavior, no hidden lookups, no telemetry, and v3.19.2 UI deduplication.

## v3.19.2 — UI Deduplication / Public UI Clarity Pass

- Added visible scanner privacy strip near the input.
- Renamed internal/developer-facing UI labels to public-facing language.
- Kept Online Intel clearly inactive and optional.
- Added clean public README language.
- Added `SECURITY.md`.
- Added `LICENSE`.
- Added this `CHANGELOG.md`.
- Added `BUILD_MANIFEST_v3.19.2.md`.
- Added `NEXT_CHAT_HANDOFF_PROXUMA_IT_v3.19.2.md`.
- Added `docs/RELEASE_NOTES_v3.19.2.md`.
- Patched QR wording so camera scanning is described honestly as browser-dependent.
- Preserved manual QR payload/text paste as the reliable offline fallback.
- Preserved offline-first behavior: no telemetry, no active provider/API calls, and no active `fetch()` calls.
- Preserved Local Check sample functionality without developer-facing lab language in the public UI.

## v3.18.0 — Public UI Cleanup / Local Sample Check

- Reworded the visible Local Check surface so it no longer looked like a developer test bench.
- Kept built-in local sample checks.
- Preserved offline-first behavior and no active online provider.


## v3.19.7 Canonical Link Patch

Adds a clean link back to the canonical PROXUMA homepage while preserving offline-first scanning and existing engine behavior.


## v3.19.8 Return to Canonical Path
- Added a compact return-to-PROXUMA ecosystem card near the bottom of the scanner flow so IP, URL, QR, and message checks do not feel like a dead end.
- Preserved the v3.19.7 canonical link, v3.19.6 wording clarity, v3.19.5 message trigger tuning, compact UI, and offline-first behavior.


## v3.19.9 — Single Return Path Cleanup

- Removed duplicate PROXUMA return links from the compact header and hero section.
- Preserved the footer ecosystem return card and `← PROXUMA Home` button as the single visible return path.
- Preserved v3.19.8 canonical navigation, v3.19.6 wording clarity, v3.19.5 message trigger tuning, compact UI, and offline-first/no-telemetry behavior.

## v3.21.0 — Local Scan History
- Added browser-local scan history for recent scans.
- Recent scans are saved on-device only, with no telemetry, account sync, or hidden online lookup.
- Added View Previous Scan, Copy Previous Result, Delete, Clear Local History, and Clear All Local Data controls.
- Preserved v3.20.0 readable TXT case packet export and structured JSON packet export.
- Preserved the compact mobile Scan Mode controls and footer-only return path to canonical PROXUMA.


## v3.22.3 — Report Snapshot Readability Correction

- Corrected the compact Scan Report snapshot layout after v3.22.2 made Primary Trigger text too narrow on some screens.
- Preserved the compact report direction while making Next Step, Primary Trigger, Input Type, Signal Count, and Report Time easier to read left-to-right.
- No scanner engine logic changes.
