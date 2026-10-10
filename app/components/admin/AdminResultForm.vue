<script setup lang="ts">
import { levelWithin } from '~~/shared/constants'
import type { CandidateAnswer, CandidateLevel, SessionQuestion } from '~~/shared/schemas/results'
import {
  autoPoints,
  candidateScore,
  markingLevel,
  type CandidateResult,
  type ExamSession,
} from '~/utils/examResults'

interface Props {
  session: ExamSession
  /** The sheet being edited; a new one when null. */
  initial: CandidateResult | null
  saving?: boolean
}

const props = withDefaults(defineProps<Props>(), { saving: false })

const emit = defineEmits<{
  save: [result: Omit<CandidateResult, 'id'>]
  cancel: []
}>()

const { t } = useI18n()

const LETTERS = 'abcdefgh'.split('')
const LEVELS: CandidateLevel[] = ['youth', 'III', 'II']

const candidate = ref(props.initial?.candidate ?? '')
const level = ref<CandidateLevel>(props.initial?.level ?? 'III')
const answers = reactive<Record<string, CandidateAnswer>>(
  Object.fromEntries(
    props.session.questions.map((q) => [
      q.questionId,
      { ...(props.initial?.answers[q.questionId] ?? { points: 0 }) },
    ]),
  ),
)

function letters(q: SessionQuestion) {
  return LETTERS.slice(0, q.optionCount)
}

function applies(q: SessionQuestion) {
  return levelWithin(q.level, markingLevel(level.value))
}

function isChosen(q: SessionQuestion, letter: string) {
  return answers[q.questionId]?.choice?.includes(letter) ?? false
}

/** Toggles a letter and re-scores the question from the letters; points stay editable afterwards. */
function toggleLetter(q: SessionQuestion, letter: string) {
  const answer = answers[q.questionId]!
  const chosen = new Set(answer.choice ?? [])
  if (q.type === 'single-choice') {
    const wasChosen = chosen.has(letter)
    chosen.clear()
    if (!wasChosen) chosen.add(letter)
  } else if (chosen.has(letter)) chosen.delete(letter)
  else chosen.add(letter)
  answer.choice = [...chosen].sort()
  answer.points = autoPoints(q, answer.choice)
}

function pointOptions(q: SessionQuestion) {
  return Array.from({ length: q.points * 2 + 1 }, (_, i) => i / 2)
}

function pointLabel(value: number) {
  return String(value).replace('.5', '½').replace(/^0½$/, '½')
}

function onPoints(q: SessionQuestion, event: Event) {
  answers[q.questionId]!.points = Number((event.target as HTMLSelectElement).value)
}

function onNote(q: SessionQuestion, event: Event) {
  const value = (event.target as HTMLInputElement).value
  answers[q.questionId]!.note = value.trim() ? value : undefined
}

const score = computed(() =>
  candidateScore(props.session, {
    id: '',
    candidate: candidate.value,
    level: level.value,
    answers,
  }),
)

const canSave = computed(() => candidate.value.trim().length > 0)

function submit() {
  if (!canSave.value) return
  // Questions above the candidate's class are not part of their exam, so nothing is stored for them.
  const stored = Object.fromEntries(
    props.session.questions
      .filter(applies)
      .map((q) => [q.questionId, { ...answers[q.questionId]! }]),
  )
  emit('save', { candidate: candidate.value, level: level.value, answers: stored })
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="submit">
    <div class="flex flex-wrap items-end gap-4">
      <UiInput
        v-model="candidate"
        :label="t('results.form.candidate')"
        :hint="t('results.form.candidateHint')"
        required
      />
      <fieldset class="flex flex-col gap-1.5">
        <legend class="text-fg mb-1.5 text-sm font-medium">{{ t('results.form.level') }}</legend>
        <div class="flex gap-1">
          <button
            v-for="l in LEVELS"
            :key="l"
            type="button"
            :aria-pressed="level === l"
            :class="[
              'h-10 min-w-12 rounded-md border px-3 text-sm',
              level === l ? 'bg-primary border-primary text-primary-fg' : 'border-border text-fg',
            ]"
            @click="level = l"
          >
            {{ t(`results.levelShort.${l}`) }}
          </button>
        </div>
      </fieldset>
      <p class="text-fg ml-auto text-sm">
        {{ t('results.form.total', { total: score.total, max: score.max }) }}
        <UiBadge
          v-if="score.passed !== null"
          :variant="score.passed ? 'success' : 'danger'"
          class="ml-2"
        >
          {{ score.passed ? t('results.passed') : t('results.failed') }}
        </UiBadge>
      </p>
    </div>

    <ol class="border-border divide-border max-h-[60vh] divide-y overflow-y-auto rounded-md border">
      <li
        v-for="q in session.questions"
        :key="q.questionId"
        :class="['flex flex-wrap items-center gap-3 px-3 py-2', applies(q) ? '' : 'opacity-40']"
      >
        <span class="text-fg w-8 shrink-0 text-sm font-medium">{{ q.no }}.</span>
        <span class="text-muted min-w-0 flex-1 truncate text-xs" :title="q.stem">{{ q.stem }}</span>

        <template v-if="!applies(q)">
          <span class="text-muted text-xs">{{ t('results.form.notApplicable') }}</span>
        </template>

        <template v-else-if="q.type !== 'open-ended'">
          <div class="flex gap-1">
            <button
              v-for="letter in letters(q)"
              :key="letter"
              type="button"
              :aria-pressed="isChosen(q, letter)"
              :class="[
                'h-8 w-8 rounded border text-sm',
                isChosen(q, letter)
                  ? 'bg-primary border-primary text-primary-fg'
                  : 'border-border text-fg',
              ]"
              @click="toggleLetter(q, letter)"
            >
              {{ letter }}
            </button>
          </div>
          <select
            :value="answers[q.questionId]!.points"
            :aria-label="t('results.form.points', { no: q.no })"
            class="bg-bg text-fg border-border h-8 rounded border px-1 text-sm"
            @change="onPoints(q, $event)"
          >
            <option v-for="p in pointOptions(q)" :key="p" :value="p">{{ pointLabel(p) }}</option>
          </select>
        </template>

        <template v-else>
          <input
            :value="answers[q.questionId]!.note ?? ''"
            :placeholder="t('results.form.notePlaceholder')"
            :aria-label="t('results.form.note', { no: q.no })"
            class="bg-bg text-fg border-border h-8 w-56 rounded border px-2 text-sm"
            @input="onNote(q, $event)"
          >
          <select
            :value="answers[q.questionId]!.points"
            :aria-label="t('results.form.points', { no: q.no })"
            class="bg-bg text-fg border-border h-8 rounded border px-1 text-sm"
            @change="onPoints(q, $event)"
          >
            <option v-for="p in pointOptions(q)" :key="p" :value="p">{{ pointLabel(p) }}</option>
          </select>
        </template>
      </li>
    </ol>

    <div class="flex justify-end gap-2">
      <UiButton variant="ghost" @click="emit('cancel')">{{ t('actions.cancel') }}</UiButton>
      <UiButton type="submit" :loading="saving" :disabled="!canSave">
        {{ t('actions.save') }}
      </UiButton>
    </div>
  </form>
</template>
