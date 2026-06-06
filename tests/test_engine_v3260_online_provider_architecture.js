const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

function assert(condition, message){ if(!condition){ throw new Error(message); } }

assert(js.includes('version: "v3.27.0"'), 'BUILD version should be v3.27.0');
assert(js.includes('ONLINE_PROVIDER_ARCHITECTURE_SLOTS'), 'Provider architecture slots missing');
assert(html.includes('id="onlineProviderSlotList"'), 'Provider slot list missing from existing Online Intel drawer');
assert(js.includes('rdap-domain-age') && js.includes('certificate-transparency') && js.includes('redirect-expansion') && js.includes('reputation-lookup') && js.includes('threat-feed-check'), 'Expected provider slots missing');
assert(js.includes('API keys must never be placed in the GitHub Pages frontend'), 'Frontend API key guardrail missing');
assert(css.includes('v3.26.1 — Deep Analysis Drawer Usability Pass'), 'v3.26.1 CSS marker missing');
assert(((js.match(/fetch\s*\(/g)||[]).length <= 1) && js.includes('runConsentGatedRdapLookup'), 'only the consent-gated RDAP lookup may use fetch()');
assert(!/XMLHttpRequest|WebSocket|EventSource|sendBeacon/.test(js), 'No hidden online transport should be present');
assert(!/apiKey|apikey|API_KEY|secretKey|client_secret/i.test(js), 'No API key/secret markers should be present');
assert(!html.includes('class="intel-card card intel-online"') || html.match(/class="intel-card card intel-online"/g).length === 1, 'Should not add duplicate Online Intel cards');
console.log('PASS v3.26.0 online provider architecture');
