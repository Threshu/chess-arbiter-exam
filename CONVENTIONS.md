# Conventions

> **AI-assisted workflow note.** Every future Claude Code (or any AI) session working on this repository **must read `ARCHITECTURE.md`, `CONVENTIONS.md`, and `DESIGN.md` before making changes.** They are the source of truth. If a convention here conflicts with code you see, the convention wins — fix the code, not the convention. If you believe a convention should change, raise it in a PR description, do not silently deviate.

## Component naming

Prefixes are mandatory and exist so any name on grep tells you what layer it lives in.

| Prefix      | Layer                                                                         | Examples                                 |
| ----------- | ----------------------------------------------------------------------------- | ---------------------------------------- |
| `Ui*`       | Design-system primitive. Token-driven, zero business logic, no store imports. | `UiButton`, `UiInput`, `UiCard`          |
| `App*`      | Application shell — header, sidebar, footer, global nav.                      | `AppHeader`, `AppSidebar`                |
| `Chess*`    | Chess-board and chess-rendering components. Wraps `chessground` / `chess.js`. | `ChessBoard`, `ChessMoveList`            |
| `Question*` | Question rendering and authoring.                                             | `QuestionRenderer`, `QuestionOptionList` |
| `Exam*`     | Exam-runtime components (timer, progress, navigator).                         | `ExamTimer`, `ExamProgressBar`           |
| `Practice*` | Practice-mode components (instant-feedback variants).                         | `PracticeFeedback`                       |
| `Admin*`    | Admin-only components (data tables, editors, dashboards).                     | `AdminQuestionTable`                     |

If a component does not fit one of these prefixes, it is in the wrong layer — split or relocate it.

## `<script setup>` ordering

Inside every `.vue` file with `<script setup lang="ts">`, the contents are organized in this exact order. ESLint will not catch all deviations, but reviewers will.

```
1. imports
2. defineProps / defineEmits (typed via interfaces, not literals)
3. composables / stores
4. reactive state (ref, reactive, shallowRef)
5. computed
6. watch, watchEffect, onMounted and other lifecycle hooks
7. methods (named functions, in call-graph order)
8. defineExpose (last)
```

Within each band, keep ordering top-down: things used at the top of the file should be defined before things used at the bottom.

## Composables and stores

- **Composables:** filename and export both `useX` in camelCase. One composable per file. `useAuth.ts` exports `useAuth()`. No default exports.
- **Pinia stores:** filename is the domain (`auth.ts`, `ui.ts`), export is `useXStore`. `stores/auth.ts` exports `useAuthStore`. Do not put state-shape interfaces in the same file as the store; if a state interface is non-trivial, lift it to `shared/types/`.
- **Smart vs. dumb components:** dumb components (`Ui*`, presentational `Question*`/`Exam*` pieces) never import stores. Smart wrappers (typically page components or feature-level containers) read stores and pass plain props down. This rule is non-negotiable — it is the only reason the dumb layer is unit-testable in isolation.

## TypeScript

- `strict: true` everywhere. Do not weaken `tsconfig.json`.
- **No `any` without a justification comment.** When you genuinely need `any`, add a same-line `// reason: <why>` comment. Reviewers will reject `any` without one.
- Type imports always use `import type { ... }` to keep runtime bundles clean.
- Interface names: PascalCase. Type aliases: PascalCase. No `I` prefix.
- Shared types live in `shared/types/`. Anything used by both the client and Cloud Functions belongs there. If only the client uses it, keep it under `app/`.

## Zod schemas

- **Zod 4 API.** This project runs `zod@4.x`. Do not use deprecated v3 patterns (e.g. v3-style error-map shapes). Prefer `z.treeifyError` / `z.flattenError` and the v4 `issues` shape for error reporting.
- **Schemas mirror types, types are inferred.** Define the Zod schema in `shared/schemas/*.ts` and export the type as `export type X = z.infer<typeof XSchema>`. Hand-rolled `interface X` plus parallel `z.object({...})` drifts.
- **All Cloud Function inputs are Zod-validated before any side effect.** No exceptions. If validation fails, throw `HttpsError('invalid-argument', ...)` with the flattened error.

## i18n

- **Locale files are namespaced by feature.** `common.json`, `auth.json`, `landing.json`, and so on. Add a new namespace file rather than dumping everything into `common`.
- **PL is the source language; EN mirrors it.** Add the PL key first, then immediately mirror it to EN with the translation. `pnpm i18n:check` fails the build if keys drift.
- **All bilingual content uses `localized()`.** Any field with shape `{ pl, en }` (questions, exam titles, descriptions) is rendered through the `localized(value, locale)` helper in `app/utils/localized.ts`. Never read `value.pl` or `value.en` directly in a component.
- **Adding a new feature namespace:** create `i18n/locales/pl/<feature>.json` and `i18n/locales/en/<feature>.json` in the same commit, register both file paths in the `files` array under their locale in `nuxt.config.ts`.

## Styling

- **No hex colors in components.** Every color comes from a token (`bg-primary`, `text-fg`, `border-border`, etc.). Designers can rotate the palette by editing `app/assets/tokens.css` alone. A grep for `#[0-9a-fA-F]` in `app/components/` should return zero results.
- Tailwind v4 with the `@theme` block in `app/assets/tokens.css` — no separate `tailwind.config.ts`.
- Dark mode lives on a single `.dark` class on `<html>`.

## Tests

| Layer                                      | Tool                                               | Mandatory                                                                                  |
| ------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Unit (composables, utils, dumb components) | Vitest + JSDOM + `@vue/test-utils`                 | High — anything with branching logic.                                                      |
| Rules (Firestore security)                 | Vitest + `@firebase/rules-unit-testing`            | **Mandatory.** Every rules change ships with a positive + negative test in `tests/rules/`. |
| Functions                                  | Vitest + `firebase-functions-test` in `functions/` | High — every function gets at least an unauth-rejection test and a happy-path test.        |
| E2E                                        | Playwright (Chromium)                              | Critical user paths only (login → app shell, exam start happy path).                       |

Coverage targets — these are floors, not goals:

- Composables and utils: **80%**.
- Dumb components: **60%**.
- Smart wrappers and pages: covered by E2E; no unit coverage requirement.
- Cloud Functions: **80%** branch.

Rules tests are a hard gate. A PR that changes `firestore.rules` without touching `tests/rules/` is rejected on principle, not on coverage.

## Hard rules (the short list)

These are the rules that get violated most often and matter most. Memorize them.

1. **No hex colors in components.** Tokens only.
2. **No `any` without a `// reason:` comment.**
3. **All `{pl, en}` content rendered through `localized()`.**
4. **All Cloud Function inputs validated with Zod before any side effect.**
5. **Firestore rules updates always paired with a rules test** (positive + negative).
6. **Dumb components never import stores.** Smart wrappers do.
7. **No business logic in components.** Extract to composables or `utils/`.
8. **Conventional Commits required** (commitlint enforces; CI will fail on non-conforming messages).

## Commit conventions

[Conventional Commits 1.0](https://www.conventionalcommits.org/). The allowed types are the `@commitlint/config-conventional` defaults: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `style`, `revert`.

- Subject in imperative mood, lowercase, no trailing period, ≤ 72 chars.
- Scope is optional; when used, name the area (`feat(exam): ...`, `fix(rules): ...`).
- Breaking changes use `!` after the type/scope and an explanatory `BREAKING CHANGE:` footer.
- One logical change per commit. If you need "and" in the subject, split it.

## File and folder placement

| Concern                                       | Lives in                                                |
| --------------------------------------------- | ------------------------------------------------------- |
| Shared types (client + functions)             | `shared/types/`                                         |
| Shared Zod schemas                            | `shared/schemas/`                                       |
| Shared constants (regions, intervals, limits) | `shared/constants.ts`                                   |
| Client-only composables                       | `app/composables/`                                      |
| Client-only utilities (no business logic)     | `app/utils/`                                            |
| Pinia stores                                  | `app/stores/`                                           |
| Middleware                                    | `app/middleware/` (global middleware suffix `.global`)  |
| Cloud Functions source                        | `functions/src/` (mirrors callable / trigger groupings) |
| i18n locales                                  | `i18n/locales/<locale>/<namespace>.json`                |
| Rules tests                                   | `tests/rules/`                                          |
| Unit tests                                    | `tests/unit/`                                           |
| Functions tests                               | `tests/functions/`                                      |
| E2E tests                                     | `tests/e2e/`                                            |

If you cannot decide where a file goes, it is probably in the wrong layer.
