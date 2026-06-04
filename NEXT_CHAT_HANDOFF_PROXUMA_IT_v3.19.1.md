# Next Chat Handoff — Proxuma IT v3.19.1

Locked current baseline: **Proxuma IT v3.19.1 — Public UI Clarity Pass**.

## What v3.19.1 did

- Added visible scanner privacy strip near the scan input.
- Renamed internal labels to public-facing wording, including Details, Enable Online Preview, View Online Boundaries, and Export Local Notes.
- Turned v3.18.0 into a cleaner GitHub/public release candidate.
- Added `README.md` public release language.
- Added `CHANGELOG.md`.
- Added `SECURITY.md`.
- Added `LICENSE`.
- Added current build manifest and release notes.
- Patched QR language so the site does not overclaim Safari/non-native camera fallback.
- Preserved Local Check, offline-first engine, no telemetry, no active API/provider calls, and no active `fetch()` calls.

## Current important rule

Do not claim complete Safari QR camera fallback until a full audited local decoder bundle is embedded into `assets/vendor/jsQR.js` and tested. Manual QR payload/text paste is the reliable supported fallback.

## Next recommended path

1. Push/test v3.19.1 on GitHub Pages.
2. Verify layout, scanner, Local Check, reports, copy/export, and manual QR paste on Safari and Chrome.
3. If deployment is clean, tag it as the public baseline.
4. Next engine-first option: evidence export polish, QR decoder completion, or optional Online Intel planning behind explicit consent.

## Preserve

- Offline-first identity.
- Consent-first Online Intel boundary.
- No hidden network calls.
- Clear public wording.
- Tests and handoff files in working packages.
