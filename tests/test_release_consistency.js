const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

const files = {
  readme: read('README.md'),
  changelog: read('CHANGELOG.md'),
  matrix: read('CAPABILITY_MATRIX.md'),
  html: read('index.html'),
  css: read('assets', 'css', 'styles.css'),
  js: read('assets', 'js', 'proxuma-it.js'),
  report: read('assets', 'js', 'report-trust-action.js')
};

const checks = [
  ['README release title', files.readme.includes('**v3.53.0 — Simple Action Workspace**')],
  ['capability matrix release', files.matrix.includes('Current release: **v3.53.0 — Simple Action Workspace**')],
  ['single changelog heading', (files.changelog.match(/^# Changelog$/gm) || []).length === 1],
  ['single v3.53.0 changelog entry', (files.changelog.match(/^## v3\.52\.2/gm) || []).length === 1],
  ['HTML build marker', files.html.includes('v3.53.0-simple-action-workspace')],
  ['UI release stamp', files.html.includes('Proxuma IT v3.53.0')],
  ['primary JS version', files.js.includes('version: "v3.53.0"')],
  ['report export version', files.report.includes("version:'3.53.0'")],
  ['no future CSS release marker', !files.css.includes('v3.52.3')]
];

for (const [name, ok] of checks) {
  if (!ok) {
    console.error('FAIL', name);
    process.exitCode = 1;
  } else {
    console.log('PASS', name);
  }
}
