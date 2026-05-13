// scoreExamSession({ sessionId })
// Idempotent. Reads exams/{examId}/snapshot/v1, reads
// examSessions/{sid}/answers/*, computes correctCount / percentage / passed,
// writes back to the session and fans out to examResults/.
import { onCall } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { FIRESTORE_REGION } from '../../../shared/constants.js'
import { assertSignedIn, validate } from '../lib/auth.js'

const inputSchema = z.object({
  sessionId: z.string().min(1),
})

export const scoreExamSession = onCall({ region: FIRESTORE_REGION }, async (request) => {
  validate(inputSchema, request.data)
  assertSignedIn(request)
  // TODO(phase-4): idempotent scoring against the frozen snapshot
  return { status: 'not_implemented', phase: 'TODO(phase-4)' } as const
})
