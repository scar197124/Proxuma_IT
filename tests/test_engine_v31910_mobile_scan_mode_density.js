const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
const priorOversize = css.lastIndexOf('min-height:92px!important');
const patch = css.lastIndexOf('v3.19.10 Mobile scan-mode button density patch');
if (priorOversize === -1) throw new Error('Expected prior mobile oversize rule not found for override validation.');
if (patch === -1 || patch <= priorOversize) throw new Error('v3.19.10 mobile density patch must appear after earlier oversize mobile rule.');
if (!/@media \(max-width:700px\)[\s\S]*?\.mode-pill,[\s\S]*?min-height:44px!important/.test(css)) {
  throw new Error('Mobile scan-mode pills must compact to 44px min-height at <=700px.');
}
if (!/@media \(max-width:420px\)[\s\S]*?\.mode-pill,[\s\S]*?min-height:42px!important/.test(css)) {
  throw new Error('Small-phone scan-mode pills must compact to 42px min-height at <=420px.');
}
console.log('PASS: v3.19.10 mobile scan-mode button density CSS override verified.');
