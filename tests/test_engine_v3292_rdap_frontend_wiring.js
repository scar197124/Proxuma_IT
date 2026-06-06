const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const api = fs.readFileSync(path.join(root, 'api', 'proxuma-rdap.js'), 'utf8');

assert(js.includes('version: "v3.29.3"'), 'Build version should be v3.29.3');
assert(js.includes('name: "RDAP Fallback + Host Awareness Polish"'), 'Build name should identify RDAP frontend wiring');
assert(html.includes('id="onlineRdapLookupButton"'), 'Online Intel should expose a Run RDAP Lookup button');
assert(html.includes('id="onlineRdapResult"'), 'Online Intel should include an RDAP result list inside the existing drawer');
assert(js.includes('function runConsentGatedRdapLookup()') || js.includes('async function runConsentGatedRdapLookup()'), 'RDAP runner should exist');
assert(js.includes('readOnlineConsent()'), 'RDAP runner should check consent state');
assert(js.includes('/api/proxuma-rdap?domain='), 'RDAP runner should call the local serverless bridge endpoint');
assert((js.match(/fetch\s*\(/g) || []).length === 1, 'Only one frontend fetch call should exist');
assert(js.indexOf('consent.status !== "armed"') < js.indexOf('fetch(makeLocalRdapEndpoint'), 'Consent gate must be checked before fetch');
assert(api.includes('rdap.org/domain'), 'Serverless bridge should still use RDAP provider endpoint');
assert(js.includes('onlineRdapResult') && js.includes('onlineRdapStatus'), 'RDAP status/result elements should be wired');
assert(js.includes('onlineRdapResult: { source: "user-clicked consent-gated Vercel RDAP bridge"'), 'JSON case packet should include RDAP result context');
assert(js.includes('CONSENT-GATED RDAP RESULT'), 'TXT case packet should include RDAP result section');
assert(!/XMLHttpRequest|WebSocket|EventSource|sendBeacon/.test(js), 'No other browser network primitives should be present');

console.log('v3.29.3 consent-gated RDAP frontend wiring tests passed');
