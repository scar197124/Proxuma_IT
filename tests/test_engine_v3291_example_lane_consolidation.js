const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ throw new Error(message); } }
assert(html.includes('class="quick-tests"'), 'Scan Center example lane should remain present');
assert(html.includes('data-example="https://www.rbcroyalbank.com/"'), 'Trusted bank example should remain in Scan Center');
assert(!html.includes('data-drawer-target="offlineLabPanel"'), 'Sample Lab drawer tab should be removed to avoid duplicate example systems');
assert(!html.includes('id="offlineLabPanel"'), 'Sample Lab drawer panel should be removed to avoid duplicate example systems');
assert(!html.includes('Run Checks'), 'Public duplicate sample-check controls should be removed');
assert(html.includes('data-drawer-target="onlinePanel"'), 'Online Intel drawer should remain present');
assert((js.includes('version: "v3.29.4"') || js.includes('version: "v3.29.1"')), 'Build version should be v3.29.4 or v3.29.1');
console.log('v3.29.1 example lane consolidation checks passed');
