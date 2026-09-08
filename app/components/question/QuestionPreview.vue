<script setup lang="ts">
import { isClosedQuestion, type Question } from '~~/shared/types/question'
import type { Locale } from '~~/shared/types/user'

interface Props {
  question: Question
  locale: Locale
}

const props = defineProps<Props>()

const content = computed(() => localized(props.question.content, props.locale))
const closed = computed(() => (isClosedQuestion(props.question) ? props.question : null))
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-fg text-lg">{{ content.stem }}</p>

    <div v-if="question.diagram" class="flex justify-center">
      <ChessBoard v-if="question.diagram.kind === 'fen'" :fen="question.diagram.fen" />
      <ChessReplay v-else-if="question.diagram.kind === 'pgn'" :pgn="question.diagram.pgn" />
    </div>

    <ul v-if="closed" class="flex flex-col gap-2">
      <li
        v-for="opt in closed.options"
        :key="opt.id"
        :class="[
          'border-border flex items-start gap-2 rounded-md border p-2 text-sm',
          opt.isCorrect ? 'border-success bg-success/10' : '',
        ]"
      >
        <span class="text-muted uppercase">{{ opt.id }})</span>
        <span class="text-fg flex-1">{{ localized(opt.content, locale) }}</span>
      </li>
    </ul>

    <div v-else-if="question.type === 'open-ended'" class="border-border rounded-md border p-3">
      <p class="text-fg mb-1 text-sm font-medium">{{ $t('examGenerator.preview.modelAnswer') }}</p>
      <p class="text-muted text-sm">{{ localized(question.modelAnswer, locale) }}</p>
    </div>

    <p v-if="content.explanation" class="text-muted text-sm">
      <strong class="text-fg">{{ $t('practice.explanation') }}:</strong> {{ content.explanation }}
    </p>
  </div>
</template>
