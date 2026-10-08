<script setup lang="ts">
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
import type { Question } from '~~/shared/types/question'
import type { Locale } from '~~/shared/types/user'
import { questionPoints } from '~/utils/examScoring'

type Row = Question & { id: string }

interface Props {
  ids: string[]
  questionsById: Record<string, Row>
  overriddenIds: string[]
  locale: Locale
  /** Points set for this exam only; a question without an entry is worth its own points. */
  points: Record<string, number>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  reorder: [ids: string[]]
  remove: [id: string]
  /** `null` drops the exam's own setting, so the question's points apply again. */
  setPoints: [id: string, points: number | null]
}>()

const { t } = useI18n()

const draggedId = ref<string | null>(null)
const dragOverId = ref<string | null>(null)

function stemOf(id: string) {
  const q = props.questionsById[id]
  return q ? localized(q.content, props.locale).stem : id
}

function pointsOf(id: string) {
  return questionPoints(id, props.questionsById[id], props.points)
}

function onPointsInput(id: string, event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (!Number.isFinite(value) || value <= 0) return
  // Back at the question's own value, the exam keeps no separate setting.
  const own = props.questionsById[id]?.points ?? 1
  emit('setPoints', id, value === own ? null : value)
}

function isOverridden(id: string) {
  return props.overriddenIds.includes(id)
}

function onDragStart(id: string) {
  draggedId.value = id
}

function onDragOver(id: string) {
  dragOverId.value = id
}

function onDrop(targetId: string) {
  const fromId = draggedId.value
  if (!fromId || fromId === targetId) return
  const next = [...props.ids]
  const fromIndex = next.indexOf(fromId)
  const toIndex = next.indexOf(targetId)
  if (fromIndex === -1 || toIndex === -1) return
  next.splice(fromIndex, 1)
  next.splice(toIndex, 0, fromId)
  emit('reorder', next)
}

function onDragEnd() {
  draggedId.value = null
  dragOverId.value = null
}

function moveBy(id: string, delta: number) {
  const next = [...props.ids]
  const index = next.indexOf(id)
  const target = index + delta
  if (index === -1 || target < 0 || target >= next.length) return
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  emit('reorder', next)
}

function onKeydown(event: KeyboardEvent, id: string) {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveBy(id, -1)
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveBy(id, 1)
  }
}
</script>

<template>
  <ol class="border-border flex flex-col divide-y rounded-md border">
    <li v-if="!ids.length" class="text-muted p-4 text-sm">
      {{ t('examGenerator.selected.empty') }}
    </li>
    <li
      v-for="(id, index) in ids"
      :key="id"
      role="button"
      tabindex="0"
      draggable="true"
      :aria-label="t('examGenerator.selected.reorderHint')"
      :class="[
        'focus-visible:ring-primary flex items-start gap-3 p-3 transition-colors focus-visible:ring-2 focus-visible:outline-none',
        draggedId === id ? 'opacity-40' : '',
        dragOverId === id && draggedId !== id ? 'bg-primary/5' : '',
      ]"
      @dragstart="onDragStart(id)"
      @dragover.prevent="onDragOver(id)"
      @drop="onDrop(id)"
      @dragend="onDragEnd"
      @keydown="onKeydown($event, id)"
    >
      <span aria-hidden="true" class="text-muted mt-0.5 cursor-move select-none">⠿</span>
      <span class="text-muted mt-0.5 text-xs">{{ index + 1 }}.</span>

      <HoverCardRoot :open-delay="200">
        <HoverCardTrigger as-child>
          <div class="min-w-0 flex-1 cursor-default">
            <p class="text-fg line-clamp-2 text-sm">{{ stemOf(id) }}</p>
            <UiBadge v-if="isOverridden(id)" size="sm" variant="warning" class="mt-1">
              {{ t('examGenerator.selected.overridden') }}
            </UiBadge>
          </div>
        </HoverCardTrigger>
        <HoverCardPortal>
          <HoverCardContent
            :side-offset="8"
            side="right"
            class="exam-hover-preview border-border bg-surface z-50 max-h-[85vh] w-[46rem] overflow-y-auto rounded-lg border p-5 shadow-xl"
          >
            <QuestionPreview
              v-if="questionsById[id]"
              :question="questionsById[id]!"
              :locale="locale"
            />
          </HoverCardContent>
        </HoverCardPortal>
      </HoverCardRoot>

      <div class="text-muted flex shrink-0 items-center gap-1 text-xs">
        <input
          type="number"
          min="0.5"
          step="0.5"
          :value="pointsOf(id)"
          :aria-label="t('examGenerator.selected.pointsLabel', { n: index + 1 })"
          class="bg-bg text-fg border-border h-7 w-14 rounded border px-1 text-right text-sm"
          draggable="false"
          @dragstart.prevent.stop
          @keydown.stop
          @change="onPointsInput(id, $event)"
        >
        {{ t('examGenerator.selected.pointsUnit') }}
      </div>

      <button
        type="button"
        :aria-label="t('examGenerator.selected.remove')"
        class="text-muted hover:text-danger shrink-0 text-lg"
        @click="emit('remove', id)"
      >
        ×
      </button>
    </li>
  </ol>
</template>

<style scoped>
.exam-hover-preview[data-state='open'] {
  animation: exam-hover-preview-in 160ms ease-out;
}
.exam-hover-preview[data-state='closed'] {
  animation: exam-hover-preview-out 120ms ease-in;
}
@keyframes exam-hover-preview-in {
  from {
    opacity: 0;
    transform: translateX(-4px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}
@keyframes exam-hover-preview-out {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-4px) scale(0.97);
  }
}
</style>
