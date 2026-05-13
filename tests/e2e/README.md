# End-to-end tests

Playwright (Chromium only) covers critical user paths.

## Running

```bash
pnpm test:e2e
```

`playwright.config.ts` declares a `webServer` block that boots `pnpm dev` on `http://localhost:3000` before the suite runs and reuses it locally. CI starts a fresh server on every run.

## Scope

E2E exists to catch regressions on flows that unit and rules tests cannot meaningfully cover:

- Public landing → login → app shell (auth flow happy path).
- Exam start happy path (session creation through to scored result), against the emulator.
- Locale prefix routing (`/` vs `/en`).

Do not add E2E tests for things that a Vitest or rules test would cover. Playwright runs are minutes-long; keep the suite ruthlessly minimal.

## Authentication in tests

When auth is required, sign in against the Firebase Auth emulator using a fixture (`tests/e2e/fixtures/auth.ts`, added in a later phase). Do not hit the production Auth provider from tests.
