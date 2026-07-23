(() => {
  'use strict';

  const controls = document.getElementById('investigation-controls');
  const body = document.getElementById('visibleInvestigationBody');
  if (!controls || !body) return;

  const buttons = [...controls.querySelectorAll('[data-investigation-view]')];
  let activeView = buttons.find(button => button.classList.contains('active'))?.dataset.investigationView || 'overview';

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[character]);

  function result() {
    const current = window.ProxumaScanResult;
    return current && current.scanned ? current : null;
  }

  function evidenceGroups(scan) {
    const groups = scan?.evidenceGroups && typeof scan.evidenceGroups === 'object'
      ? scan.evidenceGroups
      : { Evidence: Array.isArray(scan?.evidence) ? scan.evidence : [] };
    return Object.entries(groups).filter(([, items]) => Array.isArray(items) && items.length);
  }

  function render() {
    const scan = result();
    buttons.forEach(button => {
      const active = button.dataset.investigationView === activeView;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (!scan) {
      const label = buttons.find(button => button.dataset.investigationView === activeView)?.textContent?.trim() || 'Overview';
      body.innerHTML = `<strong>${escapeHtml(label)}</strong><p>Run a scan to populate this investigation view.</p>`;
      return;
    }

    const caseId = scan.caseId || 'Current case';
    const risk = scan.riskLabel || scan.riskBand || 'Result ready';
    const confidence = scan.confidence || 'Not measured';
    const target = scan.target || scan.rootDomain || 'Unknown target';
    const action = scan.action || scan.nextStep || 'Review the findings';
    const concern = scan.primaryTrigger || 'No primary concern identified';

    if (activeView === 'overview') {
      body.innerHTML = `<strong>Overview</strong><p><b>${escapeHtml(caseId)}</b> is assessed as <b>${escapeHtml(risk)}</b> with ${escapeHtml(confidence)} confidence.</p><ul><li>Target: ${escapeHtml(target)}</li><li>Main concern: ${escapeHtml(concern)}</li><li>Recommended action: ${escapeHtml(action)}</li></ul>`;
    } else if (activeView === 'deep') {
      const contributors = Array.isArray(scan.scoreContributors) ? scan.scoreContributors : [];
      body.innerHTML = `<strong>Deep Analysis</strong><p>${escapeHtml(scan.summary || scan.reason || 'The completed signals are shown below.')}</p>${contributors.length ? `<ul>${contributors.map(item => `<li><b>${escapeHtml(item.label || 'Signal')}</b> — ${escapeHtml(item.detail || '')}</li>`).join('')}</ul>` : '<p>No additional score contributors were returned for this scan.</p>'}`;
    } else if (activeView === 'evidence') {
      const groups = evidenceGroups(scan);
      body.innerHTML = `<strong>Evidence Explorer</strong><p>Grouped facts supporting the current result.</p>${groups.length ? groups.map(([name, items]) => `<details class="evidence-node" open><summary>${escapeHtml(name)} <span>${items.length}</span></summary><ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></details>`).join('') : '<p>No supporting evidence was returned for this scan.</p>'}`;
    } else {
      const timeline = Array.isArray(scan.livingTimeline) ? scan.livingTimeline : [];
      body.innerHTML = `<strong>Case File</strong><p><b>${escapeHtml(caseId)}</b> · ${escapeHtml(risk)} · ${escapeHtml(target)}</p><ul><li>Timestamp: ${escapeHtml(scan.timestamp || 'Not recorded')}</li><li>Confidence: ${escapeHtml(confidence)}</li><li>Action: ${escapeHtml(action)}</li><li>Timeline steps: ${timeline.length}</li><li>Evidence groups: ${evidenceGroups(scan).length}</li></ul>`;
    }

    body.scrollTop = 0;
    requestAnimationFrame(() => body.scrollTop = 0);
  }

  controls.addEventListener('click', event => {
    const button = event.target.closest('[data-investigation-view]');
    if (!button || !controls.contains(button)) return;
    activeView = button.dataset.investigationView || 'overview';
    render();
  });

  document.addEventListener('proxuma:scan-result', render);
  document.addEventListener('proxuma:legacy-scan-complete', () => requestAnimationFrame(render));
  document.addEventListener('proxuma:new-investigation', () => {
    activeView = 'overview';
    render();
  });

  render();
})();
