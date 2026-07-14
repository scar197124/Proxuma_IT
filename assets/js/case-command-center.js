(() => {
  'use strict';
  const HISTORY_KEY='proxuma-it-visible-case-history-v1';
  const META_KEY='proxuma-it-case-command-meta-v2';
  const LEGACY_META_KEY='proxuma-it-case-command-meta-v1';
  const $=id=>document.getElementById(id);
  let filter='all';
  let selectedId='';
  const safeParse=(raw,fallback)=>{try{const value=JSON.parse(raw);return value&&typeof value==='object'?value:fallback;}catch(_){return fallback;}};
  const history=()=>safeParse(localStorage.getItem(HISTORY_KEY)||'[]',[]);
  function meta(){
    const current=safeParse(localStorage.getItem(META_KEY)||'{}',{});
    if(Object.keys(current).length)return current;
    const legacy=safeParse(localStorage.getItem(LEGACY_META_KEY)||'{}',{});
    if(Object.keys(legacy).length){saveMeta(legacy);return legacy;}
    return {};
  }
  const saveMeta=value=>{try{localStorage.setItem(META_KEY,JSON.stringify(value));}catch(_){}}
  const now=()=>new Date().toISOString();
  const stamp=value=>{try{return new Date(value).toLocaleString([], {dateStyle:'medium',timeStyle:'short'});}catch(_){return value||'Unknown time';}};
  const statusGroup=s=>s==='Resolved'?'resolved':'open';
  const priority=c=>Number(c.riskScore||0)>=80||String(c.status||'')==='Action Required';
  function ensureRecord(m,c){
    const id=c.caseId;
    const existing=m[id]||{};
    const timeline=Array.isArray(existing.timeline)?existing.timeline:[];
    if(!timeline.length)timeline.push({type:'saved',title:'Case saved',detail:`${c.riskLabel||'Result'} · risk ${c.riskScore??0}/100`,at:c.timestamp||now()});
    m[id]={status:existing.status||'New',updatedAt:existing.updatedAt||c.timestamp||now(),openedAt:existing.openedAt||'',notes:Array.isArray(existing.notes)?existing.notes:[],timeline};
    return m[id];
  }
  function normalized(){
    const m=meta();let changed=false;
    const cases=history().map(c=>{if(!m[c.caseId])changed=true;const r=ensureRecord(m,c);return {...c,status:r.status,updatedAt:r.updatedAt,openedAt:r.openedAt,notes:r.notes,timeline:r.timeline};});
    if(changed)saveMeta(m);
    return cases;
  }
  function addEvent(caseId,type,title,detail){const m=meta();const c=history().find(x=>x.caseId===caseId);if(!c)return;const r=ensureRecord(m,c);r.timeline.unshift({type,title,detail,at:now()});r.updatedAt=now();saveMeta(m);}
  function announce(text){if($('caseCommandStatus'))$('caseCommandStatus').textContent=text;}
  function escapeHTML(v){return String(v??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}
  function setStatus(caseId,status){const m=meta();const c=history().find(x=>x.caseId===caseId);if(!c)return;const r=ensureRecord(m,c);const previous=r.status;r.status=status;r.updatedAt=now();r.timeline.unshift({type:'status',title:'Status changed',detail:`${previous} → ${status}`,at:now()});saveMeta(m);selectedId=caseId;render();announce(`${caseId} marked ${status}.`);}
  function render(){
    const cases=normalized(); const q=String($('caseCommandSearch')?.value||'').trim().toLowerCase();
    const view=cases.filter(c=>{const noteText=(c.notes||[]).map(n=>n.text).join(' ');const blob=`${c.caseId} ${c.target} ${c.riskLabel} ${c.status} ${c.action} ${noteText}`.toLowerCase();if(q&&!blob.includes(q))return false;if(filter==='priority')return priority(c);if(filter==='resolved')return statusGroup(c.status)==='resolved';if(filter==='open')return statusGroup(c.status)==='open';return true;});
    if($('caseStatTotal'))$('caseStatTotal').textContent=cases.length;if($('caseStatOpen'))$('caseStatOpen').textContent=cases.filter(c=>statusGroup(c.status)==='open').length;if($('caseStatPriority'))$('caseStatPriority').textContent=cases.filter(priority).length;if($('caseStatResolved'))$('caseStatResolved').textContent=cases.filter(c=>statusGroup(c.status)==='resolved').length;
    const list=$('caseCommandList'); if(!list)return; list.innerHTML=''; if($('caseCommandEmpty'))$('caseCommandEmpty').hidden=cases.length!==0;
    view.forEach(c=>{const card=document.createElement('article');card.className='case-command-card'+(selectedId===c.caseId?' is-selected':'');card.dataset.priority=String(priority(c));const lastNote=(c.notes||[])[0]?.text||'No investigation notes yet.';card.innerHTML=`<div class="case-card-top"><span class="case-card-id">${escapeHTML(c.caseId)}</span><span class="case-card-risk">${escapeHTML(c.riskLabel||'Unknown')} · ${escapeHTML(c.riskScore??0)}</span></div><div class="case-card-target">${escapeHTML(c.target||'Unknown target')}</div><div class="case-card-meta"><span>${escapeHTML(c.confidence||'Confidence unknown')}</span><span>•</span><span>${escapeHTML(stamp(c.timestamp))}</span></div><div class="case-card-note-preview" title="${escapeHTML(lastNote)}">Latest note: ${escapeHTML(lastNote)}</div><div class="case-card-top"><label><span class="sr-only">Case status</span><select class="case-card-status" data-case-status="${escapeHTML(c.caseId)}"><option>New</option><option>Investigating</option><option>Action Required</option><option>Monitoring</option><option>Resolved</option></select></label><span>${priority(c)?'Priority case':'Standard case'}</span></div><div class="case-card-actions"><button type="button" class="case-journal-open" data-case-journal="${escapeHTML(c.caseId)}">Notes & Timeline</button><button type="button" class="case-open" data-case-open="${escapeHTML(c.caseId)}">Reopen</button><button type="button" data-case-copy="${escapeHTML(c.caseId)}">Copy Brief</button><button type="button" data-case-remove="${escapeHTML(c.caseId)}">Remove</button></div>`;card.querySelector('select').value=c.status;list.appendChild(card);});
    if(cases.length&&view.length===0)list.innerHTML='<div class="case-command-empty"><strong>No matching cases.</strong><span>Change the search or filter to see other investigations.</span></div>';
    if(selectedId&&!cases.some(c=>c.caseId===selectedId))selectedId='';
    renderJournal(cases.find(c=>c.caseId===selectedId));
  }
  function renderJournal(c){
    const title=$('caseJournalTitle'),target=$('caseJournalTarget'),badge=$('caseJournalStatus'),note=$('caseJournalNote'),add=$('caseJournalAdd'),copy=$('caseJournalCopy'),timeline=$('caseTimeline'),count=$('caseTimelineCount');if(!title||!timeline)return;
    if(!c){title.textContent='Select a saved case';target.textContent='Choose a case to view notes and its investigation timeline.';badge.textContent='Waiting';note.disabled=true;add.disabled=true;copy.disabled=true;timeline.innerHTML='<li class="case-timeline-empty">No case selected.</li>';count.textContent='0 entries';return;}
    title.textContent=c.caseId;target.textContent=c.target||'Unknown target';badge.textContent=c.status;note.disabled=false;add.disabled=false;copy.disabled=false;
    const entries=[...(c.timeline||[])].sort((a,b)=>String(b.at).localeCompare(String(a.at)));count.textContent=`${entries.length} ${entries.length===1?'entry':'entries'}`;timeline.innerHTML=entries.length?entries.map(e=>`<li><strong>${escapeHTML(e.title||'Activity')}</strong><time datetime="${escapeHTML(e.at||'')}">${escapeHTML(stamp(e.at))}</time><span>${escapeHTML(e.detail||'')}</span></li>`).join(''):'<li class="case-timeline-empty">No activity recorded.</li>';
  }
  function findCase(id){return normalized().find(c=>c.caseId===id);}
  function selectCase(id){selectedId=id;render();setTimeout(()=>$('caseJournal')?.scrollIntoView({behavior:'smooth',block:'nearest'}),20);announce(`${id} journal opened.`);}
  function openCase(id){const c=findCase(id);if(!c)return;selectedId=id;const input=$('targetInput');if(input){input.value=c.target||'';input.dispatchEvent(new Event('input',{bubbles:true}));}const m=meta();const r=ensureRecord(m,c);if(r.status==='New')r.status='Investigating';r.openedAt=now();r.updatedAt=now();r.timeline.unshift({type:'reopened',title:'Case reopened',detail:'Saved target restored and submitted for a fresh local analysis.',at:now()});saveMeta(m);$('scanButton')?.click();setTimeout(()=>document.getElementById('missionControl')?.scrollIntoView({behavior:'smooth',block:'center'}),250);announce(`${id} reopened and re-analyzed.`);render();}
  function brief(c){const notes=(c.notes||[]).map(n=>`- ${stamp(n.at)}: ${n.text}`).join('\n')||'- No notes recorded';return `Proxuma IT Case Brief\nCase: ${c.caseId}\nTarget: ${c.target}\nVerdict: ${c.riskLabel} (${c.riskScore}/100)\nConfidence: ${c.confidence}\nStatus: ${c.status}\nRecommended action: ${c.action||'Review the case.'}\n\nInvestigation Notes\n${notes}`;}
  function copyText(text,done){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(done).catch(done);else done();}
  function copyCase(id){const c=findCase(id);if(!c)return;copyText(brief(c),()=>{addEvent(id,'copy','Case brief copied','A current case brief was copied to the clipboard.');selectedId=id;render();announce(`${id} brief copied.`);});}
  function copyTimeline(){const c=findCase(selectedId);if(!c)return;const rows=(c.timeline||[]).sort((a,b)=>String(a.at).localeCompare(String(b.at))).map(e=>`${stamp(e.at)} — ${e.title}: ${e.detail}`).join('\n');copyText(`Proxuma IT Investigation Timeline\nCase: ${c.caseId}\nTarget: ${c.target}\n\n${rows}`,()=>announce(`${c.caseId} timeline copied.`));}
  function addNote(){const input=$('caseJournalNote');const text=String(input?.value||'').trim();const c=findCase(selectedId);if(!c||!text)return;const m=meta();const r=ensureRecord(m,c);const entry={text,at:now()};r.notes.unshift(entry);r.timeline.unshift({type:'note',title:'Investigation note added',detail:text,at:entry.at});r.updatedAt=entry.at;if(r.status==='New')r.status='Investigating';saveMeta(m);input.value='';render();announce(`Note added to ${c.caseId}.`);}
  function removeCase(id){const remaining=history().filter(c=>c.caseId!==id);try{localStorage.setItem(HISTORY_KEY,JSON.stringify(remaining));}catch(_){}const m=meta();delete m[id];saveMeta(m);if(selectedId===id)selectedId='';render();document.dispatchEvent(new CustomEvent('proxuma:case-history-changed'));announce(`${id} removed from local case history.`);}
  function syncSavedCases(){const m=meta();let changed=false;history().forEach(c=>{if(!m[c.caseId]){ensureRecord(m,c);changed=true;}});if(changed)saveMeta(m);render();document.dispatchEvent(new CustomEvent('proxuma:case-history-changed'));}
  function bind(){
    $('caseCommandSearch')?.addEventListener('input',render);document.querySelectorAll('[data-case-filter]').forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.caseFilter;document.querySelectorAll('[data-case-filter]').forEach(x=>x.classList.toggle('active',x===btn));render();}));
    $('caseCommandList')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.caseJournal)selectCase(b.dataset.caseJournal);else if(b.dataset.caseOpen)openCase(b.dataset.caseOpen);else if(b.dataset.caseCopy)copyCase(b.dataset.caseCopy);else if(b.dataset.caseRemove)removeCase(b.dataset.caseRemove);});
    $('caseCommandList')?.addEventListener('change',e=>{const s=e.target.closest('[data-case-status]');if(s)setStatus(s.dataset.caseStatus,s.value);});
    $('caseCommandStart')?.addEventListener('click',()=>document.getElementById('scan')?.scrollIntoView({behavior:'smooth',block:'start'}));$('caseJournalAdd')?.addEventListener('click',addNote);$('caseJournalCopy')?.addEventListener('click',copyTimeline);$('caseJournalNote')?.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')addNote();});
    $('visibleSaveCase')?.addEventListener('click',()=>setTimeout(syncSavedCases,100));const recent=$('visibleCaseHistory');if(recent)new MutationObserver(syncSavedCases).observe(recent,{childList:true,subtree:true,characterData:true});window.addEventListener('storage',e=>{if([HISTORY_KEY,META_KEY,LEGACY_META_KEY].includes(e.key))render();});render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
