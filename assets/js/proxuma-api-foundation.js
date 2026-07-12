(function(){
  'use strict';

  const VALID_STATES = new Set(['ready','scanning','complete','partial','error','cancelled']);
  const listeners = new Set();
  const adapters = new Map();
  let sequence = 0;
  let activeScanId = null;
  let activeController = null;
  let state = Object.freeze({
    status: 'ready', scanId: null, target: '', startedAt: null, completedAt: null,
    error: null, sourceStatus: {}, report: null
  });

  const clone = (value) => {
    try { return structuredClone(value); } catch (_) {
      try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
    }
  };

  function emit(reason){
    const snapshot = getState();
    listeners.forEach((fn) => { try { fn(snapshot, reason); } catch (error) { console.error('Proxuma state listener failed', error); } });
    document.dispatchEvent(new CustomEvent('proxuma:scan-state-change', { detail: { state: snapshot, reason } }));
  }

  function commit(patch, reason){
    const nextStatus = patch.status || state.status;
    if (!VALID_STATES.has(nextStatus)) throw new Error(`Invalid scan state: ${nextStatus}`);
    state = Object.freeze({ ...state, ...patch, status: nextStatus });
    emit(reason || nextStatus);
    return getState();
  }

  function getState(){ return clone(state); }

  function createScanId(){
    sequence += 1;
    return `PX-${Date.now().toString(36)}-${sequence.toString(36)}`;
  }

  function beginScan(target, source='ui'){
    if (activeController) activeController.abort('replaced-by-newer-scan');
    activeController = new AbortController();
    activeScanId = createScanId();
    const startedAt = new Date().toISOString();
    commit({
      status: 'scanning', scanId: activeScanId, target: String(target || '').trim(),
      startedAt, completedAt: null, error: null, sourceStatus: { local: 'running' }, report: null
    }, source);
    return { scanId: activeScanId, signal: activeController.signal, startedAt };
  }

  function isCurrent(scanId){ return Boolean(scanId) && scanId === activeScanId; }

  function normalizeSignals(report){
    const raw = report?.signals;
    const list = Array.isArray(raw) ? raw : Array.isArray(report?.findings) ? report.findings : [];
    const severity = report?.severity || report?.severityCounts || {};
    return {
      items: clone(list),
      high: Number(severity.high ?? report?.highSignals ?? 0) || 0,
      medium: Number(severity.medium ?? report?.mediumSignals ?? 0) || 0,
      low: Number(severity.low ?? report?.lowSignals ?? 0) || 0,
      unclassified: Number(severity.unclassified ?? report?.unclassifiedSignals ?? 0) || 0,
      total: Number(report?.signalCount ?? list.length ?? 0) || 0
    };
  }

  function normalizeReport(raw, meta={}){
    const report = raw || {};
    const score = Number(report.riskScore ?? report.score ?? 0) || 0;
    const completedAt = meta.completedAt || report.completedAt || new Date().toISOString();
    return Object.freeze({
      schemaVersion: '1.0',
      scanId: meta.scanId || report.scanId || activeScanId,
      target: report.target || report.input || state.target || '',
      status: meta.status || 'complete',
      riskScore: Math.max(0, Math.min(100, score)),
      riskLevel: report.riskLevel || (score >= 60 ? 'high' : score >= 20 ? 'moderate' : 'good'),
      confidence: report.confidence || report.evidenceStrength || 'not measured',
      signals: normalizeSignals(report),
      evidence: clone(report.evidence || report.evidenceItems || []),
      domain: clone(report.domain || report.domainInfo || report.rootDomain || null),
      recommendations: clone(report.recommendations || report.actions || report.recommendedAction || []),
      sources: clone(meta.sources || report.sources || [{ id:'local', label:'Local analysis', status:'complete', freshness:'live' }]),
      startedAt: state.startedAt,
      completedAt,
      legacy: report
    });
  }

  function completeLocal(rawReport, meta={}){
    const scanId = meta.scanId || rawReport?.scanId || activeScanId;
    if (!isCurrent(scanId)) return null;
    const canonical = normalizeReport(rawReport, { ...meta, scanId, status:'complete' });
    window.ProxumaReport = canonical;
    commit({
      status: 'complete', report: canonical, completedAt: canonical.completedAt,
      sourceStatus: { ...state.sourceStatus, local:'complete' }, error: null
    }, 'local-complete');
    document.dispatchEvent(new CustomEvent('proxuma:report-ready', { detail: { report: canonical } }));
    return canonical;
  }

  function markPartial(scanId, report, sourceStatus, error=null){
    if (!isCurrent(scanId)) return null;
    const canonical = normalizeReport(report || state.report?.legacy, { scanId, status:'partial', sources: sourceStatus });
    window.ProxumaReport = canonical;
    commit({ status:'partial', report:canonical, completedAt:new Date().toISOString(), sourceStatus:sourceStatus || state.sourceStatus, error }, 'partial');
    document.dispatchEvent(new CustomEvent('proxuma:report-ready', { detail: { report: canonical } }));
    return canonical;
  }

  function fail(scanId, error){
    if (!isCurrent(scanId)) return;
    commit({ status:'error', completedAt:new Date().toISOString(), error: String(error?.message || error || 'Scan failed') }, 'error');
  }

  function cancel(reason='cancelled'){
    if (activeController) activeController.abort(reason);
    activeController = null;
    commit({ status:'cancelled', completedAt:new Date().toISOString(), error:null }, reason);
  }

  function reset(){
    if (activeController) activeController.abort('reset');
    activeController = null; activeScanId = null;
    commit({ status:'ready', scanId:null, target:'', startedAt:null, completedAt:null, error:null, sourceStatus:{}, report:null }, 'reset');
  }

  function subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); }

  function registerAdapter(id, adapter){
    if (!id || !adapter || typeof adapter.run !== 'function') throw new Error('Adapter requires an id and run()');
    adapters.set(id, { id, label:adapter.label || id, run:adapter.run, timeoutMs:Number(adapter.timeoutMs || 12000) });
  }

  async function runAdapter(id, context={}){
    const adapter = adapters.get(id);
    if (!adapter) throw new Error(`Unknown adapter: ${id}`);
    const scanId = context.scanId || activeScanId;
    if (!isCurrent(scanId)) return { id, status:'stale' };
    const timeout = new AbortController();
    const timer = setTimeout(() => timeout.abort('timeout'), adapter.timeoutMs);
    const relayAbort = () => timeout.abort('scan-replaced');
    activeController?.signal.addEventListener('abort', relayAbort, { once:true });
    try {
      const data = await adapter.run({ ...context, scanId, signal:timeout.signal, report:state.report });
      if (!isCurrent(scanId)) return { id, status:'stale' };
      return { id, label:adapter.label, status:'complete', freshness:'live', data };
    } catch (error) {
      if (!isCurrent(scanId)) return { id, status:'stale' };
      return { id, label:adapter.label, status: timeout.signal.aborted ? 'unavailable' : 'error', error:String(error?.message || error) };
    } finally {
      clearTimeout(timer);
      activeController?.signal.removeEventListener('abort', relayAbort);
    }
  }

  window.ProxumaScanState = Object.freeze({ beginScan, completeLocal, markPartial, fail, cancel, reset, getState, subscribe, isCurrent, normalizeReport });
  window.ProxumaAPI = Object.freeze({ registerAdapter, runAdapter, listAdapters:() => Array.from(adapters.keys()) });

  function targetValue(){ return document.getElementById('targetInput')?.value || ''; }
  function ensureStarted(source){
    if (state.status !== 'scanning') return beginScan(targetValue(), source);
    return { scanId:activeScanId, signal:activeController?.signal, startedAt:state.startedAt };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton');
    scanButton?.addEventListener('click', () => ensureStarted('analyze-button'), true);
    document.addEventListener('click', (event) => {
      if (event.target?.closest?.('[data-example]')) ensureStarted('example-scan');
    }, true);
    document.getElementById('targetInput')?.addEventListener('input', () => {
      if (state.status !== 'scanning') reset();
    });
  });

  document.addEventListener('proxuma:legacy-scan-complete', (event) => {
    const detail = event.detail || {};
    const scanId = detail.scanId || activeScanId || beginScan(detail.report?.target || detail.report?.input || '', detail.source || 'legacy-engine').scanId;
    completeLocal(detail.report, { scanId, completedAt:detail.completedAt, sources:[{ id:'local', label:'Local analysis', status:'complete', freshness:'live' }] });
  });
})();
