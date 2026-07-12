(() => {
  'use strict';
  const overlay = document.getElementById('appGuideOverlay');
  const dialog = overlay?.querySelector('.app-guide-dialog');
  const openButton = document.getElementById('openAppGuide');
  const closeButton = document.getElementById('closeAppGuide');
  let previousFocus = null;

  if (!overlay || !dialog || !openButton || !closeButton) return;

  const guideSectionMap = { scan: 'guide-scan', review: 'guide-analysis', act: 'guide-actions' };

  function openGuide(sectionId) {
    previousFocus = document.activeElement;
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('app-guide-open');
    requestAnimationFrame(() => {
      dialog.focus();
      if (sectionId) document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
    });
  }

  function closeGuide({ restoreFocus = true } = {}) {
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('app-guide-open');
    if (restoreFocus && previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  openButton.addEventListener('click', () => openGuide());
  closeButton.addEventListener('click', () => closeGuide());
  overlay.querySelectorAll('[data-guide-close]').forEach((node) => node.addEventListener('click', () => closeGuide()));

  document.querySelectorAll('[data-guide-step]').forEach((button) => {
    button.addEventListener('click', () => openGuide(guideSectionMap[button.dataset.guideStep]));
  });

  overlay.querySelectorAll('[data-guide-jump]').forEach((button) => {
    button.addEventListener('click', () => document.getElementById(button.dataset.guideJump)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  });

  overlay.querySelectorAll('[data-guide-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.guideTarget);
      closeGuide({ restoreFocus: false });
      requestAnimationFrame(() => {
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (target instanceof HTMLElement) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  });

  document.addEventListener('keydown', (event) => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') closeGuide();
    if (event.key !== 'Tab') return;
    const focusables = [...dialog.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((node) => !node.disabled && node.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
