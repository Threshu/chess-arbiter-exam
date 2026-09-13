<script setup lang="ts">
import { doc, onSnapshot, type Firestore, type Unsubscribe } from 'firebase/firestore'
import type { User } from '~~/shared/types/user'

const { t } = useI18n()
const localePath = useLocalePath()
const { user } = useAuth()
const { $firestore } = useNuxtApp()
const firestore = $firestore as Firestore

const profile = ref<User | null>(null)
let unsubscribe: Unsubscribe | null = null

watch(
  user,
  (u) => {
    unsubscribe?.()
    unsubscribe = null
    if (!u) return
    unsubscribe = onSnapshot(doc(firestore, 'users', u.uid), (snap) => {
      profile.value = (snap.data() as User) ?? null
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => unsubscribe?.())

const attempts = computed(() => profile.value?.stats?.attempts ?? 0)
const correct = computed(() => profile.value?.stats?.correct ?? 0)
const accuracy = computed(() =>
  attempts.value > 0 ? Math.round((correct.value / attempts.value) * 100) : 0,
)
const displayName = computed(
  () => profile.value?.displayName || user.value?.displayName || user.value?.email || 'student',
)
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-10">
    <h1 class="font-display text-fg mb-2 text-3xl">
      {{ t('dashboard.title', { name: displayName }) }}
    </h1>
    <p class="text-muted mb-8">{{ t('dashboard.subtitle') }}</p>

    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <UiCard>
        <p class="text-muted mb-1 text-sm">{{ t('dashboard.statsAttempts') }}</p>
        <p class="font-display text-fg text-3xl">{{ attempts }}</p>
      </UiCard>
      <UiCard>
        <p class="text-muted mb-1 text-sm">{{ t('dashboard.statsCorrect') }}</p>
        <p class="font-display text-fg text-3xl">{{ correct }}</p>
      </UiCard>
      <UiCard>
        <p class="text-muted mb-1 text-sm">{{ t('dashboard.statsAccuracy') }}</p>
        <p class="font-display text-fg text-3xl">{{ accuracy }}%</p>
      </UiCard>
    </div>

    <div class="flex flex-wrap gap-3">
      <NuxtLink :to="localePath('/app/practice')">
        <UiButton variant="primary" size="lg">{{ t('dashboard.continueCta') }}</UiButton>
      </NuxtLink>
      <NuxtLink :to="localePath('/app/history')">
        <UiButton variant="secondary" size="lg">{{ t('practice.history.title') }}</UiButton>
      </NuxtLink>
      <NuxtLink :to="localePath('/app/settings')">
        <UiButton variant="ghost" size="lg">{{ t('dashboard.settingsCta') }}</UiButton>
      </NuxtLink>
    </div>
  </section>
</template>
