# Architecture

## Product summary

Chess Arbiter is a referee certification platform. Students prepare for FIDE arbiter exams (NA / FA / IA levels) through a bilingual (PL/EN) question bank, take practice sessions with instant feedback, and sit manually composed exams that run under a server-authoritative timer with anti-cheat event logging. Admins manage question and exam content and grant exam access tickets. The platform is bilingual end-to-end: content, UI, and audit data carry both Polish and English.

## Topology

```
┌────────────────────────────────────────────────────────────────────┐
│  Browser (Vue 3 / Nuxt 4 client)                                   │
│    pages: / /about (SSG)  |  /auth/** /app/** /admin/** (CSR)      │
│    state: Pinia stores  |  data: VueFire (Firestore + Auth)        │
└────────────────────────┬───────────────────────────────────────────┘
                         │ HTTPS
            ┌────────────┼──────────────┐
            ▼            ▼              ▼
       ┌────────┐  ┌────────────┐  ┌──────────┐
       │  Auth  │  │  Firestore │  │ Storage  │
       │ (GIS + │  │  (rules-   │  │ (rules-  │
       │ email- │  │  guarded)  │  │ guarded) │
       │  link) │  └─────┬──────┘  └──────────┘
       └───┬────┘        │
           │             ▼
           │   ┌────────────────────────────────┐
           └──▶│  Cloud Functions Gen 2         │
               │  (europe-west3, Node 22)       │
               │   callable + scheduled +       │
               │   Firestore / Auth triggers    │
               └────────────────────────────────┘

        Hosting: Firebase Hosting serves Nuxt SSG output (.output/public)
        CI:      GitHub Actions → preview channels (PRs) / dev (main)
```

Single Nuxt application. No microservices, no parallel backends. Cloud Functions are the only authoritative writer for everything that has integrity requirements (sessions, scoring, access grants, role assignments).

## Rendering strategy

| Route prefix  | Mode                    | Reason                                                  |
| ------------- | ----------------------- | ------------------------------------------------------- |
| `/`, `/about` | SSG (`prerender: true`) | Public marketing; no auth, indexable, fast first paint. |
| `/auth/**`    | CSR (`ssr: false`)      | Touches Firebase Auth (browser-only SDK).               |
| `/app/**`     | CSR                     | Auth-gated; per-user Firestore reads.                   |
| `/admin/**`   | CSR                     | Auth-gated + admin claim; same reasoning.               |

Static pages are built at deploy time. Authenticated routes are shipped as a SPA shell that boots Firebase Auth on mount, hydrates Pinia from the auth observer, and only then renders protected content.

## Region and deployment

- **All Firebase services run in `europe-west3` (Frankfurt)**: Firestore, Cloud Functions, Storage. Pinning a single region avoids cross-region latency penalties on every transaction (single-active-session lock, session writes during exams).
- **Projects:** `chess-arbiter-dev` and `chess-arbiter-prod` (see `.firebaserc`).
- **CI pipeline:**
  - PRs → Firebase Hosting preview channel on `chess-arbiter-dev`.
  - Merge to `main` → deploy to `chess-arbiter-dev`.
  - Prod deploys are manual (`pnpm deploy:prod`); never automatic.
- **Local development:** Firebase emulators (Auth 9099, Firestore 8080, Functions 5001, Storage 9199, Hosting 5000, UI 4000) via `pnpm emulators`. The Nuxt client switches to emulator endpoints when `NUXT_PUBLIC_USE_EMULATORS=true`.

## Firestore data model

All collections are top-level unless otherwise noted. Timestamps are Firestore `Timestamp` values. Bilingual fields have shape `{ pl: string, en: string }`.

### `users/{uid}`

Mirror of Firebase Auth user, plus role and locale preference.

| Field                      | Type                   | Notes                                                                                                                              |
| -------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `email`                    | string                 |                                                                                                                                    |
| `displayName`              | string                 |                                                                                                                                    |
| `photoURL`                 | string \| null         |                                                                                                                                    |
| `locale`                   | `'pl' \| 'en'`         | UI preference; defaults to PL.                                                                                                     |
| `role`                     | `'student' \| 'admin'` | Mirrored in the custom claim `request.auth.token.role`. The claim is authoritative for rules; the doc field is for queries and UI. |
| `createdAt`, `lastLoginAt` | Timestamp              |                                                                                                                                    |

Created by the `onAuthCreate` Cloud Function trigger, never by clients. The user can self-update `displayName`, `locale`, `photoURL` only — rules enforce this with a strict key allowlist.

### `userExamState/{uid}`

Singleton per user. Implements the **single-active-session lock**.

| Field             | Type           | Notes                                                                 |
| ----------------- | -------------- | --------------------------------------------------------------------- |
| `activeSessionId` | string \| null | If non-null, the user has an in-flight exam and cannot start another. |
| `updatedAt`       | Timestamp      |                                                                       |

Only Cloud Functions write this, atomically inside a transaction with the session create / submit / expire steps.

### `userExamAccess/{accessId}`

Admin-issued access tickets. A user cannot start an exam without an `allowed` ticket for that `examId`.

| Field          | Type                                   | Notes                                               |
| -------------- | -------------------------------------- | --------------------------------------------------- |
| `userId`       | string                                 |                                                     |
| `examId`       | string                                 |                                                     |
| `grantedBy`    | string (uid)                           |                                                     |
| `grantedAt`    | Timestamp                              |                                                     |
| `status`       | `'allowed' \| 'revoked' \| 'consumed'` | `consumed` once `attemptCount >= exam.maxAttempts`. |
| `attemptCount` | number                                 |                                                     |
| `sessionIds`   | string[]                               | Audit trail of attempts.                            |

### `questions/{questionId}`

The shared question bank.

| Field                                 | Type                                                         | Notes                                                               |
| ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| `type`                                | `'text' \| 'image' \| 'fen' \| 'pgn'`                        |                                                                     |
| `content`                             | `{ pl: { stem, explanation? }, en: { stem, explanation? } }` |                                                                     |
| `mediaUrl`                            | string?                                                      | For `image` type, points to `gs://.../question-images/...`.         |
| `fen`, `pgn`                          | string?                                                      | For `fen` / `pgn` types.                                            |
| `options`                             | `{ id, content: {pl, en}, isCorrect }[]`                     | `isCorrect` is removed from client-readable payloads on exam reads. |
| `topic`                               | string                                                       |                                                                     |
| `level`                               | `'NA' \| 'FA' \| 'IA'`                                       |                                                                     |
| `status`                              | `'draft' \| 'published' \| 'archived'`                       | Students can only read `published`.                                 |
| `version`                             | number                                                       | Bumped when a published question is edited and re-published.        |
| `createdBy`, `createdAt`, `updatedAt` |                                                              |                                                                     |

### `exams/{examId}`

Composed sets of questions with timing and pass criteria.

| Field                                                    | Type                                   |
| -------------------------------------------------------- | -------------------------------------- |
| `title`, `description`                                   | `{pl, en}`                             |
| `questionIds`                                            | string[]                               |
| `durationMinutes`, `passThresholdPercent`, `maxAttempts` | number                                 |
| `level`                                                  | `'NA' \| 'FA' \| 'IA'`                 |
| `language`                                               | `'pl' \| 'en' \| 'both'`               |
| `status`                                                 | `'draft' \| 'published' \| 'archived'` |
| `availableFrom`, `availableTo`                           | Timestamp                              |
| `createdBy`, `createdAt`, `updatedAt`, `publishedAt`     |                                        |

#### `exams/{examId}/snapshot/v1`

**Immutable** subcollection written by `publishExam`. Freezes the full question docs (including `isCorrect`) at the moment of publication so that a) editing a published question never alters a past exam's scoring and b) the server has a single source of truth for grading.

Rules: `read, write: if false` — only server-side via Admin SDK.

### `examSessions/{sessionId}`

One document per attempt. Authoritative state lives here; the client mirrors a sanitized subset.

| Field                                               | Type                                                                             | Notes                          |
| --------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------ |
| `userId`, `examId`                                  | string                                                                           |                                |
| `examSnapshotVersion`                               | string                                                                           | E.g. `'v1'`.                   |
| `status`                                            | `'created' \| 'active' \| 'completed' \| 'scored' \| 'expired' \| 'invalidated'` | See lifecycle below.           |
| `startedAt`, `expiresAt`, `submittedAt`, `scoredAt` | Timestamp                                                                        |                                |
| `questionOrder`                                     | string[]                                                                         | Per-session randomization.     |
| `optionOrders`                                      | `{ [qid]: string[] }`                                                            | Per-session option shuffle.    |
| `result`                                            | `{ correctCount, totalCount, percentage, passed } \| null`                       | Written by `scoreExamSession`. |
| `lastHeartbeatAt`                                   | Timestamp                                                                        |                                |
| `clientMeta`                                        | `{ userAgent, locale, ipHash }`                                                  |                                |
| `invalidationReason`, `invalidatedBy`               | string?                                                                          |                                |

Rules: `read: own or admin`, `write: false`. Clients never touch this doc directly.

#### `examSessions/{sid}/answers/{questionId}`

The **only** subtree the client writes during an exam.

| Field               | Type      |
| ------------------- | --------- |
| `selectedOptionId`  | string    |
| `answeredAt`        | Timestamp |
| `clientTimeSpentMs` | number?   |

Rules guard: session must be owned by the writer, `status == 'active'`, `expiresAt > now`, payload keys restricted to the three above. This is the entire write surface of an active exam.

#### `examSessions/{sid}/events/{eventId}`

Anti-cheat event log. Append-only.

| `type` | `'tab_blur' \| 'tab_focus' \| 'fullscreen_exit' \| 'fullscreen_enter' \| 'copy_attempt' \| 'paste_attempt' \| 'context_menu_attempt' \| 'devtools_open_suspected' \| 'heartbeat_late' \| 'network_offline'` |
| `timestamp` | Timestamp |
| `metadata` | record? |

Rules: create-only by session owner while active. No update, no delete — events are forensic.

### `examResults/{resultId}`

Denormalized per-attempt result for ranking and per-user history queries.

| Field                                    | Notes                 |
| ---------------------------------------- | --------------------- |
| `userId`, `examId`, `sessionId`          |                       |
| `userDisplayName`, `examTitle: {pl, en}` | Frozen at score time. |
| `score`, `percentage`, `passed`, `level` |                       |
| `completedAt`                            |                       |

Composite indexes: `(examId, percentage DESC)` (leaderboards) and `(userId, completedAt DESC)` (history). See `firestore.indexes.json`.

### `auditLogs/{logId}`

Admin-readable. Writes are server-side only. Every admin-affecting Function (`publishExam`, `grantExamAccess`, `revokeExamAccess`, `setUserRole`, `invalidateExamSession`) emits one log row.

### `settings/global`

Singleton: `allowedLanguages`, `defaultLocale`, `featureFlags`. Readable by any signed-in user; writable only by admins.

## Exam session lifecycle

```
                       startExamSession()
                                │
                                ▼
                          ┌──────────┐
                          │ created  │  (transient — never persisted alone)
                          └────┬─────┘
                               │ same transaction
                               ▼
                          ┌──────────┐         heartbeat / answer writes
                          │  active  │ ◀──────  (client → answers/, events/)
                          └────┬─────┘
              submitExamSession()│              sweepExpiredSessions (5m cron)
                 (user action)   │                    or expiresAt + 60s
                                 ▼
                          ┌────────────┐
                          │ completed  │
                          └────┬───────┘
                onWrite trigger │ → scoreExamSession()
                                ▼
                          ┌──────────┐
                          │  scored  │  (result fanned out to examResults/)
                          └──────────┘

  Off-path terminals:
    active ─── expiresAt < now-60s ─────────────▶  expired   (auto-submit)
    any  ───── admin invalidateExamSession() ──▶  invalidated
```

Single-active-session lock: `startExamSession` runs a Firestore transaction that reads `userExamState/{uid}`, verifies `activeSessionId == null`, creates the new session, then sets `activeSessionId = newSessionId` — all atomically. Submission, expiry, and invalidation each clear `activeSessionId` back to null in the same transaction as the status change.

## Timer mechanics

The timer is **server-authoritative**. The client cannot be trusted to enforce time.

1. **`startExamSession`** sets `startedAt = serverTime` and `expiresAt = startedAt + durationMinutes`. The client receives both timestamps and the server's current time, computes its skew once, and renders a countdown locally for UX only.
2. **Client renders** countdown via `useServerTime` (composable: `serverNow = clientNow + serverSkewMs`, ticked by `requestAnimationFrame`). When it reaches zero it locally disables answer inputs and calls `submitExamSession`.
3. **Server safety net** — two layers:
   - The Firestore rule on `examSessions/{sid}/answers/*` requires `expiresAt > request.time`, so no answer is accepted after the deadline even if the client's clock is wrong.
   - A scheduled function `sweepExpiredSessions` runs every 5 minutes, finds sessions where `status == 'active' AND expiresAt < now - 60s`, and forces them to `completed`. The 60-second grace lets the client's own submission land first under normal conditions.

The client never decides when the exam ends. Late client submissions hit the rules wall; missed client submissions get swept.

## Cloud Functions inventory

All Gen 2, region `europe-west3`, Node 22 runtime.

### Callable (HTTPS)

- **`startExamSession({ examId })`** — verifies access ticket, runs the single-session-lock transaction, builds randomized `questionOrder` + `optionOrders`, writes the session, returns a sanitized snapshot (questions without `isCorrect`).
- **`submitExamSession({ sessionId })`** — marks `completed`, sets `submittedAt`, clears `activeSessionId`. Idempotent.
- **`scoreExamSession({ sessionId })`** — idempotent; reads the frozen snapshot, reads answers, computes result, writes back to the session and fans out to `examResults`. Triggered automatically by the `onWrite` Firestore trigger when status flips to `completed`; can also be invoked manually for retries.
- **`publishExam({ examId })`** — admin only; validates exam, copies the current question docs into `exams/{examId}/snapshot/v1`, sets `publishedAt`.
- **`grantExamAccess({ userId, examId })`** — admin only.
- **`revokeExamAccess({ accessId })`** — admin only.
- **`setUserRole({ uid, role })`** — admin only; sets the `role` custom claim, mirrors to `users/{uid}.role`.
- **`invalidateExamSession({ sessionId, reason })`** — admin only.

### Triggers

- **`onAuthCreate`** (Auth trigger) — creates `users/{uid}` from the new auth account.
- **`sweepExpiredSessions`** (scheduled, every 5 min) — auto-submits stale active sessions (see Timer section).
- **`onSessionWrite`** (Firestore `onWrite examSessions/{sid}`) — when status transitions to `completed`, invokes scoring.

All function bodies validate input with Zod, assert auth (and `role === 'admin'` where required) before any side effect, and emit an audit log row for admin-affecting actions.

## Security model

### Custom claims

The `role` custom claim (`'admin' | 'student'`) is the authoritative authorization signal in rules (`request.auth.token.role`). The `users/{uid}.role` field is a mirror for queries and UI, set by `setUserRole` in the same operation. Never trust the doc field for permission decisions.

### Rules philosophy

The rules in `firestore.rules` enforce three invariants:

1. **Students cannot read what they aren't entitled to.** Questions and exams are readable only when `status == 'published'`. Sessions, results, and access tickets are scoped to the owner.
2. **Students cannot write integrity-critical state.** `examSessions/*`, `userExamState/*`, `userExamAccess/*`, `examResults/*`, `auditLogs/*` are all `write: if false`. They mutate exclusively through Cloud Functions.
3. **The one student-writable path during an exam is narrowly fenced.** `examSessions/{sid}/answers/{qid}` and `examSessions/{sid}/events/{eid}` are gated on session ownership, `status == 'active'`, `expiresAt > request.time`, and a strict payload key allowlist.

Published exams are also write-locked through rules: `allow write: if isAdmin() && request.resource.data.status != 'published'`. Promoting an exam to `published` is therefore not possible from the client — only `publishExam` (server, Admin SDK) can do it. The snapshot subcollection is `read, write: if false` for the same reason.

### Answer write strategy

Two-channel writes during an exam:

- The **client writes its own answers** to `examSessions/{sid}/answers/{qid}` (cheap, low-latency, no function invocation per question).
- The **server scores at submission** by reading those answer docs against the frozen snapshot, inside a single Function call.

This keeps per-keystroke and per-answer latency client-driven, while preserving server authority over the final result.

## What goes in Functions vs client direct writes

| Action                                             | Who writes   | Why                                                  |
| -------------------------------------------------- | ------------ | ---------------------------------------------------- |
| User profile (`displayName`, `locale`, `photoURL`) | Client       | Self-service, low risk; rules enforce key allowlist. |
| Per-question answer during exam                    | Client       | Latency-sensitive; rules + timer enforce integrity.  |
| Anti-cheat event                                   | Client       | High frequency; append-only with rules guards.       |
| Session create / submit / score                    | **Function** | Atomic lock, randomization, idempotent scoring.      |
| Access grant / revoke                              | **Function** | Admin-only audited mutation.                         |
| Exam publish (creates snapshot)                    | **Function** | Cross-collection write with Admin SDK.               |
| Role change (custom claim)                         | **Function** | Custom claims can only be set server-side.           |

## Out of MVP

The following are deliberately not in scope and have no scaffolding:

- Certificate generation (PDF/credential issuance)
- Automated exam composition (algorithmic question selection)
- Editorial workflow (review queues, multi-author approval)
- Public CMS for non-authenticated content authors

Implementing any of these requires architecture review — none of the data model assumptions above were made with them in mind.
