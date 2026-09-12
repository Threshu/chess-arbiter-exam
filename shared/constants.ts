export const FIRESTORE_REGION = 'europe-west3' as const

export const SUPPORTED_LOCALES = ['pl', 'en'] as const
export const DEFAULT_LOCALE = 'pl' as const

export const LEVELS = ['NA', 'FA', 'IA'] as const

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
