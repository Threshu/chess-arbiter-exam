<script setup lang="ts">
import type { Diagram, Level, Question, QuestionTypeId } from '~~/shared/types/question'

interface Props {
  initialValue?: Question
  saving?: boolean
}

const props = withDefaults(defineProps<Props>(), { initialValue: undefined, saving: false })

const emit = defineEmits<{ save: [payload: Record<string, unknown>, publish: boolean] }>()

const { t } = useI18n()

const type = ref<QuestionTypeId>(props.initialValue?.type ?? 'single-choice')
const stemPl = ref(props.initialValue?.content.pl.stem ?? '')
const stemEn = ref(props.initialValue?.content.en.stem ?? '')
const explanationPl = ref(props.initialValue?.content.pl.explanation ?? '')
const explanationEn = ref(props.initialValue?.content.en.explanation ?? '')
const level = ref<Level>(props.initialValue?.level ?? 'NA')

const diagramKind = ref<'none' | 'fen' | 'pgn'>(props.initialValue?.diagram?.kind ?? 'none')
const fen = ref(props.initialValue?.diagram?.kind === 'fen' ? props.initialValue.diagram.fen : '')
const pgn = ref(props.initialValue?.diagram?.kind === 'pgn' ? props.initialValue.diagram.pgn : '')

type DraftOption = { id: string; pl: string; en: string; isCorrect: boolean }
const ALL_OPTION_IDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const MIN_OPTIONS = 2
const MAX_OPTIONS = 8

function makeInitialOptions(): DraftOption[] {
  if (props.initialValue && 'options' in props.initialValue && props.initialValue.options) {
    return props.initialValue.options.map((o) => ({
      id: o.id,
      pl: o.content.pl,
      en: o.content.en,
      isCorrect: o.isCorrect,
    }))
  }
  return ALL_OPTION_IDS.slice(0, 4).map((id, i) => ({
    id,
    pl: '',
    en: '',
    isCorrect: i === 0,
  }))
}

const options = ref<DraftOption[]>(makeInitialOptions())

const singleCorrectId = ref<string>(
  options.value.find((o) => o.isCorrect)?.id ?? options.value[0]?.id ?? 'a',
)

function addOption() {
  if (options.value.length >= MAX_OPTIONS) return
  const used = new Set(options.value.map((o) => o.id))
  const nextId = ALL_OPTION_IDS.find((id) => !used.has(id))
  if (!nextId) return
  options.value.push({ id: nextId, pl: '', en: '', isCorrect: false })
}

function removeOption(id: string) {
  if (options.value.length <= MIN_OPTIONS) return
  options.value = options.value.filter((o) => o.id !== id)
  if (singleCorrectId.value === id) {
    singleCorrectId.value = options.value[0]?.id ?? 'a'
  }
}

const modelAnswerPl = ref(
  props.initialValue?.type === 'open-ended' ? props.initialValue.modelAnswer.pl : '',
)
const modelAnswerEn = ref(
  props.initialValue?.type === 'open-ended' ? props.initialValue.modelAnswer.en : '',
)

const errors = ref<string[]>([])

function buildDiagram(): Diagram | undefined {
  if (diagramKind.value === 'fen' && fen.value.trim()) {
    return { kind: 'fen', fen: fen.value.trim() }
  }
  if (diagramKind.value === 'pgn' && pgn.value.trim()) {
    return { kind: 'pgn', pgn: pgn.value.trim() }
  }
  return undefined
}

function validate(): boolean {
  errors.value = []
  if (!stemPl.value.trim()) errors.value.push(t('questions.form.errors.missingStemPl'))
  if (!stemEn.value.trim()) errors.value.push(t('questions.form.errors.missingStemEn'))

  if (diagramKind.value === 'fen' && !fen.value.trim()) {
    errors.value.push(t('questions.form.errors.missingFen'))
  }
  if (diagramKind.value === 'pgn' && !pgn.value.trim()) {
    errors.value.push(t('questions.form.errors.missingPgn'))
  }

  if (type.value === 'open-ended') {
    if (!modelAnswerPl.value.trim()) {
      errors.value.push(t('questions.form.errors.missingModelAnswerPl'))
    }
    if (!modelAnswerEn.value.trim()) {
      errors.value.push(t('questions.form.errors.missingModelAnswerEn'))
    }
    return errors.value.length === 0
  }

  const filled = options.value.filter((o) => o.pl.trim() || o.en.trim())
  for (const o of filled) {
    if (!o.pl.trim() || !o.en.trim()) {
      errors.value.push(t('questions.form.errors.incompleteOption'))
      break
    }
  }
  if (filled.length < 2) errors.value.push(t('questions.form.errors.incompleteOption'))

  if (type.value === 'single-choice') {
    if (!filled.some((o) => o.id === singleCorrectId.value)) {
      errors.value.push(t('questions.form.errors.noCorrectSingle'))
    }
  } else if (type.value === 'multi-choice') {
    if (!filled.some((o) => o.isCorrect)) {
      errors.value.push(t('questions.form.errors.noCorrectMulti'))
    }
  }

  return errors.value.length === 0
}

function submit(publish: boolean) {
  if (!validate()) return

  const base: Record<string, unknown> = {
    content: {
      pl: {
        stem: stemPl.value.trim(),
        ...(explanationPl.value.trim() ? { explanation: explanationPl.value.trim() } : {}),
      },
      en: {
        stem: stemEn.value.trim(),
        ...(explanationEn.value.trim() ? { explanation: explanationEn.value.trim() } : {}),
      },
    },
    level: level.value,
    status: publish ? 'published' : 'draft',
    version: (props.initialValue?.version ?? 0) + 1,
  }

  const diagram = buildDiagram()
  if (diagram) base.diagram = diagram

  let payload: Record<string, unknown>

  if (type.value === 'open-ended') {
    payload = {
      ...base,
      type: 'open-ended',
      modelAnswer: {
        pl: modelAnswerPl.value.trim(),
        en: modelAnswerEn.value.trim(),
      },
    }
  } else {
    const filled = options.value.filter((o) => o.pl.trim() && o.en.trim())
    const opts = filled.map((o) => ({
      id: o.id,
      content: { pl: o.pl.trim(), en: o.en.trim() },
      isCorrect: type.value === 'single-choice' ? o.id === singleCorrectId.value : o.isCorrect,
    }))
    payload = { ...base, type: type.value, options: opts }
  }

  emit('save', payload, publish)
}
</script>

<template>
  <UiCard>
    <form class="flex flex-col gap-6" @submit.prevent>
      <label for="qf-type" class="flex flex-col gap-1.5">
        <span class="text-fg text-sm font-medium">{{ t('questions.form.typeSelect') }}</span>
        <select
          id="qf-type"
          v-model="type"
          class="bg-bg text-fg border-border focus-visible:ring-primary h-10 rounded-md border px-3 font-sans text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <option value="single-choice">{{ t('questions.types.single-choice') }}</option>
          <option value="multi-choice">{{ t('questions.types.multi-choice') }}</option>
          <option value="open-ended">{{ t('questions.types.open-ended') }}</option>
        </select>
      </label>

      <UiInput v-model="stemPl" :label="t('questions.form.stemPl')" required />
      <UiInput v-model="stemEn" :label="t('questions.form.stemEn')" required />

      <label for="qf-expl-pl" class="flex flex-col gap-1.5">
        <span class="text-fg text-sm font-medium">{{ t('questions.form.explanationPl') }}</span>
        <textarea
          id="qf-expl-pl"
          v-model="explanationPl"
          rows="2"
          class="bg-bg text-fg border-border focus-visible:ring-primary rounded-md border px-3 py-2 font-sans text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        />
      </label>

      <label for="qf-expl-en" class="flex flex-col gap-1.5">
        <span class="text-fg text-sm font-medium">{{ t('questions.form.explanationEn') }}</span>
        <textarea
          id="qf-expl-en"
          v-model="explanationEn"
          rows="2"
          class="bg-bg text-fg border-border focus-visible:ring-primary rounded-md border px-3 py-2 font-sans text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        />
      </label>

      <fieldset class="border-border flex flex-col gap-3 rounded-md border p-3">
        <legend class="text-fg px-1 text-sm font-medium">{{ t('questions.form.diagram') }}</legend>
        <div class="flex gap-4">
          <label
            v-for="kind in ['none', 'fen', 'pgn'] as const"
            :key="kind"
            :for="`qf-diagram-${kind}`"
            class="flex items-center gap-2"
          >
            <input :id="`qf-diagram-${kind}`" v-model="diagramKind" type="radio" :value="kind" >
            <span class="text-sm">{{ t(`questions.form.diagramKind.${kind}`) }}</span>
          </label>
        </div>
        <template v-if="diagramKind === 'fen'">
          <UiInput
            v-model="fen"
            :label="t('questions.form.fen')"
            :hint="t('questions.form.fenHint')"
          />
          <div v-if="fen.trim()" class="mt-2 flex justify-center">
            <ChessBoard :fen="fen.trim()" />
          </div>
        </template>
        <template v-if="diagramKind === 'pgn'">
          <label for="qf-pgn" class="flex flex-col gap-1.5">
            <span class="text-fg text-sm font-medium">{{ t('questions.form.pgn') }}</span>
            <textarea
              id="qf-pgn"
              v-model="pgn"
              rows="4"
              :placeholder="t('questions.form.pgnHint')"
              class="bg-bg text-fg border-border focus-visible:ring-primary rounded-md border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            />
          </label>
          <div v-if="pgn.trim()" class="mt-2 flex justify-center">
            <ChessReplay :pgn="pgn.trim()" />
          </div>
        </template>
      </fieldset>

      <fieldset v-if="type !== 'open-ended'" class="flex flex-col gap-3">
        <legend class="text-fg text-sm font-medium">{{ t('questions.form.options') }}</legend>
        <div
          v-for="opt in options"
          :key="opt.id"
          class="border-border bg-bg flex items-start gap-3 rounded-md border p-3"
        >
          <label :for="`qf-opt-${opt.id}`" class="mt-2 flex items-center gap-2">
            <input
              v-if="type === 'single-choice'"
              :id="`qf-opt-${opt.id}`"
              v-model="singleCorrectId"
              type="radio"
              :value="opt.id"
              :aria-label="t('questions.form.correctSingle')"
            >
            <input
              v-else
              :id="`qf-opt-${opt.id}`"
              v-model="opt.isCorrect"
              type="checkbox"
              :aria-label="t('questions.form.correctMulti')"
            >
            <span class="text-muted text-xs uppercase">{{ opt.id }}</span>
          </label>
          <div class="flex flex-1 flex-col gap-2">
            <UiInput v-model="opt.pl" :placeholder="t('questions.form.optionPl')" />
            <UiInput v-model="opt.en" :placeholder="t('questions.form.optionEn')" />
          </div>
          <button
            type="button"
            :disabled="options.length <= 2"
            :aria-label="t('questions.form.removeOption')"
            :title="t('questions.form.removeOption')"
            class="text-muted hover:text-danger mt-2 text-lg disabled:cursor-not-allowed disabled:opacity-30"
            @click="removeOption(opt.id)"
          >
            ×
          </button>
        </div>
        <div class="flex items-center justify-between">
          <UiButton
            type="button"
            size="sm"
            variant="ghost"
            :disabled="options.length >= 8"
            @click="addOption"
          >
            + {{ t('questions.form.addOption') }}
          </UiButton>
          <span class="text-muted text-xs">{{ t('questions.form.optionsLimit') }}</span>
        </div>
      </fieldset>

      <template v-if="type === 'open-ended'">
        <label for="qf-model-pl" class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('questions.form.modelAnswerPl') }}</span>
          <textarea
            id="qf-model-pl"
            v-model="modelAnswerPl"
            rows="3"
            required
            class="bg-bg text-fg border-border focus-visible:ring-primary rounded-md border px-3 py-2 font-sans text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
        </label>
        <label for="qf-model-en" class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('questions.form.modelAnswerEn') }}</span>
          <textarea
            id="qf-model-en"
            v-model="modelAnswerEn"
            rows="3"
            required
            class="bg-bg text-fg border-border focus-visible:ring-primary rounded-md border px-3 py-2 font-sans text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
        </label>
      </template>

      <label for="qf-level" class="flex flex-col gap-1.5">
        <span class="text-fg text-sm font-medium">{{ t('questions.form.level') }}</span>
        <select
          id="qf-level"
          v-model="level"
          class="bg-bg text-fg border-border focus-visible:ring-primary h-10 rounded-md border px-3 font-sans text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <option value="NA">NA</option>
          <option value="FA">FA</option>
          <option value="IA">IA</option>
        </select>
      </label>

      <ul v-if="errors.length" class="border-danger bg-danger/10 rounded-md border p-3">
        <li v-for="e in errors" :key="e" class="text-danger text-sm">{{ e }}</li>
      </ul>

      <div class="flex gap-3">
        <UiButton variant="secondary" :loading="saving" @click="submit(false)">
          {{ t('questions.form.saveDraft') }}
        </UiButton>
        <UiButton variant="primary" :loading="saving" @click="submit(true)">
          {{ t('questions.form.publish') }}
        </UiButton>
      </div>
    </form>
  </UiCard>
</template>
