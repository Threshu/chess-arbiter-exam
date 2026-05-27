<script setup lang="ts">
definePageMeta({ middleware: ['admin'], layout: 'admin' })

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="max-w-3xl">
    <h1 class="font-display text-fg mb-2 text-3xl">{{ t('dashboard.title') }}</h1>
    <p class="text-muted mb-8">{{ t('dashboard.subtitle') }}</p>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <NuxtLink :to="localePath('/admin/questions')" class="block">
        <UiCard>
          <h2 class="font-display text-fg mb-1 text-xl">{{ t('dashboard.questionsCta') }}</h2>
          <p class="text-muted text-sm">{{ t('dashboard.questionsDescription') }}</p>
        </UiCard>
      </NuxtLink>
    </div>
  </section>
</template>
