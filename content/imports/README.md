# Import pytań z egzaminów

Miejsce pracy nad przenoszeniem pytań z PDF-ów dawnych egzaminów do kolekcji `questions` w Firestore.

## Jak wrzucać materiały

PDF-y (albo DOCX) idą do `pdf/`. Są ignorowane przez gita (`*.pdf` i `content/imports/pdf/*.docx` w `.gitignore`), więc nie trafią do repo — zostają lokalnie jako materiał źródłowy. DOCX jest wygodniejszy niż PDF: tekst wychodzi bez problemów z kodowaniem, a diagramy są osobnymi plikami obrazów.

Przy każdym PDF-ie podaj:

- **klasę** — najniższą klasę sędziowską, na którą jest egzamin: `youth` (młodzieżowa), `III`, `II`, `I`, `national` (państwowa), `FA` albo `IA`
- **rok i typ egzaminu** — do tagów, np. `WP 2021`
- **czy w pliku jest klucz odpowiedzi** — a jeśli tak, na której stronie

## Co powstaje

Jeden plik `<slug-egzaminu>.md` na egzamin, commitowany do repo. To jest ślad audytowy: widać, skąd wzięło się każde pytanie i co zostało odrzucone jako duplikat. Pliki `.md` są źródłem, z którego generowany jest wsad do Firestore — nie edytuj pytań bezpośrednio w bazie, dopóki import trwa.

## Format pliku

Nagłówek pliku:

```markdown
# WP 2021 — Poznań, 21.08.2021

- **Źródło:** `pdf/Poznan_2021-08-21.pdf`
- **Poziom:** NA
- **Tagi:** `["WP", "2021"]`
- **Pytań w PDF:** 23 — nowych 17, duplikatów 4, wariantów do decyzji 2
```

Potem jedno pytanie na sekcję. Blok `yaml` to dokładnie ten dokument, który poleci do Firestore (zgodny z `shared/schemas/question.ts`); tekst wokół niego to metadane importu, które w bazie nie lądują.

````markdown
## 3 — nowe

```yaml
type: single-choice
level: NA
status: draft
tags: [WP, 2021]
diagram:
  kind: fen
  fen: '8/8/5k2/1Q6/1K6/5n2/8/8 w - - 0 1'
content:
  pl:
    stem: |
      W sytuacji widocznej na diagramie, czarnym skończył się czas.
      Jaki będzie wynik partii? Partia rozgrywana tempem 3'+2''.
  en:
    stem: |
      In the position shown, Black's flag has fallen. What is the result?
      The game is played at a time control of 3'+2''.
options:
  - id: a
    content: { pl: 'Wygrana białych', en: 'White wins' }
    isCorrect: true
  - id: b
    content: { pl: 'Remis', en: 'Draw' }
    isCorrect: false
```

- **Źródło:** s. 2, pytanie 3
- **Dedup:** brak podobnych w bazie
- **Pewność:** wysoka — klucz odpowiedzi w PDF, s. 8
````

### Nagłówek sekcji

`## <numer w PDF> — <status importu>`, gdzie status to jedno z:

| Status      | Znaczenie                                                                                                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nowe`      | Nie ma odpowiednika w bazie ani wcześniej w tym imporcie — idzie do Firestore.                                                                                                                                        |
| `duplikat`  | Praktycznie identyczne z istniejącym pytaniem. Nie idzie do bazy. W `Dedup:` podaj id dokumentu.                                                                                                                      |
| `wariant`   | Ten sam temat i inne dane, ale **zmieniające odpowiedź lub sprawdzaną wiedzę**. Czeka na decyzję — nie wrzucam bez potwierdzenia. Warianty różniące się tylko liczbami przy tej samej odpowiedzi idą jako `duplikat`. |
| `odrzucone` | Nie nadaje się do bazy (np. pytanie o lokalny regulamin z konkretnego turnieju). Powód w `Dedup:`.                                                                                                                    |

### Pole „Pewność"

- **wysoka** — poprawna odpowiedź wprost z klucza w PDF.
- **niska** — odpowiedź wywnioskowana z przepisów FIDE, bez klucza. Takie pytania wymagają Twojego potwierdzenia przed publikacją i dostają dopisek w sekcji.

## Ustalenia (2026-09-08)

- **Poziomy wg klasy egzaminu, nie wg nazwy pliku:** egzaminy na klase **okregowa** (WP 2021-2025) -> `level: III`.
  Egzamin na klase **centralna** (WP 2017) -> `level: II`, egzaminy na klase **panstwowa** (PZSzach) -> `level: national`.
  (Do 2026-10-08 poziomy byly tylko `NA`/`FA`/`IA`: `NA` przeszlo na `III`, `FA` na `II` albo `national` wg zrodla.)
- **WP 2017 nie ma zadnych odpowiedzi** — to czysty, niewypelniony arkusz. Odpowiedzi wyprowadzane z przepisow
  FIDE, a uzasadnienie zawsze trafia do `explanation`, zeby dalo sie je zweryfikowac bez siegania do zrodla.
- **Tagi:** `["WP", "<rok>"]` albo `["PZSzach", "<rok>"]` wg nazwy pliku. Pytania z plikow `luzne_*`, ktore nie maja odpowiednika w zadnym egzaminie, ida **bez tagow**. Jesli pytanie wystepuje i w pliku luznym, i w egzaminie, wygrywa wersja z egzaminu (z tagami).
- **PZSzach 2025 to skan wypelnionego arkusza.** Odpowiedz zakreslona kolkiem = poprawna. Jesli kolko jest dodatkowo przekreslone, egzaminator skreslil je blednie i zakreslona odpowiedz nadal jest poprawna. Gdy z tej reguly wychodzi sprzecznosc (np. dwie odpowiedzi w pytaniu jednokrotnego wyboru), pytanie dostaje `Pewnosc: niska` i trafia na liste do decyzji.

- **Klucz odpowiedzi bywa różnie.** Część PDF-ów go zawiera, część nie — dlatego `Pewność` jest oznaczana per pytanie, nie per plik.
- **Warianty tylko wtedy, gdy zmieniają odpowiedź.** Jeśli pytanie różni się od istniejącego wyłącznie liczbami (inne tempo gry, inna liczba posunięć), a rozstrzygnięcie jest identyczne — odrzucam je jako `duplikat` bez pytania. Statusem `wariant` oznaczam tylko te, gdzie zmiana danych zmienia odpowiedź albo sprawdzaną wiedzę (np. lista z **pat** zamiast **mat**). Te trafiają na listę do decyzji i nie idą do bazy automatycznie.
- **Insert od razu po ekstrakcji.** Pytania ze statusem `nowe` lądują w Firestore jako `draft` w tym samym przebiegu co ekstrakcja. Plik `.md` zostaje jako ślad — jeśli coś pójdzie źle, po nim odtwarza się, co zostało wstawione i skąd. Do bazy nie idą pytania oznaczone `wariant`, `duplikat` ani `odrzucone`.
- Po imporcie: pytania z `Pewność: niska` wymagają potwierdzenia odpowiedzi przed zmianą statusu na `published`.

## Zasady

- `status: draft` zawsze. Publikacja to osobna, ręczna decyzja po weryfikacji merytorycznej.
- `content.en` jest wymagane przez schemat (`stem` min. 1 znak), więc każde pytanie dostaje tłumaczenie — baza jest dwujęzyczna w całości.
- `explanation` tylko wtedy, gdy PDF podaje uzasadnienie. Nie dopisuję własnych.
- Pozycje z diagramów zapisywane są jako FEN. Każdy FEN jest renderowany z powrotem na obrazek do wzrokowego sprawdzenia, zanim cokolwiek trafi do bazy — odczyt pozycji z obrazka w PDF bywa zawodny.
