# Developer Release Testing

This checklist is for maintainers and should not appear in the public Proxuma IT interface.

## Browser checks

1. Open `index.html` locally in Safari and confirm the app loads without a blank page, white-card regression, or blocked scanner surface.
2. Open the package in Chrome or Edge and confirm the scanner, Investigation workspace, Case File, and controls initialize without console-breaking errors.
3. Run a trusted official login URL and confirm it stays Low Risk.
4. Run a normal bank homepage and confirm it does not receive an unreasonable high-risk result.
5. Run at least three suspicious samples covering parking/toll, delivery/customs, and fake government/refund language.
6. Paste a decoded QR payload manually and confirm scanning works even when camera access is unavailable.
7. Confirm camera permission is requested only after the user selects Start QR Scan.
8. After a scan, test Simple Report, Full Report, Case Packet, TXT, and JSON exports.
9. Confirm Scan Memory updates after repeated scans and its local exports work.
10. Confirm Online Intel remains consent-first and no lookup runs before the user explicitly starts it.
11. Repeat a clean scan, suspicious scan, QR fallback, report copy, and JSON download on the deployed preview.

## Pass rules

- Safari, Chrome, and mobile load the scanner surface.
- Manual QR text scanning remains available when camera scanning is unsupported.
- No hidden online requests, telemetry, or automatic provider checks occur.
- Case packet and memory exports work after a scan.
- The app remains usable with empty, blocked, or cleared local storage.
- No developer, deployment, build-test, or release-check instructions appear in the public interface.
