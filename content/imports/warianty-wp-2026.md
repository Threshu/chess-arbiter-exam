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
