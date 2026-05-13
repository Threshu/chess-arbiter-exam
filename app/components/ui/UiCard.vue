<script setup lang="ts">
interface Props {
  as?: string
}

withDefaults(defineProps<Props>(), { as: 'section' })

const slots = useSlots()
</script>

<template>
  <component :is="as" class="bg-surface border-border overflow-hidden rounded-lg border">
    <header v-if="slots.header" class="border-border border-b px-6 py-4">
      <slot name="header" />
    </header>
    <div class="px-6 py-5">
      <slot />
    </div>
    <footer v-if="slots.footer" class="border-border bg-bg border-t px-6 py-4">
      <slot name="footer" />
    </footer>
  </component>
</template>
