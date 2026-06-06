const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function assert(condition, message){
  if(!condition){
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

assert(html.includes('id="intelligenceDrawerBody"'), 'Deep Analysis body id must exist');
assert(html.includes('aria-controls="intelligenceDrawerBody"'), 'Deep Analysis collapse button must target body');
assert(css.includes('v3.26.4 — Deep Analysis Collapse Fix'), 'v3.26.4 collapse fix marker missing');
assert(/#intelligenceDrawerBody\.collapsible-card-body\[hidden\][\s\S]*display\s*:\s*none\s*!important/i.test(css), 'hidden Deep Analysis body must override previous display grid rules');
assert(/\.intelligence-drawer\.is-collapsed[\s\S]*\.drawer-stage[\s\S]*display\s*:\s*none\s*!important/i.test(css), 'collapsed Deep Analysis drawer stage must be fully hidden');
assert(/\.intelligence-drawer\.is-collapsed[\s\S]*\.drawer-scroll-cue[\s\S]*display\s*:\s*none\s*!important/i.test(css), 'collapsed Deep Analysis scroll cue must be fully hidden');
{ const appCode = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8'); assert(((appCode.match(/fetch\s*\(/g)||[]).length <= 1) && appCode.includes('runConsentGatedRdapLookup'), 'only the explicit consent-gated RDAP fetch may be present'); }
console.log('PASS v3.26.4 Deep Analysis collapse fix');
