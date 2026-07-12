# PROXUMA IT UI 1.0 RC-3 — Unified Scan Entry + Analysis Sync

## Release blocker fixed
All scan entry points now use the same Analyze Link path:

- Trusted/example buttons
- Analyze Link button
- Enter key
- QR scanner decode

The completed legacy report is passed directly into the visible dashboard wiring layer. The Analysis Views card, Captain Summary, timeline, threat story, decision guide, investigation, supporting evidence, and action cards refresh from the same report without requiring a second tab click.

## Test checklist
1. Click each example once and confirm Why This Score updates immediately.
2. Confirm Trust Timeline, Threat Story, and Decision Guide are populated before clicking their tabs.
3. Paste a URL and click Analyze Link.
4. Press Enter after pasting a URL.
5. Scan a QR code and confirm the same dashboard behavior.
6. Repeat on desktop, iPhone, Android, and tablet.

No layout redesign was included.
