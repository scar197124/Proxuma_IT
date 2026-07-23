(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const text = id => ($(id)?.textContent || '').trim();
  const value = id => ($(id)?.value || '').trim();
  const esc = input => String(input ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const slug = input => String(input || 'proxuma-case').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80) || 'proxuma-case';

  let lastFocus = null;
  let currentReport = null;

  function listText(selector){
    return [...document.querySelectorAll(selector)].map(node => node.textContent.trim()).filter(Boolean);
  }

  function collectFindings(){
    const cards = [...document.querySelectorAll('#trustFindingList .trust-finding-card')];
    if (cards.length) return cards.map((card, index) => ({
      number: index + 1,
      severity: (card.querySelector('.finding-severity')?.textContent || 'info').trim(),
      title: (card.querySelector('h4')?.textContent || `Finding ${index + 1}`).trim(),
      status: (card.querySelector('.remediation-status option:checked')?.textContent || 'To review').trim(),
      whyItMatters: (card.querySelector('.action-block p')?.textContent || '').trim(),
      recommendedAction: ([...card.querySelectorAll('.action-block p')][1]?.textContent || '').trim(),
      evidence: (card.querySelector('.verified-block p')?.textContent || '').trim()
    }));
    return listText('#visibleEvidenceList li').map((item,index)=>({number:index+1,severity:'info',title:item,status:'To review',whyItMatters:item,recommendedAction:'Review this evidence and verify the target independently.',evidence:item}));
  }

  function collectDomainIntel(){
    const status = text('domainIntelStatus');
    const verified = !$('domainIntelVerified')?.hidden;
    return {
      verified,
      verificationLabel: verified ? text('domainIntelVerified') : status || 'Offline',
      summary: text('domainIntelSummary'),
      scannedHost: text('domainIntelDomain'),
      registrableDomain: text('domainIntelRegistrable'),
      hostingPlatform: text('domainIntelPlatform'),
      lookupScope: text('domainIntelScope'),
      parentDomainAge: text('domainIntelAge'),
      registrar: text('domainIntelRegistrar'),
      created: text('domainIntelCreated'),
      expires: text('domainIntelExpires'),
      source: text('domainIntelSource'),
      interpretation: text('domainIntelInterpretation'),
      retrieved: text('domainIntelRetrieved')
    };
  }

  function collectComparison(){
    const panel = $('caseComparisonPanel');
    if (!panel || panel.hidden) return null;
    return {
      context: text('caseComparisonContext'),
      summary: text('caseComparisonSummary'),
      previousScore: text('caseComparisonPrevious'),
      currentScore: text('caseComparisonCurrent'),
      direction: text('caseComparisonDirection'),
      delta: text('caseComparisonDelta'),
      newCount: text('caseCompareNewCount'),
      resolvedCount: text('caseCompareResolvedCount'),
      changedCount: text('caseCompareChangedCount'),
      unchangedCount: text('caseCompareUnchangedCount'),
      changes: listText('#caseComparisonChanges li'),
      recommendedResponse: text('caseComparisonAction')
    };
  }

  function snapshot(){
    const target = value('targetInput') || text('trueTarget') || text('caseCurrentTarget') || 'No target available';
    return {
      reportVersion: '3.50.0',
      generatedAt: new Date().toISOString(),
      privacy: 'Generated locally in the browser. No upload is required to create this report.',
      case: {
        id: text('visibleCaseId') || 'Unassigned',
        status: text('visibleCaseStatus') || 'Current investigation',
        target,
        inputType: text('inputTypeLabel') || 'Not identified'
      },
      assessment: {
        riskLabel: text('riskLabel') || text('caseCurrentVerdict') || 'Not assessed',
        riskScore: text('scoreValue') || text('caseCurrentRisk') || '0',
        confidence: text('confidenceLabel') || text('caseCurrentConfidence') || 'Not measured',
        summary: text('summaryText') || text('explainSummary') || 'No summary available.',
        primaryConcern: text('primaryTrigger') || text('investigationSummaryConcern') || 'Not identified',
        recommendedAction: text('actionText') || text('investigationSummaryAction') || text('safeMove') || 'Review the evidence before taking action.',
        whyScore: text('whyScore') || text('explainSummary') || 'No score explanation available.'
      },
      actionProgress: {
        completed: text('findingProgressText') || '0 of 0 actions completed',
        percent: text('findingProgressPercent') || '0%'
      },
      findings: collectFindings(),
      supportingEvidence: listText('#visibleEvidenceList li'),
      domainIntelligence: collectDomainIntel(),
      comparison: collectComparison(),
      notes: value('caseNotes') || value('caseJournalNote') || '',
      timeline: listText('#timelineList li, #caseTimeline li:not(.case-timeline-empty)')
    };
  }

  function readableText(r){
    const lines = [
      'PROXUMA IT CASE REPORT',
      `Generated: ${new Date(r.generatedAt).toLocaleString()}`,
      `Case: ${r.case.id}`,
      `Target: ${r.case.target}`,
      `Status: ${r.case.status}`,
      '',
      'ASSESSMENT',
      `Risk: ${r.assessment.riskLabel} (${r.assessment.riskScore}/100)`,
      `Confidence: ${r.assessment.confidence}`,
      `Primary concern: ${r.assessment.primaryConcern}`,
      `Summary: ${r.assessment.summary}`,
      `Recommended action: ${r.assessment.recommendedAction}`,
      `Action progress: ${r.actionProgress.completed} (${r.actionProgress.percent})`,
      '',
      'FINDINGS'
    ];
    if (!r.findings.length) lines.push('No findings recorded.');
    r.findings.forEach(f => lines.push(`${f.number}. [${f.severity.toUpperCase()}] ${f.title}\n   Status: ${f.status}\n   Evidence: ${f.evidence || f.whyItMatters}\n   Next step: ${f.recommendedAction}`));
    lines.push('', 'LIVE DOMAIN INTELLIGENCE');
    const d=r.domainIntelligence;
    lines.push(`Verification: ${d.verificationLabel}`, `Scanned host: ${d.scannedHost}`, `Registrable domain: ${d.registrableDomain}`, `Domain age: ${d.parentDomainAge}`, `Registrar: ${d.registrar}`, `Created: ${d.created}`, `Expires: ${d.expires}`, `Source: ${d.source}`, `Interpretation: ${d.interpretation}`, `Retrieved: ${d.retrieved}`);
    if (r.comparison){
      lines.push('', 'CASE COMPARISON', `${r.comparison.context}`, `Previous: ${r.comparison.previousScore}`, `Current: ${r.comparison.currentScore}`, `Direction: ${r.comparison.direction} (${r.comparison.delta})`, `New: ${r.comparison.newCount} | Resolved: ${r.comparison.resolvedCount} | Changed: ${r.comparison.changedCount} | Unchanged: ${r.comparison.unchangedCount}`, `Recommended response: ${r.comparison.recommendedResponse}`);
      r.comparison.changes.forEach(x=>lines.push(`- ${x}`));
    }
    if(r.notes) lines.push('', 'CASE NOTES', r.notes);
    lines.push('', r.privacy, 'Proxuma findings support investigation and do not replace independent verification or professional advice.');
    return lines.join('\n');
  }

  function htmlReport(r){
    const findings = r.findings.map(f=>`<article class="finding"><div class="finding-title"><span>${esc(f.severity)}</span><h3>${esc(f.title)}</h3><b>${esc(f.status)}</b></div><p><strong>Evidence:</strong> ${esc(f.evidence || f.whyItMatters)}</p><p><strong>Recommended next step:</strong> ${esc(f.recommendedAction)}</p></article>`).join('') || '<p>No findings recorded.</p>';
    const d=r.domainIntelligence;
    const comparison = r.comparison ? `<section><h2>Case comparison</h2><div class="metrics"><div><b>${esc(r.comparison.previousScore)}</b><span>Previous</span></div><div><b>${esc(r.comparison.currentScore)}</b><span>Current</span></div><div><b>${esc(r.comparison.delta)}</b><span>Change</span></div></div><p><strong>${esc(r.comparison.direction)}</strong> — ${esc(r.comparison.summary)}</p><ul>${r.comparison.changes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p><strong>Recommended response:</strong> ${esc(r.comparison.recommendedResponse)}</p></section>` : '';
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Proxuma Case Report ${esc(r.case.id)}</title><style>:root{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033;background:#f5f7fa}*{box-sizing:border-box}body{margin:0}.page{max-width:940px;margin:32px auto;background:#fff;padding:42px;border:1px solid #d8dee8;border-radius:18px;box-shadow:0 16px 48px rgba(23,32,51,.09)}header{border-bottom:3px solid #172033;padding-bottom:22px;margin-bottom:24px}h1{margin:.2rem 0;font-size:2rem}h2{margin-top:30px;font-size:1.15rem}.meta,.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.meta div,.metrics div,.intel div{border:1px solid #d8dee8;border-radius:10px;padding:12px}.meta span,.metrics span,.intel dt{display:block;color:#657086;font-size:.78rem;text-transform:uppercase;letter-spacing:.04em}.metrics b{font-size:1.45rem}.intel{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.intel dd{margin:.25rem 0 0}.finding{border:1px solid #d8dee8;border-left:5px solid #4f5d75;border-radius:10px;padding:14px;margin:12px 0}.finding-title{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px}.finding-title span{text-transform:uppercase;font-weight:800;font-size:.75rem}.finding-title h3{margin:0}.finding-title b{font-size:.78rem}.notice{margin-top:30px;padding:14px;background:#f2f5f8;border-radius:10px;color:#586274}.notes{white-space:pre-wrap}.verified{display:inline-block;padding:5px 9px;border-radius:999px;background:#e7f7ed;color:#176b3a;font-weight:800;font-size:.78rem}@media(max-width:700px){.page{margin:0;border:0;border-radius:0;padding:24px}.meta,.metrics,.intel{grid-template-columns:1fr}.finding-title{grid-template-columns:1fr}}@media print{body{background:#fff}.page{box-shadow:none;border:0;margin:0;max-width:none;padding:18mm}.no-print{display:none!important}}</style></head><body><main class="page"><header><small>PROXUMA IT · LOCAL CASE REPORT</small><h1>Investigation Report</h1><p>${esc(r.case.target)}</p><small>Case ${esc(r.case.id)} · ${esc(new Date(r.generatedAt).toLocaleString())}</small></header><section class="meta"><div><span>Risk</span><strong>${esc(r.assessment.riskLabel)} (${esc(r.assessment.riskScore)}/100)</strong></div><div><span>Confidence</span><strong>${esc(r.assessment.confidence)}</strong></div><div><span>Action progress</span><strong>${esc(r.actionProgress.completed)}</strong></div></section><section><h2>Captain summary</h2><p>${esc(r.assessment.summary)}</p><p><strong>Primary concern:</strong> ${esc(r.assessment.primaryConcern)}</p><p><strong>Recommended action:</strong> ${esc(r.assessment.recommendedAction)}</p></section><section><h2>Findings into action</h2>${findings}</section><section><h2>Live domain intelligence</h2><p><span class="verified">${esc(d.verificationLabel)}</span> ${esc(d.summary)}</p><dl class="intel"><div><dt>Scanned host</dt><dd>${esc(d.scannedHost)}</dd></div><div><dt>Registrable domain</dt><dd>${esc(d.registrableDomain)}</dd></div><div><dt>Domain age</dt><dd>${esc(d.parentDomainAge)}</dd></div><div><dt>Registrar</dt><dd>${esc(d.registrar)}</dd></div><div><dt>Created</dt><dd>${esc(d.created)}</dd></div><div><dt>Expires</dt><dd>${esc(d.expires)}</dd></div><div><dt>Source</dt><dd>${esc(d.source)}</dd></div><div><dt>Retrieved</dt><dd>${esc(d.retrieved)}</dd></div></dl><p><strong>Interpretation:</strong> ${esc(d.interpretation)}</p></section>${comparison}${r.notes?`<section><h2>Case notes</h2><p class="notes">${esc(r.notes)}</p></section>`:''}<footer class="notice">${esc(r.privacy)}<br>Proxuma supports investigation and does not replace independent verification or professional advice.</footer></main></body></html>`;
  }

  function download(name,data,type){
    const blob=new Blob([data],{type});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),700);
  }

  function preview(r){
    const d=r.domainIntelligence;
    $('caseReportPreview').innerHTML=`<div class="case-report-preview-top"><div><small>Case</small><strong>${esc(r.case.id)}</strong><span>${esc(r.case.target)}</span></div><div class="case-report-risk"><small>Risk</small><strong>${esc(r.assessment.riskScore)}/100</strong><span>${esc(r.assessment.riskLabel)}</span></div></div><div class="case-report-preview-grid"><div><small>Confidence</small><strong>${esc(r.assessment.confidence)}</strong></div><div><small>Findings</small><strong>${r.findings.length}</strong></div><div><small>Actions</small><strong>${esc(r.actionProgress.percent)}</strong></div><div><small>Online Intel</small><strong>${esc(d.verificationLabel)}</strong></div></div><p>${esc(r.assessment.summary)}</p>${r.comparison?`<div class="case-report-comparison-note"><strong>Comparison included</strong><span>${esc(r.comparison.context)} · ${esc(r.comparison.delta)}</span></div>`:''}`;
  }

  function openDialog(){
    currentReport=snapshot();
    if(!value('targetInput') && /No target available/i.test(currentReport.case.target)){
      $('visibleWireStatus').textContent='Run or open a scan before exporting a case report.';
      return;
    }
    preview(currentReport);
    lastFocus=document.activeElement;
    $('caseReportDialog').hidden=false;
    document.body.classList.add('case-report-open');
    setTimeout(()=>$('caseReportPrint')?.focus(),20);
  }
  function closeDialog(){
    $('caseReportDialog').hidden=true;
    document.body.classList.remove('case-report-open');
    lastFocus?.focus?.();
  }
  function ensure(){ return currentReport || (currentReport=snapshot()); }
  function status(message){ if($('caseReportStatus')) $('caseReportStatus').textContent=message; }

  document.addEventListener('DOMContentLoaded',()=>{
    $('visibleCaseReport')?.addEventListener('click',openDialog);
    $('caseReportClose')?.addEventListener('click',closeDialog);
    document.querySelectorAll('[data-report-close]').forEach(x=>x.addEventListener('click',closeDialog));
    document.addEventListener('keydown',e=>{if(e.key==='Escape' && !$('caseReportDialog')?.hidden) closeDialog();});
    $('caseReportPrint')?.addEventListener('click',()=>{
      const report=ensure(); const win=window.open('','_blank');
      if(!win){status('Pop-up blocked. Use Download HTML, then print the downloaded report.');return;}
      try{win.opener=null;}catch{} win.document.open();win.document.write(htmlReport(report));win.document.close();
      setTimeout(()=>{win.focus();win.print();},250); status('Printable report opened. Choose Save as PDF in the print dialog.');
    });
    $('caseReportHtml')?.addEventListener('click',()=>{const r=ensure();download(`${slug(r.case.id)}-proxuma-report.html`,htmlReport(r),'text/html');status('Shareable HTML report downloaded.');});
    $('caseReportText')?.addEventListener('click',()=>{const r=ensure();download(`${slug(r.case.id)}-proxuma-report.txt`,readableText(r),'text/plain');status('Readable text report downloaded.');});
    $('caseReportJson')?.addEventListener('click',()=>{const r=ensure();download(`${slug(r.case.id)}-proxuma-report.json`,JSON.stringify(r,null,2),'application/json');status('Structured JSON report downloaded.');});
    $('caseReportCopy')?.addEventListener('click',async()=>{const t=readableText(ensure());try{await navigator.clipboard.writeText(t);}catch{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();}status('Case report summary copied.');});
    document.addEventListener('proxuma:scan-result',()=>{currentReport=null;});
    document.addEventListener('proxuma:dashboard-synced',()=>{currentReport=null;});
  });
})();
