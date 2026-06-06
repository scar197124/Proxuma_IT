const fs = require('fs');
const assert = require('assert');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

assert(!html.includes('data-drawer-target="offlineLabPanel">Sample Lab</button>'), 'Duplicate Sample Lab tab should be removed from Deep Analysis');
assert(!html.includes('data-drawer-target="offlineLabPanel">Local Check</button>'), 'Duplicate Local Check label should remain removed from Deep Analysis tabs');
assert(html.includes('class="drawer-scroll-cue"'), 'Scroll cue should be outside the drawer-stage markup');
assert(css.includes('.intelligence-drawer .drawer-panel::after') && css.includes('content:none!important'), 'Old inside-panel scroll cue should be disabled');
assert(css.includes('.intelligence-drawer .drawer-scroll-cue'), 'Outside scroll cue styling should be present');
assert(css.includes('height:clamp(430px, 48vh, 540px)'), 'Deep Analysis inner stage should use more real estate');
assert(!css.includes('fetch('), 'CSS must not include fetch calls');
console.log('v3.26.1 Deep Analysis drawer usability checks passed.');
