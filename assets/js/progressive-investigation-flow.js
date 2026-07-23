(() => {
  'use strict';
  const body = document.body;
  const workspace = document.getElementById('caseCommandCenter');
  const launcher = document.getElementById('caseWorkspaceLauncher');
  const openButton = document.getElementById('openCaseWorkspace');
  const quickSave = document.getElementById('quickSaveCase');
  const legacySave = document.getElementById('visibleSaveCase');
  let hasScan = false;

  function setScanReady(ready, options = {}) {
    hasScan = Boolean(ready);
    body.classList.toggle('proxuma-has-scan', hasScan);
    if (!hasScan) closeWorkspace(false);
    if (hasScan && options.scroll) {
      requestAnimationFrame(() => document.getElementById('report')?.scrollIntoView({behavior:'smooth', block:'start'}));
    }
  }

  function openWorkspace(scroll = true) {
    if (!hasScan) return;
    body.classList.add('proxuma-case-workspace-open');
    workspace?.removeAttribute('hidden');
    if (openButton) {
      openButton.textContent = 'Collapse Case Workspace';
      openButton.setAttribute('aria-expanded','true');
    }
    launcher?.classList.add('is-open');
    if (scroll) requestAnimationFrame(() => workspace?.scrollIntoView({behavior:'smooth', block:'start'}));
  }

  function closeWorkspace(scroll = false) {
    body.classList.remove('proxuma-case-workspace-open');
    workspace?.setAttribute('hidden','');
    if (openButton) {
      openButton.textContent = 'Open Case Workspace';
      openButton.setAttribute('aria-expanded','false');
    }
    launcher?.classList.remove('is-open');
    if (scroll) launcher?.scrollIntoView({behavior:'smooth', block:'center'});
  }

  openButton?.addEventListener('click', () => {
    if (body.classList.contains('proxuma-case-workspace-open')) closeWorkspace(true);
    else openWorkspace(true);
  });
  quickSave?.addEventListener('click', () => legacySave?.click());

  document.addEventListener('proxuma:legacy-scan-complete', () => setScanReady(true));
  document.addEventListener('proxuma:scan-result', () => setScanReady(true));
  document.addEventListener('proxuma:case-workspace-request', () => {
    setScanReady(true);
    openWorkspace(true);
  });
  document.addEventListener('proxuma:new-investigation', () => setScanReady(false));

  // A restored result may already exist before this script initializes.
  const result = window.ProxumaScanResult;
  if (result && (result.input || result.target) && Number.isFinite(Number(result.riskScore))) setScanReady(true);
  else setScanReady(false);
})();
