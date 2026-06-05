<script setup lang="ts">
import type { Question } from '~~/shared/types/question'
import { isClosedQuestion } from '~~/shared/types/question'

interface Props {
  question: Question & { id: string }
  locale: 'pl' | 'en'
}

const props = defineProps<Props>()

const { t } = useI18n()
const open = ref(false)
const { messages, loading, error, ask, reset } = useAssistant()

const questionContext = computed(() => {
  const content = localized(props.question.content, props.locale)

  let correctAnswer: string | undefined
  if (isClosedQuestion(props.question)) {
    const correct = props.question.options.filter((o) => o.isCorrect)
    correctAnswer = correct.map((o) => localized(o.content, props.locale)).join('; ')
  } else if (props.question.type === 'open-ended') {
    correctAnswer = localized(props.question.modelAnswer, props.locale)
  }

  return {
    stem: content.stem,
    explanation: content.explanation,
    correctAnswer,
    type: props.question.type,
  }
})

watch(
  () => props.question.id,
  () => {
    reset()
    open.value = false
  },
)

async function onSend(content: string) {
  await ask(content, { questionContext: questionContext.value, locale: props.locale })
}
</script>

<template>
  <div class="mt-4">
    <button
      type="button"
      class="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium transition-colors"
      @click="open = !open"
    >
      <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
        <path
          d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
        />
      </svg>
      {{ t('assistant.openPanel') }}
      <svg
        :class="['h-4 w-4 shrink-0 transition-transform', open ? 'rotate-180' : '']"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="open" class="border-border bg-bg mt-3 h-80 overflow-hidden rounded-lg border">
        <AssistantChat
          :messages="messages"
          :loading="loading"
          :error="error"
          :placeholder="t('assistant.inputPlaceholder')"
          :empty-text="t('assistant.emptyState')"
          :disclaimer="t('assistant.disclaimer')"
          @send="onSend"
        />
      </div>
    </Transition>
  </div>
</template>
