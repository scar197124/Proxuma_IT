# PROXUMA IT UI 1.0 RC-2 — Master Dashboard Sync

## Release blocker fixed

- The legacy scan engine now emits one authoritative `proxuma:legacy-scan-complete` event after the full report is rendered and saved.
- Captain Summary, Analysis Views, Trust Timeline, Threat Story, Decision Guide, Investigation, Supporting Evidence, and action panels refresh from the same completed scan.
- Example scans no longer require a second tab/button click to reveal current data.
- Existing layout, responsive behavior, themes, ecosystem links, and scan logic are preserved.

## QA focus

1. Click each example once.
2. Confirm Why This Score is populated immediately.
3. Open Timeline, Story, and Decision Guide and confirm they already contain the same scan data.
4. Repeat with a pasted URL.
5. Repeat on mobile after GitHub Pages cache refresh.
