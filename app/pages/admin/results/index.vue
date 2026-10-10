<script setup lang="ts">
import type { SavedExamSummary } from '~/composables/useSavedExams'
import {
  questionsAcrossSessions,
  sessionSummary,
  type CandidateResult,
  type ExamSession,
} from '~/utils/examResults'

definePageMeta({ middleware: ['admin'], layout: 'admin' })

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const examResults = useExamResults()
const savedExams = useSavedExams()

const loading = ref(true)
const error = ref<string | null>(null)
const entries = ref<{ session: ExamSession; results: CandidateResult[] }[]>([])

async function load() {
  loading.value = true
  error.value = null
  try {
    const sessions = await examResults.listSessions()
    entries.value = await Promise.all(
      sessions.map(async (session) => ({
        session,
        results: await examResults.loadResults(session.id),
      })),
    )
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const rows = computed(() =>
  entries.value.map(({ session, results }) => ({ session, ...sessionSummary(session, results) })),
)

// Oldest first, so a question's columns read as a timeline.
const chronological = computed(() =>
  [...entries.value].sort((a, b) => a.session.date.localeCompare(b.session.date)),
)
const sharedQuestions = computed(() => questionsAcrossSessions(chronological.value))

function percent(value: number) {
  return `${Math.round(value)}%`
}

function share(value: number | null) {
  return value === null ? '—' : `${Math.round(value * 100)}%`
}

// New session
const createOpen = ref(false)
const exams = ref<SavedExamSummary[]>([])
const newExamId = ref('')
const newName = ref('')
const newDate = ref(new Date().toISOString().slice(0, 10))
const creating = ref(false)
const createError = ref<string | null>(null)

async function openCreate() {
  createOpen.value = true
  createError.value = null
  exams.value = await savedExams.list()
  if (!newExamId.value && exams.value[0]) {
    newExamId.value = exams.value[0].id
    newName.value = exams.value[0].examTitle
  }
}

function onExamChange() {
  const exam = exams.value.find((e) => e.id === newExamId.value)
  if (exam) newName.value = exam.examTitle
}

async function create() {
  if (!newExamId.value || !newName.value.trim()) return
  creating.value = true
  createError.value = null
  try {
    const id = await examResults.createSession(newExamId.value, newName.value.trim(), newDate.value)
    await router.push(localePath(`/admin/results/${id}`))
  } catch (cause) {
    createError.value = cause instanceof Error ? cause.message : String(cause)
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-5xl px-6 py-10">
    <div class="mb-2 flex flex-wrap items-start justify-between gap-3">
      <h1 class="font-display text-fg text-3xl">{{ t('results.title') }}</h1>
      <UiButton @click="openCreate">{{ t('results.newSession') }}</UiButton>
    </div>
    <p class="text-muted mb-8">{{ t('results.subtitle') }}</p>

    <p v-if="loading" class="text-muted">{{ t('results.loading') }}</p>

    <UiCard v-else-if="error">
      <p class="text-fg">{{ t('results.error') }}</p>
      <p class="text-muted mt-1 text-sm">{{ error }}</p>
    </UiCard>

    <UiCard v-else-if="!rows.length">
      <p class="text-fg">{{ t('results.empty') }}</p>
      <p class="text-muted mt-1 text-sm">{{ t('results.emptyHint') }}</p>
    </UiCard>

    <template v-else>
      <ul class="mb-10 flex flex-col gap-3">
        <li v-for="row in rows" :key="row.session.id">
          <NuxtLink :to="localePath(`/admin/results/${row.session.id}`)" class="block">
            <UiCard class="hover:border-accent transition-colors">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p class="font-display text-fg text-xl">{{ row.session.name }}</p>
                  <p class="text-muted mt-1 text-sm">
                    {{ row.session.date }} &middot;
                    {{ t('results.candidateCount', row.candidates) }}
                  </p>
                </div>
                <div v-if="row.candidates" class="text-right text-sm">
                  <p class="text-fg">
                    {{ t('results.average', { value: percent(row.averagePercent) }) }}
                  </p>
                  <p class="text-muted">
                    {{ t('results.passRate', { passed: row.passed, graded: row.graded }) }}
                  </p>
                </div>
              </div>
            </UiCard>
          </NuxtLink>
        </li>
      </ul>

      <template v-if="chronological.length >= 2">
        <h2 class="font-display text-fg mb-3 text-2xl">{{ t('results.compare.title') }}</h2>
        <p class="text-muted mb-4 text-sm">{{ t('results.compare.hint') }}</p>
        <UiCard v-if="!sharedQuestions.length">
          <p class="text-muted text-sm">{{ t('results.compare.none') }}</p>
        </UiCard>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-border text-muted border-b text-left">
                <th class="py-2 pr-4 font-medium">{{ t('results.compare.question') }}</th>
                <th
                  v-for="e in chronological"
                  :key="e.session.id"
                  class="py-2 pr-4 text-right font-medium"
                >
                  {{ e.session.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in sharedQuestions"
                :key="row.questionId"
                class="border-border border-b last:border-0"
              >
                <td class="text-fg max-w-md truncate py-2 pr-4" :title="row.stem">
                  {{ row.stem }}
                </td>
                <td
                  v-for="(value, i) in row.averages"
                  :key="i"
                  class="text-fg py-2 pr-4 text-right tabular-nums"
                >
                  {{ share(value) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>

    <UiConfirmDialog
      :open="createOpen"
      :title="t('results.newSession')"
      size="md"
      hide-actions
      @update:open="createOpen = $event"
    >
      <form class="flex flex-col gap-4" @submit.prevent="create">
        <label for="rs-exam" class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('results.create.exam') }}</span>
          <select
            id="rs-exam"
            v-model="newExamId"
            class="bg-bg text-fg border-border h-10 rounded-md border px-3 text-base"
            @change="onExamChange"
          >
            <option v-for="e in exams" :key="e.id" :value="e.id">
              {{ e.examTitle }} ({{ t('results.create.questions', e.questionCount) }})
            </option>
          </select>
          <span class="text-muted text-xs">{{ t('results.create.examHint') }}</span>
        </label>
        <UiInput v-model="newName" :label="t('results.create.name')" required />
        <UiInput v-model="newDate" type="date" :label="t('results.create.date')" required />
        <p v-if="createError" class="text-danger text-sm">{{ createError }}</p>
        <div class="flex justify-end gap-2">
          <UiButton variant="ghost" @click="createOpen = false">{{ t('actions.cancel') }}</UiButton>
          <UiButton type="submit" :loading="creating" :disabled="!newExamId || !newName.trim()">
            {{ t('results.create.submit') }}
          </UiButton>
        </div>
      </form>
    </UiConfirmDialog>
  </section>
</template>
