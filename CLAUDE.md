# Chess Arbiter Exam — Claude Code Notes

## AI Assistant Feature (PAUSED)

Funkcja asystenta AI została zaimplementowana ale jest tymczasowo wyłączona z UI.
Wszystkie pliki pozostają w repozytorium — wystarczy przywrócić linki nawigacyjne i odkomentować komponenty.

### Co zostało zbudowane

**Architektura:**

- Gemini API (Google AI Studio) wywoływane bezpośrednio z przeglądarki (REST API)
- Baza wiedzy (`knowledgeBase` w Firestore) wstrzykiwana do system promptu (RAG)
- Kontekst bieżącego pytania wstrzykiwany przy asystencie w sesji ćwiczeń

**Pliki:**

- `app/pages/app/assistant.vue` — strona `/app/assistant` (samodzielny czat)
- `app/components/assistant/AssistantChat.vue` — komponent czatu (wielokrotnego użytku)
- `app/components/practice/PracticeAssistant.vue` — panel asystenta pod pytaniem w sesji
- `app/composables/useAssistant.ts` — logika: wywołanie Gemini API, fetchKnowledge, buildSystemPrompt
- `app/pages/admin/knowledge/index.vue` — lista artykułów w bazie wiedzy (admin)
- `app/pages/admin/knowledge/new.vue` — formularz dodawania artykułu (admin)
- `functions/src/assistant/askAssistant.ts` — Cloud Function (alternatywna implementacja, nieużywana)
- `shared/types/assistant.ts` — typy: ChatMessage, QuestionContext, AskRequest, AskResponse

**i18n:** klucze `assistant.*` w `app.json`, `nav.assistant` w `common.json`, `knowledge.*` w `admin.json`

### Co trzeba zrobić żeby aktywować

1. **Klucz Gemini API z billingiem** — obecny projekt AI Studio (`934307209803`) ma `limit: 0` na free tier.
   Trzeba albo włączyć billing na tym projekcie, albo użyć klucza z innego projektu który ma darmowy tier.
   Klucz ustawiany przez `NUXT_PUBLIC_GEMINI_API_KEY` w `.env`.

2. **Przywrócić UI** — odkomentować/przywrócić w tych miejscach:
   - `app/components/layout/AppHeader.vue` — link `nav.assistant` (dla zalogowanych)
   - `app/pages/app/index.vue` — przycisk `dashboard.assistantCta` prowadzący do `/app/assistant`
   - `app/pages/app/practice/session.vue` — `<PracticeAssistant>` (jest zakomentowany)
   - `app/layouts/admin.vue` — nav item `knowledge` i jego SVG ikona

3. **Wdrożyć reguły Firestore** — zaktualizowane reguły w `firestore.rules` zezwalają zalogowanym
   użytkownikom na odczyt `knowledgeBase`. Wymagają deployu: `firebase deploy --only firestore`.

4. **Wypełnić bazę wiedzy** — przez panel `/admin/knowledge` dodać artykuły z przepisami FIDE,
   opisami sytuacji sędziowskich itd. Im więcej treści, tym lepszy kontekst dla asystenta.

### Problemy napotkane podczas implementacji

- Vertex AI (oryginalna implementacja) nie działał — Cloud Function Service Account nie miał roli
  `roles/aiplatform.user` lub API nie było włączone. Porzucony na rzecz bezpośredniego wywołania Gemini API.
- Korporacyjny proxy SSL blokuje połączenia Node.js z Google (Firebase CLI, emulatory).
  Nie dotyczy przeglądarki — dlatego Gemini API jest wywoływane client-side.
- Firebase Functions emulator wymaga Javy 21+ (brakuje na maszynie deweloperskiej).

### Alternatywna implementacja (Cloud Function)

`functions/src/assistant/askAssistant.ts` to działająca implementacja server-side.
Używa `@google/generative-ai` z kluczem z `process.env.GEMINI_API_KEY`.
Wymaga wdrożenia funkcji i ustawienia klucza jako zmiennej środowiskowej funkcji.
Nie jest aktualnie używana — app wywołuje Gemini bezpośrednio z przeglądarki.
