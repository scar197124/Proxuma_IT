# Proxuma IT v3.19.1 — Public UI Clarity Pass

Proxuma IT is an offline-first link and message intelligence tool. It helps people review suspicious URLs, domains, QR text, download links, copied messages, and scam-style prompts before trusting them.

## What Proxuma IT does

- Runs local risk analysis in the browser.
- Explains warning signs in plain language.
- Checks for lookalike brands, pressure tactics, suspicious redirects, executable/download traps, credential-harvest intent, payment lures, delivery/customs lures, government/tax/legal threats, fake security alerts, job scams, crypto/investment scams, OTP/MFA code theft, and other modern scam patterns.
- Creates local reports and case-packet style summaries.
- Keeps Online Intel locked behind a consent-first architecture placeholder. No provider is active in this release.

## Privacy boundary

This public release is designed to stay local by default.

- No active `fetch()` calls.
- No telemetry.
- No hidden provider/API lookup.
- No background online reputation check.
- Scan text is analyzed in the browser.
- Local pattern memory stays in the browser storage unless the user clears it.

## QR support honesty

Proxuma IT supports manual QR payload/text paste offline everywhere.

Camera QR scanning is browser-dependent:

- Browsers with native `BarcodeDetector` support can scan locally after the user presses **Start QR Scan** and grants camera permission.
- Browsers without native QR support need a complete audited local decoder bundle in `assets/vendor/jsQR.js`.
- This v3.19.1 package keeps a local guardrail file there, not a full decoder bundle. That means Safari/non-native fallback should be treated as incomplete until a full audited decoder is embedded.
- Manual QR text paste remains the reliable fallback.

## How to run locally

Open `index.html` in a browser, or serve the folder with a local static server.

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Deploy to GitHub Pages

Upload the contents of this folder to the repository root:

```text
index.html
proxuma-it.js
styles.css
assets/
README.md
CHANGELOG.md
SECURITY.md
LICENSE
BUILD_MANIFEST_v3.19.1.md
NEXT_CHAT_HANDOFF_PROXUMA_IT_v3.19.1.md
docs/
tests/
```

## Validation

Run these before public push:

```bash
node --check proxuma-it.js
node tests/test_engine_v3130_confidence_harness.js
node tests/test_engine_v3140_case_packet_hardening.js
node tests/test_engine_v3151_redteam_hardening.js
node tests/test_engine_v3160_github_slim_rc.js
node tests/test_engine_v3180_public_ui_cleanup.js
node tests/test_engine_v3191_public_ui_clarity_pass.js
```

## Safety note

Proxuma IT does not guarantee that a link is safe or unsafe. It provides local risk analysis, warning signs, and guidance. Users should still verify important links through official typed websites, known apps, or trusted contacts.
