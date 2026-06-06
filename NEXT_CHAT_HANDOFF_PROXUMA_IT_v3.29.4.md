# NEXT CHAT HANDOFF — Proxuma IT v3.29.4

Baseline: Proxuma IT v3.29.4 — Encoded Risk Token Alignment.

This build continues from v3.29.3 Public Slim GitHub Baseline and preserves the consent-gated RDAP bridge/fallback behavior.

Change focus:
- No new UI cards.
- Link Anatomy now surfaces encoded-login / obfuscated-path risk tokens when encoded content is detected.
- Percent-encoded slash, query, parameter, authority, redirect, credential, MFA, and embedded URL markers are displayed in existing Risk Tokens.
- Engine scoring behavior is mostly preserved; this is an explanation/evidence alignment patch.

Next recommended move:
- Test encoded login examples locally.
- If stable, push this slim build to GitHub and let it breathe.
- After that, continue with online intelligence only through consent-gated/serverless paths.
