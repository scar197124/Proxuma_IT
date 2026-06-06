const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
let code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert(/version: \"v3\.(14|15|16|17|18|19|20|21|22|23|24|25|26|27)\.[0-9]+\"/.test(code), 'BUILD version should be v3.14.0 or newer continuity build');
assert(code.includes('Evidence Case Packet Hardening / Offline Export Envelope') || (code.includes('Online Intel Readiness Layer') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Serverless Bridge Blueprint')) || (code.includes('RDAP Fallback + Host Awareness Polish') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Example Lane Consolidation')))) || code.includes('Browser / Deployment Test Lock') || code.includes('Red Team Hardening Pass') || (code.includes('Online Intel Readiness Layer') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Serverless Bridge Blueprint')) || (code.includes('RDAP Fallback + Host Awareness Polish') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Example Lane Consolidation')))) || (code.includes('UI Wording Clarity Pass') || (code.includes('Online Intel Readiness Layer') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Serverless Bridge Blueprint')) || (code.includes('RDAP Fallback + Host Awareness Polish') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Example Lane Consolidation'))))), 'BUILD name should describe current continuity layer');
assert(((code.match(/fetch\s*\(/g)||[]).length <= 1) && code.includes('runConsentGatedRdapLookup'), 'only the consent-gated RDAP lookup may use fetch()');
assert(!/api\/proxuma-intel/i.test(code), 'v3.14 should remain offline-only and not include online bridge API calls');
assert(code.includes('schema: "proxuma-it.case-packet.v3.14"'), 'case packet schema should be v3.14');
assert(code.includes('offlineIntegritySeal'), 'case packet should include offline integrity seal');
assert(code.includes('verificationHints'), 'case packet should include verification hints');
assert(code.includes('preservationSteps'), 'case packet should include preservation steps');

code = code.replace(/\}\)\(\);\s*$/, '\n;globalThis.__proxumaAnalyze = analyze;\n;globalThis.__proxumaBuildCasePacketJson = buildCasePacketJson;\n;globalThis.__proxumaBuild = BUILD;\n})();');
const dummy = {textContent:'', className:'', innerHTML:'', style:{}, appendChild(){}, addEventListener(){}, closest(){return {className:''}}, setAttribute(){}, getAttribute(){return ''}, value:'', hidden:false, classList:{toggle(){}, add(){}, remove(){}}};
const context = { console, URL, Blob: function(){}, document:{getElementById(){return dummy}, querySelector(){return dummy}, querySelectorAll(){return []}, createElement(){return {...dummy}}, documentElement:{setAttribute(){}}}, localStorage:{getItem(){return null}, setItem(){}, removeItem(){}}, navigator:{clipboard:{writeText(){return Promise.resolve()}}}, window:{addEventListener(){}}, setTimeout(){}, globalThis:null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(code, context);
const analyze = context.__proxumaAnalyze;
const buildPacket = context.__proxumaBuildCasePacketJson;

const report = analyze('DHL parcel held for customs clearance. Pay release fee and confirm address for redelivery https://dhl-fee-example.com');
assert(report.risk === 'High Risk', `delivery scam should remain High Risk, got ${report.risk}`);
assert(report.threatLaneId === 'LANE-DELIVERY-005', `delivery lane should remain LANE-DELIVERY-005, got ${report.threatLaneId}`);
const packet = buildPacket(report);
assert(packet && packet.exportEnvelope, 'case packet should include exportEnvelope');
assert(packet.exportEnvelope.schema === 'proxuma-it.case-packet.v3.14', 'export envelope schema should be v3.14');
assert(/^PX-LOCAL-[A-F0-9]{8}$/.test(packet.offlineIntegritySeal), `offline integrity seal format invalid: ${packet.offlineIntegritySeal}`);
assert(packet.exportEnvelope.privacyBoundary.includes('Offline export only'), 'privacy boundary should clearly say offline export only');
assert(packet.verificationHints.length >= 3, 'verification hints should be included');
assert(packet.preservationSteps.length >= 3, 'preservation steps should be included');

const google = analyze('https://accounts.google.com/signin/v2/identifier');
assert(google.risk === 'Low Risk', `official Google login should stay Low Risk, got ${google.risk}`);
console.log('PASS: v3.14.0 case packet hardening verified offline export envelope + integrity seal + preserved lane behavior.');
