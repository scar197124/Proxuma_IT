const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
let code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert(code.includes('v3.29.4 Encoded Risk Token Alignment'), 'roadmap should include v3.29.4 marker');
assert(code.includes('function inspectEncodedRiskTokens'), 'encoded risk token helper should exist');
assert(code.includes('encoded login keyword'), 'encoded login keyword token should be present');
assert(code.includes('obfuscated credential path'), 'obfuscated credential path token should be present');

code = code.replace(/\}\)\(\);\s*$/, '\n;globalThis.__proxumaAnalyze = analyze;\n})();');
const dummy = {textContent:'', className:'', innerHTML:'', style:{}, appendChild(){}, addEventListener(){}, closest(){return {className:''}}, setAttribute(){}, getAttribute(){return ''}, value:'', hidden:false, classList:{toggle(){}, add(){}, remove(){}}};
const context = { console, URL, document:{getElementById(){return dummy}, querySelector(){return dummy}, querySelectorAll(){return []}, createElement(){return {...dummy}}, documentElement:{setAttribute(){}}}, localStorage:{getItem(){return null}, setItem(){}, removeItem(){}}, navigator:{clipboard:{writeText(){return Promise.resolve()}}}, window:{addEventListener(){}, requestAnimationFrame(){}, location:{hostname:'localhost', protocol:'http:'}}, setTimeout(){}, globalThis:null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(code, context);
const report = context.__proxumaAnalyze('https://example.com/%6c%6f%67%69%6e/%73%65%63%75%72%65');
assert(report.risk === 'Needs Review' || report.risk === 'High Risk', `encoded login should need review or high risk, got ${report.risk}`);
assert(report.anatomy && /encoded login keyword|obfuscated credential path|percent-encoded content/.test(report.anatomy.tokens), `Link Anatomy should surface encoded risk tokens, got: ${report.anatomy && report.anatomy.tokens}`);
const report2 = context.__proxumaAnalyze('https://example.com/login?next=https%3A%2F%2FpaypaI-login-security.com%2Fverify');
assert(report2.anatomy && /encoded embedded URL|encoded redirect\/navigation word|encoded slash/.test(report2.anatomy.tokens), `Encoded redirect URL should surface risk tokens, got: ${report2.anatomy && report2.anatomy.tokens}`);
console.log('PASS v3.29.4 encoded risk token alignment');
