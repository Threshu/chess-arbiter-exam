import { useCurrentUser } from 'vuefire'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  getIdTokenResult,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  type Firestore,
} from 'firebase/firestore'
import { DEFAULT_LOCALE } from '~~/shared/constants'

export function useAuth() {
  const user = useCurrentUser()
  const { $firebaseAuth, $firestore } = useNuxtApp()
  const auth = $firebaseAuth as Auth
  const firestore = $firestore as Firestore

  const claims = ref<Record<string, unknown>>({})

  watch(
    user,
    async (u) => {
      if (u) {
        await ensureUserProfile(u, firestore)
        const token = await getIdTokenResult(u, true)
        claims.value = token.claims
      } else {
        claims.value = {}
      }
    },
    { immediate: true },
  )

  const isAdmin = computed(() => claims.value.role === 'admin')
  const isPasswordUser = computed(() => user.value?.providerData[0]?.providerId === 'password')
  const isEmailVerified = computed(() => user.value?.emailVerified ?? false)
  const needsVerification = computed(() => isPasswordUser.value && !isEmailVerified.value)

  async function signInWithGoogle() {
    await signInWithPopup(auth, new GoogleAuthProvider())
  }

  async function signUpWithEmail(email: string, password: string, displayName?: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) await updateProfile(cred.user, { displayName })
    await sendEmailVerification(cred.user)
  }

  async function signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function sendPasswordReset(email: string) {
    await sendPasswordResetEmail(auth, email)
  }

  async function resendVerification() {
    if (user.value) await sendEmailVerification(user.value)
  }

  async function signOut() {
    await fbSignOut(auth)
  }

  async function deleteAccount() {
    const u = user.value
    if (!u) return

    const attemptsQuery = query(
      collection(firestore, 'practiceAttempts'),
      where('userId', '==', u.uid),
    )
    const attemptsSnap = await getDocs(attemptsQuery)

    // Firestore batch limit is 500
    const docs = attemptsSnap.docs
    for (let i = 0; i < docs.length; i += 400) {
      const batch = writeBatch(firestore)
      for (const d of docs.slice(i, i + 400)) batch.delete(d.ref)
      await batch.commit()
    }

    await deleteDoc(doc(firestore, 'users', u.uid))
    await deleteUser(u)
  }

  return {
    user,
    claims,
    isAdmin,
    isPasswordUser,
    isEmailVerified,
    needsVerification,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    sendPasswordReset,
    resendVerification,
    signOut,
    deleteAccount,
  }
}

async function ensureUserProfile(user: FirebaseUser, firestore: Firestore) {
  const userRef = doc(firestore, 'users', user.uid)
  const snapshot = await getDoc(userRef)

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? null,
      locale: DEFAULT_LOCALE,
      role: 'student',
      stats: { attempts: 0, correct: 0 },
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    })
  } else {
    await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true })
  }
}
