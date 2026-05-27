<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
})

defineEmits<{ click: [event: MouseEvent] }>()

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-primary text-primary-fg border-primary hover:opacity-90',
  secondary: 'bg-surface text-fg border-border hover:bg-bg',
  ghost: 'bg-transparent text-fg border-transparent hover:bg-surface',
  danger: 'bg-danger text-primary-fg border-danger hover:opacity-90',
}

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-5 text-lg gap-2.5',
}

const isInactive = computed(() => props.disabled || props.loading)
</script>

<template>
  <button
    :type="type"
    :disabled="isInactive"
    :aria-busy="loading || undefined"
    :class="[
      'inline-flex items-center justify-center rounded-md border font-sans font-medium transition-opacity',
      'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-60',
      variantClasses[variant],
      sizeClasses[size],
    ]"
    @click="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      aria-hidden="true"
      class="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </button>
</template>
