# Warianty pytań do egzaminu próbnego WP 2026

Pytania z WP 2025 ze zmienionym tempem gry albo materiałem na szachownicy — tak, żeby zmieniła się poprawna
odpowiedź. To **nie są** pytania z żadnego egzaminu, więc nie mają `sources` i nie trafiają do archiwum. Tag:
`wariant`. Status: `draft` — przed publikacją wymagają przeglądu jak każde inne pytanie.

Każdy wariant to nowy dokument; oryginał zostaje bez zmian. Uzasadnienia mówią wprost, czym wariant różni się od
oryginału i dlaczego odpowiedź jest inna — porównanie obu wersji to dobry materiał do nauki.

Egzamin próbny z tymi wariantami: `exams/JlZxylRZc4SFLaXZmT92` (28 pytań, układ WP 2025, w tym 5 pytań z PZSzach 2026).

Tezy szachowe sprawdzone silnikiem (python-chess): K+G nie zamatuje K+W w żadnej pozycji (przegląd wszystkich
pozycji matowych), przy gońcach różnopolowych mat istnieje (np. `8/8/8/8/8/8/6Bb/5K1k b`).

## WP 2025 #7 — wariant

```yaml
content:
  pl:
    stem: Partia rozgrywana tempem 3'+2''. Zawodnik grający białymi wykonał posunięcie, zatrzymał zegar i reklamuje sędziemu pojawienie się po raz trzeci tej samej pozycji. Jaka powinna być decyzja sędziego?
    explanation: Remis z powodu trzykrotnego powtórzenia pozycji może reklamować tylko zawodnik będący na posunięciu — przed wykonaniem ruchu, zapisując go na blankiecie (art. 9.2). Biały najpierw zagrał, więc reklamacja jest złożona nieprawidłowo i sędzia ją odrzuca, nie badając zapisu. Za nieuzasadnioną reklamację przeciwnik dostaje bonifikatę (art. 9.5.3) — w szachach błyskawicznych (3 + 2 = 5 minut) jest to jedna minuta zamiast dwóch (Aneks B.2, który obejmuje kary z art. 7 i 9).
  en:
    stem: The game is played at 3'+2''. The player with the white pieces has made a move, stopped the clock and claims to the arbiter that the same position has appeared for the third time. What should the arbiter decide?
    explanation: A draw by threefold repetition can be claimed only by the player having the move — before making it, by writing it on the scoresheet (Art. 9.2). White moved first, so the claim is improperly made and the arbiter rejects it without examining the score. For an unjustified claim the opponent receives extra time (Art. 9.5.3) — in blitz (3 + 2 = 5 minutes) one minute instead of two (Appendix B.2, which covers the penalties of Arts. 7 and 9).
level: NA
status: draft
type: single-choice
options:
  - id: a
    content:
      pl: odrzucenie reklamacji i dodanie przeciwnikowi 2 min
      en: reject the claim and add 2 minutes to the opponent
    isCorrect: false
  - id: b
    content:
      pl: odrzucenie reklamacji i dodanie przeciwnikowi 1 min
      en: reject the claim and add 1 minute to the opponent
    isCorrect: true
  - id: c
    content:
      pl: weryfikacja, czy rzeczywiście pozycja pojawiła się po raz trzeci i dopiero wtedy podjęcie decyzji o odrzuceniu lub przyjęciu reklamacji. Jeśli reklamacja jest odrzucona przeciwnik otrzymuje bonifikatę 1 min
      en: check whether the position really occurred for the third time and only then uphold or reject the claim; if rejected, the opponent receives 1 minute
    isCorrect: false
  - id: d
    content:
      pl: weryfikacja, czy rzeczywiście pozycja pojawiła się po raz trzeci i dopiero wtedy podjęcie decyzji o odrzuceniu lub przyjęciu reklamacji. Jeśli reklamacja jest odrzucona przeciwnik otrzymuje bonifikatę 2 min
      en: check whether the position really occurred for the third time and only then uphold or reject the claim; if rejected, the opponent receives 2 minutes
    isCorrect: false
topic: art-09-partia-remisowa
tags:
  - wariant
```

- **Oryginał:** `R1Y1GiI0ModbIraCxu8M` (WP 2025 #7) — bez zmian
- **Id wariantu:** `OTu06aMkvxMOFCmjAvzv` (wstawione 2026-10-06)
- **Zmiana:** tempo 30'+30'' → 3'+2''
- **Odpowiedź:** a) odrzucenie i 2 minuty → **b) odrzucenie i 1 minuta (art. 9.5.3 w związku z Aneksem B.2)**

## WP 2025 #9 — wariant

```yaml
content:
  pl:
    stem: Partia rozgrywana tempem 10'+5''. Po wykonaniu 11 posunięć przez obu zawodników biały reklamuje sędziemu, że jego goniec i skoczek są zamienione miejscami, i chciałby poprawić ich ustawienie. Jak powinien postąpić arbiter?
    explanation: "Tempo 10'+5'' to 10 + 5 = 15 minut, czyli szachy szybkie. Gdy obaj zawodnicy zakończyli po 10 posunięć, reklamacji dotyczących nieprawidłowego ustawienia bierek nie uwzględnia się (Aneks A.4.1.2) — partia toczy się dalej z zamienionymi figurami. W szachach standardowych byłoby inaczej: niewłaściwa pozycja początkowa unieważnia partię bez względu na liczbę posunięć (art. 7.2.1). Odpowiedź zakłada typowe warunki turnieju szybkiego, czyli Aneks A.4, a nie A.3 (jeden sędzia na najwyżej trzy partie i pełny zapis)."
  en:
    stem: A game played at 10'+5''. After both players have made 11 moves, White tells the arbiter that his bishop and knight have been swapped and asks to correct their position. What should the arbiter do?
    explanation: "10'+5'' means 10 + 5 = 15 minutes, i.e. rapid. Once both players have completed 10 moves, no claim about an incorrect set-up of the pieces can be upheld (Appendix A.4.1.2) — play continues with the pieces swapped. Standard play is different: an incorrect initial position annuls the game however many moves have been played (Art. 7.2.1). The answer assumes a typical rapid event, i.e. Appendix A.4 rather than A.3 (one arbiter per at most three games and every game recorded)."
level: NA
status: draft
type: single-choice
options:
  - id: a
    content:
      pl: dodać dwie minuty czarnym i nakazać dalszą grę
      en: add two minutes to Black and let play continue
    isCorrect: false
  - id: b
    content:
      pl: dodać minutę czarnym i nakazać dalszą grę
      en: add one minute to Black and let play continue
    isCorrect: false
  - id: c
    content:
      pl: nakazać dalszą grę bez żadnych konsekwencji z racji przekroczenia 10 posunięć przez obie strony
      en: let play continue without any consequences, as both players have completed more than 10 moves
    isCorrect: true
  - id: d
    content:
      pl: zezwolić na poprawienie figur i nakazać dalszą grę
      en: allow the pieces to be corrected and let play continue
    isCorrect: false
  - id: e
    content:
      pl: unieważnić partię i nakazać jej rozpoczęcie od nowa
      en: annul the game and order it to be replayed
    isCorrect: false
topic: art-07-nieprawidlowosci
tags:
  - wariant
```

- **Oryginał:** `4GyMOtHNllHD5PPbCrS0` (WP 2025 #9) — bez zmian
- **Id wariantu:** `3mi8siX7VdAOpCZvUmJ2` (wstawione 2026-10-06)
- **Zmiana:** tempo 30'+30'' → 10'+5''
- **Odpowiedź:** e) unieważnić partię → **c) grać dalej bez konsekwencji (A.4.1.2)**

## WP 2025 #14 — wariant

```yaml
type: single-choice
level: NA
status: draft
tags:
  - wariant
content:
  pl:
    stem: "Partia rozgrywana tempem 90'+30''. Biały wykonuje nieprawidłowy ruch (stawia skoczka z pola f3 na pole f5), po czym przełącza zegar. Czarny nie zauważa błędu i odpowiada własnym posunięciem. Po trzech kolejnych ruchach obu stron Czarny dostrzega nieprawidłowość i woła sędziego. Sędzia:"
    explanation: "Tempo 90'+30'' to szachy standardowe, a w nich nieprawidłowe posunięcie można skorygować bez względu na to, ile posunięć minęło: przywraca się pozycję sprzed nieprawidłowości (art. 7.5.1), a za pierwsze nieprawidłowe posunięcie przeciwnik dostaje dwie minuty (art. 7.5.5). Biały dotknął skoczka, więc w przywróconej pozycji musi wykonać nim prawidłowe posunięcie, jeśli takie istnieje (art. 7.5.1 w związku z art. 4.3). Gdyby była to partia szachów szybkich, nieprawidłowe posunięcie zostałoby w mocy, bo przeciwnik zdążył już zagrać (Aneks A.4.2)."
  en:
    stem: "A game played at 90'+30''. White makes an illegal move (placing the knight from f3 on f5) and presses the clock. Black does not notice and replies with a move of their own. After three further moves by each side, Black spots the irregularity and calls the arbiter. The arbiter:"
    explanation: "90'+30'' is standard play, where an illegal move can be corrected however many moves have passed: the position before the irregularity is restored (Art. 7.5.1) and the opponent receives two minutes for the first illegal move (Art. 7.5.5). White touched the knight, so in the restored position they must make a legal move with it if there is one (Art. 7.5.1 read with Art. 4.3). In rapid the illegal move would stand, because the opponent has already moved (Appendix A.4.2)."
options:
  - id: a
    content:
      pl: nakazuje cofnięcie do pozycji sprzed nieprawidłowego ruchu białego
      en: orders the position before White's illegal move to be restored
    isCorrect: false
  - id: b
    content:
      pl: nakazuje dalszą grę
      en: lets play continue
    isCorrect: false
  - id: c
    content:
      pl: dodaje Czarnym 2 minuty i nakazuje cofnięcie pozycji sprzed nieprawidłowości
      en: adds 2 minutes to Black and orders the position before the irregularity to be restored
    isCorrect: true
  - id: d
    content:
      pl: orzeka remis
      en: declares a draw
    isCorrect: false
  - id: e
    content:
      pl: po konsultacji z Białym ustala, że intencją było ustawienie skoczka na polu g5 i nakazuje przesunięcie skoczka na to pole oraz kontynuowanie gry
      en: after consulting White, establishes that the intention was to place the knight on g5, orders the knight moved there and play to continue
    isCorrect: false
topic: art-07-nieprawidlowosci
```

- **Oryginał:** `6SL8Yzzsa8aHKd1dMicr` (WP 2025 #14) — bez zmian
- **Id wariantu:** `92gIIBd7unNhxOtOSPDd` (wstawione 2026-10-06)
- **Zmiana:** tempo 15'+10'' → 90'+30''; opcja c: 1 min → 2 min
- **Odpowiedź:** b) dalsza gra → **c) cofnięcie pozycji i 2 minuty dla Czarnych (art. 7.5.1, 7.5.5)**

## WP 2025 #19 — wariant

```yaml
type: single-choice
level: NA
status: draft
tags:
  - wariant
diagram:
  kind: fen
  fen: 1r2k3/p6p/4pp2/5P2/6P1/1P6/P3R1K1/8 b - - 0 1
content:
  pl:
    stem: Partia rozgrywana tempem 90'+30''. W pozycji na diagramie Czarny wykonał bicie pionkiem 1…e:f5. Biały dotknął pionka g4 z zamiarem odbicia pionka na f5, jednak wcześniej zauważył nieprawidłowość. Zawodnicy proszą o interwencję sędziego. Co powinien zrobić sędzia?
    explanation: "Bicie e6:f5 odsłania linię „e”, na której stoi biała wieża z e2 — czarny król na e8 znalazłby się w szachu, więc było to nieprawidłowe posunięcie. Dotknięcie pionka g4 przez Białego nie odbiera mu prawa do reklamacji: art. 4.8 dotyczy tylko naruszeń art. 4.1–4.7, a nieprawidłowe posunięcie to art. 3 i 7. Pozycję cofa się sprzed ruchu Czarnego (art. 7.5.1), a ponieważ tempo 90'+30'' to szachy standardowe, Biały otrzymuje dwie minuty (art. 7.5.5) — w szachach szybkich byłaby to jedna minuta."
  en:
    stem: A game played at 90'+30''. In the position shown Black captured with the pawn 1…exf5. White touched the pawn on g4 intending to recapture on f5, but first noticed an irregularity. The players ask the arbiter to intervene. What should the arbiter do?
    explanation: "The capture exf5 opens the e-file, where the white rook stands on e2 — the black king on e8 would be in check, so the move was illegal. White touching the g4 pawn does not cost them the right to claim: Art. 4.8 covers only breaches of Arts. 4.1–4.7, whereas an illegal move falls under Arts. 3 and 7. The position before Black's move is restored (Art. 7.5.1), and since 90'+30'' is standard play, White receives two minutes (Art. 7.5.5) — in rapid it would be one minute."
options:
  - id: a
    content:
      pl: odrzucić reklamację z racji dotknięcia bierki
      en: reject the claim because a piece was touched
    isCorrect: false
  - id: b
    content:
      pl: odrzucić reklamację z racji dotknięcia bierki i przyznać przeciwnikowi dwie minuty czasu
      en: reject the claim because a piece was touched and award the opponent two minutes
    isCorrect: false
  - id: c
    content:
      pl: odrzucić reklamację z racji dotknięcia bierki i przyznać przeciwnikowi jedną minutę czasu
      en: reject the claim because a piece was touched and award the opponent one minute
    isCorrect: false
  - id: d
    content:
      pl: cofnąć pozycję sprzed ruchu czarnych i dodać białemu jedną minutę
      en: restore the position before Black's move and add one minute to White
    isCorrect: false
  - id: e
    content:
      pl: cofnąć pozycję sprzed ruchu czarnych i dodać białemu dwie minuty
      en: restore the position before Black's move and add two minutes to White
    isCorrect: true
  - id: f
    content:
      pl: orzec remis
      en: declare a draw
    isCorrect: false
topic: art-04-wykonywanie-posuniec
```

- **Oryginał:** `XhAHvorEM4RRluvXL9UJ` (WP 2025 #19) — bez zmian
- **Id wariantu:** `q97ntHsjZhPCInAZIsv0` (wstawione 2026-10-06)
- **Zmiana:** szachy szybkie → tempo 90'+30''
- **Odpowiedź:** d) cofnąć i 1 minuta dla Białego → **e) cofnąć i 2 minuty dla Białego (art. 7.5.5)**

## WP 2025 #20 — wariant

```yaml
type: single-choice
level: NA
status: draft
tags:
  - wariant
diagram:
  kind: fen
  fen: 8/4k3/8/3K2b1/2R5/8/8/8 w - - 0 1
content:
  pl:
    stem: Szachy szybkie. W pozycji na diagramie zawodnikowi grającemu białymi skończył się czas. Czy sędzia powinien zainterweniować?
    explanation: 'Przekroczenie czasu oznacza przegraną tylko wtedy, gdy przeciwnik może zamatować jakąkolwiek serią prawidłowych posunięć (art. 6.9). Król z gońcem nie zamatuje króla z wieżą: nawet gdy biała wieża zablokuje własnemu królowi pole ucieczki, zawsze może zbić gońca albo zasłonić się przed szachem. Partia kończy się więc remisem. Ze skoczkiem zamiast gońca mat byłby możliwy, bo szacha od skoczka nie da się zasłonić. W szachach szybkich sędzia sygnalizuje opadnięcie chorągiewki z urzędu (Aneks A.4.5).'
  en:
    stem: Rapid chess. In the position shown, White has run out of time. Should the arbiter intervene?
    explanation: "Running out of time loses only if the opponent can checkmate by some series of legal moves (Art. 6.9). King and bishop cannot mate king and rook: even when the white rook blocks its own king's flight square, it can always capture the bishop or interpose against the check. The game is therefore drawn. With a knight instead of a bishop mate would be possible, because a knight check cannot be blocked. In rapid the arbiter calls a flag fall on their own initiative (Appendix A.4.5)."
options:
  - id: a
    content:
      pl: sędzia nie może interweniować w danej sytuacji
      en: the arbiter may not intervene in this situation
    isCorrect: false
  - id: b
    content:
      pl: sędzia powinien zainterweniować i orzec remis w tej partii
      en: the arbiter should intervene and declare the game drawn
    isCorrect: true
  - id: c
    content:
      pl: sędzia powinien zainterweniować i orzec wygraną czarnych
      en: the arbiter should intervene and declare a win for Black
    isCorrect: false
  - id: d
    content:
      pl: sędzia powinien zainterweniować i orzec wygraną białych
      en: the arbiter should intervene and declare a win for White
    isCorrect: false
topic: art-06-zegar-szachowy
```

- **Oryginał:** `D0A3cKY7IbtaHvM1rUtH` (WP 2025 #20) — bez zmian
- **Id wariantu:** `LjQ7MfbMsJloiAsjhsei` (wstawione 2026-10-06)
- **Zmiana:** na diagramie czarny skoczek g5 → czarny goniec g5
- **Odpowiedź:** c) wygrana czarnych → **b) remis (K+G nie zamatuje K+W — sprawdzone przeglądem wszystkich pozycji matowych)**

## WP 2025 #23 — wariant

```yaml
type: open-ended
level: NA
status: draft
tags:
  - wariant
topic: art-07-nieprawidlowosci
modelAnswer:
  en: |-
    First intervention: this is not an illegal move, because the clock was not pressed, but White had no right to take the pawn back from e4. A player who has placed a piece on a square and released it may not move it to another square on that move (Art. 4.7). The arbiter therefore orders the pawn to stay on e4, takes back d2-d4 and warns White (Art. 12.9.1). Play continues as 1.e4, and the clocks are not adjusted, because no move was completed.

    Second intervention: 20'+10'' means 20 + 10 = 30 minutes, i.e. rapid. Black claimed the illegal move before making their own, so the claim stands (Appendix A.4.2). It is the first illegal move of the game: the arbiter restores the position before it (Art. 7.5.1) and adds one minute to Black — the rapid bonus since 1 January 2023 (Art. 7.5.5). The touch-move rule applies to the replacement move. Play continues; a loss would only follow a second illegal move by the same player.
  pl: |-
    Pierwsza interwencja: to nie jest nieprawidłowe posunięcie, bo zegar nie został przełączony, ale biały nie miał prawa cofnąć pionka z e4. Zawodnik, który postawił bierkę na polu i odjął od niej rękę, nie może w tym posunięciu przestawić jej na inne pole (art. 4.7). Sędzia nakazuje więc pozostawić pionka na e4, cofa posunięcie d2-d4 i udziela białemu ostrzeżenia (art. 12.9.1). Partia toczy się dalej jako 1.e4, a czasów nie koryguje się, bo żadne posunięcie nie zostało zakończone.

    Druga interwencja: tempo 20'+10'' to 20 + 10 = 30 minut, czyli szachy szybkie. Czarny zgłosił nieprawidłowe posunięcie, zanim wykonał własne, więc reklamacja jest skuteczna (Aneks A.4.2). To pierwsze nieprawidłowe posunięcie w tej partii: sędzia przywraca pozycję sprzed niego (art. 7.5.1) i dodaje czarnemu jedną minutę — od 01.01.2023 tyle wynosi bonifikata w szachach szybkich (art. 7.5.5). Do posunięcia zastępującego stosuje się zasadę dotkniętej bierki. Partia toczy się dalej; orzeczenie przegranej należałoby się dopiero za drugie nieprawidłowe posunięcie tego samego zawodnika.
content:
  en:
    stem: |-
      A game played at 20'+10''. Starting from the initial position the following happened in order:
      – on move one White played the pawn e2-e4 without pressing the clock, then after a moment's thought put the pawn back on e2 and played d2-d4;
      – Black stopped the clock and asked for the arbiter;
      – on move seven White made an illegal move;
      – Black stopped the clock again and asked for the arbiter a second time.
      Write what decisions the arbiter should take and what the state of the game is after those interventions.
    explanation: 'The first incident is settled by Art. 4.7: the pawn released on e4 must stay there, so a warning alone is not enough — the arbiter also takes back d2-d4. For the second incident the time control decides: 20 + 60 × 10 s = 30 minutes, i.e. rapid, where the first illegal move earns the opponent one minute, not two. The claim must also come before the claimant makes their own move (Appendix A.4.2).'
  pl:
    stem: |-
      Partia rozgrywana tempem 20'+10''. Poczynając od pozycji początkowej nastąpiły kolejno następujące wydarzenia:
      – w pierwszym ruchu Biały wykonał posunięcie pionkiem e2-e4 bez przełączenia zegara, po chwili zastanowienia cofnął pionka na pole e2 i wykonał posunięcie pionkiem d2-d4;
      – Czarny zatrzymał zegar i poprosił o interwencję sędziego;
      – w siódmym ruchu Biały wykonał nieprawidłowe posunięcie;
      – Czarny ponownie zatrzymał zegar i poprosił o drugą interwencję sędziego.
      Napisz, jakie decyzje powinien podjąć sędzia oraz jaki jest stan partii po interwencjach sędziego.
    explanation: 'Pierwsze zdarzenie rozstrzyga art. 4.7: pionek odstawiony na e4 musi tam zostać, więc samo ostrzeżenie nie wystarczy — sędzia cofa też d2-d4. Przy drugim zdarzeniu liczy się rodzaj tempa: 20 + 60 × 10 s = 30 minut, czyli szachy szybkie, w których za pierwsze nieprawidłowe posunięcie przeciwnik dostaje minutę, a nie dwie. Reklamacja musi przy tym paść, zanim reklamujący wykona własne posunięcie (Aneks A.4.2).'
```

- **Oryginał:** `yjIFlpP2iXIrBURAtdEP` (WP 2025 #23) — bez zmian
- **Id wariantu:** `0aSWa9PQFMxkwbcWD9Y0` (wstawione 2026-10-06)
- **Zmiana:** tempo 45'+15'' → 20'+10''
- **Odpowiedź:** 2 minuty dla Czarnego → **1 minuta dla Czarnego (szachy szybkie, art. 7.5.5; reklamacja w terminie z A.4.2)**

## WP 2025 #25 — wariant

```yaml
type: single-choice
level: NA
status: draft
tags:
  - wariant
content:
  pl:
    stem: "Partia jest rozgrywana tempem 90'+30''. Jeżeli sędzia zobaczy, że po zakończonym posunięciu (zegar został przełączony) biały pionek stoi na polu promocji:"
    explanation: 'W szachach standardowych nie ma przepisu każącego sędziemu czekać do kolejnego posunięcia — to rozwiązanie z Aneksu A.4.4, obowiązujące tylko w szachach szybkich i błyskawicznych. Pozostawienie pionka na polu promocji i przełączenie zegara to nieprawidłowe posunięcie: pionka zamienia się na hetmana tego samego koloru (art. 7.5.2), a przeciwnik za pierwsze nieprawidłowe posunięcie dostaje dwie minuty (art. 7.5.5), po czym gra toczy się dalej.'
  en:
    stem: "A game is played at 90'+30''. If the arbiter sees that, after a completed move (the clock has been pressed), a white pawn is standing on the promotion square:"
    explanation: 'Standard play has no rule telling the arbiter to wait for the next move — that comes from Appendix A.4.4, which applies only to rapid and blitz. Leaving the pawn on the promotion square and pressing the clock is an illegal move: the pawn is replaced by a queen of the same colour (Art. 7.5.2), the opponent receives two minutes for the first illegal move (Art. 7.5.5), and play continues.'
options:
  - id: a
    content:
      pl: orzeka remis
      en: the arbiter declares a draw
    isCorrect: false
  - id: b
    content:
      pl: powinien zaczekać z decyzją do czasu zakończenia następnego posunięcia
      en: the arbiter should wait with the decision until the next move has been completed
    isCorrect: false
  - id: c
    content:
      pl: powinien zamienić pionka na białego hetmana, skorygować czas i nakazać dalszą grę
      en: the arbiter should replace the pawn with a white queen, adjust the clock and let play continue
    isCorrect: true
topic: art-04-wykonywanie-posuniec
```

- **Oryginał:** `vwUnXs0dlVjaCMBgNPjY` (WP 2025 #25) — bez zmian
- **Id wariantu:** `lc7hVagcfgfeHw4rwKHb` (wstawione 2026-10-06)
- **Zmiana:** tempo 3'+2'' → 90'+30''; doprecyzowane, że zegar przełączono
- **Odpowiedź:** b) zaczekać do zakończenia następnego posunięcia (A.4.4) → **c) zamienić na hetmana, skorygować czas (art. 7.5.2, 7.5.5)**

## WP 2025 #27 — wariant

```yaml
type: single-choice
level: NA
status: draft
tags:
  - wariant
content:
  pl:
    stem: "Partia rozgrywana tempem 15'+10''. Sędzia obserwuje 3 ostatnie partie i dostrzega, że na jednej z nich zawodnicy grają końcówkę, w której każda ze stron ma na szachownicy po 2 figury: białe — króla i białopolowego gońca, czarne — króla i czarnopolowego gońca. Jak powinien zareagować sędzia?"
    explanation: Martwa pozycja to taka, w której żaden zawodnik nie może dać mata żadną serią prawidłowych posunięć (art. 5.2.2). Przy gońcach jednopolowych tak jest, ale przy różnopolowych mat jest możliwy — choćby czarny król na h1 zablokowany własnym gońcem z h2, biały król na f1 i biały goniec dający mata z g2. Pozycja nie jest więc martwa i partia toczy się dalej. Liczenie posunięć pod kątem reguły 50 posunięć należy do zawodników (art. 11.12), a nie do sędziego.
  en:
    stem: "A game played at 15'+10''. The arbiter is watching the last 3 games and notices that in one of them the players are playing an ending in which each side has 2 pieces: White a king and a light-squared bishop, Black a king and a dark-squared bishop. How should the arbiter react?"
    explanation: A dead position is one where neither player can mate by any series of legal moves (Art. 5.2.2). That holds with bishops on the same colour, but with opposite-coloured bishops mate is possible — for instance Black's king on h1 blocked by its own bishop on h2, White's king on f1 and White's bishop mating from g2. So the position is not dead and play continues. Counting moves for the 50-move rule is the players' job (Art. 11.12), not the arbiter's.
options:
  - id: a
    content:
      pl: nie interweniować i dalej obserwować wszystkie partie
      en: not intervene and carry on watching all the games
    isCorrect: true
  - id: b
    content:
      pl: odłożyć obserwację dwóch pozostałych partii i rozpocząć liczenie posunięć w przytoczonej końcówce
      en: set aside the other two games and start counting moves in that ending
    isCorrect: false
  - id: c
    content:
      pl: zainterweniować i przerwać partię
      en: intervene and stop the game
    isCorrect: false
topic: art-05-zakonczenie-partii
```

- **Oryginał:** `3rpfUIhUNmFpcfRWeOQn` (WP 2025 #27) — bez zmian
- **Id wariantu:** `NuXDM6llKWceb5650Yp4` (wstawione 2026-10-06)
- **Zmiana:** gońce jednopolowe → różnopolowe
- **Odpowiedź:** c) przerwać partię (martwa pozycja) → **a) nie interweniować (mat możliwy — sprawdzone)**

# Druga partia (2026-10-07): zmienione pozycje i szczegóły

Na prośbę właściciela egzamin próbny ma się różnić od zeszłorocznego w około dwóch trzecich pytań. Doszło 7 kolejnych pytań z WP 2025 i 5 lekko zmienionych z PZSzach 2026 — pozycje odbite lub nowe, inne tempo, inne liczby posunięć. Wszystkie pozycje sprawdzone silnikiem.

## WP 2025 #2 — wariant

```yaml
level: NA
status: draft
type: open-ended
topic: art-07-nieprawidlowosci
modelAnswer:
  pl: Partię należy rozpocząć od nowa właściwymi kolorami. Obaj zawodnicy wykonali mniej niż 10 posunięć, a wtedy partię rozgrywa się od nowa z prawidłowymi kolorami (art. 7.3). Dopiero od 10 posunięć partia toczyłaby się dalej.
  en: The game must be restarted with the correct colours. Both players have made fewer than 10 moves, and in that case the game is replayed with the right colours (Art. 7.3). Only from 10 moves on would the game continue.
content:
  pl:
    stem: Partia rozgrywana tempem 15'+10''. Podczas trwania rundy jeden z zawodników zgłasza sędziemu, że gra niewłaściwym kolorem. Po przyjściu do szachownicy okazuje się, że zawodnicy wykonali po 8 posunięć. Jaka będzie decyzja sędziego?
    explanation: 'Granicą jest 10 posunięć wykonanych przez obu zawodników: poniżej niej partię zaczyna się od nowa właściwymi kolorami, od niej wzwyż — kontynuuje (art. 7.3). Przepis nie zależy od rodzaju tempa, więc obowiązuje tak samo w szachach szybkich.'
  en:
    stem: A game played at 15'+10''. During the round one of the players tells the arbiter that they are playing with the wrong colour. When the arbiter comes to the board it turns out that each player has made 8 moves. What is the arbiter's decision?
    explanation: 'The threshold is 10 moves by both players: below it the game is restarted with the correct colours, from it on the game continues (Art. 7.3). The rule does not depend on the time control, so it applies in rapid as well.'
tags:
  - wariant
```

- **Oryginał:** `raQmiWYPp4ziOtUEPu0h` (WP 2025 #2) — bez zmian
- **Id wariantu:** `3RjtK2EcdARCTKuzs5AA` (wstawione 2026-10-07)
- **Zmiana:** tempo 60'+30'' → 15'+10''; po 14 → po 8 posunięć
- **Odpowiedź:** kontynuować partię → **rozpocząć od nowa właściwymi kolorami (art. 7.3)**

## WP 2025 #4 — wariant

```yaml
content:
  pl:
    stem: "Partia grana tempem 15'+10''. Biały przesuwa pionka na ostatnią linię i sięga po hetmana stojącego obok szachownicy, ale zmienia zdanie: odkłada hetmana, stawia na polu promocji skoczka, tą samą ręką zdejmuje pionka i przełącza zegar. Czarny reklamuje, że skoro biały dotknął hetmana, musi promować na hetmana. Jaka jest decyzja sędziego?"
    explanation: Pytanie sprawdza, kiedy wybór figury przy promocji staje się wiążący. Nie wtedy, gdy zawodnik bierze figurę do ręki poza szachownicą, ale dopiero gdy nowa figura dotknie pola promocji (art. 4.4.4). Do tego momentu zawodnik może zmienić zdanie.
  en:
    stem: "A game played at 15'+10''. White moves a pawn to the last rank and reaches for a queen standing beside the board, but changes his mind: he puts the queen down, places a knight on the promotion square, removes the pawn with the same hand and presses the clock. Black claims that since White touched the queen, he must promote to a queen. What is the arbiter's decision?"
    explanation: The question tests when the choice of piece in a promotion becomes binding. Not when the player picks a piece up off the board, but only once the new piece touches the promotion square (Art. 4.4.4). Until then the player may change his mind.
level: NA
status: draft
type: open-ended
modelAnswer:
  pl: Sędzia odrzuca reklamację — skoczek zostaje. Wybór promowanej figury jest zakończony dopiero z chwilą, gdy nowa figura dotknie pola promocji (art. 4.4.4). Dotknięcie hetmana stojącego poza szachownicą niczego nie przesądza, bo zasada dotkniętej bierki dotyczy bierek stojących na szachownicy (art. 4.3). Promocja została wykonana jedną ręką, a kolejność zdjęcia pionka i postawienia figury jest dowolna (art. 4.6.2).
  en: The arbiter rejects the claim — the knight stays. The choice of the promoted piece is final only when the new piece touches the promotion square (Art. 4.4.4). Touching a queen standing off the board commits the player to nothing, because the touch-move rule concerns pieces on the board (Art. 4.3). The promotion was made with one hand, and the pawn may be removed and the new piece placed in either order (Art. 4.6.2).
topic: art-04-wykonywanie-posuniec
tags:
  - wariant
```

- **Oryginał:** `MecKxA2eJCGR3GPITr5i` (WP 2025 #4) — bez zmian
- **Id wariantu:** `MQaIqdJnPSKPOuvRUkZ6` (wstawione 2026-10-07)
- **Zmiana:** promocja: zawodnik dotyka hetmana poza szachownicą, ale promuje na skoczka; tempo 15'+10''
- **Odpowiedź:** reklamacja odrzucona (kolejność dowolna) → **reklamacja odrzucona — wybór figury rozstrzyga dopiero dotknięcie pola promocji (art. 4.4.4)**

## WP 2025 #10 — wariant

```yaml
content:
  pl:
    stem: Partia rozgrywana tempem 90'+30''. W 24. posunięciu zawodnik grający czarnymi zauważył, że szachownica jest ułożona nieprawidłowo — w prawym rogu przy każdym z zawodników znajduje się czarne pole. Zawodnicy proszą o interwencję sędziego. Opisz postępowanie.
    explanation: Złe ułożenie szachownicy (wbrew art. 2.1) nie unieważnia partii — to nie to samo co niewłaściwa pozycja początkowa bierek, przy której partię rozgrywa się od nowa (art. 7.2.1). Pozycję przenosi się na poprawnie ułożoną szachownicę. W szachach szybkich i błyskawicznych po 10. posunięciu obu stron takich reklamacji już się nie uwzględnia (Aneks A.4.1.2), ale tu tempo jest standardowe.
  en:
    stem: A game played at 90'+30''. On move 24 Black notices that the board has been placed wrongly — each player has a dark square in the right-hand corner. The players ask the arbiter to intervene. Describe the procedure.
    explanation: A wrongly placed board (contrary to Art. 2.1) does not annul the game — unlike an incorrect initial position of the pieces, which means replaying the game (Art. 7.2.1). The position is transferred to a correctly placed board. In rapid and blitz such claims are no longer upheld after both players have made 10 moves (Appendix A.4.1.2), but this is standard play.
level: NA
type: open-ended
modelAnswer:
  pl: Sędzia przenosi powstałą pozycję na prawidłowo ułożoną szachownicę i nakazuje kontynuować grę (art. 7.2.2). W szachach standardowych nie ma przy tym żadnego limitu posunięć — ułożenie szachownicy poprawia się bez względu na to, jak daleko zaszła partia.
  en: The arbiter transfers the position reached to a correctly placed board and orders play to continue (Art. 7.2.2). In standard play there is no move limit for this — the board is corrected however far the game has gone.
status: draft
topic: art-07-nieprawidlowosci
tags:
  - wariant
```

- **Oryginał:** `ulPw1FNXcapwBfpP8hNx` (WP 2025 #10) — bez zmian
- **Id wariantu:** `C4hrkInbv20TnpFQ4bvu` (wstawione 2026-10-07)
- **Zmiana:** tempo 10'+3'' → 90'+30''; 3. → 24. posunięcie; szachownica z czarnym polem w prawym rogu
- **Odpowiedź:** przenieść pozycję i kontynuować → **przenieść pozycję i kontynuować — w szachach standardowych bez limitu posunięć (art. 7.2.2)**

## WP 2025 #11 — wariant

```yaml
content:
  pl:
    stem: 'Partia szachów standardowych. W pozycji na diagramie (po 10.G:e7) zawodnik grający czarnymi odbija 10…H:e7, ale przy przesuwaniu hetmana przypadkowo przesuwa też pionka z f7 na f6. Czarny przełącza zegar, nie zauważając błędu. Biały zatrzymuje zegar i woła sędziego, wskazując na nieprawidłowo przesuniętego pionka. Sędzia:'
    explanation: Odbicie H:e7 jest prawidłowym, zakończonym posunięciem i zostaje w mocy. Przypadkowe przesunięcie pionka nie jest ani posunięciem, ani dotknięciem z zamiarem wykonania ruchu (art. 4.2.2) — to przemieszczenie bierki, które usuwa się, przywracając pionka na f7 (art. 7.4.1, 7.6). Zawodnik, który przemieścił bierkę, robi to na własnym czasie, a sędzia może go ukarać (art. 7.4.3).
  en:
    stem: 'A standard-play game. In the position shown (after 10.Bxe7) Black recaptures 10…Qxe7, but while moving the queen accidentally pushes the pawn from f7 to f6 as well. Black presses the clock without noticing. White stops the clock and calls the arbiter, pointing to the displaced pawn. The arbiter:'
    explanation: The recapture Qxe7 is a legal, completed move and stands. Accidentally pushing the pawn is neither a move nor a touch with intent to move (Art. 4.2.2) — it is a displaced piece, put right by returning the pawn to f7 (Arts. 7.4.1, 7.6). The player who displaced it does so on his own time, and the arbiter may penalise him (Art. 7.4.3).
level: NA
type: single-choice
options:
  - id: a
    content:
      pl: nakazuje cofnięcie tylko hetmana i ponowne wykonanie ruchu H:e7
      en: orders only the queen to be taken back and Qxe7 to be played again
    isCorrect: false
  - id: b
    content:
      pl: nakazuje cofnięcie obu bierek na wcześniejsze pola i wykonanie dowolnego ruchu
      en: orders both pieces back to their previous squares and any move to be made
    isCorrect: false
  - id: c
    content:
      pl: nakazuje przywrócenie pionka na f7 i dalszą grę z hetmanem na e7
      en: orders the pawn back to f7 and play to continue with the queen on e7
    isCorrect: true
  - id: d
    content:
      pl: dodaje Czarnym 2 minuty za nieprawidłową reklamację
      en: adds 2 minutes to Black for an unjustified claim
    isCorrect: false
status: draft
topic: art-07-nieprawidlowosci
tags:
  - wariant
diagram:
  kind: fen
  fen: r1bq1rk1/pp1nBppp/2p1p3/3n4/2BP4/2N1PN2/PP3PPP/2RQK2R b K - 0 10
```

- **Oryginał:** `QTOyWOIjreiCZG6EHpDa` (WP 2025 #11) — bez zmian
- **Id wariantu:** `ksWdV0ntfNrTQn0rxx3w` (wstawione 2026-10-07)
- **Zmiana:** nowa pozycja (gambit hetmański); przemieszcza pionka zawodnik grający czarnymi
- **Odpowiedź:** c) przywrócić pionka, posunięcie zostaje → **c) przywrócić pionka na f7, posunięcie H:e7 zostaje (art. 7.4, 7.6)**

## WP 2025 #17 — wariant

```yaml
type: single-choice
level: NA
status: draft
tags:
  - wariant
content:
  pl:
    stem: Partia rozgrywana tempem 60'+30''. W pozycji na diagramie zawodnik grający czarnymi zatrzymuje zegar i reklamuje remis, twierdząc, że pozycja jest teoretycznie remisowa. Jaką decyzję powinien podjąć sędzia?
    explanation: 'Przepisy nie znają remisu z oceny pozycji. Partia kończy się remisem tylko w sytuacjach z art. 5.2 i 9: pat, martwa pozycja, zgoda, powtórzenie pozycji lub reguła 50 posunięć. Biały ma pionka, którym przy współpracy przeciwnika może dać mata, więc pozycja nie jest martwa (art. 5.2.2). Reklamacja z Wytycznych III też nie wchodzi w grę, bo tempo przewiduje dodatek 30 s (art. III.2.2). Sędzia odrzuca reklamację i partia toczy się dalej.'
  en:
    stem: A game played at 60'+30''. In the position shown Black stops the clock and claims a draw, arguing that the position is a theoretical draw. What should the arbiter decide?
    explanation: "The Laws know no draw by assessment of the position. A game is drawn only in the cases of Arts. 5.2 and 9: stalemate, dead position, agreement, repetition or the 50-move rule. White has a pawn with which mate is possible given the opponent's cooperation, so the position is not dead (Art. 5.2.2). A claim under Guidelines III is not available either, because the time control has a 30-second increment (Art. III.2.2). The arbiter rejects the claim and play continues."
options:
  - id: a
    content:
      pl: przyjąć reklamację
      en: uphold the claim
    isCorrect: false
  - id: b
    content:
      pl: odrzucić reklamację i nakazać dalszą grę
      en: reject the claim and let play continue
    isCorrect: true
  - id: c
    content:
      pl: odłożyć podjęcie decyzji i obserwować dalszy przebieg partii
      en: postpone the decision and watch how the game develops
    isCorrect: false
topic: art-09-partia-remisowa
diagram:
  kind: fen
  fen: 7k/8/5K2/7P/8/8/8/8 b - - 0 1
```

- **Oryginał:** `up5B6S6u9wROX9Xf2ggv` (WP 2025 #17) — bez zmian
- **Id wariantu:** `PdKpjUSobnLJAiFlhK6u` (wstawione 2026-10-07)
- **Zmiana:** nowa pozycja (pionek h zamiast a); tempo 30'+30'' → 60'+30''
- **Odpowiedź:** b) odrzucić reklamację → **b) odrzucić reklamację — pozycja nie jest martwa, Wytyczne III wyłączone przez dodatek**

## WP 2025 #21 — wariant

```yaml
type: open-ended
level: NA
status: draft
tags:
  - wariant
content:
  pl:
    stem: W pozycji na diagramie nastąpiło 1.W:a8 W:a8 2.W:a8 K:a8 3.Ka3. W trakcie wykonywania ostatniego ruchu 3.Ka3 Białemu skończył się czas. Zawodnicy nie mogą porozumieć się w kwestii wyniku partii i proszą o interwencję sędziego. Napisz, jaki jest wynik partii.
    explanation: 'Po wymianie obu par wież zostają same króle i pionki, a łańcuchy pionków się blokują. To jednak nie czyni pozycji martwą: przepis nie wymaga, by mat dało się wymusić — wystarczy, że jakakolwiek seria prawidłowych posunięć, choćby z pomocą przeciwnika, do niego prowadzi. Pionek, który może dojść do przemiany, to zapewnia.'
  en:
    stem: In the position shown, 1.Rxa8 Rxa8 2.Rxa8 Kxa8 3.Ka3 followed. While making the last move 3.Ka3, White ran out of time. The players cannot agree on the result and ask the arbiter to intervene. Write what the result is.
    explanation: "Once both pairs of rooks are exchanged only kings and pawns remain, and the pawn chains are locked. That does not make the position dead, though: the rule does not require that mate can be forced — it is enough that some series of legal moves, even with the opponent's help, leads to it. A pawn that can reach promotion guarantees that."
modelAnswer:
  pl: '0–1, wygrana Czarnego. Białemu opadła chorągiewka, a Czarny zachowuje pionki. Przekroczenie czasu przegrywa partię, o ile przeciwnik może dać mata jakąkolwiek serią prawidłowych posunięć (art. 6.9) — a taka seria istnieje: przy współpracy przeciwnika czarny król może zbić niechroniony pionek d3 i otworzyć drogę do przemiany pionka d4.'
  en: "0–1, Black wins. White's flag has fallen and Black keeps his pawns. Running out of time loses the game if the opponent can mate by some series of legal moves (Art. 6.9) — and such a series exists: with the opponent's cooperation the black king can take the unprotected pawn on d3 and clear the way for the d4 pawn to promote."
topic: art-06-zegar-szachowy
diagram:
  kind: fen
  fen: rr6/1k6/1p5p/1Pp1p1p1/2PpPpP1/3P1P1P/RK6/R7 w - - 0 1
```

- **Oryginał:** `sf9Jno7vJBpoVVLsHzc6` (WP 2025 #21) — bez zmian
- **Id wariantu:** `6RrLgiyBshFSub2IPdFN` (wstawione 2026-10-07)
- **Zmiana:** pozycja odbita na skrzydło hetmańskie; wymiany na a8, 3.Ka3
- **Odpowiedź:** 0–1 → **0–1 (bez zmian — inna pozycja)**

## WP 2025 #30 — wariant

```yaml
type: open-ended
level: NA
status: draft
tags:
  - wariant
modelAnswer:
  pl: 'Sędzia orzeka remis. Białemu opadła chorągiewka, a Czarny ma samego króla, więc nie może zamatować żadną serią prawidłowych posunięć — partia kończy się remisem (art. 6.9). Żądanie Białego jest bezzasadne: partia zakończyła się z chwilą stwierdzenia przekroczenia czasu i żadnych dalszych posunięć się nie wykonuje. To, że Biały miałby mata w jednym ruchu, nie ma znaczenia.'
  en: "The arbiter declares a draw. White's flag has fallen, and Black has only a king, so he cannot mate by any series of legal moves — the game is drawn (Art. 6.9). White's demand is unfounded: the game ended when the flag fall was established, and no further moves are made. That White would have mate in one is irrelevant."
topic: art-09-partia-remisowa
content:
  pl:
    stem: Partia rozgrywana tempem 60'+30''. W pozycji na diagramie Biały wykonał posunięcie 1.Sa6+, po czym skończył mu się czas. Czarny dotyka króla, ale nie wykonuje posunięcia. Dochodzi do dyskusji i zawodnicy proszą o interwencję sędziego. Czarny domaga się remisu, natomiast Biały domaga się wykonania jedynego posunięcia królem (1…Ka8), po którym nastąpi mat 2.Gg2. Napisz, jakie powinny być decyzje sędziego.
    explanation: Przekroczenie czasu przegrywa partię tylko wtedy, gdy przeciwnik może dać mata jakąkolwiek serią prawidłowych posunięć. Liczy się materiał strony, której chorągiewka nie opadła — tutaj samotny król — a nie to, jak blisko mata był zawodnik, któremu skończył się czas.
  en:
    stem: A game played at 60'+30''. In the position shown White played 1.Na6+ and then ran out of time. Black touches the king but does not make a move. A dispute arises and the players ask the arbiter to intervene. Black demands a draw, while White demands that the only king move (1…Ka8) be played, after which mate follows with 2.Bg2. Write what the arbiter should decide.
    explanation: Running out of time loses only if the opponent can mate by some series of legal moves. What counts is the material of the side whose flag did not fall — here a lone king — not how close to mate the player who ran out of time was.
diagram:
  kind: fen
  fen: 1k6/8/1K6/8/1N6/7B/8/8 w - - 0 1
```

- **Oryginał:** `CgkVGB4fY8akAxvsveEw` (WP 2025 #30) — bez zmian
- **Id wariantu:** `0jchi7DZmOWX3qkXYAIm` (wstawione 2026-10-07)
- **Zmiana:** pozycja odbita (1.Sa6+, mat 2.Gg2); tempo 90' → 60'+30''
- **Odpowiedź:** remis → **remis (bez zmian — inna pozycja)**

## PZSzach 2026 #8 — wariant

```yaml
type: open-ended
level: FA
status: draft
topic: art-06-zegar-szachowy
tags:
  - wariant
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem 5'+3'' na zawodnika.
      W przedstawionej pozycji zawodnik grający białymi wykonał posunięcie 1.Kxc8 i przełączył zegar. Przed wykonaniem kolejnego posunięcia przez czarne zawodnikowi grającemu czarnymi spadła chorągiewka. Sytuację obserwował sędzia.
      Jak powinien postąpić sędzia? Uzasadnij swoją decyzję.
    explanation: Pozycja po 1.Kxc8 nie jest jeszcze martwa — czarny król ma ruch. Ale jedynym ruchem jest zbicie pionka a7 (pola b7 i b8 kontroluje biały król), a po nim zostaje król przeciwko królowi. Liczy się więc nie to, czy pozycja jest martwa w chwili opadnięcia chorągiewki, tylko czy jakakolwiek seria prawidłowych posunięć prowadzi do mata (art. 6.9). Tempo 5'+3'' to 5 + 3 = 8 minut, czyli szachy błyskawiczne, w których sędzia sygnalizuje opadnięcie chorągiewki z urzędu (Aneks A.4.5 w związku z B.4).
  en:
    stem: |-
      The game is played at 5'+3'' per player.
      In the position shown, White played 1.Kxc8 and pressed the clock. Before Black made the next move, Black's flag fell. The arbiter was watching.
      What should the arbiter do? Justify the decision.
    explanation: The position after 1.Kxc8 is not dead yet — the black king has a move. But the only move is capturing the a7 pawn (b7 and b8 are covered by the white king), after which it is king against king. What counts is not whether the position is dead when the flag falls, but whether any series of legal moves leads to mate (Art. 6.9). 5'+3'' means 5 + 3 = 8 minutes, i.e. blitz, where the arbiter calls a flag fall on their own initiative (Appendix A.4.5 read with B.4).
modelAnswer:
  pl: Sędzia przerywa partię i orzeka remis. Po 1.Kxc8 czarne mają tylko jedno prawidłowe posunięcie — 1…Kxa7 — po którym na szachownicy zostają same króle, czyli martwa pozycja. Przekroczenie czasu oznacza przegraną tylko wtedy, gdy przeciwnik może dać mata jakąkolwiek serią prawidłowych posunięć (art. 6.9); tutaj każda taka seria prowadzi do martwej pozycji, więc białe nie mogą zamatować.
  en: The arbiter stops the game and declares a draw. After 1.Kxc8 Black has exactly one legal move — 1…Kxa7 — after which only the kings remain, a dead position. Exceeding the time limit loses only if the opponent can checkmate by some series of legal moves (Art. 6.9); here every such series leads to a dead position, so White cannot checkmate.
diagram:
  kind: fen
  fen: k1r5/P2K4/8/8/8/8/8/8 w - - 0 1
```

- **Oryginał:** `OBMibkqT1822TRngsJAS` (PZSzach 2026 #8) — bez zmian
- **Id wariantu:** `VQyF9WnLkItjTs6vtdfF` (wstawione 2026-10-07)
- **Zmiana:** pozycja odbita (1.Kxc8, jedyny ruch 1…Kxa7); tempo 3'+2'' → 5'+3''
- **Odpowiedź:** remis → **remis (bez zmian — inna pozycja)**

## PZSzach 2026 #10 — wariant

```yaml
type: open-ended
level: FA
status: draft
topic: art-11-zachowanie-zawodnikow
tags:
  - wariant
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem 60'+30'' na zawodnika.
      W pozycji przedstawionej na diagramie z kieszeni marynarki zawodnika grającego czarnymi wydobywa się dźwięk telefonu komórkowego.
      Jak powinien postąpić sędzia? Czy wynik partii zależy od pozycji na szachownicy? Odpowiedź uzasadnij.
    explanation: 'Pułapka jest tu odwrócona: to przewiniający ma przygniatającą przewagę, a przeciwnik samotnego króla, którym sam nigdy by nie zamatował. Przepis o urządzeniach elektronicznych nie bierze pod uwagę ani pozycji, ani materiału — przeciwnik po prostu wygrywa. To odróżnia go od art. 6.9 i 7.5.5, gdzie brak materiału matującego u przeciwnika daje remis.'
  en:
    stem: |-
      The game is played at 60'+30'' per player.
      In the position shown, a mobile phone rings in the jacket pocket of the player with the black pieces.
      What should the arbiter do? Does the result depend on the position on the board? Justify your answer.
    explanation: "The trap is reversed here: it is the offender who has an overwhelming advantage, and the opponent who has a lone king that could never mate. The rule on electronic devices takes neither the position nor the material into account — the opponent simply wins. That sets it apart from Arts. 6.9 and 7.5.5, where the opponent's lack of mating material means a draw."
modelAnswer:
  pl: Sędzia orzeka przegraną czarnych i zwycięstwo białych — niezależnie od pozycji, także wtedy, gdy białym został sam król, a czarne mają wieżę i skoczka. Zawodnik nie może mieć przy sobie w strefie rozgrywek telefonu ani innego urządzenia elektronicznego (art. 11.3.2.1), a jeżeli nie ma wątpliwości, że je wniósł, przegrywa partię, a przeciwnik ją wygrywa (art. 11.3.2.2). Regulamin turnieju może przewidywać łagodniejszą karę. Niezależnie od rozstrzygnięcia sędzia może rozważyć, czy nie doszło do próby oszustwa, i zażądać kontroli (art. 11.3.3).
  en: The arbiter declares the game lost by Black and won by White — whatever the position, even though White has only a king left and Black has a rook and a knight. A player may not have a mobile phone or any other electronic device on them in the playing venue (Art. 11.3.2.1), and if it is evident that they brought one in, they lose the game and the opponent wins (Art. 11.3.2.2). The tournament regulations may set a milder penalty. Separately, the arbiter may consider whether cheating was attempted and require an inspection (Art. 11.3.3).
diagram:
  kind: fen
  fen: 8/8/8/8/3n4/4k3/1r6/7K b - - 0 1
```

- **Oryginał:** `5a1tCyjQMOXjBCzFTMeE` (PZSzach 2026 #10) — bez zmian
- **Id wariantu:** `HJLfMBCp6H4YSCbz9E4j` (wstawione 2026-10-07)
- **Zmiana:** telefon dzwoni u czarnych, którzy mają przygniatającą przewagę; tempo 90'+30'' → 60'+30''
- **Odpowiedź:** przegrana białych mimo przewagi → **przegrana czarnych mimo przewagi — białe wygrywają samym królem (art. 11.3.2.2)**

## PZSzach 2026 #11 — wariant

```yaml
type: open-ended
level: FA
status: draft
topic: art-07-nieprawidlowosci
tags:
  - wariant
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem 5'+3'' na zawodnika.
      W pozycji przedstawionej na diagramie zawodnik grający białymi wykonał posunięcie 1.exf8, doprowadzając pionka na ostatnią linię. Na polu promocji pozostawił jednak pionka i przełączył zegar, nie dokonując zamiany na żadną figurę. Następnie zawodnikowi grającemu czarnymi skończył się czas do namysłu.
      Jaką decyzję powinien podjąć sędzia? Odpowiedź uzasadnij.
    explanation: 'Na diagramie białe stoją w szachu od skoczka z f8, więc bicie e7:f8 nie tylko promuje pionka, ale też likwiduje szacha. Przepis sam rozstrzyga, na jaką figurę zamienia się pionka: na hetmana. Hetman na f8 razem ze skoczkiem z e5 odbiera czarnemu królowi wszystkie pola (g6, g7, g8, h6, h8), nie dając szacha. Bonifikata za nieprawidłowe posunięcie nie ma już znaczenia, bo pat zakończył partię.'
  en:
    stem: |-
      The game is played at 5'+3'' per player.
      In the position shown, White played 1.exf8, bringing the pawn to the last rank. However, they left the pawn on the promotion square and pressed the clock without exchanging it for any piece. Black's time then ran out.
      What decision should the arbiter take? Justify your answer.
    explanation: 'In the diagram White is in check from the knight on f8, so the capture exf8 both promotes and removes the check. The rule itself decides what the pawn becomes: a queen. A queen on f8 together with the knight on e5 takes away every square from the black king (g6, g7, g8, h6, h8) without giving check. The time bonus for the illegal move is moot, because stalemate has ended the game.'
modelAnswer:
  pl: Remis. Pozostawienie pionka na polu promocji i przełączenie zegara to nieprawidłowe posunięcie, a pionka zamienia się wtedy na hetmana tego samego koloru (art. 7.5.2). Po 1.exf8=H czarny król na h7 nie stoi w szachu i nie ma żadnego prawidłowego posunięcia — to pat, który natychmiast kończy partię (art. 5.2.1). Późniejsze opadnięcie chorągiewki czarnych nie ma już znaczenia.
  en: A draw. Leaving the pawn on the promotion square and pressing the clock is an illegal move, and the pawn is then replaced by a queen of the same colour (Art. 7.5.2). After 1.exf8=Q the black king on h7 is not in check and has no legal move — stalemate, which ends the game immediately (Art. 5.2.1). Black's flag falling afterwards no longer matters.
diagram:
  kind: fen
  fen: 5n2/4P2k/4K3/4N3/8/8/8/8 w - - 0 1
```

- **Oryginał:** `aVnuOEIQ9rnRUXjHfRX1` (PZSzach 2026 #11) — bez zmian
- **Id wariantu:** `i11VjpO8FhlyblGfCi5f` (wstawione 2026-10-07)
- **Zmiana:** pozycja odbita (1.exf8 bez promocji); tempo 3'+2'' → 5'+3''
- **Odpowiedź:** remis (pat) → **remis (pat) — bez zmian, inna pozycja**

## PZSzach 2026 #13 — wariant

```yaml
type: open-ended
level: FA
status: draft
topic: art-04-wykonywanie-posuniec
tags:
  - wariant
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem 15 min + 5 s na posunięcie.
      W pozycji przedstawionej na diagramie zawodnik grający białymi wykonał posunięcie 1.Sxc6, nie przełączając jednak zegara. Zawodnik grający czarnymi natychmiast zatrzymał zegar i zareklamował sędziemu, że przeciwnik wykonał nieprawidłowe posunięcie. W partii nie wystąpiły wcześniej żadne nieprawidłowości.
      Jak powinien postąpić sędzia? Odpowiedź uzasadnij.
    explanation: Skoczek b4 osłania białego króla na b2 przed wieżą z b8, więc nie może zejść z linii „b” — dlatego 1.Sxc6 było nieprawidłowe. Gdyby chodziło tylko o skoczka, biały mógłby zagrać dowolnie (art. 4.5). Ale dotknięty został także czarny pionek na c6, a art. 4.3.3 każe go wtedy zbić, jeśli to możliwe — i wieża z c3 może to zrobić.
  en:
    stem: |-
      The game is played at 15 min + 5 s per move.
      In the position shown, White played 1.Nxc6 but did not press the clock. Black immediately stopped the clock and claimed to the arbiter that the opponent had made an illegal move. There had been no earlier irregularities in the game.
      What should the arbiter do? Justify your answer.
    explanation: The knight on b4 shields the white king on b2 from the rook on b8, so it cannot leave the b-file — which is why 1.Nxc6 was illegal. Had only the knight been touched, White could play anything (Art. 4.5). But Black's pawn on c6 was touched as well, and Art. 4.3.3 then requires capturing it if possible — which the rook on c3 can do.
modelAnswer:
  pl: 'Reklamacja nieprawidłowego posunięcia jest bezzasadna: zegar nie został przełączony, więc posunięcie nie zostało zakończone (art. 7.5.1) i biały może je jeszcze naprawić — nie ma bonifikaty. Obowiązuje jednak zasada dotkniętej bierki. Biały dotknął własnego skoczka i czarnego pionka na c6, więc rozstrzyga art. 4.3.3. Skoczek z b4 jest związany wieżą z b8 i nie ma żadnego prawidłowego posunięcia, dlatego biały musi zbić dotkniętego pionka inną bierką — jedynym takim posunięciem jest Wxc6.'
  en: "The illegal-move claim fails: the clock was not pressed, so the move was not completed (Art. 7.5.1) and White may still correct it — there is no time bonus. The touch-move rule applies, though. White touched their own knight and Black's pawn on c6, so Art. 4.3.3 governs. The knight on b4 is pinned by the rook on b8 and has no legal move, so White must capture the touched pawn with another piece — and the only such move is Rxc6."
diagram:
  kind: fen
  fen: 1rr5/4k1p1/2pb3p/3p1p2/1N6/P1R2P2/1KP3PP/R7 w - - 0 1
```

- **Oryginał:** `7kOHcN2urKlAb2oEtiYT` (PZSzach 2026 #13) — bez zmian
- **Id wariantu:** `mhWYpUEV3QW8YXYgCUSw` (wstawione 2026-10-07)
- **Zmiana:** pozycja odbita (1.Sxc6, skoczek związany na linii b); tempo 10 min + 5 s → 15 min + 5 s
- **Odpowiedź:** bicie W:f6 → **bicie W:c6 (art. 4.3.3) — bez zmian, inna pozycja**

## PZSzach 2026 #14 — wariant

```yaml
type: open-ended
level: FA
status: draft
topic: kojarzenie-i-systemy
tags:
  - wariant
content:
  pl:
    stem: Podaj kojarzenie 5. rundy turnieju rozgrywanego systemem kołowym z udziałem 7 zawodników.
    explanation: W rundzie 5 tabeli Bergera dla 8 numerów są pary 3–8, 4–2, 5–1, 6–7; ponieważ numer 8 to pauza, pauzuje zawodnik nr 3. Przy nieparzystej liczbie zawodników zawsze korzysta się z tabeli dla liczby o jeden większej, a zawodnik skojarzony z ostatnim numerem pauzuje.
  en:
    stem: Give the pairings for round 5 of a round-robin tournament with 7 players.
    explanation: Round 5 of the Berger table for 8 numbers pairs 3–8, 4–2, 5–1, 6–7; as number 8 is the bye, player 3 sits out. With an odd number of players the table for one more number is always used, and whoever is paired with the last number has the bye.
modelAnswer:
  pl: 'Przy 7 zawodnikach korzysta się z tabeli Bergera dla 8 numerów, a numer 8 oznacza pauzę. Runda 5: 3 – pauza, 4–2, 5–1, 6–7.'
  en: 'With 7 players the Berger table for 8 numbers is used, number 8 meaning a bye. Round 5: 3 – bye, 4–2, 5–1, 6–7.'
```

- **Oryginał:** `rqLoq47rXvr1Kruw97qg` (PZSzach 2026 #14) — bez zmian
- **Id wariantu:** `yIuItzn7FQRBz7b5pGlU` (wstawione 2026-10-07)
- **Zmiana:** 9 zawodników, runda 4 → 7 zawodników, runda 5
- **Odpowiedź:** 7 – pauza, 8–6, 9–5, 1–4, 2–3 → **3 – pauza, 4–2, 5–1, 6–7**
