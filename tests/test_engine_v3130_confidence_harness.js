const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
let code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert(/version: \"v3\.(13|14|15|16|17|18|19)\.[01]\"/.test(code), 'BUILD version should be v3.13.0 or newer continuity build');
assert(code.includes('Regression Confidence Harness / Offline Lane Integrity Lock') || code.includes('Evidence Case Packet Hardening / Offline Export Envelope') || code.includes('Red Team Hardening Pass') || code.includes('Public UI Clarity Pass'), 'BUILD name should describe current confidence/export hardening line');
assert(!/fetch\s*\(/.test(code), 'no active fetch() calls should be present');
assert(!/api\/proxuma-intel/i.test(code), 'offline confidence harness should not include online bridge API calls');

code = code.replace(/\}\)\(\);\s*$/, '\n;globalThis.__proxumaAnalyze = analyze;\n;globalThis.__proxumaBuild = BUILD;\n})();');
const dummy = {textContent:'', className:'', innerHTML:'', style:{}, appendChild(){}, addEventListener(){}, closest(){return {className:''}}, setAttribute(){}, getAttribute(){return ''}, value:'', hidden:false, classList:{toggle(){}, add(){}, remove(){}}};
const context = { console, URL, document:{getElementById(){return dummy}, querySelector(){return dummy}, querySelectorAll(){return []}, createElement(){return {...dummy}}, documentElement:{setAttribute(){}}}, localStorage:{getItem(){return null}, setItem(){}, removeItem(){}}, navigator:{clipboard:{writeText(){return Promise.resolve()}}}, window:{addEventListener(){}}, setTimeout(){}, globalThis:null };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(code, context);
const analyze = context.__proxumaAnalyze;

function check(name, input, expectedLane, expectedRisk='High Risk'){
  const report = analyze(input);
  assert(report.risk === expectedRisk, `${name}: expected ${expectedRisk}, got ${report.risk} (${report.threatLaneId})`);
  assert(report.threatLaneId === expectedLane, `${name}: expected lane ${expectedLane}, got ${report.threatLaneId}`);
  return report;
}

const cases = [
  ['parking toll transit', 'Parking meter QR payment failed. Pay parking session fee and plate verification now https://parking-pay-example.com/plate', 'LANE-MOBILITY-019'],
  ['money movement', 'Interac e-transfer deposit pending. Confirm recipient and verify bank login to release funds https://etransfer-release-example.com', 'LANE-MONEY-020'],
  ['gift prize reward', 'You won a reward gift card. Upload receipt and card PIN to claim bonus cashback https://reward-claim-example.com', 'LANE-REWARD-021'],
  ['subscription renewal', 'Subscription payment failed. Update payment method now or cloud storage account will be cancelled https://billing-renew-example.com', 'LANE-SUBSCRIPTION-022'],
  ['delivery parcel courier', 'DHL parcel held for customs clearance. Pay release fee and confirm address for redelivery https://dhl-fee-example.com', 'LANE-DELIVERY-005'],
  ['government tax benefit', 'CRA tax refund approved. Verify SIN and direct deposit to release benefit payment https://cra-refund-example.com', 'LANE-GOV-006'],
  ['job recruitment', 'Remote assistant job approved. Buy equipment with starter check and verify payroll direct deposit https://job-onboard-example.com', 'LANE-JOB-008'],
  ['AI family emergency', 'Mom this is my new number do not call. I am in trouble and need e-transfer money now, keep it private https://family-help-example.com', 'LANE-AI-023'],
  ['social DM influencer', 'Instagram giveaway: DM me on Telegram to claim creator reward and verify your account https://creator-claim-example.com', 'LANE-DM-024'],
  ['marketplace buyer seller', 'Facebook Marketplace buyer sent overpayment. Courier pickup arranged, refund extra through buyer protection link https://market-release-example.com', 'LANE-MARKET-025'],
  ['student school scholarship', 'University grant approved. Verify student ID and bank direct deposit to claim tuition refund https://student-aid-example.com', 'LANE-STUDENT-026'],
  ['fake recovery portal', 'Crypto recovery agent case open. Verify wallet and pay recovery fee to recover stolen funds https://asset-recovery-example.com', 'LANE-RECOVERY-SCAM-027']
];

cases.forEach(([name, input, lane]) => check(name, input, lane));

const google = analyze('https://accounts.google.com/signin/v2/identifier');
assert(google.risk === 'Low Risk', `official Google login should stay Low Risk, got ${google.risk}`);
const dropbox = analyze('https://www.dropbox.com/scl/fi/abc/example.pdf?dl=0');
assert(dropbox.risk === 'Low Risk', `trusted Dropbox document should stay Low Risk, got ${dropbox.risk}`);
const doubleExt = analyze('https://example-files.com/invoice.pdf.exe');
assert(doubleExt.risk === 'High Risk', `double-extension executable trap should stay High Risk, got ${doubleExt.risk}`);

console.log('PASS: v3.13.0 confidence harness verified 12 offline scam lanes + trusted relief + executable trap.');
