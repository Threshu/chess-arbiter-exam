import { getCurrentUser } from 'vuefire'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const needsAuth = to.path.startsWith('/app') || to.path.startsWith('/admin')
  if (!needsAuth) return

  const user = await getCurrentUser()
  if (!user) {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  }
})
