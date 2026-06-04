# Release Notes — Proxuma IT v3.19.3

## Compact UI Density Pass

This patch cleans the public interface after the v3.19.1 clarity pass. It removes repeated visible label chips and repeated panel headings that made the UI feel heavier than necessary.

## What changed

- Reduced repeated visible labels for Scan Center, Scan Report, Deep Analysis, Case File, Explain Why, Trust Timeline, Threat Story, Decision Guide, Online Intel, and Local Check.
- Kept each feature as a single reachable control or section.
- Preserved the local/offline scan engine.
- Preserved QR honesty language and manual QR payload fallback.
- Preserved consent-gated online architecture wording with no hidden live calls.

## Validation

- `node --check proxuma-it.js` passed.
- Existing regression tests passed.
- Added v3.19.3 UI deduplication test passed.
