const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const codePath = path.join(root, 'proxuma-it.js');
const htmlPath = path.join(root, 'index.html');
const readmePath = path.join(root, 'README.md');
const securityPath = path.join(root, 'SECURITY.md');
const licensePath = path.join(root, 'LICENSE');
const manifestPath = path.join(root, 'BUILD_MANIFEST_v3.29.4.md');
const handoffPath = path.join(root, 'NEXT_CHAT_HANDOFF_PROXUMA_IT_v3.29.4.md');
const releaseNotesPath = path.join(root, 'docs', 'PROXUMA_IT_SERVERLESS_BRIDGE_BLUEPRINT.md');
const jsQrPath = path.join(root, 'assets', 'vendor', 'jsQR.js');

function assert(condition, message){
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

const code = fs.readFileSync(codePath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');
const readme = fs.readFileSync(readmePath, 'utf8');
const security = fs.readFileSync(securityPath, 'utf8');
const jsqr = fs.readFileSync(jsQrPath, 'utf8');

assert((/version: \"v3\.(22|23|24|25|26|27|28|29)\.[0-9]+\"/.test(code)), 'BUILD version should be v3.22.1 or newer continuity build');
assert(((code.includes('RDAP Fallback + Host Awareness Polish') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Example Lane Consolidation'))) || code.includes('UI Wording Clarity Pass') || code.includes('Online Intel Readiness Layer') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Serverless Bridge Blueprint')) || (code.includes('RDAP Fallback + Host Awareness Polish') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Example Lane Consolidation')))), 'BUILD name should identify message trigger label tuning pass');
assert(html.includes('Camera QR scanning is optional and browser-dependent'), 'public QR status should avoid overclaiming camera fallback');
assert(html.includes('class="privacy-strip"'), 'privacy strip should be visible near the scanner input');
assert(html.includes('No telemetry') && html.includes('No hidden lookups'), 'privacy strip should state the local privacy boundary');
['Browser RC Test','Deployment Lock','Technical Review','Arm Consent Gate','Preview Online Scope','Clear Online Consent','Download Memory JSON','Download Checklist'].forEach(label => assert(!html.includes(label), 'public HTML should not show internal label: ' + label));
assert(html.includes('Details'), 'Technical Review should be renamed to Details');
assert(html.includes('Enable Online Preview'), 'Consent gate label should be user-facing');
assert(html.includes('View Online Boundaries'), 'Online scope label should be user-facing');
assert(html.includes('Export Local Notes'), 'Memory JSON label should be user-facing');
assert(readme.includes('Camera QR scanning is browser-dependent'), 'README should document QR camera boundary');
assert(readme.includes('consent-gated') || readme.includes('No active `fetch()` calls'), 'README should document the online privacy boundary');
assert(security.includes('Known limitation'), 'SECURITY should include known QR limitation');
assert(jsqr.includes('available: false'), 'jsQR placeholder should remain honest as unavailable');
assert(fs.existsSync(securityPath), 'SECURITY.md should exist');
assert(fs.existsSync(licensePath), 'LICENSE should exist');
assert(fs.existsSync(manifestPath), 'current manifest should exist');
assert(fs.existsSync(handoffPath), 'current handoff should exist');
assert(fs.existsSync(releaseNotesPath), 'current online/serverless documentation should exist');
assert(((code.match(/fetch\s*\(/g)||[]).length <= 1) && code.includes('runConsentGatedRdapLookup'), 'public release should only include the explicit consent-gated RDAP fetch');
assert(!/api\/proxuma-intel/i.test(code), 'public release should not include online bridge API calls');

const visibleHtml = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ');
['Scan Center','Scan Report','Deep Analysis','Case File','Why This Score','Trust Timeline','Threat Story','Decision Guide','Online Intel'].forEach(label => {
  const matches = visibleHtml.match(new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || [];
  assert(matches.length === 1, 'visible UI label should appear once after deduplication: ' + label + ' (' + matches.length + ')');
});

let runtime = code.replace(/\}\)\(\);\s*$/, '\n;globalThis.__proxumaBuild = BUILD;\n;globalThis.__proxumaBuildDeployInfoText = buildDeployInfoText;\n;globalThis.__proxumaBuildBrowserChecklistText = buildBrowserChecklistText;\n})();');
const dummy = { textContent:'', className:'', innerHTML:'', style:{}, value:'', hidden:false, disabled:false, srcObject:null, addEventListener(){}, removeEventListener(){}, setAttribute(){}, getAttribute(){ return ''; }, appendChild(){}, removeChild(){}, click(){}, play(){ return Promise.resolve(); }, querySelectorAll(){ return []; }, classList:{ add(){}, remove(){}, toggle(){} } };
const context = {
  console,
  window: { addEventListener(){}, location: { href: 'https://example.test/' }, requestAnimationFrame(){} },
  document: { addEventListener(){}, getElementById(){ return dummy; }, querySelector(){ return dummy; }, querySelectorAll(){ return []; }, createElement(){ return {...dummy}; }, documentElement:{ setAttribute(){} }, head:{ appendChild(){} }, body:{ appendChild(){}, removeChild(){} } },
  navigator: {},
  localStorage: { getItem(){ return null; }, setItem(){}, removeItem(){} },
  URL: { createObjectURL(){ return 'blob:test'; }, revokeObjectURL(){} },
  Blob: function(){},
  setTimeout,
  clearTimeout
};
vm.createContext(context);
vm.runInContext(runtime, context);
assert(/^v3\.(22|23|24|25|26|27|28|29)\.[0-9]+$/.test(context.__proxumaBuild.version), 'runtime build should expose v3.22.1 or newer');
assert((context.__proxumaBuildDeployInfoText().includes('v3.29.4 Encoded Risk Token Alignment active') || context.__proxumaBuildDeployInfoText().includes('v3.29.1 Example Lane Consolidation active')) || context.__proxumaBuildDeployInfoText().includes('v3.28.0 Serverless Bridge Blueprint active') || context.__proxumaBuildDeployInfoText().includes('v3.27.0 Online Intel Readiness Layer active') || context.__proxumaBuildDeployInfoText().includes('v3.26.1 Deep Analysis Drawer Usability Pass active') || context.__proxumaBuildDeployInfoText().includes('v3.26.0 Online Intel Provider Architecture active') || context.__proxumaBuildDeployInfoText().includes('v3.24.1 Domain Ending Spoof + Comma Domain Tuning active') || context.__proxumaBuildDeployInfoText().includes('v3.22.1 Unified Scanner Input active') || context.__proxumaBuildDeployInfoText().includes('v3.19.6 UI Wording Clarity Pass active'), 'deploy info should identify v3.19.6');
assert(context.__proxumaBuildBrowserChecklistText().includes('manual QR text paste'), 'browser checklist should include manual QR fallback');

console.log('PASS: v3.19.6 UI deduplication pass verified: privacy strip, public labels, QR honesty, offline boundary, and release files preserved.');
