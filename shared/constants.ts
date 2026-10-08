export const FIRESTORE_REGION = 'europe-west3' as const

export const SUPPORTED_LOCALES = ['pl', 'en'] as const
export const DEFAULT_LOCALE = 'pl' as const

/**
 * Klasy sedziowskie od najnizszej: mlodziezowa (po 18. roku zycia przechodzi w III), III, II, I,
 * panstwowa, a potem tytuly FIDE. Pytanie ma jedna klase — najnizsza, na ktorej egzaminie ma sens;
 * egzamin na dana klase obejmuje tez wszystkie pytania z klas nizszych.
 */
export const LEVELS = ['youth', 'III', 'II', 'I', 'national', 'FA', 'IA'] as const
export type Level = (typeof LEVELS)[number]

/** Czy pytanie klasy `question` nalezy do egzaminu na klase `exam` (czyli nie jest od niej wyzsze). */
export function levelWithin(question: Level, exam: Level): boolean {
  return LEVELS.indexOf(question) <= LEVELS.indexOf(exam)
}

/**
 * Tematyka pytania wg struktury Przepisow gry FIDE w polskim przekladzie PZSzach
 * (wersja obowiazujaca od 1 stycznia 2018). Ostatnie cztery pozycje leza poza Przepisami gry —
 * kojarzenie, punktacje pomocnicze, ranking i organizacja turnieju maja wlasne, odrebne przepisy.
 *
 * Jedno pytanie ma dokladnie jeden temat glowny — to on napedza
 * wybor zakresu w trybie praktyki. Cechy poprzeczne (diagram, obliczenia, rodzaj tempa)
 * opisuja `tags`, ktore moga wystepowac wielokrotnie.
 *
 * Etykiety w obu jezykach zyja w i18n pod kluczem `topics.<slug>` — nie w dokumencie pytania,
 * bo baza jest dwujezyczna, a zmiana nazwy tematu ma byc edycja jednego pliku, nie 115 dokumentow.
 */
export const TOPICS = [
  'art-01-istota-i-cel',
  'art-02-poczatkowa-pozycja',
  'art-03-posuniecia-bierek',
  'art-04-wykonywanie-posuniec',
  'art-05-zakonczenie-partii',
  'art-06-zegar-szachowy',
  'art-07-nieprawidlowosci',
  'art-08-zapis-przebiegu-partii',
  'art-09-partia-remisowa',
  'art-10-punktacja',
  'art-11-zachowanie-zawodnikow',
  'art-12-rola-sedziego',
  'aneks-a-szachy-szybkie',
  'aneks-b-gra-blyskawiczna',
  'aneks-c-notacja-algebraiczna',
  'aneks-d-zawodnicy-niewidomi',
  'wytyczne-i-partie-odlozone',
  'wytyczne-ii-chess960',
  'wytyczne-iii-szybki-finisz',
  'kojarzenie-i-systemy',
  'punktacje-pomocnicze',
  'ranking-i-normy',
  'organizacja-turnieju',
] as const

export type Topic = (typeof TOPICS)[number]

/** Grupy tematow odpowiadajace czesciom kodeksu — uzywane do podzialu list wyboru. */
export const TOPIC_GROUPS = [
  {
    key: 'podstawowe-przepisy',
    topics: [
      'art-01-istota-i-cel',
      'art-02-poczatkowa-pozycja',
      'art-03-posuniecia-bierek',
      'art-04-wykonywanie-posuniec',
      'art-05-zakonczenie-partii',
    ],
  },
  {
    key: 'zasady-turniejowe',
    topics: [
      'art-06-zegar-szachowy',
      'art-07-nieprawidlowosci',
      'art-08-zapis-przebiegu-partii',
      'art-09-partia-remisowa',
      'art-10-punktacja',
      'art-11-zachowanie-zawodnikow',
      'art-12-rola-sedziego',
    ],
  },
  {
    key: 'aneksy-i-wytyczne',
    topics: [
      'aneks-a-szachy-szybkie',
      'aneks-b-gra-blyskawiczna',
      'aneks-c-notacja-algebraiczna',
      'aneks-d-zawodnicy-niewidomi',
      'wytyczne-i-partie-odlozone',
      'wytyczne-ii-chess960',
      'wytyczne-iii-szybki-finisz',
    ],
  },
  {
    key: 'poza-przepisami-gry',
    topics: [
      'kojarzenie-i-systemy',
      'punktacje-pomocnicze',
      'ranking-i-normy',
      'organizacja-turnieju',
    ],
  },
] as const

/**
 * Naglowki arkuszy egzaminacyjnych, przepisane z pierwszych stron PDF-ow w
 * `content/imports/pdf/`. Klucz to `<exam> <year>` z pola `sources` pytania.
 *
 * Nie w i18n, bo to nazwy wlasne konkretnych dokumentow — tlumaczenie "Egzamin na klase
 * okregowa" na angielski dawaloby tytul, ktory nigdy nie istnial. Arkusz bez wpisu tutaj
 * wyswietla sie jako samo `<exam> <year>`, wiec nowy import nie znika z archiwum.
 *
 * WP 2017 i WP 2021 maja w PDF-ie rozjechany cmap (tekst wychodzi jako "centrainq klas^
 * s^dziowskg") — te dwa tytuly odczytano z renderu strony, nie z warstwy tekstowej.
 * PZSzach 2025 to skan bez warstwy tekstowej, odczytany tak samo; na arkuszu nie ma daty.
 */
export const EXAM_SHEETS: Record<string, { title: string; dateline?: string }> = {
  'WP 2017': {
    title: 'Egzamin na centralną klasę sędziowską',
    dateline: 'Poznań, 21 maja 2017 r.',
  },
  'WP 2021': {
    title: 'Egzamin na klasę okręgową',
    dateline: 'Poznań, 21 sierpnia 2021 r.',
  },
  'WP 2022': {
    title: 'Egzamin na sędziego szachowego klasy okręgowej',
    dateline: 'Poznań, 22.10.2022 r.',
  },
  'WP 2023': {
    title: 'Egzamin na sędziego szachowego klasy okręgowej',
    dateline: 'Poznań, 19.08.2023 r.',
  },
  'WP 2025': {
    title: 'Egzamin na sędziego szachowego klasy okręgowej',
    dateline: 'Poznań, 20.09.2025 r.',
  },
  'PZSzach 2025': {
    title: 'Centralny kurs sędziowski 2025 — egzamin na klasę państwową',
  },
  // Plik CKS-2026-I.docx nie ma nagłówka; tytuł przyjęty wzorem PZSzach 2025 (decyzja właściciela).
  'PZSzach 2026': {
    title: 'Centralny kurs sędziowski 2026 — egzamin na klasę państwową',
  },
}

export function examSheetHeading(exam: string, year: number) {
  return EXAM_SHEETS[`${exam} ${year}`] ?? { title: `${exam} ${year}` }
}
