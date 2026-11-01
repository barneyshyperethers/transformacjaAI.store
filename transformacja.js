/* Kalkulator scenariuszy oparty na założeniach użytkownika, bez statystycznych obietnic. */
(()=>{'use strict';const $=id=>document.getElementById(id);const base=$('tai-cost'),revenue=$('tai-revenue'),saving=$('tai-save'),growth=$('tai-growth');if(!base||!revenue||!saving||!growth)return;
const money=n=>Math.round(n).toLocaleString('pl-PL')+' zł';const num=(el,max)=>Math.min(max,Math.max(0,Number(el.value)||0));
function draw(){const a=num(base,1e9),r=num(revenue,1e9),s=num(saving,10),g=num(growth,5);$('tai-save-label').textContent=s+'%';$('tai-growth-label').textContent=g+'%';const saved=a*s/100,extra=r*g/100;$('tai-saving').textContent=money(saved);$('tai-upside').textContent=money(extra);$('tai-total').textContent=money(saved+extra);$('tai-annual').textContent=money((saved+extra)*12);}
for(const el of [base,revenue,saving,growth])el.addEventListener('input',draw);
$('tai-reset')?.addEventListener('click',()=>{base.value='30000';revenue.value='150000';saving.value='5';growth.value='2';draw()});draw();
})();
