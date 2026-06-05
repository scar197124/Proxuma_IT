# Proxuma IT v3.22.3 — Report Snapshot Readability Correction

This patch corrects the compact Scan Report snapshot introduced in v3.22.2.

## Changes

- Keeps the Scan Report metrics compact.
- Prevents the Primary Trigger value from stacking vertically in narrow cells.
- Converts short report facts into compact key/value rows.
- Gives longer values enough horizontal space to read left-to-right.
- Preserves v3.22.1 unified scanner input, v3.21.0 local scan history, and v3.20.0 case packet export.

## Engine

No engine logic changes. Offline-first behavior remains intact.
