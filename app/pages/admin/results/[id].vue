<script setup lang="ts">
import {
  candidateScore,
  levelShort,
  questionStats,
  resultsCsv,
  sessionSummary,
  type CandidateResult,
  type ExamSession,
} from '~/utils/examResults'

definePageMeta({ middleware: ['admin'], layout: 'admin' })

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const examResults = useExamResults()

const sessionId = computed(() => String(route.params.id ?? ''))
const session = ref<ExamSession | null>(null)
const results = ref<CandidateResult[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    session.value = await examResults.loadSession(sessionId.value)
    results.value = session.value ? await examResults.loadResults(sessionId.value) : []
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const TABS = ['candidates', 'questions'] as const
const tab = ref<(typeof TABS)[number]>('candidates')

const summary = computed(() =>
  session.value ? sessionSummary(session.value, results.value) : null,
)

const rows = computed(() => {
  const s = session.value
  if (!s) return []
  return results.value
    .map((result) => ({ result, score: candidateScore(s, result) }))
    .sort((a, b) => b.score.percent - a.score.percent)
})

const sortByDifficulty = ref(false)
const stats = computed(() => {
  if (!session.value) return []
  const list = questionStats(session.value, results.value)
  return sortByDifficulty.value ? [...list].sort((a, b) => a.average - b.average) : list
})

function percent(value: number) {
  return `${Math.round(value)}%`
}

function points(value: number) {
  return String(value).replace('.', ',')
}

function letterSummary(stat: (typeof stats.value)[number]) {
  return Object.entries(stat.letters)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, count]) => ({
      letter,
      count,
      correct: stat.question.correct.includes(letter),
    }))
}

// Candidate sheet dialog
const formOpen = ref(false)
const editing = ref<CandidateResult | null>(null)
const saving = ref(false)
const formKey = ref(0)

function openNew() {
  editing.value = null
  formKey.value++
  formOpen.value = true
}

function openEdit(result: CandidateResult) {
  editing.value = result
  formKey.value++
  formOpen.value = true
}

async function save(result: Omit<CandidateResult, 'id'>) {
  saving.value = true
  try {
    await examResults.saveResult(sessionId.value, result, editing.value?.id)
    formOpen.value = false
    await load()
  } finally {
    saving.value = false
  }
}

const deleting = ref<CandidateResult | null>(null)

async function confirmDelete() {
  if (!deleting.value) return
  await examResults.deleteResult(sessionId.value, deleting.value.id)
  deleting.value = null
  await load()
}

const deleteSessionOpen = ref(false)

async function confirmDeleteSession() {
  await examResults.deleteSession(sessionId.value)
  await router.push(localePath('/admin/results'))
}

function exportCsv() {
  if (!session.value) return
  const blob = new Blob([resultsCsv(session.value, results.value)], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `wyniki-${session.value.name}-${session.value.date}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .concat('.csv')
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <section class="mx-auto max-w-5xl px-6 py-10">
    <NuxtLink :to="localePath('/admin/results')" class="text-muted mb-4 inline-block text-sm">
      &larr; {{ t('results.backToList') }}
    </NuxtLink>

    <p v-if="loading" class="text-muted">{{ t('results.loading') }}</p>

    <UiCard v-else-if="error">
      <p class="text-fg">{{ t('results.error') }}</p>
      <p class="text-muted mt-1 text-sm">{{ error }}</p>
    </UiCard>

    <UiCard v-else-if="!session">
      <p class="text-fg">{{ t('results.notFound') }}</p>
    </UiCard>

    <template v-else>
      <div class="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="font-display text-fg text-3xl">{{ session.name }}</h1>
          <p class="text-muted mt-1">
            {{ session.date }} &middot; {{ t('results.questionCount', session.questions.length) }}
            &middot;
            <span v-for="(th, i) in session.passThresholds" :key="th.level">
              {{ i ? ', ' : '' }}{{ t(`levels.${th.level}`) }} {{ th.percent }}%
            </span>
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <UiButton variant="secondary" size="sm" :disabled="!results.length" @click="exportCsv">
            {{ t('results.export') }}
          </UiButton>
          <UiButton size="sm" @click="openNew">{{ t('results.addCandidate') }}</UiButton>
        </div>
      </div>

      <div v-if="summary && summary.candidates" class="my-6 grid grid-cols-3 gap-3">
        <UiCard>
          <p class="text-muted text-xs">{{ t('results.stats.candidates') }}</p>
          <p class="font-display text-fg text-2xl">{{ summary.candidates }}</p>
        </UiCard>
        <UiCard>
          <p class="text-muted text-xs">{{ t('results.stats.average') }}</p>
          <p class="font-display text-fg text-2xl">{{ percent(summary.averagePercent) }}</p>
        </UiCard>
        <UiCard>
          <p class="text-muted text-xs">{{ t('results.stats.passed') }}</p>
          <p class="font-display text-fg text-2xl">{{ summary.passed }} / {{ summary.graded }}</p>
        </UiCard>
      </div>

      <div class="border-border mb-4 flex gap-1 border-b" role="tablist">
        <button
          v-for="key in TABS"
          :key="key"
          type="button"
          role="tab"
          :aria-selected="tab === key"
          :class="[
            '-mb-px border-b-2 px-4 py-2 text-sm',
            tab === key ? 'border-primary text-fg font-medium' : 'text-muted border-transparent',
          ]"
          @click="tab = key"
        >
          {{ t(`results.tabs.${key}`) }}
        </button>
      </div>

      <template v-if="tab === 'candidates'">
        <UiCard v-if="!rows.length">
          <p class="text-muted text-sm">{{ t('results.noCandidates') }}</p>
        </UiCard>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-border text-muted border-b text-left">
                <th class="py-2 pr-4 font-medium">{{ t('results.columns.candidate') }}</th>
                <th class="py-2 pr-4 font-medium">{{ t('results.columns.level') }}</th>
                <th class="py-2 pr-4 text-right font-medium">{{ t('results.columns.points') }}</th>
                <th class="py-2 pr-4 text-right font-medium">{{ t('results.columns.percent') }}</th>
                <th class="py-2 pr-4 font-medium">{{ t('results.columns.result') }}</th>
                <th class="py-2" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="{ result, score } in rows"
                :key="result.id"
                class="border-border border-b last:border-0"
              >
                <td class="text-fg py-2 pr-4 font-medium">{{ result.candidate }}</td>
                <td class="text-fg py-2 pr-4">{{ levelShort(result.level) }}</td>
                <td class="text-fg py-2 pr-4 text-right tabular-nums">
                  {{ points(score.total) }} / {{ points(score.max) }}
                </td>
                <td class="text-fg py-2 pr-4 text-right tabular-nums">
                  {{ percent(score.percent) }}
                </td>
                <td class="py-2 pr-4">
                  <UiBadge
                    v-if="score.passed !== null"
                    :variant="score.passed ? 'success' : 'danger'"
                  >
                    {{ score.passed ? t('results.passed') : t('results.failed') }}
                  </UiBadge>
                  <span v-if="score.required !== null" class="text-muted ml-2 text-xs">
                    {{ t('results.required', { points: score.required }) }}
                  </span>
                </td>
                <td class="py-2 text-right whitespace-nowrap">
                  <UiButton variant="ghost" size="sm" @click="openEdit(result)">
                    {{ t('results.edit') }}
                  </UiButton>
                  <UiButton variant="ghost" size="sm" @click="deleting = result">
                    {{ t('actions.delete') }}
                  </UiButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else>
        <label for="rs-sort" class="text-muted mb-3 flex items-center gap-2 text-sm">
          <input id="rs-sort" v-model="sortByDifficulty" type="checkbox" >
          {{ t('results.sortByDifficulty') }}
        </label>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-border text-muted border-b text-left">
                <th class="py-2 pr-3 font-medium">{{ t('results.columns.no') }}</th>
                <th class="py-2 pr-3 font-medium">{{ t('results.columns.question') }}</th>
                <th class="py-2 pr-3 text-right font-medium">{{ t('results.columns.score') }}</th>
                <th class="py-2 pr-3 text-right font-medium">{{ t('results.columns.full') }}</th>
                <th class="py-2 font-medium">{{ t('results.columns.answers') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="stat in stats"
                :key="stat.question.questionId"
                class="border-border border-b last:border-0"
              >
                <td class="text-fg py-2 pr-3 font-medium">{{ stat.question.no }}.</td>
                <td class="text-muted max-w-xs truncate py-2 pr-3" :title="stat.question.stem">
                  {{ stat.question.stem }}
                </td>
                <td class="py-2 pr-3 text-right tabular-nums">
                  <span
                    v-if="stat.attempts"
                    :class="stat.average < 0.5 ? 'text-danger font-medium' : 'text-fg'"
                  >
                    {{ percent(stat.average * 100) }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td class="text-fg py-2 pr-3 text-right tabular-nums">
                  {{ stat.full }} / {{ stat.attempts }}
                </td>
                <td class="py-2">
                  <span
                    v-for="l in letterSummary(stat)"
                    :key="l.letter"
                    :class="[
                      'mr-2 inline-block text-xs',
                      l.correct ? 'text-success font-medium' : 'text-muted',
                    ]"
                  >
                    {{ l.letter }}: {{ l.count }}{{ l.correct ? ' ✓' : '' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <div class="mt-10 flex justify-end">
        <UiButton variant="danger" size="sm" @click="deleteSessionOpen = true">
          {{ t('results.deleteSession') }}
        </UiButton>
      </div>

      <UiConfirmDialog
        :open="formOpen"
        :title="
          editing
            ? t('results.editCandidate', { name: editing.candidate })
            : t('results.addCandidate')
        "
        size="lg"
        hide-actions
        @update:open="formOpen = $event"
      >
        <AdminResultForm
          :key="formKey"
          :session="session"
          :initial="editing"
          :saving="saving"
          @save="save"
          @cancel="formOpen = false"
        />
      </UiConfirmDialog>

      <UiConfirmDialog
        :open="deleting !== null"
        :title="t('results.deleteCandidate.title')"
        :description="t('results.deleteCandidate.description', { name: deleting?.candidate ?? '' })"
        variant="danger"
        :confirm-text="t('actions.delete')"
        @update:open="!$event && (deleting = null)"
        @confirm="confirmDelete"
      />

      <UiConfirmDialog
        :open="deleteSessionOpen"
        :title="t('results.deleteSessionDialog.title')"
        :description="t('results.deleteSessionDialog.description', { name: session.name })"
        variant="danger"
        :confirm-text="t('actions.delete')"
        @update:open="deleteSessionOpen = $event"
        @confirm="confirmDeleteSession"
      />
    </template>
  </section>
</template>
