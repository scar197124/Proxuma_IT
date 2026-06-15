# Proxuma IT v3.42.3 — GitHub Release Checklist

## Before pushing

- Confirm `index.html` opens locally.
- Run one URL scan and one plain-text/message scan.
- Open and close all six disclosure controls.
- Save one named session and reopen it.
- Generate a local explanation.
- Export one HTML report and one JSON report.
- Test the Workflow & Trust card internal scrolling.
- Check the page at mobile width and confirm no horizontal page overflow.

## GitHub Pages

1. Upload the contents of this folder to the repository root.
2. Keep `.nojekyll` in the root.
3. Confirm GitHub Pages points to the correct branch and root folder.
4. After deployment, hard-refresh the live page.
5. Test the live scanner, navigation, saved sessions, and exports.

## 24-hour observation

Watch for:

- Mobile header or navigation overflow
- Unexpected card width differences
- Stored-session migration issues
- Buttons wrapping or clipping
- Browser-specific export behavior
- Any console errors

Do not add new features during the observation window. Record issues for the next handoff.
