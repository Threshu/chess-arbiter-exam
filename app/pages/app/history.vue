<script setup lang="ts">
import {
  collection,
  documentId,
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  where,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore'
import type { Question, QuestionTypeId } from '~~/shared/types/question'

definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()
const { $firestore } = useNuxtApp()
const { user } = useAuth()
const firestore = $firestore as Firestore

interface Attempt {
  id: string
  questionId: string
  questionType: QuestionTypeId
  isCorrect: boolean
  answeredAt: Timestamp | null
}

const attempts = ref<Attempt[]>([])
const questionsById = ref<Map<string, Question>>(new Map())
const loading = ref(true)

watch(
  user,
  async (u) => {
    if (!u) return
    loading.value = true
    const q = query(
      collection(firestore, 'practiceAttempts'),
      where('userId', '==', u.uid),
      orderBy('answeredAt', 'desc'),
      fbLimit(50),
    )
    const snap = await getDocs(q)
    const items: Attempt[] = snap.docs.map((d) => {
      const data = d.data() as Omit<Attempt, 'id'>
      return { id: d.id, ...data }
    })
    attempts.value = items

    const uniqueIds = [...new Set(items.map((a) => a.questionId))]
    if (uniqueIds.length > 0) {
      const chunks: string[][] = []
      for (let i = 0; i < uniqueIds.length; i += 10) chunks.push(uniqueIds.slice(i, i + 10))
      const map = new Map<string, Question>()
      for (const chunk of chunks) {
        const qSnap = await getDocs(
          query(collection(firestore, 'questions'), where(documentId(), 'in', chunk)),
        )
        for (const d of qSnap.docs) map.set(d.id, d.data() as Question)
      }
      questionsById.value = map
    }

    loading.value = false
  },
  { immediate: true },
)

function stemFor(questionId: string): string {
  const q = questionsById.value.get(questionId)
  if (!q) return '—'
  return q.content[locale.value as 'pl' | 'en'].stem
}

function truncate(s: string, n = 80) {
  return s.length > n ? s.slice(0, n) + '…' : s
}

function formatWhen(ts: Timestamp | null): string {
  if (!ts) return ''
  const d = ts.toDate()
  return d.toLocaleString(locale.value, { dateStyle: 'short', timeStyle: 'short' })
}
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-10">
    <h1 class="font-display text-fg mb-6 text-3xl">{{ t('practice.history.title') }}</h1>

    <UiCard v-if="loading">
      <p class="text-muted">…</p>
    </UiCard>

    <UiCard v-else-if="attempts.length === 0">
      <p class="text-muted">{{ t('practice.history.empty') }}</p>
    </UiCard>

    <UiCard v-else>
      <table class="w-full text-left text-sm">
        <thead class="text-muted border-border border-b">
          <tr>
            <th class="py-2 pr-4">{{ t('practice.history.columns.question') }}</th>
            <th class="py-2 pr-4">{{ t('practice.history.columns.result') }}</th>
            <th class="py-2 pr-4">{{ t('practice.history.columns.when') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in attempts" :key="a.id" class="border-border border-b last:border-0">
            <td class="py-3 pr-4">{{ truncate(stemFor(a.questionId)) }}</td>
            <td class="py-3 pr-4">
              <UiBadge :variant="a.isCorrect ? 'success' : 'danger'">
                <svg
                  v-if="a.isCorrect"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  class="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  class="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {{ a.isCorrect ? t('practice.correct') : t('practice.incorrect') }}
              </UiBadge>
            </td>
            <td class="text-muted py-3 pr-4">{{ formatWhen(a.answeredAt) }}</td>
          </tr>
        </tbody>
      </table>
    </UiCard>
  </section>
</template>
