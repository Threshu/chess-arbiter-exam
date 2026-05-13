// revokeExamAccess({ accessId })
// Admin only. Sets status='revoked' on userExamAccess/{accessId}. Audited.
import { onCall } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { FIRESTORE_REGION } from '../../../shared/constants.js'
import { assertAdmin, validate } from '../lib/auth.js'

const inputSchema = z.object({
  accessId: z.string().min(1),
})

export const revokeExamAccess = onCall({ region: FIRESTORE_REGION }, async (request) => {
  validate(inputSchema, request.data)
  assertAdmin(request)
  // TODO(phase-3): mark access revoked + audit log
  return { status: 'not_implemented', phase: 'TODO(phase-3)' } as const
})
