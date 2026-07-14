(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const clean=(value,fallback)=>{const v=String(value||'').trim();return v||fallback;};
  const score=()=>Math.max(0,Math.min(100,Number(($('scoreValue')?.textContent||'0').replace(/[^0-9.]/g,''))||0));
  const scanned=()=>clean($('reportTimestamp')?.textContent,'Not scanned')!=='Not scanned' || score()>0;
  function tone(value){return value>=70?'high':value>=35?'medium':value>0?'low':'idle';}
  function update(reason){
    const value=score();
    const active=scanned();
    const state=$('missionState');
    const verdict=$('missionVerdict');
    const confidence=$('missionConfidence');
    const action=$('missionAction');
    const bar=$('missionControl');
    const meter=$('missionMeterFill');
    if(state) state.textContent=active?'Report synchronized':'Ready for target';
    if(verdict) verdict.textContent=active?clean($('riskLabel')?.textContent,'Report ready'):'No scan yet';
    if(confidence) confidence.textContent=active?clean($('investigationSummaryConfidence')?.textContent,'Measured locally'):'Waiting';
    if(action) action.textContent=active?clean($('investigationSummaryAction')?.textContent,'Review the result'):'Paste, scan, or choose an example';
    if(meter) meter.style.width=value+'%';
    if(bar){bar.dataset.missionTone=tone(value);bar.dataset.missionState=active?'complete':'idle';bar.setAttribute('data-update-reason',reason||'sync');}
    const scoreNode=$('missionScore'); if(scoreNode) scoreNode.textContent=active?value+'/100':'—';
  }
  function jump(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});}
  async function copySummary(){
    const text=[
      'Proxuma IT scan summary',
      'Verdict: '+clean($('riskLabel')?.textContent,'Not scanned'),
      'Risk score: '+score()+'/100',
      'Confidence: '+clean($('investigationSummaryConfidence')?.textContent,'Waiting'),
      'Primary concern: '+clean($('investigationSummaryConcern')?.textContent,'Waiting'),
      'Recommended action: '+clean($('investigationSummaryAction')?.textContent,'Scan first'),
      'Case: '+clean($('visibleCaseId')?.textContent,'No case yet')
    ].join('\n');
    try{await navigator.clipboard.writeText(text);$('missionCopy').textContent='Copied';setTimeout(()=>{$('missionCopy').textContent='Copy Brief';},1400);}catch(e){$('missionCopy').textContent='Copy unavailable';setTimeout(()=>{$('missionCopy').textContent='Copy Brief';},1600);}
  }
  function bind(){
    $('missionReview')?.addEventListener('click',()=>jump('investigation-workspace'));
    $('missionEvidence')?.addEventListener('click',()=>jump('scan-detail-workspace'));
    $('missionCopy')?.addEventListener('click',copySummary);
    $('missionNew')?.addEventListener('click',()=>{const button=$('visibleNewInvestigation')||$('visibleResetWorkspace');if(button)button.click();else {const input=$('targetInput');if(input){input.value='';input.focus();}}});
    document.addEventListener('keydown',event=>{
      if(event.key==='/' && !/input|textarea|select/i.test(document.activeElement?.tagName||'')){event.preventDefault();$('targetInput')?.focus();}
    });
    ['proxuma:legacy-scan-complete','proxuma:scan-result','proxuma:dashboard-synced','proxuma:report-ready','proxuma:scan-state-change'].forEach(name=>document.addEventListener(name,()=>setTimeout(()=>update(name),0)));
    new MutationObserver(()=>update('visible-report-change')).observe($('report')||document.body,{subtree:true,childList:true,characterData:true});
    update('initial');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
