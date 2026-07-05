# Proxuma IT v3.54.1 — Branch Deploy Ready

This package is prepared for GitHub Pages **Deploy from a branch** mode.

## What changed
- Removed the GitHub Actions workflow folder from this package.
- Kept `index.html` at the repository root.
- Kept `.nojekyll` at the repository root.
- Added cache busting to the stylesheet link: `assets/css/styles.css?v=3.54.1`.
- Preserved the Step 5 mobile side-scroll CSS fix.

## GitHub Pages setting
Use:
- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**

Upload the contents of this zip to the repo root. Do not upload the outer folder itself.
