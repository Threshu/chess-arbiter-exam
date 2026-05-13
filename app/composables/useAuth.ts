import { useCurrentUser } from 'vuefire'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  getIdTokenResult,
  type Auth,
} from 'firebase/auth'

export function useAuth() {
  const user = useCurrentUser()
  const { $firebaseAuth } = useNuxtApp()
  const auth = $firebaseAuth as Auth

  const claims = ref<Record<string, unknown>>({})

  watch(
    user,
    async (u) => {
      if (u) {
        const token = await getIdTokenResult(u)
        claims.value = token.claims
      } else {
        claims.value = {}
      }
    },
    { immediate: true },
  )

  const isAdmin = computed(() => claims.value.role === 'admin')

  async function signInWithGoogle() {
    await signInWithPopup(auth, new GoogleAuthProvider())
  }

  async function signOut() {
    await fbSignOut(auth)
  }

  return { user, claims, isAdmin, signInWithGoogle, signOut }
}
