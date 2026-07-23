(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const tabs = [...document.querySelectorAll('[data-unified-investigation-tab]')];
  const panes = {
    review: $('unifiedInvestigationReview'),
    decide: $('unifiedInvestigationDecide'),
    act: $('unifiedInvestigationAct')
  };

  function select(stage, options = {}) {
    const next = panes[stage] ? stage : 'review';
    tabs.forEach(button => {
      const active = button.dataset.unifiedInvestigationTab === next;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    Object.entries(panes).forEach(([key, pane]) => {
      if (!pane) return;
      pane.hidden = key !== next;
      pane.classList.toggle('active', key === next);
    });
    document.getElementById('investigation-workspace')?.setAttribute('data-workflow-stage', next);
    if (options.scroll) document.getElementById('investigation-workspace')?.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function click(id) { $(id)?.click(); }
  function jump(id) { document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'}); }

  tabs.forEach((button, index) => {
    button.addEventListener('click', () => select(button.dataset.unifiedInvestigationTab));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      tabs[next].focus();
      select(tabs[next].dataset.unifiedInvestigationTab);
    });
  });

  $('unifiedActFindings')?.addEventListener('click', () => jump('workflow'));
  $('unifiedActCase')?.addEventListener('click', () => click('openCaseWorkspace'));
  $('unifiedActSave')?.addEventListener('click', () => click('quickSaveCase') || click('visibleSaveCase'));
  $('unifiedActCopy')?.addEventListener('click', () => click('missionCopy'));
  $('unifiedActExport')?.addEventListener('click', () => click('visibleCaseReport'));
  $('unifiedActNew')?.addEventListener('click', () => click('visibleNewInvestigation'));

  $('missionReview')?.addEventListener('click', () => select('review', {scroll:true}));
  $('missionEvidence')?.addEventListener('click', () => {
    select('review');
    setTimeout(() => jump('scan-detail-workspace'), 30);
  });

  document.querySelectorAll('[data-flow-step="understand"] button,[data-flow-step="verify"] button').forEach(button => button.addEventListener('click', () => select('review')));
  document.querySelector('[data-flow-step="act"] button')?.addEventListener('click', () => select('act'));
  document.querySelector('[data-flow-step="save"] button')?.addEventListener('click', () => select('act'));

  document.addEventListener('proxuma:new-investigation', () => select('review'));
  document.addEventListener('proxuma:case-workspace-request', () => select('act'));
  select('review');
})();
