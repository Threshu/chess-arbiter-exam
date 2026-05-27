<script setup lang="ts">
import { doc, onSnapshot, updateDoc, type Firestore, type Unsubscribe } from 'firebase/firestore'
import type { Locale, User } from '~~/shared/types/user'

const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()
const { user, deleteAccount } = useAuth()
const { $firestore } = useNuxtApp()
const firestore = $firestore as Firestore

const displayName = ref('')
const localePref = ref<Locale>('pl')
const profile = ref<User | null>(null)
const loading = ref(true)
const saving = ref(false)
const savedFlash = ref(false)

const showConfirmDelete = ref(false)
const deleteTypeWord = ref('')
const deleting = ref(false)
const deleteError = ref<string | null>(null)

let unsubscribe: Unsubscribe | null = null

watch(
  user,
  (u) => {
    unsubscribe?.()
    if (!u) return
    unsubscribe = onSnapshot(doc(firestore, 'users', u.uid), (snap) => {
      const data = snap.data() as User | undefined
      if (data) {
        profile.value = data
        displayName.value = data.displayName ?? ''
        localePref.value = data.locale ?? 'pl'
      }
      loading.value = false
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => unsubscribe?.())

async function save() {
  const u = user.value
  if (!u) return
  saving.value = true
  savedFlash.value = false
  try {
    await updateDoc(doc(firestore, 'users', u.uid), {
      displayName: displayName.value.trim(),
      locale: localePref.value,
    })
    if (locale.value !== localePref.value) await setLocale(localePref.value)
    savedFlash.value = true
  } finally {
    saving.value = false
  }
}

async function onDeleteConfirm() {
  if (deleteTypeWord.value.trim().toUpperCase() !== t('settings.deleteConfirmWord')) return
  deleting.value = true
  deleteError.value = null
  try {
    await deleteAccount()
    await navigateTo(localePath('/'))
  } catch {
    deleteError.value = t('settings.deleteFailed')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-2xl px-6 py-10">
    <h1 class="font-display text-fg mb-2 text-3xl">{{ t('settings.title') }}</h1>
    <p class="text-muted mb-8">{{ t('settings.subtitle') }}</p>

    <UiCard v-if="loading">
      <p class="text-muted">…</p>
    </UiCard>

    <template v-else>
      <UiCard>
        <form class="flex flex-col gap-5" @submit.prevent="save">
          <UiInput v-model="displayName" :label="t('settings.displayName')" />

          <label for="settings-locale" class="flex flex-col gap-1.5">
            <span class="text-fg text-sm font-medium">{{ t('settings.locale') }}</span>
            <select
              id="settings-locale"
              v-model="localePref"
              class="bg-bg text-fg border-border h-10 rounded-md border px-3 text-base"
            >
              <option value="pl">{{ t('settings.localePl') }}</option>
              <option value="en">{{ t('settings.localeEn') }}</option>
            </select>
          </label>

          <div class="flex items-center gap-3">
            <UiButton type="submit" variant="primary" :loading="saving">
              {{ t('settings.save') }}
            </UiButton>
            <span v-if="savedFlash" class="text-success text-sm">{{ t('settings.saved') }}</span>
          </div>
        </form>
      </UiCard>

      <div class="mt-10">
        <h2 class="font-display text-fg mb-2 text-xl">{{ t('settings.deleteSection') }}</h2>
        <UiCard>
          <p class="text-muted mb-4 text-sm">{{ t('settings.deleteDescription') }}</p>

          <UiButton v-if="!showConfirmDelete" variant="danger" @click="showConfirmDelete = true">
            {{ t('settings.delete') }}
          </UiButton>

          <div v-else class="flex flex-col gap-3">
            <p class="text-fg text-sm font-medium">{{ t('settings.deleteConfirmTitle') }}</p>
            <UiInput
              v-model="deleteTypeWord"
              :label="t('settings.deleteConfirmType')"
              :placeholder="t('settings.deleteConfirmWord')"
            />
            <div class="flex gap-3">
              <UiButton
                variant="danger"
                :loading="deleting"
                :disabled="deleteTypeWord.trim().toUpperCase() !== t('settings.deleteConfirmWord')"
                @click="onDeleteConfirm"
              >
                {{ deleting ? t('settings.deleting') : t('settings.deleteConfirm') }}
              </UiButton>
              <UiButton
                variant="ghost"
                :disabled="deleting"
                @click="
                  showConfirmDelete = false
                  deleteTypeWord = ''
                "
              >
                {{ t('settings.deleteCancel') }}
              </UiButton>
            </div>
            <p v-if="deleteError" class="text-danger text-sm">{{ deleteError }}</p>
          </div>
        </UiCard>
      </div>
    </template>
  </section>
</template>
