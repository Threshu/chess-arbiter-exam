// onAuthCreate (Auth trigger)
// When a new Firebase Auth user is created, write users/{uid} with defaults:
// role='student', locale=DEFAULT_LOCALE, createdAt/lastLoginAt=serverTimestamp().
import { beforeUserCreated } from 'firebase-functions/v2/identity'
import { FIRESTORE_REGION } from '../../../shared/constants.js'

export const onAuthCreate = beforeUserCreated({ region: FIRESTORE_REGION }, async () => {
  // TODO(phase-2): create users/{uid} with defaults and stamp lastLoginAt
  return
})
