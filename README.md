# TransformacjaAI.store — gotowa statyczna witryna (2026)

## Co jest w paczce?

Nowa strona WWW **TransformacjaAI.store** w stylistyce **Modern Executive**. Bazuje na ostatniej statycznej wersji krawcowieai.fit i treści z przesłanego przez użytkownika `index.html` o rynku i transformacji AI.

- `index.html` — nowa strona główna, **80 modułów, 13 kategorii**, wybór pakietów, izometryczna mapa firmy, koszyk, formularz kontaktowy, cztery warianty wejścia w AI, sekcje o rynku i transformacji, kalkulator.
- `rynek-ai.html` — **nowa rozbudowana podstrona** rynku i trendów 2025–2026: Eurostat, PARP, McKinsey, zmiana workflow, porównanie do fotowoltaiki, kalkulator scenariusza, źródła.
- `imim.html` — IMIM / Smart City dla gmin.
- `logistyka.html`, `spedycja.html`, `moje-dziedzictwo.html` — branżowe konfiguratory i koszyki.
- `szkolenia.html` — warsztaty dla budownictwa, hoteli, szpitali i gmin, z osobnym formularzem.
- `grafik-dyzurow.html` — demonstrator planowania dyżurów szpitalnych, nie system produkcyjny.
- `polityka-prywatnosci.html` — **szablon wymagający uzupełnienia przez administratora danych**.
- `assets/` — materiały graficzne, w tym grafiki otrzymane z poprzedniej wersji. Wybrane ilustracje zostały oznaczone nowym logo.
- `shop-config.js` — **adres e-mail i WhatsApp sklepu**, ustawione bez potrzeby PHP.
- `transformacja.css`, `transformacja.js`, `rynek-ai.css` — nowa warstwa strony i kalkulator.

## Jak opublikować?

1. Rozpakuj ZIP; prześlij **zawartość folderu `transformacjaai.store/`**, nie sam folder, do katalogu domeny na hostingu (`public_html`, `www` itd.).
2. Otwórz `https://transformacjaai.store/` (po podpięciu domeny). Możesz też otworzyć `index.html` lokalnie, ale niektóre ograniczenia bezpieczeństwa przeglądarek mogą wpływać na pamięć lokalną w trybie `file://`.
3. W `shop-config.js` ustawione są:
   - e-mail odbierający zapytania: **barnabapawelczak@gmail.com** (nowy adres sklepu),
   - WhatsApp: **+48 502 468 073**.
4. **Przed publikacją** uzupełnij `polityka-prywatnosci.html`: dane administratora, kontakt, retencję zgłoszeń i kwestie ochrony danych. To nie jest gotowa polityka prawna.
5. Wykonaj testowe zapytanie: wybierz moduły, wpisz dane, otwórz klienta e-mail lub WhatsApp i samodzielnie wyślij wiadomość.

## Jak działa formularz?

Nie ma PHP, MySQL ani backendu formularza. Informacje o firmie i preferencjach pozostają w przeglądarce podczas komponowania zapytania, a następnie przyciski otwierają lokalny klient pocztowy (`mailto:`) lub WhatsApp (`https://wa.me/48502468073`) z gotową wiadomością. **Klient musi sam potwierdzić wysłanie**. Alternatywnie może pobrać plik `.eml` z pełnym zapytaniem. Nie ma automatycznego zapisu leadów do bazy.

W przypadku rozbudowanego koszyka klient może musieć skorzystać z `.eml` lub skopiować treść ze względu na ograniczenia długości linków i komunikatorów.

## Liczby, wycena i bezpieczeństwo

- Informacje rynkowe z przesłanego `index.html` zostały zredagowane i opisane przez odniesienie do konkretnych źródeł; różne populacje badane **nie są bezpośrednio porównywalne**.
- Kalkulator przedstawia wyłącznie **hipotetyczne scenariusze**, a nie wyniki możliwe do zagwarantowania.
- Ceny pakietów AI Start / AI Business / AI Operating System „od” pochodzą z dostarczonej koncepcji. Nie stanowią wyceny 80 modułów i wymagają potwierdzenia zakresu i VAT.
- Opisy modułów IMIM, systemu szpitalnego i avatara AI są ofertowo-koncepcyjne. Zastosowania produkcyjne wymagają oceny wymagań prawnych, technicznych i bezpieczeństwa.

## Testy

Zweryfikowano syntaktycznie JavaScript, odnośniki do plików i działanie podstawowych interakcji w przeglądarce z zasobami osadzonymi lokalnie: renderowanie **80 modułów**, wczytywanie zestawu hotelowego (7 wybranych modułów), synchronizacja formularza, menu mobilne, kalkulator oraz brak poziomego przewijania w układzie 390 px. Pełnej dostawy e-mail i wiadomości WhatsApp nie można potwierdzić bez ich rzeczywistego wysłania przez użytkownika.

