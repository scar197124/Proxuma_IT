(function(){
  "use strict";
  const $ = (id) => document.getElementById(id);
  const text = (id, fallback="") => (($(id) && $(id).textContent || "").trim() || fallback);
  const set = (id, value) => { const el = $(id); if (el) el.textContent = value; };
  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const htmlList = (id, items) => {
    const el = $(id); if (!el) return;
    el.innerHTML = "";
    (items && items.length ? items : ["No data yet."]).slice(0,8).forEach((item) => {
      const li = document.createElement("li"); li.textContent = item; el.appendChild(li);
    });
  };
  const clickHidden = (id, status) => {
    const el = $(id);
    if (el && typeof el.click === "function") { el.click(); return true; }
    if (status) set("visibleWireStatus", status);
    return false;
  };

  const CASE_KEY = "proxuma-it-visible-case-history-v1";
  let lastSerialized = "";
  let lastCaseSignature = "";
  let activeInvestigationView = "overview";
  let investigationState = "MISSION_READY";
  let investigationDirty = false;
  let bypassInvestigationManager = false;
  let pendingInvestigationAction = null;
  let renderTimer = null;
  function scheduleCaptainRender(state="Complete", delay=120){
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => renderCaptainWiring(state), delay);
  }
  function scheduleScanSettledRenders(){
    [80, 180, 350, 700, 1200, 2000].forEach((delay) => setTimeout(() => renderCaptainWiring("Complete"), delay));
  }
  function forceDashboardSync(reason="Complete"){
    renderCaptainWiring(reason);
    scheduleScanSettledRenders();
  }
  window.ProxumaForceDashboardSync = forceDashboardSync;


  function getRiskTone(r){
    if (!r || !r.scanned) return { key:"standby", label:"Ready", accent:"#7f8ea3" };
    const score = Number(r.riskScore || 0);
    if (score >= 80) return { key:"critical", label:"Critical", accent:"#ff3b7a" };
    if (score >= 60) return { key:"high", label:"High Risk", accent:"#ef4444" };
    if (score >= 40) return { key:"elevated", label:"Elevated", accent:"#f47b20" };
    if (score >= 20) return { key:"guarded", label:"Needs Review", accent:"#d8a23d" };
    if (score >= 10) return { key:"low", label:"Low Risk", accent:"#b88955" };
    return { key:"minimal", label:"Minimal Risk", accent:"#35c97b" };
  }

  function applyRiskColorIntelligence(r){
    const tone = getRiskTone(r);
    const root = document.documentElement;
    root.setAttribute("data-risk-tone", tone.key);
    root.style.setProperty("--proxuma-live-risk-accent", tone.accent);
    ["report","captain-summary","details","investigation-workspace","scan-detail-workspace","workflow"].forEach((id) => {
      const el = $(id);
      if (el) el.setAttribute("data-risk-tone", tone.key);
    });
    const status = $("analysisViewStatus");
    if (status) {
      status.textContent = r && r.scanned ? `${tone.label} · ${Number(r.riskScore || 0)}/100` : "Ready";
      status.setAttribute("data-risk-tone", tone.key);
    }
    const explain = $("explainStatus");
    if (explain) explain.setAttribute("data-risk-tone", tone.key);
    const scoreRing = $("scoreValue") && $("scoreValue").closest ? $("scoreValue").closest(".score-ring") : null;
    if (scoreRing) scoreRing.setAttribute("data-risk-tone", tone.key);
  }

  function riskBand(score){
    if (score >= 80) return "High";
    if (score >= 50) return "Medium";
    if (score >= 20) return "Low";
    return "Minimal";
  }
  function makeCaseId(target, timestamp){
    if ((!target || target === "Waiting") && (!timestamp || timestamp === "Not scanned")) return "No case yet";
    const raw = `${target || "scan"}|${timestamp || new Date().toISOString()}`;
    let h = 0;
    for (let i=0;i<raw.length;i++) h = Math.imul(31, h) + raw.charCodeAt(i) | 0;
    return "PX-" + new Date().toISOString().slice(2,10).replace(/-/g,"") + "-" + Math.abs(h).toString(36).slice(0,5).toUpperCase();
  }
  function readHistory(){ try { return JSON.parse(localStorage.getItem(CASE_KEY) || "[]"); } catch(e){ return []; } }
  function writeHistory(items){ try { localStorage.setItem(CASE_KEY, JSON.stringify(items.slice(0,10))); } catch(e){} }

  function readList(id){
    const el = $(id); if (!el) return [];
    return Array.from(el.querySelectorAll("li")).map(li => li.textContent.trim()).filter(Boolean);
  }
  function buildEvidence(r){
    const nativeEvidence = readList("evidenceList");
    const technical = readList("technicalList");
    const timeline = readList("timelineList");
    const items = [];
    if (r.target && r.target !== "Waiting") items.push(`Target resolved: ${r.target}`);
    if (r.rootDomain && r.rootDomain !== "Waiting") items.push(`Root/domain signal: ${r.rootDomain}`);
    if (r.signalCount && r.signalCount !== "0") items.push(`${r.signalCount} local signal(s) contributed to this result.`);
    if (r.primaryTrigger && r.primaryTrigger !== "Waiting") items.push(`Primary trigger: ${r.primaryTrigger}`);
    if (r.evidenceStrength && r.evidenceStrength !== "Waiting") items.push(`Evidence strength: ${r.evidenceStrength}`);
    if (r.severityMix && !r.severityMix.startsWith("0 high")) items.push(`Severity mix: ${r.severityMix}`);
    nativeEvidence.forEach(x => { if (!/^no target scanned/i.test(x)) items.push(x); });
    technical.slice(0,3).forEach(x => items.push(`Technical: ${x}`));
    timeline.slice(0,2).forEach(x => items.push(`Timeline: ${x}`));
    if (!items.length) items.push("No evidence yet. Run a scan to build the case file.");
    return Array.from(new Set(items));
  }

  function buildScoreContributors(r){
    const score = Number(r.riskScore || 0);
    const items = [];
    const target = (r.target || r.input || "").toLowerCase();
    const https = /^https:\/\//i.test(r.input || r.target || "");
    const script = /javascript:|data:text|<script|onerror=|onclick=/i.test(r.input || "");
    const lookalike = /0|1|l0gin|verify|secure-|account|update|signin|bank/i.test(target);
    if (!r.scanned) return [{label:"Waiting for scan", impact:"neutral", detail:"Paste or scan a target to generate contributors."}];
    items.push({label:https ? "HTTPS detected" : "HTTPS not confirmed", impact:https ? "positive" : "warning", detail:https ? "Encrypted transport appears in the input." : "The input does not clearly show HTTPS."});
    items.push({label:script ? "Script-like payload detected" : "No script payload pattern", impact:script ? "negative" : "positive", detail:script ? "The input resembles executable browser code." : "No obvious JavaScript/data payload pattern found locally."});
    items.push({label:lookalike ? "Brand/login wording found" : "No strong brand impersonation wording", impact:lookalike ? "warning" : "positive", detail:lookalike ? "Sensitive words or lookalike characters may require caution." : "No obvious impersonation wording detected."});
    items.push({label:r.rootDomain && r.rootDomain !== "Waiting" ? "Domain parsed" : "Domain not resolved", impact:r.rootDomain && r.rootDomain !== "Waiting" ? "positive" : "neutral", detail:r.rootDomain && r.rootDomain !== "Waiting" ? `Root/domain: ${r.rootDomain}` : "Run analysis to populate domain details."});
    items.push({label:"Offline-first analysis", impact:"neutral", detail:"Optional online reputation remains off unless the user enables it."});
    items.push({label:score >= 50 ? "Elevated local risk score" : "Local risk score controlled", impact:score >= 50 ? "negative" : "positive", detail:`Current score: ${score}/100.`});
    return items;
  }
  function buildLivingTimeline(r){
    if (!r.scanned) return ["Waiting for scan"];
    const base = [];
    if (r.timestamp && r.timestamp !== "Not scanned") base.push(`${r.timestamp} · Scan started`);
    base.push("Target accepted");
    base.push("URL/domain signals parsed");
    base.push("Local risk contributors calculated");
    base.push("Evidence packet assembled");
    base.push("Captain verdict generated");
    const native = (r.timeline || []).concat(r.trustTrail || []).filter(Boolean);
    return Array.from(new Set(native.length ? native.concat(base) : base));
  }
  function buildEvidenceGroups(r){
    const groups = {
      "Identity": [],
      "Risk Signals": [],
      "Privacy": [],
      "Technical": []
    };
    if (!r.scanned) { groups["Identity"].push("No target scanned yet."); return groups; }
    groups["Identity"].push(`Target: ${r.target}`);
    if (r.rootDomain && r.rootDomain !== "Waiting") groups["Identity"].push(`Root/domain: ${r.rootDomain}`);
    groups["Risk Signals"].push(`Risk label: ${r.riskLabel}`);
    groups["Risk Signals"].push(`Threat score: ${r.riskScore}/100`);
    if (r.primaryTrigger && r.primaryTrigger !== "Waiting") groups["Risk Signals"].push(`Primary trigger: ${r.primaryTrigger}`);
    if (r.severityMix) groups["Risk Signals"].push(`Severity mix: ${r.severityMix}`);
    groups["Privacy"].push("Local-first scan path used.");
    groups["Privacy"].push("No upload performed by the visible workspace.");
    groups["Privacy"].push("Online intelligence remains optional and user-controlled.");
    (r.technical || []).slice(0,5).forEach(x => groups["Technical"].push(x));
    if (!groups["Technical"].length) groups["Technical"].push(`Input type: ${text("inputTypeLabel","Unknown")}`);
    return groups;
  }
  function fallbackConfidence(r){
    if (!r || !r.scanned) return "Waiting";
    const c = String(r.confidence || "").trim();
    if (c && !/not measured|waiting|scan first/i.test(c)) return c;
    const score = Number(r.riskScore || 0);
    if (score >= 80) return "High review";
    if (score >= 50) return "Medium confidence";
    if (score >= 20) return "Good confidence";
    return "High confidence";
  }
  function fallbackAction(r){
    if (!r || !r.scanned) return "Scan first";
    const a = String(r.action || r.nextStep || "").trim();
    if (a && !/scan first|enter a target|paste a target/i.test(a)) return a;
    const score = Number(r.riskScore || 0);
    if (score >= 80) return "Do not proceed";
    if (score >= 50) return "Review carefully";
    if (score >= 20) return "Proceed with caution";
    return "Looks safe locally";
  }
  function fallbackConcern(r){
    if (!r || !r.scanned) return "Waiting";
    const c = String(r.primaryTrigger || "").trim();
    if (c && !/waiting/i.test(c)) return c;
    const target = String(r.target || r.input || "").toLowerCase();
    if (/javascript:|data:text|<script|onerror=|onclick=/.test(target)) return "Script payload";
    if (/l0gin|verify|account|secure-|signin|update|0/.test(target)) return "Lookalike / account-risk pattern";
    if (/http:\/\//.test(target)) return "Unencrypted URL";
    return Number(r.riskScore||0) >= 50 ? "Elevated local signals" : "No major local concern";
  }
  function normalizeVisibleResult(r){
    if (!r) return r;
    r.confidence = fallbackConfidence(r);
    r.action = fallbackAction(r);
    r.nextStep = r.action;
    r.primaryTrigger = fallbackConcern(r);
    if (r.scanned && (!r.reason || /run a scan|paste a target/i.test(r.reason))) {
      r.reason = r.riskScore >= 50 ? "Local scan found caution signals that should be reviewed before continuing." : "Local scan did not find a strong immediate danger signal.";
    }
    return r;
  }

  function renderEvidenceTree(id, groups){
    const el = $(id); if (!el) return;
    el.innerHTML = Object.entries(groups).map(([name, items]) => `<details class="evidence-node" open><summary>${esc(name)} <span>${items.length}</span></summary><ul>${items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`).join("");
  }
  function resultFromLegacyReport(report){
    if (!report || typeof report !== "object") return null;
    const target = String(report.target || report.raw || (($("targetInput") && $("targetInput").value) || "Waiting")).trim() || "Waiting";
    const timestamp = String(report.displayTime || report.time || text("reportTimestamp", "Not scanned")).trim() || "Not scanned";
    const score = Number(report.score || 0) || 0;
    const scanned = Boolean(report.raw || target !== "Waiting" || timestamp !== "Not scanned" || score > 0);
    const r = {
      caseId: report.caseReference || report.casePacketId || makeCaseId(target, timestamp),
      scanned,
      target,
      input: String(report.raw || (($("targetInput") && $("targetInput").value) || "")).trim(),
      timestamp,
      riskLabel: report.risk || "Ready to scan",
      riskScore: score,
      riskBand: riskBand(score),
      confidence: report.confidence || "Not measured",
      confidenceNote: report.confidenceNote || "",
      summary: report.quickSummary || report.summary || "Enter a target to generate a report.",
      reason: report.explain || report.primaryReason || report.whyScore || report.summary || "Run a scan to see the strongest reason behind the verdict.",
      action: report.reportWhatToDoNext || report.whatHappened || report.next || report.actionTitle || "Scan first",
      nextStep: report.reportWhatToDoNext || report.next || "Scan first",
      signalCount: String(report.count ?? 0),
      primaryTrigger: report.primaryTrigger || "Waiting",
      severity: report.severityNote || "Not scanned",
      severityMix: report.severityMix || "0 high · 0 medium · 0 low",
      rootDomain: report.root || "Waiting",
      heatLabel: report.heatLabel || "Standby",
      evidenceStrength: report.evidenceStrength || "Waiting",
      timeline: Array.isArray(report.timeline) ? report.timeline.slice() : [],
      trustTrail: Array.isArray(report.trust) ? report.trust.slice() : [],
      decisionSteps: Array.isArray(report.decision) ? report.decision.slice() : [],
      technical: Array.isArray(report.technical) ? report.technical.slice() : [],
      threatStory: report.threat || "Paste a target and Proxuma will explain what could be happening.",
      scanMemory: report.scanMemory || "No previous scan",
      compareLast: report.compareLast || "Waiting for the first scan.",
      safeMove: report.reportWhatToDoNext || report.next || "Scan first"
    };
    r.evidence = Array.isArray(report.evidence) && report.evidence.length ? report.evidence.slice() : buildEvidence(r);
    r.scoreContributors = buildScoreContributors(r);
    r.livingTimeline = buildLivingTimeline(r);
    r.evidenceGroups = buildEvidenceGroups(r);
    r.report = { title:"Proxuma IT Captain Case Packet", generatedAt:new Date().toISOString(), privacy:"Local-first scan. Optional online checks remain off unless chosen.", legacyReport:report, result:r };
    return normalizeVisibleResult(r);
  }

  function buildScanResult(){
    const scoreRaw = text("scoreValue", "0");
    const score = Number(scoreRaw.replace(/[^0-9.]/g,"")) || 0;
    const target = text("trueTarget", ($("targetInput") && $("targetInput").value || "").trim() || "Waiting");
    const timestamp = text("reportTimestamp", "Not scanned");
    const scanned = target !== "Waiting" || timestamp !== "Not scanned" || score > 0;
    const result = {
      caseId: makeCaseId(target, timestamp),
      scanned,
      target,
      input: ($("targetInput") && $("targetInput").value || "").trim(),
      timestamp,
      riskLabel: text("riskLabel", "Ready to scan"),
      riskScore: score,
      riskBand: riskBand(score),
      confidence: text("confidenceLabel", text("captainSummaryConfidence", "Waiting")),
      confidenceNote: text("confidenceNote", ""),
      summary: text("summaryText", "Enter a target to generate a report."),
      reason: text("explainSummary", "Run a scan to see the strongest reason behind the verdict."),
      action: text("actionTitle", text("nextStep", "Scan first")),
      nextStep: text("nextStep", "Scan first"),
      signalCount: text("signalCount", "0"),
      primaryTrigger: text("primaryTrigger", "Waiting"),
      severity: text("severityNote", "Not scanned"),
      severityMix: text("severityMix", "0 high · 0 medium · 0 low"),
      rootDomain: text("rootDomain", "Waiting"),
      heatLabel: text("heatLabel", "Standby"),
      evidenceStrength: text("evidenceStrength", "Waiting"),
      timeline: readList("timelineList"),
      trustTrail: readList("trustTrail"),
      decisionSteps: readList("decisionList"),
      technical: readList("technicalList"),
      threatStory: text("threatStory", "Paste a target and Proxuma will explain what could be happening."),
      scanMemory: text("scanMemory", "No previous scan"),
      compareLast: text("compareLast", "Waiting for the first scan."),
      safeMove: text("safeMove", text("nextStep", "Scan first"))
    };
    result.evidence = buildEvidence(result);
    result.scoreContributors = buildScoreContributors(result);
    result.livingTimeline = buildLivingTimeline(result);
    result.evidenceGroups = buildEvidenceGroups(result);
    result.report = {
      title: "Proxuma IT Captain Case Packet",
      generatedAt: new Date().toISOString(),
      privacy: "Local-first scan. Optional online checks remain off unless chosen.",
      result
    };
    window.ProxumaScanResult = result;
    window.ProxumaCaseFile = result.report;
    return result;
  }

  function renderHistory(){
    const history = readHistory();
    htmlList("visibleCaseHistory", history.length ? history.map(h => `${h.caseId} · ${h.riskLabel} · ${h.target}`) : ["No saved cases yet."]);
  }

  function saveCurrentCase(auto){
    const r = buildScanResult();
    if (!r.input && (!r.target || r.target === "Waiting")) {
      set("visibleCaseStatus", "Paste a target before saving a case."); return;
    }
    const signature = `${r.target}|${r.timestamp}|${r.riskScore}`;
    if (auto && signature === lastCaseSignature) return;
    lastCaseSignature = signature;
    const history = readHistory().filter(h => h.caseId !== r.caseId);
    history.unshift({caseId:r.caseId,target:r.target,riskLabel:r.riskLabel,riskScore:r.riskScore,confidence:r.confidence,timestamp:r.timestamp,action:r.action});
    writeHistory(history);
    if (!auto) { investigationDirty = false; investigationState = "CASE_SAVED"; updateMissionStatus("Case Saved"); }
    set("visibleCaseStatus", auto ? "Case auto-saved locally." : "Case saved locally.");
    renderHistory();
  }

  function copyText(value, statusId, done){
    const finish = () => set(statusId, done);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(finish).catch(finish);
    else finish();
  }

  function renderDrawerPanels(r){
    set("explainStatus", r.scanned ? `${r.riskBand} risk · ${r.confidence}` : "Awaiting scan");
    const contributorLines = r.scoreContributors.map(c => `${c.impact === "positive" ? "✓" : c.impact === "negative" ? "⚠" : "•"} ${c.label}: ${c.detail}`);
    set("explainSummary", r.scanned ? `Threat Score ${r.riskScore}/100. ${r.reason && !/^run a scan/i.test(r.reason) ? r.reason : r.summary}` : "Run a scan to see the strongest reason behind the verdict.");
    htmlList("evidenceList", contributorLines);

    set("timelineStatus", r.scanned ? `${r.livingTimeline.length} steps` : "0 steps");
    set("trustStatus", r.scanned ? `Local case timeline for ${r.rootDomain || r.target}` : "Local only");
    htmlList("trustTrail", r.scanned ? ["Local scanner started", "No automatic cloud upload", "Optional online intelligence remains user-controlled"] : []);
    const timelineEl = $("timelineList");
    if (timelineEl) {
      timelineEl.innerHTML = "";
      (r.scanned ? r.livingTimeline : []).forEach((item) => { const li = document.createElement("li"); li.textContent = item; timelineEl.appendChild(li); });
    }

    set("threatStatus", r.scanned ? r.riskBand + " trajectory" : "Standby");
    set("threatStory", r.scanned ? `${r.riskLabel}: ${r.primaryTrigger || "local signals reviewed"}. ${r.summary} Captain recommendation: ${r.action || r.nextStep}.` : "Paste a target and Proxuma will explain what could be happening.");

    set("decisionStatus", r.scanned ? "Action ready" : "Standby");
    htmlList("decisionList", r.scanned ? [r.action || r.nextStep, "Verify the destination before entering credentials.", "Use an official app or manually typed address for sensitive accounts.", "Save or export the case packet if you need a record."] : []);

    htmlList("technicalList", r.scanned ? [`Input type: ${text("inputTypeLabel","Unknown")}`, `Root/domain: ${r.rootDomain}`, `Primary trigger: ${r.primaryTrigger}`, `Evidence strength: ${r.evidenceStrength}`, `Signals: ${r.signalCount}`] : []);
    set("compareLast", r.scanned ? `${r.caseId} · ${r.riskLabel} · ${r.target}` : "Waiting for the first scan.");
    set("safeMove", r.scanned ? (r.action || r.nextStep) : "Scan first");
    set("safeMoveNote", r.scanned ? `This recommendation is based on ${r.signalCount} local signal(s), ${r.severityMix}.` : "Proxuma explains the safest next step after analysis.");
  }

  function renderInvestigationBody(r){
    const el = $("visibleInvestigationBody"); if (!el) return;
    const evidenceTree = Object.entries(r.evidenceGroups).map(([name, items]) => `<details class="evidence-node" open><summary>${esc(name)} <span>${items.length}</span></summary><ul>${items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`).join("");
    if (!r.scanned) {
      el.innerHTML = `<strong>${esc(activeInvestigationView[0].toUpperCase()+activeInvestigationView.slice(1))}</strong><p>Run a scan to populate this investigation lane.</p>`;
      return;
    }
    if (activeInvestigationView === "overview") {
      el.innerHTML = `<strong>Overview</strong><p><b>${esc(r.caseId)}</b> is ${esc(r.riskLabel)} with ${esc(r.confidence)} confidence.</p><ul><li>Target: ${esc(r.target)}</li><li>Main concern: ${esc(r.primaryTrigger)}</li><li>Recommended action: ${esc(r.action || r.nextStep)}</li></ul>`;
    } else if (activeInvestigationView === "evidence") {
      el.innerHTML = `<strong>Evidence Explorer</strong><p>Grouped proof behind the Captain Summary.</p>${evidenceTree}`;
    } else if (activeInvestigationView === "case") {
      el.innerHTML = `<strong>Case File</strong><p><b>${esc(r.caseId)}</b> · ${esc(r.riskLabel)} · ${esc(r.target)}</p><ul><li>Timestamp: ${esc(r.timestamp)}</li><li>Confidence: ${esc(r.confidence)}</li><li>Action: ${esc(r.action || r.nextStep)}</li><li>Timeline steps: ${esc(r.livingTimeline.length)}</li><li>Evidence groups: ${esc(Object.keys(r.evidenceGroups).length)}</li></ul>`;
    } else {
      el.innerHTML = `<strong>Deep Analysis</strong><p>${esc(r.summary || r.reason)}</p><ul>${r.scoreContributors.map(x=>`<li><b>${esc(x.label)}</b> — ${esc(x.detail)}</li>`).join("")}</ul>`;
    }
  }

  function renderCaptainWiring(state, explicitResult){
    const r = explicitResult ? normalizeVisibleResult(explicitResult) : normalizeVisibleResult(buildScanResult());
    applyRiskColorIntelligence(r);
    set("captainSummaryVerdict", r.riskLabel);
    set("captainSummaryRisk", String(r.riskScore));
    set("captainSummaryConfidence", r.confidence || "Waiting");
    set("captainSummaryAction", r.action || r.nextStep || "Scan first");
    if (r.scanned) { investigationState = "INVESTIGATION_ACTIVE"; investigationDirty = true; }
    let reason = r.reason;
    if (!reason || reason === "Run a scan to see the strongest reason behind the verdict.") reason = r.summary;
    set("captainSummaryReason", reason);
    if (r.scanned) { set("confidenceLabel", r.confidence); set("actionTitle", r.action); set("nextStep", r.action); set("primaryTrigger", r.primaryTrigger); }
    if (state) set("captainScanState", state);

    set("investigationSummaryScore", String(r.riskScore));
    set("investigationSummaryConfidence", r.confidence || "Not measured");
    set("investigationSummaryConcern", r.primaryTrigger || "Waiting");
    set("investigationSummaryAction", r.action || "Paste a target");
    set("visibleCaseId", r.caseId);
    if (r.scanned && text("visibleCaseStatus", "").match(/waiting for scan/i)) set("visibleCaseStatus", "Scan complete. Case packet ready.");
    htmlList("visibleEvidenceList", r.evidence);
    renderDrawerPanels(r);
    renderInvestigationBody(r);

    const serialized = JSON.stringify(r.report, null, 2);
    if (serialized !== lastSerialized) {
      lastSerialized = serialized;
      set("scanResultDebug", serialized);
      document.dispatchEvent(new CustomEvent("proxuma:scan-result", { detail: r }));
    }
  }

  window.ProxumaApplyLegacyScanReport = function(report, source){
    const r = resultFromLegacyReport(report);
    if (!r) return;
    window.ProxumaLegacyLastReport = report;
    investigationState = "INVESTIGATION_ACTIVE";
    investigationDirty = true;
    updateMissionStatus("Investigation Active");
    setScanningState("Complete");
    set("visibleCaseStatus", "Scan complete. Unsaved case packet ready.");
    renderCaptainWiring("Complete", r);
    requestAnimationFrame(() => renderCaptainWiring("Complete", r));
    document.dispatchEvent(new CustomEvent("proxuma:dashboard-synced", { detail:{ source:source || "legacy-engine", completedAt:Date.now() } }));
  };

  function setScanningState(label){
    set("captainScanState", label);
    const btn = $("scanButton");
    if (btn) btn.setAttribute("aria-busy", label === "Analyzing" ? "true" : "false");
  }

  function wireTabs(){
    document.querySelectorAll(".drawer-tab[data-drawer-target]").forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-drawer-target");
        document.querySelectorAll(".drawer-tab[data-drawer-target]").forEach(t => t.classList.toggle("active", t === tab));
        document.querySelectorAll(".drawer-panel").forEach(panel => {
          const active = panel.id === target;
          panel.classList.toggle("active", active);
          panel.hidden = !active;
        });
        renderCaptainWiring("Reviewing " + tab.textContent.trim());
      });
    });
    const controls = $("investigation-controls");
    if (controls) {
      const buttons = controls.querySelectorAll("button");
      buttons.forEach((button) => button.addEventListener("click", () => {
        activeInvestigationView = button.getAttribute("data-investigation-view") || "overview";
        buttons.forEach(b => b.classList.toggle("active", b === button));
        renderCaptainWiring("Viewing " + button.textContent.trim());
      }));
    }
  }



  function clearVisibleMissionState(){
    const input = $("targetInput");
    if (input) input.value = "";
    [
      ["riskLabel","Ready to scan"],["summaryText","Enter a URL, domain, QR payload, or message to generate a report."],["scoreValue","0"],
      ["heatLabel","Standby"],["signalCount","0"],["inputTypeLabel","Standby"],["primaryTrigger","Waiting"],["reportTimestamp","Not scanned"],
      ["nextStep","Enter a target"],["severityNote","Not scanned"],["severityMix","0 high · 0 medium · 0 low"],["rootDomain","Waiting"],
      ["actionTitle","Scan first"],["trueTarget","Waiting"],["confidenceLabel","Not measured"],["confidenceNote",""],["evidenceStrength","Waiting"],
      ["scanMemory","No previous scan"],["captainSummaryVerdict","Ready to scan"],["captainSummaryRisk","0"],["captainSummaryConfidence","Waiting"],
      ["captainSummaryAction","Scan first"],["captainSummaryReason","Paste a link, QR payload, or message to get one clear trust decision."],
      ["captainScanState","Idle"],["visibleCaseId","No case yet"],["visibleCaseStatus","Mission ready. Paste a target to begin."],
      ["investigationSummaryScore","0"],["investigationSummaryConfidence","Not measured"],["investigationSummaryConcern","Waiting"],["investigationSummaryAction","Paste a target"],
      ["visibleWireStatus","New investigation ready."],["toolActionStatus","Tools now report whether they are wired or planned instead of showing fake output."],
      ["explainStatus","Awaiting scan"],["explainSummary","Run a scan to see the strongest reason behind the verdict."],["timelineStatus","0 steps"],
      ["trustStatus","Local only"],["threatStatus","Standby"],["threatStory","Paste a target and Proxuma will explain what could be happening."],
      ["decisionStatus","Standby"],["compareLast","Waiting for the first scan."],["safeMove","Scan first"],["safeMoveNote","Proxuma explains the safest next step after analysis."]
    ].forEach(([id,value]) => set(id,value));
    htmlList("evidenceList", ["No target scanned yet."]);
    htmlList("visibleEvidenceList", ["Run a scan to build evidence."]);
    htmlList("trustTrail", []);
    htmlList("timelineList", []);
    htmlList("decisionList", []);
    htmlList("technicalList", []);
    const body = $("visibleInvestigationBody");
    if (body) body.innerHTML = "<strong>Overview</strong><p>Run a scan to populate this investigation lane.</p>";
    const heatFill = $("heatFill"); if (heatFill) heatFill.style.width = "0%";
    activeInvestigationView = "overview";
    document.querySelectorAll("#investigation-controls button").forEach((b) => b.classList.toggle("active", b.getAttribute("data-investigation-view") === "overview"));
    document.querySelectorAll(".drawer-tab[data-drawer-target]").forEach((b,i) => b.classList.toggle("active", i === 0));
    document.querySelectorAll(".drawer-panel").forEach((panel,i) => { panel.classList.toggle("active", i === 0); panel.hidden = i !== 0; });
    applyRiskColorIntelligence({ scanned:false, riskScore:0 });
    window.ProxumaScanResult = null;
    window.ProxumaCaseFile = null;
    investigationState = "MISSION_READY";
    investigationDirty = false;
    updateMissionStatus("Mission Ready");
    lastSerialized = "";
    lastCaseSignature = "";
    set("scanResultDebug", "No scan yet. New investigation ready.");
  }

  function updateMissionStatus(label){
    set("captainScanState", label);
    const headerPill = document.getElementById("investigationStatePill");
    if (headerPill) headerPill.textContent = label;
  }

  function ensureInvestigationDialog(){
    let dialog = document.getElementById("investigationManagerDialog");
    if (dialog) return dialog;
    dialog = document.createElement("div");
    dialog.id = "investigationManagerDialog";
    dialog.className = "investigation-manager-dialog";
    dialog.hidden = true;
    dialog.innerHTML = `
      <div class="investigation-manager-backdrop" data-im-cancel="true"></div>
      <section class="investigation-manager-card" role="dialog" aria-modal="true" aria-labelledby="imTitle">
        <p class="eyebrow">Investigation Manager</p>
        <h2 id="imTitle">Start New Investigation?</h2>
        <p>You already have an investigation open. Starting another scan will replace the current workspace.</p>
        <div class="im-case-box"><span>Case</span><strong id="imCaseId">No case yet</strong><span>Target</span><strong id="imTarget">Waiting</strong></div>
        <p class="fine-print">Save the current case to history, continue without saving, or cancel and keep this investigation open.</p>
        <div class="im-actions">
          <button id="imSaveContinue" class="primary-action" type="button">Save & Continue</button>
          <button id="imDiscardContinue" class="secondary-action" type="button">Continue Without Saving</button>
          <button id="imCancel" class="secondary-action" type="button">Cancel</button>
        </div>
      </section>`;
    document.body.appendChild(dialog);
    dialog.querySelector("#imSaveContinue").addEventListener("click", () => resolveInvestigationDialog("save"));
    dialog.querySelector("#imDiscardContinue").addEventListener("click", () => resolveInvestigationDialog("discard"));
    dialog.querySelector("#imCancel").addEventListener("click", () => resolveInvestigationDialog("cancel"));
    dialog.querySelector(".investigation-manager-backdrop").addEventListener("click", () => resolveInvestigationDialog("cancel"));
    document.addEventListener("keydown", (event) => { if (!dialog.hidden && event.key === "Escape") resolveInvestigationDialog("cancel"); });
    return dialog;
  }

  function showInvestigationDialog(nextAction){
    const current = buildScanResult();
    pendingInvestigationAction = nextAction;
    const dialog = ensureInvestigationDialog();
    const caseId = dialog.querySelector("#imCaseId");
    const target = dialog.querySelector("#imTarget");
    if (caseId) caseId.textContent = current.caseId || "No case yet";
    if (target) target.textContent = current.target || "Waiting";
    dialog.hidden = false;
    document.body.classList.add("investigation-dialog-open");
    updateMissionStatus("Action Needed");
    set("visibleCaseStatus", "Choose whether to save the current case before starting a new scan.");
    setTimeout(() => dialog.querySelector("#imSaveContinue")?.focus(), 25);
  }

  function resolveInvestigationDialog(choice){
    const dialog = ensureInvestigationDialog();
    dialog.hidden = true;
    document.body.classList.remove("investigation-dialog-open");
    const nextAction = pendingInvestigationAction;
    pendingInvestigationAction = null;
    if (choice === "cancel") {
      updateMissionStatus(investigationState === "INVESTIGATION_ACTIVE" ? "Investigation Active" : "Mission Ready");
      set("visibleCaseStatus", "New scan cancelled. Current investigation preserved.");
      return;
    }
    if (choice === "save") saveCurrentCase(false);
    investigationDirty = false;
    resetMissionForNextScan();
    if (typeof nextAction === "function") {
      bypassInvestigationManager = true;
      setTimeout(() => { try { nextAction(); } finally { setTimeout(() => { bypassInvestigationManager = false; }, 0); } }, 80);
    }
  }

  function shouldProtectCurrentInvestigation(){
    const current = buildScanResult();
    return Boolean(current && current.scanned && !bypassInvestigationManager);
  }

  function resetMissionForNextScan(){
    clickHidden("resetWorkspaceButton");
    clearVisibleMissionState();
    setScanningState("Idle");
    updateMissionStatus("Mission Ready");
    const input = $("targetInput");
    if (input) setTimeout(() => input.focus(), 50);
    document.dispatchEvent(new CustomEvent("proxuma:new-investigation"));
  }

  function requestNewInvestigation(nextAction){
    if (shouldProtectCurrentInvestigation()) {
      showInvestigationDialog(nextAction);
      return false;
    }
    resetMissionForNextScan();
    if (typeof nextAction === "function") {
      bypassInvestigationManager = true;
      setTimeout(() => { try { nextAction(); } finally { setTimeout(() => { bypassInvestigationManager = false; }, 0); } }, 80);
    }
    return true;
  }

  function startNewInvestigation(askToSave){
    if (askToSave && shouldProtectCurrentInvestigation()) {
      showInvestigationDialog(null);
      return;
    }
    resetMissionForNextScan();
  }

  function wireVisibleControls(){
    $("visibleCopySummary")?.addEventListener("click", () => {
      const r = buildScanResult();
      const summary = `Proxuma IT Captain Summary\nCase: ${r.caseId}\nTarget: ${r.target}\nRisk: ${r.riskLabel} (${r.riskScore})\nConfidence: ${r.confidence}\nReason: ${r.reason}\nAction: ${r.action}`;
      copyText(summary, "visibleWireStatus", "Captain Summary copied.");
    });
    $("visibleExportJson")?.addEventListener("click", () => {
      if (clickHidden("exportTrustJson")) set("visibleWireStatus", "Structured JSON export started.");
      else copyText(JSON.stringify(buildScanResult().report, null, 2), "visibleWireStatus", "Case JSON copied because download was unavailable.");
    });
    $("visibleNewInvestigation")?.addEventListener("click", () => startNewInvestigation(true));
    $("visibleResetWorkspace")?.addEventListener("click", () => startNewInvestigation(false));
    $("visibleSaveCase")?.addEventListener("click", () => saveCurrentCase(false));
    $("visibleCopyCase")?.addEventListener("click", () => copyText(JSON.stringify(buildScanResult().report, null, 2), "visibleCaseStatus", "Case packet copied."));

    document.querySelectorAll("[data-tool-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-tool-action");
        if (action === "domain") {
          if (clickHidden("onlineRdapLookupButton")) set("toolActionStatus", "Domain lookup requested through the optional online intelligence path.");
          else set("toolActionStatus", "Domain lookup needs online checks enabled first.");
          return;
        }
        if (action === "unshorten") {
          const input = $("targetInput");
          if (input && input.value.trim()) { $("scanButton")?.click(); set("toolActionStatus", "Current target re-analyzed for redirect/shortener clues."); }
          else set("toolActionStatus", "Paste a target first, then use Unshorten URL.");
          return;
        }
        set("toolActionStatus", "This tool is planned for Intelligence 1.1. No fake result shown.");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireTabs();
    wireVisibleControls();
    renderHistory();
    const actions = document.querySelector(".wire-actions");
    if (actions && !document.getElementById("investigationStatePill")) { const pill = document.createElement("span"); pill.id="investigationStatePill"; pill.className="wire-pill investigation-state-pill"; pill.textContent="Mission Ready"; actions.appendChild(pill); }
    ensureInvestigationDialog();
    renderCaptainWiring("Idle");
    const observed = ["riskLabel","scoreValue","confidenceLabel","confidenceNote","actionTitle","nextStep","explainSummary","summaryText","signalCount","primaryTrigger","severityNote","severityMix","rootDomain","evidenceStrength","reportTimestamp","trueTarget","inputTypeLabel","heatLabel","scanMemory"];
    observed.forEach((id) => { const el = $(id); if (el) new MutationObserver(() => scheduleCaptainRender("Complete", 180)).observe(el,{childList:true,subtree:true,characterData:true}); });
    ["evidenceList","trustTrail","timelineList","decisionList","technicalList"].forEach((id)=>{ const el=$(id); if(el) new MutationObserver(()=>scheduleCaptainRender("Complete", 180)).observe(el,{childList:true,subtree:true}); });
    // Investigation Manager intercepts all new-scan attempts before legacy handlers can replace the current case.
    document.addEventListener("click", (event) => {
      const exampleButton = event.target.closest ? event.target.closest("[data-example]") : null;
      const scanButton = event.target.closest ? event.target.closest("#scanButton") : null;
      if (!exampleButton && !scanButton) return;
      if (bypassInvestigationManager) return;
      if (!shouldProtectCurrentInvestigation()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (exampleButton) {
        const value = exampleButton.getAttribute("data-example") || "";
        showInvestigationDialog(() => { const input = $("targetInput"); if (input) input.value = value; $("scanButton")?.click(); });
      } else {
        showInvestigationDialog(() => $("scanButton")?.click());
      }
    }, true);

    // RC-1 blocker fix: example buttons call the legacy scan engine directly,
    // bypassing the visible Analyze button. After any allowed example scan, force
    // every Captain dashboard card to resync from the same scan result.
    document.addEventListener("click", (event) => {
      const exampleButton = event.target.closest ? event.target.closest("[data-example]") : null;
      if (!exampleButton || bypassInvestigationManager) return;
      setScanningState("Analyzing");
      set("visibleCaseStatus", "Building case packet...");
      setTimeout(() => { investigationState = "INVESTIGATION_ACTIVE"; investigationDirty = true; updateMissionStatus("Investigation Active"); }, 250);
      forceDashboardSync("Complete");
    }, false);

    $("scanButton")?.addEventListener("click", () => {
      setScanningState("Analyzing");
      set("visibleCaseStatus", "Building case packet...");
      // Legacy scan handlers update several DOM fields in sequence. Wait for the scan to settle,
      // then refresh every dashboard panel from one normalized ProxumaScanResult.
      forceDashboardSync("Complete");
      setTimeout(() => { investigationState = "INVESTIGATION_ACTIVE"; investigationDirty = true; updateMissionStatus("Investigation Active"); set("visibleCaseStatus", "Scan complete. Unsaved case packet ready."); forceDashboardSync("Complete"); }, 1450);
    });
    $("targetInput")?.addEventListener("input", () => { scheduleCaptainRender("Ready", 80); set("visibleCaseStatus", "Ready to scan"); });

    // RC-2 master synchronization: this event is emitted by the legacy engine
    // only after renderReport(), persistence, memory, and history are complete.
    // A single event refreshes every visible dashboard surface immediately.
    document.addEventListener("proxuma:legacy-scan-complete", (event) => {
      window.ProxumaApplyLegacyScanReport?.(event?.detail?.report || window.ProxumaLegacyLastReport, event?.detail?.source || "legacy-engine");
    });
  });
})();

/* === Sprint 11 — App Guide Wiring === */
(function(){
  'use strict';
  if(window.__proxumaSprint11GuideWired) return;
  window.__proxumaSprint11GuideWired = true;
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }
  ready(function(){
    var card=document.getElementById('explain');
    if(!card) return;
    var btn=card.querySelector('.collapse-toggle');
    var body=document.getElementById('explainGuideBody') || card.querySelector('.collapsible-card-body');
    var copy=btn&&btn.querySelector('.toggle-copy');
    if(!btn || !body) return;
    function set(open){
      body.hidden=!open;
      btn.setAttribute('aria-expanded',String(open));
      if(copy) copy.textContent=open?'Close':'Open';
      card.classList.toggle('is-open',open);
      try{localStorage.setItem('proxuma-it-app-guide-open-v1',open?'1':'0');}catch(e){}
    }
    var saved='0'; try{saved=localStorage.getItem('proxuma-it-app-guide-open-v1')||'0';}catch(e){}
    set(saved==='1');
    btn.addEventListener('click',function(e){e.preventDefault();set(body.hidden);});
    card.querySelectorAll('.guide-actions a').forEach(function(a){
      a.addEventListener('click',function(){ set(false); });
    });
  });
})();


/* === RC-6: Investigation internal-scroll affordance === */
(function(){
  'use strict';
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }
  ready(function(){
    var body=document.getElementById('visibleInvestigationBody');
    var cue=document.getElementById('investigationScrollCue');
    if(!body || !cue) return;
    function refreshCue(){
      var overflow=body.scrollHeight > body.clientHeight + 4;
      var atEnd=body.scrollTop + body.clientHeight >= body.scrollHeight - 8;
      cue.classList.toggle('is-hidden', !overflow || atEnd);
      cue.textContent = overflow ? 'More investigation details ↓' : 'All details visible';
    }
    body.addEventListener('scroll', refreshCue, {passive:true});
    window.addEventListener('resize', refreshCue, {passive:true});
    new MutationObserver(function(){ requestAnimationFrame(refreshCue); }).observe(body,{childList:true,subtree:true,characterData:true});
    requestAnimationFrame(refreshCue);
  });
})();
