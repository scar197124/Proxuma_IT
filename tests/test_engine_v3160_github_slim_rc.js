const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
let code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }

assert(code.includes('version: "v3.22.1"'), 'BUILD version should be v3.22.1');
assert(code.includes('UI Wording Clarity Pass'), 'BUILD name should identify the local sample check');
assert(code.includes('v3.19.6 UI Wording Clarity Pass'), 'roadmap should include v3.19 layer');
assert(!/fetch\s*\(/.test(code), 'no active fetch() calls should be present');
assert(!/api\/proxuma-intel/i.test(code), 'v3.19 should not include online bridge API calls');
assert(code.includes('PROXUMA_IT_v3.19.6_UI_WORDING_CLARITY_CHECKLIST.txt'), 'checklist download filename should identify v3.19');

const rootFiles = fs.readdirSync(root);
const forbiddenPrefixes = ['BUILD_MANIFEST_v2.', 'NEXT_CHAT_HANDOFF_PROXUMA_IT_v2.', 'TEST_RUN_v2.'];
for (const item of rootFiles) {
  assert(!forbiddenPrefixes.some(prefix => item.startsWith(prefix)), `slim root should not contain old clutter file: ${item}`);
}
assert(fs.existsSync(path.join(root, 'index.html')), 'index.html should be present');
assert(fs.existsSync(path.join(root, 'proxuma-it.js')), 'proxuma-it.js should be present');
assert(fs.existsSync(path.join(root, 'styles.css')), 'styles.css should be present');
assert(fs.existsSync(path.join(root, 'README.md')), 'README.md should be present');
assert(fs.existsSync(path.join(root, 'NEXT_CHAT_HANDOFF_PROXUMA_IT_v3.19.6.md')), 'current handoff should be present');

code = code.replace(/\}\)\(\);\s*$/, '\n;globalThis.__proxumaAnalyze = analyze;\n;globalThis.__proxumaBuild = BUILD;\n;globalThis.__proxumaBuildBrowserChecklistText = buildBrowserChecklistText;\n;globalThis.__proxumaBuildDeployInfoText = buildDeployInfoText;\n})();');
const dummy = {textContent:'', className:'', innerHTML:'', style:{}, appendChild(){}, addEventListener(){}, closest(){return {className:''}}, setAttribute(){}, getAttribute(){return ''}, value:'', hidden:false, classList:{toggle(){}, add(){}, remove(){}}};
const context = { console, URL, Blob: function(){}, document:{getElementById(){return dummy}, querySelector(){return dummy}, querySelectorAll(){return []}, createElement(){return {...dummy}}, body:{appendChild(){}, removeChild(){}}, documentElement:{setAttribute(){}}}, localStorage:{getItem(){return null}, setItem(){}, removeItem(){}}, navigator:{clipboard:{writeText(){return Promise.resolve()}}, mediaDevices:null}, window:{addEventListener(){}, requestAnimationFrame(){}}, setTimeout(){}, globalThis:null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(code, context);

assert(context.__proxumaBuild.version === 'v3.22.1', 'runtime BUILD should expose v3.22.1');
const checklist = context.__proxumaBuildBrowserChecklistText();
const deployInfo = context.__proxumaBuildDeployInfoText();
assert(checklist.includes('Proxuma IT v3.22.1 Unified Scanner Input') || checklist.includes('Proxuma IT v3.19.6 UI Wording Clarity Pass'), 'checklist should identify v3.19.6 message trigger label tuning pass');
assert(deployInfo.includes('v3.22.1 Unified Scanner Input active') || deployInfo.includes('v3.19.6 UI Wording Clarity Pass active'), 'deploy info should identify v3.19.6 message trigger label tuning pass');

const analyze = context.__proxumaAnalyze;
const google = analyze('https://accounts.google.com/signin/v2/identifier');
assert(google.risk === 'Low Risk', `official Google login should stay Low Risk, got ${google.risk}`);
const otp = analyze('share the 6 digit verification number we sent to your phone');
assert(otp.risk === 'High Risk' && otp.threatLaneId === 'LANE-OTP-014', `red-team OTP hardening should remain active, got ${otp.risk}/${otp.threatLaneId}`);
const captcha = analyze('Complete Cloudflare captcha then sign in to view document https://cloudflare-verify.example.com/login');
assert(captcha.risk === 'High Risk', `fake CAPTCHA gate should stay High Risk, got ${captcha.risk}`);

console.log('PASS: v3.19.6 UI Wording Clarity Pass verified: clean package, offline guarantees, and v3.15.1 red-team hardening preserved.');
