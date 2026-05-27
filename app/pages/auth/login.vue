<script setup lang="ts">
import { FirebaseError } from 'firebase/app'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { signInWithGoogle, signInWithEmail } = useAuth()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const redirectTo = computed(() => {
  const raw = route.query.redirect
  if (typeof raw === 'string' && raw.startsWith('/')) return raw
  return localePath('/app')
})

function mapAuthError(e: unknown): string {
  if (e instanceof FirebaseError) {
    const map: Record<string, string> = {
      'auth/invalid-credential': t('login.errors.invalidCredential'),
      'auth/invalid-login-credentials': t('login.errors.invalidCredential'),
      'auth/user-not-found': t('login.errors.userNotFound'),
      'auth/wrong-password': t('login.errors.wrongPassword'),
      'auth/invalid-email': t('login.errors.invalidEmail'),
      'auth/user-disabled': t('login.errors.userDisabled'),
      'auth/too-many-requests': t('login.errors.tooManyRequests'),
      'auth/network-request-failed': t('login.errors.network'),
      'auth/popup-closed-by-user': t('login.errors.popupClosed'),
      'auth/cancelled-popup-request': t('login.errors.popupClosed'),
      'auth/popup-blocked': t('login.errors.popupBlocked'),
    }
    return map[e.code] ?? t('login.errors.generic')
  }
  return t('login.errors.generic')
}

async function onGoogle() {
  error.value = null
  loading.value = true
  try {
    await signInWithGoogle()
    await navigateTo(redirectTo.value)
  } catch (e) {
    error.value = mapAuthError(e)
  } finally {
    loading.value = false
  }
}

async function onEmail() {
  error.value = null
  loading.value = true
  try {
    await signInWithEmail(email.value.trim(), password.value)
    await navigateTo(redirectTo.value)
  } catch (e) {
    error.value = mapAuthError(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-md px-6 py-16">
    <UiCard>
      <template #header>
        <h1 class="font-display text-fg text-2xl">{{ t('login.title') }}</h1>
        <p class="text-muted mt-1 text-sm">{{ t('login.subtitle') }}</p>
      </template>

      <div class="flex flex-col gap-4">
        <UiButton variant="primary" :loading="loading" @click="onGoogle">
          {{ t('login.signInWithGoogle') }}
        </UiButton>

        <div class="text-muted my-2 flex items-center gap-3 text-xs">
          <span class="border-border flex-1 border-t" />
          <span>{{ t('login.orEmailPassword') }}</span>
          <span class="border-border flex-1 border-t" />
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="onEmail">
          <UiInput v-model="email" type="email" :label="t('login.emailLabel')" required />
          <UiInput v-model="password" type="password" :label="t('login.passwordLabel')" required />
          <UiButton variant="secondary" type="submit" :loading="loading">
            {{ t('login.submit') }}
          </UiButton>
        </form>

        <p v-if="error" role="alert" class="text-danger text-sm">{{ error }}</p>
      </div>

      <template #footer>
        <div class="text-muted flex flex-col gap-1 text-sm">
          <p>
            {{ t('login.noAccount') }}
            <NuxtLink :to="localePath('/auth/register')" class="text-primary underline">
              {{ t('login.register') }}
            </NuxtLink>
          </p>
          <NuxtLink :to="localePath('/auth/forgot-password')" class="text-primary underline">
            {{ t('login.forgotPassword') }}
          </NuxtLink>
        </div>
      </template>
    </UiCard>
  </section>
</template>
