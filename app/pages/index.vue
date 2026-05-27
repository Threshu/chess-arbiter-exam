<script setup lang="ts">
import { getCurrentUser } from 'vuefire'

const { t } = useI18n()
const localePath = useLocalePath()

async function onStart() {
  const user = await getCurrentUser()
  if (!user) return navigateTo(localePath('/auth/login'))

  const isPasswordUser = user.providerData[0]?.providerId === 'password'
  if (isPasswordUser && !user.emailVerified) {
    return navigateTo(localePath('/auth/verify-email-needed'))
  }
  return navigateTo(localePath('/app'))
}
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-20 text-center">
    <h1 class="font-display text-fg mb-6 text-5xl">{{ t('hero.title') }}</h1>
    <p class="text-muted mx-auto mb-10 max-w-prose text-lg">{{ t('hero.subtitle') }}</p>
    <UiButton variant="primary" size="lg" @click="onStart">
      {{ t('hero.cta') }}
    </UiButton>
  </section>
</template>
