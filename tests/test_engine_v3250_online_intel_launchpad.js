const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

assert(html.includes('onlineLookupLinksButton'), 'Online lookup launchpad button missing from HTML');
assert(html.includes('Generate Lookup Links'), 'Online lookup launchpad label missing');
assert(js.includes('function generateOnlineLookupLinks'), 'generateOnlineLookupLinks function missing');
assert(js.includes('renderOnlineLookupLaunchpad'), 'renderOnlineLookupLaunchpad function missing');
assert(js.includes('rdap.org/domain/'), 'RDAP-style lookup target missing');
assert(js.includes('crt.sh/?q='), 'Certificate transparency lookup target missing');
assert(js.includes('urlscan.io/search/#'), 'URL context lookup target missing');
assert(js.includes('window.open') === false, 'Do not auto-open windows; use user-clicked anchor links only');
assert(((js.match(/fetch\s*\(/g)||[]).length <= 1) && js.includes('runConsentGatedRdapLookup'), 'only the explicit consent-gated RDAP fetch may be present');
assert(/XMLHttpRequest/.test(js) === false, 'Hidden XMLHttpRequest detected');
assert(/sendBeacon/.test(js) === false, 'Hidden sendBeacon detected');
assert(css.includes('.online-launch-item'), 'Online launchpad styling missing');
assert(html.includes('class="intel-card card intel-online"') && html.includes('id="onlinePanel"'), 'Existing Online Intel surface missing');
console.log('PASS v3.25.0 online intel launchpad guardrails');
