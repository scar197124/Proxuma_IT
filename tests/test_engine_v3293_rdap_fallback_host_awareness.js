const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

assert(js.includes('version: "v3.29.4"'), 'Build version should be v3.29.4');
assert(js.includes('name: "Encoded Risk Token Alignment"'), 'Build name should identify encoded risk token alignment');
assert(js.includes('function getRdapHostContext()'), 'Host context helper should exist');
assert(js.includes('isGithubPages'), 'GitHub Pages host detection should exist');
assert(js.includes('isFile'), 'Local file host detection should exist');
assert(js.includes('isVercel'), 'Vercel/serverless host detection should exist');
assert(js.includes('function renderRdapFallback(message, detail)'), 'RDAP fallback renderer should exist');
assert(js.includes('Bridge not active on this host'), 'Host-specific unavailable status should exist');
assert(html.includes('host-aware fallback'), 'Online Intel RDAP note should mention host-aware fallback');
assert(js.includes('No online lookup was sent from Proxuma'), 'GitHub/local fallback should reassure that no lookup was sent');
assert(js.indexOf('consent.status !== "armed"') < js.indexOf('fetch(makeLocalRdapEndpoint'), 'Consent gate must still run before fetch');
assert((js.match(/fetch\s*\(/g) || []).length === 1, 'Only one frontend fetch call should exist');
assert(!/XMLHttpRequest|WebSocket|EventSource|sendBeacon/.test(js), 'No other browser network primitives should be present');

console.log('v3.29.4 encoded risk token alignment + RDAP fallback tests passed');
