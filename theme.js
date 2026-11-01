/* Modern Executive: accessible, cross-page menu. Does not modify ordering logic. */
(()=>{
  function init(){
    const header=document.querySelector('.site-header, .offer-header');
    if(!header)return;
    const menu=header.querySelector('.top-links, .nav');
    if(!menu)return;
    const button=document.createElement('button');
    button.type='button';button.className='executive-menu-button';
    button.textContent='☰ Menu';button.setAttribute('aria-label','Otwórz menu');
    button.setAttribute('aria-expanded','false');
    if(!menu.id) menu.id='executive-main-navigation';
    button.setAttribute('aria-controls',menu.id);
    const toggle=(open)=>{menu.classList.toggle('executive-nav-open',open);button.setAttribute('aria-expanded',String(open));button.textContent=open?'× Zamknij':'☰ Menu';button.setAttribute('aria-label',open?'Zamknij menu':'Otwórz menu')};
    button.addEventListener('click',()=>toggle(button.getAttribute('aria-expanded')!=='true'));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false)});
    document.addEventListener('click',e=>{if(!header.contains(e.target))toggle(false)});
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggle(false)));
    const parent=header.querySelector('.offer-header-inner')||header;
    parent.append(button);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
