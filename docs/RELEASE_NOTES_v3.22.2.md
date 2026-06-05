# Proxuma IT v3.22.2 — Compact Scan Report Metrics

This patch compresses the Scan Report metadata area so short values no longer occupy oversized cards.

## Changed
- Replaced separate Next Step / Signal Count / Primary Trigger cards with one compact Report Snapshot panel.
- Combined Signal Count, Input Type, Primary Trigger, and Report Time into small quick-fact cells.
- Kept Next Step prominent but smaller.
- Preserved existing IDs so engine/report rendering continues to work.
- Kept mobile-friendly wrapping with two-column quick facts on phones.

## Preserved
- v3.22.1 unified scanner input.
- v3.21.0 local scan history.
- v3.20.0 TXT/JSON case packet export.
- Offline-first behavior, no telemetry, no hidden lookups.
