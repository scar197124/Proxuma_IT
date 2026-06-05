# Proxuma IT — Trajectory Next Steps

**Current live-ready baseline:** Proxuma IT v3.22.6 — Report View Centered Balance  
**Purpose:** Keep Proxuma IT evolving carefully without breaking the stable offline-first scanner.

## Current foundation

Proxuma IT currently includes:

- Universal scanner input for URLs, domains, IP addresses, QR payload text, suspicious messages, and snippets.
- Offline-first analysis with no hidden telemetry, no hidden online lookups, and no active provider/API calls.
- Local scan history stored only in the user's browser.
- TXT and JSON case packet export.
- Centered Report View controls with User View / Analyst View and deeper evidence controls underneath.
- Compact scan report snapshot with readable trigger, signal count, input type, and report time.
- Footer-only return path back to the canonical PROXUMA homepage.

## Recommended next evolution order

### v3.23.0 — Built-in Sample Training Mode
Add a small `Try Examples` section so first-time users can test the app without inventing their own links.

Suggested sample buttons:

- Safe URL example
- PayPal lookalike login example
- OTP/account suspension message
- Suspicious QR payload
- Shortened-link / redirect example

Goal: turn Proxuma IT into both a scanner and a teaching tool.

### v3.24.0 — Confidence Explanation Tuning
Improve how Proxuma explains confidence, uncertainty, and why a result is high/medium/low risk.

Suggested additions:

- “Why this confidence?” microcopy
- Better distinction between strong evidence and caution-only evidence
- Cleaner explanations for safe-looking but incomplete signals

### v3.25.0 — Report Polish + Print View
Make exported evidence and on-screen reports easier to print or share.

Suggested additions:

- Print-friendly case summary
- Better report headings
- Compact printable TXT layout
- Optional copy summary for normal users

### v3.26.0 — QR Camera Readiness Pass
Keep QR camera support honest and browser-dependent.

Suggested additions:

- Clear QR camera support note
- Manual QR payload fallback first
- Do not claim universal camera scanning until full audited decoder support is bundled

### v3.30.0 — Optional Online Intel Architecture
Only after offline core is stable. Any online intelligence must remain explicit and user-controlled.

Suggested signals:

- Domain age
- Certificate info
- Redirect expansion
- Reputation lookup
- Known threat feeds

Required rule: no online lookup unless the user chooses it.

## Maintenance rules

- Do not add features just to keep GitHub active.
- Prefer one meaningful release at a time.
- Preserve offline-first identity.
- Keep the canonical PROXUMA return path in the footer only unless design changes are intentional.
- Keep one universal scanner input unless user testing proves otherwise.
- Do not reintroduce duplicate labels or duplicate return buttons.
- Avoid heavy UI changes unless the live page shows a real problem.

## Push discipline

For GitHub pushes:

1. Unzip the deploy package.
2. Open the inner folder.
3. Upload/push the contents of the inner folder to the `Proxuma_IT` repo root.
4. Confirm the repo root directly contains `index.html`, `proxuma-it.js`, `styles.css`, `assets/`, `tests/`, `docs/`, and project docs.
5. Test live page after GitHub Pages updates.

## Current recommended next build

**Next build:** v3.23.0 — Built-in Sample Training Mode

Reason: it helps new visitors understand Proxuma IT immediately without risking the scanner engine.
