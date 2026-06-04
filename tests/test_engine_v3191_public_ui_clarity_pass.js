const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const codePath = path.join(root, 'proxuma-it.js');
const htmlPath = path.join(root, 'index.html');
const readmePath = path.join(root, 'README.md');
const securityPath = path.join(root, 'SECURITY.md');
const licensePath = path.join(root, 'LICENSE');
const manifestPath = path.join(root, 'BUILD_MANIFEST_v3.19.1.md');
const handoffPath = path.join(root, 'NEXT_CHAT_HANDOFF_PROXUMA_IT_v3.19.1.md');
const releaseNotesPath = path.join(root, 'docs', 'RELEASE_NOTES_v3.19.1.md');
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

assert(code.includes('version: "v3.19.1"'), 'BUILD version should be v3.19.1');
assert(code.includes('Public UI Clarity Pass'), 'BUILD name should identify public UI clarity pass');
assert(html.includes('Camera QR scanning is optional and browser-dependent'), 'public QR status should avoid overclaiming camera fallback');
assert(html.includes('class="privacy-strip"'), 'privacy strip should be visible near the scanner input');
assert(html.includes('No telemetry') && html.includes('No hidden lookups'), 'privacy strip should state the local privacy boundary');
['Browser RC Test','Deployment Lock','Technical Review','Arm Consent Gate','Preview Online Scope','Clear Online Consent','Download Memory JSON','Download Checklist'].forEach(label => assert(!html.includes(label), 'public HTML should not show internal label: ' + label));
assert(html.includes('Details'), 'Technical Review should be renamed to Details');
assert(html.includes('Enable Online Preview'), 'Consent gate label should be user-facing');
assert(html.includes('View Online Boundaries'), 'Online scope label should be user-facing');
assert(html.includes('Export Local Notes'), 'Memory JSON label should be user-facing');
assert(readme.includes('Camera QR scanning is browser-dependent'), 'README should document QR camera boundary');
assert(readme.includes('No active `fetch()` calls'), 'README should document no active fetch calls');
assert(security.includes('Known limitation'), 'SECURITY should include known QR limitation');
assert(jsqr.includes('available: false'), 'jsQR placeholder should remain honest as unavailable');
assert(fs.existsSync(securityPath), 'SECURITY.md should exist');
assert(fs.existsSync(licensePath), 'LICENSE should exist');
assert(fs.existsSync(manifestPath), 'v3.19 manifest should exist');
assert(fs.existsSync(handoffPath), 'v3.19 handoff should exist');
assert(fs.existsSync(releaseNotesPath), 'v3.19 release notes should exist');
assert(!/fetch\s*\(/.test(code), 'public release should not include active fetch calls');
assert(!/api\/proxuma-intel/i.test(code), 'public release should not include online bridge API calls');

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
assert(context.__proxumaBuild.version === 'v3.19.1', 'runtime build should expose v3.19.1');
assert(context.__proxumaBuildDeployInfoText().includes('v3.19.1 Public UI clarity pass active'), 'deploy info should identify v3.19.1');
assert(context.__proxumaBuildBrowserChecklistText().includes('manual QR text paste'), 'browser checklist should include manual QR fallback');

console.log('PASS: v3.19.1 public UI clarity pass verified: privacy strip, public labels, QR honesty, offline boundary, and release files preserved.');
