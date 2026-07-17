# Proxuma IT RC15 — Public Beta Release Candidate

## Release polish
- Updated the browser title and build metadata for the RC15 public beta.
- Replaced visible internal release labels with public-facing product language.
- Replaced “Local preview” with “Public Beta”.
- Added a compact safety limitation near the scan workflow.
- Added favicon, Apple touch icon, Open Graph, and social sharing metadata.
- Removed the visible developer console from the public interface.
- Preserved the engine-wired heat bar, stable page layout, scanner, QR workflow, Mission Control, Guided Decision Flow, and Case Intelligence.
- No analytics or scan-content collection was added.

## Public-beta limitation
Proxuma identifies risk signals but cannot guarantee that an item is safe. Users should not open suspicious links solely because a result appears low risk.

## RC15.1 — Mobile Landscape Analysis View Fix
- Corrected the Analysis View header so its title and live status remain fully visible in mobile landscape mode.
- Replaced the conflicting 480 px mobile shell with a short-viewport-aware fixed card and true internal content scrolling.
- Restored a compact left analysis rail in landscape to preserve content height.
- Added bottom scroll padding so the final report lines are not clipped at the card edge.
- Compacted and contained the page footer actions for landscape screens.
- Applied through the shared stylesheet, keeping `index.html` and `404.html` synchronized.
