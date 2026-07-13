(function(){
  'use strict';
  const stateEl=document.getElementById('scanSourceState');
  const itemsEl=document.getElementById('scanSourceItems');
  const timeEl=document.getElementById('scanSourceFreshness');
  const scanButton=document.getElementById('scanButton');
  const reportTimestamp=document.getElementById('reportTimestamp');
  if(!stateEl||!itemsEl||!timeEl)return;

  const labels={ready:'Ready',scanning:'Analyzing',complete:'Complete',partial:'Partial intelligence',error:'Scan error',cancelled:'Cancelled',running:'Running',unavailable:'Unavailable'};
  let scanStartedAt=null;
  let completedForCurrentScan=false;

  const safeDate=value=>{if(!value)return null;const d=new Date(value);return Number.isNaN(d.getTime())?null:d;};
  const currentLegacyReport=()=>window.ProxumaLegacyLastReport||window.ProxumaScanResult?.report||null;

  function normalizeSources(state){
    const reportSources=Array.isArray(state?.report?.sources)?state.report.sources:[];
    if(reportSources.length)return reportSources.map((source,index)=>({id:source.id||`source-${index}`,label:source.label||source.id||`Source ${index+1}`,status:source.status||(state.status==='scanning'?'running':'complete'),freshness:source.freshness||'live'}));
    const entries=Object.entries(state?.sourceStatus||{});
    if(entries.length)return entries.map(([id,status])=>({id,label:id==='local'?'Local analysis':id.replace(/[-_]/g,' '),status,freshness:status==='complete'?'live':''}));
    return [{id:'local',label:'Local analysis',status:state?.status==='scanning'?'running':state?.status==='complete'?'complete':'ready',freshness:state?.status==='complete'?'live':''}];
  }
  function chipClass(source){const status=String(source.status||'').toLowerCase(),freshness=String(source.freshness||'').toLowerCase();if(status==='complete'&&freshness==='cached')return'is-cached';if(status==='complete')return'is-complete';if(status==='running')return'is-running';if(status==='partial')return'is-partial';if(status==='error')return'is-error';if(status==='unavailable')return'is-unavailable';return'is-ready';}
  function sourceText(source){const status=String(source.status||'ready').toLowerCase(),freshness=String(source.freshness||'').toLowerCase();if(status==='complete')return`${source.label} · ${freshness==='cached'?'cached':freshness==='live'?'live':'complete'}`;return`${source.label} · ${labels[status]||status}`;}
  function render(state){
    const status=state?.status||'ready';
    stateEl.textContent=labels[status]||status;
    itemsEl.replaceChildren(...normalizeSources(state).map(source=>{const chip=document.createElement('span');chip.className=`scan-source-chip ${chipClass(source)}`;const dot=document.createElement('i');dot.setAttribute('aria-hidden','true');chip.append(dot,document.createTextNode(sourceText(source)));return chip;}));
    const stamp=state?.completedAt||state?.report?.completedAt||(status==='scanning'?(state?.startedAt||scanStartedAt):null),date=safeDate(stamp);
    timeEl.textContent=status==='scanning'?`Started ${date?date.toLocaleTimeString([],{hour:'numeric',minute:'2-digit',second:'2-digit'}):'now'}`:date?`Updated ${date.toLocaleTimeString([],{hour:'numeric',minute:'2-digit',second:'2-digit'})}`:'Not scanned';
    timeEl.dateTime=date?date.toISOString():'';
  }
  function complete(report,completedAt){
    if(completedForCurrentScan)return;
    completedForCurrentScan=true;
    const foundation=window.ProxumaScanState?.getState?.();
    render({...(foundation||{}),status:'complete',report:report||foundation?.report||currentLegacyReport(),completedAt:completedAt||report?.completedAt||foundation?.completedAt||new Date().toISOString(),sourceStatus:{...(foundation?.sourceStatus||{}),local:'complete'}});
  }
  function begin(){
    completedForCurrentScan=false;
    scanStartedAt=new Date().toISOString();
    render({status:'scanning',startedAt:scanStartedAt,sourceStatus:{local:'running'}});
  }
  function dashboardLooksComplete(){
    const stamp=(reportTimestamp?.textContent||'').trim();
    const buttonBusy=scanButton?.getAttribute('aria-busy')==='true';
    const report=currentLegacyReport();
    return !buttonBusy && !!report && stamp && !/not scanned|waiting|standby/i.test(stamp);
  }
  function reconcile(){ if(!completedForCurrentScan && dashboardLooksComplete()) complete(currentLegacyReport()); }

  document.addEventListener('proxuma:scan-state-change',event=>{
    const state=event.detail?.state;
    if(state?.status==='scanning') begin();
    else if(state?.status==='complete'||state?.status==='partial'||state?.status==='error'||state?.status==='cancelled') render(state);
  });
  document.addEventListener('proxuma:report-ready',event=>complete(event.detail?.report,event.detail?.report?.completedAt));
  document.addEventListener('proxuma:legacy-scan-complete',event=>complete(event.detail?.report,event.detail?.completedAt));
  document.addEventListener('proxuma:scan-result',event=>complete(event.detail?.report||currentLegacyReport(),event.detail?.completedAt));
  document.addEventListener('proxuma:dashboard-synced',event=>complete(currentLegacyReport(),event.detail?.completedAt));

  scanButton?.addEventListener('click',begin,{capture:false});
  document.addEventListener('click',event=>{if(event.target.closest?.('[data-example]'))begin();},false);

  // Observe only the two definitive UI completion indicators. This observer does
  // not render repeatedly; complete() is idempotent for the active scan.
  const observer=new MutationObserver(reconcile);
  if(reportTimestamp)observer.observe(reportTimestamp,{childList:true,subtree:true,characterData:true});
  if(scanButton)observer.observe(scanButton,{attributes:true,attributeFilter:['aria-busy']});

  document.addEventListener('DOMContentLoaded',()=>{
    const foundation=window.ProxumaScanState?.getState?.();
    render(foundation||{status:'ready'});
    reconcile();
  });
})();
