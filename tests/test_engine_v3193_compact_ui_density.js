const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}
assert(css.includes('v3.19.4 — Compact Plus UI Density Pass'), 'compact UI density marker missing');
assert(css.includes('.hero-framed .hero-frame-inner') && css.includes('clamp(22px, 3vw, 28px)'), 'hero compact padding override missing');
assert(css.includes('.collapsible-card.is-collapsed') && css.includes('padding:12px 14px'), 'collapsed card compact padding missing');
assert(css.includes('.collapsible-card.is-collapsed .subtle') && css.includes('display:none'), 'collapsed subtle text should be hidden for compactness');
assert(css.includes('@media (max-width:760px)') && css.includes('@media (max-width:420px)'), 'mobile compact breakpoints missing');
assert(html.includes('data-default-collapsed="true"'), 'default collapsed cards must remain enabled');
console.log('PASS v3.19.6 compact UI density checks');
