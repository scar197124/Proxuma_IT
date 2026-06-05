const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
function assert(cond, msg){ if(!cond){ throw new Error(msg); } }
assert(html.includes('class="report-snapshot-card"'), 'Compact report snapshot card missing');
assert(html.includes('class="snapshot-grid"'), 'Snapshot grid missing');
assert(!html.includes('<div class="report-strip">'), 'Old report-strip card layout still present');
['nextStep','signalCount','inputTypeLabel','primaryTrigger','reportTimestamp'].forEach(id => {
  const count = (html.match(new RegExp(`id="${id}"`, 'g')) || []).length;
  assert(count === 1, `${id} should appear exactly once, found ${count}`);
});
assert(css.includes('v3.22.2 — Compact Scan Report Snapshot'), 'v3.22.2 CSS marker missing');
assert(css.includes('.report-snapshot-card'), 'Compact snapshot CSS missing');
assert(css.includes('@media (max-width: 560px)'), 'Mobile compact snapshot media query missing');
console.log('PASS v3.22.2 compact report metrics layout');
