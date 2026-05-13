// submitExamSession({ sessionId })
// Mark the caller's active session as `completed`, set submittedAt, clear
// userExamState/{uid}.activeSessionId. Idempotent.
import { onCall } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { FIRESTORE_REGION } from '../../../shared/constants.js'
import { assertSignedIn, validate } from '../lib/auth.js'

const inputSchema = z.object({
  sessionId: z.string().min(1),
})

export const submitExamSession = onCall({ region: FIRESTORE_REGION }, async (request) => {
  validate(inputSchema, request.data)
  assertSignedIn(request)
  // TODO(phase-4): idempotent transition active -> completed with state cleanup
  return { status: 'not_implemented', phase: 'TODO(phase-4)' } as const
})
