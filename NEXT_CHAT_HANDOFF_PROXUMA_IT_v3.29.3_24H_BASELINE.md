# Proxuma IT v3.29.3 — 24-Hour GitHub Baseline Handoff

Status: ready-to-push / 24-hour breathing baseline.

This package should be treated as the current Proxuma IT working baseline after the RDAP fallback and host-awareness polish.

## What is included

- Offline-first scanner remains intact.
- Red-team detection tuning remains intact.
- Unified scanner input remains intact.
- Link Anatomy remains intact and compact.
- Local Scan History remains intact.
- TXT/JSON Case Packet export remains intact.
- Deep Analysis collapse behavior remains fixed.
- Case File scroll-lock remains fixed.
- Example lanes are consolidated into one public example lane.
- Online Intel provider architecture remains present.
- Vercel RDAP bridge prototype remains present.
- Consent-gated RDAP frontend wiring remains present.
- RDAP host-awareness/fallback messaging is present for GitHub Pages/local file previews.

## Online Intel rule

No hidden lookups. No telemetry. No frontend API keys. RDAP only runs on a serverless-capable host and only after user consent + click.

## Next recommended continuation

After this baseline breathes for 24 hours, resume with one of these lanes:

1. Validate live GitHub Pages behavior and confirm RDAP fallback messaging is clear.
2. Deploy the same package to Vercel for RDAP bridge testing.
3. Build the next serverless provider only after RDAP behavior is confirmed.
4. Avoid new public cards unless absolutely necessary.

## Push reminder

Upload the contents inside the package folder directly to the Proxuma_IT repository root. Do not upload the outer folder itself.
