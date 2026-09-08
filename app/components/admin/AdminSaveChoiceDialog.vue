<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'

interface Props {
  open: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { loading: false })

const emit = defineEmits<{
  'update:open': [value: boolean]
  persist: []
  local: []
}>()

const { t } = useI18n()

function close() {
  if (props.loading) return
  emit('update:open', false)
}

function onOpenChange(value: boolean) {
  if (props.loading && !value) return
  emit('update:open', value)
}
</script>

<template>
  <DialogRoot :open="open" @update:open="onOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent
        class="border-border bg-surface fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-xl focus-visible:outline-none"
      >
        <DialogTitle class="font-display text-fg mb-2 text-xl">
          {{ t('examGenerator.saveChoice.title') }}
        </DialogTitle>
        <DialogDescription class="text-muted mb-6 text-sm">
          {{ t('examGenerator.saveChoice.description') }}
        </DialogDescription>
        <div class="flex flex-col gap-3">
          <UiButton variant="primary" :loading="loading" @click="emit('persist')">
            {{ t('examGenerator.saveChoice.persist') }}
          </UiButton>
          <UiButton variant="secondary" :disabled="loading" @click="emit('local')">
            {{ t('examGenerator.saveChoice.local') }}
          </UiButton>
          <UiButton variant="ghost" :disabled="loading" @click="close">
            {{ t('actions.cancel') }}
          </UiButton>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
