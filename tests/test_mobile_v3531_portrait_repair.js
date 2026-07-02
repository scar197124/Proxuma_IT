const fs = require('fs');
const css = fs.readFileSync('assets/css/styles.css','utf8');
const html = fs.readFileSync('index.html','utf8');
function must(pattern, label){ if(!pattern.test(css)) throw new Error(label); }
if(!html.includes('v3.54.0-unified-mobile-findings')) throw new Error('build marker missing');
must(/#workflow > \.workflow-fixed-head\{[\s\S]*?display:grid!important;[\s\S]*?grid-template-columns:minmax\(0,1fr\)!important;/, 'portrait workflow header must be one column');
must(/#workflow > \.workflow-fixed-head \.focus-reading-toolbar\{[\s\S]*?display:none!important;/, 'mobile Focus toolbar must be hidden');
must(/#workflow \.mobile-workflow-nav\{[\s\S]*?position:static!important;[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important;/, 'mobile workflow navigation must be stable two-column grid');
console.log('PASS: v3.53.3 iPhone portrait Step 5 repair');
