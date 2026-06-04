## v3.19.6 — UI Wording Clarity Pass

- Further compressed public UI spacing without changing scanner logic.
- Tightened hero, collapsed guide/drawer/card spacing, and mobile vertical rhythm.
- Preserved visible label deduplication and offline-first/no telemetry behavior.

# Changelog — Proxuma IT

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
