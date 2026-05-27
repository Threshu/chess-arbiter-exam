# Chess Arbiter

A bilingual (PL/EN) referee certification platform: students prepare for FIDE arbiter exams (NA / FA / IA) through a curated question bank, practice with instant feedback, and sit timed exams composed by admins. Exams run under a server-authoritative timer with anti-cheat event logging; admins manage questions, compose exams, and grant access tickets.

## Stack

- **Frontend:** Nuxt 4, Vue 3, TypeScript (strict), Tailwind CSS 4, Pinia, VueFire, `@nuxtjs/i18n`
- **UI primitives:** `reka-ui` (headless, accessible)
- **Chess:** `chess.js`, `chessground`
- **Validation:** Zod 4 (shared between client and Cloud Functions)
- **Backend:** Firebase — Auth (Google + email-link), Firestore, Cloud Functions Gen 2, Storage, Hosting — all in `europe-west3`
- **Testing:** Vitest, `@firebase/rules-unit-testing`, `firebase-functions-test`, Playwright
- **Tooling:** ESLint flat config, Prettier, Husky, lint-staged, commitlint, GitHub Actions

## Quick start

Requires Node 22 LTS and pnpm (the repo declares `packageManager: pnpm@11.x` — `corepack enable` will pick it up).

```bash
pnpm install
cp .env.example .env       # then fill in Firebase keys for the dev project

pnpm emulators              # terminal 1 — Firebase Auth / Firestore / Functions / Storage emulators
pnpm dev                    # terminal 2 — Nuxt dev server on http://localhost:3000
```

Other useful scripts:

| Script                                 | What it does                                                   |
| -------------------------------------- | -------------------------------------------------------------- |
| `pnpm typecheck`                       | Type-checks the Nuxt app and the `functions/` workspace.       |
| `pnpm lint` / `pnpm lint:fix`          | ESLint over the entire repo.                                   |
| `pnpm test`                            | Runs unit tests + rules tests + functions tests.               |
| `pnpm test:e2e`                        | Playwright (Chromium) E2E suite.                               |
| `pnpm i18n:check`                      | Verifies `pl/` and `en/` locale files have identical key sets. |
| `pnpm build`                           | Production Nuxt build.                                         |
| `pnpm deploy:dev` / `pnpm deploy:prod` | Firebase deploy to the dev / prod project.                     |

## Repository tour

| Path                                                                                         | Contents                                                                                          |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `app/`                                                                                       | Nuxt source: pages, layouts, components, composables, stores, plugins, middleware, utils, assets. |
| `shared/`                                                                                    | Types, Zod schemas, and constants used by both client and Cloud Functions.                        |
| `functions/`                                                                                 | Cloud Functions (Gen 2) — callable, scheduled, and trigger handlers.                              |
| `i18n/locales/`                                                                              | PL and EN translation files, namespaced per feature.                                              |
| `tests/unit/`                                                                                | Vitest unit tests for composables, utils, and dumb components.                                    |
| `tests/rules/`                                                                               | Firestore security-rule tests (run against the emulator).                                         |
| `tests/functions/`                                                                           | Cloud Functions tests.                                                                            |
| `tests/e2e/`                                                                                 | Playwright end-to-end tests.                                                                      |
| `scripts/`                                                                                   | One-off CLI utilities (e.g. `i18n-check.ts`).                                                     |
| `content/`                                                                                   | Reserved for `@nuxt/content` (long-form copy, future use).                                        |
| `firestore.rules`, `firestore.indexes.json`, `storage.rules`, `firebase.json`, `.firebaserc` | Firebase configuration.                                                                           |
| `.github/workflows/`                                                                         | CI pipeline.                                                                                      |
| `.husky/`                                                                                    | Pre-commit and commit-msg hooks.                                                                  |

## Documentation

Before making changes — including AI-assisted changes — read these in order:

- [`ROADMAP.md`](./ROADMAP.md) — **single source of truth** for current scope, phases and out-of-scope items. Start here.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — data model, session lifecycle, timer mechanics, function inventory, security model. **Note:** describes the original full scope (incl. exam mode), some sections are stale and being revised phase by phase.
- [`CONVENTIONS.md`](./CONVENTIONS.md) — naming, file placement, TypeScript and Zod rules, the short list of hard rules.
- [`DESIGN.md`](./DESIGN.md) — design principles, token reference, motion, accessibility, mode-specific UX rules.

Secondary references:

- [`i18n/README.md`](./i18n/README.md) — translation workflow and the PL↔EN mirror requirement.
- [`tests/rules/README.md`](./tests/rules/README.md) — how to write and run rules tests.
- [`tests/e2e/README.md`](./tests/e2e/README.md) — Playwright setup.

## License

TBD.
