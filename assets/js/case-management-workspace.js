(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const HISTORY_KEY = 'proxuma-it-visible-case-history-v1';
  const META_KEY = 'proxuma-it-case-management-v1';
  let timer = 0;
  let activeCaseId = '';

  const currentCaseId = () => ($('visibleCaseId')?.textContent || '').trim() || 'draft';
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || (key === HISTORY_KEY ? '[]' : '{}')); } catch { return key === HISTORY_KEY ? [] : {}; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const values = () => ({
    name: $('caseManagementName')?.value.trim() || '',
    status: $('caseManagementStatus')?.value || 'open',
    priority: $('caseManagementPriority')?.value || 'medium',
    notes: $('caseManagementNotes')?.value.trim() || '',
    finalDecision: $('caseManagementDecision')?.value.trim() || '',
    updatedAt: new Date().toISOString()
  });
  const updateVisuals = data => {
    const root = $('case-management');
    if (root) { root.dataset.status = data.status || 'open'; root.dataset.priority = data.priority || 'medium'; }
    if ($('caseManagementUpdated')) $('caseManagementUpdated').textContent = data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'Not saved yet';
  };
  const status = message => { if ($('caseManagementSaveState')) $('caseManagementSaveState').textContent = message; };

  function persist(manual = false){
    const id = currentCaseId();
    const data = values();
    const meta = read(META_KEY); meta[id] = data;
    const ok = write(META_KEY, meta);
    const history = read(HISTORY_KEY);
    const item = history.find(x => x.caseId === id);
    if (item) { item.caseManagement = data; write(HISTORY_KEY, history); }
    updateVisuals(data);
    status(ok ? (manual ? 'Saved locally' : 'Auto-saved') : 'Storage unavailable');
    document.dispatchEvent(new CustomEvent('proxuma:case-management-updated', { detail:{caseId:id, data} }));
  }
  function schedule(){ clearTimeout(timer); status('Saving…'); timer = setTimeout(() => persist(false), 550); }
  function load(force = false){
    const id = currentCaseId();
    if (!force && id === activeCaseId) return;
    activeCaseId = id;
    const meta = read(META_KEY);
    const history = read(HISTORY_KEY);
    const fromHistory = history.find(x => x.caseId === id)?.caseManagement;
    const data = fromHistory || meta[id] || {name:'',status:'open',priority:'medium',notes:'',finalDecision:'',updatedAt:''};
    if ($('caseManagementName')) $('caseManagementName').value = data.name || '';
    if ($('caseManagementStatus')) $('caseManagementStatus').value = data.status || 'open';
    if ($('caseManagementPriority')) $('caseManagementPriority').value = data.priority || 'medium';
    if ($('caseManagementNotes')) $('caseManagementNotes').value = data.notes || '';
    if ($('caseManagementDecision')) $('caseManagementDecision').value = data.finalDecision || '';
    updateVisuals(data); status(data.updatedAt ? 'Saved locally' : 'Ready');
  }
  function clear(){
    ['caseManagementName','caseManagementNotes','caseManagementDecision'].forEach(id => { if ($(id)) $(id).value=''; });
    if ($('caseManagementStatus')) $('caseManagementStatus').value='open';
    if ($('caseManagementPriority')) $('caseManagementPriority').value='medium';
    persist(true);
  }
  document.addEventListener('DOMContentLoaded', () => {
    ['caseManagementName','caseManagementStatus','caseManagementPriority','caseManagementNotes','caseManagementDecision'].forEach(id => {
      $(id)?.addEventListener(id.includes('Status') || id.includes('Priority') ? 'change' : 'input', schedule);
    });
    $('caseManagementSave')?.addEventListener('click', () => persist(true));
    $('caseManagementClear')?.addEventListener('click', clear);
    load(true);
    const caseId = $('visibleCaseId');
    if (caseId) new MutationObserver(() => setTimeout(() => load(true), 40)).observe(caseId,{childList:true,subtree:true,characterData:true});
    document.addEventListener('proxuma:dashboard-settled', () => setTimeout(() => load(true), 60));
  });
  window.ProxumaCaseManagement = { get: values, save: () => persist(true), load: () => load(true) };
})();
