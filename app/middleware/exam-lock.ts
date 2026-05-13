// TODO(phase-4): block navigation away from /app/exam/:id while a session is
// active. Read userExamState/{uid}.activeSessionId; if it matches the current
// session and the user is leaving the exam route, redirect back. Pair with a
// beforeunload handler to prevent accidental tab close.
export default defineNuxtRouteMiddleware(() => {
  // no-op stub
})
