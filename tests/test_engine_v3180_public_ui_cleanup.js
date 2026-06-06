const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
let code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }

assert((/version: \"v3\.(22|23|24|25|26|27|28|29)\.[0-9]+\"/.test(code)), 'BUILD version should be v3.22.1 or newer continuity build');
assert((code.includes('UI Wording Clarity Pass') || (code.includes('Online Intel Readiness Layer') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Serverless Bridge Blueprint')) || (code.includes('RDAP Fallback + Host Awareness Polish') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Example Lane Consolidation'))))), 'BUILD name should identify local check evolution');
assert(code.includes('OFFLINE_LAB_SAMPLES'), 'local check sample bench should exist');
assert(code.includes('buildOfflineLabReport'), 'local check report builder should exist');
assert(code.includes('Memory boundary: sample checks use local analysis directly'), 'check summary should document no pattern-memory pollution');
assert(!html.includes('id="offlineLabPanel"'), 'duplicate Sample Lab panel should be removed from public UI');
assert(!html.includes('Run Checks'), 'duplicate local sample check controls should not appear in public UI');
assert(((code.match(/fetch\s*\(/g)||[]).length <= 1) && code.includes('runConsentGatedRdapLookup'), 'only the explicit consent-gated RDAP fetch may be present');
assert(!/api\/proxuma-intel/i.test(code), 'no online bridge API calls should be present');

code = code.replace(/\}\)\(\);\s*$/, '\n;globalThis.__proxumaAnalyze = analyze;\n;globalThis.__proxumaBuild = BUILD;\n;globalThis.__proxumaBuildOfflineLabReport = buildOfflineLabReport;\n})();');
function makeDummy(){ return {textContent:'', className:'', innerHTML:'', style:{}, appendChild(){}, addEventListener(){}, closest(){return {className:''}}, setAttribute(){}, getAttribute(){return ''}, value:'', hidden:false, querySelectorAll(){return []}, classList:{toggle(){}, add(){}, remove(){}}}; }
const dummy = makeDummy();
const context = { console, URL, Blob: function(){}, document:{getElementById(){return dummy}, querySelector(){return dummy}, querySelectorAll(){return []}, createElement(){return {...makeDummy(), click(){}}}, body:{appendChild(){}, removeChild(){}}, documentElement:{setAttribute(){}}}, localStorage:{getItem(){return null}, setItem(){}, removeItem(){}}, navigator:{clipboard:{writeText(){return Promise.resolve()}}, mediaDevices:null}, window:{addEventListener(){}, requestAnimationFrame(){}}, setTimeout(){}, globalThis:null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(code, context);
assert(/^v3\.(22|23|24|25|26|27|28|29)\.[0-9]+$/.test(context.__proxumaBuild.version), 'runtime build should be v3.22.1 or newer');
const lab = context.__proxumaBuildOfflineLabReport();
assert(lab.rows.length >= 6, 'local check should include at least six samples');
assert(lab.text.includes('no fetch, API, telemetry'), 'check summary should state offline boundary');
assert(lab.text.includes('Matched results:'), 'check summary should include pass-like count');
const hardStops = lab.rows.filter(row => row.sample.expected === 'High Risk');
assert(hardStops.length >= 3, 'lab should include multiple high-risk samples');
assert(hardStops.every(row => row.report.risk === 'High Risk'), 'high-risk local check samples should remain high-risk');
console.log('PASS: v3.19.6 public release polish verified: sample bench, batch report, offline boundary, and hard-stop lanes preserved.');
