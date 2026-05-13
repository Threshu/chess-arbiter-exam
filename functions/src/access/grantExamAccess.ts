// grantExamAccess({ userId, examId })
// Admin only. Creates userExamAccess/{accessId} with status=allowed,
// attemptCount=0. Audited.
import { onCall } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { FIRESTORE_REGION } from '../../../shared/constants.js'
import { assertAdmin, validate } from '../lib/auth.js'

const inputSchema = z.object({
  userId: z.string().min(1),
  examId: z.string().min(1),
})

export const grantExamAccess = onCall({ region: FIRESTORE_REGION }, async (request) => {
  validate(inputSchema, request.data)
  assertAdmin(request)
  // TODO(phase-3): create access ticket + audit log
  return { status: 'not_implemented', phase: 'TODO(phase-3)' } as const
})
