const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const featureMap = fs.readFileSync(path.join(root, 'docs', 'FEATURE_MAP_PROXUMA_IT_v3.24.0.md'), 'utf8');

function countText(source, text){
  return (source.match(new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
}

function fail(message){
  console.error('FAIL:', message);
  process.exit(1);
}

// Guard: this release must not introduce a second scanner input/helper field.
if (countText(html, 'Manual Payload Helper') !== 0) fail('Manual Payload Helper duplicate input returned.');
if (countText(html, 'Universal scanner input') !== 1) fail('Universal scanner input should appear exactly once.');

// Guard: footer-only return path should remain single and not reappear in header/hero.
if (countText(html, '← PROXUMA Home') !== 1) fail('Footer PROXUMA Home return button should appear exactly once.');

// Guard: key report lanes should not be duplicated as new public cards.
const uniqueLabels = [
  'Report View',
  'Signal Evidence',
  'Local Scan History',
  'Link Anatomy',
  'Why This Score',
  'Trust Timeline',
  'Threat Story',
  'Decision Guide'
];
for (const label of uniqueLabels){
  const n = countText(html, label);
  if (n < 1) fail(`${label} missing from UI.`);
  if (n > 3) fail(`${label} appears too many times (${n}); possible duplicate UI copy/card.`);
}

// Guard: v3.24.0 is a documentation/test guardrail release, not a new UI card release.
if (!/This build intentionally adds \*\*no new public UI cards\*\*/.test(featureMap)) fail('Feature map must state no-new-cards rule.');
if (!/Do not duplicate/.test(featureMap)) fail('Feature map must include duplicate-prevention section.');

// Guard: no hidden network/API calls were introduced in the app code.
const networkCount = (js.match(/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/g) || []).length;
if (networkCount > 1 || !js.includes('runConsentGatedRdapLookup')) {
  fail('Only the explicit consent-gated RDAP fetch may be present in proxuma-it.js.');
}

console.log('PASS: v3.24.0 no-new-cards guardrails intact.');
