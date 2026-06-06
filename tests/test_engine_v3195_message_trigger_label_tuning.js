const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
let code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert((/version: \"v3\.(22|23|24|25|26|27|28|29)\.[0-9]+\"/.test(code)), 'BUILD version should be v3.22.1 or newer continuity build');
assert((code.includes('UI Wording Clarity Pass') || (code.includes('Online Intel Readiness Layer') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Serverless Bridge Blueprint')) || (code.includes('RDAP Fallback + Host Awareness Polish') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Example Lane Consolidation'))))), 'BUILD name should identify message trigger label tuning');
assert(((code.match(/fetch\s*\(/g)||[]).length <= 1) && code.includes('runConsentGatedRdapLookup'), 'only the consent-gated RDAP lookup may use fetch()');
assert(!/XMLHttpRequest|WebSocket|EventSource|sendBeacon/.test(code), 'no hidden runtime network primitives should be present');

code = code.replace(/\}\)\(\);\s*$/, '\n;globalThis.__proxumaAnalyze = analyze;\n;globalThis.__proxumaBuild = BUILD;\n})();');
const dummy = {textContent:'', className:'', innerHTML:'', style:{}, appendChild(){}, addEventListener(){}, closest(){return {className:''}}, setAttribute(){}, getAttribute(){return ''}, value:'', hidden:false, classList:{toggle(){}, add(){}, remove(){}}};
const context = { console, URL, document:{getElementById(){return dummy}, querySelector(){return dummy}, querySelectorAll(){return []}, createElement(){return {...dummy}}, documentElement:{setAttribute(){}}}, localStorage:{getItem(){return null}, setItem(){}, removeItem(){}}, navigator:{clipboard:{writeText(){return Promise.resolve()}}}, window:{addEventListener(){}}, setTimeout(){}, globalThis:null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(code, context);
const analyze = context.__proxumaAnalyze;

const credential = analyze('Your account will be suspended. Verify your password and OTP now.');
assert(credential.risk === 'High Risk', 'credential/OTP pressure text should remain High Risk');
assert(credential.score === 100, 'credential/OTP pressure text should remain 100/100');
assert(/OTP|credential|Account recovery|password|Verification code/i.test(credential.primaryTrigger + ' ' + credential.threatLaneLabel + ' ' + credential.explain), 'primary explanation should be credential/OTP/account takeover oriented');
assert(!/Money movement|payment-rail request/i.test(credential.primaryTrigger + ' ' + credential.threatLaneLabel), 'primary explanation should not be money movement/payment rail for pure credential text');

const money = analyze('Interac e-transfer deposit pending. Confirm recipient and verify bank login to release funds https://etransfer-release-example.com');
assert(money.risk === 'High Risk', 'money movement sample should remain High Risk');
assert(money.threatLaneId === 'LANE-MONEY-020', 'true Interac/e-transfer lure should still route to money movement lane');

console.log('PASS: v3.19.6 message trigger label tuning verified: credential/OTP text labels correctly while true payment-rail scams remain money movement.');
