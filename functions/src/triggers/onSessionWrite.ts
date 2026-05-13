// onSessionWrite (Firestore trigger on examSessions/{sid})
// When status transitions to 'completed', invoke scoring. Idempotency lives in
// scoreExamSession; this trigger is fire-and-call.
import { onDocumentWritten } from 'firebase-functions/v2/firestore'
import { FIRESTORE_REGION } from '../../../shared/constants.js'

export const onSessionWrite = onDocumentWritten(
  { document: 'examSessions/{sid}', region: FIRESTORE_REGION },
  async () => {
    // TODO(phase-4): detect status transition active->completed and invoke scoring
    return
  },
)
