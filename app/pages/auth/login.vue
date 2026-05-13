<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { signInWithGoogle } = useAuth()

const error = ref<string | null>(null)
const loading = ref(false)

async function onSignIn() {
  error.value = null
  loading.value = true
  try {
    await signInWithGoogle()
    await navigateTo(localePath('/app'))
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('login.error')
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
        <UiButton variant="primary" :loading="loading" @click="onSignIn">
          {{ t('login.signInWithGoogle') }}
        </UiButton>
        <p v-if="error" role="alert" class="text-danger text-sm">{{ error }}</p>
      </div>
    </UiCard>
  </section>
</template>
