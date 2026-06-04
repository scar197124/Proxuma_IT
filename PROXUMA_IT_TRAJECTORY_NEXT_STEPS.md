# Proxuma IT Trajectory / Next Steps

Current baseline: **Proxuma IT v3.19.1 — Public UI Clarity Pass**

## Locked identity

Proxuma IT is an offline-first link, QR text, download, and message intelligence tool. Its purpose is to explain warning signs before a user trusts a link or payload.

## Current public rules

- Keep analysis offline by default.
- Do not add hidden network/API calls.
- Do not add telemetry.
- Online Intel must remain explicit user-consent only.
- Keep the UI readable and public-facing; avoid developer/test-bench wording in visible surfaces.
- Keep Local Check available for confidence testing, but phrase it as user-facing local checking.
- Keep manual QR payload/text paste as the reliable QR fallback.
- Do not claim full Safari/non-native QR camera fallback until a complete audited local decoder is embedded and tested.
- Use SHA-256 seals for milestone/GitHub packages.

## Next build options

### Option A — GitHub live validation patch
Use this if GitHub Pages shows any layout/path/camera issue.

- Patch only the issue found live.
- Do not add new engine lanes during deployment stabilization.
- Release as v3.19.2 if a live-host patch is needed.

### Option B — QR decoder completion
Use this when ready to complete Safari/non-native camera scanning.

- Embed a complete audited local QR decoder bundle in `assets/vendor/jsQR.js`.
- Keep it local; no CDN.
- Add QR decoder regression/browser notes.
- Test Safari, Chrome, and mobile.

### Option C — Evidence export polish
Use this if the next goal is more professional case output.

- Improve copied case packet formatting.
- Add a clean human-readable evidence summary.
- Keep JSON export local.
- Avoid collecting private user data.

### Option D — Online Intel planning layer
Use this only after the offline release is stable.

- Keep Online Intel locked by default.
- Add clear user consent flow before any provider call.
- Start with domain age, certificate, redirect chain, and reputation planning.
- No automatic background lookup.

## Current caution

`assets/vendor/jsQR.js` is a guardrail placeholder, not the full QR decoder bundle. Manual QR text paste is the supported fallback in browsers without native QR camera support.
