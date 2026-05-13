<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-20 text-center">
    <h1 class="font-display text-fg mb-6 text-5xl">{{ t('hero.title') }}</h1>
    <p class="text-muted mx-auto mb-10 max-w-prose text-lg">{{ t('hero.subtitle') }}</p>
    <UiButton variant="primary" size="lg" @click="navigateTo(localePath('/auth/login'))">
      {{ t('hero.cta') }}
    </UiButton>
  </section>
</template>
