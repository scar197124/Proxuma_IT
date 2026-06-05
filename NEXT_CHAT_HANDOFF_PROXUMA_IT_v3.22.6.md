# Next Chat Handoff — Proxuma IT v3.22.6

Use this file when restarting work in a new chat.

## Locked baseline

**Proxuma IT v3.22.6 — Report View Centered Balance**

This baseline should be treated as the current push-ready/stable package unless the user provides a newer live file.

## Current state

- Universal scanner input is active.
- Manual Payload Helper second input was removed.
- Report Snapshot is compact and readable.
- Signal Count, Trigger, Input Type, and Report Time are wrapped with subtle chip borders.
- Report View is centered at the top of its card.
- User View and Analyst View are centered under Report View.
- Deeper Evidence / Technical Notes are centered underneath.
- TXT and JSON case packet export exist.
- Local Scan History exists and remains browser-local.
- Footer-only PROXUMA Home return path is preserved.
- Offline-first behavior is preserved.

## Do not regress

- Do not re-add a second scanner input.
- Do not re-add multiple PROXUMA Home buttons.
- Do not make report metrics narrow enough that trigger text stacks vertically.
- Do not add hidden online/API calls.
- Do not remove local history clear/delete controls.
- Do not remove TXT/JSON export.

## Recommended next upgrade

Build **v3.23.0 — Built-in Sample Training Mode**.

Suggested samples:

- Safe URL
- PayPal lookalike phishing URL
- Account suspension / OTP theft message
- Suspicious QR payload text
- Shortener / redirect example

The samples should load into the universal scanner input and optionally scan immediately.

## Current GitHub push note

Push the contents of the package folder to the `Proxuma_IT` repo root. The root should directly contain:

- `index.html`
- `proxuma-it.js`
- `styles.css`
- `assets/`
- `tests/`
- `docs/`
- `README.md`
- `CHANGELOG.md`
- `SECURITY.md`
- `LICENSE`
