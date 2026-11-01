(() => {
'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const departments=['SOR','Interna'], roles=['nurse','doctor'], shifts=['day','night'];
const roleLabel={nurse:'Pielęgniarka / pielęgniarz',doctor:'Lekarka / lekarz'};
const weekdays=['pn','wt','śr','czw','pt','sob','nd'];
const dayLabels=['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela'];
let staff=[], assignments=new Map(), slots=[], chosen=[], approved=false, generated=false, serial=1;
const keyOf=s=>[s.date,s.dept,s.shift,s.role,s.seat].join('|');
function iso(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function parseDay(s){return new Date(s+'T12:00:00')}
function weekDates(){let d=parseDay($('weekStart').value);if(Number.isNaN(d.getTime())){d=new Date();d.setHours(12,0,0,0);}d.setDate(d.getDate()-((d.getDay()+6)%7));$('weekStart').value=iso(d);return Array.from({length:7},(_,i)=>{const x=new Date(d);x.setDate(d.getDate()+i);return iso(x)})}
function parseDays(s){return String(s||'').toLowerCase().split(/[,;]+/).map(v=>v.trim()).filter(Boolean)}
function blocked(e,date){const dow=(parseDay(date).getDay()+6)%7;return parseDays(e.off).some(x=>x===date||x===weekdays[dow]||x===String(dow+1))}
function preferredDay(e,date){const a=parseDays(e.preferredDays);if(!a.length)return null;const dow=(parseDay(date).getDay()+6)%7;return a.includes(weekdays[dow])||a.includes(String(dow+1))||a.includes(date)}
function slotTime(s){const start=new Date(s.date+'T'+(s.shift==='day'?'07:00:00':'19:00:00'));return [start.getTime(),start.getTime()+12*3600000]}
function minRest(){return Math.max(8,Math.min(24,Number($('minRest').value)||11))}
function maxHours(e){return Math.min(Number($('weeklyMax').value)||48,Number(e.maxHours)||84)}
function assignedFor(id,map=assignments,except=[]){return slots.filter(s=>!except.includes(keyOf(s))&&map.get(keyOf(s))===id)}
function allowed(e,s,map=assignments,except=[]){
  if(!e||e.role!==s.role||e.dept!==s.dept||blocked(e,s.date)||(e.noNights&&s.shift==='night'))return {ok:false,reason:'kwalifikacje, urlop lub ograniczenie dyżurów nocnych'};
  const existing=assignedFor(e.id,map,except);
  if((existing.length+1)*12>maxHours(e))return {ok:false,reason:'limit godzin'};
  const [a,b]=slotTime(s);
  for(const old of existing){const [c,d]=slotTime(old);const rest=Math.max(a-d,c-b)/3600000;if(rest<minRest())return {ok:false,reason:'odpoczynek lub nakładające się dyżury'};}
  return {ok:true};
}
function candidateScore(e,s,map,attempt){
  const existing=assignedFor(e.id,map);const pref=e.pref==='any'?0:e.pref===s.shift?6:-4;
  const dayPref=preferredDay(e,s.date);const weekday=(parseDay(s.date).getDay()+6)%7;
  const weekendCount=existing.filter(t=>(parseDay(t.date).getDay()+6)%7>=5).length;
  const dayPenalty=weekday>=5?weekendCount*2:0;
  const lastCount=existing.filter(t=>t.shift===s.shift).length;
  // Deterministic tie breaker varies by attempt, enabling multiple candidate solutions.
  const jitter=((e.id*31+slots.indexOf(s)*17+attempt*19)%23)/35;
  return pref+(dayPref===null?0:dayPref?2:-1)-existing.length*8-dayPenalty-lastCount*.3+jitter;
}
function buildSlots(){const dates=weekDates();slots=[];for(const date of dates)for(const shift of shifts)for(const dept of departments)for(const role of roles){const n=role==='nurse'?Number($('nurseDemand').value):Number($('doctorDemand').value);for(let seat=0;seat<n;seat++)slots.push({date,dept,shift,role,seat})}return dates}
function coverage(map){return [...map.values()].filter(Boolean).length}
function buildDraft(){
  const dates=buildSlots();let best=new Map(),bestScore=-Infinity;
  // Try multiple greedy variants; never sacrifice hard constraints for preferences.
  for(let attempt=0;attempt<25;attempt++){
    const map=new Map();
    const order=[...slots].sort((a,b)=>a.date.localeCompare(b.date)|| (a.shift===b.shift?0:a.shift==='night'?-1:1) || (a.role===b.role?0:a.role==='doctor'?-1:1) || a.dept.localeCompare(b.dept));
    if(attempt%2)order.reverse();
    for(const s of order){
      const eligible=staff.filter(e=>allowed(e,s,map).ok).sort((a,b)=>candidateScore(b,s,map,attempt)-candidateScore(a,s,map,attempt));
      map.set(keyOf(s),eligible.length?eligible[0].id:null);
    }
    const score=coverage(map)*10000+slots.reduce((v,s)=>{const id=map.get(keyOf(s));const e=staff.find(x=>x.id===id);return v+(e?candidateScore(e,s,map,attempt):0)},0);
    if(score>bestScore){bestScore=score;best=map}
  }
  assignments=best;generated=true;approved=false;chosen=[];render();
  showMessage('Wygenerowano propozycję. Sprawdź luki, preferencje i ograniczenia; zatwierdzenie jest odrębnym krokiem.');
}
function validate(map=assignments){
  const errors=[];
  for(const s of slots){const key=keyOf(s),id=map.get(key);if(!id){errors.push(`Brak obsady: ${s.date}, ${s.dept}, ${s.shift==='day'?'dzień':'noc'}, ${roleLabel[s.role].toLowerCase()}`);continue}
    const e=staff.find(x=>x.id===id);if(!e){errors.push(`Nieznany pracownik w ${key}`);continue}
    const a=allowed(e,s,map,[key]);if(!a.ok)errors.push(`${e.name}: ${a.reason} (${s.date}, ${s.dept})`);
  }
  return [...new Set(errors)];
}
function preferences(){let hit=0,asked=0;for(const s of slots){const e=staff.find(x=>x.id===assignments.get(keyOf(s)));if(!e)continue;if(e.pref!=='any'){asked++;if(e.pref===s.shift)hit++}const dp=preferredDay(e,s.date);if(dp!==null){asked++;if(dp)hit++}}return {hit,asked}}
function render(){
  const dates=weekDates();$('dateRange').textContent=`${dates[0]} — ${dates[6]}`;
  $('staffCount').textContent=`${staff.length} osób`;
  const problems=generated?validate():[];const count=generated?coverage(assignments):0;
  $('coverage').textContent=generated?`${Math.round(count/slots.length*100)}%`:'—';$('coverageDetail').textContent=generated?`${count} z ${slots.length} wymaganych obsad`:'Wygeneruj grafik';
  $('violations').textContent=generated?String(problems.length):'—';
  const p=preferences();$('preferences').textContent=generated&&p.asked?`${Math.round(p.hit/p.asked*100)}%`:generated?'Brak danych':'—';
  $('approval').textContent=approved?'Zatwierdzony':'Szkic';$('approvalDetail').textContent=approved?'Zatwierdzono lokalnie w demonstratorze':'Wymaga zatwierdzenia';
  $('issues').innerHTML=!generated?'Brak wygenerowanego planu.':problems.length?problems.slice(0,24).map(s=>`<div class="issue">⚠ ${esc(s)}</div>`).join('')+(problems.length>24?`<div class="issue">… i ${problems.length-24} kolejnych luk lub konfliktów.</div>`:''):'<div class="issue ok">✓ Wszystkie wymagane obsady w tym demonstratorze są wypełnione i przechodzą skonfigurowane reguły. Nadal wymagana jest kontrola prawna i zatwierdzenie koordynatora.</div>';
  $('scheduleBody').innerHTML=!generated?'<tr><td colspan="5" class="empty">Wybierz „Zaproponuj grafik”, aby zobaczyć plan.</td></tr>':dates.map((date,i)=>`<tr><td><span class="day-name">${dayLabels[i]}</span><span class="day-date">${date}</span></td>${departments.flatMap(dept=>shifts.map(shift=>{const group=slots.filter(s=>s.date===date&&s.dept===dept&&s.shift===shift);return `<td>${group.map(s=>{const k=keyOf(s),id=assignments.get(k),e=staff.find(x=>x.id===id),selected=chosen.includes(k);return `<button type="button" class="assignment ${!e?'missing':''} ${selected?'selected':''}" data-slot="${esc(k)}" aria-pressed="${selected}"><span><span class="role">${s.role==='nurse'?'PIELĘGNIARSTWO':'LEKARZE'}</span>${e?esc(e.name):'BRAK OBSADY'}</span><small>${e?'✓':'!'}</small></button>`}).join('')}</td>`})).join('')}</tr>`).join('');
  $('staffBody').innerHTML=staff.map(e=>{const assigned=generated?assignedFor(e.id).length*12:0;return `<tr><td><b>${esc(e.name)}</b>${e.note?`<small>${esc(e.note)}</small>`:''}</td><td>${esc(roleLabel[e.role])}<small>${esc(e.dept)}</small></td><td>${e.pref==='any'?'Dowolna':e.pref==='day'?'Dzień':'Noc'}${e.noNights?' · bez nocy':''}<small>${esc(e.preferredDays||'')}</small></td><td>${esc(e.off||'—')}</td><td>${assigned} h / ${maxHours(e)} h</td><td><button type="button" class="btn ghost" data-edit="${e.id}">Edytuj</button><button type="button" class="btn ghost" data-remove="${e.id}">Usuń</button></td></tr>`}).join('');
  $('swapInfo').textContent=chosen.length?`${chosen.length}/2 wybranych obsad — ${chosen.map(k=>{const e=staff.find(x=>x.id===assignments.get(k));return e?.name||'brak'}).join(' ⇄ ')}`:'Wybierz dwie obsady w kalendarzu.';
  $('swap').disabled=chosen.length!==2||!chosen.every(k=>assignments.get(k));$('replace').disabled=chosen.length!==1||!assignments.get(chosen[0]);
}
function showMessage(msg,error=false){$('scheduleMessage').textContent=msg;$('scheduleMessage').className='message'+(error?' error':'')}
function resetDemo(){
  serial=1;staff=[];
  for(const dept of departments){for(let i=0;i<5;i++)staff.push({id:serial++,name:`Pielęgniarstwo ${dept} ${String.fromCharCode(65+i)}`,role:'nurse',dept,pref:i%3===0?'night':i%3===1?'day':'any',off:i===0?'śr':'',preferredDays:'',noNights:i===1,maxHours:48,note:i===1?'Ograniczenie: bez dyżurów nocnych':''});
    for(let i=0;i<4;i++)staff.push({id:serial++,name:`Lekarz ${dept} ${String.fromCharCode(65+i)}`,role:'doctor',dept,pref:i%3===0?'night':i%3===1?'day':'any',off:i===0?'pt':'',preferredDays:'',noNights:i===2,maxHours:48,note:i===2?'Szczególna okoliczność: bez nocy':''});}
  assignments=new Map();slots=[];chosen=[];generated=false;approved=false;$('nurseDemand').value='1';$('doctorDemand').value='1';$('minRest').value='11';$('weeklyMax').value='48';const d=new Date();d.setDate(d.getDate()+((8-d.getDay())%7||7));$('weekStart').value=iso(d);cancelEdit();render();showMessage('Załadowano przykładowy zespół. Kliknij „Zaproponuj grafik”.');
}
function cancelEdit(){$('staffForm').reset();$('editId').value='';$('saveStaff').textContent='+ Dodaj osobę'}
function saveStaff(event){event.preventDefault();const id=Number($('editId').value)||serial++,name=$('staffName').value.trim();if(!name){$('staffName').focus();return}
  const old=staff.find(x=>x.id===id);
  const e={id,name,role:$('staffRole').value,dept:$('staffDept').value,pref:$('staffPref').value,off:$('staffOff').value.trim(),preferredDays:$('staffPreferredDays').value.trim(),noNights:$('staffNoNights').checked,maxHours:old?.maxHours||48,note:$('staffNote').value.trim()};
  if(old)staff=staff.map(x=>x.id===id?e:x);else staff.push(e);
  generated=false;approved=false;assignments=new Map();chosen=[];cancelEdit();render();showMessage('Zmieniono zespół. Wygeneruj nowy grafik, aby ponownie sprawdzić ograniczenia.');
}
function editStaff(id){const e=staff.find(x=>x.id===id);if(!e)return;$('editId').value=e.id;$('staffName').value=e.name;$('staffRole').value=e.role;$('staffDept').value=e.dept;$('staffPref').value=e.pref;$('staffOff').value=e.off;$('staffPreferredDays').value=e.preferredDays;$('staffNoNights').checked=e.noNights;$('staffNote').value=e.note;$('saveStaff').textContent='Zapisz zmiany';$('staffName').focus();}
function swap(){if(chosen.length!==2)return;const [a,b]=chosen,one=assignments.get(a),two=assignments.get(b),sa=slots.find(s=>keyOf(s)===a),sb=slots.find(s=>keyOf(s)===b);if(!one||!two||one===two)return showMessage('Wybierz dwie różne obsadzone zmiany.',true);
  const test=new Map(assignments);test.delete(a);test.delete(b);
  const ea=staff.find(e=>e.id===one),eb=staff.find(e=>e.id===two);
  if(!allowed(ea,sb,test).ok||!allowed(eb,sa,test).ok)return showMessage('Zamiana odrzucona: kwalifikacje, urlop, odpoczynek lub limit godzin.',true);
  test.set(a,two);test.set(b,one);const issues=validate(test);if(issues.length>validate().length)return showMessage('Zamiana odrzucona: pojawiłyby się dodatkowe konflikty.',true);
  assignments=test;chosen=[];approved=false;render();showMessage('Zamiana przyjęta do SZKICU. Koordynator musi zatwierdzić cały plan.');
}
function replace(){if(chosen.length!==1)return;const k=chosen[0],s=slots.find(x=>keyOf(x)===k),old=assignments.get(k),test=new Map(assignments);test.delete(k);
  const candidates=staff.filter(e=>e.id!==old&&allowed(e,s,test).ok).sort((a,b)=>candidateScore(b,s,test,0)-candidateScore(a,s,test,0));
  if(!candidates.length)return showMessage('Nie znaleziono dostępnego, kwalifikowanego zastępcy bez naruszenia ograniczeń.',true);
  test.set(k,candidates[0].id);assignments=test;chosen=[];approved=false;render();showMessage(`Zaproponowano zastępstwo: ${candidates[0].name}. Wymaga zatwierdzenia przez koordynatora.`);
}
function approve(){if(!generated)return showMessage('Najpierw wygeneruj grafik.',true);const issues=validate();if(issues.length)return showMessage(`Nie można zatwierdzić: ${issues.length} luk lub konfliktów. Sprawdź sekcję kontroli.`,true);approved=true;render();showMessage('Zatwierdzono lokalny SZKIC demonstracyjny. Nie opublikowano go do systemu kadrowego.');}
function csv(){if(!generated)return showMessage('Najpierw wygeneruj grafik.',true);const rows=[['Data','Oddział','Zmiana','Rola','Stanowisko','Pracownik','Status']];for(const s of slots){const e=staff.find(x=>x.id===assignments.get(keyOf(s)));rows.push([s.date,s.dept,s.shift==='day'?'07-19':'19-07',roleLabel[s.role],String(s.seat+1),e?.name||'',e?'Szkic':'Brak obsady'])}
  const content='\ufeff'+rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));a.download=`grafik-dyzurow-${$('weekStart').value}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);showMessage('Pobrano lokalny CSV z grafikiem demonstracyjnym.');
}
$('generate').addEventListener('click',buildDraft);$('reset').addEventListener('click',()=>{if(confirm('Przywrócić przykładowy zespół i usunąć bieżący szkic?'))resetDemo()});$('exportCsv').addEventListener('click',csv);$('approve').addEventListener('click',approve);$('swap').addEventListener('click',swap);$('replace').addEventListener('click',replace);$('clearSelection').addEventListener('click',()=>{chosen=[];render()});$('staffForm').addEventListener('submit',saveStaff);$('cancelEdit').addEventListener('click',cancelEdit);
$('scheduleBody').addEventListener('click',e=>{const b=e.target.closest('[data-slot]');if(!b||!generated)return;const k=b.dataset.slot;if(chosen.includes(k))chosen=chosen.filter(x=>x!==k);else chosen=[...chosen.slice(-1),k];render()});
$('staffBody').addEventListener('click',e=>{const edit=e.target.closest('[data-edit]'),remove=e.target.closest('[data-remove]');if(edit)editStaff(Number(edit.dataset.edit));if(remove){if(!confirm('Usunąć przykładową osobę i wyczyścić bieżący grafik?'))return;staff=staff.filter(x=>x.id!==Number(remove.dataset.remove));assignments=new Map();generated=false;approved=false;chosen=[];render();}});
for(const id of ['weekStart','minRest','weeklyMax','nurseDemand','doctorDemand'])$(id).addEventListener('change',()=>{if(generated){generated=false;approved=false;assignments=new Map();chosen=[];render();showMessage('Parametry uległy zmianie. Wygeneruj grafik ponownie.');}});
resetDemo();
})();
