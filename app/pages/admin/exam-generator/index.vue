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
import { createExamGeneratorState } from '~/types/examGenerator'

definePageMeta({ middleware: ['admin'], layout: 'admin' })

const { t, locale } = useI18n()
const { $firestore } = useNuxtApp()
const firestore = $firestore as Firestore
const { generateExamDocx } = useExamDocx()

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

let unsubscribe: Unsubscribe | null = null

onMounted(() => {
  const q = query(collection(firestore, 'questions'), orderBy('createdAt', 'desc'))
  unsubscribe = onSnapshot(q, (snap) => {
    rows.value = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Question) }))
    loading.value = false
  })
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
          @reorder="reorderSelected"
          @remove="removeSelected"
        />
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

    <AdminSaveChoiceDialog
      v-model:open="saveChoiceOpen"
      :loading="savingChoice"
      @persist="persistToDatabase"
      @local="useOnlyInDocument"
    />
  </section>
</template>
