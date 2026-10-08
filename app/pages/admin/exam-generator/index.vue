<script setup lang="ts">
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore'
import type { Question } from '~~/shared/types/question'
import { createExamGeneratorState, type ExamGeneratorState } from '~/types/examGenerator'
import type { SavedExamSummary } from '~/composables/useSavedExams'
import { groupIntoSheets, type ExamSheet } from '~/utils/examSheets'
import { examSheetHeading, LEVELS } from '~~/shared/constants'
import { scoreExam } from '~/utils/examScoring'

definePageMeta({ middleware: ['admin'], layout: 'admin' })

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const { $firestore } = useNuxtApp()
const firestore = $firestore as Firestore
const { generateExamDocx } = useExamDocx()
const savedExams = useSavedExams()

const currentLocale = computed(() => locale.value as 'pl' | 'en')

type Row = Question & { id: string }

const rows = ref<Row[]>([])
const loading = ref(true)
const generating = ref(false)

const state = reactive(createExamGeneratorState())

const questionsById = computed<Record<string, Row>>(() =>
  Object.fromEntries(rows.value.map((r) => [r.id, r])),
)
const overriddenIds = computed(() => Object.keys(state.overrides))

/** Points available and the pass mark per class, for the line under the selected questions. */
const scoring = computed(() =>
  scoreExam(
    state.selectedQuestionIds,
    (id) => state.overrides[id] ?? questionsById.value[id],
    state.points,
    state.passThresholds,
  ),
)

function setPoints(id: string, points: number | null) {
  const { [id]: _previous, ...rest } = state.points
  state.points = points === null ? rest : { ...rest, [id]: points }
}

function addThreshold() {
  state.passThresholds.push({ level: 'III', percent: 80 })
}

function removeThreshold(index: number) {
  state.passThresholds.splice(index, 1)
}

let unsubscribe: Unsubscribe | null = null
let pendingArchive: string | null = null

onMounted(() => {
  const q = query(collection(firestore, 'questions'), orderBy('createdAt', 'desc'))
  unsubscribe = onSnapshot(q, (snap) => {
    rows.value = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Question) }))
    loading.value = false
    // `?archive=<exam>:<year>` needs the bank loaded, so it is handled after the first snapshot.
    if (pendingArchive) {
      openArchivedFromQuery(pendingArchive)
      pendingArchive = null
    }
  })
  // `?exam=<id>` opens a saved exam directly — the URL survives a reload and can be shared.
  if (typeof route.query.exam === 'string') openExam(route.query.exam)
  else if (typeof route.query.archive === 'string') pendingArchive = route.query.archive
})

onBeforeUnmount(() => unsubscribe?.())

function toggleSelect(id: string) {
  const i = state.selectedQuestionIds.indexOf(id)
  if (i === -1) state.selectedQuestionIds.push(id)
  else state.selectedQuestionIds.splice(i, 1)
}

function reorderSelected(ids: string[]) {
  state.selectedQuestionIds = ids
}

function removeSelected(id: string) {
  state.selectedQuestionIds = state.selectedQuestionIds.filter((x) => x !== id)
}

// Preview
const previewQuestion = ref<Row | null>(null)
const previewOpen = ref(false)
const settingsOpen = ref(false)

function openPreview(q: Row) {
  previewQuestion.value = q
  previewOpen.value = true
}

// Quick edit
const editQuestion = ref<Row | null>(null)
const editFormOpen = ref(false)
const saveChoiceOpen = ref(false)
const pendingPayload = ref<Record<string, unknown> | null>(null)
const savingChoice = ref(false)

function openEdit(q: Row) {
  editQuestion.value = q
  editFormOpen.value = true
}

function onEditFormSave(payload: Record<string, unknown>) {
  pendingPayload.value = payload
  editFormOpen.value = false
  saveChoiceOpen.value = true
}

async function persistToDatabase() {
  const target = editQuestion.value
  const payload = pendingPayload.value
  if (!target || !payload) return
  savingChoice.value = true
  try {
    await updateDoc(doc(firestore, 'questions', target.id), {
      ...payload,
      updatedAt: serverTimestamp(),
    })
    Reflect.deleteProperty(state.overrides, target.id)
    saveChoiceOpen.value = false
    pendingPayload.value = null
    editQuestion.value = null
  } finally {
    savingChoice.value = false
  }
}

function useOnlyInDocument() {
  const target = editQuestion.value
  const payload = pendingPayload.value
  if (!target || !payload) return
  state.overrides[target.id] = { ...target, ...payload } as Row
  saveChoiceOpen.value = false
  pendingPayload.value = null
  editQuestion.value = null
}

// Saved exams
const currentExamId = ref<string | null>(null)
const currentExamTitle = ref('')
const lastSavedAt = ref<Date | null>(null)
const savingExam = ref(false)
const examNotFound = ref(false)
const loadDialogOpen = ref(false)
const loadingList = ref(false)
const savedList = ref<SavedExamSummary[]>([])
const examToDelete = ref<SavedExamSummary | null>(null)
const deletingExam = ref(false)

async function setExamQuery(id: string | null, archive: string | null = null) {
  const next = { ...route.query }
  Reflect.deleteProperty(next, 'exam')
  Reflect.deleteProperty(next, 'archive')
  if (id) next.exam = id
  else if (archive) next.archive = archive
  await router.replace({ query: next })
}

function applyState(next: ExamGeneratorState) {
  Object.assign(state, next)
}

async function openExam(id: string) {
  const stored = await savedExams.load(id)
  if (!stored) {
    examNotFound.value = true
    return
  }
  applyState(stored)
  currentExamId.value = id
  currentExamTitle.value = stored.examTitle
  basedOnSheet.value = ''
  lastSavedAt.value = null
  examNotFound.value = false
  loadDialogOpen.value = false
  await setExamQuery(id)
}

async function openLoadDialog() {
  loadDialogOpen.value = true
  loadingList.value = true
  try {
    savedList.value = await savedExams.list()
  } finally {
    loadingList.value = false
  }
}

async function saveExam(asNew: boolean) {
  savingExam.value = true
  try {
    const id = await savedExams.save(state, asNew ? null : currentExamId.value)
    currentExamId.value = id
    currentExamTitle.value = state.examTitle
    basedOnSheet.value = ''
    lastSavedAt.value = new Date()
    examNotFound.value = false
    await setExamQuery(id)
  } finally {
    savingExam.value = false
  }
}

async function newExam() {
  applyState(createExamGeneratorState())
  currentExamId.value = null
  currentExamTitle.value = ''
  basedOnSheet.value = ''
  lastSavedAt.value = null
  await setExamQuery(null)
}

function closeDeleteDialog(open: boolean) {
  if (!open) examToDelete.value = null
}

async function confirmDeleteExam() {
  const target = examToDelete.value
  if (!target) return
  deletingExam.value = true
  try {
    await savedExams.remove(target.id)
    savedList.value = savedList.value.filter((e) => e.id !== target.id)
    if (currentExamId.value === target.id) {
      currentExamId.value = null
      currentExamTitle.value = ''
      await setExamQuery(null)
    }
    examToDelete.value = null
  } finally {
    deletingExam.value = false
  }
}

// Archived exams come from the same reconstruction as the exam archive (`groupIntoSheets`), read
// off the bank this page already listens to — one source of truth, nothing copied.
const archivedSheets = computed(() => groupIntoSheets(rows.value))
const basedOnSheet = ref('')
const archivedNotFound = ref(false)

function sheetKey(sheet: ExamSheet) {
  return `${sheet.exam}:${sheet.year}`
}

/** Starts a new, unsaved exam from an archived sheet; saving it never touches the archive. */
async function openArchivedSheet(sheet: ExamSheet) {
  const heading = examSheetHeading(sheet.exam, sheet.year)
  applyState({
    ...createExamGeneratorState(),
    examTitle: heading.title,
    dateline: heading.dateline ?? '',
    selectedQuestionIds: [...new Set(sheet.entries.map((e) => e.question.id))],
  })
  currentExamId.value = null
  currentExamTitle.value = ''
  basedOnSheet.value = heading.dateline ? `${heading.title} (${heading.dateline})` : heading.title
  lastSavedAt.value = null
  examNotFound.value = false
  archivedNotFound.value = false
  loadDialogOpen.value = false
  await setExamQuery(null, sheetKey(sheet))
}

function openArchivedFromQuery(key: string) {
  const sheet = archivedSheets.value.find((s) => sheetKey(s) === key)
  if (sheet) openArchivedSheet(sheet)
  else archivedNotFound.value = true
}

const currentExamLabel = computed(() => {
  if (currentExamId.value) {
    return t('examGenerator.saved.current', {
      title: currentExamTitle.value || t('examGenerator.saved.untitled'),
    })
  }
  if (basedOnSheet.value) return t('examGenerator.saved.fromArchive', { title: basedOnSheet.value })
  return t('examGenerator.saved.unsaved')
})

const deleteDescription = computed(() =>
  t('examGenerator.saved.deleteDescription', {
    title: examToDelete.value?.examTitle || t('examGenerator.saved.untitled'),
  }),
)

function formatDate(date: Date | null) {
  return date ? date.toLocaleString(locale.value) : ''
}

async function onGenerate() {
  generating.value = true
  try {
    await generateExamDocx(state, questionsById.value)
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <section class="flex max-w-6xl flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-fg text-3xl">{{ t('examGenerator.title') }}</h1>
      <button
        type="button"
        :aria-label="t('examGenerator.settings.open')"
        :title="t('examGenerator.settings.open')"
        class="text-muted hover:text-fg hover:bg-bg focus-visible:ring-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
        @click="settingsOpen = true"
      >
        <svg
          viewBox="0 0 24 24"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="7" cy="18" r="2" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>

    <div
      class="border-border bg-surface flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3"
    >
      <div class="text-sm">
        <p class="text-fg font-medium">{{ currentExamLabel }}</p>
        <p v-if="lastSavedAt" class="text-muted">
          {{ t('examGenerator.saved.savedAt', { time: formatDate(lastSavedAt) }) }}
        </p>
        <p v-if="examNotFound" class="text-danger">{{ t('examGenerator.saved.notFound') }}</p>
        <p v-if="archivedNotFound" class="text-danger">
          {{ t('examGenerator.saved.archivedNotFound') }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UiButton variant="ghost" size="sm" @click="newExam">
          {{ t('examGenerator.saved.new') }}
        </UiButton>
        <UiButton variant="secondary" size="sm" @click="openLoadDialog">
          {{ t('examGenerator.saved.open') }}
        </UiButton>
        <UiButton
          v-if="currentExamId"
          variant="secondary"
          size="sm"
          :loading="savingExam"
          @click="saveExam(true)"
        >
          {{ t('examGenerator.saved.saveAs') }}
        </UiButton>
        <UiButton variant="primary" size="sm" :loading="savingExam" @click="saveExam(false)">
          {{ t('examGenerator.saved.save') }}
        </UiButton>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <UiCard>
        <template #header>
          <h2 class="font-display text-fg text-lg">{{ t('examGenerator.picker.title') }}</h2>
        </template>
        <p v-if="loading" class="text-muted text-sm">…</p>
        <AdminQuestionPicker
          v-else
          :questions="rows"
          :selected-ids="state.selectedQuestionIds"
          :locale="currentLocale"
          @toggle="toggleSelect"
          @preview="openPreview"
          @edit="openEdit"
        />
      </UiCard>

      <UiCard>
        <template #header>
          <h2 class="font-display text-fg text-lg">
            {{ t('examGenerator.selected.title', { n: state.selectedQuestionIds.length }) }}
          </h2>
        </template>
        <AdminSelectedQuestionsList
          :ids="state.selectedQuestionIds"
          :questions-by-id="questionsById"
          :overridden-ids="overriddenIds"
          :locale="currentLocale"
          :points="state.points"
          @reorder="reorderSelected"
          @remove="removeSelected"
          @set-points="setPoints"
        />
        <ul
          v-if="state.selectedQuestionIds.length && scoring.length"
          class="text-muted mt-3 text-sm"
        >
          <li v-for="s in scoring" :key="s.level">
            {{
              t('examGenerator.scoring.summary', {
                cls: t(`levels.${s.level}`),
                required: s.required,
                max: s.max,
                percent: s.percent,
              })
            }}
          </li>
        </ul>
      </UiCard>
    </div>

    <div class="flex justify-end">
      <UiButton
        variant="primary"
        :loading="generating"
        :disabled="!state.selectedQuestionIds.length"
        @click="onGenerate"
      >
        {{ t('examGenerator.generate') }}
      </UiButton>
    </div>

    <!-- Document settings dialog -->
    <UiConfirmDialog
      :open="settingsOpen"
      :title="t('examGenerator.settings.title')"
      size="lg"
      hide-actions
      @update:open="settingsOpen = $event"
    >
      <div class="flex flex-col gap-4">
        <UiInput v-model="state.examTitle" :label="t('examGenerator.examTitle')" />
        <UiInput v-model="state.dateline" :label="t('examGenerator.dateline')" />

        <label for="eg-candidate-table" class="flex items-center gap-2">
          <input id="eg-candidate-table" v-model="state.showCandidateTable" type="checkbox" >
          <span class="text-fg text-sm">{{ t('examGenerator.showCandidateTable') }}</span>
        </label>
        <UiInput
          v-if="state.showCandidateTable"
          v-model="state.classOptions"
          :label="t('examGenerator.classOptions')"
        />

        <div class="flex flex-wrap items-end gap-4">
          <label for="eg-lang" class="flex flex-col gap-1.5">
            <span class="text-fg text-sm font-medium">{{ t('examGenerator.language') }}</span>
            <select
              id="eg-lang"
              v-model="state.language"
              class="bg-bg text-fg border-border h-9 rounded-md border px-2 text-sm"
            >
              <option value="pl">PL</option>
              <option value="en">EN</option>
            </select>
          </label>

          <label for="eg-answer-key" class="mb-2 flex items-center gap-2">
            <input id="eg-answer-key" v-model="state.includeAnswerKey" type="checkbox" >
            <span class="text-fg text-sm">{{ t('examGenerator.includeAnswerKey') }}</span>
          </label>
        </div>

        <fieldset class="flex flex-col gap-2">
          <legend class="text-fg mb-1 text-sm font-medium">
            {{ t('examGenerator.scoring.title') }}
          </legend>
          <p class="text-muted text-xs">{{ t('examGenerator.scoring.hint') }}</p>
          <div
            v-for="(threshold, i) in state.passThresholds"
            :key="i"
            class="flex flex-wrap items-center gap-2"
          >
            <select
              v-model="threshold.level"
              :aria-label="t('examGenerator.scoring.class')"
              class="bg-bg text-fg border-border h-9 rounded-md border px-2 text-sm"
            >
              <option v-for="l in LEVELS" :key="l" :value="l">{{ t(`levels.${l}`) }}</option>
            </select>
            <input
              v-model.number="threshold.percent"
              type="number"
              min="0"
              max="100"
              :aria-label="t('examGenerator.scoring.percent')"
              class="bg-bg text-fg border-border h-9 w-20 rounded-md border px-2 text-right text-sm"
            >
            <span class="text-muted text-sm">%</span>
            <UiButton variant="ghost" size="sm" @click="removeThreshold(i)">
              {{ t('examGenerator.scoring.remove') }}
            </UiButton>
          </div>
          <div>
            <UiButton variant="secondary" size="sm" @click="addThreshold">
              {{ t('examGenerator.scoring.add') }}
            </UiButton>
          </div>
        </fieldset>

        <div class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('examGenerator.headerText') }}</span>
          <AdminRichTextEditor v-model="state.headerHtml" />
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('examGenerator.footerText') }}</span>
          <AdminRichTextEditor v-model="state.footerHtml" />
        </div>

        <div class="flex justify-end">
          <UiButton variant="ghost" @click="settingsOpen = false">{{ t('actions.back') }}</UiButton>
        </div>
      </div>
    </UiConfirmDialog>

    <!-- Preview dialog -->
    <UiConfirmDialog
      v-if="previewQuestion"
      :open="previewOpen"
      :title="t('examGenerator.picker.preview')"
      size="md"
      hide-actions
      @update:open="previewOpen = $event"
    >
      <QuestionPreview :question="previewQuestion" :locale="currentLocale" />
      <div class="mt-4 flex justify-end">
        <UiButton variant="ghost" @click="previewOpen = false">{{ t('actions.back') }}</UiButton>
      </div>
    </UiConfirmDialog>

    <!-- Quick-edit dialog -->
    <UiConfirmDialog
      v-if="editQuestion && editFormOpen"
      :open="editFormOpen"
      :title="t('questions.actions.edit')"
      size="lg"
      hide-actions
      @update:open="editFormOpen = $event"
    >
      <AdminQuestionForm :initial-value="editQuestion" @save="onEditFormSave" />
    </UiConfirmDialog>

    <!-- Saved exams dialog -->
    <UiConfirmDialog
      :open="loadDialogOpen"
      :title="t('examGenerator.saved.listTitle')"
      size="md"
      hide-actions
      @update:open="loadDialogOpen = $event"
    >
      <p v-if="loadingList" class="text-muted text-sm">…</p>
      <p v-else-if="!savedList.length" class="text-muted text-sm">
        {{ t('examGenerator.saved.empty') }}
      </p>
      <ul v-else class="flex flex-col gap-2">
        <li
          v-for="exam in savedList"
          :key="exam.id"
          class="border-border flex flex-wrap items-center justify-between gap-3 rounded-md border p-3"
        >
          <div class="text-sm">
            <p class="text-fg font-medium">
              {{ exam.examTitle || t('examGenerator.saved.untitled') }}
            </p>
            <p class="text-muted">
              {{ t('examGenerator.saved.questionCount', exam.questionCount) }}
              <span v-if="exam.updatedAt"> &middot; {{ formatDate(exam.updatedAt) }}</span>
            </p>
          </div>
          <div class="flex gap-2">
            <UiButton variant="ghost" size="sm" @click="examToDelete = exam">
              {{ t('examGenerator.saved.delete') }}
            </UiButton>
            <UiButton variant="primary" size="sm" @click="openExam(exam.id)">
              {{ t('examGenerator.saved.load') }}
            </UiButton>
          </div>
        </li>
      </ul>

      <h3 class="font-display text-fg mt-6 mb-1 text-base">
        {{ t('examGenerator.saved.archivedTitle') }}
      </h3>
      <p class="text-muted mb-2 text-xs">{{ t('examGenerator.saved.archivedHint') }}</p>
      <ul class="flex flex-col gap-2">
        <li
          v-for="sheet in archivedSheets"
          :key="sheetKey(sheet)"
          class="border-border flex flex-wrap items-center justify-between gap-3 rounded-md border p-3"
        >
          <div class="text-sm">
            <p class="text-fg font-medium">{{ examSheetHeading(sheet.exam, sheet.year).title }}</p>
            <p class="text-muted">
              <span v-if="examSheetHeading(sheet.exam, sheet.year).dateline">
                {{ examSheetHeading(sheet.exam, sheet.year).dateline }} &middot;
              </span>
              {{ t('examGenerator.saved.questionCount', sheet.entries.length) }}
            </p>
          </div>
          <UiButton variant="secondary" size="sm" @click="openArchivedSheet(sheet)">
            {{ t('examGenerator.saved.load') }}
          </UiButton>
        </li>
      </ul>

      <div class="mt-4 flex justify-end">
        <UiButton variant="ghost" @click="loadDialogOpen = false">{{ t('actions.back') }}</UiButton>
      </div>
    </UiConfirmDialog>

    <UiConfirmDialog
      :open="examToDelete !== null"
      :title="t('examGenerator.saved.deleteTitle')"
      :description="deleteDescription"
      :confirm-text="t('examGenerator.saved.delete')"
      variant="danger"
      :loading="deletingExam"
      @update:open="closeDeleteDialog"
      @confirm="confirmDeleteExam"
    />

    <AdminSaveChoiceDialog
      v-model:open="saveChoiceOpen"
      :loading="savingChoice"
      @persist="persistToDatabase"
      @local="useOnlyInDocument"
    />
  </section>
</template>
