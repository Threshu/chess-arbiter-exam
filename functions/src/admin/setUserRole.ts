import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { FIRESTORE_REGION } from '../../../shared/constants.js'
import { assertAdmin, validate } from '../lib/auth.js'
import { adminAuth, db, FieldValue } from '../lib/admin.js'

const inputSchema = z.object({
  uid: z.string().min(1),
  role: z.enum(['student', 'admin']),
})

export const setUserRole = onCall({ region: FIRESTORE_REGION }, async (request) => {
  const auth = assertAdmin(request)
  const { uid, role } = validate(inputSchema, request.data)

  const userRecord = await adminAuth.getUser(uid).catch(() => null)
  if (!userRecord) {
    throw new HttpsError('not-found', `User ${uid} does not exist`)
  }

  const existingClaims = userRecord.customClaims ?? {}
  await adminAuth.setCustomUserClaims(uid, { ...existingClaims, role })

  await db.runTransaction(async (tx) => {
    const userRef = db.collection('users').doc(uid)
    const auditRef = db.collection('auditLogs').doc()
    tx.set(userRef, { role }, { merge: true })
    tx.set(auditRef, {
      type: 'role.set',
      targetUid: uid,
      role,
      actorUid: auth.uid,
      at: FieldValue.serverTimestamp(),
    })
  })

  return { ok: true } as const
})
