(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-unified-case-tab]')];
  const intelligence = document.getElementById('unifiedCaseIntelligence');
  const management = document.getElementById('case-management');
  const mobile = () => window.matchMedia('(max-width: 900px)').matches;
  let active = 'intelligence';
  function apply(next = active){
    active = next;
    tabs.forEach(tab => {
      const selected = tab.dataset.unifiedCaseTab === active;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    if (!intelligence || !management) return;
    if (mobile()) {
      intelligence.dataset.unifiedCaseHidden = String(active !== 'intelligence');
      management.dataset.unifiedCaseHidden = String(active !== 'management');
    } else {
      delete intelligence.dataset.unifiedCaseHidden;
      delete management.dataset.unifiedCaseHidden;
    }
  }
  tabs.forEach(tab => tab.addEventListener('click', () => apply(tab.dataset.unifiedCaseTab)));
  window.addEventListener('resize', () => apply());
  apply();
})();
