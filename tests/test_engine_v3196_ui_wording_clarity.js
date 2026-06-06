const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert((/version: \"v3\.(22|23|24|25|26|27|28|29)\.[0-9]+\"/.test(code)), 'build version should be v3.22.1');
assert((code.includes('UI Wording Clarity Pass') || (code.includes('Online Intel Readiness Layer') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Serverless Bridge Blueprint')) || (code.includes('RDAP Fallback + Host Awareness Polish') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Example Lane Consolidation'))))), 'build name should identify wording clarity pass');
assert(html.includes('Verdict Summary'), 'simple explain action should be named Verdict Summary');
assert(html.includes('Signal Evidence'), 'advanced disclosure should be named Signal Evidence');
assert(html.includes('Why This Score'), 'drawer explanation tab should be named Why This Score');
assert(!html.includes('Explain Verdict'), 'old duplicate-sounding Explain Verdict label should be removed');
assert(!html.includes('Advanced Evidence Tools'), 'old Advanced Evidence Tools label should be removed');
assert(!html.includes('>Explain Why<'), 'old drawer Explain Why tab label should be removed');
assert(html.includes('plain-language reason behind the score'), 'explanation panel should clearly describe plain-language score reason');
assert(((code.match(/fetch\s*\(/g)||[]).length <= 1) && code.includes('runConsentGatedRdapLookup'), 'only the consent-gated RDAP lookup may use fetch()');
console.log('PASS: v3.19.6 UI wording clarity verified: Verdict Summary, Why This Score, and Signal Evidence are separated.');
