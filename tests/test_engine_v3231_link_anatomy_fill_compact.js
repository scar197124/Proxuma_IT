const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

function assert(condition, message){
  if(!condition){
    console.error('FAIL:', message);
    process.exit(1);
  }
}

assert(js.includes('els.anatomyStatus.textContent = anatomy.status'), 'renderReport should populate anatomy status');
assert(js.includes('els.anatomyProtocol.textContent = anatomy.protocol'), 'renderReport should populate anatomy protocol');
assert(js.includes('els.anatomyHost.textContent = anatomy.host'), 'renderReport should populate anatomy host');
assert(js.includes('els.anatomyRoot.textContent = anatomy.root'), 'renderReport should populate anatomy root');
assert(js.includes('anatomyCard.classList.toggle("anatomy-populated"'), 'anatomy populated class should toggle after scans');
assert(css.includes('v3.23.1 — Link Anatomy Fill + Compact Guard'), 'v3.23.1 compact anatomy CSS should exist');
assert(css.includes('overflow-wrap:anywhere'), 'anatomy values should wrap horizontally instead of stacking unreadably');
console.log('PASS v3.23.1 link anatomy fill + compact guard');
