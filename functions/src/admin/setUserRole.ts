// setUserRole({ uid, role })
// Admin only. Sets the `role` custom claim and mirrors it to users/{uid}.role
// in the same operation. Audited.
import { onCall } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { FIRESTORE_REGION } from '../../../shared/constants.js'
import { assertAdmin, validate } from '../lib/auth.js'

const inputSchema = z.object({
  uid: z.string().min(1),
  role: z.enum(['student', 'admin']),
})

export const setUserRole = onCall({ region: FIRESTORE_REGION }, async (request) => {
  validate(inputSchema, request.data)
  assertAdmin(request)
  // TODO(phase-2): set custom claim via admin auth + mirror to users doc + audit
  return { status: 'not_implemented', phase: 'TODO(phase-2)' } as const
})
