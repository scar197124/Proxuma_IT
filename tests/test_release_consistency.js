const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const files = {
  readme: read('README.md'), changelog: read('CHANGELOG.md'), matrix: read('CAPABILITY_MATRIX.md'),
  html: read('index.html'), css: read('assets','css','styles.css'), js: read('assets','js','proxuma-it.js'),
  report: read('assets','js','report-trust-action.js')
};
const checks = [
  ['README release title', files.readme.includes('**v3.53.3 — Mobile Viewport Containment**')],
  ['capability matrix release', files.matrix.includes('Current release: **v3.53.3 — Mobile Viewport Containment**')],
  ['single changelog heading', (files.changelog.match(/^# Changelog$/gm) || []).length === 1],
  ['single v3.53.3 changelog entry', (files.changelog.match(/^## v3\.53\.1/gm) || []).length === 1],
  ['HTML build marker', files.html.includes('v3.53.3-mobile-viewport-containment')],
  ['UI release stamp', files.html.includes('Proxuma IT v3.53.3')],
  ['primary JS version', files.js.includes('version: "v3.53.3"')],
  ['report export version', files.report.includes("version:'3.53.3'")],
  ['desktop width balance CSS marker', files.css.includes('v3.53.3 — Desktop Step 5 width balance')]
];
for (const [name, ok] of checks) {
  console.log(ok ? 'PASS' : 'FAIL', name);
  if (!ok) process.exitCode = 1;
}
