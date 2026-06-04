# Release Notes — Proxuma IT v3.19.1

**Build:** Public UI Clarity Pass

v3.19.1 is a final pre-GitHub UI cleanup pass. It does not change the core offline engine. It makes the public surface cleaner, clearer, and less developer-facing before release.

## Added

- A visible scanner privacy strip: local analysis, no telemetry, no hidden lookups, and online checks off unless chosen.
- Public UI clarity validation test.
- Updated manifest, handoff, and trajectory wording for the v3.19.1 baseline.

## Changed

- Renamed public-facing internal labels:
  - Technical Review → Details
  - Arm Consent Gate → Enable Online Preview
  - Preview Online Scope → View Online Boundaries
  - Clear Online Consent → Clear Online Choice
  - Download Memory JSON → Export Local Notes
  - Download Checklist → Export Checklist
- QR camera wording remains honest: camera scanning is optional and browser-dependent.
- Manual QR payload/text paste remains the reliable offline fallback.
- Online Intel wording stays locked/offline-first without implying active provider checks.

## Preserved

- Offline-first scan engine.
- Local Check sample surface.
- Case packet/export logic.
- Local pattern memory.
- Explicit-choice Online Intel placeholder.
- No telemetry.
- No hidden provider/API calls.
- No active `fetch()` calls.

## Known limitation

The packaged `assets/vendor/jsQR.js` remains a guardrail placeholder, not the complete audited QR decoder bundle. Native QR camera scanning can work where the browser supports `BarcodeDetector`; otherwise manual QR text paste remains the supported fallback.
