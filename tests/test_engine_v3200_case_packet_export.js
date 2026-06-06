const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

assert(html.includes('id="downloadCaseTextButton"'), 'Download TXT button should exist in Signal Evidence controls');
assert(html.includes('Download TXT'), 'Readable TXT export label should be visible');
assert(html.includes('Download JSON'), 'Structured JSON export label should remain visible');
assert(html.includes('Download TXT for a readable case report; Download JSON for structured local evidence.'), 'Signal Evidence note should explain TXT vs JSON');
assert((/version: \"v3\.(22|23|24|25|26|27|28|29)\.[0-9]+\"/.test(js)), 'Build version should be v3.22.1 or newer');
assert((js.includes('name: "Deep Analysis Drawer Usability Pass"') || js.includes('name: "Online Intel Provider Architecture"') || js.includes('name: "Online Intel Results Notes"') || js.includes('name: "Unified Scanner Input"') || js.includes('name: "Domain Ending Spoof + Comma Domain Tuning"') || (js.includes('name: "Online Intel Readiness Layer"') || js.includes('name: "Serverless Bridge Blueprint"') || (js.includes('name: "RDAP Fallback + Host Awareness Polish"') || js.includes('name: "Example Lane Consolidation"')))), 'Build name should identify current Proxuma IT continuity line');
assert(js.includes('downloadCaseTextButton: $("downloadCaseTextButton")'), 'downloadCaseTextButton should be wired into DOM refs');
assert(js.includes('function buildCasePacketText(report)'), 'Readable case packet text builder should exist');
assert(js.includes('PROXUMA IT CASE PACKET'), 'Readable TXT export should have a clear title');
assert(js.includes('function downloadCaseText()'), 'Readable TXT download handler should exist');
assert(js.includes('Readable TXT case report downloaded.'), 'Readable TXT export should provide user feedback');
assert(js.includes('downloadCaseTextButton) els.downloadCaseTextButton.addEventListener("click", downloadCaseText)'), 'Readable TXT button should be bound to click handler');
assert(js.includes('No API call, telemetry, hidden lookup, live reputation check, or online expansion'), 'Readable export should preserve privacy boundary language');

const networkCount = (js.match(/\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/g) || []).length;
assert(networkCount <= 1 && js.includes('runConsentGatedRdapLookup'), 'Only the explicit consent-gated RDAP fetch may be introduced');

console.log('PASS v3.20.0 case packet export');
