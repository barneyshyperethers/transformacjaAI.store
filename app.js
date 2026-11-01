(() => {
  'use strict';
  const modules = window.KA_MODULES;
  if (!Array.isArray(modules)) return;
  const byId = new Map(modules.map(m => [m.id,m]));
  const cats = [
    {id:'all',name:'Wszystkie',color:'#52e3e6'},
    {id:'docs',name:'Dokumenty',color:'#52e3e6'},
    {id:'sales',name:'Sprzedaż',color:'#b49bff'},
    {id:'hotel',name:'Hotele',color:'#ffd27f'},
    {id:'hospital',name:'Szpitale',color:'#83f7db'},
    {id:'municipality',name:'Gminy i urzędy',color:'#8bf5ae'},
    {id:'imim',name:'IMIM Smart City',color:'#7ce6e1'},
    {id:'hr',name:'Kadry',color:'#75e4aa'},
    {id:'ops',name:'Logistyka',color:'#ffaa79'},
    {id:'analytics',name:'Zarządzanie',color:'#ff9bc7'},
    {id:'logistics',name:'Logistyka i dystrybucja',color:'#72e6e1'},
    {id:'freight',name:'Spedycja',color:'#b49bff'},
    {id:'legacy',name:'Moje dziedzictwo',color:'#ffd6a5'}
  ];
  const icons = {
    receipt:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    scan:'<path d="M8 3H4a1 1 0 0 0-1 1v4M16 3h4a1 1 0 0 1 1 1v4M3 16v4a1 1 0 0 0 1 1h4M21 16v4a1 1 0 0 1-1 1h-4M7 10h10M7 14h10"/>',
    file:'<path d="M6 2h9l4 4v16H6zM15 2v5h4M9 12h7M9 16h7"/>',
    book:'<path d="M12 5c-2-2-6-2-9-1v15c4-1 7-1 9 1 2-2 5-2 9-1V4c-3-1-7-1-9 1v15"/>',
    pen:'<path d="m4 17-1 4 4-1L20 7l-3-3zM15 6l3 3"/>',
    inbox:'<path d="M4 4h16l2 11v5H2v-5zM2 15h7l2 3h2l2-3h7"/>',
    bot:'<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M9 3h6M8 12h.01M16 12h.01M9 16h6"/>',
    repeat:'<path d="M17 3l4 4-4 4M3 11V9a2 2 0 0 1 2-2h16M7 21l-4-4 4-4M21 13v2a2 2 0 0 1-2 2H3"/>',
    calculator:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h8"/>',
    phone:'<path d="M7 3 4 5c-1 8 7 16 15 15l2-3-5-4-3 3c-3-1-5-3-6-6l3-3z"/>',
    star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 10h18c0-2-3-3-3-10ZM10 22h4"/>',
    spark:'<path d="m12 2 1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8z"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18M8 14h3M14 14h3M8 18h3"/>',
    box:'<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10"/>',
    thermo:'<path d="M10 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0zM13 8v9"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M17 15a5 5 0 0 1 4 5"/>',
    userplus:'<circle cx="9" cy="8" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M20 8v8M16 12h8"/>',
    truck:'<path d="M2 6h13v12H2zM15 10h4l3 4v4h-7z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    route:'<circle cx="5" cy="18" r="2"/><circle cx="19" cy="5" r="2"/><path d="M7 18h8a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h8"/>',
    hardhat:'<path d="M3 17h18M5 17v-4a7 7 0 0 1 14 0v4M10 6v8M14 6v8M2 20h20"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    factory:'<path d="M3 21V9l7 4V8l7 5V3h4v18zM6 17h2M12 17h2M18 17h1"/>',
    chart:'<path d="M3 3v18h18M7 16v-5M12 16V7M17 16V4"/>',
    coins:'<circle cx="9" cy="9" r="6"/><path d="M13 15a6 6 0 1 0 8 0M7 9h4M9 6v6"/>',
    check:'<path d="M3 12l6 6L21 5"/>',
    wallet:'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 9V4h15M14 13h7v5h-7a2 2 0 0 1 0-5z"/>',
    landmark:'<path d="M3 10h18M5 10V20M9 10V20M15 10V20M19 10V20M2 21h20M12 2 2 8h20z"/>'
  };
  const colors = {
    docs:{top:'#59e4e8',left:'#197a8d',right:'#15556c',light:'#c9ffff'},
    sales:{top:'#b59cff',left:'#634dae',right:'#41337e',light:'#e9daff'},
    hotel:{top:'#fdd17e',left:'#9f7236',right:'#795026',light:'#fff0ce'},
    hospital:{top:'#8af3d2',left:'#247b81',right:'#15576a',light:'#edfffc'},
    municipality:{top:'#8cf2ae',left:'#277e5b',right:'#165b50',light:'#f2ffdb'},
    imim:{top:'#84d9ef',left:'#327d8d',right:'#34547d',light:'#e5ffff'},
    hr:{top:'#73e6aa',left:'#2d8566',right:'#195d4e',light:'#d4ffe7'},
    ops:{top:'#ffa77d',left:'#9f5339',right:'#703b35',light:'#ffe7d5'},
    analytics:{top:'#ffa4ca',left:'#a9527f',right:'#733650',light:'#ffe0ef'},
    logistics:{top:'#7ee9f0',left:'#318eae',right:'#235c85',light:'#e1ffff'},
    freight:{top:'#ccb5ff',left:'#7764bd',right:'#4a408f',light:'#f1e6ff'},
    legacy:{top:'#ffd8aa',left:'#bf819e',right:'#92617b',light:'#fff5ea'}
  };
  const slots = [
    [3,2],[2,3],[1,2],[2,1],[3,3],[1,1],[4,2],[2,4],
    [0,2],[2,0],[3,1],[1,3],[4,3],[3,4],[4,1],[1,4],
    [0,3],[3,0],[5,2],[2,5],[5,3],[3,5],[0,1],[1,0],
    [4,4],[0,4],[4,0],[5,1],[1,5],[5,4],[4,5],[0,0],[5,0],[0,5],[5,5],
    [6,2],[2,6],[6,3],[3,6],
    [0,6],[1,6],[4,6],[5,6],[6,0],[6,1],[6,4],[6,5],[6,6]
  ];
  // Gotowe zestawy wskazują wyłącznie na elementy istniejącego katalogu modułów.
  const PRESETS = Object.freeze({
    construction:{label:'Nowoczesny Budowlaniec',symbol:'⚒',ids:['construction','quotes','obieg','time','delivery','margins','tasks'],button:'constructionPreset',status:'constructionPresetStatus'},
    hotel:{label:'Nowoczesny Hotel z AI',symbol:'✦',ids:['concierge','housekeeping','booking','inbox','stocks','shifts','cockpit'],button:'hotelPreset',status:'hotelPresetStatus'},
    hospital:{label:'Nowoczesny Szpital z AI',symbol:'✚',ids:['medshifts','medswaps','medcomms','meddocs','medresources','medreports','medcoord'],button:'hospitalPreset',status:'hospitalPresetStatus'},
    municipality:{label:'Nowoczesna Gmina z AI',symbol:'⌂',ids:['govintake','govkpa','govresidents','govacts','govcomms','govprojects','govcockpit'],button:'municipalityPreset',status:'municipalityPresetStatus'},
    imim:{label:'IMIM — Interaktywna Macierz Inteligentnego Miasta',symbol:'◈',ids:['imimlocal','imimezd','imimkpa','imimtoken','imimsenior','imimcitizen','imimsecurity'],button:'imimPreset',status:'imimPresetStatus'},
    logistics:{label:'Pakiet Logistyka',symbol:'▣',ids:['logorders','logwms','logsuppliers','logreturns','delivery','reorder','transport','reports'],button:'logisticsPreset',status:'logisticsPresetStatus'},
    freight:{label:'Pakiet Spedytora',symbol:'↗',ids:['freightquotes','freightcmr','freightdispatch','freightcustoms','freightclaims','transport','inbox','reports'],button:'freightPreset',status:'freightPresetStatus'},
    legacy:{label:'Moje Dziedzictwo w Avatarze AI',symbol:'✧',ids:['legacyinterviews','legacyarchive','legacytimeline','legacydecisions','legacycrises','legacynegotiations','legacylexicon','legacysuccession','legacyavatar','legacygrandson','legacyscenarios','legacydashboard','legacyworkshop'],button:'legacyPreset',status:'legacyPresetStatus'}
  });
  const $ = id => document.getElementById(id);
  let selected = loadSaved(), category = 'all', search = '', inspectId = null, zoom = 1;
  let projectTemplate = loadProjectTemplate();
  let toastTimer;
  function loadSaved() {
    try {const s=JSON.parse(localStorage.getItem('ka_selected')||'[]');return Array.isArray(s)?[...new Set(s.filter(id=>modules.some(m=>m.id===id)))].slice(0,modules.length):[]} catch {return []}
  }
  function loadProjectTemplate(){try{const t=localStorage.getItem('ka_template')||'';return PRESETS[t]?t:''}catch{return ''}}
  function persist(){try{localStorage.setItem('ka_selected',JSON.stringify(selected));localStorage.setItem('ka_template',projectTemplate)}catch{}}
  function presetIsComplete(type){const p=PRESETS[type];return !!p&&selected.length===p.ids.length&&p.ids.every(id=>selected.includes(id))}
  function applyPreset(type){
    const preset=PRESETS[type];if(!preset)return;
    if(selected.length&&!presetIsComplete(type)){
      if(!confirm(`Wczytanie zestawu „${preset.label}” zastąpi obecny wybór ${preset.ids.length} modułami. Kontynuować?`))return;
    }
    selected=[...preset.ids];projectTemplate=type;inspectId=preset.ids[0];
    updateNipRequirement();
    search='';category='all';$('search').value='';zoom=1;
    persist();renderAll();
    $('builder').scrollIntoView({behavior:'smooth',block:'start'});
    notify(`Wybrano ${preset.ids.length} modułów: ${preset.label}. Możesz je modyfikować na mapie i w koszyku.`);
  }
  function updateNipRequirement(){const nip=$('nip'); if(!nip)return; const optional=projectTemplate==='legacy'; nip.required=!optional;const lbl=nip.closest('label').querySelector('span');lbl.textContent=optional?'(opcjonalnie dla rodziny)':'*';$('nipHint').textContent=optional?'Osoba prywatna może pozostawić pole puste.':'10 cyfr; sprawdzamy cyfrę kontrolną.'; nip.setCustomValidity('');}
  const esc = str => String(str).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function icon(name){return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.box}</svg>`}
  function notify(message){const t=$('toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3200)}
  function categoryUI(){
    $('categories').innerHTML=cats.map(c=>`<button type="button" class="cat-tab ${category===c.id?'active':''}" data-category="${c.id}" aria-pressed="${category===c.id}">${c.name}${c.id==='all'?' · '+modules.length:''}</button>`).join('');
  }
  function catalog(){
    const list=$('moduleList'), oldScroll=list.scrollTop;
    const term=search.trim().toLowerCase();
    const filtered=modules.filter(m=>(category==='all'||m.cat===category)&&(!term||[m.name,m.short,...m.features].join(' ').toLowerCase().includes(term)));
    $('resultsInfo').textContent=`${filtered.length} ${filtered.length===1?'produkt':filtered.length>=2&&filtered.length<=4?'produkty':'produktów'}`;
    list.innerHTML=filtered.length?filtered.map(m=>{
      const added=selected.includes(m.id);
      return `<article class="module-card tone-${m.tone} ${added?'selected':''}" draggable="true" data-module="${m.id}">
        <div class="module-top"><div class="module-icon">${icon(m.icon)}</div><div class="module-main"><div class="module-titleline"><strong>${esc(m.name)}</strong>${m.flag?`<span class="module-flag">${esc(m.flag)}</span>`:''}</div><p>${esc(m.short)}</p></div></div>
        <div class="module-foot"><div class="module-time">${m.id==='legacyworkshop'?'3 dni warsztatów':`${m.min}–${m.max} dni`} <span>${m.id==='legacyworkshop'?'poza pracami IT':'kod + testy + debug'}</span></div><button class="add-module" type="button" data-toggle="${m.id}" aria-pressed="${added}">${added?'✓ Dodano':'+ Dodaj'}</button></div>
        <details class="module-details"><summary>Sprawdź funkcjonalności</summary><ul>${m.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul></details>
      </article>`;
    }).join(''):'<div class="no-results">Nie znaleziono modułów. Spróbuj innej frazy.</div>';
    list.scrollTop=oldScroll;
  }
  function totals(){return selected.reduce((a,id)=>{let m=byId.get(id);return {min:a.min+m.min,max:a.max+m.max}},{min:0,max:0})}
  function summary(){
    const t=totals();
    $('selectedCount').textContent=`${selected.length} / ${modules.length}`;
    $('progressFill').style.width=`${selected.length/modules.length*100}%`;
    $('daysTotal').textContent=`${t.min}–${t.max}`;
    $('hoursTotal').textContent=`${t.min*8}–${t.max*8} roboczogodzin`;
    $('selectedList').innerHTML=selected.length?selected.map((id,i)=>{let m=byId.get(id);return `<div class="picked-item"><span class="picked-index">${String(i+1).padStart(2,'0')}</span><div class="picked-text"><strong>${esc(m.name)}</strong><small>${m.id==='legacyworkshop'?'3 dni warsztatów':`${m.min}–${m.max} dni`} · ${esc(cats.find(c=>c.id===m.cat).name)}</small></div><button aria-label="Usuń ${esc(m.name)}" title="Usuń" class="picked-remove" type="button" data-remove="${id}">×</button></div>`}).join(''):'<div class="empty-state"><div>⌗</div><strong>Twój plan jest pusty</strong><p>Dodaj rozwiązania z katalogu, aby zobaczyć zakres prac.</p></div>';
    $('formSelected').textContent=selected.length?`${selected.length} ${selected.length===1?'moduł':selected.length<5?'moduły':'modułów'}: ${selected.map(id=>byId.get(id).name).join(' · ')}`:'Nie wybrano jeszcze modułów';
    $('formEstimate').textContent=selected.length?`Estymacja: ${t.min}–${t.max} dni (${t.min*8}–${t.max*8} h) ${projectTemplate==='legacy'?'prac merytorycznych i technicznych; trzydniowe warsztaty liczymy oddzielnie.':'łącznie z testami i debugowaniem.'}`:'Wybierz rozwiązania w konfiguratorze.';
    $('estimateHeader').textContent=projectTemplate==='legacy'?'NAKŁAD PRAC PROJEKTOWYCH':'ESTYMACJA PRAC IT';
    $('estimateNote').textContent=projectTemplate==='legacy'?'Wywiady, opracowanie archiwum i aplikacji oraz testy. Trzydniowe warsztaty (jeśli wybrane) nie są doliczane do estymacji. Zakres do potwierdzenia.':'Programowanie + integracje + testy i debugowanie. Bez szkolenia pracowników. Czas orientacyjny, zakres do potwierdzenia.';
    $('imimPreferences').hidden=!(projectTemplate==='imim'||projectTemplate==='municipality'||selected.some(id=>byId.get(id)?.cat==='imim'));
    $('submitModulesCount').textContent=`${selected.length} ${selected.length===1?'moduł':selected.length<5?'moduły':'modułów'}`;
    const banner=$('basketPresetBanner'), mapLabel=$('mapPresetStatus'),preset=PRESETS[projectTemplate];
    for(const [type,p] of Object.entries(PRESETS)){
      const status=$(p.status),active=projectTemplate===type && selected.length>0;
      if(!active){status.textContent='* Orientacyjny czas programowania, integracji, testów i debugowania. Bez szkolenia pracowników. Zestaw można dowolnie modyfikować.';continue;}
      status.textContent=presetIsComplete(type)?`✓ Wczytano ${p.ids.length} modułów na mapę, do koszyka i formularza. Możesz zmienić wybór.`:'✓ Zestaw został zmodyfikowany; koszyk i formularz są aktualizowane na bieżąco.';
    }
    if(preset && selected.length){
      const label=`${preset.symbol} ${preset.label} · ${presetIsComplete(projectTemplate)?`${preset.ids.length}/${preset.ids.length} modułów`:'zestaw zmodyfikowany'}`;
      banner.hidden=false;banner.textContent=label;mapLabel.hidden=false;mapLabel.textContent=label;
    }else{banner.hidden=true;mapLabel.hidden=true;}
    $('dropzone').classList.toggle('hotel-map-mode',projectTemplate==='hotel'&&selected.length>0);
    $('dropzone').classList.toggle('hospital-map-mode',projectTemplate==='hospital'&&selected.length>0);
    $('dropzone').classList.toggle('municipality-map-mode',(projectTemplate==='municipality'||projectTemplate==='imim')&&selected.length>0);
    for (const variant of ['logistics','freight','legacy']) $('dropzone').classList.toggle(variant+'-map-mode',projectTemplate===variant&&selected.length>0);
    const mapLegend=document.querySelector('.map-bottomline .legend-dot.hub')?.parentElement;
    if(mapLegend)mapLegend.lastChild.textContent=projectTemplate==='hotel'&&selected.length>0?' CENTRUM HOTELU':projectTemplate==='hospital'&&selected.length>0?' CENTRUM SZPITALA':(projectTemplate==='municipality'||projectTemplate==='imim')&&selected.length>0?' URZĄD GMINY':projectTemplate==='logistics'?' CENTRUM LOGISTYKI':projectTemplate==='freight'?' CENTRUM SPEDYCJI':projectTemplate==='legacy'?' ARCHIWUM DZIEDZICTWA':' CENTRUM FIRMY';
    $('formModuleChecklist').innerHTML=selected.length?selected.map(id=>{
      const m=byId.get(id);
      return `<label class="form-module-check"><input type="checkbox" data-form-module="${id}" checked aria-label="Uwzględnij ${esc(m.name)}"/><span><strong>${esc(m.name)}</strong><small>${m.id==='legacyworkshop'?'3 dni warsztatów':`${m.min}–${m.max} dni`}</small></span></label>`;
    }).join(''):'<div class="form-modules-empty">Zaznacz rozwiązania w katalogu lub wybierz gotowy pakiet dla swojej branży.</div>';
  }
  function toggle(id){if(!byId.has(id))return; const i=selected.indexOf(id);if(i!==-1){selected.splice(i,1);if(inspectId===id)inspectId=null;notify('Usunięto komponent z planu');}else{if(selected.length>=slots.length){notify(`Na jednej mapie można umieścić maksymalnie ${slots.length} modułów`);return}selected.push(id);inspectId=id;notify(`Dodano: ${byId.get(id).name}`);}if(selected.length===0)projectTemplate='';updateNipRequirement();persist();renderAll();}
  function renderAll(){categoryUI();catalog();summary();drawMap();inspector();}

  const NS='http://www.w3.org/2000/svg';
  const S=(name,attrs={},textVal)=>{const n=document.createElementNS(NS,name);Object.entries(attrs).forEach(([key,val])=>n.setAttribute(key,String(val)));if(textVal!==undefined)n.textContent=textVal;return n};
  const points=arr=>arr.map(p=>p.map(v=>Math.round(v*10)/10).join(',')).join(' ');
  const at=(c,r)=>({x:600+(c-r)*77,y:220+(c+r)*42});
  function gridCell(g,c,r){
    const {x,y}=at(c,r), w=72, h=36;
    const top=points([[x,y-h],[x+w,y],[x,y+h],[x-w,y]]);
    g.appendChild(S('polygon',{points:points([[x-w,y],[x,y+h],[x,y+h+15],[x-w,y+15]]),fill:'#10273a',stroke:'#244c63','stroke-width':1}));
    g.appendChild(S('polygon',{points:points([[x,y+h],[x+w,y],[x+w,y+15],[x,y+h+15]]),fill:'#0a1d2f',stroke:'#1b3c56','stroke-width':1}));
    g.appendChild(S('polygon',{points:top,fill:'#143044',stroke:'#36617a','stroke-width':1.1}));
    g.appendChild(S('polygon',{points:points([[x,y-h+11],[x+w-20,y],[x,y+h-11],[x-w+20,y]]),fill:'none',stroke:'#2a5168','stroke-width':.9,'stroke-dasharray':'5 7',opacity:'.55'}));
    return {x,y};
  }
  function building(g,m,c,r,index,isHQ=false){
    const {x,y}=at(c,r), color=isHQ?{top:'#7cf8ef',left:'#1483a1',right:'#165d88',light:'#fff'}:colors[m.cat];
    const H=isHQ?138:66+(index%4)*12;
    const bw=isHQ?51:44,bd=isHQ?25:22;
    let group=S('g',{class:`city-building ${inspectId===m.id?'active':''}`,tabindex:'0',role:'button','aria-label':isHQ?'Centrum placówki / firmy / gminy':`Moduł ${m.name}, wybierz szczegóły`});
    let ring=S('polygon',{class:'focus-ring',points:points([[x,y-34],[x+67,y],[x,y+36],[x-67,y]]),fill:'none',stroke:'#deffff','stroke-width':3,opacity:0});group.appendChild(ring);
    group.appendChild(S('ellipse',{cx:x,cy:y+25,rx:47,ry:19,fill:color.top,opacity:'.17'}));
    let W=[x-bw,y-H],S1=[x,y-H+bd],E=[x+bw,y-H],N=[x,y-H-bd];
    let Wb=[x-bw,y],Sb=[x,y+bd],Eb=[x+bw,y];
    group.appendChild(S('polygon',{points:points([W,S1,Sb,Wb]),fill:color.left,stroke:color.top,'stroke-width':1.2}));
    group.appendChild(S('polygon',{points:points([S1,E,Eb,Sb]),fill:color.right,stroke:color.top,'stroke-width':1.2}));
    group.appendChild(S('polygon',{points:points([N,E,S1,W]),fill:color.top,stroke:color.light,'stroke-width':1.5}));
    // Luminous windows and process traces on both facades
    for (let j=0;j<(isHQ?5:2+(index%2));j++) {
      const startY=y-H+bd+12+j*18;
      if(startY>y+10)break;
      group.appendChild(S('line',{x1:x-29,y1:startY-4,x2:x-12,y2:startY+5,stroke:color.light,'stroke-width':3,opacity:.75}));
      group.appendChild(S('line',{x1:x+12,y1:startY+5,x2:x+29,y2:startY-4,stroke:color.light,'stroke-width':3,opacity:.55}));
    }
    if(isHQ){
      group.appendChild(S('text',{x,y:y-H+5,'text-anchor':'middle','font-size':13,'font-weight':900,fill:'#063643'},projectTemplate==='hotel'?'HOTEL':projectTemplate==='hospital'?'SZPITAL':projectTemplate==='municipality'?'GMINA':projectTemplate==='imim'?'IMIM':'AI'));
      group.appendChild(S('line',{x1:x,y1:y-H-bd,x2:x,y2:y-H-bd-35,stroke:'#63f9ec','stroke-width':3}));
      group.appendChild(S('circle',{cx:x,cy:y-H-bd-38,r:7,fill:'#7bfff2',stroke:'#e0ffff','stroke-width':2}));
      group.appendChild(S('text',{x:x,y:y+49,'text-anchor':'middle',class:'city-label',fill:'#c2ffff'},projectTemplate==='hotel'?'CENTRUM HOTELU':projectTemplate==='hospital'?'CENTRUM SZPITALA':projectTemplate==='municipality'?'URZĄD GMINY':projectTemplate==='imim'?'MACIERZ IMIM':'CENTRUM FIRMY'));
    }else{
      group.appendChild(S('circle',{cx:x,cy:y-H,r:13,fill:'#092738',stroke:'#e3fdff','stroke-width':1.6,opacity:'.95'}));
      group.appendChild(S('text',{x,y:y-H+4,'text-anchor':'middle','font-size':11,'font-weight':850,fill:color.light},String(index+1).padStart(2,'0')));
      if(inspectId===m.id){group.appendChild(S('text',{x,y:y-H-40,'text-anchor':'middle',class:'city-label',fill:color.light},m.name.length>24?m.name.slice(0,23)+'…':m.name));}
    }
    const title=S('title',{},isHQ?'Centralna platforma transformacjaai.store':`${m.name} — kliknij po szczegóły`); group.appendChild(title);
    if(!isHQ){group.addEventListener('click',()=>{inspectId=m.id;drawMap();inspector();});group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();inspectId=m.id;drawMap();inspector();}})}
    g.appendChild(group);
  }
  function drawMap(){
    const svg=$('cityMap');svg.replaceChildren();
    const defs=S('defs');const filter=S('filter',{id:'mapglow',x:'-100%',y:'-100%',width:'300%',height:'300%'});filter.appendChild(S('feGaussianBlur',{stdDeviation:11}));defs.appendChild(filter);svg.appendChild(defs);
    svg.appendChild(S('ellipse',{cx:600,cy:485,rx:360,ry:127,fill:'#1acbe3',opacity:'.075',filter:'url(#mapglow)'}));
    svg.appendChild(S('path',{d:'M 70 376 L 600 125 L 1132 379 L 600 632 Z',stroke:'#2e667a',fill:'none','stroke-dasharray':'7 14',opacity:'.37'}));
    // Background tech decorations.
    for(let i=0;i<8;i++){let x=130+i*130;svg.appendChild(S('circle',{cx:x,cy:105+(i%2)*35,r:1.8,fill:'#6feaea',opacity:'.4'}))}
    const board=S('g');svg.appendChild(board);
    for(let order=0;order<=12;order++)for(let c=0;c<7;c++){let r=order-c;if(r>=0&&r<7)gridCell(board,c,r)}
    const hub=at(2,2);const links=S('g');svg.appendChild(links);
    selected.forEach((id,i)=>{const [c,r]=slots[i],pos=at(c,r);links.appendChild(S('path',{class:'connection-line',d:`M ${hub.x} ${hub.y+8} Q ${(hub.x+pos.x)/2} ${(hub.y+pos.y)/2-40} ${pos.x} ${pos.y+10}`}));});
    const items=[{m:{id:'hub',name:'Centrum placówki / firmy / gminy',cat:'docs'},c:2,r:2,index:0,isHQ:true}, ...selected.map((id,i)=>({m:byId.get(id),c:slots[i][0],r:slots[i][1],index:i,isHQ:false}))];
    items.sort((a,b)=>(a.c+a.r)-(b.c+b.r)||a.c-b.c);
    const structures=S('g');svg.appendChild(structures);
    items.forEach(o=>building(structures,o.m,o.c,o.r,o.index,o.isHQ));
    const selectedLabel=S('text',{x:600,y:754,'text-anchor':'middle',fill:'#7caabc','font-size':12,'letter-spacing':2});selectedLabel.textContent=selected.length?(projectTemplate==='hotel'?`${selected.length} MODUŁÓW • TWÓJ INTELIGENTNY HOTEL`:projectTemplate==='municipality'?`${selected.length} MODUŁÓW • TWOJA INTELIGENTNA GMINA`:projectTemplate==='imim'?`${selected.length} MODUŁÓW • INTERAKTYWNA MACIERZ MIASTA`:projectTemplate==='logistics'?`${selected.length} MODUŁÓW • TWÓJ ŁAŃCUCH DOSTAW`:projectTemplate==='freight'?`${selected.length} MODUŁÓW • TWOJA SPEDYCJA`:projectTemplate==='legacy'?`${selected.length} ELEMENTÓW • DZIEDZICTWO FIRMY`:`${selected.length} MODUŁÓW • JEDEN EKOSYSTEM`):'DODAJ MODUŁY — TWOJA FIRMA ROŚNIE';svg.appendChild(selectedLabel);
    $('mapStatus').textContent=`${selected.length} / ${modules.length} MODUŁÓW`;
    setViewBox();
  }
  function setViewBox(){const ww=1200/zoom,hh=790/zoom;$('cityMap').setAttribute('viewBox',`${600-ww/2} ${395-hh/2} ${ww} ${hh}`)}
  function inspector(){
    const d=$('mapInspector');
    if(inspectId&&byId.has(inspectId)&&selected.includes(inspectId)){
      const m=byId.get(inspectId),label=cats.find(c=>c.id===m.cat).name;
      d.innerHTML=`<div class="inspector-icon tone-${m.tone}" style="color:var(--accent)">${icon(m.icon)}</div><div><strong>${esc(m.name)} <span style="color:#7ccbc9;font-weight:400">· ${esc(label)}</span></strong><p>${esc(m.features.join(' • '))}. Szacunek: ${m.id==='legacyworkshop'?'3 dni warsztatów (oddzielnie)':`${m.min}–${m.max} dni łącznie z testami`}.</p></div>`;
    }else{
      d.innerHTML='<div class="inspector-icon">✦</div><div><strong>To jest Twoja firma przyszłości</strong><p>Dodaj pierwszy moduł, a na planie pojawi się nowy proces. Kliknij budynek, aby sprawdzić szczegóły.</p></div>';
    }
  }
  const imimPrefFields=['imimUnitType','imimSize','imimPurchase','imimDeployment','imimPriority','imimEzd','imimStage','imimFunding','imimDecisionRole'];
  function purchasePrefs(){const f=$('leadForm');if($('imimPreferences').hidden)return {};return Object.fromEntries(imimPrefFields.map(k=>{const el=f.elements[k],v=fieldValue(f,k);return [k,el?.selectedOptions?.[0]?.textContent?.trim()+(v?' ['+v+']':'')||v]}));}
  function previewString(){
    const f=$('leadForm'),get=name=>f.elements[name]?.value?.trim()||'(nie podano)',t=totals();
    return `ZAPYTANIE O AUTOMATYZACJĘ — transformacjaai.store\nZestaw wyjściowy: ${PRESETS[projectTemplate]?.label||'Konfiguracja własna'}\n\nFIRMA\nNazwa: ${get('company')}\nNIP: ${get('nip')}\nMiasto: ${get('city')}\nWWW: ${get('companyWebsite')}\n\nKONTAKT\nOsoba: ${get('firstName')} ${get('lastName')}\nRola: ${get('contactRole')}\nStanowisko: ${get('jobTitle')}\nE-mail: ${get('email')}\nTelefon: ${get('phone')}\n\nPROJEKT\nHoryzont: ${get('timeline')}\nBudżet: ${get('budget')}\nOpis: ${get('notes')}\n\nPREFERENCJE IMIM / GMINY\n${Object.entries(purchasePrefs()).map(([k,v])=>k+': '+(v||'nie podano')).join('\n')||'Nie dotyczy'}\n\nWYBRANE MODUŁY (${selected.length})\n${selected.map((id,i)=>{let m=byId.get(id);return `${i+1}. ${m.name} (${m.id==='legacyworkshop'?'3 dni warsztatów':`${m.min}–${m.max} dni`})\n   Funkcje: ${m.features.join('; ')}`}).join('\n')||'Brak modułów'}\n\nEstymacja sumaryczna: ${t.min}–${t.max} dni pracy projektowej, tj. ${t.min*8}–${t.max*8} godzin.\nWarsztaty trzydniowe (jeśli wybrane) liczone oddzielnie. Inne szkolenia nie są uwzględnione. Estymacja wymaga indywidualnej weryfikacji.`;
  }
  function nipValid(value){
    const n=String(value).replace(/[\s-]/g,'');if(!/^\d{10}$/.test(n))return false;
    const weights=[6,5,7,2,3,4,5,6,7];const check=weights.reduce((sum,w,i)=>sum+w*Number(n[i]),0)%11;
    return check!==10&&check===Number(n[9]);
  }
  function showFormMessage(message,kind){const el=$('formMessage');el.className=`form-message ${kind}`;el.textContent=message;el.scrollIntoView({behavior:'smooth',block:'nearest'});}
  function fieldValue(form,name){return String(form.elements[name]?.value||'').trim()}
  function validateLead(){
    const f=$('leadForm'),nip=f.elements.nip;
    nip.setCustomValidity((projectTemplate==='legacy'&&!nip.value.trim())||nipValid(nip.value)?'':'Wpisz prawidłowy NIP (10 cyfr z poprawną cyfrą kontrolną).');
    if(!f.reportValidity())return false;
    if(!selected.length){showFormMessage('Najpierw wybierz co najmniej jeden moduł automatyzacji.','error');return false}
    return true;
  }
  function mailSubject(){return 'Zapytanie transformacjaai.store — '+(PRESETS[projectTemplate]?.label||'Konfiguracja własna')+' — '+fieldValue($('leadForm'),'company')}
  function sendForm(event){
    event.preventDefault();
    if(!validateLead())return;
    const r=window.KA_SHARE.sendMail(mailSubject(),previewString());
    showFormMessage(r.message,r.ok?'success':'error');
  }
  function sendOnWhatsApp(){
    if(!validateLead())return;
    const r=window.KA_SHARE.sendWhatsApp(mailSubject(),previewString());
    showFormMessage(r.message,r.ok?'success':'error');
  }
  function saveDraft(){
    if(!validateLead())return;
    const r=window.KA_SHARE.downloadEML(mailSubject(),previewString());
    showFormMessage(r.message,'success');
  }
  function bindEvents(){
    $('categories').addEventListener('click',e=>{let b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;catalog();categoryUI()});
    $('search').addEventListener('input',e=>{search=e.target.value;catalog();$('moduleList').scrollTop=0});
    $('moduleList').addEventListener('click',e=>{let b=e.target.closest('[data-toggle]');if(b)toggle(b.dataset.toggle)});
    $('moduleList').addEventListener('dragstart',e=>{let card=e.target.closest('[data-module]');if(!card)return;e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/plain',card.dataset.module);$('dropzone').classList.add('dragging')});
    $('moduleList').addEventListener('dragend',()=>{$('dropzone').classList.remove('dragging')});
    const dz=$('dropzone');dz.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';dz.classList.add('dragging')});dz.addEventListener('dragleave',e=>{if(!dz.contains(e.relatedTarget))dz.classList.remove('dragging')});dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dragging');const id=e.dataTransfer.getData('text/plain');if(byId.has(id)&&!selected.includes(id))toggle(id);else if(selected.includes(id))notify('Ten moduł jest już na mapie')});
    $('selectedList').addEventListener('click',e=>{let b=e.target.closest('[data-remove]');if(b)toggle(b.dataset.remove)});
    $('formModuleChecklist').addEventListener('change',e=>{const cb=e.target.closest('[data-form-module]');if(!cb)return;const id=cb.dataset.formModule;if(byId.has(id)&&!cb.checked&&selected.includes(id))toggle(id);});
    $('zoomIn').addEventListener('click',()=>{zoom=Math.min(1.35,Math.round((zoom+.1)*100)/100);setViewBox()});
    $('zoomOut').addEventListener('click',()=>{zoom=Math.max(.75,Math.round((zoom-.1)*100)/100);setViewBox()});
    $('zoomReset').addEventListener('click',()=>{zoom=1;setViewBox()});
    for(const [type,preset] of Object.entries(PRESETS))$(preset.button).addEventListener('click',()=>applyPreset(type));
    $('exampleProject').addEventListener('click',()=>{selected=['ocr','followup','quotes','delivery','reports','shifts'];inspectId='shifts';projectTemplate='';persist();renderAll();notify('Wczytano przykładowy zestaw 6 automatyzacji')});
    $('clearMap').addEventListener('click',()=>{if(selected.length&&!confirm('Usunąć wszystkie moduły z tego projektu?'))return;selected=[];inspectId=null;projectTemplate='';updateNipRequirement();persist();renderAll();notify('Wyczyszczono plan firmy')});
    $('previewRequest').addEventListener('click',()=>{$('previewText').textContent=previewString();$('requestPreview').showModal()});
    $('closePreview').addEventListener('click',()=>$('requestPreview').close());
    $('requestPreview').addEventListener('click',e=>{if(e.target===$('requestPreview'))$('requestPreview').close()});
    $('copyPreview').addEventListener('click',async()=>{const value=previewString();try{await navigator.clipboard.writeText(value);notify('Skopiowano opis zapytania')}catch{const ta=document.createElement('textarea');ta.value=value;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();notify('Skopiowano opis zapytania')}});
    $('leadForm').addEventListener('submit',sendForm);
    $('sendWhatsapp').addEventListener('click',sendOnWhatsApp);
    $('downloadEML').addEventListener('click',saveDraft);
    $('nip').addEventListener('input',()=>{$('nip').setCustomValidity('')});
  }
  // Parametry preferencji IMIM przechodzą z publicznej podstrony bez danych kontaktowych w URL.
  function importImimPreferences(params){
    for(const key of imimPrefFields){const val=params.get(key);if(!val)continue;const el=$('leadForm').elements[key];if(el&&Array.from(el.options).some(o=>o.value===val))el.value=val;}
  }
  // Wybór z podstron branżowych: jedno kliknięcie ładuje wskazany zestaw do mapy, koszyka i formularza.
  const inbound=new URLSearchParams(location.search);
  const inboundType=inbound.get('pakiet');
  if(inboundType && PRESETS[inboundType]){
    const proposed=(inbound.get('moduly')||'').split(',').filter(id=>byId.has(id));
    const unique=[...new Set(proposed)].slice(0,slots.length);
    selected=unique.length?unique:[...PRESETS[inboundType].ids];
    projectTemplate=inboundType;
    inspectId=selected.find(id=>id!=='legacyworkshop')||selected[0]||null;
    persist();
  }
  importImimPreferences(inbound);
  updateNipRequirement();
  bindEvents();renderAll();
})();
