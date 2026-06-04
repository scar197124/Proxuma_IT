const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

function assert(condition, message){
  if(!condition){
    console.error('FAIL:', message);
    process.exit(1);
  }
}

assert(css.includes('v3.19.4 — Compact Plus UI Density Pass'), 'v3.19.6 compact-plus CSS marker missing');
assert(css.includes('--compact-plus-card-pad'), 'compact-plus card padding token missing');
assert(css.includes('@media (max-width:520px)'), 'mobile collapse/touch-target media rule missing');
assert(css.includes('@media (max-width:420px)'), 'small-phone compact media rule missing');
assert(css.includes('min-height:40px'), 'mobile-friendly minimum toggle height missing');
assert(!html.includes('Step 1: Scan Center'), 'deduplicated step labels should not revert to repeated public labels');
console.log('PASS v3.19.6 message trigger label tuning checks');
