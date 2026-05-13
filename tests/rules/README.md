# Firestore rules tests

These tests exercise `firestore.rules` end-to-end against the Firestore emulator using `@firebase/rules-unit-testing`.

## Running

```bash
pnpm test:rules
```

This wraps Vitest in `firebase emulators:exec --only firestore`, which starts the emulator on port 8080, runs the tests, and tears down. Nothing persistent is required — no manual emulator startup, no separate process.

## What to cover

Every collection that has any rule beyond `allow read, write: if false` must have **at least one positive and one negative test**:

- **Positive:** a request that should succeed (correct user / correct role / correct payload shape) does succeed.
- **Negative:** a request that should fail (wrong user, missing claim, forbidden payload key, expired session, etc.) is rejected with `permission-denied`.

For the exam-session answer subtree (`examSessions/{sid}/answers/{qid}`), each of the four guarded conditions gets its own negative test: not the owner, session not `active`, `expiresAt <= now`, payload contains a forbidden key.

## File naming

`tests/rules/<collection>.spec.ts`, e.g. `tests/rules/examSessions.spec.ts`. One file per top-level collection; subcollections live in the parent's file.

## Hard rule

A PR that modifies `firestore.rules` without touching `tests/rules/` is rejected on principle. See `CONVENTIONS.md → Tests`.
