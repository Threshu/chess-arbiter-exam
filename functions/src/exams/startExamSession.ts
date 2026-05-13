// startExamSession({ examId })
// Verify the caller has an `allowed` access ticket for the exam, run the
// single-active-session lock transaction on userExamState/{uid}, build
// randomized question/option orders, write the session doc, and return the
// sanitized snapshot (no isCorrect fields).
import { onCall } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { FIRESTORE_REGION } from '../../../shared/constants.js'
import { assertSignedIn, validate } from '../lib/auth.js'

const inputSchema = z.object({
  examId: z.string().min(1),
})

export const startExamSession = onCall({ region: FIRESTORE_REGION }, async (request) => {
  validate(inputSchema, request.data)
  assertSignedIn(request)
  // TODO(phase-4): implement single-session lock + snapshot fetch + randomization
  return { status: 'not_implemented', phase: 'TODO(phase-4)' } as const
})
