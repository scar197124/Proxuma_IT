## v3.29.1 — Example Lane Consolidation

- Consolidated public examples into one Scan Center example lane.
- Removed the duplicate Deep Analysis Sample Lab UI to avoid two example systems.
- Preserved Online Intel readiness and Vercel RDAP bridge prototype files.
- Fixed a duplicate `timelineStatus` id in the Deep Analysis timeline panel.
- No hidden online calls, telemetry, frontend API keys, or automatic provider lookups were added.


## v3.29.0 — Vercel RDAP Bridge Prototype

- Added first serverless Online Intel prototype: `api/proxuma-rdap.js`.
- Added Vercel function configuration in `vercel.json`.
- Added RDAP bridge and Vercel deploy documentation.
- Static frontend remains offline-first: no automatic fetch calls and no frontend API keys.


## v3.26.4 — Deep Analysis Collapse Fix

- Fixed a UI-only collapse regression where the Deep Analysis inner drawer could remain visible after hiding the card.
- Ensured tabs, panel stage, active panel, and scroll cue are fully removed from layout when collapsed.
- Preserved v3.26.3 Case File scroll-lock behavior.
- No engine/scoring changes and no new public cards.


## v3.26.3 — Case File Scroll Lock
- Locked Case File / Local Scan History height.
- Added internal scrolling for saved scans and notes.
- Added external scroll cue outside the Case File body.
- Preserved engine behavior and no-new-cards discipline.

## v3.26.1 — Deep Analysis Drawer Usability Pass
- Expanded the inner Deep Analysis drawer stage while keeping the outer card size stable.
- Renamed the duplicate Deep Analysis "Local Check" tab to "Sample Lab" to avoid duplicate local-check wording.
- Moved the scroll cue outside the inner scrolling panel so it no longer crowds drawer content.
- No engine, scoring, network, telemetry, or provider behavior changed.


## v3.25.0 — Online Intel Launchpad

- Added consent-gated Online Intel launchpad inside the existing Online Intel drawer.
- Generates user-opened external lookup links only after consent is armed.
- Preserved offline-first behavior, no hidden fetch/API/background calls, and no new public cards.

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

## v3.24.1 — Domain Ending Spoof + Comma Domain Tuning

- Added engine-only detection for dot-com ending lookalikes such as `.c0m` / `.c0n`-style endings.
- Added engine-only detection for comma-domain tricks such as `bank,com` where a comma imitates a dot.
- Added the new signals into the existing evidence flow and Link Anatomy risk tokens.
- Preserved the no-new-cards guardrail: no additional public UI cards were added.
- Preserved offline-first behavior: no telemetry, no active provider/API calls, and no active network lookups.


## v3.25.1 — Online Intel Results Notes

- Added user-entered Online Intel findings notes inside the existing Online Intel drawer.
- Included notes in TXT and JSON case exports.
- Included notes in local scan history records.
- Preserved no-new-cards guardrail and no hidden online calls.

## v3.26.0 — Online Intel Provider Architecture

Maps future Online Intel provider slots inside the existing Online Intel drawer: Domain Age/RDAP, Certificate Transparency, Redirect Expansion, Reputation Lookup, and Threat Feed Check. These slots are inactive architecture only. No provider API calls, hidden fetch calls, telemetry, automatic lookups, or frontend API keys are included.
## v3.27.0 — Online Intel Readiness Layer

- Added an Online readiness status layer inside the existing Online Intel drawer.
- Shows Online mode, consent status, provider slot readiness, API-key safety, serverless bridge status, and network activity state.
- Keeps all provider calls inactive and consent-gated.
- Preserves no-new-cards discipline and no hidden online calls.
- Preserves v3.26.4 Deep Analysis collapse fix and Case File scroll lock behavior.



## v3.28.0 — Serverless Bridge Blueprint

- Added serverless bridge blueprint documentation for future Online Intel provider calls.
- Added provider contract and privacy rules documentation.
- Updated Online Intel readiness copy to show the bridge is blueprint-ready but not connected.
- Preserved no hidden calls, no telemetry, no frontend API keys, no automatic provider lookup, and no-new-cards discipline.

## v3.29.4 — Encoded Risk Token Alignment

- Surfaced percent-encoded login/security/redirect markers inside existing Link Anatomy Risk Tokens.
- Added encoded slash/path, encoded query/parameter, encoded credential/MFA, encoded embedded URL, and double-encoded markers.
- Preserved RDAP fallback/host awareness, consent-gated online behavior, and no-new-cards discipline.

