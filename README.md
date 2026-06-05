# Proxuma IT v3.19.6 — UI Wording Clarity Pass

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
- This v3.19.6 package keeps a local guardrail file there, not a full decoder bundle. That means Safari/non-native fallback should be treated as incomplete until a full audited decoder is embedded.
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
BUILD_MANIFEST_v3.19.6.md
NEXT_CHAT_HANDOFF_PROXUMA_IT_v3.19.6.md
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
node tests/test_engine_v3192_compact_ui_density_pass.js
```

## Safety note

Proxuma IT does not guarantee that a link is safe or unsafe. It provides local risk analysis, warning signs, and guidance. Users should still verify important links through official typed websites, known apps, or trusted contacts.


## v3.19.7 Canonical Link Patch

Adds a clean link back to the canonical PROXUMA homepage while preserving offline-first scanning and existing engine behavior.


## v3.19.8 Return to Canonical Path
- Added a compact return-to-PROXUMA ecosystem card near the bottom of the scanner flow so IP, URL, QR, and message checks do not feel like a dead end.
- Preserved the v3.19.7 canonical link, v3.19.6 wording clarity, v3.19.5 message trigger tuning, compact UI, and offline-first behavior.


### v3.19.9 navigation note

The Proxuma IT page now keeps one clean return path back to the canonical PROXUMA ecosystem using the footer `← PROXUMA Home` button. Header and hero duplicate return links were removed to reduce visual repetition.

## Case Packet Export

After running a scan, open **Signal Evidence** to save the result locally:

- **Download TXT** creates a readable case report for sharing or record keeping.
- **Download JSON** creates a structured evidence packet for future Proxuma tools or analyst review.

Both exports are generated locally in the browser. No API call, telemetry, hidden lookup, or online expansion is required.


## v3.21.0 Local Scan History

Proxuma IT now keeps a small local scan history on the current browser/device. Recent checks can be loaded again, copied as a readable result, deleted individually, or cleared entirely. This history is local-only: it does not sync to an account, send telemetry, or run hidden online lookups.


## v3.22.2 UI Note
The Scan Report quick facts are now consolidated into a compact Report Snapshot panel so short values like signal count, input type, trigger, and report time do not waste card space.


## v3.22.3 — Report Snapshot Readability Correction

Refines the Scan Report snapshot so short facts stay compact while longer values such as Primary Trigger and Next Step read left-to-right instead of stacking vertically on narrow screens. Engine logic remains unchanged.

### v3.22.4 Snapshot Chip Border Wrap
Small Scan Report values and accepted input chips now use subtle matching borders for clearer visual separation without adding extra layout weight.



### v3.22.5 — Report View Space Cleanup
- Tightened the Report View area into a compact full-width toolbar.
- Removed duplicate active-view text and reduced empty space beside the selector.
- Preserved scan engine, exports, history, offline-first behavior, and v3.22.4 border polish.
