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
    <span v-if="loading" aria-hidden="true" class="inline-block animate-pulse">…</span>
    <slot />
  </button>
</template>
