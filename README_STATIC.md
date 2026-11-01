# transformacjaai.store — STATYCZNY SKLEP, bez PHP i MySQL

## Jak opublikować

1. Rozpakuj paczkę i prześlij **wszystkie pliki oraz katalog assets/** na zwykły hosting statyczny (np. folder public_html, Netlify, GitHub Pages) — nie potrzeba PHP ani MySQL.
2. Adres zamówień **barnabapawelczak@gmail.com** i numer WhatsApp **+48 502 468 073** są już ustawione w `shop-config.js`. Zmień je tylko, jeżeli dane kontaktowe sklepu się zmienią.
3. Otwórz `index.html` (także lokalnie: dwuklik na plik) i przetestuj koszyk, pola firmy, NIP, wysyłkę przez e-mail i WhatsApp.
4. Uzupełnij `polityka-prywatnosci.html` o rzeczywiste dane administratora, kontakt i okresy przechowywania otrzymanej korespondencji. Obecna wersja jest szablonem, nie gotową poradą prawną.

## Jak działa wysyłka

- **E-mail:** otwiera program pocztowy odwiedzającego z uzupełnionym adresatem, tematem i pełną treścią formularza. Klient musi sam kliknąć „Wyślij”. Nie działa automatyczna wysyłka e-mail i nie ma serwera SMTP.
- **WhatsApp:** otwiera rozmowę z numerem **+48 502 468 073** z wygenerowaną wiadomością. Klient musi nacisnąć przycisk wysyłania w WhatsApp.
- **Długi koszyk:** bardzo długie wiadomości WhatsApp mogą być ograniczane przez aplikację. Witryna ostrzeże i poprosi o skopiowanie pełnej specyfikacji i wklejenie jej do rozmowy.
- **Plik .eml:** użytkownik może pobrać pełną wiadomość, otworzyć w swoim programie pocztowym i wysłać ręcznie; przed wysyłką należy sprawdzić odbiorcę.
- **Kopiowanie:** dostępny jest podgląd i kopiowanie pełnej specyfikacji.
- **Szkolenia:** formularz na `szkolenia.html` obsługuje te same trzy kanały. Wszystkie pakiety i konfigurator zachowano.

## Prywatność

Formularze nie wysyłają nic na serwer WWW i nie zapisują w bazie. Wybrane identyfikatory modułów i nazwa pakietu mogą być zapamiętywane **lokalnie w przeglądarce** za pomocą localStorage, by ułatwić przejście między podstronami. Dane kontaktowe wypełnione w formularzu nie są zapisywane przez stronę. Jeśli klient wybierze zewnętrzny kanał poczty lub WhatsApp, dane podlegają warunkom tego dostawcy. Nie wpisuj haseł, danych pacjentów ani szczegółów spraw urzędowych.

## Ważne ograniczenie

Bez backendu właściciel sklepu **nie otrzyma** danych, dopóki użytkownik nie zatwierdzi ich wysłania we własnej aplikacji e-mail/WhatsApp. Na stronie nie ma mechanizmu automatycznego potwierdzania doręczenia ani zbierania statystyk konwersji z formularza.
