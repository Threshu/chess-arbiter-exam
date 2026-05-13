// invalidateExamSession({ sessionId, reason })
// Admin only. Transitions a session to status='invalidated', records
// invalidationReason and invalidatedBy. Audited.
import { onCall } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { FIRESTORE_REGION } from '../../../shared/constants.js'
import { assertAdmin, validate } from '../lib/auth.js'

const inputSchema = z.object({
  sessionId: z.string().min(1),
  reason: z.string().min(1).max(500),
})

export const invalidateExamSession = onCall({ region: FIRESTORE_REGION }, async (request) => {
  validate(inputSchema, request.data)
  assertAdmin(request)
  // TODO(phase-4): atomically invalidate session + clear active lock + audit
  return { status: 'not_implemented', phase: 'TODO(phase-4)' } as const
})
