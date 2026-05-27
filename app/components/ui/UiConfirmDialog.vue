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
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  confirmText: undefined,
  cancelText: undefined,
  variant: 'primary',
  loading: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

const { t } = useI18n()

const confirmLabel = computed(() => props.confirmText ?? t('actions.confirm'))
const cancelLabel = computed(() => props.cancelText ?? t('actions.cancel'))

function onCancel() {
  if (props.loading) return
  emit('update:open', false)
}

function onConfirm() {
  if (props.loading) return
  emit('confirm')
}

function onOpenChange(value: boolean) {
  if (props.loading && !value) return
  emit('update:open', value)
}
</script>

<template>
  <DialogRoot :open="open" @update:open="onOpenChange">
    <DialogPortal>
      <DialogOverlay class="ui-dialog-overlay fixed inset-0 z-50 bg-black/50" />
      <DialogContent
        :class="[
          'ui-dialog-content',
          'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'w-[min(28rem,calc(100vw-2rem))]',
          'border-border bg-surface rounded-lg border p-6 shadow-xl',
          'focus-visible:outline-none',
        ]"
      >
        <DialogTitle class="font-display text-fg mb-2 text-xl">{{ title }}</DialogTitle>
        <DialogDescription v-if="description" class="text-muted mb-6 text-sm">
          {{ description }}
        </DialogDescription>
        <div v-else class="mb-6">
          <slot />
        </div>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" :disabled="loading" @click="onCancel">
            {{ cancelLabel }}
          </UiButton>
          <UiButton
            :variant="variant === 'danger' ? 'danger' : 'primary'"
            :loading="loading"
            @click="onConfirm"
          >
            {{ confirmLabel }}
          </UiButton>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
