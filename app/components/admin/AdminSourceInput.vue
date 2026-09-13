<script setup lang="ts">
import type { QuestionSource } from '~~/shared/types/question'

interface Props {
  modelValue: QuestionSource[]
  /** Exam codes already used in the bank, offered so the same question sheet keeps one spelling. */
  examSuggestions?: string[]
}

const props = withDefaults(defineProps<Props>(), { examSuggestions: () => [] })

const emit = defineEmits<{ 'update:modelValue': [value: QuestionSource[]] }>()

const { t } = useI18n()

const exam = ref('')
const year = ref<number | null>(null)
const no = ref<number | null>(null)

const canAdd = computed(
  () =>
    exam.value.trim().length > 0 &&
    year.value !== null &&
    year.value >= 1900 &&
    year.value <= 2100 &&
    no.value !== null &&
    no.value > 0,
)

function add() {
  if (!canAdd.value) return
  const candidate: QuestionSource = {
    exam: exam.value.trim(),
    year: year.value!,
    no: no.value!,
  }
  // The same question genuinely reappears across years, but never twice on one sheet.
  const duplicate = props.modelValue.some(
    (s) => s.exam === candidate.exam && s.year === candidate.year && s.no === candidate.no,
  )
  if (!duplicate) emit('update:modelValue', [...props.modelValue, candidate])
  no.value = null
}

function remove(index: number) {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, i) => i !== index),
  )
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <ul v-if="modelValue.length" class="flex flex-wrap gap-1.5">
      <li
        v-for="(source, index) in modelValue"
        :key="`${source.exam}-${source.year}-${source.no}`"
        class="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      >
        {{ source.exam }} {{ source.year }} &middot; {{ t('questions.form.sourceNo') }}
        {{ source.no }}
        <button
          type="button"
          :aria-label="t('questions.form.removeSource')"
          class="hover:text-danger"
          @click="remove(index)"
        >
          &times;
        </button>
      </li>
    </ul>

    <div class="flex flex-wrap items-end gap-2">
      <label for="admin-source-exam" class="flex flex-col gap-1">
        <span class="text-muted text-xs">{{ t('questions.form.sourceExam') }}</span>
        <input
          id="admin-source-exam"
          v-model="exam"
          type="text"
          list="admin-source-exams"
          class="bg-bg text-fg border-border h-9 w-40 rounded-md border px-2 text-sm"
        />
        <datalist id="admin-source-exams">
          <option v-for="name in examSuggestions" :key="name" :value="name" />
        </datalist>
      </label>

      <label for="admin-source-year" class="flex flex-col gap-1">
        <span class="text-muted text-xs">{{ t('questions.form.sourceYear') }}</span>
        <input
          id="admin-source-year"
          v-model.number="year"
          type="number"
          min="1900"
          max="2100"
          class="bg-bg text-fg border-border h-9 w-24 rounded-md border px-2 text-sm"
        />
      </label>

      <label for="admin-source-no" class="flex flex-col gap-1">
        <span class="text-muted text-xs">{{ t('questions.form.sourceNo') }}</span>
        <input
          id="admin-source-no"
          v-model.number="no"
          type="number"
          min="1"
          class="bg-bg text-fg border-border h-9 w-20 rounded-md border px-2 text-sm"
        />
      </label>

      <UiButton variant="secondary" size="sm" type="button" :disabled="!canAdd" @click="add">
        {{ t('questions.form.addSource') }}
      </UiButton>
    </div>
  </div>
</template>
