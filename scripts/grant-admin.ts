// One-off bootstrap: nadaje rolę 'admin' wskazanemu userowi.
// Usage: pnpm tsx scripts/grant-admin.ts <email-or-uid>
//
// Wymaga service account JSON w .secrets/service-account.json
// (pobierz: Firebase Console → Project Settings → Service accounts → Generate new private key)
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH ?? '.secrets/service-account.json'

const target = process.argv[2]
if (!target) {
  console.error('Usage: pnpm tsx scripts/grant-admin.ts <email-or-uid>')
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(resolve(SERVICE_ACCOUNT_PATH), 'utf8'))
initializeApp({ credential: cert(serviceAccount) })

const auth = getAuth()
const db = getFirestore()

const user = target.includes('@') ? await auth.getUserByEmail(target) : await auth.getUser(target)

const existingClaims = user.customClaims ?? {}
await auth.setCustomUserClaims(user.uid, { ...existingClaims, role: 'admin' })

await db.collection('users').doc(user.uid).set({ role: 'admin' }, { merge: true })

await db.collection('auditLogs').add({
  type: 'role.bootstrap',
  targetUid: user.uid,
  role: 'admin',
  actorUid: 'script:grant-admin',
  at: FieldValue.serverTimestamp(),
})

console.log(`Granted admin to ${user.email ?? '(no email)'} (${user.uid})`)
console.log('User must sign out and back in to refresh ID token claims.')
