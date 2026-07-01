const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'assets/js/mobile-simplification.js'), 'utf8');
const checks = [
  ['findings accordion opens by default', /id="workflowFindings" open/.test(html)],
  ['secondary action accordions exist', ['workflowSessions','workflowExplain','workflowExport'].every(id => html.includes(`id="${id}"`))],
  ['plain language labels present', html.includes('What Proxuma found') && html.includes('Explain my results') && html.includes('Needs action')],
  ['mobile shortcut navigation exists', html.includes('class="mobile-workflow-nav"')],
  ['mobile single-column accordion CSS exists', css.includes('.workflow-accordion{display:grid;grid-template-columns:1fr')],
  ['mobile filters stay compact', css.includes('flex-wrap:nowrap!important')],
  ['mobile behavior script loaded', html.includes('assets/js/mobile-simplification.js')],
  ['mobile script preserves findings default', js.includes("group.id === 'workflowFindings'")]
];
for (const [name, ok] of checks) {
  console.log(ok ? 'PASS' : 'FAIL', name);
  if (!ok) process.exitCode = 1;
}
