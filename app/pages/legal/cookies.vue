<script setup lang="ts">
const lastUpdated = '2026-05-24'

const sectionKeys = ['intro', 'essential', 'analytics', 'manage'] as const
</script>

<template>
  <article class="mx-auto max-w-3xl px-6 py-12">
    <h1 class="font-display text-fg mb-2 text-4xl">{{ $t('cookies.title') }}</h1>
    <p class="text-muted mb-2 text-sm">{{ $t('lastUpdated', { date: lastUpdated }) }}</p>
    <p
      class="text-muted border-warning bg-warning/10 mb-10 rounded-md border-l-4 px-4 py-2 text-sm"
    >
      {{ $t('placeholder') }}
    </p>

    <section v-for="key in sectionKeys" :key="key" class="mb-8">
      <h2 class="font-display text-fg mb-2 text-xl">{{ $t(`cookies.sections.${key}.title`) }}</h2>
      <p class="text-fg whitespace-pre-line">{{ $t(`cookies.sections.${key}.body`) }}</p>
    </section>
  </article>
</template>
