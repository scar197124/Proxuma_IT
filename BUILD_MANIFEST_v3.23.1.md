# Proxuma IT v3.23.1 — Link Anatomy Fill + Compact Guard

Fixes the v3.23.0 Link Anatomy display bug where the card could remain empty after scans.

Changes:
- Populates Link Anatomy during report render for URLs, IP/domain inputs, QR/text payloads, and message snippets.
- Keeps the anatomy section compact to reduce UI clutter.
- Uses payload-aware labels when the input is not a normal web URL.
- Preserves offline-first behavior and existing scanner/export/history features.
