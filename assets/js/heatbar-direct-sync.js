(function(){
  "use strict";

  const byId = (id) => document.getElementById(id);
  let lastCompletedAt = "";

  function clampScore(value){
    const n = Number.parseFloat(String(value || "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
  }

  function scanIsComplete(){
    const risk = String(byId("riskLabel")?.textContent || "").trim();
    return Boolean(risk) && !/ready to scan|standby|waiting/i.test(risk);
  }

  function inputType(){
    const raw = String(byId("targetInput")?.value || "").trim();
    if (/^https?:\/\//i.test(raw)) return "URL";
    if (/^(javascript|data|file|vbscript):/i.test(raw)) return "Script payload";
    if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$)/i.test(raw)) return "Domain / URL";
    if (raw) return "Text / payload";
    return "Scanned target";
  }

  function heatState(score){
    if (score >= 60) return "Hot / High Risk";
    if (score >= 20) return "Warm / Review";
    return "Cool / Low Risk";
  }

  function setFill(score){
    const fill = byId("heatFill");
    const meter = fill?.closest('[role="meter"]');
    const safeScore = clampScore(score);
    if (fill) {
      fill.style.setProperty("width", safeScore + "%", "important");
      fill.style.setProperty("transform", "none", "important");
      fill.style.setProperty("opacity", safeScore > 0 ? "1" : "0", "important");
      fill.style.setProperty("display", "block", "important");
      fill.dataset.score = String(Math.round(safeScore));
    }
    if (meter) meter.setAttribute("aria-valuenow", String(Math.round(safeScore)));
  }

  function resetIdleState(){
    setFill(0);
    const label = byId("heatLabel");
    if (label) label.textContent = "Standby";
    lastCompletedAt = "";
  }

  function syncFromEngineResult(){
    if (!scanIsComplete()) {
      resetIdleState();
      return;
    }

    const score = clampScore(byId("scoreValue")?.textContent);
    const label = byId("heatLabel");
    const input = byId("inputTypeLabel");
    const time = byId("reportTimestamp");

    setFill(score);
    if (label) label.textContent = heatState(score);
    if (input && /standby|waiting|not scanned/i.test(input.textContent || "")) input.textContent = inputType();
    if (time && /not scanned|standby|waiting/i.test(time.textContent || "")) {
      lastCompletedAt = lastCompletedAt || new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"});
      time.textContent = lastCompletedAt;
    }
  }

  function scheduleSync(){
    [0, 40, 120, 260, 500, 900, 1500].forEach((delay) => {
      window.setTimeout(syncFromEngineResult, delay);
    });
  }

  function observe(){
    const score = byId("scoreValue");
    const risk = byId("riskLabel");
    if (score) new MutationObserver(scheduleSync).observe(score, {childList:true, characterData:true,subtree:true});
    if (risk) new MutationObserver(scheduleSync).observe(risk, {childList:true, characterData:true,subtree:true});

    document.addEventListener("click", (event) => {
      if (event.target.closest?.("#scanButton,[data-example]")) {
        lastCompletedAt = "";
        window.setTimeout(scheduleSync, 0);
      }
      if (event.target.closest?.("#missionNew,#caseCommandStart,[data-flow-target='scan']")) {
        window.setTimeout(resetIdleState, 0);
      }
    }, true);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target?.id === "targetInput") {
        lastCompletedAt = "";
        scheduleSync();
      }
    }, true);

    resetIdleState();
    scheduleSync();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", observe, {once:true});
  else observe();
})();
