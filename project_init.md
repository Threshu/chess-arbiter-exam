─── BEGIN PROMPT ───

# CHESS-ARBITER — Phase 0 scaffolding

You are scaffolding a production Vue/Nuxt 4 + Firebase application: a chess referee training and exam platform. This is the **foundation phase only** — no business logic, no chess components, no exam logic. You are producing a booting application skeleton with auth, i18n, design tokens, primitive components, middleware, testing harness, and CI.

## EXECUTION RULES — read first

1. Use **pnpm** as the package manager. Run `corepack enable` if needed.
2. Require **Node 20 LTS**; add `.nvmrc` early.
3. Use **TypeScript strict mode** everywhere. No `any` without an inline comment justifying it.
4. Work through phases **A → F below in order**. After each phase, run the verification commands listed and **stop. Report results to me before starting the next phase.**
5. **Never** invent a library or version. If a dependency name or version is unclear, ask.
6. **Never** commit credentials. `.env` is gitignored; only `.env.example` is committed.
7. Use **Conventional Commits**. Commit after each phase with a clear message.
8. If a verification step fails, **stop and ask**. Do not work around it silently.
9. Do not implement features outside this prompt's scope, even if "obvious." This is a scaffold, not an app.

## PROJECT CONTEXT (compressed)

**Product:** chess referee certification platform. Users: students preparing for arbiter exams, admins managing content, future authors.

**MVP features (NOT in this scaffold — listed for context only):** bilingual question bank, practice mode with instant feedback, manually-composed exams with session-based runtime, server-authoritative timer, anti-cheat event logging, results & rankings.

**Out of MVP entirely:** certificates, automated exam composition, editorial workflow, public CMS.

**This scaffold delivers:** booting Nuxt app, Firebase Auth (Google) wired up, i18n (PL/EN) configured, design system tokens + primitives, layouts (default/admin/exam), middleware (auth/admin/exam-lock), folder structure for all features, Firestore rules + indexes from architecture, Cloud Functions skeleton, Vitest + Playwright + rules-tests harness, ESLint + Prettier + Husky + commitlint, GitHub Actions CI.

## STACK (locked — do not substitute)

- **Frontend:** Nuxt 4 (latest), Vue 3, TypeScript strict, Tailwind CSS 4 (CSS-first), Pinia, VueFire, `@nuxtjs/i18n`
- **UI primitives:** `reka-ui` (headless accessible)
- **Chess (declared, not implemented in scaffold):** `chess.js`, `chessground`
- **Validation:** `zod` (shared between client and Cloud Functions)
- **Backend:** Firebase — Auth (Google + email-link), Firestore, Cloud Functions Gen 2, Storage, Hosting
- **Region:** `europe-west3` (Frankfurt) for all Firebase services
- **Testing:** Vitest, `@firebase/rules-unit-testing`, `firebase-functions-test`, Playwright
- **Quality:** ESLint flat config, Prettier, Husky, lint-staged, commitlint
- **CI:** GitHub Actions

## REPOSITORY LAYOUT (target)

Create exactly this structure. Empty directories get `.gitkeep`.

```
chess-arbiter/
├── .github/workflows/ci.yml
├── .husky/{pre-commit,commit-msg}
├── app/                                # Nuxt 4 srcDir
│   ├── assets/{main.css,tokens.css}
│   ├── components/
│   │   ├── ui/{UiButton,UiInput,UiCard}.vue
│   │   ├── chess/.gitkeep
│   │   ├── question/.gitkeep
│   │   ├── exam/.gitkeep
│   │   ├── practice/.gitkeep
│   │   ├── admin/.gitkeep
│   │   └── layout/AppHeader.vue
│   ├── composables/{useAuth,useServerTime,useLocalized}.ts
│   ├── layouts/{default,admin,exam}.vue
│   ├── middleware/{auth.global,admin,exam-lock}.ts
│   ├── pages/
│   │   ├── index.vue
│   │   ├── about.vue
│   │   ├── auth/{login,callback}.vue
│   │   ├── app/index.vue
│   │   └── admin/index.vue
│   ├── plugins/{firebase.client,vuefire.client}.ts
│   ├── stores/{auth,ui}.ts
│   ├── utils/{localized,time,shuffle}.ts
│   └── app.vue
├── shared/
│   ├── types/{user,question,exam,session}.ts
│   ├── schemas/{question,exam,session}.ts
│   └── constants.ts
├── functions/
│   ├── src/
│   │   ├── exams/{startExamSession,submitExamSession,scoreExamSession,publishExam}.ts
│   │   ├── access/{grantExamAccess,revokeExamAccess}.ts
│   │   ├── admin/setUserRole.ts
│   │   ├── scheduled/sweepExpiredSessions.ts
│   │   ├── triggers/onAuthCreate.ts
│   │   ├── lib/{auth,firestore}.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── i18n/
│   ├── locales/
│   │   ├── pl/{common,auth,landing}.json
│   │   └── en/{common,auth,landing}.json
│   └── README.md
├── content/.gitkeep
├── tests/
│   ├── unit/.gitkeep
│   ├── rules/README.md
│   ├── functions/.gitkeep
│   └── e2e/README.md
├── scripts/i18n-check.ts
├── public/
├── .editorconfig
├── .env.example
├── .gitignore
├── .firebaserc
├── .nvmrc
├── .prettierrc
├── ARCHITECTURE.md
├── CONVENTIONS.md
├── DESIGN.md
├── README.md
├── commitlint.config.js
├── eslint.config.mjs
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── nuxt.config.ts
├── package.json
├── playwright.config.ts
├── pnpm-workspace.yaml
├── storage.rules
├── tsconfig.json
├── vitest.config.ts
└── vitest.rules.config.ts
```

## CANONICAL CONTENT (use verbatim where given)

The blocks below are the source of truth. Where I give exact content, use it. Where I give structure, generate prose that matches the structure.

### Firestore data model (for `ARCHITECTURE.md` and types/schemas)

Top-level collections:

- **`users/{uid}`** — `email`, `displayName`, `photoURL`, `locale: 'pl'|'en'`, `role: 'student'|'admin'` (mirrored in custom claim), `createdAt`, `lastLoginAt`.
- **`userExamState/{uid}`** — singleton per user. `activeSessionId: string|null`, `updatedAt`. Used for single-active-session lock.
- **`userExamAccess/{accessId}`** — admin-granted access tickets. `userId`, `examId`, `grantedBy`, `grantedAt`, `status: 'allowed'|'revoked'|'consumed'`, `attemptCount`, `sessionIds: string[]`.
- **`questions/{questionId}`** — `type: 'text'|'image'|'fen'|'pgn'`, `content: {pl, en}` (each with `stem`, optional `explanation`), optional `mediaUrl`, optional `fen`, optional `pgn`, `options: [{id, content: {pl, en}, isCorrect}]`, `topic`, `level: 'NA'|'FA'|'IA'`, `status: 'draft'|'published'|'archived'`, `version`, `createdBy`, `createdAt`, `updatedAt`.
- **`exams/{examId}`** — `title: {pl, en}`, `description: {pl, en}`, `questionIds: string[]`, `durationMinutes`, `passThresholdPercent`, `maxAttempts`, `level: 'NA'|'FA'|'IA'`, `language: 'pl'|'en'|'both'`, `status: 'draft'|'published'|'archived'`, `availableFrom`, `availableTo`, `createdBy`, `createdAt`, `updatedAt`, `publishedAt`.
  - **Subcollection `exams/{examId}/snapshot/v1`** — immutable: `publishedAt`, `questions: [...]` (full frozen question docs including `isCorrect`).
- **`examSessions/{sessionId}`** — `userId`, `examId`, `examSnapshotVersion`, `status: 'created'|'active'|'completed'|'scored'|'expired'|'invalidated'`, `startedAt`, `expiresAt`, `submittedAt`, `scoredAt`, `questionOrder: string[]`, `optionOrders: {[qid]: string[]}`, `result: {correctCount, totalCount, percentage, passed} | null`, `lastHeartbeatAt`, `clientMeta: {userAgent, locale, ipHash}`, optional `invalidationReason`, `invalidatedBy`.
  - **Subcollection `examSessions/{sid}/answers/{questionId}`** — `selectedOptionId`, `answeredAt`, optional `clientTimeSpentMs`.
  - **Subcollection `examSessions/{sid}/events/{eventId}`** — `type` (one of: `tab_blur`, `tab_focus`, `fullscreen_exit`, `fullscreen_enter`, `copy_attempt`, `paste_attempt`, `context_menu_attempt`, `devtools_open_suspected`, `heartbeat_late`, `network_offline`), `timestamp`, optional `metadata`.
- **`examResults/{resultId}`** — denormalized for queries. `userId`, `examId`, `sessionId`, `userDisplayName`, `examTitle: {pl, en}`, `score`, `percentage`, `passed`, `completedAt`, `level`.
- **`auditLogs/{logId}`** — `actor`, `action`, `targetType`, `targetId`, `timestamp`, optional `diff`.
- **`settings/global`** — singleton: `allowedLanguages`, `defaultLocale`, `featureFlags`.

### Cloud Functions inventory

Callable HTTPS (Gen 2, region `europe-west3`):
- `startExamSession({ examId })` — verify access, single-session lock (transaction), build randomized question/option orders, write session, return sanitized snapshot.
- `submitExamSession({ sessionId })` — mark `completed`, set `submittedAt`.
- `scoreExamSession({ sessionId })` — idempotent; reads snapshot, scores, writes result + `examResults`.
- `publishExam({ examId })` — admin only; validates, creates immutable `snapshot/v1`, sets `publishedAt`.
- `grantExamAccess({ userId, examId })` — admin only.
- `revokeExamAccess({ accessId })` — admin only.
- `setUserRole({ uid, role })` — admin only; sets custom claim.
- `invalidateExamSession({ sessionId, reason })` — admin only.

Triggers:
- `onAuthCreate` — Auth trigger; create `users/{uid}` doc.
- `onSchedule` every 5 min — `sweepExpiredSessions`: find `status=='active' AND expiresAt < now - 60s` and auto-submit.
- Firestore `onWrite examSessions/{sid}` — if status transitions to `completed`, trigger scoring.

All function bodies are **stubs** in this scaffold: validate input with Zod, assert auth/role, return `{ status: 'not_implemented' }`, and include `// TODO(phase-N):` comment referencing the roadmap phase.

### Firestore rules (write verbatim into `firestore.rules`)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() { return request.auth != null; }
    function isAdmin()    { return isSignedIn() && request.auth.token.role == 'admin'; }
    function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }

    match /users/{uid} {
      allow read: if isOwner(uid) || isAdmin();
      allow update: if isOwner(uid)
        && request.resource.data.diff(resource.data).affectedKeys()
             .hasOnly(['displayName', 'locale', 'photoURL']);
      allow create, delete: if false;
    }

    match /userExamState/{uid} {
      allow read: if isOwner(uid) || isAdmin();
      allow write: if false;
    }

    match /userExamAccess/{accessId} {
      allow read: if isAdmin()
        || (isSignedIn() && resource.data.userId == request.auth.uid);
      allow write: if false;
    }

    match /questions/{qid} {
      allow read: if isAdmin()
        || (isSignedIn() && resource.data.status == 'published');
      allow create, update, delete: if isAdmin();
    }

    match /exams/{eid} {
      allow read: if isAdmin()
        || (isSignedIn() && resource.data.status == 'published');
      allow write: if isAdmin()
        && request.resource.data.status != 'published';

      match /snapshot/{v} {
        allow read, write: if false;
      }
    }

    match /examSessions/{sid} {
      allow read: if isAdmin() || resource.data.userId == request.auth.uid;
      allow write: if false;

      match /answers/{qid} {
        allow read: if isAdmin()
          || get(/databases/$(database)/documents/examSessions/$(sid))
               .data.userId == request.auth.uid;
        allow create, update: if
          get(/databases/$(database)/documents/examSessions/$(sid)).data.userId == request.auth.uid
          && get(/databases/$(database)/documents/examSessions/$(sid)).data.status == 'active'
          && get(/databases/$(database)/documents/examSessions/$(sid)).data.expiresAt > request.time
          && request.resource.data.keys().hasOnly(['selectedOptionId', 'answeredAt', 'clientTimeSpentMs'])
          && request.resource.data.selectedOptionId is string;
        allow delete: if false;
      }

      match /events/{eid} {
        allow read: if isAdmin()
          || get(/databases/$(database)/documents/examSessions/$(sid))
               .data.userId == request.auth.uid;
        allow create: if
          get(/databases/$(database)/documents/examSessions/$(sid)).data.userId == request.auth.uid
          && get(/databases/$(database)/documents/examSessions/$(sid)).data.status == 'active'
          && request.resource.data.type is string;
        allow update, delete: if false;
      }
    }

    match /examResults/{rid} {
      allow read: if isAdmin() || resource.data.userId == request.auth.uid;
      allow write: if false;
    }

    match /auditLogs/{lid} {
      allow read: if isAdmin();
      allow write: if false;
    }

    match /settings/{doc} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}
```

### Firestore indexes (`firestore.indexes.json`)

Composite indexes required:
- `questions` — `(status ASC, level ASC, topic ASC)`
- `userExamAccess` — `(userId ASC, status ASC)`
- `userExamAccess` — `(examId ASC, status ASC)`
- `examSessions` — `(userId ASC, status ASC)`
- `examSessions` — `(examId ASC, status ASC)`
- `examResults` — `(examId ASC, percentage DESC)`
- `examResults` — `(userId ASC, completedAt DESC)`

### Storage rules (`storage.rules`)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /question-images/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### Design tokens (`app/assets/tokens.css` — Tailwind v4 `@theme` block)

```
@theme {
  --color-bg: #FAF7F2;
  --color-fg: #0F1115;
  --color-surface: #F5F0E8;
  --color-border: #DCD5C8;
  --color-muted: #6B6A66;

  --color-primary: #1A2D4D;
  --color-primary-fg: #FAF7F2;

  --color-success: #5A7850;
  --color-danger: #A53C32;
  --color-warning: #B5832C;

  --font-display: "Fraunces", ui-serif, Georgia, serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 200ms;
}

.dark {
  --color-bg: #0F1115;
  --color-fg: #F5F0E8;
  --color-surface: #161A21;
  --color-border: #2A2F38;
  --color-muted: #8A8B90;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### `nuxt.config.ts` (key fields)

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },
  srcDir: 'app/',
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],
  css: ['~/assets/main.css'],
  vite: { plugins: [ /* @tailwindcss/vite */ ] },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'pl',
    locales: [
      { code: 'pl', language: 'pl-PL', name: 'Polski', files: ['pl/common.json', 'pl/auth.json', 'pl/landing.json'] },
      { code: 'en', language: 'en-US', name: 'English', files: ['en/common.json', 'en/auth.json', 'en/landing.json'] },
    ],
    langDir: 'locales',
    lazy: true,
  },
  routeRules: {
    '/':         { prerender: true },
    '/about':    { prerender: true },
    '/auth/**':  { ssr: false },
    '/app/**':   { ssr: false },
    '/admin/**': { ssr: false },
  },
  runtimeConfig: {
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
      useEmulators: false,
    },
  },
  typescript: { strict: true, typeCheck: false },
})
```

### `firebase.json`

```json
{
  "firestore": { "rules": "firestore.rules", "indexes": "firestore.indexes.json" },
  "storage":   { "rules": "storage.rules" },
  "hosting": {
    "public": ".output/public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/200.html" }],
    "cleanUrls": true
  },
  "functions": [{
    "source": "functions",
    "codebase": "default",
    "runtime": "nodejs20",
    "predeploy": ["pnpm --filter functions build"]
  }],
  "emulators": {
    "auth":      { "port": 9099 },
    "firestore": { "port": 8080 },
    "functions": { "port": 5001 },
    "storage":   { "port": 9199 },
    "hosting":   { "port": 5000 },
    "ui":        { "enabled": true, "port": 4000 },
    "singleProjectMode": true
  }
}
```

### `.firebaserc`

```json
{
  "projects": {
    "default": "chess-arbiter-dev",
    "dev": "chess-arbiter-dev",
    "prod": "chess-arbiter-prod"
  }
}
```

### Required npm scripts (root `package.json`)

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "typecheck": "nuxt typecheck && pnpm --filter functions typecheck",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "test": "pnpm test:unit && pnpm test:rules && pnpm --filter functions test",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:rules": "firebase emulators:exec --only firestore \"vitest run --config vitest.rules.config.ts\"",
    "test:e2e": "playwright test",
    "i18n:check": "tsx scripts/i18n-check.ts",
    "emulators": "firebase emulators:start --import=./.data --export-on-exit",
    "deploy:dev": "firebase deploy --project dev",
    "deploy:prod": "firebase deploy --project prod",
    "prepare": "husky"
  }
}
```

### `lint-staged` config (in `package.json`)

```json
{
  "lint-staged": {
    "*.{ts,vue,js}": ["eslint --fix"],
    "*.{ts,vue,js,json,md,css}": ["prettier --write"]
  }
}
```

### Naming conventions (enforce in `CONVENTIONS.md` and ESLint where possible)

- `Ui*` for design-system primitives (`UiButton`, `UiInput`).
- `App*` for app shells (`AppHeader`).
- `Chess*`, `Question*`, `Exam*`, `Practice*`, `Admin*` for domain components.
- Composables: `useX` (camelCase).
- Pinia stores: file `auth.ts` exports `useAuthStore`.
- Types: PascalCase. Type imports always use `import type`.

### `<script setup>` ordering rule

```
1. imports
2. defineProps / defineEmits (typed via interfaces)
3. composables / stores
4. reactive state (ref/reactive)
5. computed
6. watch / onMounted / lifecycle
7. methods
8. exposed helpers (defineExpose at bottom)
```

### Hard rules (write into `CONVENTIONS.md`)

- No hex colors in components — use tokens (`bg-primary`, `text-fg`, etc.).
- No `any` without an inline `// reason:` comment.
- All `{pl, en}` content rendered through `localized()`.
- All Cloud Function inputs validated with Zod before any side effect.
- Firestore rules updates always paired with a rules test (positive + negative).
- Dumb components never import stores; smart wrappers do.
- No business logic in components — extract to composables/utils.
- Conventional Commits required (commitlint enforces).

---

## EXECUTION PLAN

### PHASE A — Project init

1. Create `package.json` (private, type `module`, packageManager pnpm@latest).
2. Create `pnpm-workspace.yaml` with packages `[ '.', 'functions' ]`.
3. Create `.nvmrc` containing `20.18.0`.
4. Create `.gitignore` covering: `node_modules`, `.nuxt`, `.output`, `dist`, `lib`, `.env`, `.env.*` (except `.env.example`), `.data`, `.firebase`, `*.log`, `coverage`, `.DS_Store`, `playwright-report`, `test-results`.
5. Create `.editorconfig` (LF, UTF-8, 2-space indent, trim trailing whitespace, final newline).
6. Create `.env.example` with all `NUXT_PUBLIC_FIREBASE_*` keys (empty values) + `NUXT_PUBLIC_USE_EMULATORS=true`.
7. `git init`. Initial commit: `chore: project init`.

**Verify:** `pnpm install` runs without error.

**STOP. Report and wait.**

### PHASE B — Install dependencies

Install root **production** deps:
`nuxt@latest vue @nuxtjs/i18n @pinia/nuxt pinia @nuxt/icon @nuxt/image @nuxt/content @vueuse/nuxt firebase vuefire reka-ui chess.js chessground zod date-fns`

Root **dev** deps:
`typescript @nuxt/eslint eslint eslint-plugin-vuejs-accessibility prettier prettier-plugin-tailwindcss tailwindcss@^4 @tailwindcss/vite vitest @vue/test-utils @vitest/coverage-v8 jsdom @firebase/rules-unit-testing @playwright/test husky lint-staged @commitlint/cli @commitlint/config-conventional firebase-tools tsx`

In `functions/`:
- `firebase-admin firebase-functions zod` (production)
- `typescript @types/node firebase-functions-test vitest` (dev)

After install, run `nuxt prepare` to generate `.nuxt/tsconfig.json`.

**Verify:** `pnpm install` clean. `pnpm dev` boots Nuxt and serves a default blank page on `http://localhost:3000` (no errors in terminal or browser console).

**STOP. Report and wait.**

### PHASE C — Configuration files

Create all config files using the canonical content above:

- `nuxt.config.ts` (incl. `@tailwindcss/vite` plugin wired into `vite.plugins`)
- `tsconfig.json` (extends `.nuxt/tsconfig.json`, paths alias `~/shared/*` → `./shared/*`)
- `functions/tsconfig.json` (strict, ES2022, NodeNext)
- `functions/package.json` with scripts `build`, `typecheck`, `test`
- `tailwind.config.ts` — not needed for v4 if all tokens are in `@theme`. Skip unless required by plugins.
- `app/assets/main.css` — imports tailwindcss + tokens
- `app/assets/tokens.css` — verbatim block above
- `eslint.config.mjs` — flat config using `@nuxt/eslint` + `eslint-plugin-vuejs-accessibility` recommended
- `.prettierrc` — `{ "semi": false, "singleQuote": true, "trailingComma": "all", "printWidth": 100, "plugins": ["prettier-plugin-tailwindcss"] }`
- `commitlint.config.js` — `module.exports = { extends: ['@commitlint/config-conventional'] }`
- `.husky/pre-commit` → `pnpm lint-staged`
- `.husky/commit-msg` → `pnpm commitlint --edit "$1"`
- `firebase.json`, `.firebaserc` — verbatim above
- `firestore.rules` — verbatim above
- `firestore.indexes.json` — built from the index list above
- `storage.rules` — verbatim above
- `vitest.config.ts` — JSDOM, `@vue/test-utils` integration, alias `~` and `~/shared`
- `vitest.rules.config.ts` — Node env, no Vue plugin, used by `test:rules` script
- `playwright.config.ts` — Chromium only, `webServer` block boots `pnpm dev`, base URL `http://localhost:3000`, tests under `tests/e2e`

Initialize Husky: `pnpm husky init`, then overwrite the hook files with the content above.

Commit: `chore: configuration files`.

**Verify:** `pnpm typecheck` passes. `pnpm lint` passes (zero errors). `pnpm dev` still boots.

**STOP. Report and wait.**

### PHASE D — Foundational documentation

Create these three docs as the project's source of truth. Future Claude Code sessions will be instructed to read them before making changes.

**`ARCHITECTURE.md`** — covering:
- Product summary (one paragraph)
- Topology diagram (ASCII, single Nuxt app + Firebase services)
- Rendering strategy (SSG public, CSR auth-gated)
- Region/deployment strategy (`europe-west3`, dev/prod projects, preview channels)
- Firestore data model — full collection-by-collection from the canonical section above
- Exam session lifecycle (state machine in ASCII)
- Timer mechanics (server-authoritative, two-layer auto-submit)
- Cloud Functions inventory from canonical section
- Security model summary (custom claims, rule philosophy, answer write strategy)
- What goes in Functions vs client direct writes
- Out-of-MVP items (certificates, automated composition, editorial workflow)

**`CONVENTIONS.md`** — covering:
- Naming conventions (Ui*/App*/Chess*/Question*/Exam*/Practice*/Admin*)
- `<script setup>` ordering rule
- Composable and store naming
- Hard rules (no hex in components, zod-validate function inputs, dumb components don't import stores, etc.)
- TypeScript strict, no `any` without comment
- Tests: rules tests mandatory; coverage targets per layer
- i18n: namespace by feature, mirror keys PL↔EN, all `{pl, en}` rendered through `localized()`
- Commit conventions
- AI-assisted workflow: "Read ARCHITECTURE.md, CONVENTIONS.md, DESIGN.md before making changes"

**`DESIGN.md`** — covering:
- Three design principles (reading-first, mode-aware temperature, restrained chess motif)
- Token reference (with hex + semantic intent)
- Typography pairing rationale
- Spacing rhythm and radius scale
- Motion timings
- Mode-specific UX rules (practice / exam / admin)
- Component naming + primitive inventory
- Accessibility checklist (WCAG 2.2 AA): focus rings, contrast, semantic HTML, keyboard nav, screen-reader-friendly chess boards, exam timer announcements
- Responsive breakpoints
- DO/DON'T list

**`README.md`** — short:
- One-paragraph product summary
- Stack list
- Quick start: `pnpm install`, copy `.env.example` → `.env`, `pnpm emulators` in one terminal, `pnpm dev` in another
- Repository tour (one line per top-level folder)
- Links to ARCHITECTURE/CONVENTIONS/DESIGN
- License placeholder

**`i18n/README.md`** — translation workflow:
- File structure
- Adding a new key (PL first, EN mirror immediately)
- The PL↔EN mirror requirement enforced by `pnpm i18n:check`
- How to add a new feature namespace

**`tests/rules/README.md`** — short note: rules tests run against Firestore emulator via `pnpm test:rules`; every collection must have positive + negative tests.

**`tests/e2e/README.md`** — short note on Playwright setup.

Commit: `docs: foundational architecture, conventions, and design docs`.

**Verify:** all four docs exist with substantive content. `README.md` links resolve.

**STOP. Report and wait.**

### PHASE E — Initial code

#### Shared layer (`shared/`)

- `shared/types/user.ts` — `Role`, `User` interface (matching data model).
- `shared/types/question.ts` — `QuestionType`, `Bilingual<T>`, `QuestionOption`, `Question`.
- `shared/types/exam.ts` — `Exam`, `ExamSnapshot`.
- `shared/types/session.ts` — `ExamSessionStatus`, `ExamSession`, `Answer`, `ExamEvent`, `ExamEventType`.
- `shared/schemas/question.ts` / `exam.ts` / `session.ts` — Zod schemas mirroring the types. Export inferred types as `z.infer<...>`.
- `shared/constants.ts` — `FIRESTORE_REGION = 'europe-west3'`, `MAX_QUESTIONS_PER_EXAM = 200`, `HEARTBEAT_INTERVAL_MS = 30_000`, etc.

#### Client plugins

- `app/plugins/firebase.client.ts` — initialize Firebase from `runtimeConfig.public`. If `useEmulators`, connect Auth (9099), Firestore (8080), Storage (9199), Functions (5001).
- `app/plugins/vuefire.client.ts` — initialize VueFire with the Firebase app, Auth and Firestore enabled.

#### Composables

- `app/composables/useAuth.ts` — exposes reactive `user`, `claims`, `isAdmin`, `signInWithGoogle()`, `signOut()`. Uses Firebase Auth observers.
- `app/composables/useServerTime.ts` — skeleton accepting `serverSkewMs` prop; returns reactive `serverNow` updated via `requestAnimationFrame`. Body marked `TODO(phase-4)`.
- `app/composables/useLocalized.ts` — wraps `utils/localized.ts` with current i18n locale.

#### Middleware

- `app/middleware/auth.global.ts` — if route under `/app/**` or `/admin/**` and no user, `navigateTo('/auth/login')`.
- `app/middleware/admin.ts` — page middleware: if `!claims.role === 'admin'`, `navigateTo('/app')`.
- `app/middleware/exam-lock.ts` — stub with TODO referencing phase 4.

#### Stores

- `app/stores/auth.ts` — Pinia store mirroring `useAuth()` for cross-component cached reads.
- `app/stores/ui.ts` — toasts, theme, locale-related UI state.

#### Utils

- `app/utils/localized.ts` — implementation from the architecture docs.
- `app/utils/time.ts` — `formatRemaining(ms): string` (MM:SS), `nowWithSkew(skew): number`.
- `app/utils/shuffle.ts` — seeded Fisher–Yates.

#### Layouts

- `app/layouts/default.vue` — `<AppHeader />`, `<main><slot /></main>`, simple footer.
- `app/layouts/admin.vue` — sidebar placeholder (collapsed icons), main content slot.
- `app/layouts/exam.vue` — minimal locked chrome: only timer slot + progress slot + content slot. No nav, no theme toggle.

#### UI primitives

- `app/components/ui/UiButton.vue` — variants (primary/secondary/ghost/danger), sizes (sm/md/lg), loading and disabled states, full keyboard a11y, token-driven classes.
- `app/components/ui/UiInput.vue` — label/error/hint slots, focus ring, error state, `id`/`aria-describedby` wired.
- `app/components/ui/UiCard.vue` — composable header/body/footer slots, border + tonal surface (no shadow).

Add a hidden `/dev/ui` page rendering one of each primitive in all variants for visual verification.

#### App shell

- `app/components/layout/AppHeader.vue` — logo placeholder (`Chess Arbiter` in display font), language toggle (PL/EN via `setLocale`), user menu (avatar when signed in, "Sign in" button otherwise).
- `app/app.vue` — `<NuxtLayout><NuxtPage /></NuxtLayout>`.

#### Pages

- `app/pages/index.vue` — landing: hero headline in display font, short description, "Get started" CTA → `/auth/login`. Uses i18n keys from `landing.json`.
- `app/pages/about.vue` — placeholder with i18n keys.
- `app/pages/auth/login.vue` — "Sign in with Google" `UiButton`, calls `useAuth().signInWithGoogle()`, redirects to `/app` on success.
- `app/pages/auth/callback.vue` — handles redirect-flow callback, then `navigateTo('/app')`.
- `app/pages/app/index.vue` — "Hello, {displayName}" placeholder. `definePageMeta({ middleware: 'auth' })`.
- `app/pages/admin/index.vue` — admin dashboard placeholder. `definePageMeta({ middleware: ['auth', 'admin'], layout: 'admin' })`.

#### i18n locale files

Minimum keys for both `pl/` and `en/`:
- `common.json`: app name, nav (home, about, login, logout), language toggle labels, generic actions (save, cancel, delete), generic errors.
- `auth.json`: login title, sign-in-with-google CTA, "or use email link", success/error messages.
- `landing.json`: hero title, hero subtitle, primary CTA.

#### Functions skeleton (`functions/src/`)

For each function listed in the inventory: create a file exporting a stub via `onCall` (callable) or appropriate trigger. Each stub:
1. Validates input with Zod
2. Asserts auth (and `role === 'admin'` where required)
3. Returns `{ status: 'not_implemented', phase: 'TODO(phase-N)' }`
4. Has a top-of-file comment summarizing intended behavior

`functions/src/lib/auth.ts` — helper `assertAdmin(context)`.
`functions/src/lib/firestore.ts` — initialized admin Firestore instance.
`functions/src/index.ts` — exports all functions.

#### Scripts

- `scripts/i18n-check.ts` — recursively reads `i18n/locales/pl/` and `i18n/locales/en/`, builds key sets per file, exits non-zero if sets differ; prints a diff.

#### CI

- `.github/workflows/ci.yml` — jobs: install (cached), lint+typecheck, test-unit, test-rules (via emulator), build, deploy-preview (PRs only, Firebase Hosting preview channel), deploy-dev (on push to main).

Commit: `feat: scaffold initial app, design system primitives, and function stubs`.

**Verify:**
- `pnpm dev` boots and `/` renders the localized landing page in PL.
- `/en` renders the English landing page.
- Visiting `/app` while unauthenticated redirects to `/auth/login`.
- `/auth/login` renders with the Google sign-in button (button visible; clicking it errors out gracefully because `.env` is not configured — expected).
- `/dev/ui` renders all primitive variants without console errors.
- `pnpm typecheck` clean.
- `pnpm lint` clean.
- `pnpm test:unit` runs (zero tests OK).
- `pnpm build` succeeds.
- `pnpm i18n:check` passes.

**STOP. Report and wait.**

### PHASE F — Final verification

1. Print the actual file tree (depth 4) and **diff it against the layout spec above**. Report any deviations.
2. Run and report results of: `pnpm typecheck`, `pnpm lint`, `pnpm test:unit`, `pnpm build`, `pnpm i18n:check`.
3. Run `firebase emulators:start --only firestore,auth,functions,storage` once and confirm all four boot on documented ports. Stop emulators after confirming.
4. Confirm `README.md` links to `ARCHITECTURE.md`, `CONVENTIONS.md`, `DESIGN.md` all resolve.
5. Final commit: `chore: scaffolding complete (Phase 0 of roadmap)`.

## OUT OF SCOPE FOR THIS SCAFFOLD — DO NOT IMPLEMENT

- Chess board components (chess.js / chessground integration)
- Question CRUD UI
- Practice mode
- Exam composer
- Exam runtime
- Anti-cheat detection
- Certificate generation
- Markdown editor for question content
- Any actual function business logic beyond the stubs
- Visual polish beyond the primitives
- Admin tables and data grids

## FINAL REPORT FORMAT

When Phase F passes, reply with:

1. **Tree** — actual file structure (depth 4)
2. **Verification** — pass/fail for typecheck, lint, unit tests, build, i18n:check, emulator boot
3. **Deviations** — any files added/skipped vs spec, with one-line reasons
4. **Next manual steps** for me (the human) — explicit list, e.g.:
   - Create `chess-arbiter-dev` and `chess-arbiter-prod` Firebase projects in console
   - Enable Google as sign-in provider in both
   - Set Firestore region to `europe-west3` on both
   - Set Storage region accordingly
   - Copy `.env.example` to `.env` and fill in dev project credentials
   - Run `firebase login` and `firebase use dev`
   - Set up GitHub Actions secrets for CI deploys
4. **What's ready** — one-line confirmation that the app boots, auth scaffold is in place, design system primitives are usable, function stubs compile, and the project is ready for Phase 1 (question system).

Begin with Phase A. Stop after each phase.

─── END PROMPT ───