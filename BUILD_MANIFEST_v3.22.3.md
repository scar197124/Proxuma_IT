# Build Manifest — Proxuma IT v3.22.3

Build: Report Snapshot Readability Correction
Base: Proxuma IT v3.22.2 Compact Scan Report Metrics

## Purpose

Fix the Scan Report snapshot so compact metric values do not waste space, while longer fields like Primary Trigger and Next Step remain readable left-to-right.

## Changed Files

- styles.css
- README.md
- CHANGELOG.md
- docs/RELEASE_NOTES_v3.22.3.md
- tests/test_engine_v3223_report_snapshot_readability.js

## Preserved

- Scanner engine
- Unified scanner input
- Local scan history
- TXT/JSON case packet export
- Footer-only return to canonical PROXUMA
- Offline-first/no telemetry/no hidden lookup posture
