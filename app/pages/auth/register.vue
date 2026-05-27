<script setup lang="ts">
import { FirebaseError } from 'firebase/app'

const { t } = useI18n()
const localePath = useLocalePath()
const { signUpWithEmail } = useAuth()

const displayName = ref('')
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

async function onSubmit() {
  error.value = null
  if (password.value.length < 8) {
    error.value = t('register.errors.weakPassword')
    return
  }
  loading.value = true
  try {
    await signUpWithEmail(email.value.trim(), password.value, displayName.value.trim() || undefined)
    await navigateTo(localePath('/auth/verify-email-needed'))
  } catch (e) {
    if (e instanceof FirebaseError) {
      const map: Record<string, string> = {
        'auth/email-already-in-use': t('register.errors.emailInUse'),
        'auth/invalid-email': t('register.errors.invalidEmail'),
        'auth/weak-password': t('register.errors.weakPassword'),
      }
      error.value = map[e.code] ?? t('register.errors.generic')
    } else {
      error.value = t('register.errors.generic')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-md px-6 py-16">
    <UiCard>
      <template #header>
        <h1 class="font-display text-fg text-2xl">{{ t('register.title') }}</h1>
        <p class="text-muted mt-1 text-sm">{{ t('register.subtitle') }}</p>
      </template>

      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <UiInput v-model="displayName" :label="t('register.displayName')" />
        <UiInput v-model="email" type="email" :label="t('register.emailLabel')" required />
        <UiInput
          v-model="password"
          type="password"
          :label="t('register.passwordLabel')"
          :hint="t('register.passwordHint')"
          required
        />

        <UiButton variant="primary" type="submit" :loading="loading">
          {{ t('register.submit') }}
        </UiButton>

        <p v-if="error" role="alert" class="text-danger text-sm">{{ error }}</p>
      </form>

      <template #footer>
        <p class="text-muted text-sm">
          {{ t('register.haveAccount') }}
          <NuxtLink :to="localePath('/auth/login')" class="text-primary underline">
            {{ t('register.signIn') }}
          </NuxtLink>
        </p>
      </template>
    </UiCard>
  </section>
</template>
