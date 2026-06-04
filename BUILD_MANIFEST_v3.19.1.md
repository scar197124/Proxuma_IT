# Build Manifest — Proxuma IT v3.19.1

**Build name:** Public UI Clarity Pass

## Deploy root

Upload the contents of this folder to GitHub Pages or another static host. Do not upload the outer ZIP wrapper as the site root.

## Core files

- `index.html`
- `proxuma-it.js`
- `styles.css`
- `assets/`
- `README.md`
- `CHANGELOG.md`
- `SECURITY.md`
- `LICENSE`
- `docs/RELEASE_NOTES_v3.19.1.md`
- `tests/`

## Privacy / network boundary

- Offline-first scan engine.
- No active `fetch()` calls.
- No telemetry.
- No active provider/API bridge.
- Online Intel remains a consent-gated architecture placeholder only.

## QR boundary

- Manual QR payload/text paste is supported offline.
- Native camera QR scanning is browser-dependent.
- `assets/vendor/jsQR.js` remains a guardrail placeholder, not the full audited decoder bundle.
- Safari/non-native camera fallback should not be advertised as complete until the real decoder bundle is embedded and tested.

## Validation performed

- `node --check proxuma-it.js`
- confidence harness
- case packet hardening
- red-team hardening preservation
- GitHub slim continuity
- public UI clarity verification
- privacy strip and public-label sweep
