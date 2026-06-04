# Security Policy — Proxuma IT

## Supported release

The current public baseline is **Proxuma IT v3.19.2**.

## Reporting a concern

Please report security concerns through the GitHub repository issues/discussions for this project, using a clear title such as:

```text
Security concern: [short description]
```

Avoid posting real passwords, private keys, personal documents, or sensitive account details in public reports.

## Project security boundary

Proxuma IT v3.19.2 is a static, offline-first browser tool:

- no active online intelligence provider;
- no telemetry;
- no hidden API calls;
- no active `fetch()` calls;
- camera access only after the user presses **Start QR Scan**;
- manual QR payload/text paste works without camera access.

## Known limitation

`assets/vendor/jsQR.js` is currently a guardrail placeholder, not the full audited QR decoder bundle. Browsers without native QR support may not support camera QR scanning until a full local decoder is embedded. Manual QR text paste remains the supported fallback.
