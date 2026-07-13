(function(){
  'use strict';
  const CONSENT_KEY='proxuma-it-online-consent-v1';
  const CACHE_KEY='proxuma-it-rdap-cache-v3';
  const CACHE_TTL=24*60*60*1000;
  const LOOKUP_TIMEOUT=10000;

  const HOSTED_SUFFIXES=[
    ['azurewebsites.net','Microsoft Azure'],['firebaseapp.com','Firebase Hosting'],['myshopify.com','Shopify'],
    ['amazonaws.com','Amazon Web Services'],['cloudfront.net','Amazon CloudFront'],['github.io','GitHub Pages'],
    ['herokuapp.com','Heroku'],['wordpress.com','WordPress.com'],['blogspot.com','Blogger'],
    ['vercel.app','Vercel'],['netlify.app','Netlify'],['pages.dev','Cloudflare Pages'],
    ['workers.dev','Cloudflare Workers'],['web.app','Firebase Hosting'],['onrender.com','Render'],
    ['railway.app','Railway'],['fly.dev','Fly.io'],['deno.dev','Deno Deploy'],['replit.app','Replit'],
    ['repl.co','Replit'],['glitch.me','Glitch'],['surge.sh','Surge'],['notion.site','Notion'],
    ['wixsite.com','Wix'],['weebly.com','Weebly'],['square.site','Square'],['carrd.co','Carrd'],
    ['webflow.io','Webflow']
  ].sort((a,b)=>b[0].length-a[0].length);

  const COMMON_SECOND_LEVEL=new Set([
    'co.uk','org.uk','gov.uk','ac.uk','com.au','net.au','org.au','co.nz','com.br','com.mx','co.jp','co.kr',
    'com.sg','com.hk','co.in','firm.in','net.in','org.in','gen.in','ind.in','com.cn','com.tw','co.za','com.tr'
  ]);

  const els={
    panel:document.getElementById('domainIntelPanel'), status:document.getElementById('domainIntelStatus'),
    summary:document.getElementById('domainIntelSummary'), domain:document.getElementById('domainIntelDomain'),
    registrable:document.getElementById('domainIntelRegistrable'), platform:document.getElementById('domainIntelPlatform'),
    scope:document.getElementById('domainIntelScope'), age:document.getElementById('domainIntelAge'),
    registrar:document.getElementById('domainIntelRegistrar'), created:document.getElementById('domainIntelCreated'),
    expires:document.getElementById('domainIntelExpires'), source:document.getElementById('domainIntelSource'),
    profile:document.getElementById('domainIntelProfile'), retrieved:document.getElementById('domainIntelRetrieved'),
    run:document.getElementById('runDomainIntelButton'), consent:document.getElementById('enableOnlineConsentButton'),
    sourceItems:document.getElementById('scanSourceItems'), visibleEvidence:document.getElementById('visibleEvidenceList')
  };
  if(!els.panel)return;

  let activeToken=0,activeController=null,lastHost='',lastFingerprint='',lastResult=null,lastOutcome='idle',lastContext=null;
  const text=(el,value)=>{if(el)el.textContent=value;};
  const provided=value=>value===null||value===undefined||String(value).trim()===''?'Not provided':String(value);
  const consentArmed=()=>{try{return JSON.parse(localStorage.getItem(CONSENT_KEY)||'null')?.status==='armed';}catch(_){return false;}};

  function hostFrom(value){
    let raw=String(value||'').trim();if(!raw)return'';
    try{if(!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw))raw='https://'+raw;raw=new URL(raw).hostname;}catch(_){return'';}
    return raw.toLowerCase().replace(/^www\./,'').replace(/\.$/,'');
  }
  function registrableDomain(host){
    const labels=String(host||'').split('.').filter(Boolean);
    if(labels.length<=2)return labels.join('.');
    const last2=labels.slice(-2).join('.');
    return COMMON_SECOND_LEVEL.has(last2)?labels.slice(-3).join('.'):last2;
  }
  function domainContext(host){
    const hosted=HOSTED_SUFFIXES.find(([suffix])=>host!==suffix&&host.endsWith('.'+suffix));
    if(hosted){return {host,lookupDomain:hosted[0],platform:hosted[1],kind:'hosted',scope:'Parent-domain registration'};}
    const lookupDomain=registrableDomain(host);
    if(host!==lookupDomain)return {host,lookupDomain,platform:'Not identified',kind:'subdomain',scope:'Registrable-domain record'};
    return {host,lookupDomain,platform:'Not identified',kind:'direct',scope:'Direct domain registration'};
  }
  function reportHost(report){
    const legacy=report?.legacy||report||window.ProxumaLegacyLastReport||window.ProxumaScanResult?.report||{};
    return hostFrom(legacy.root||legacy.rootDomain||report?.domain?.name||report?.domain||legacy.target||legacy.raw||document.getElementById('targetInput')?.value);
  }
  function reportFingerprint(report,host){
    const legacy=report?.legacy||report||{};
    return [host,legacy.scanId||report?.scanId||'',legacy.time||legacy.displayTime||legacy.reportTimestamp||''].join('|');
  }
  function eventDate(events,names){const wanted=names.map(x=>x.toLowerCase());return (Array.isArray(events)?events:[]).find(e=>wanted.includes(String(e.eventAction||'').toLowerCase()))?.eventDate||null;}
  function registrarName(data){
    if(data.registrarName)return data.registrarName;
    const registrar=(Array.isArray(data.entities)?data.entities:[]).find(e=>(e.roles||[]).includes('registrar'));
    const card=registrar?.vcardArray?.[1];return (Array.isArray(card)?card.find(row=>row?.[0]==='fn')?.[3]:null)||null;
  }
  function normalize(domain,data){
    const events=data?.events||[];
    return {domain,registrarName:registrarName(data),created:eventDate(events,['registration','created']),updated:eventDate(events,['last changed','last update of rdap database','updated']),expires:eventDate(events,['expiration','expires']),status:Array.isArray(data?.status)?data.status:[],nameservers:Array.isArray(data?.nameservers)?data.nameservers.map(n=>n.ldhName||n.unicodeName).filter(Boolean).slice(0,6):[]};
  }
  function ageInfo(created){
    const d=new Date(created);if(!created||Number.isNaN(d.getTime()))return {label:'Not provided',days:null,profile:'Age unavailable'};
    const days=Math.max(0,Math.floor((Date.now()-d.getTime())/86400000));let label;
    if(days<30)label=days+' days';else{const months=Math.floor(days/30.4375);if(months<24)label=months+' months';else{const years=Math.floor(days/365.25),rem=Math.floor((days-years*365.25)/30.4375);label=years+' yr'+(years===1?'':'s')+(rem?' '+rem+' mo':'');}}
    let profile='Long-established';if(days<30)profile='Newly registered';else if(days<180)profile='Recently registered';else if(days<730)profile='Established';
    return {label,days,profile};
  }
  function dateLabel(value){if(!value)return'Not provided';const d=new Date(value);return Number.isNaN(d.getTime())?String(value):d.toLocaleDateString();}
  function timeLabel(value){const d=value?new Date(value):new Date();return Number.isNaN(d.getTime())?'Not available':d.toLocaleString();}
  function setStatus(label,tone){text(els.status,label);els.status.className='status-pill '+(tone||'status-low');}
  function setRunButton(mode){if(!els.run)return;els.run.disabled=mode==='running';els.run.textContent=mode==='running'?'Checking Domain…':mode==='failed'?'Retry Domain Intelligence':'Run Domain Intelligence';}
  function applyContext(context){
    text(els.domain,context?.host||'Waiting');text(els.registrable,context?.lookupDomain||'Not available');
    text(els.platform,context?.platform||'Not identified');text(els.scope,context?.scope||'Not available');
  }
  function evidenceLine(result,source,context){
    if(!els.visibleEvidence)return;let item=els.visibleEvidence.querySelector('[data-domain-intel-evidence]');
    if(!item){item=document.createElement('li');item.dataset.domainIntelEvidence='true';els.visibleEvidence.appendChild(item);}
    const age=ageInfo(result?.created),registrar=provided(result?.registrarName);
    if(context?.kind==='hosted')item.textContent=`Hosted subdomain: ${context.host} is served on ${context.platform}. RDAP describes parent domain ${context.lookupDomain} (${age.profile.toLowerCase()}, ${age.label}); it does not reveal the deployment's age. Registrar ${registrar}; source ${source}.`;
    else if(context?.kind==='subdomain')item.textContent=`Subdomain detected: ${context.host}. RDAP describes registrable domain ${context.lookupDomain} (${age.profile.toLowerCase()}, ${age.label}); registrar ${registrar}; source ${source}.`;
    else item.textContent=`Domain intelligence: ${context?.host||result?.domain} is ${age.profile.toLowerCase()} (${age.label}); registrar ${registrar}; source ${source}.`;
  }
  function removeEvidence(){els.visibleEvidence?.querySelector('[data-domain-intel-evidence]')?.remove();}
  function render(result,source,retrievedAt,context){
    lastResult=result||null;lastContext=context||lastContext;applyContext(lastContext);
    if(!result){text(els.age,'Not available');text(els.registrar,'Not available');text(els.created,'Not available');text(els.expires,'Not available');text(els.source,source||'Local only');text(els.profile,lastContext?.kind==='hosted'?'Hosted subdomain':'Not available');text(els.retrieved,'Not available');return;}
    const age=ageInfo(result.created);text(els.age,age.label);text(els.registrar,provided(result.registrarName));text(els.created,dateLabel(result.created));text(els.expires,dateLabel(result.expires));text(els.source,provided(source));
    if(lastContext?.kind==='hosted')text(els.profile,'Hosted subdomain · parent '+age.profile.toLowerCase());
    else if(lastContext?.kind==='subdomain')text(els.profile,'Subdomain · parent '+age.profile.toLowerCase());
    else text(els.profile,age.profile);
    text(els.retrieved,timeLabel(retrievedAt));
    if(lastContext?.kind==='hosted')text(els.summary,`Hosted subdomain detected on ${lastContext.platform}. Registration data belongs to ${lastContext.lookupDomain}, not to this individual deployment.`);
    else if(lastContext?.kind==='subdomain')text(els.summary,`Subdomain detected. Registration context belongs to ${lastContext.lookupDomain}, not specifically to ${lastContext.host}.`);
    else text(els.summary,`${age.profile} domain context loaded. Registration data supports the investigation but does not determine the safety verdict by itself.`);
    evidenceLine(result,source,lastContext);
  }
  function cacheRead(domain){try{const all=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}'),item=all[domain];return item&&Date.now()-item.savedAt<CACHE_TTL?item:null;}catch(_){return null;}}
  function cacheWrite(domain,result){try{const all=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}');all[domain]={savedAt:Date.now(),result};localStorage.setItem(CACHE_KEY,JSON.stringify(all));}catch(_){}}
  function sourceChip(status,freshness,context){
    if(!els.sourceItems)return;let chip=els.sourceItems.querySelector('[data-domain-intel-chip]');
    if(!chip){chip=document.createElement('span');chip.dataset.domainIntelChip='true';const dot=document.createElement('i');dot.setAttribute('aria-hidden','true');chip.append(dot,document.createTextNode(''));els.sourceItems.appendChild(chip);}
    const partial=context?.kind==='hosted'&&status==='unavailable';
    const cls=status==='running'?'is-running':status==='complete'?(freshness==='cached'?'is-cached':'is-complete'):partial?'is-cached':'is-unavailable';
    chip.className='scan-source-chip '+cls;
    const label=status==='running'?'running':status==='complete'?(freshness==='cached'?'cached':'live'):partial?'hosted subdomain':'unavailable';
    chip.lastChild.nodeValue='Domain intelligence · '+label;
  }
  function emit(status,detail={}){document.dispatchEvent(new CustomEvent('proxuma:domain-intelligence-status',{detail:{status,domain:lastHost,context:lastContext,...detail}}));}
  async function fetchRdap(domain,signal){
    const bridgeBase=window.PROXUMA_RDAP_BRIDGE_BASE?String(window.PROXUMA_RDAP_BRIDGE_BASE).replace(/\/$/,''):'';const urls=[];
    if(bridgeBase||!location.hostname.endsWith('github.io'))urls.push((bridgeBase||'')+'/api/proxuma-rdap?domain='+encodeURIComponent(domain));
    urls.push('https://rdap.org/domain/'+encodeURIComponent(domain));let lastError=null;
    for(const url of urls){try{const response=await fetch(url,{headers:{Accept:'application/rdap+json, application/json'},cache:'no-store',signal});const data=await response.json().catch(()=>null);if(!response.ok||!data)throw new Error('Lookup unavailable');if(data.ok&&data.result)return data.result;return normalize(domain,data);}catch(error){if(signal.aborted)throw error;lastError=error;}}
    throw lastError||new Error('RDAP unavailable');
  }
  async function run(report,force=false){
    const host=reportHost(report);lastHost=host;lastContext=domainContext(host);
    if(!host){setStatus('No domain','status-low');text(els.summary,'Run a URL or domain scan first.');render(null,'Local only',null,lastContext);setRunButton('idle');return;}
    applyContext(lastContext);
    if(!consentArmed()){setStatus('Consent required','status-low');text(els.summary,'Enable online checks to retrieve registration context for '+lastContext.lookupDomain+'.');setRunButton('idle');return;}
    const cached=!force&&cacheRead(lastContext.lookupDomain);
    if(cached){lastOutcome='complete';render(cached.result,'RDAP cached',cached.savedAt,lastContext);setStatus(lastContext.kind==='hosted'?'Hosted subdomain':'Cached',lastContext.kind==='hosted'?'status-medium':'status-medium');sourceChip('complete','cached',lastContext);setRunButton('idle');emit('complete',{result:cached.result,context:lastContext,source:{id:'rdap',label:'Domain intelligence',status:'complete',freshness:'cached'},retrievedAt:cached.savedAt});return;}
    if(activeController)activeController.abort();const token=++activeToken,controller=new AbortController();activeController=controller;const timer=setTimeout(()=>controller.abort('timeout'),LOOKUP_TIMEOUT);
    lastOutcome='running';setStatus('Checking…','status-medium');text(els.summary,`Retrieving ${lastContext.scope.toLowerCase()} for ${lastContext.lookupDomain}…`);sourceChip('running',null,lastContext);setRunButton('running');emit('running');
    try{
      const result=await fetchRdap(lastContext.lookupDomain,controller.signal);if(token!==activeToken)return;const retrievedAt=Date.now();cacheWrite(lastContext.lookupDomain,result);lastOutcome='complete';render(result,'RDAP live',retrievedAt,lastContext);
      setStatus(lastContext.kind==='hosted'?'Hosted subdomain':'Live','status-medium');sourceChip('complete','live',lastContext);setRunButton('idle');
      const detail={domain:lastContext.lookupDomain,host:lastContext.host,result,context:lastContext,source:{id:'rdap',label:'Domain intelligence',status:'complete',freshness:'live'},retrievedAt};document.dispatchEvent(new CustomEvent('proxuma:domain-intelligence-ready',{detail}));emit('complete',detail);
    }catch(error){
      if(token!==activeToken)return;const timedOut=controller.signal.aborted;lastOutcome='failed';
      if(lastContext.kind==='hosted'){
        setStatus('Hosted subdomain','status-medium');text(els.summary,`Hosted subdomain detected on ${lastContext.platform}. Parent-domain registration lookup for ${lastContext.lookupDomain} ${timedOut?'timed out':'was unavailable'}; the local scan remains complete.`);text(els.profile,'Hosted subdomain');
      }else{setStatus(timedOut?'Timed out':'Unavailable','status-low');text(els.summary,timedOut?'Domain intelligence timed out. Retry when the network is stable; the local scan remains complete.':'Domain intelligence was unavailable. Retry when ready; the local scan remains complete.');text(els.profile,'Unavailable');}
      text(els.source,timedOut?'Timed out':'Unavailable');text(els.retrieved,timeLabel());sourceChip('unavailable',null,lastContext);setRunButton('failed');removeEvidence();emit(timedOut?'timeout':'unavailable',{context:lastContext,error:String(error?.message||error)});
    }finally{clearTimeout(timer);if(activeController===controller)activeController=null;if(token===activeToken&&lastOutcome!=='failed')setRunButton('idle');}
  }
  function onReport(report){
    const host=reportHost(report);if(!host)return;const fingerprint=reportFingerprint(report,host);if(fingerprint===lastFingerprint&&(lastOutcome==='running'||lastOutcome==='complete'))return;
    lastFingerprint=fingerprint;lastHost=host;lastContext=domainContext(host);removeEvidence();render(null,consentArmed()?'Ready for RDAP':'Local only',null,lastContext);setStatus(consentArmed()?(lastContext.kind==='hosted'?'Hosted subdomain':'Ready'):'Offline',consentArmed()?'status-medium':'status-low');setRunButton('idle');if(consentArmed())run(report,false);
  }
  document.addEventListener('proxuma:report-ready',e=>onReport(e.detail?.report));
  document.addEventListener('proxuma:legacy-scan-complete',e=>onReport(e.detail?.report));
  document.addEventListener('proxuma:dashboard-synced',()=>onReport(window.ProxumaReport||window.ProxumaLegacyLastReport));
  els.run?.addEventListener('click',()=>run(window.ProxumaReport||window.ProxumaLegacyLastReport,true));
  els.consent?.addEventListener('click',()=>setTimeout(()=>{setStatus(consentArmed()?(lastContext?.kind==='hosted'?'Hosted subdomain':'Ready'):'Offline',consentArmed()?'status-medium':'status-low');if(consentArmed()&&lastHost)run(window.ProxumaReport||window.ProxumaLegacyLastReport,false);},0));
  document.addEventListener('DOMContentLoaded',()=>{setStatus(consentArmed()?'Ready':'Offline',consentArmed()?'status-medium':'status-low');setRunButton('idle');});
})();
