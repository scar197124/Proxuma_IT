const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert(html.includes('id="onlineFindingsNotes"'), 'Online findings notes textarea missing');
assert(html.includes('id="saveOnlineFindingsButton"'), 'Save findings button missing');
assert(html.includes('id="clearOnlineFindingsButton"'), 'Clear findings button missing');
assert(js.includes('ONLINE_FINDINGS_KEY'), 'Online findings local storage key missing');
assert(js.includes('onlineIntelFindings'), 'JSON case packet online findings field missing');
assert(js.includes('ONLINE INTEL FINDINGS NOTES'), 'TXT export online findings section missing');
assert(js.includes('saveOnlineFindingsNotes'), 'Save online findings handler missing');
assert(css.includes('v3.25.1 Online Intel Results Notes'), 'v3.25.1 CSS marker missing');
assert(((js.match(/fetch\s*\(/g)||[]).length <= 1) && js.includes('runConsentGatedRdapLookup'), 'only the explicit consent-gated RDAP fetch may be present');
assert(!/XMLHttpRequest/.test(js), 'Hidden XHR call detected');
console.log('PASS v3.25.1 online intel results notes');
