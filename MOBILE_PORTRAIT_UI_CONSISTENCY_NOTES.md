# Proxuma IT v3.54.4 — Mobile Portrait UI Consistency Repair

This release repairs the mobile portrait layout issue where major UI sections could squeeze too narrow and cause labels or copy to stack letter-by-letter.

## Fixes
- Adds a consistent horizontal side-scroll rail to the main Proxuma workspace on portrait phones.
- Keeps the core app UI at a readable minimum width instead of compressing every card to the viewport width.
- Repairs Step 1 input/actions, scan examples, QR scanner, optional tools, results/report cards, detail selectors, investigation controls, and Step 5.
- Step 5 heading and helper copy now remain readable horizontal text.
- Findings and next step cards stay inside the same portrait scroll rail.
- Landscape mode remains responsive and does not force the portrait rail.

## Deployment
This package is branch/root-ready. Upload the contents of the zip directly to the repo root.

After deployment, test with `?v=3544` to avoid old mobile CSS cache.
