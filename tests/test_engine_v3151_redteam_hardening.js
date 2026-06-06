const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
let code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert((/version: \"v3\.(22|23|24|25|26|27|28|29)\.[0-9]+\"/.test(code)), 'BUILD version should be v3.22.1 or newer continuity build');
assert(code.includes('Red Team Hardening Pass') || (code.includes('Online Intel Readiness Layer') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Serverless Bridge Blueprint')) || (code.includes('RDAP Fallback + Host Awareness Polish') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Example Lane Consolidation')))) || (code.includes('UI Wording Clarity Pass') || (code.includes('Online Intel Readiness Layer') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Serverless Bridge Blueprint')) || (code.includes('RDAP Fallback + Host Awareness Polish') || (code.includes('RDAP Fallback + Host Awareness Polish') || code.includes('Example Lane Consolidation'))))), 'BUILD name should preserve red-team hardening continuity or current cleanup layer');
assert(((code.match(/fetch\s*\(/g)||[]).length <= 1) && code.includes('runConsentGatedRdapLookup'), 'only the consent-gated RDAP lookup may use fetch()');
assert(!/api\/proxuma-intel/i.test(code), 'v3.22.1 should remain offline-only and not include online bridge API calls');
assert(/spacedOtpPattern/.test(code), 'spaced OTP / verification-number hardening should be present');
assert(/captchaGatePattern/.test(code), 'fake CAPTCHA / Cloudflare gate hardening should be present');

code = code.replace(/\}\)\(\);\s*$/, '\n;globalThis.__proxumaAnalyze = analyze;\n;globalThis.__proxumaBuild = BUILD;\n})();');
const dummy = {textContent:'', className:'', innerHTML:'', style:{}, appendChild(){}, addEventListener(){}, closest(){return {className:''}}, setAttribute(){}, getAttribute(){return ''}, value:'', hidden:false, classList:{toggle(){}, add(){}, remove(){}}};
const context = { console, URL, Blob: function(){}, document:{getElementById(){return dummy}, querySelector(){return dummy}, querySelectorAll(){return []}, createElement(){return {...dummy}}, body:{appendChild(){}, removeChild(){}}, documentElement:{setAttribute(){}}}, localStorage:{getItem(){return null}, setItem(){}, removeItem(){}}, navigator:{clipboard:{writeText(){return Promise.resolve()}}, mediaDevices:null}, window:{addEventListener(){}, requestAnimationFrame(){}}, setTimeout(){}, globalThis:null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(code, context);

const analyze = context.__proxumaAnalyze;
assert(/^v3\.(22|23|24|25|26|27|28|29)\.[0-9]+$/.test(context.__proxumaBuild.version), 'runtime BUILD should expose v3.22.1 or newer');

const spacedOtp = analyze('send your O T P code to support now');
assert(spacedOtp.risk === 'High Risk' && spacedOtp.threatLaneId === 'LANE-OTP-014', `spaced OTP lure should be High Risk / OTP lane, got ${spacedOtp.risk} / ${spacedOtp.threatLaneId}`);

const verificationNumber = analyze('share the 6 digit verification number we sent to your phone');
assert(verificationNumber.risk === 'High Risk' && verificationNumber.threatLaneId === 'LANE-OTP-014', `6-digit verification-number lure should be High Risk / OTP lane, got ${verificationNumber.risk} / ${verificationNumber.threatLaneId}`);

const captcha = analyze('Complete Cloudflare captcha then sign in to view document https://cloudflare-verify.example.com/login');
assert(captcha.risk === 'High Risk', `fake CAPTCHA/Cloudflare login gate should be High Risk, got ${captcha.risk}`);

const google = analyze('https://accounts.google.com/signin/v2/identifier');
assert(google.risk === 'Low Risk', `official Google login should stay Low Risk, got ${google.risk}`);

const dropbox = analyze('https://www.dropbox.com/scl/fi/demo/report.pdf?dl=0');
assert(dropbox.risk === 'Low Risk', `trusted Dropbox document should stay Low Risk, got ${dropbox.risk}`);

const delivery = analyze('DHL parcel held for customs clearance. Pay release fee and confirm address for redelivery https://dhl-fee-example.com');
assert(delivery.risk === 'High Risk', `delivery scam should stay High Risk, got ${delivery.risk}`);

const gov = analyze('CRA refund pending. Verify your government account and direct deposit details to receive benefit payment https://cra-refund-example.com');
assert(gov.risk === 'High Risk', `government scam should stay High Risk, got ${gov.risk}`);

console.log('PASS: v3.19.6 red-team hardening preserved: spaced OTP, 6-digit verification-number, fake CAPTCHA gate, trusted relief, and offline guarantees.');
