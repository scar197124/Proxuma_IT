const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert(code.includes('version: "v3.19.6"'), 'build version should be v3.19.6');
assert(code.includes('UI Wording Clarity Pass'), 'build name should identify wording clarity pass');
assert(html.includes('Verdict Summary'), 'simple explain action should be named Verdict Summary');
assert(html.includes('Signal Evidence'), 'advanced disclosure should be named Signal Evidence');
assert(html.includes('Why This Score'), 'drawer explanation tab should be named Why This Score');
assert(!html.includes('Explain Verdict'), 'old duplicate-sounding Explain Verdict label should be removed');
assert(!html.includes('Advanced Evidence Tools'), 'old Advanced Evidence Tools label should be removed');
assert(!html.includes('>Explain Why<'), 'old drawer Explain Why tab label should be removed');
assert(html.includes('plain-language reason behind the score'), 'explanation panel should clearly describe plain-language score reason');
assert(!/fetch\s*\(/.test(code), 'no active fetch calls should be introduced');
console.log('PASS: v3.19.6 UI wording clarity verified: Verdict Summary, Why This Score, and Signal Evidence are separated.');
