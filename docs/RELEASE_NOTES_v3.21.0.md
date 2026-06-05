# Proxuma IT v3.21.0 — Local Scan History

This release adds a local-only scan history layer to Proxuma IT.

## Added

- Recent scans are automatically stored in browser local storage.
- Local history entries show risk level, score, input type, primary trigger, time, target/root, and compact evidence.
- Each history item can be loaded/rechecked, copied as a readable local result, or deleted.
- The Case File section now includes Clear Local History and Clear All Local Data controls.

## Privacy boundary

Local Scan History stays on the current device/browser only. It does not create an account, sync to a cloud service, call an API, run telemetry, or perform a hidden lookup.

## Preserved

- Offline-first scanner behavior.
- v3.20.0 TXT and JSON case packet exports.
- v3.19.10 mobile Scan Mode density.
- Footer-only return path to canonical PROXUMA.
- No active fetch/provider/API calls.
