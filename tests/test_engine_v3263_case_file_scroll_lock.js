const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
function assert(cond, msg){ if(!cond){ throw new Error(msg); }}
assert(html.includes('class="casefile-scroll-cue"'), 'Case File external scroll cue is missing');
assert(html.indexOf('id="caseFileBody"') < html.indexOf('casefile-scroll-cue'), 'Case File scroll cue must sit after the scroll body');
assert(css.includes('v3.26.3 — Case File Scroll Lock Pass'), 'v3.26.3 CSS marker missing');
assert(css.includes('.casefile.card:not(.is-collapsed) #caseFileBody.collapsible-card-body'), 'Case File scroll body CSS missing');
assert(/overflow-y\s*:\s*auto\s*!important/.test(css), 'Case File body must scroll internally');
assert(/height\s*:\s*clamp\(500px, 56vh, 620px\)\s*!important/.test(css), 'Desktop Case File fixed height clamp missing');
assert(css.includes('.casefile.is-collapsed .casefile-scroll-cue'), 'Collapsed state should hide scroll cue');
console.log('v3.26.3 Case File scroll lock checks passed');
