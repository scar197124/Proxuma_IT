# Next Chat Handoff — Proxuma IT v3.29.3

Locked candidate: Proxuma IT v3.29.3 — RDAP Fallback + Host Awareness Polish.

Current status:
- Offline scanner intact.
- RDAP wiring remains consent-gated and user-clicked.
- GitHub Pages/local file modes show clear fallback messaging because they cannot run `/api/proxuma-rdap`.
- Vercel/serverless path remains the intended live test environment for RDAP.
- No new public cards.

Recommended next step:
Deploy to Vercel as an online-intel test environment, or add the next serverless provider only after RDAP is confirmed.
