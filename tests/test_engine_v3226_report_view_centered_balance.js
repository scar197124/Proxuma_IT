const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert(html.includes('Report View'), 'Report View label should remain present');
assert(html.includes('User View'), 'User View toggle should remain present');
assert(html.includes('Analyst View'), 'Analyst View toggle should remain present');
assert(html.includes('Deeper Evidence / Technical Notes'), 'centered technical notes label should be present');
assert(html.includes('Signal Evidence'), 'Signal Evidence disclosure should remain present');
assert(css.includes('v3.22.6') && css.includes('Centered Report View Balance'), 'v3.22.6 centered report view CSS layer should be present');
assert(/\.audience-switch\.report-meta-card[\s\S]*flex-direction:column/.test(css), 'Report View selector should be centered in a vertical stack');
assert(/\.audience-toggle-row[\s\S]*width:min\(100%, 390px\)/.test(css), 'User/Analyst toggles should be centered with a controlled width');
assert(/\.technical-notes-label[\s\S]*text-align:center/.test(css), 'Technical notes label should be centered');
assert(((code.match(/fetch\s*\(/g)||[]).length <= 1) && code.includes('runConsentGatedRdapLookup'), 'only the consent-gated RDAP lookup may use fetch()');
console.log('PASS: v3.22.6 Report View centered balance verified.');
