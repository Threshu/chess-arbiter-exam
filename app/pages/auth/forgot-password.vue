<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { sendPasswordReset } = useAuth()

const email = ref('')
const error = ref<string | null>(null)
const sent = ref(false)
const loading = ref(false)

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    await sendPasswordReset(email.value.trim())
    sent.value = true
  } catch (e) {
    // We intentionally do not differentiate "user not found" to avoid email enumeration.
    sent.value = true
    void e
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-md px-6 py-16">
    <UiCard>
      <template #header>
        <h1 class="font-display text-fg text-2xl">{{ t('forgot.title') }}</h1>
        <p class="text-muted mt-1 text-sm">{{ t('forgot.subtitle') }}</p>
      </template>

      <div v-if="sent" class="flex flex-col gap-3">
        <p class="text-success text-sm">{{ t('forgot.success') }}</p>
        <NuxtLink :to="localePath('/auth/login')">
          <UiButton variant="secondary">{{ t('forgot.backToLogin') }}</UiButton>
        </NuxtLink>
      </div>

      <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <UiInput v-model="email" type="email" :label="t('forgot.emailLabel')" required />
        <UiButton variant="primary" type="submit" :loading="loading">
          {{ t('forgot.submit') }}
        </UiButton>
        <p v-if="error" role="alert" class="text-danger text-sm">{{ error }}</p>
      </form>
    </UiCard>
  </section>
</template>
