const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

function assert(condition, message){
  if(!condition){
    console.error('FAIL:', message);
    process.exit(1);
  }
}

assert(html.includes('report-snapshot-card'), 'Report snapshot card must remain present.');
assert(html.includes('id="primaryTrigger"'), 'Primary Trigger value must remain present.');
assert(css.includes('v3.22.3 — Report Snapshot Readability Correction'), 'v3.22.3 CSS marker missing.');
assert(css.includes('grid-template-columns:minmax(110px, .55fr) minmax(140px, .75fr) minmax(260px, 1.7fr) minmax(190px, 1.1fr)'), 'Desktop snapshot grid must reserve wider space for trigger/time readability.');
assert(css.includes('#primaryTrigger') && css.includes('overflow-wrap:break-word') && css.includes('word-break:normal'), 'Primary Trigger must avoid vertical word stacking.');
assert(css.includes('@media (max-width: 560px)') && css.includes('grid-template-columns:88px minmax(0, 1fr)'), 'Mobile snapshot rows must use compact key/value layout.');
assert(css.lastIndexOf('#primaryTrigger') > css.lastIndexOf('v3.22.2'), 'Primary Trigger override should appear after older compact snapshot rules.');

console.log('PASS: v3.22.3 report snapshot readability checks passed.');
