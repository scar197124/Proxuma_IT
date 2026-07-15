(function(){
  "use strict";

  const $ = (id) => document.getElementById(id);
  const clamp = (value) => Math.max(0, Math.min(100, Number(value) || 0));
  let lastCompletedReport = null;
  let repairTimer = 0;
  let repairUntil = 0;

  function setText(id, value){
    const el = $(id);
    if (el && el.textContent !== String(value)) el.textContent = String(value);
  }

  function inferInputType(report){
    const supplied = String(report?.inputType || "").trim();
    if (supplied && !/^(standby|waiting|unknown)$/i.test(supplied)) return supplied;
    const raw = String(report?.raw || report?.target || "").trim();
    if (/^https?:\/\//i.test(raw)) return "URL";
    if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$)/i.test(raw)) return "Domain / URL";
    if (/^(javascript|data|file|vbscript):/i.test(raw)) return "Script payload";
    return raw ? "Text / payload" : "Standby";
  }

  function completedTime(report){
    const supplied = String(report?.displayTime || report?.time || "").trim();
    if (supplied && !/not scanned/i.test(supplied)) return supplied;
    return new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"});
  }

  function isCompleted(report){
    if (!report || typeof report !== "object") return false;
    return Boolean(String(report.raw || report.target || "").trim()) || Number.isFinite(Number(report.score));
  }

  function apply(report){
    if (!isCompleted(report)) return false;

    const score = clamp(report.score ?? report.heatPercent);
    const heat = String(report.heatLabel || (score >= 60 ? "High Risk" : score >= 20 ? "Needs Review" : "Low Risk"));
    const risk = String(report.risk || heat);
    const input = inferInputType(report);
    const timestamp = completedTime(report);

    setText("riskLabel", risk);
    setText("scoreValue", Math.round(score));
    setText("heatLabel", heat);
    setText("inputTypeLabel", input);
    setText("reportTimestamp", timestamp);

    if (report.primaryTrigger || report.explain) {
      setText("primaryTrigger", report.primaryTrigger || report.explain);
    }
    if (Number.isFinite(Number(report.count))) {
      setText("signalCount", Number(report.count));
    }

    const fill = $("heatFill");
    if (fill) {
      const ratio = score / 100;
      fill.dataset.score = String(Math.round(score));
      fill.style.setProperty("--proxuma-heat-scale", String(ratio));
      fill.style.setProperty("width", "100%", "important");
      fill.style.setProperty("transform", "scaleX(" + ratio + ")", "important");
      fill.style.setProperty("transform-origin", "left center", "important");
    }

    const meter = fill?.closest('[role="meter"]');
    if (meter) meter.setAttribute("aria-valuenow", String(Math.round(score)));

    const reportCard = $("report");
    if (reportCard) reportCard.dataset.resultSynchronized = "true";
    return true;
  }

  function currentReport(candidate){
    return candidate || window.ProxumaLegacyLastReport || window.ProxumaReport || window.ProxumaScanResult?.report || null;
  }

  function beginRepair(candidate){
    const report = currentReport(candidate);
    if (isCompleted(report)) lastCompletedReport = report;
    repairUntil = Date.now() + 2500;
    if (repairTimer) return;

    const tick = () => {
      const latest = currentReport(lastCompletedReport);
      if (isCompleted(latest)) {
        lastCompletedReport = latest;
        apply(latest);
      }
      if (Date.now() < repairUntil) {
        repairTimer = window.setTimeout(tick, 100);
      } else {
        repairTimer = 0;
      }
    };
    tick();
  }

  ["proxuma:legacy-scan-complete", "proxuma:scan-result", "proxuma:dashboard-synced", "proxuma:report-ready"].forEach((name) => {
    document.addEventListener(name, (event) => {
      beginRepair(event?.detail?.report || event?.detail);
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest?.("#scanButton,[data-example]")) {
      window.setTimeout(() => beginRepair(), 0);
      window.setTimeout(() => beginRepair(), 180);
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target?.id === "targetInput") {
      window.setTimeout(() => beginRepair(), 100);
    }
  }, true);
})();
