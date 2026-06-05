const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
function assert(condition, message){ if(!condition){ throw new Error(message); } }
assert(css.includes('v3.22.4 — Snapshot Chip Border Wrap'), 'v3.22.4 marker missing');
assert(css.includes('.input-type-chips') && css.includes('rgba(70,255,174,0.32)'), 'input type chip border style missing');
assert(css.includes('.snapshot-grid > div') && css.includes('rgba(5,18,14,0.48)'), 'snapshot metric wrapper style missing');
assert(css.includes('.snapshot-grid > div:nth-child(3)') && css.includes('background:rgba(70,255,174,0.06)'), 'trigger wrapper highlight missing');
assert(html.includes('input-type-chips'), 'accepted input chips missing');
assert(html.includes('report-snapshot-card'), 'report snapshot card missing');
console.log('v3.22.4 snapshot chip border wrap test passed');
