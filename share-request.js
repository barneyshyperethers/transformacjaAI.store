/* Statyczna wysyłka zapytania: poczta użytkownika (mailto) lub WhatsApp.
   Bez serwera, bez SMTP, bez bazy; użytkownik SAM zatwierdza wysłanie wiadomości. */
(() => { 'use strict';
  const c = window.KA_SHOP || {};
  const getEmail = () => String(c.email || '').trim();
  function validEmail(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
  function sendMail(subject,body){
    const dest=getEmail();
    if(!validEmail(dest)) return {ok:false,message:'E-mail sklepu nie został jeszcze ustawiony. Właściciel strony powinien wpisać adres w shop-config.js. Możesz już teraz wysłać zapytanie przez WhatsApp lub pobrać wiadomość .eml.'};
    // Otwiera aplikację pocztową użytkownika. Faktyczna wysyłka nastąpi po kliknięciu "Wyślij" w jego poczcie.
    const link='mailto:'+encodeURIComponent(dest)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    window.location.href=link;
    return {ok:true,message:'Otwieram Twoją aplikację pocztową. Sprawdź treść i odbiorcę, a następnie kliknij „Wyślij”. Jeśli poczta się nie otworzy, pobierz plik .eml lub skopiuj specyfikację.'};
  }
  function sendWhatsApp(subject,body){
    const number=String(c.whatsapp||'').replace(/\D/g,'');
    if(!/^\d{10,15}$/.test(number))return {ok:false,message:'Niepoprawnie ustawiony numer WhatsApp w shop-config.js.'};
    let msg=subject+'\n\n'+body;
    const softLimit=5800;
    if(msg.length>softLimit){
      // WhatsApp potrafi uciąć bardzo długie prefilled messages. Nie wysyłamy po cichu niepełnego zamówienia.
      const ok=window.confirm('Zapytanie jest bardzo długie ('+msg.length+' znaków). Link WhatsApp może nie zmieścić pełnej specyfikacji. Kliknij OK, aby otworzyć WhatsApp z prośbą o pełne dane; następnie użyj przycisku „Kopiuj specyfikację” i wklej całość do rozmowy.');
      if(!ok)return {ok:false,message:'Anulowano. Możesz pobrać pełne zapytanie jako plik .eml albo skopiować jego treść.'};
      msg=subject+'\nDzień dobry, chcę wysłać szczegółowe zapytanie z konfiguratora transformacjaai.store. Pełną specyfikację wkleję w kolejnym komunikacie. Proszę o kontakt.';
    }
    const url='https://wa.me/'+number+'?text='+encodeURIComponent(msg);
    const w=window.open(url,'_blank');
    if(w)w.opener=null;else window.location.href=url;
    return {ok:true,message:'Otworzyłem WhatsApp z przygotowaną treścią. Przejrzyj ją i naciśnij „Wyślij” w WhatsApp — samo otwarcie strony nie wysyła wiadomości.'};
  }
  function downloadEML(subject,body){
    const dest=getEmail();
    const headers=['To: '+(validEmail(dest)?dest:'UZUPELNIJ_ADRES_EMAIL_SKLEPU'), 'Subject: '+subject,'MIME-Version: 1.0','Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: 8bit'];
    const blob=new Blob([headers.join('\r\n')+'\r\n\r\n'+body.replace(/\n/g,'\r\n')],{type:'message/rfc822'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='zapytanie-transformacjaAI-store.eml';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
    return {ok:true,message:'Pobrano gotową wiadomość .eml. Otwórz ją w programie pocztowym, sprawdź adres odbiorcy i kliknij „Wyślij”.'};
  }
  window.KA_SHARE=Object.freeze({sendMail,sendWhatsApp,downloadEML,validEmail, getEmail});
})();
