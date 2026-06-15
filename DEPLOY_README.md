# Proxuma IT — GitHub Pages Clean Deployment

This folder is the clean GitHub Pages deployment package for Proxuma IT v3.40.1.

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
`v3.40.1-github-pages-clean`


## v3.42.0 Report Trust and Action Layer
- Unified finding cards with verified evidence and suggested actions
- Remediation statuses stored locally
- Session comparison for new, resolved, unchanged, and severity-changed findings
- Printable HTML and structured JSON trust reports
- Workflow and intelligence layer now loaded by the main page


## v3.42.2 Centered Workflow & Trust Card

- Matched the Workflow & Trust card height to the primary fixed-card footprint.
- Kept the section heading visible while long workflow content scrolls internally.
- Added keyboard focus and a visible internal-scroll cue.

## v3.42.3 GitHub Release Candidate

Deploy the contents of this directory at the repository root. Use `RELEASE_CHECKLIST.md` for the final live verification and keep the site unchanged during the 24-hour observation window.
