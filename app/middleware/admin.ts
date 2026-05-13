import { getCurrentUser } from 'vuefire'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const user = await getCurrentUser()
  if (!user) return navigateTo('/auth/login')

  const token = await user.getIdTokenResult()
  if (token.claims.role !== 'admin') {
    return navigateTo('/app')
  }
})
