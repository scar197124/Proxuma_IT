(function () {
  'use strict';

  var lastFocused = null;

  function ensureStatusRegion() {
    var region = document.getElementById('releaseStatus');
    if (region) return region;
    region = document.createElement('div');
    region.id = 'releaseStatus';
    region.className = 'release-status';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.hidden = true;
    document.body.appendChild(region);
    return region;
  }

  function announce(message, tone) {
    if (!message) return;
    var region = ensureStatusRegion();
    region.className = 'release-status' + (tone ? ' is-' + tone : '');
    region.textContent = message;
    region.hidden = false;
    clearTimeout(announce.timer);
    announce.timer = setTimeout(function () {
      region.hidden = true;
      region.textContent = '';
    }, 6500);
  }

  function normalizeButtons() {
    document.querySelectorAll('button:not([type])').forEach(function (button) {
      button.type = 'button';
    });
  }

  function setupTablist(tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"], button'));
    if (tabs.length < 2) return;

    tabs.forEach(function (tab, index) {
      if (!tab.hasAttribute('role')) tab.setAttribute('role', 'tab');
      var selected = tab.getAttribute('aria-selected') === 'true' || tab.classList.contains('active');
      tab.tabIndex = selected || (!tabs.some(function (item) { return item.tabIndex === 0; }) && index === 0) ? 0 : -1;
      tab.addEventListener('click', function () {
        tabs.forEach(function (item) {
          var active = item === tab;
          item.tabIndex = active ? 0 : -1;
          item.setAttribute('aria-selected', String(active));
        });
      });
    });

    tablist.addEventListener('keydown', function (event) {
      var current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      var next = current;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });
  }

  function setupTablists() {
    document.querySelectorAll('[role="tablist"]').forEach(setupTablist);
  }

  function visibleDialog() {
    return Array.prototype.find.call(document.querySelectorAll('[role="dialog"][aria-modal="true"]'), function (dialog) {
      var host = dialog.closest('[hidden], [aria-hidden="true"]');
      return !host && dialog.offsetParent !== null;
    });
  }

  function focusables(container) {
    return Array.prototype.filter.call(container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), function (element) {
      return element.offsetParent !== null;
    });
  }

  function setupDialogSafety() {
    document.addEventListener('click', function (event) {
      var opener = event.target.closest('[aria-haspopup="dialog"], [aria-controls="appGuideOverlay"], [data-modal-target]');
      if (opener) lastFocused = opener;
    }, true);

    document.addEventListener('keydown', function (event) {
      var dialog = visibleDialog();
      if (!dialog) return;
      if (event.key === 'Tab') {
        var items = focusables(dialog);
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      if (event.key === 'Escape') {
        var close = dialog.querySelector('[data-guide-close], .app-guide-close, [data-modal-close], [aria-label^="Close"]');
        if (close) {
          event.preventDefault();
          close.click();
          if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
        }
      }
    });
  }

  function syncRiskMeter() {
    var score = document.getElementById('scoreValue');
    var meter = document.querySelector('.heat-bar[role="meter"]');
    if (!score || !meter) return;
    function update() {
      var value = Math.max(0, Math.min(100, parseInt(score.textContent, 10) || 0));
      meter.setAttribute('aria-valuenow', String(value));
      meter.setAttribute('aria-valuetext', value + ' out of 100 risk');
    }
    update();
    new MutationObserver(update).observe(score, { childList: true, characterData: true, subtree: true });
  }

  function setupScannerGuard() {
    var input = document.getElementById('targetInput');
    var scan = document.getElementById('scanButton');
    if (!input || !scan) return;
    scan.addEventListener('click', function (event) {
      if (input.value.trim()) {
        input.removeAttribute('aria-invalid');
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      announce('Enter a link, message, suspicious text, or QR payload before scanning.', 'warning');
    }, true);
    input.addEventListener('input', function () {
      if (input.value.trim()) input.removeAttribute('aria-invalid');
    });
  }

  function setupShortcut() {
    document.addEventListener('keydown', function (event) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      var input = document.getElementById('targetInput');
      if (!input) return;
      event.preventDefault();
      input.focus();
    });
  }

  function setupRuntimeSafety() {
    window.addEventListener('error', function (event) {
      if (!event || !event.message) return;
      console.error('[Proxuma release candidate]', event.error || event.message);
      announce('A display component encountered a problem. Your scan data remains local; try the action again.', 'error');
    });
    window.addEventListener('unhandledrejection', function (event) {
      console.error('[Proxuma release candidate]', event.reason);
      announce('An online or browser action could not finish. The local scan remains available.', 'error');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    normalizeButtons();
    setupTablists();
    setupDialogSafety();
    syncRiskMeter();
    setupScannerGuard();
    setupShortcut();
    setupRuntimeSafety();
    document.documentElement.classList.add('release-candidate-ready');
  });
})();
