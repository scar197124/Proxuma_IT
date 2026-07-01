(function(){
  'use strict';
  const mq=window.matchMedia('(max-width: 720px)');
  const groups=()=>Array.from(document.querySelectorAll('#workflow .workflow-disclosure'));
  function applyMobileDefaults(){
    if(!mq.matches) return;
    groups().forEach((group)=>{
      group.open = group.id === 'workflowFindings';
    });
  }
  function singleOpen(event){
    if(!mq.matches || !event.target.open || !event.target.matches('#workflow .workflow-disclosure')) return;
    groups().forEach((group)=>{ if(group!==event.target && group.id!=='') group.open=false; });
  }
  document.addEventListener('DOMContentLoaded', applyMobileDefaults);
  document.addEventListener('toggle', singleOpen, true);
  mq.addEventListener?.('change', applyMobileDefaults);
})();
