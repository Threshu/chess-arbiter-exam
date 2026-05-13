<script setup lang="ts">
definePageMeta({ layout: 'default' })

const inputValue = ref('')
const errorValue = ref('not an email')
</script>

<template>
  <section class="mx-auto max-w-4xl space-y-12 px-6 py-12">
    <header>
      <h1 class="font-display text-fg mb-2 text-3xl">UI primitives</h1>
      <p class="text-muted">Visual reference for the design-system components.</p>
    </header>

    <section class="space-y-4">
      <h2 class="font-display text-fg text-xl">UiButton</h2>
      <div class="flex flex-wrap gap-3">
        <UiButton variant="primary">Primary</UiButton>
        <UiButton variant="secondary">Secondary</UiButton>
        <UiButton variant="ghost">Ghost</UiButton>
        <UiButton variant="danger">Danger</UiButton>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <UiButton size="sm">Small</UiButton>
        <UiButton size="md">Medium</UiButton>
        <UiButton size="lg">Large</UiButton>
      </div>
      <div class="flex flex-wrap gap-3">
        <UiButton loading>Loading</UiButton>
        <UiButton disabled>Disabled</UiButton>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="font-display text-fg text-xl">UiInput</h2>
      <div class="max-w-sm space-y-4">
        <UiInput
          v-model="inputValue"
          label="Email"
          placeholder="you@example.com"
          hint="We only use this for sign-in."
        />
        <UiInput v-model="errorValue" label="Email" error="Enter a valid email address." />
        <UiInput v-model="inputValue" label="Disabled" disabled />
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="font-display text-fg text-xl">UiCard</h2>
      <UiCard>
        <template #header><h3 class="font-display text-lg">Card title</h3></template>
        <p class="text-muted">Body content sits inside the default slot.</p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UiButton variant="ghost" size="sm">Cancel</UiButton>
            <UiButton variant="primary" size="sm">Save</UiButton>
          </div>
        </template>
      </UiCard>
    </section>
  </section>
</template>
