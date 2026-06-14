# Proxuma IT — GitHub Pages Clean Deployment

This folder is the clean GitHub Pages deployment package for Proxuma IT v3.40.0.

## Deploy
Upload the contents of this folder to the root of the GitHub Pages repository:

- `index.html`
- `styles.css`
- `proxuma-it.js`
- `assets/`
- `.nojekyll`

GitHub Pages should be configured to publish from the repository root.

## Current state
- Local/offline analysis engine included
- Local QR decoding included
- Unified lower controls included
- No test suite or development artifacts included
- Online intelligence layer is not enabled in this package

## Next upgrade
The next planned version can add the online layer using the existing consent-first provider architecture. That upgrade should keep local analysis as the default and require explicit user action before any external lookup.

## Build
`v3.40.0-github-pages-clean`
