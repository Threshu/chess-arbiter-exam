<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="font-display text-fg mb-6 text-4xl">{{ t('nav.about') }}</h1>
    <p class="text-muted">{{ t('hero.subtitle') }}</p>
  </section>
</template>
