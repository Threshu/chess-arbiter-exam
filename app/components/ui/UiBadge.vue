<script setup lang="ts">
type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
type Size = 'sm' | 'md'

interface Props {
  variant?: Variant
  size?: Size
  dot?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'sm',
  dot: false,
})

const variantClasses: Record<Variant, string> = {
  success: 'bg-success/10 text-success ring-success/30',
  warning: 'bg-warning/10 text-warning ring-warning/30',
  danger: 'bg-danger/10 text-danger ring-danger/30',
  info: 'bg-primary/10 text-primary ring-primary/30',
  neutral: 'bg-muted/10 text-muted ring-muted/30',
}

const dotColor: Record<Variant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-primary',
  neutral: 'bg-muted',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1.5',
  md: 'px-2.5 py-1 text-sm gap-2',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full font-medium whitespace-nowrap ring-1 ring-inset',
      sizeClasses[size],
      variantClasses[variant],
    ]"
  >
    <span v-if="dot" :class="['h-1.5 w-1.5 shrink-0 rounded-full', dotColor[variant]]" />
    <slot />
  </span>
</template>
