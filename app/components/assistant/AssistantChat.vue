<script setup lang="ts">
import type { ChatMessage } from '~~/shared/types/assistant'

interface Props {
  messages: readonly ChatMessage[]
  loading: boolean
  error: string | null
  placeholder?: string
  emptyText?: string
  disclaimer?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Zadaj pytanie…',
  emptyText: '',
  disclaimer: '',
})

const emit = defineEmits<{ send: [content: string] }>()

const input = ref('')
const listRef = ref<HTMLElement | null>(null)

function submit() {
  const trimmed = input.value.trim()
  if (!trimmed || props.loading) return
  emit('send', trimmed)
  input.value = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}

watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight
  },
)
</script>

<template>
  <div class="flex h-full flex-col">
    <div ref="listRef" class="flex-1 overflow-y-auto">
      <div v-if="messages.length === 0 && emptyText" class="px-4 py-6">
        <p class="text-muted text-sm">{{ emptyText }}</p>
      </div>
      <div v-else class="flex flex-col gap-3 px-4 py-4">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="[
            'max-w-[85%] rounded-lg px-3 py-2 text-sm',
            msg.role === 'user'
              ? 'bg-primary/10 text-fg self-end'
              : 'bg-surface text-fg self-start',
          ]"
        >
          <p class="whitespace-pre-wrap">{{ msg.content }}</p>
        </div>

        <div v-if="loading" class="self-start">
          <div class="bg-surface rounded-lg px-3 py-3">
            <div class="flex gap-1">
              <span class="bg-muted h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
              <span class="bg-muted h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
              <span class="bg-muted h-2 w-2 animate-bounce rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="border-danger/30 bg-danger/5 border-t px-4 py-2">
      <p class="text-danger text-xs">{{ error }}</p>
    </div>

    <div class="border-border border-t px-4 py-3">
      <div class="flex gap-2">
        <textarea
          v-model="input"
          :placeholder="placeholder"
          :aria-label="placeholder"
          :disabled="loading"
          rows="2"
          class="bg-bg text-fg border-border focus-visible:ring-primary flex-1 resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
          @keydown="onKeydown"
        />
        <UiButton
          variant="primary"
          size="sm"
          :loading="loading"
          :disabled="!input.trim()"
          class="self-end"
          @click="submit"
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </UiButton>
      </div>
      <p v-if="disclaimer" class="text-muted mt-2 text-xs">{{ disclaimer }}</p>
    </div>
  </div>
</template>
