# PROXUMA IT UI 1.0 RC-4 — Analysis Render Fuse Fix

## Release blocker fixed
- Fixed the JavaScript render interruption that allowed the main score to update while Analysis View remained on “Awaiting scan.”
- Added guarded handling for optional legacy `scanMode` and `scanModeNote` fields.
- Added hidden compatibility fields as a second safety layer.
- Example, manual Analyze Link, Enter-key, and QR paths continue through the unified scan engine.

## Test
1. Load the app fresh.
2. Run a sample example or manually paste a URL and select Analyze Link.
3. Without touching another Analysis View tab, confirm Why This Score updates immediately.
4. Confirm Trust Timeline, Threat Story, and Decision Guide are already populated when opened.
