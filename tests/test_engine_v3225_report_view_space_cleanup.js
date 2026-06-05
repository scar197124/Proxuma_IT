const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function assert(cond, msg){ if(!cond){ throw new Error(msg); } }
assert(css.includes('v3.22.5 — Report View Space Cleanup'), 'Missing v3.22.5 CSS marker');
assert(css.includes('grid-template-columns:1fr !important;'), 'Report tools should collapse to one full-width column');
assert(css.includes('#activeAudienceMode') && css.includes('display:none !important'), 'Duplicate active audience text should be hidden');
assert(css.includes('report-copy-actions.simple-case-controls') && css.includes('repeat(3, minmax(0, 1fr))'), 'Copy actions should use full-width desktop grid');
assert(html.includes('id="userViewButton"') && html.includes('id="analystViewButton"'), 'Report View buttons must remain present');
console.log('v3.22.5 report view space cleanup test passed');
