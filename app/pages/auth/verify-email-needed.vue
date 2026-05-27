<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { user, isEmailVerified, resendVerification, signOut } = useAuth()

const resending = ref(false)
const resentMessage = ref<string | null>(null)
let pollInterval: ReturnType<typeof setInterval> | null = null

async function poll() {
  try {
    await user.value?.reload()
    if (isEmailVerified.value) {
      stopPoll()
      await navigateTo(localePath('/app'))
    }
  } catch {
    // ignore transient errors
  }
}

function stopPoll() {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

onMounted(() => {
  pollInterval = setInterval(poll, 3000)
})

onBeforeUnmount(stopPoll)

async function onResend() {
  resending.value = true
  resentMessage.value = null
  try {
    await resendVerification()
    resentMessage.value = t('verify.resent')
  } finally {
    resending.value = false
  }
}

async function onSignOut() {
  stopPoll()
  await signOut()
  await navigateTo(localePath('/'))
}
</script>

<template>
  <section class="mx-auto max-w-md px-6 py-16">
    <UiCard>
      <template #header>
        <h1 class="font-display text-fg text-2xl">{{ t('verify.title') }}</h1>
      </template>

      <p class="text-muted mb-3 text-sm">
        {{ t('verify.subtitle', { email: user?.email ?? '' }) }}
      </p>
      <p class="text-muted mb-6 text-sm">{{ t('verify.autoRedirect') }}</p>

      <div class="border-border bg-bg mb-6 flex items-center gap-3 rounded-md border px-3 py-2">
        <svg
          class="text-muted h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span class="text-muted text-sm">{{ t('verify.checking') }}</span>
      </div>

      <div class="flex flex-col gap-3">
        <UiButton variant="secondary" :loading="resending" @click="onResend">
          {{ t('verify.resend') }}
        </UiButton>
        <UiButton variant="ghost" @click="onSignOut">
          {{ t('verify.signOut') }}
        </UiButton>
        <p v-if="resentMessage" class="text-success text-sm">{{ resentMessage }}</p>
      </div>
    </UiCard>
  </section>
</template>
