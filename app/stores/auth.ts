import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const { user, claims, isAdmin, signInWithGoogle, signOut } = useAuth()

  return { user, claims, isAdmin, signInWithGoogle, signOut }
})
