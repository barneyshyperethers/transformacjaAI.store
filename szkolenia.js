(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const sectorInfo = {
    budownictwo: {label:'Budownictwo', hours:7, summary:'Asystent budowy, oferty, organizacja ekip, kontrola dostaw, raportowanie i koszty.'},
    hotel: {label:'Hotelarstwo', hours:7, summary:'Recepcja, AI Concierge, rezerwacje, housekeeping, komunikacja i raporty.'},
    szpital: {label:'Szpital', hours:14, summary:'Grafiki lekarzy i pielęgniarek, preferencje, kontrola ograniczeń, zastępstwa, koordynacja oddziałów i zasoby.'},
    gmina: {label:'Gmina / Urząd', hours:14, summary:'Dekretacja pism, wsparcie KPA, terminy spraw, e-Doręczenia, komunikacja i raportowanie.'}
  };
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const urlSector = new URLSearchParams(location.search).get('branza');
  let basket = [], savedTemplate = '';
  try {basket = JSON.parse(localStorage.getItem('ka_selected') || '[]'); if (!Array.isArray(basket)) basket=[]; savedTemplate = localStorage.getItem('ka_template')||''}catch{basket=[]}
  const fromTemplate = {construction:'budownictwo', hotel:'hotel', hospital:'szpital', municipality:'gmina'}[savedTemplate];
  let sector = sectorInfo[urlSector] ? urlSector : (fromTemplate || 'hotel');
  function getRole(){return document.querySelector('input[name="trainRole"]:checked')?.value || 'operacyjni'}
  function selectedOptions(){
    let base = sectorInfo[sector].hours;
    if (getRole()==='kierownictwo') base = Math.min(base,7);
    const admin = $('trainAdmin').checked;
    return {sector, role:getRole(), baseHours:base, adminHours:admin?4:0, totalHours:base+(admin?4:0), format:$('trainFormat').value, participants:Number($('trainParticipants').value), moduleIds:$('trainUseBasket').checked ? basket.filter(x=>typeof x === 'string').slice(0,60):[]};
  }
  function render(){
    for(const b of document.querySelectorAll('[data-train-sector]')){
      const current = b.dataset.trainSector===sector;
      b.setAttribute('aria-pressed', current?'true':'false');
    }
    const s=sectorInfo[sector],o=selectedOptions();
    $('trainSummaryTitle').textContent=s.label+' — '+(o.role==='kierownictwo'?'AI dla kierownictwa':'AI w codziennej pracy');
    $('trainHours').textContent=o.totalHours+' h';
    const days = o.baseHours===14?2:1;
    $('trainDays').textContent=days+(days===1?' dzień':' dni')+(o.adminHours?' + ½ dnia':'');
    $('trainDescription').textContent=s.summary+(o.role==='kierownictwo'?' Wariant dla kierownictwa skupia się na nadzorze, KPI i bezpieczeństwie.':' Program praktyczny dla osób wykonujących codzienne zadania.')+(o.adminHours?' Plus 4 godziny konfiguracji, uprawnień i monitorowania.':'');
    const effective=o.moduleIds.length;
    $('basketTrainingNote').textContent=effective ? `Z poprzedniego koszyka rozpoznano ${effective} modułów. Zostaną wymienione w zapytaniu o warsztaty i zweryfikowane pod kątem dopasowania do programu.` : 'Twój koszyk automatyzacji jest pusty albo opcja jego użycia jest wyłączona. Możesz zamówić warsztaty niezależnie od zakupu modułów.';
  }
  function select(s, scroll){
    if(!sectorInfo[s])return;
    sector=s;render();
    if(scroll) $('dopasuj').scrollIntoView({behavior:'smooth',block:'start'});
  }
  document.querySelectorAll('[data-train-sector]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.trainSector,false)));
  document.querySelectorAll('[data-program-pick]').forEach(a=>a.addEventListener('click',()=>select(a.dataset.programPick,false)));
  for(const el of document.querySelectorAll('input[name="trainRole"],#trainParticipants,#trainFormat,#trainAdmin,#trainUseBasket'))el.addEventListener('change',render);
  $('showTrainingLead').addEventListener('click',()=>{
    $('trainLead').hidden=false;
    $('trainLead').scrollIntoView({behavior:'smooth',block:'start'});
    $('trainLead').querySelector('input[name="company"]').focus({preventScroll:true});
  });
  function fieldValue(f,k){const el=f.elements.namedItem(k);return el && typeof el.value === 'string' ? el.value.trim() : ''}
  function validNip(n){
    n=n.replace(/[\s-]/g,'');
    if(!/^\d{10}$/.test(n))return false;
    let sum=0;[6,5,7,2,3,4,5,6,7].forEach((w,i)=>sum+=w*Number(n[i]));
    const check=sum%11;
    return check!==10 && check===Number(n[9]);
  }
  function specText(){
    const o=selectedOptions();
    const f=$('trainingLeadForm');
    const sectorName=sectorInfo[o.sector].label;
    return ['ZAPYTANIE O WARSZTATY AI — transformacjaai.store',`Branża: ${sectorName}`,`Grupa: ${o.role}`,`Liczba uczestników: ${o.participants}`,`Format: ${o.format}`,`Godziny bazowe: ${o.baseHours}`,`Warsztat administratorów: ${o.adminHours?o.adminHours+' godziny':'nie'}`,`Łącznie: ${o.totalHours} godzin`,`Moduły z koszyka: ${o.moduleIds.map(id=>{const m=(window.KA_MODULES||[]).find(m=>m.id===id);return m?m.name+' ['+id+']':id}).join(', ')||'brak'}`,'',`Firma: ${fieldValue(f,'company')}`,`NIP: ${fieldValue(f,'nip')}`,`Miasto: ${fieldValue(f,'city')}`,`Kontakt: ${fieldValue(f,'firstName')} ${fieldValue(f,'lastName')}`,`E-mail: ${fieldValue(f,'email')}`,`Telefon: ${fieldValue(f,'phone')}`,`Rola kontaktu: ${fieldValue(f,'contactRole')}`,`Uwagi: ${fieldValue(f,'notes')}`, '', 'Zapytanie nie jest zamówieniem z obowiązkiem zapłaty.'].join('\n');
  }
  $('copyTrainingSpec').addEventListener('click',async()=>{
    const message=$('trainingLeadStatus');
    try{await navigator.clipboard.writeText(specText()); message.className='train-status success';message.textContent='Skopiowano zakres warsztatów do schowka.';}
    catch{message.className='train-status error';message.textContent='Schowek jest niedostępny w tym trybie. Skopiuj dane po otwarciu strony przez HTTPS.';}
  });
  function validateTraining(){
    const f=$('trainingLeadForm'),status=$('trainingLeadStatus');
    status.textContent='';status.className='train-status';
    if(!f.reportValidity())return false;
    if(!validNip(fieldValue(f,'nip'))){status.className='train-status error';status.textContent='NIP jest niepoprawny. Sprawdź 10 cyfr i cyfrę kontrolną.';f.elements.namedItem('nip').focus();return false}
    if(!/^\+?[\d\s()-]{7,30}$/.test(fieldValue(f,'phone'))){status.className='train-status error';status.textContent='Sprawdź numer telefonu.';return false}
    return true;
  }
  function trainingSubject(){return 'Warsztaty AI — '+sectorInfo[sector].label+' — '+fieldValue($('trainingLeadForm'),'company')}
  function trainingFeedback(r){const s=$('trainingLeadStatus');s.textContent=r.message;s.className='train-status '+(r.ok?'success':'error');}
  $('trainingLeadForm').addEventListener('submit',e=>{
    e.preventDefault();if(!validateTraining())return;
    trainingFeedback(window.KA_SHARE.sendMail(trainingSubject(),specText()));
  });
  $('trainingWhatsapp').addEventListener('click',()=>{
    if(!validateTraining())return;
    trainingFeedback(window.KA_SHARE.sendWhatsApp(trainingSubject(),specText()));
  });
  $('trainingEML').addEventListener('click',()=>{
    if(!validateTraining())return;
    trainingFeedback(window.KA_SHARE.downloadEML(trainingSubject(),specText()));
  });
  render();
})();
