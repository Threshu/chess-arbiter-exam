import { getCurrentUser } from 'vuefire'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  // Strip i18n prefix (/en/app/... → /app/...)
  const path = to.path.replace(/^\/(?:en|pl)(\/|$)/, '/')

  const isProtected = path.startsWith('/app') || path.startsWith('/admin')
  const isAuthFlow = path.startsWith('/auth')
  const isVerifyPage = path === '/auth/verify-email-needed'

  if (!isProtected && !isAuthFlow) return

  const user = await getCurrentUser()
  const isPasswordUser = user?.providerData[0]?.providerId === 'password'
  const needsVerify = !!user && !!isPasswordUser && !user.emailVerified

  if (isProtected) {
    if (!user) {
      return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
    }
    if (needsVerify) {
      return navigateTo('/auth/verify-email-needed')
    }
    return
  }

  // Auth flow — user is in /auth/*
  if (!user) {
    // Not signed in: only allow login/register/forgot/callback. Block verify page (no user).
    if (isVerifyPage) {
      return navigateTo('/auth/login')
    }
    return
  }

  // Signed in inside auth flow
  if (needsVerify) {
    if (!isVerifyPage) return navigateTo('/auth/verify-email-needed')
    return
  }

  // Signed in & verified — should not linger on login/register/forgot/verify. Send to /app.
  return navigateTo('/app')
})
