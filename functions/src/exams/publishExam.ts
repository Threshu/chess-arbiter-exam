// publishExam({ examId })
// Admin only. Validates the exam, copies the current question docs into
// exams/{examId}/snapshot/v1 (immutable), sets publishedAt, emits audit log.
import { onCall } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { FIRESTORE_REGION } from '../../../shared/constants.js'
import { assertAdmin, validate } from '../lib/auth.js'

const inputSchema = z.object({
  examId: z.string().min(1),
})

export const publishExam = onCall({ region: FIRESTORE_REGION }, async (request) => {
  validate(inputSchema, request.data)
  assertAdmin(request)
  // TODO(phase-3): build immutable snapshot/v1 from referenced questions
  return { status: 'not_implemented', phase: 'TODO(phase-3)' } as const
})
