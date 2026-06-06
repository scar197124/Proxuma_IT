const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert(!html.includes('Detailed reasoning stays tucked away until you open it.'), 'extra Deep Analysis helper line should be removed from HTML');
assert(css.includes('v3.26.2 — Deep Analysis Inner Fit Correction'), 'v3.26.2 CSS marker missing');
assert(css.includes('scroll-padding-bottom:34px'), 'desktop drawer bottom scroll padding missing');
assert(css.includes('scroll-padding-bottom:38px'), 'mobile drawer bottom scroll padding missing');
assert(css.includes('grid-template-rows:auto minmax(0, 1fr) auto'), 'drawer body should reserve outside scroll cue row');
assert(css.includes('width:min(100%, 1080px)'), 'inner drawer stage should be widened');
console.log('PASS v3.26.2 deep analysis inner fit correction');
