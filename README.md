# Proxuma IT — RC10 UI & API Foundation

Proxuma IT is a browser-based, offline-first interface for reviewing suspicious links, QR content, messages, and related evidence.

## Current build

This clean package includes:

- Responsive desktop, tablet, and mobile interface
- Dark and light themes
- Full focus-style App Guide
- Local scan workflow and investigation views
- Supporting Evidence, Offline Checks, Analysis View, and Optional Tools
- RC10 centralized scan-state and API-adapter foundation
- Optional serverless RDAP bridge for compatible hosts

## GitHub Pages deployment

1. Extract this ZIP.
2. Upload the **contents** of the extracted folder to the repository root.
3. Do not upload the ZIP itself.
4. In GitHub, open **Settings → Pages**.
5. Choose **Deploy from a branch**, select `main`, and choose `/ (root)`.

GitHub Pages serves the static application. The optional `api/proxuma-rdap.js` endpoint requires a compatible serverless deployment such as Vercel.

## Main files

- `index.html` — application
- `404.html` — GitHub Pages fallback
- `assets/` — styles, scripts, images, and bundled QR decoder
- `api/proxuma-rdap.js` — optional serverless RDAP bridge
- `robots.txt` and `sitemap.xml` — search indexing files
- `SECURITY.md` — security and responsible-use guidance

## Capability note

The current scanner is an evolving local analysis system. Results should be treated as guidance, not as a substitute for independent security verification.
