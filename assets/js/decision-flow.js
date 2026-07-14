(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const order = ['scan','understand','verify','act','save'];
  const labels = {
    scan:['Run a scan','Start Scan','No case is active yet.'],
    understand:['Understand the verdict','Review Result','Read why the score and verdict were produced.'],
    verify:['Verify the evidence','Check Evidence','Confirm the strongest signals before deciding what to do.'],
    act:['Choose a safe response','Open Actions','Turn the findings into a concrete next move.'],
    save:['Preserve the investigation','Save Case','Save the case packet when the review is complete.'],
    complete:['Case flow complete','Review Case','The investigation has been scanned, reviewed, verified, acted on, and saved.']
  };
  let completed = new Set();
  let caseKey = 'idle';
  const clean = v => String(v || '').trim();
  const isScanned = () => clean($('reportTimestamp')?.textContent) !== 'Not scanned' || Number(clean($('scoreValue')?.textContent)) > 0;
  const getCaseKey = () => clean($('visibleCaseId')?.textContent) || clean($('reportTimestamp')?.textContent) || 'idle';
  const storageKey = () => `proxuma:decision-flow:${caseKey}`;
  function load(){
    caseKey=getCaseKey();
    try{completed=new Set(JSON.parse(localStorage.getItem(storageKey())||'[]'));}catch(_){completed=new Set();}
    if(isScanned()) completed.add('scan');
  }
  function save(){try{localStorage.setItem(storageKey(),JSON.stringify([...completed]));}catch(_){} }
  function nextStage(){return order.find(step=>!completed.has(step)) || 'complete';}
  function mark(step){
    const idx=order.indexOf(step);
    if(idx<0) return;
    for(let i=0;i<=idx;i++) completed.add(order[i]);
    save();render();
  }
  function render(){
    if(isScanned()) completed.add('scan');
    const next=nextStage();
    const flow=$('decisionFlow');
    if(flow) flow.dataset.flowStage=next;
    document.querySelectorAll('[data-flow-step]').forEach(li=>{
      const step=li.dataset.flowStep;
      li.classList.toggle('is-complete',completed.has(step));
      li.classList.toggle('is-current',step===next);
      li.classList.toggle('is-locked',order.indexOf(step)>order.indexOf(next) && next!=='complete');
      li.querySelector('button')?.setAttribute('aria-current',step===next?'step':'false');
    });
    const percent=Math.round((completed.size/order.length)*100);
    if($('decisionFlowFill')) $('decisionFlowFill').style.width=percent+'%';
    if($('decisionFlowPercent')) $('decisionFlowPercent').textContent=percent+'%';
    $('decisionFlowProgress')?.setAttribute?.('aria-valuenow',String(percent));
    const copy=labels[next];
    if($('decisionFlowNext')) $('decisionFlowNext').textContent=copy[0];
    if($('decisionFlowReason')) $('decisionFlowReason').textContent=copy[2];
    if($('decisionFlowContinue')) $('decisionFlowContinue').textContent=copy[1];
    if($('decisionFlowLead')) $('decisionFlowLead').textContent=next==='complete' ? 'The case is complete and ready for later review.' : `Current stage: ${copy[0]}. Proxuma keeps the next useful step in view.`;
  }
  function targetFor(step){return {scan:'scan',understand:'details',verify:'scan-detail-workspace',act:'workflow',save:'investigation-workspace',complete:'investigation-workspace'}[step];}
  function go(step){
    if(step!=='scan' && !isScanned()) step='scan';
    document.getElementById(targetFor(step))?.scrollIntoView({behavior:'smooth',block:'start'});
    if(step==='save') setTimeout(()=>$('visibleSaveCase')?.focus(),450);
    if(step!=='scan' && step!=='save' && step!=='complete') mark(step);
    if(step==='understand') document.querySelector('[data-drawer-target="explainPanel"]')?.click();
  }
  function syncNewCase(){
    const fresh=getCaseKey();
    if(fresh!==caseKey){load();render();return;}
    if(isScanned() && !completed.has('scan')){completed.add('scan');save();render();}
  }
  function bind(){
    const progress=document.querySelector('.decision-flow-progress'); if(progress) progress.id='decisionFlowProgress';
    document.querySelectorAll('[data-flow-target]').forEach(btn=>btn.addEventListener('click',()=>go(btn.closest('[data-flow-step]')?.dataset.flowStep||'scan')));
    $('decisionFlowContinue')?.addEventListener('click',()=>go(nextStage()));
    $('missionReview')?.addEventListener('click',()=>mark('understand'));
    $('missionEvidence')?.addEventListener('click',()=>mark('verify'));
    $('visibleSaveCase')?.addEventListener('click',()=>setTimeout(()=>mark('save'),0));
    document.querySelectorAll('.finding-filter,#trustFindingList button').forEach(el=>el.addEventListener('click',()=>mark('act')));
    ['proxuma:legacy-scan-complete','proxuma:scan-result','proxuma:dashboard-synced','proxuma:report-ready'].forEach(name=>document.addEventListener(name,()=>setTimeout(syncNewCase,0)));
    const report=$('report'); if(report)new MutationObserver(syncNewCase).observe(report,{subtree:true,childList:true,characterData:true});
    load();render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
