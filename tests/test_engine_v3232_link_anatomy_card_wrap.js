const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

function assert(condition, message){
  if(!condition){
    console.error('FAIL:', message);
    process.exit(1);
  }
}

assert(css.includes('v3.23.2 — Link Anatomy Card Wrap Polish'), 'v3.23.2 CSS marker missing');
assert(css.includes('.link-anatomy-card .anatomy-row'), 'Link Anatomy row wrapper selector missing');
assert(css.includes('rgba(70,255,174,0.28)'), 'Expected green privacy-chip border language missing');
assert(css.includes('linear-gradient(180deg, rgba(70,255,174,0.075)'), 'Expected subtle chip/card background missing');
assert(css.includes('.link-anatomy-card .anatomy-wide'), 'Wide anatomy field wrapper selector missing');

console.log('PASS v3.23.2 Link Anatomy card wrap CSS present');
