(function(){
  'use strict';

  if(window.__proxumaFocusReadingInitialized) return;
  window.__proxumaFocusReadingInitialized = true;

  const targets = [
    { id:'scan-detail-workspace', label:'Scan Details' },
    { id:'investigation-workspace', label:'Investigation' }
  ];

  let active = null;
  let previousFocus = null;
  let placeholder = null;
  let originalParent = null;
  let originalNextSibling = null;
  let pageScrollY = 0;
  let savedInternalScroll = [];

  const viewportLayer = document.createElement('div');
  viewportLayer.className = 'focus-reading-viewport';
  viewportLayer.hidden = true;
  viewportLayer.setAttribute('aria-hidden', 'true');

  document.body.appendChild(viewportLayer);

  function makeButton(target, label){
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'focus-reading-toggle unified-control-button';
    button.setAttribute('aria-label', `Expand ${label} reading space`);
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = '<span aria-hidden="true">⛶</span><span class="focus-reading-label">Focus</span>';
    button.addEventListener('click', () => {
      if(active === target) exitFocus();
      else enterFocus(target, button, label);
    });
    return button;
  }

  function addToolbar(target, label){
    if(target.id === 'workflow' && window.matchMedia('(max-width: 720px)').matches) return;
    if(target.querySelector('.focus-reading-toolbar')) return;
    const toolbar = document.createElement('div');
    toolbar.className = 'focus-reading-toolbar';
    toolbar.appendChild(makeButton(target, label));

    /* Sprint 10: both visible card Focus buttons live in the same place
       and use the same compact control style. */
    if(target.id === 'scan-detail-workspace' || target.id === 'investigation-workspace'){
      const head = target.querySelector('.lane-compact-head');
      if(head) head.appendChild(toolbar);
      else target.prepend(toolbar);
    } else if(target.id === 'workflow'){
      const head = target.querySelector('.workflow-fixed-head');
      if(head) head.appendChild(toolbar);
      else target.prepend(toolbar);
    } else {
      target.prepend(toolbar);
    }
  }

  function enterFocus(target, button, label){
    if(active) exitFocus(false);

    previousFocus = document.activeElement;
    pageScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    active = target;
    savedInternalScroll = Array.from(target.querySelectorAll('[tabindex], .wired-investigation-body, .wired-evidence-list, .drawer-stage, .trust-finding-list'))
      .filter(el => el.scrollHeight > el.clientHeight + 2)
      .map(el => ({el, top:el.scrollTop, left:el.scrollLeft}));
    originalParent = target.parentNode;
    originalNextSibling = target.nextSibling;
    placeholder = document.createComment(`focus-placeholder-${target.id}`);
    originalParent.insertBefore(placeholder, target);

    viewportLayer.hidden = false;
    viewportLayer.setAttribute('aria-hidden', 'false');
    viewportLayer.appendChild(target);

    document.body.classList.add('focus-reading-active');
    target.classList.add('is-focus-reading');
    button.setAttribute('aria-pressed','true');
    button.setAttribute('aria-label', `Exit ${label} focus reading mode`);
    const labelNode = button.querySelector('.focus-reading-label');
    if(labelNode) labelNode.textContent = 'Exit focus';

    requestAnimationFrame(() => {
      button.focus({preventScroll:true});
    });
  }

  function restoreTarget(){
    if(!active || !originalParent) return;
    if(placeholder && placeholder.parentNode === originalParent){
      originalParent.insertBefore(active, placeholder);
      placeholder.remove();
    } else if(originalNextSibling && originalNextSibling.parentNode === originalParent){
      originalParent.insertBefore(active, originalNextSibling);
    } else {
      originalParent.appendChild(active);
    }
  }

  function exitFocus(restore=true){
    if(!active) return;
    const exitingTarget = active;
    const button = exitingTarget.querySelector('.focus-reading-toggle');

    exitingTarget.classList.remove('is-focus-reading');
    restoreTarget();
    document.body.classList.remove('focus-reading-active');

    if(button){
      button.setAttribute('aria-pressed','false');
      button.setAttribute('aria-label', 'Expand reading space');
      const labelNode = button.querySelector('.focus-reading-label');
      if(labelNode) labelNode.textContent = 'Focus';
    }

    viewportLayer.hidden = true;
    viewportLayer.setAttribute('aria-hidden', 'true');

    /* RC-7: restoring a moved investigation card can leave its scroll canvas
       collapsed in some browsers. Re-run the active view after the card is
       back in its original grid so all case data becomes visible again. */
    if(exitingTarget && exitingTarget.id === 'investigation-workspace'){
      requestAnimationFrame(() => {
        const shell = exitingTarget.querySelector('.investigation-scroll-shell');
        const body = exitingTarget.querySelector('#visibleInvestigationBody');
        if(shell){ shell.style.removeProperty('height'); shell.style.removeProperty('display'); }
        if(body){
          body.style.removeProperty('height');
          body.style.removeProperty('display');
          body.style.removeProperty('visibility');
          body.style.removeProperty('opacity');
        }
        savedInternalScroll.forEach(item => { try { item.el.scrollTop=item.top; item.el.scrollLeft=item.left; } catch(e){} });
        const activeTab = exitingTarget.querySelector('#investigation-controls button.active') || exitingTarget.querySelector('#investigation-controls button');
        if(activeTab) activeTab.click();
        document.dispatchEvent(new CustomEvent('proxuma:focus-restored', {detail:{target:'investigation-workspace'}}));
      });
    }

    if(exitingTarget && exitingTarget.id !== 'investigation-workspace'){
      requestAnimationFrame(() => savedInternalScroll.forEach(item => { try { item.el.scrollTop=item.top; item.el.scrollLeft=item.left; } catch(e){} }));
    }
    active = null;
    savedInternalScroll = [];
    placeholder = null;
    originalParent = null;
    originalNextSibling = null;

    window.scrollTo({top:pageScrollY, left:0, behavior:'auto'});
    if(restore && previousFocus && typeof previousFocus.focus === 'function'){
      requestAnimationFrame(() => previousFocus.focus({preventScroll:true}));
    }
  }

  document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape' && active){
      event.preventDefault();
      exitFocus();
    }
  });

  viewportLayer.addEventListener('click', (event) => {
    if(event.target === viewportLayer) exitFocus();
  });

  window.addEventListener('pagehide', () => {
    if(active) exitFocus(false);
  });

  targets.forEach(({id,label}) => {
    const target = document.getElementById(id);
    if(target) addToolbar(target,label);
  });
})();

/* === Proxuma IT UI 1.0 RC Wired Sprint 11 — Focus Exit Safety === */
(function(){
  'use strict';
  if(window.__proxumaSprint11FocusExitSafety) return;
  window.__proxumaSprint11FocusExitSafety = true;
  function ensureExit(){
    var layer=document.querySelector('.focus-reading-viewport');
    if(!layer) return;
    var btn=layer.querySelector('.focus-reading-emergency-exit');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='focus-reading-emergency-exit unified-control-button';
      btn.setAttribute('aria-label','Exit focus mode');
      btn.innerHTML='<span aria-hidden="true">×</span><span>Exit Focus</span>';
      layer.appendChild(btn);
    }
    btn.addEventListener('click',function(){
      var active=layer.querySelector('.is-focus-reading');
      var inside=active&&active.querySelector('.focus-reading-toggle');
      if(inside){inside.click();return;}
      document.body.classList.remove('focus-reading-active');
      layer.hidden=true;
      layer.setAttribute('aria-hidden','true');
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ensureExit); else ensureExit();
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      var layer=document.querySelector('.focus-reading-viewport:not([hidden])');
      var btn=layer&&layer.querySelector('.focus-reading-emergency-exit');
      if(btn) btn.click();
    }
  });
})();
