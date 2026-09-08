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
  /** Hides the confirm/cancel footer — for hosting content with its own actions (e.g. a form). */
  hideActions?: boolean
  /** Controls the dialog's max width — `lg` for content-heavy panels (forms, settings). */
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  confirmText: undefined,
  cancelText: undefined,
  variant: 'primary',
  loading: false,
  hideActions: false,
  size: 'sm',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

const { t } = useI18n()

const confirmLabel = computed(() => props.confirmText ?? t('actions.confirm'))
const cancelLabel = computed(() => props.cancelText ?? t('actions.cancel'))

const sizeClass = computed(
  () =>
    ({
      sm: 'w-[min(28rem,calc(100vw-2rem))]',
      md: 'w-[min(36rem,calc(100vw-2rem))]',
      lg: 'w-[min(52rem,calc(100vw-3rem))]',
    })[props.size],
)

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
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogContent
          :class="[
            'ui-dialog-content',
            sizeClass,
            'border-border bg-surface pointer-events-auto flex max-h-[85vh] flex-col rounded-lg border shadow-xl',
            'focus-visible:outline-none',
          ]"
        >
          <div class="flex-1 overflow-y-auto p-6">
            <DialogTitle class="font-display text-fg mb-2 text-xl">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="text-muted mb-6 text-sm">
              {{ description }}
            </DialogDescription>
            <div v-else class="mb-6">
              <slot />
            </div>
          </div>
          <div v-if="!hideActions" class="border-border flex justify-end gap-3 border-t p-6 pt-4">
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
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
