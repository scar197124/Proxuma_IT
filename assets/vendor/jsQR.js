/*
  Proxuma IT local QR decoder guardrail.
  v3.03.1 keeps the runtime QR path offline-first and prevents an incomplete
  decoder slot from pretending to decode camera frames.

  To complete Safari / non-BarcodeDetector camera QR fallback, place an audited
  browser QR decoder bundle here that sets:
    window.jsQR = function(imageData, width, height, options) { ... }
    window.ProxumaLocalQrDecoder = { available: true, name: 'jsQR', source: 'local audited bundle' }

  Current behavior:
  - Native BarcodeDetector browsers still scan QR locally.
  - Manual QR payload paste still works offline everywhere.
  - No CDN, API, telemetry, or network QR decoder call is made.
*/
(function(){
  window.ProxumaLocalQrDecoder = {
    available: false,
    name: 'Proxuma local QR decoder guardrail',
    reason: 'Decoder slot is local, but the full audited QR decoder bundle is not embedded in this package yet.',
    network: false
  };
})();
