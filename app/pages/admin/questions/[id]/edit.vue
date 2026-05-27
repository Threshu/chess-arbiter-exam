<script setup lang="ts">
import { doc, getDoc, serverTimestamp, updateDoc, type Firestore } from 'firebase/firestore'
import type { Question } from '~~/shared/types/question'

definePageMeta({ middleware: ['admin'], layout: 'admin' })

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { $firestore } = useNuxtApp()
const firestore = $firestore as Firestore

const id = route.params.id as string

const question = ref<Question | null>(null)
const loading = ref(true)
const saving = ref(false)
const notFound = ref(false)

onMounted(async () => {
  const snap = await getDoc(doc(firestore, 'questions', id))
  if (!snap.exists()) {
    notFound.value = true
  } else {
    question.value = snap.data() as Question
  }
  loading.value = false
})

async function onSave(payload: Record<string, unknown>) {
  saving.value = true
  try {
    await updateDoc(doc(firestore, 'questions', id), {
      ...payload,
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
    <h1 class="font-display text-fg mb-6 text-3xl">{{ t('questions.edit.title') }}</h1>

    <UiCard v-if="loading">
      <p class="text-muted">…</p>
    </UiCard>

    <UiCard v-else-if="notFound">
      <p class="text-muted">{{ t('questions.edit.notFound') }}</p>
      <NuxtLink
        :to="localePath('/admin/questions')"
        class="text-primary mt-2 inline-block underline"
      >
        {{ t('questions.edit.backToList') }}
      </NuxtLink>
    </UiCard>

    <AdminQuestionForm
      v-else-if="question"
      :initial-value="question"
      :saving="saving"
      @save="onSave"
    />
  </section>
</template>
