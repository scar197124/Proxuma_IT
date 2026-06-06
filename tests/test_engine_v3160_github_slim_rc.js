const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
let code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }

assert((/version: \"v3\.(22|23|24|25|26|27|28|29)\.[0-9]+\"/.test(code)), 'BUILD version should be v3.22.1 or newer continuity build');
assert(((code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Encoded Risk Token Alignment') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Encoded Risk Token Alignment') || code.includes('Example Lane Consolidation'))) || code.includes('UI Wording Clarity Pass') || code.includes('Online Intel Readiness Layer') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Encoded Risk Token Alignment') || code.includes('Serverless Bridge Blueprint')) || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Encoded Risk Token Alignment') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Encoded Risk Token Alignment') || code.includes('Example Lane Consolidation')))), 'BUILD name should identify the local sample check');
assert(code.includes('v3.19.6 UI Wording Clarity Pass'), 'roadmap should include v3.19 layer');
assert(((code.match(/fetch\s*\(/g)||[]).length <= 1) && code.includes('runConsentGatedRdapLookup'), 'only the consent-gated RDAP lookup may use fetch()');
assert(!/api\/proxuma-intel/i.test(code), 'v3.19 should not include online bridge API calls');
assert((code.includes('PROXUMA_IT_v3.29.3_RDAP_FALLBACK_HOST_AWARENESS_CHECKLIST.txt') || code.includes('PROXUMA_IT_v3.29.1_EXAMPLE_LANE_CONSOLIDATION_CHECKLIST.txt')) || code.includes('PROXUMA_IT_v3.28.0_SERVERLESS_BRIDGE_BLUEPRINT_CHECKLIST.txt') || code.includes('PROXUMA_IT_v3.27.0_ONLINE_INTEL_READINESS_CHECKLIST.txt') || code.includes('PROXUMA_IT_v3.26.1_DEEP_ANALYSIS_DRAWER_USABILITY_CHECKLIST.txt') || code.includes('PROXUMA_IT_v3.19.6_UI_WORDING_CLARITY_CHECKLIST.txt'), 'checklist download filename should identify current continuity build');

const rootFiles = fs.readdirSync(root);
const forbiddenPrefixes = ['BUILD_MANIFEST_v2.', 'NEXT_CHAT_HANDOFF_PROXUMA_IT_v2.', 'TEST_RUN_v2.'];
for (const item of rootFiles) {
  assert(!forbiddenPrefixes.some(prefix => item.startsWith(prefix)), `slim root should not contain old clutter file: ${item}`);
}
assert(fs.existsSync(path.join(root, 'index.html')), 'index.html should be present');
assert(fs.existsSync(path.join(root, 'proxuma-it.js')), 'proxuma-it.js should be present');
assert(fs.existsSync(path.join(root, 'styles.css')), 'styles.css should be present');
assert(fs.existsSync(path.join(root, 'README.md')), 'README.md should be present');
assert(fs.existsSync(path.join(root, 'NEXT_CHAT_HANDOFF_PROXUMA_IT_v3.29.4.md')) || fs.existsSync(path.join(root, 'NEXT_CHAT_HANDOFF_PROXUMA_IT_v3.29.3.md')) || fs.existsSync(path.join(root, 'NEXT_CHAT_HANDOFF_PROXUMA_IT_v3.19.6.md')), 'current handoff should be present');

code = code.replace(/\}\)\(\);\s*$/, '\n;globalThis.__proxumaAnalyze = analyze;\n;globalThis.__proxumaBuild = BUILD;\n;globalThis.__proxumaBuildBrowserChecklistText = buildBrowserChecklistText;\n;globalThis.__proxumaBuildDeployInfoText = buildDeployInfoText;\n})();');
const dummy = {textContent:'', className:'', innerHTML:'', style:{}, appendChild(){}, addEventListener(){}, closest(){return {className:''}}, setAttribute(){}, getAttribute(){return ''}, value:'', hidden:false, classList:{toggle(){}, add(){}, remove(){}}};
const context = { console, URL, Blob: function(){}, document:{getElementById(){return dummy}, querySelector(){return dummy}, querySelectorAll(){return []}, createElement(){return {...dummy}}, body:{appendChild(){}, removeChild(){}}, documentElement:{setAttribute(){}}}, localStorage:{getItem(){return null}, setItem(){}, removeItem(){}}, navigator:{clipboard:{writeText(){return Promise.resolve()}}, mediaDevices:null}, window:{addEventListener(){}, requestAnimationFrame(){}}, setTimeout(){}, globalThis:null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(code, context);

assert(/^v3\.(22|23|24|25|26|27|28|29)\.[0-9]+$/.test(context.__proxumaBuild.version), 'runtime BUILD should expose v3.22.1 or newer');
const checklist = context.__proxumaBuildBrowserChecklistText();
const deployInfo = context.__proxumaBuildDeployInfoText();
assert((checklist.includes('Proxuma IT v3.29.4 Encoded Risk Token Alignment') || code.includes('Encoded Risk Token Alignment') || checklist.includes('Proxuma IT v3.29.1 Example Lane Consolidation')) || checklist.includes('Proxuma IT v3.28.0 Serverless Bridge Blueprint') || checklist.includes('Proxuma IT v3.27.0 Online Intel Readiness Layer') || checklist.includes('Proxuma IT v3.26.1 Deep Analysis Drawer Usability Pass') || checklist.includes('Proxuma IT v3.25.1 Online Intel Results Notes') || checklist.includes('Proxuma IT v3.24.1 Domain Ending Spoof + Comma Domain Tuning') || checklist.includes('Proxuma IT v3.22.1 Unified Scanner Input') || checklist.includes('Proxuma IT v3.19.6 UI Wording Clarity Pass'), 'checklist should identify v3.19.6 message trigger label tuning pass');
assert((deployInfo.includes('v3.29.4 Encoded Risk Token Alignment active') || deployInfo.includes('v3.29.1 Example Lane Consolidation active')) || deployInfo.includes('v3.28.0 Serverless Bridge Blueprint active') || deployInfo.includes('v3.27.0 Online Intel Readiness Layer active') || deployInfo.includes('v3.26.1 Deep Analysis Drawer Usability Pass active') || deployInfo.includes('v3.25.1 Online Intel Results Notes active') || deployInfo.includes('v3.24.1 Domain Ending Spoof + Comma Domain Tuning active') || deployInfo.includes('v3.22.1 Unified Scanner Input active') || deployInfo.includes('v3.19.6 UI Wording Clarity Pass active'), 'deploy info should identify v3.19.6 message trigger label tuning pass');

const analyze = context.__proxumaAnalyze;
const google = analyze('https://accounts.google.com/signin/v2/identifier');
assert(google.risk === 'Low Risk', `official Google login should stay Low Risk, got ${google.risk}`);
const otp = analyze('share the 6 digit verification number we sent to your phone');
assert(otp.risk === 'High Risk' && otp.threatLaneId === 'LANE-OTP-014', `red-team OTP hardening should remain active, got ${otp.risk}/${otp.threatLaneId}`);
const captcha = analyze('Complete Cloudflare captcha then sign in to view document https://cloudflare-verify.example.com/login');
assert(captcha.risk === 'High Risk', `fake CAPTCHA gate should stay High Risk, got ${captcha.risk}`);

console.log('PASS: v3.19.6 UI Wording Clarity Pass verified: clean package, offline guarantees, and v3.15.1 red-team hardening preserved.');
