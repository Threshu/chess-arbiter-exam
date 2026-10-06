# PZSzach 2026 — Centralny kurs sędziowski 2026

- **Źródło:** `pdf/CKS-2026-I.docx` (DOCX, nie PDF — tekst bez problemów z kodowaniem; plik ignorowany przez gita)
- **Poziom:** FA — ten sam kurs centralny co PZSzach 2025 („egzamin na klasę państwową”); w pliku brak nagłówka z tytułem i datą
- **Tagi:** `["PZSzach", "2026"]`, w `sources`: `{exam: PZSzach, year: 2026}` (decyzja właściciela, 2026-10-06)
- **Klucz odpowiedzi:** w pliku, pod każdym pytaniem — oficjalny wg właściciela
- **Pytań w pliku:** 20 — nowych 13, duplikatów 7, wariantów do decyzji 0. Wszystkie otwarte.
- **Materiał pomocniczy:** na końcu pliku dwie tabele FIDE (p → dp oraz różnica rankingów → wynik oczekiwany) do pytania 15 — nie są pytaniami.

## Do decyzji po imporcie

- **Pytanie 14** — klucz podaje kojarzenie rundy 6 zamiast 4. W bazie poprawiona odpowiedź, `Pewność: niska` do potwierdzenia.
- **Pytanie 20 vs `L48r7yS0w4NDg6hTPRR0` (WP 2022#29)** — właściciel potwierdził, że normę można zdobyć z przeskoczeniem kategorii. Pytanie z WP 2022 zakłada coś przeciwnego (III kat. z rankingiem 2000 → norma tylko na II). Wymaga poprawki, ale poprawnej kategorii nie da się wyliczyć bez tabeli klasyfikacyjnej PZSzach.
- **Pytania 1 i 18** — regulaminy turniejowe i procedura fair play FIDE; poza przekładem Przepisów gry, więc odpowiedzi przyjęte z klucza bez weryfikacji z kodeksem.

## 1 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: organizacja-turnieju
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 1
content:
  pl:
    stem: |-
      W 9-rundowym turnieju zawodnik wycofuje się z zawodów po rozegraniu 5 rund. Sędzia otrzymuje informację o wycofaniu tuż przed rozpoczęciem rundy 6.
      Opisz i porównaj skutki tej sytuacji w:
      a) turnieju rozgrywanym systemem szwajcarskim,
      b) turnieju rozgrywanym systemem kołowym.
      W odpowiedzi uwzględnij: wpływ na wyniki i klasyfikację turnieju, wpływ na punktacje pomocnicze oraz konsekwencje rankingowe i sprawozdawcze.
    explanation: 'O wszystkim decyduje moment zgłoszenia i liczba rozegranych partii. Skoro kojarzenie rundy 6 jest już ogłoszone, w szwajcarze nie przekojarza się rundy, tylko przyznaje walkower. W turnieju kołowym kluczowy jest próg połowy partii: zawodnik rozegrał ich ponad 50%, więc pozostaje w tabeli. Walkowery nigdy nie są oceniane rankingowo, bo partii nie rozegrano przy szachownicy.'
  en:
    stem: |-
      In a 9-round tournament a player withdraws after playing 5 rounds. The arbiter learns of the withdrawal just before round 6 starts.
      Describe and compare the consequences of this in:
      a) a Swiss-system tournament,
      b) a round-robin tournament.
      Cover the effect on results and standings, the effect on tie-breaks, and the rating and reporting consequences.
    explanation: 'Everything turns on when the withdrawal is reported and how many games have been played. The round 6 pairings are already out, so a Swiss event awards a forfeit rather than re-pairing the round. In a round robin the threshold is half of the games: the player has completed more than 50%, so they stay in the table. Forfeits are never rated, because no game was played over the board.'
modelAnswer:
  pl: |-
    a) System szwajcarski: kojarzenie rundy 6 jest już ogłoszone, więc się go nie zmienia — przeciwnik wycofanego zawodnika wygrywa tę partię walkowerem. Od kolejnej rundy wycofany zawodnik nie jest już kojarzony. Jego partie nierozegrane wpływają na punktacje pomocnicze tak jak każda partia nierozegrana — liczy się je z udziałem wirtualnego przeciwnika (tzw. manekina).
    b) System kołowy: zawodnik rozegrał ponad połowę partii (5 z 9), więc pozostaje w klasyfikacji — wszystkie jego dotychczasowe wyniki zostają zachowane, a pozostałe partie przegrywa walkowerem. W punktacji Sonneborna-Bergera partie nierozegrane liczą się tak samo jak rozegrane przy szachownicy.
    W obu systemach do oceny rankingowej zgłasza się wszystkie partie rozegrane przy szachownicy; walkowery nie są oceniane.
  en: |-
    a) Swiss system: the round 6 pairings have already been published, so they are not changed — the withdrawn player's opponent wins that game by forfeit. From the next round on the withdrawn player is no longer paired. The unplayed games affect tie-breaks like any unplayed game — they are counted against a virtual opponent.
    b) Round robin: the player has completed more than half of the games (5 of 9), so they stay in the standings — all results so far stand and the remaining games are lost by forfeit. For Sonneborn-Berger the unplayed games count the same as games played over the board.
    In both systems every game played over the board is reported for rating; forfeits are not rated.
```

- **Id:** `slhCZS8T5sKGpkrfUHdt` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 1
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku; regulaminy turniejowe FIDE (kojarzenie, punktacje, ranking) nie są częścią przekładu Przepisów gry, więc nie da się tego sprawdzić z kodeksem

## 2 — duplikat

- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 2
- **Dedup:** `RVQAaiVrBDd1TUs1AV1K` (WP 2022#6) — tempo 3'+2'', drugie przewinienie: posunięcie jedną ręką, zegar drugą — nieprawidłowe zachowanie, nie nieprawidłowe posunięcie; kara z art. 12.9 (upomnienie). Klucz zgodny z istniejącą odpowiedzią.
- **Akcja:** do `sources` istniejącego pytania dopisane `{exam: PZSzach, year: 2026, no: 2}`; treść bez zmian

## 3 — duplikat

- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 3
- **Dedup:** `4GyMOtHNllHD5PPbCrS0` (WP 2022#24) — zamienione goniec i skoczek, 30'+30''; różni się tylko liczbą posunięć (12 zamiast 11) — partia unieważniona, art. 7.2.1. Klucz zgodny.
- **Akcja:** do `sources` istniejącego pytania dopisane `{exam: PZSzach, year: 2026, no: 3}`; treść bez zmian

## 4 — duplikat

- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 4
- **Dedup:** `raQmiWYPp4ziOtUEPu0h` (WP 2022#2) — odmienne kolory, 60'+30'', po 14 posunięć — partię kontynuuje się, art. 7.3. Identyczne. Klucz dodaje korektę w programie kojarzącym.
- **Akcja:** do `sources` istniejącego pytania dopisane `{exam: PZSzach, year: 2026, no: 4}`; treść bez zmian

## 5 — duplikat

- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 5
- **Dedup:** `MecKxA2eJCGR3GPITr5i` (WP 2022#4) — promocja: najpierw hetman, potem zdjęcie pionka, 10'+4'' — kolejność dowolna, art. 4.6.2; reklamacja bezzasadna. Identyczne.
- **Akcja:** do `sources` istniejącego pytania dopisane `{exam: PZSzach, year: 2026, no: 5}`; treść bez zmian

## 6 — duplikat

- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 6
- **Dedup:** `ulPw1FNXcapwBfpP8hNx` (WP 2023#10) — źle ustawiona szachownica, 10'+3'', 3. posunięcie — przeniesienie pozycji, art. 7.2.2. Identyczne.
- **Akcja:** do `sources` istniejącego pytania dopisane `{exam: PZSzach, year: 2026, no: 6}`; treść bez zmian

## 7 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: art-06-zegar-szachowy
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 7
content:
  pl:
    stem: |-
      Turniej drużynowy rozgrywany tempem: 90 min na 40 posunięć + 30 min na dokończenie partii + 30 s na posunięcie od początku partii.
      Jeden z zawodników po wykonaniu posunięcia omyłkowo przełączył zegar zawodników grających przy szachownicy obok. Fakt ten zauważono po kilku minutach.
      Proszę opisać prawidłowe postępowanie sędziego w tej sytuacji.
    explanation: Pomyłkowe przełączenie cudzego zegara zakłóca pomiar czasu w partii, w której nikt nic nie zawinił — dlatego naprawa należy do sędziego, który ustala czasy według najlepszego rozeznania i koryguje licznik posunięć (art. 6.10.2). Przy tempie z kontrolą po 40. posunięciu błąd licznika przesunąłby moment doliczenia 30 minut.
  en:
    stem: |-
      A team tournament played at: 90 min for 40 moves + 30 min to finish the game + 30 s per move from move one.
      After making a move, one player pressed the clock of the players at the neighbouring board by mistake. This was noticed several minutes later.
      Describe the arbiter's correct course of action.
    explanation: Pressing someone else's clock disturbs the timing of a game in which nobody did anything wrong — so the fix falls to the arbiter, who sets the times by best judgement and corrects the move counter (Art. 6.10.2). With a time control at move 40, a wrong counter would shift the moment the 30 minutes are added.
modelAnswer:
  pl: 'Sędzia zatrzymuje zegar na sąsiedniej szachownicy i według swojego najlepszego rozeznania ustala możliwie najdokładniej czasy obu zawodników tej partii (art. 6.10.2). Szczególną uwagę trzeba zwrócić na licznik posunięć: przy tempie z kontrolą po 40. posunięciu błędne przełączenie mogło zmienić liczbę zarejestrowanych posunięć, a od niej zależy doliczenie 30 minut. Każde przełączenie dolicza też 30 s dodatku. W razie potrzeby sędzia koryguje licznik.'
  en: 'The arbiter stops the clock at the neighbouring board and, using their best judgement, sets the times of both players in that game as accurately as possible (Art. 6.10.2). Particular attention goes to the move counter: with a time control at move 40, the stray press may have changed the number of recorded moves, and the extra 30 minutes depends on it. Every press also adds the 30-second increment. The arbiter corrects the counter if needed.'
```

- **Id:** `pYRMrP7cos0cN0Cl819O` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 7
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku

## 8 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: art-06-zegar-szachowy
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 8
diagram:
  kind: fen
  fen: 5r1k/4K2P/8/8/8/8/8/8 w - - 0 1
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem 3'+2'' na zawodnika.
      W przedstawionej pozycji zawodnik grający białymi wykonał posunięcie 1.Kxf8 i przełączył zegar. Przed wykonaniem kolejnego posunięcia przez czarne zawodnikowi grającemu czarnymi spadła chorągiewka. Sytuację obserwował sędzia.
      Jak powinien postąpić sędzia? Uzasadnij swoją decyzję.
    explanation: Pozycja po 1.Kxf8 nie jest jeszcze martwa — czarny król ma ruch. Ale jedynym ruchem jest zbicie pionka h7 (pola g7 i g8 kontroluje biały król), a po nim zostaje król przeciwko królowi. Liczy się więc nie to, czy pozycja jest martwa w chwili opadnięcia chorągiewki, tylko czy jakakolwiek seria prawidłowych posunięć prowadzi do mata (art. 6.9). Tempo 3'+2'' to szachy błyskawiczne, w których sędzia sygnalizuje opadnięcie chorągiewki z urzędu (Aneks A.4.5 w związku z B.4).
  en:
    stem: |-
      The game is played at 3'+2'' per player.
      In the position shown, White played 1.Kxf8 and pressed the clock. Before Black made the next move, Black's flag fell. The arbiter was watching.
      What should the arbiter do? Justify the decision.
    explanation: The position after 1.Kxf8 is not dead yet — the black king has a move. But the only move is capturing the h7 pawn (g7 and g8 are covered by the white king), after which it is king against king. What counts is not whether the position is dead when the flag falls, but whether any series of legal moves leads to mate (Art. 6.9). 3'+2'' is blitz, where the arbiter calls a flag fall on their own initiative (Appendix A.4.5 read with B.4).
modelAnswer:
  pl: Sędzia przerywa partię i orzeka remis. Po 1.Kxf8 czarne mają tylko jedno prawidłowe posunięcie — 1…Kxh7 — po którym na szachownicy zostają same króle, czyli martwa pozycja. Przekroczenie czasu oznacza przegraną tylko wtedy, gdy przeciwnik może dać mata jakąkolwiek serią prawidłowych posunięć (art. 6.9); tutaj każda taka seria prowadzi do martwej pozycji, więc białe nie mogą zamatować.
  en: The arbiter stops the game and declares a draw. After 1.Kxf8 Black has exactly one legal move — 1…Kxh7 — after which only the kings remain, a dead position. Exceeding the time limit loses only if the opponent can checkmate by some series of legal moves (Art. 6.9); here every such series leads to a dead position, so White cannot checkmate.
```

- **Id:** `OBMibkqT1822TRngsJAS` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 8
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku; potwierdzone silnikiem (po 1.Kxf8 jedynym ruchem czarnych jest Kxh7, potem martwa pozycja)

## 9 — duplikat

- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 9
- **Dedup:** `a5Mpu8QVziOcQ3gorlrH` (WP 2022#3) — ruch królem w 15., roszada w 20., remis, zgłoszenie po partii — wynik obowiązuje. Ta sama sytuacja i odpowiedź; tutaj pytanie otwarte, w bazie wielokrotnego wyboru.
- **Akcja:** do `sources` istniejącego pytania dopisane `{exam: PZSzach, year: 2026, no: 9}`; treść bez zmian

## 10 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: art-11-zachowanie-zawodnikow
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 10
diagram:
  kind: fen
  fen: 7k/8/8/5KBN/8/8/8/8 w - - 0 1
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem 90'+30'' na zawodnika.
      W pozycji przedstawionej na diagramie z kieszeni marynarki zawodnika grającego białymi wydobywa się dźwięk telefonu komórkowego.
      Jak powinien postąpić sędzia? Czy wynik partii zależy od pozycji na szachownicy? Odpowiedź uzasadnij.
    explanation: 'Diagram jest pułapką: białe mają gońca i skoczka przeciwko samotnemu królowi, więc kusi, by — jak przy przekroczeniu czasu — orzec remis z braku materiału matującego u przeciwnika. Przepis o urządzeniach elektronicznych nie ma jednak takiego zastrzeżenia: przeciwnik po prostu wygrywa. To odróżnia go od art. 6.9 i 7.5.5.'
  en:
    stem: |-
      The game is played at 90'+30'' per player.
      In the position shown, a mobile phone rings in the jacket pocket of the player with the white pieces.
      What should the arbiter do? Does the result depend on the position on the board? Justify your answer.
    explanation: 'The diagram is a trap: White has bishop and knight against a lone king, so it is tempting to rule a draw for lack of mating material, as with a flag fall. The rule on electronic devices has no such proviso, though: the opponent simply wins. That is what sets it apart from Arts. 6.9 and 7.5.5.'
modelAnswer:
  pl: Sędzia orzeka przegraną białych i zwycięstwo czarnych — niezależnie od pozycji, także wtedy, gdy czarnym został sam król. Zawodnik nie może mieć przy sobie w strefie rozgrywek telefonu ani innego urządzenia elektronicznego (art. 11.3.2.1), a jeżeli nie ma wątpliwości, że je wniósł, przegrywa partię, a przeciwnik ją wygrywa (art. 11.3.2.2). Regulamin turnieju może przewidywać łagodniejszą karę. Niezależnie od rozstrzygnięcia sędzia może rozważyć, czy nie doszło do próby oszustwa, i zażądać kontroli (art. 11.3.3).
  en: The arbiter declares the game lost by White and won by Black — whatever the position, even if Black has only a king left. A player may not have a mobile phone or any other electronic device on them in the playing venue (Art. 11.3.2.1), and if it is evident that they brought one in, they lose the game and the opponent wins (Art. 11.3.2.2). The tournament regulations may set a milder penalty. Separately, the arbiter may consider whether cheating was attempted and require an inspection (Art. 11.3.3).
```

- **Id:** `5a1tCyjQMOXjBCzFTMeE` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 10
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku

## 11 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: art-07-nieprawidlowosci
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 11
diagram:
  kind: fen
  fen: 2n5/k2P4/3K4/3N4/8/8/8/8 w - - 0 1
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem 3'+2'' na zawodnika.
      W pozycji przedstawionej na diagramie zawodnik grający białymi wykonał posunięcie 1.dxc8, doprowadzając pionka na ostatnią linię. Na polu promocji pozostawił jednak pionka i przełączył zegar, nie dokonując zamiany na żadną figurę. Następnie zawodnikowi grającemu czarnymi skończył się czas do namysłu.
      Jaką decyzję powinien podjąć sędzia? Odpowiedź uzasadnij.
    explanation: 'Na diagramie białe stoją w szachu od skoczka z c8, więc bicie d7:c8 nie tylko promuje pionka, ale też likwiduje szacha. Kluczowe jest to, że przepis sam rozstrzyga, na jaką figurę zamienia się pionka: na hetmana. A hetman na c8 razem ze skoczkiem z d5 odbiera czarnemu królowi wszystkie pola (a6, a8, b6, b7, b8), nie dając szacha. Bonifikata za nieprawidłowe posunięcie nie ma już znaczenia, bo pat zakończył partię.'
  en:
    stem: |-
      The game is played at 3'+2'' per player.
      In the position shown, White played 1.dxc8, bringing the pawn to the last rank. However, they left the pawn on the promotion square and pressed the clock without exchanging it for any piece. Black's time then ran out.
      What decision should the arbiter take? Justify your answer.
    explanation: 'In the diagram White is in check from the knight on c8, so the capture d7xc8 both promotes and removes the check. The key point is that the rule itself decides what the pawn becomes: a queen. And a queen on c8 together with the knight on d5 takes away every square from the black king (a6, a8, b6, b7, b8) without giving check. The time bonus for the illegal move is moot, because stalemate has ended the game.'
modelAnswer:
  pl: Remis. Pozostawienie pionka na polu promocji i przełączenie zegara to nieprawidłowe posunięcie, a pionka zamienia się wtedy na hetmana tego samego koloru (art. 7.5.2). Po 1.dxc8=H czarny król na a7 nie stoi w szachu i nie ma żadnego prawidłowego posunięcia — to pat, który natychmiast kończy partię (art. 5.2.1). Późniejsze opadnięcie chorągiewki czarnych nie ma już znaczenia.
  en: A draw. Leaving the pawn on the promotion square and pressing the clock is an illegal move, and the pawn is then replaced by a queen of the same colour (Art. 7.5.2). After 1.dxc8=Q the black king on a7 is not in check and has no legal move — stalemate, which ends the game immediately (Art. 5.2.1). Black's flag falling afterwards no longer matters.
```

- **Id:** `aVnuOEIQ9rnRUXjHfRX1` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 11
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku; potwierdzone silnikiem (białe w szachu od Sc8, po dxc8=H pat)

## 12 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: art-07-nieprawidlowosci
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 12
diagram:
  kind: fen
  fen: 6k1/7p/6b1/8/4P3/6R1/2K5/8 b - - 0 1
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem 20 min + 10 s na posunięcie.
      W pozycji przedstawionej na diagramie zawodnik grający czarnymi wykonał posunięcie 1…Gxe4. Następnie białe odpowiedziały 2.Kb3, po czym czarne zagrały 2…Gd5.
      W tym momencie zawodnik grający białymi zatrzymał zegar i zareklamował nieprawidłowe posunięcie czarnych, twierdząc, że po ruchu 1…Gxe4 król pozostawał pod szachem. W partii nie było wcześniej nieprawidłowych posunięć.
      Jak powinien postąpić sędzia? Odpowiedź uzasadnij.
    explanation: 'W szachach standardowych pozycję przywraca się sprzed pierwszej nieprawidłowości, nawet po wielu posunięciach. W szachach szybkich jest inaczej: przeciwnik ma czas na reklamację tylko do własnego następnego posunięcia. Dlatego zostaje 1…Gxe4 razem z nielegalną pozycją, która z niego wynikła, a liczy się dopiero 2…Gd5 — pierwsza skutecznie zareklamowana nieprawidłowość, więc kończy się bonifikatą, a nie przegraną.'
  en:
    stem: |-
      The game is played at 20 min + 10 s per move.
      In the position shown, Black played 1…Bxe4. White replied 2.Kb3, and Black then played 2…Bd5.
      At this point White stopped the clock and claimed an illegal move by Black, arguing that after 1…Bxe4 Black's king was left in check. There had been no earlier illegal moves in the game.
      What should the arbiter do? Justify your answer.
    explanation: 'In standard play the position is restored to just before the first irregularity, even many moves later. Rapid is different: the opponent can claim only until their own next move. So 1…Bxe4 stands, together with the illegal position it produced, and only 2…Bd5 counts — the first successfully claimed irregularity, so it ends in a time bonus rather than a loss.'
modelAnswer:
  pl: |-
    Tempo 20 min + 10 s to 20 + 10 = 30 minut, czyli szachy szybkie. Nieprawidłowe posunięcie można w nich reklamować tylko do chwili, w której reklamujący wykona własne następne posunięcie (Aneks A.4.2). Posunięcie 1…Gxe4 rzeczywiście było nieprawidłowe — goniec był związany wieżą z g3 — ale białe zagrały potem 2.Kb3, więc tego posunięcia nie można już poprawić. Reklamacji podlega tylko ostatnie posunięcie, 2…Gd5, które też jest nieprawidłowe, bo czarny król nadal stoi w szachu od wieży.
    Sędzia cofa wyłącznie 2…Gd5, dodaje białym jedną minutę (szachy szybkie, art. 7.5.5 w brzmieniu od 01.01.2023), a czarne muszą wykonać prawidłowe posunięcie dotkniętym gońcem (art. 7.5.1 w związku z art. 4.3.1). Jedynym takim ruchem jest 2…Gg6, zasłaniające szacha.
  en: |-
    20 min + 10 s means 20 + 10 = 30 minutes, i.e. rapid. In rapid an illegal move can be claimed only until the claimant makes their own next move (Appendix A.4.2). 1…Bxe4 was indeed illegal — the bishop was pinned by the rook on g3 — but White then played 2.Kb3, so that move can no longer be corrected. Only the last move, 2…Bd5, can be claimed, and it is illegal too, because the black king is still in check from the rook.
    The arbiter takes back only 2…Bd5, adds one minute to White (rapid, Art. 7.5.5 as worded since 1 January 2023), and Black must make a legal move with the touched bishop (Art. 7.5.1 read with Art. 4.3.1). The only such move is 2…Bg6, blocking the check.
```

- **Id:** `DADZVcpbCEwwwX8ZtFg1` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 12
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku; potwierdzone silnikiem (Gxe4 nielegalne — goniec związany; przed 2…Gd5 czarne w szachu, jedyny ruch gońcem to Gg6)

## 13 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: art-04-wykonywanie-posuniec
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 13
diagram:
  kind: fen
  fen: 5rr1/1p1k4/p3bp2/2p1p3/6N1/2P2R1P/PP3PK1/7R w - - 0 1
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem 10 min + 5 s na posunięcie.
      W pozycji przedstawionej na diagramie zawodnik grający białymi wykonał posunięcie 1.Sxf6, nie przełączając jednak zegara. Zawodnik grający czarnymi natychmiast zatrzymał zegar i zareklamował sędziemu, że przeciwnik wykonał nieprawidłowe posunięcie. W partii nie wystąpiły wcześniej żadne nieprawidłowości.
      Jak powinien postąpić sędzia? Odpowiedź uzasadnij.
    explanation: Skoczek g4 osłania białego króla na g2 przed wieżą z g8, więc nie może zejść z linii „g” — dlatego 1.Sxf6 było nieprawidłowe. Gdyby chodziło tylko o skoczka, biały mógłby zagrać dowolnie (art. 4.5). Ale dotknięty został także czarny pionek na f6, a art. 4.3.3 każe go wtedy zbić, jeśli to możliwe — i wieża z f3 może to zrobić.
  en:
    stem: |-
      The game is played at 10 min + 5 s per move.
      In the position shown, White played 1.Nxf6 but did not press the clock. Black immediately stopped the clock and claimed to the arbiter that the opponent had made an illegal move. There had been no earlier irregularities in the game.
      What should the arbiter do? Justify your answer.
    explanation: The knight on g4 shields the white king on g2 from the rook on g8, so it cannot leave the g-file — which is why 1.Nxf6 was illegal. Had only the knight been touched, White could play anything (Art. 4.5). But Black's pawn on f6 was touched as well, and Art. 4.3.3 then requires capturing it if possible — which the rook on f3 can do.
modelAnswer:
  pl: 'Reklamacja nieprawidłowego posunięcia jest bezzasadna: zegar nie został przełączony, więc posunięcie nie zostało zakończone (art. 7.5.1) i biały może je jeszcze naprawić — nie ma bonifikaty. Obowiązuje jednak zasada dotkniętej bierki. Biały dotknął własnego skoczka i czarnego pionka na f6, więc rozstrzyga art. 4.3.3. Skoczek z g4 jest związany wieżą z g8 i nie ma żadnego prawidłowego posunięcia, dlatego biały musi zbić dotkniętego pionka inną bierką — jedynym takim posunięciem jest Wxf6.'
  en: "The illegal-move claim fails: the clock was not pressed, so the move was not completed (Art. 7.5.1) and White may still correct it — there is no time bonus. The touch-move rule applies, though. White touched their own knight and Black's pawn on f6, so Art. 4.3.3 governs. The knight on g4 is pinned by the rook on g8 and has no legal move, so White must capture the touched pawn with another piece — and the only such move is Rxf6."
```

- **Id:** `7kOHcN2urKlAb2oEtiYT` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 13
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku; potwierdzone silnikiem (skoczek g4 związany, bez ruchów; jedyne bicie f6 to Wxf6)

## 14 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: kojarzenie-i-systemy
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 14
content:
  pl:
    stem: Podaj kojarzenie 4. rundy turnieju rozgrywanego systemem kołowym z udziałem 9 zawodników.
    explanation: 'W rundzie 4 tabeli Bergera dla 10 numerów są pary 10–7, 8–6, 9–5, 1–4, 2–3; ponieważ numer 10 to pauza, pauzuje zawodnik nr 7. Uwaga: klucz do tego egzaminu podaje 8 – pauza, 9–7, 1–6, 2–5, 3–4 — to jednak runda 6 tej samej tabeli.'
  en:
    stem: Give the pairings for round 4 of a round-robin tournament with 9 players.
    explanation: 'Round 4 of the Berger table for 10 numbers pairs 10–7, 8–6, 9–5, 1–4, 2–3; as number 10 is the bye, player 7 sits out. Note: the answer key for this exam gives 8 – bye, 9–7, 1–6, 2–5, 3–4 — but that is round 6 of the same table.'
modelAnswer:
  pl: 'Przy 9 zawodnikach korzysta się z tabeli Bergera dla 10 numerów, a numer 10 oznacza pauzę. Runda 4: 7 – pauza, 8–6, 9–5, 1–4, 2–3.'
  en: 'With 9 players the Berger table for 10 numbers is used, number 10 meaning a bye. Round 4: 7 – bye, 8–6, 9–5, 1–4, 2–3.'
```

- **Id:** `rqLoq47rXvr1Kruw97qg` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 14
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** niska — POPRAWIONE względem klucza. Klucz podaje „8-pauza, 9-7, 1-6, 2-5, 3-4”, a to jest runda 6 tabeli Bergera dla 10 numerów. Runda 4 wyliczona generatorem, który odtwarza tabelę 8-osobową z pytania PZSzach 2025#3 w bazie

## 15 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: ranking-i-normy
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 15
content:
  pl:
    stem: |-
      Oblicz zmianę rankingową zawodnika z rankingiem FIDE 1714 na podstawie jego wyników w turnieju 7-rundowym przedstawionych poniżej. Zakładamy, że zawodnik ma współczynnik K = 20 i nie grał żadnych innych partii w analizowanym okresie.

      Runda | Wynik | Ranking FIDE przeciwnika
        1   |  1-0  | 1420
        2   |  ½-½  | 1555
        3   |  0-1  | 1567
        4   |  1-0  | 1648
        5   |  1-0  | 1912
        6   |  ½-½  | —
        7   |  0-1  | 1701
    explanation: Dla każdej partii z przeciwnikiem rankingowym liczy się różnicę rankingów, odczytuje z tabeli FIDE wynik oczekiwany i odejmuje go od wyniku faktycznego. Partia z rundy 6 z przeciwnikiem bez rankingu nie jest liczona. Sumę różnic mnoży się przez współczynnik K, a wynik zaokrągla do pełnego punktu.
  en:
    stem: |-
      Calculate the rating change of a player rated 1714 FIDE from the results of a 7-round tournament shown below. Assume the player has a K-factor of 20 and played no other games in the rating period.

      Round | Score | Opponent's FIDE rating
        1   |  1-0  | 1420
        2   |  ½-½  | 1555
        3   |  0-1  | 1567
        4   |  1-0  | 1648
        5   |  1-0  | 1912
        6   |  ½-½  | —
        7   |  0-1  | 1701
    explanation: For each game against a rated opponent, take the rating difference, read the expected score from the FIDE table and subtract it from the actual score. The round 6 game against an unrated opponent is not counted. The sum of the differences is multiplied by K and the result rounded to a whole point.
modelAnswer:
  pl: |-
    Zmiana: −2,2 punktu, więc na kolejnej liście zawodnik będzie miał 1712.

    Runda | różnica rankingu | wynik oczekiwany | wynik − oczekiwany
      1   |  294 | 0,85 |  0,15
      2   |  159 | 0,71 | −0,21
      3   |  147 | 0,70 | −0,70
      4   |   66 | 0,59 |  0,41
      5   | −198 | 0,24 |  0,76
      6   | przeciwnik bez rankingu — partia nie jest liczona
      7   |   13 | 0,52 | −0,52

    Suma: −0,11. Po uwzględnieniu K = 20: −0,11 × 20 = −2,2. Nowy ranking: 1714 − 2,2 = 1711,8 ≈ 1712.
  en: |-
    Change: −2.2 points, so on the next list the player will be rated 1712.

    Round | rating difference | expected score | score − expected
      1   |  294 | 0.85 |  0.15
      2   |  159 | 0.71 | −0.21
      3   |  147 | 0.70 | −0.70
      4   |   66 | 0.59 |  0.41
      5   | −198 | 0.24 |  0.76
      6   | unrated opponent — the game is not counted
      7   |   13 | 0.52 | −0.52

    Sum: −0.11. With K = 20: −0.11 × 20 = −2.2. New rating: 1714 − 2.2 = 1711.8 ≈ 1712.
```

- **Id:** `v5ScYaDghWeiFmd9xe7F` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 15
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku; wszystkie wyniki oczekiwane zgodne z tabelą FIDE dołączoną do pliku

## 16 — duplikat

- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 16
- **Dedup:** `VLgqOZC3EaWCRnSkrEPE` (PZSzach 2025#6) — do kiedy można reklamować naruszenie zasady dotkniętej bierki — do dotknięcia bierki przez reklamującego, art. 4.8. Ta sama wiedza; tutaj pytanie otwarte.
- **Akcja:** do `sources` istniejącego pytania dopisane `{exam: PZSzach, year: 2026, no: 16}`; treść bez zmian

## 17 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: art-06-zegar-szachowy
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 17
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem 5 minut na zawodnika.
      W trakcie partii sędzia zauważa, że jednemu z zawodników spadła chorągiewka.
      Czy sędzia powinien podjąć interwencję? Jeśli tak, to jaką? W odpowiedzi uwzględnij warunki, które muszą zostać spełnione, aby partia została zakończona z tytułu przekroczenia czasu do namysłu.
    explanation: 'Pytanie sprawdza trzy rzeczy naraz: czy sędzia w ogóle interweniuje (tak — także w szachach błyskawicznych), kiedy przekroczenie czasu staje się faktem (dopiero po stwierdzeniu przez sędziego albo prawidłowej reklamacji) i od czego zależy wynik (od tego, czy przeciwnik ma jakąkolwiek drogę do mata).'
  en:
    stem: |-
      The game is played at 5 minutes per player.
      During the game the arbiter notices that one player's flag has fallen.
      Should the arbiter intervene? If so, how? Include the conditions that must be met for the game to end on time.
    explanation: 'The question tests three things at once: whether the arbiter intervenes at all (yes — in blitz too), when a flag fall becomes a fact (only once the arbiter observes it or a valid claim is made), and what the result depends on (whether the opponent has any path to mate).'
modelAnswer:
  pl: 'Tak. Sędzia, który zauważy opadnięcie chorągiewki, interweniuje i przerywa partię niezależnie od tempa gry — w szachach błyskawicznych wynika to z Aneksu A.4.5 w związku z B.4, a w standardowych z art. 6.8. Przekroczenie czasu nie kończy partii samo z siebie: przyjmuje się, że nastąpiło, dopiero gdy stwierdzi je sędzia albo zawodnik złoży prawidłową reklamację (art. 6.8). Wynik zależy od pozycji końcowej: zawodnik, któremu spadła chorągiewka, przegrywa, chyba że przeciwnik nie może go zamatować żadną serią prawidłowych posunięć — wtedy partia jest remisowa (art. 6.9).'
  en: 'Yes. An arbiter who sees a flag fall intervenes and stops the game, whatever the time control — in blitz this follows from Appendix A.4.5 read with B.4, in standard play from Art. 6.8. A flag fall does not end the game by itself: it counts only once the arbiter observes it or a player makes a valid claim (Art. 6.8). The result depends on the final position: the player whose flag fell loses unless the opponent cannot checkmate them by any series of legal moves, in which case the game is drawn (Art. 6.9).'
```

- **Id:** `bKJiW4DnRpmwb9NJiCSu` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 17
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku

## 18 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: art-11-zachowanie-zawodnikow
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 18
content:
  pl:
    stem: |-
      Partia rozgrywana jest tempem klasycznym podczas indywidualnych mistrzostw województwa. W trakcie rundy zawodnik ustnie zgłasza sędziemu, że jego przeciwnik wielokrotnie opuszcza salę gry, udając się do toalety. Zawodnik podejrzewa, że przeciwnik może korzystać z telefonu komórkowego lub innego niedozwolonego urządzenia elektronicznego.
      Jak powinien postąpić sędzia?
    explanation: Przepisy dają sędziemu narzędzia — może zażądać kontroli ubrania i rzeczy zawodnika (art. 11.3.3), a do jego obowiązków należy dbanie o uczciwą grę (art. 12.2.1) — ale formalna procedura w sprawie podejrzenia oszustwa wymaga pisemnego zgłoszenia. Chroni to zawodników przed oskarżeniami rzucanymi w trakcie partii.
  en:
    stem: |-
      A standard-play game at an individual regional championship. During the round a player tells the arbiter orally that their opponent keeps leaving the playing hall to go to the toilet, and suspects the opponent may be using a mobile phone or another prohibited electronic device.
      What should the arbiter do?
    explanation: The Laws give the arbiter tools — they may require an inspection of the player's clothes and belongings (Art. 11.3.3), and ensuring fair play is part of their duties (Art. 12.2.1) — but the formal procedure for a suspicion of cheating requires a written complaint. This protects players from accusations made in the middle of a game.
modelAnswer:
  pl: Sędzia nie podejmuje formalnej interwencji na podstawie samego ustnego zgłoszenia. Zawodnik, który domaga się interwencji, składa skargę na przewidzianym do tego formularzu. Niezależnie od tego sędzia — stosownie do sytuacji i rangi zawodów — zabezpiecza turniej przed ryzykiem oszustwa.
  en: The arbiter takes no formal action on an oral report alone. A player who wants action taken files a complaint on the form provided for that purpose. Separately, the arbiter — as the situation and the level of the event warrant — protects the tournament against the risk of cheating.
```

- **Id:** `2jLzdVICNChCiooxYh4Q` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 18
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku; procedura fair play FIDE nie jest częścią przekładu Przepisów gry, więc nie da się jej sprawdzić z kodeksem

## 19 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: punktacje-pomocnicze
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 19
content:
  pl:
    stem: |-
      Rozegrano turniej kołowy tempem 60 min dla zawodnika na całą partię. Poniżej przedstawiono tabelę turniejową.

      Nr | Imię     | Kat. | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | Pkt
       1 | Filip    | IV   | X | 0 | ½ | 0 | 1 | 0 | 0 | 1 | 0 | 0  | 2,5
       2 | Bartosz  | III  | 1 | X | 0 | 1 | ½ | 0 | 0 | 1 | ½ | 0  | 4,0
       3 | Iwona    | IV   | ½ | 1 | X | 0 | 1 | 0 | ½ | 1 | 0 | 0  | 4,0
       4 | Daniel   | II+  | 1 | 0 | 1 | X | 1 | 0 | 0 | 1 | ½ | ½  | 5,0
       5 | Jacek    | III  | 0 | ½ | 0 | 0 | X | 0 | 0 | 1 | 0 | 0  | 1,5
       6 | Gabriela | II   | 1 | 1 | 1 | 1 | 1 | X | 0 | 1 | ½ | 0  | 6,5
       7 | Adam     | II   | 1 | 1 | ½ | 1 | 1 | 1 | X | 1 | 0 | 0  | 6,5
       8 | Hubert   | III  | 0 | 0 | 0 | 0 | 0 | 0 | 0 | X | 0 | 0  | 0,0
       9 | Celina   | I    | 1 | ½ | 1 | ½ | 1 | ½ | 1 | 1 | X | 0  | 6,5
      10 | Ewa      | III  | 1 | 1 | 1 | ½ | 1 | 1 | 1 | 1 | 1 | X  | 8,5

      O miejscu w turnieju decyduje suma zdobytych punktów, a w przypadku równości w kolejności:
      1. liczba zwycięstw,
      2. bezpośredni pojedynek,
      3. wartościowanie Sonneborna-Bergera.
      Dokonując odpowiednich obliczeń, ustal klasyfikację miejsc 1–3.
    explanation: Kryteria stosuje się po kolei i tylko do zawodników, których poprzednie nie rozdzieliły. Liczba zwycięstw oddziela Celinę, a bezpośredni pojedynek rozstrzyga między Adamem a Gabrielą — do trzeciego kryterium nie trzeba więc w ogóle sięgać.
  en:
    stem: |-
      A round-robin tournament was played at 60 minutes per player for the whole game. The crosstable is shown below.

      Nr | Name     | Cat. | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | Pts
       1 | Filip    | IV   | X | 0 | ½ | 0 | 1 | 0 | 0 | 1 | 0 | 0  | 2,5
       2 | Bartosz  | III  | 1 | X | 0 | 1 | ½ | 0 | 0 | 1 | ½ | 0  | 4,0
       3 | Iwona    | IV   | ½ | 1 | X | 0 | 1 | 0 | ½ | 1 | 0 | 0  | 4,0
       4 | Daniel   | II+  | 1 | 0 | 1 | X | 1 | 0 | 0 | 1 | ½ | ½  | 5,0
       5 | Jacek    | III  | 0 | ½ | 0 | 0 | X | 0 | 0 | 1 | 0 | 0  | 1,5
       6 | Gabriela | II   | 1 | 1 | 1 | 1 | 1 | X | 0 | 1 | ½ | 0  | 6,5
       7 | Adam     | II   | 1 | 1 | ½ | 1 | 1 | 1 | X | 1 | 0 | 0  | 6,5
       8 | Hubert   | III  | 0 | 0 | 0 | 0 | 0 | 0 | 0 | X | 0 | 0  | 0,0
       9 | Celina   | I    | 1 | ½ | 1 | ½ | 1 | ½ | 1 | 1 | X | 0  | 6,5
      10 | Ewa      | III  | 1 | 1 | 1 | ½ | 1 | 1 | 1 | 1 | 1 | X  | 8,5

      Places are decided by total points and, in case of a tie, in this order:
      1. number of wins,
      2. direct encounter,
      3. Sonneborn-Berger.
      Working through the calculations, determine places 1–3.
    explanation: The criteria are applied in order, and only to the players the previous ones did not separate. The number of wins separates Celina, and the direct encounter settles Adam against Gabriela — so the third criterion is never reached.
modelAnswer:
  pl: |-
    1. Ewa, 2. Adam, 3. Gabriela.
    Ewa ma najwięcej punktów (8,5). Po 6,5 pkt mają Gabriela, Adam i Celina. Liczba zwycięstw: Gabriela 6, Adam 6, Celina 5 — Celina wypada z walki o podium. Gabriela i Adam mają po 6 zwycięstw, więc rozstrzyga bezpośredni pojedynek, który wygrał Adam. Punktacja Sonneborna-Bergera nie jest potrzebna.
  en: |-
    1. Ewa, 2. Adam, 3. Gabriela.
    Ewa has the most points (8.5). Gabriela, Adam and Celina have 6.5 each. Wins: Gabriela 6, Adam 6, Celina 5 — Celina drops out of the podium race. Gabriela and Adam both have 6 wins, so the direct encounter decides, and Adam won it. Sonneborn-Berger is not needed.
```

- **Id:** `IPhadtBS53XtSj2gJlk4` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 19
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku; przeliczone z tabeli (zwycięstwa: Gabriela 6, Adam 6, Celina 5; Adam wygrał z Gabrielą)

## 20 — nowe

```yaml
type: open-ended
level: FA
status: draft
topic: ranking-i-normy
tags:
  - PZSzach
  - '2026'
sources:
  - exam: PZSzach
    year: 2026
    'no': 20
content:
  pl:
    stem: |-
      Rozegrano turniej kołowy tempem 60 min dla zawodnika na całą partię. Poniżej przedstawiono tabelę turniejową.

      Nr | Imię     | Kat. | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | Pkt
       1 | Filip    | IV   | X | 0 | ½ | 0 | 1 | 0 | 0 | 1 | 0 | 0  | 2,5
       2 | Bartosz  | III  | 1 | X | 0 | 1 | ½ | 0 | 0 | 1 | ½ | 0  | 4,0
       3 | Iwona    | IV   | ½ | 1 | X | 0 | 1 | 0 | ½ | 1 | 0 | 0  | 4,0
       4 | Daniel   | II+  | 1 | 0 | 1 | X | 1 | 0 | 0 | 1 | ½ | ½  | 5,0
       5 | Jacek    | III  | 0 | ½ | 0 | 0 | X | 0 | 0 | 1 | 0 | 0  | 1,5
       6 | Gabriela | II   | 1 | 1 | 1 | 1 | 1 | X | 0 | 1 | ½ | 0  | 6,5
       7 | Adam     | II   | 1 | 1 | ½ | 1 | 1 | 1 | X | 1 | 0 | 0  | 6,5
       8 | Hubert   | III  | 0 | 0 | 0 | 0 | 0 | 0 | 0 | X | 0 | 0  | 0,0
       9 | Celina   | I    | 1 | ½ | 1 | ½ | 1 | ½ | 1 | 1 | X | 0  | 6,5
      10 | Ewa      | III  | 1 | 1 | 1 | ½ | 1 | 1 | 1 | 1 | 1 | X  | 8,5

      Proszę obliczyć normy punktowe na kategorie i podać, którzy zawodnicy wypełnili normy na wyższe kategorie.
    explanation: Normę liczy się na kategorię wyższą od posiadanej. Ewa, mając III kategorię, zdobyła 8,5 pkt — więcej niż norma na I kategorię kobiecą (7,5 pkt) — więc wypełnia normę od razu na I kategorię, z pominięciem II. Bartosz z III kategorią ma 4 pkt, czyli tyle, ile wynosi norma na III — ale tę kategorię już posiada.
  en:
    stem: |-
      A round-robin tournament was played at 60 minutes per player for the whole game. The crosstable is shown below.

      Nr | Name     | Cat. | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | Pts
       1 | Filip    | IV   | X | 0 | ½ | 0 | 1 | 0 | 0 | 1 | 0 | 0  | 2,5
       2 | Bartosz  | III  | 1 | X | 0 | 1 | ½ | 0 | 0 | 1 | ½ | 0  | 4,0
       3 | Iwona    | IV   | ½ | 1 | X | 0 | 1 | 0 | ½ | 1 | 0 | 0  | 4,0
       4 | Daniel   | II+  | 1 | 0 | 1 | X | 1 | 0 | 0 | 1 | ½ | ½  | 5,0
       5 | Jacek    | III  | 0 | ½ | 0 | 0 | X | 0 | 0 | 1 | 0 | 0  | 1,5
       6 | Gabriela | II   | 1 | 1 | 1 | 1 | 1 | X | 0 | 1 | ½ | 0  | 6,5
       7 | Adam     | II   | 1 | 1 | ½ | 1 | 1 | 1 | X | 1 | 0 | 0  | 6,5
       8 | Hubert   | III  | 0 | 0 | 0 | 0 | 0 | 0 | 0 | X | 0 | 0  | 0,0
       9 | Celina   | I    | 1 | ½ | 1 | ½ | 1 | ½ | 1 | 1 | X | 0  | 6,5
      10 | Ewa      | III  | 1 | 1 | 1 | ½ | 1 | 1 | 1 | 1 | 1 | X  | 8,5

      Calculate the point norms for the categories and state which players achieved norms for a higher category.
    explanation: A norm is counted for a category above the one the player holds. Ewa, holding category III, scored 8.5 — more than the women's category I norm (7.5) — so she achieves a norm straight for category I, skipping II. Bartosz, holding category III, scored 4 — exactly the category III norm — but he already holds that category.
modelAnswer:
  pl: |-
    Średni ranking turnieju: 1595. Normy punktowe na kategorie:
    — męskie: II kat. 7,5 pkt, III kat. 4 pkt,
    — kobiece: I kat. 7,5 pkt, II kat. 5 pkt, III kat. 3 pkt.
    Normy wypełniły: Iwona — III kategoria (4 pkt przy normie 3 pkt) oraz Ewa — I kategoria (8,5 pkt przy normie 7,5 pkt). Pozostali zawodnicy albo już mają kategorię, na którą wystarczyłby ich wynik, albo nie osiągnęli normy na kategorię wyższą od posiadanej.
  en: |-
    Tournament average rating: 1595. Point norms for the categories:
    — men: category II 7.5 pts, category III 4 pts,
    — women: category I 7.5 pts, category II 5 pts, category III 3 pts.
    Norms were achieved by Iwona — category III (4 pts against a norm of 3) and Ewa — category I (8.5 pts against a norm of 7.5). The other players either already hold the category their score would earn, or did not reach the norm for a category above the one they hold.
```

- **Id:** `yD83xUDQHvTp9YtyahVW` (wstawione 2026-10-06)
- **Źródło:** `pdf/CKS-2026-I.docx`, pytanie 20
- **Dedup:** brak odpowiednika w bazie
- **Pewność:** wysoka — klucz w pliku. Wartości norm pochodzą z klucza (bez tabeli klasyfikacyjnej PZSzach nie da się ich przeliczyć). Ewa z III od razu na I — przeskakiwanie kategorii potwierdził właściciel (2026-10-06). UWAGA: sprzeczne z istniejącym pytaniem L48r7yS0w4NDg6hTPRR0 (WP 2022#29), które zakłada normę tylko na kategorię bezpośrednio wyższą — do poprawki tamto
