# Uwagi Kolegium Sędziów do egzaminu próbnego (2026-10-08)

Egzamin: `exams/JlZxylRZc4SFLaXZmT92` („Egzamin na sędziego szachowego klasy okręgowej – wersja ostateczna”).
Uwagi przewodniczącej Kolegium: pytania 13, 26, 27 za trudne na klasę III i zbyt do siebie podobne (chorągiewka,
martwa pozycja, pat); propozycje prostszych tematów; zadania obliczeniowe dla zdających na klasę II; progi
zaliczenia jak w ZP (III — 80%, II — 85%).

## Podmiany w egzaminie

| Nr  | Było                                                                                  | Jest                                                                        | Nowe pytanie                                   |
| --- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------- |
| 9   | `3mi8siX7VdAOpCZvUmJ2` goniec i skoczek zamienione miejscami (dubel tematu z 2 i 10)  | roszada obiema rękami (7.5.4)                                               | `bkI8NSlEgVHtMCR0xmyz`                         |
| 13  | `i11VjpO8FhlyblGfCi5f` exf8 bez zamiany, pat (za trudne)                              | dotknięta bierka po nieprawidłowym posunięciu (7.5.1 → 4.3)                 | `MSKt6G8ZNJPJA5ukRV2n`                         |
| 14  | `92gIIBd7unNhxOtOSPDd` nieprawidłowy ruch, +2 min (dubel z 18 i 24)                   | błyskawiczne: reklamacja po własnym ruchu (A.4.2) — propozycja Kolegium     | `bTCYnas5PIMrby8ZQGOs`                         |
| 20  | `6RrLgiyBshFSub2IPdFN` chorągiewka, mat przez przemianę → 0–1 (dubel mechanizmu z 27) | dopuszczalny czas spóźnienia na partię (6.7.1)                              | `3a0QpQdWmC3kDlsSYsdj` (z banku, WP 2021/2022) |
| 25  | `VNpQlMQbVbfAd7Cxq0aY` trzykrotne powtórzenie                                         | trzykrotne powtórzenie a utracone prawo do roszady (9.2.2.2)                | `cmDFO3d6DluSjf71S6EY`                         |
| 26  | `NuXDM6llKWceb5650Yp4` gońce różnopolowe (za trudne)                                  | K+G vs K, poddanie po martwej pozycji = remis (5.2.2) — propozycja Kolegium | `qO0yNiOVTA02jUB2QAh6`                         |
| 27  | `VQyF9WnLkItjTs6vtdfF` Kxc8, martwa pozycja (za trudne)                               | chorągiewka: K+W vs K+S → 0–1 (6.9)                                         | `clIlsmCFUFILtcur7qBZ`                         |
| 29  | —                                                                                     | zadanie dla klasy II: Buchholz i Sonneborn-Berger (2 pkt)                   | `ZMpImpOrnTs3bk48YASg`                         |
| 30  | —                                                                                     | zadanie dla klasy II: zmiana rankingu FIDE (2 pkt)                          | `pvfLWKwQNovCqo7Ng0E1`                         |

Pytanie 28 zostaje (z pary 13/28 Kolegium chciało zostawić jedno). W pytaniu z szachów błyskawicznych poprawna
jest odpowiedź A, a w nowym 26 wynik to remis (martwa pozycja kończy partię przed poddaniem).

Kontrola dubli (2026-10-08): nowe pytania nie dublują żadnego pytania z banku. W egzaminie były cztery pytania
z art. 6.9 (19, 20, 27, 28), a 20 i 27 sprawdzały ten sam mechanizm, więc 20 wymienione. Częściowe
pokrewieństwa zostawione świadomie: 9 / 15b / 6 (posunięcia i zegar a ręce), 14 / 22 (termin reklamacji, A.4.2).
Z pytań 9 i 13 usunięto zdanie „to pierwsza nieprawidłowość” — podpowiadało odpowiedź i powtarzało instrukcję
z nagłówka arkusza.

## Zadania obliczeniowe w banku (klasa II, po 2 pkt)

`ZMpImpOrnTs3bk48YASg` Buchholz + SB (szwajcar), `6ZRIdT5D8ARUENbeNIX2` Buchholz Cut-1 (ta sama tabela),
`pvfLWKwQNovCqo7Ng0E1` zmiana rankingu FIDE, `fSroIOrvP3fwnCoUVZHv` Koya (kołowy), `1q8Oz8IxVAxqygK8U7LC` tabele Bergera.

Dane liczone skryptem i sprawdzone pięcioma niezależnymi metodami: asercje generatora, ręczne przeliczenie,
ponowny parsing wydrukowanej tabeli, porównanie rankingu ze wzorem logistycznym (12,0 vs 12,2 z tabeli FIDE) i
strukturą tabel Bergera (zgodne z kluczami WP/PZSzach i oficjalną tabelą dla 10 zawodników). Tabela FIDE
oczekiwanych wyników odtwarza klucz PZSzach 2026#15 co do setnej. W szwajcarze nikt nie gra trzy razy z rzędu
tym samym kolorem. Normy na kategorie PZSzach pominięte — bez tabeli klasyfikacyjnej nie da się ich przeliczyć.
