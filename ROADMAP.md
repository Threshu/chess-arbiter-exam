# Roadmap

Aktualizowany przy każdej zmianie scope. Single source of truth dla planu projektu — `ARCHITECTURE.md` / `DESIGN.md` opisują wciąż kawałki wyciętego scope i będą rewizjonowane stopniowo.

---

## Vision

Publiczna platforma do nauki dla osób przygotowujących się do egzaminu arbitrażowego FIDE (NA / FA / IA). Bilingual PL/EN. Centralna mechanika: **bank pytań różnych typów + tryb praktyki**. Bez trybu egzaminu z timerem.

**Audience:** publiczna apka, każdy może się zarejestrować. Plan na 2-3 miesiące do publicznego launchu z prawdziwymi użytkownikami.

**Hosting:** Firebase Hosting (jeden ekosystem z Firestore/Auth).

---

## Current state (co już działa)

- Nuxt 4 + Vue 3 + Tailwind 4 + TypeScript strict
- Firebase Auth (Google Sign-In)
- Firestore z regułami i indexami (wdrożone do `chess-arbiter-exam`)
- Kolekcje: `users`, `questions`, `practiceAttempts`, `auditLogs`, `settings`
- Bilingual i18n (PL/EN), bilingual content w pytaniach
- Bootstrap admina przez `scripts/grant-admin.ts` (Firebase Admin SDK)
- Admin panel: lista pytań (z publish toggle + delete), formularz dodawania pytania (tylko text type, ABCD radio)
- User dashboard: stats (attempts, correct, accuracy %)
- Practice mode: losowanie wszystkich published pytań, jedno na ekran, radio opcja, feedback z explanation, zapis attempts + update stats

---

## Phase 1 — Data model expansion (typy pytań)

**Cel:** Rozszerzyć schemę i UI o wszystkie typy pytań.

**Typy pytań:**

- `single-choice` — ABCD, jedna poprawna (current, refactor pod nowy schemat)
- `multi-choice` — ABCDE…, wiele poprawnych, ocenianie **all-or-nothing**
- `open-ended` — text input, **bez punktacji**, flow: user pisze → "Pokaż modelową" → modelowa odpowiedź + explanation → next (nie zapisuje się do `practiceAttempts`)
- `fen-static` — pole FEN, renderowane statycznie chessground'em, plus ABCD/multi/open jako mechanika odpowiedzi
- `pgn-interactive` — pole PGN, przewijanie ruchów chess.js, klikanie pól, plus mechanika odpowiedzi

**Schema (proponowany discriminated union):**

```ts
type Question = {
  id: string
  type: 'single-choice' | 'multi-choice' | 'open-ended'
  // visual: czy pytanie ma diagram szachowy
  diagram?: { kind: 'fen'; fen: string } | { kind: 'pgn'; pgn: string }
  content: Bilingual<{ stem: string; explanation?: string; modelAnswer?: string }>
  // options tylko dla *-choice
  options?: { id: string; content: Bilingual<string>; isCorrect: boolean }[]
  topic: string
  tags: string[]
  level: 'NA' | 'FA' | 'IA'
  status: 'draft' | 'published' | 'archived'
  version: number
  createdBy: string
  createdAt
  updatedAt: Timestamp
}
```

**Tasks:**

- Refactor `shared/types/question.ts` + `shared/schemas/question.ts` (Zod discriminated union)
- Refactor `app/pages/admin/questions/new.vue` — selector typu pytania, dynamiczny formularz
- Refactor `app/pages/app/practice/index.vue` — render per type, scoring per type
- Refactor `useAuth.ts` stats — tylko zamknięte typy aktualizują `stats.correct`
- Update Firestore rules dla nowych pól (tags, diagram)

---

## Phase 2 — Chess board integration

**Cel:** Wstawić w pytania interaktywną szachownicę.

**Komponenty:**

- `ChessBoard` (dumb) — wrapper na chessground. Props: `fen`, `interactive: boolean`, `orientation: 'white' | 'black'`, emit `@move`
- `ChessReplay` (smart) — przewijanie ruchów PGN, sterowanie strzałkami / przyciski prev/next/start/end, używa chess.js do walidacji ruchów
- `ChessBoardEditor` (smart) — w admin form, możliwość ustawiania pozycji (drag & drop figur) i export do FEN

**Tasks:**

- Stworzyć `app/components/chess/ChessBoard.vue`
- Stworzyć `app/components/chess/ChessReplay.vue`
- Stworzyć `app/components/chess/ChessBoardEditor.vue`
- Wpiąć do question form (admin) i practice (student)
- Zainstalować `chessground` CSS (jest już w paczce)

---

## Phase 3 — Admin tooling

**Cel:** Pełen CRUD + organizacja.

**Tasks:**

- Edit pytania: `app/pages/admin/questions/[id]/edit.vue` (kopia new.vue z prefill)
- System tagów: kolekcja `tags/` (id, label-bilingual, color), embedded w question. Tag picker (multi-select autocomplete)
- Topic taxonomia: predefiniowane top-levels (`tournament-rules`, `time-control`, `appeals`, `endgame`, etc.) w `settings/topics`
- Filtry/szukajka w `/admin/questions`: po topic, level, status, tag, type, full-text search po stem
- Bulk actions: zaznacz wiele, publish/unpublish/delete naraz

---

## Phase 4 — Practice enhancements

**Cel:** Praktyka adaptywna, historia, lepsze stats.

**Tasks:**

- Strona filtrów przed sesją: `app/pages/app/practice/setup.vue` — wybór levelu, topiców, tagów, typów, źródła (`all`, `unanswered`, `wrong`, `due-for-review`)
- Historia attempts: `app/pages/app/history.vue` — lista przeszłych odpowiedzi z linkami do pytania
- Per-question stats: w admin view per question — ile razy odpowiedziano, % correct, lista ostatnich błędnych odpowiedzi (dla open-ended preview)
- Rozszerzenie `practiceAttempts` schema o `questionType`, `timeSpentMs`, `sessionId`
- (Opcjonalnie) algorytm spaced repetition — pytania z większym błędem wracają częściej

---

## Phase 5 — Public-ready auth

**Cel:** Druga metoda logowania + zarządzanie kontem.

**Tasks:**

- Email/password registration (`/auth/register`) z weryfikacją siły hasła
- Email verification (Firebase wysyła link, user klika, status weryfikacji w users doc)
- Forgot password / reset flow
- User settings (`/app/settings`) — zmiana displayName, locale, delete account (soft delete + queue do hard delete po 30 dniach)
- Wymóg zweryfikowanego emaila dla dostępu do `/app/**` (middleware update)

---

## Phase 6 — Legal & compliance (EU public launch ready)

**Cel:** ToS, Privacy, GDPR.

**Tasks:**

- Strony `/legal/tos`, `/legal/privacy`, `/legal/cookies` (bilingual MD/JSON content)
- Cookie banner (essential only vs essential + analytics)
- GDPR: export user data (download JSON z wszystkimi attempts + profilem), hard delete (skrypt admin + UI prośba)
- Data retention policy (np. usuwanie nieaktywnych kont po 2 latach)
- Audit log viewer w admin (`/admin/audit`)

---

## Phase 7 — Production hardening & launch

**Cel:** Wdrożenie publiczne, monitoring, SEO.

**Tasks:**

- Firebase Hosting deploy (build → deploy)
- Custom domain (jeśli kupiona) + cert SSL
- Error monitoring (Sentry albo Firebase Crashlytics)
- SEO basics: sitemap.xml, robots.txt, OG meta tags, social cards, structured data
- Analytics (Plausible / Umami zamiast Google Analytics — friendlier dla GDPR)
- Performance audit (Lighthouse, bundle size, image optimization)
- Security review (Firebase rules tests, dependency audit, OWASP basics)
- Backup strategy (Firestore export → GCS scheduled)

---

## Out of scope (świadomie wycięte)

- **Tryb egzaminu z timerem** — `examSessions`, `examResults`, anti-cheat events, snapshot pytań, server-authoritative timer, biletów dostępu (`userExamAccess`). Wszystko czeka w git history (commit `68965b1`), można wrócić jeśli kiedyś.
- **Cloud Functions w produkcji** — wymaga Blaze plan. `setUserRole` (kod gotowy) wgramy gdy będzie potrzeba nadawania ról z UI. Na razie bootstrap przez skrypt.
- **Native mobile app** — w przyszłości, ale Nuxt PWA powinien wystarczyć.
- **Masowy import pytań (CSV/JSON, PDF parser, AI assist)** — gdy baza urośnie ponad ~500 pytań.
- **Subskrypcje / monetyzacja** — open question, decyzja po launchu.
- **Leaderboard / ranking publiczny** — może w przyszłości jako opt-in feature.
- **Certyfikaty PDF** — bez exam mode nie ma sensu.

---

## Open questions (do decyzji w trakcie)

- **Wybór: stats całkowicie czy tylko dla zamkniętych?** Aktualna decyzja: tylko zamknięte. Open-ended bez punktacji.
- **Tag taxonomia: open-ended (user-defined) czy admin-managed (curated lista)?** Domyślnie: admin-managed.
- **Spaced repetition algorytm?** Może po Phase 4 podstawowej.
- **Czy admin może być wielo-poziomowy** (np. "editor pytań" vs "super admin")? Rozważać po Phase 5.
