# Proxuma IT v3.24.0 Feature Map + No-New-Cards Guardrails

This build intentionally adds **no new public UI cards**. It protects the app from UI bloat while allowing engine and documentation work to continue.

## Current public UI lanes

- Scan Center: one universal input for URLs, IPs, QR payloads, messages, and snippets.
- Scan Report: score, risk level, compact report snapshot, report view controls, and Link Anatomy.
- Deep Analysis / Intelligence Drawer: Why This Score, Trust Timeline, Threat Story, and Decision Guide.
- Signal Evidence: deeper evidence, technical notes, and TXT/JSON exports.
- Local Scan History: local-only previous scan records and local data controls.
- Footer return path: one return path to canonical PROXUMA.

## Do not duplicate

Avoid adding another section that repeats any of these jobs:

- Another scanner input.
- Another examples/training panel.
- Another confidence explanation panel.
- Another Explain Why / Verdict Summary area.
- Another evidence/export area.
- Another canonical return button outside the footer.
- Another Link Anatomy-style breakdown card.

## Safe next build lanes

Prefer improvements that do not increase visible UI weight:

1. Engine-only detection upgrades.
2. Existing-card wording polish.
3. Accessibility and mobile spacing refinement.
4. Tests that guard against duplicate labels/buttons/cards.
5. Documentation, release notes, and handoff improvements.

## Card budget rule

New visible cards should only be added when they answer a clearly new user question that cannot fit inside an existing section. When possible, fold new intelligence into the existing Scan Report, Link Anatomy, Signal Evidence, or Local Scan History sections.
