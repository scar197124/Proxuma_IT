const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function assert(cond, msg){
  if(!cond){
    console.error('FAIL:', msg);
    process.exit(1);
  }
}

assert(((js.includes('version: "v3.29.4"') || js.includes('version: "v3.29.1"')) || js.includes('version: "v3.28.0"')), 'Build version should be v3.29.4 or v3.29.1 or v3.28.0 continuity build');
assert(js.includes('Serverless Bridge Blueprint') || js.includes('Example Lane Consolidation'), 'Build name should identify current continuity layer');
assert(html.includes('serverless bridge blueprint is ready'), 'Online Intel copy should mention blueprint readiness');
assert(js.includes('Blueprint ready / not connected'), 'Readiness layer should show bridge blueprint ready but not connected');
assert(fs.existsSync(path.join(root, 'docs', 'PROXUMA_IT_SERVERLESS_BRIDGE_BLUEPRINT.md')), 'Serverless bridge blueprint doc missing');
assert(fs.existsSync(path.join(root, 'docs', 'ONLINE_INTEL_PROVIDER_CONTRACT.md')), 'Provider contract doc missing');
assert(fs.existsSync(path.join(root, 'docs', 'ONLINE_INTEL_PRIVACY_RULES.md')), 'Online Intel privacy rules doc missing');
assert(!/apiKey\s*[:=]\s*['"][^'"]+/i.test(js + html), 'Frontend should not contain hardcoded API key assignment');
assert(((js.match(/fetch\s*\(/g)||[]).length <= 1) && js.includes('runConsentGatedRdapLookup'), 'only the explicit consent-gated RDAP fetch may be present');
assert(!/XMLHttpRequest|WebSocket|EventSource|sendBeacon/.test(js), 'No browser network transport should be introduced');
console.log('PASS v3.28.0 serverless bridge blueprint guardrails');
