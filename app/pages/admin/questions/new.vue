<script setup lang="ts">
import { addDoc, collection, serverTimestamp, type Firestore } from 'firebase/firestore'

definePageMeta({ middleware: ['admin'], layout: 'admin' })

const { t } = useI18n()
const localePath = useLocalePath()
const { $firestore } = useNuxtApp()
const { user } = useAuth()
const firestore = $firestore as Firestore

const saving = ref(false)

async function onSave(payload: Record<string, unknown>) {
  const u = user.value
  if (!u) return
  saving.value = true
  try {
    await addDoc(collection(firestore, 'questions'), {
      ...payload,
      createdBy: u.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    await navigateTo(localePath('/admin/questions'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="max-w-3xl">
    <h1 class="font-display text-fg mb-6 text-3xl">{{ t('questions.form.title') }}</h1>
    <AdminQuestionForm :saving="saving" @save="onSave" />
  </section>
</template>
