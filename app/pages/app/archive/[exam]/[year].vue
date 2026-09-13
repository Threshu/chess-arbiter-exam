<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { loading, error, load, findSheet } = useExamArchive()

const currentLocale = computed(() => locale.value as 'pl' | 'en')

const examParam = computed(() => String(route.params.exam ?? ''))
const yearParam = computed(() => Number(route.params.year))

const sheet = computed(() => findSheet(examParam.value, yearParam.value))

/**
 * The sheet is reconstructed from whatever questions are readable, so the printed numbers can jump.
 * Showing the original number rather than a running index keeps that visible instead of pretending
 * the sheet is complete.
 */
const hasGaps = computed(() => {
  const entries = sheet.value?.entries ?? []
  return entries.some((entry, index) => entry.no !== index + 1)
})

onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-10">
    <NuxtLink :to="localePath('/app/archive')" class="text-muted mb-4 inline-block text-sm">
      &larr; {{ t('archive.backToList') }}
    </NuxtLink>

    <p v-if="loading" class="text-muted">{{ t('archive.loading') }}</p>

    <UiCard v-else-if="error">
      <p class="text-fg">{{ t('archive.error') }}</p>
      <p class="text-muted mt-1 text-sm">{{ error }}</p>
    </UiCard>

    <UiCard v-else-if="!sheet">
      <p class="text-fg">{{ t('archive.sheetNotFound') }}</p>
      <p class="text-muted mt-1 text-sm">{{ t('archive.emptyHint') }}</p>
    </UiCard>

    <template v-else>
      <h1 class="font-display text-fg mb-2 text-3xl">
        {{ t(`archive.exams.${sheet.exam}`, sheet.exam) }} {{ sheet.year }}
      </h1>
      <p class="text-muted mb-2">{{ t('archive.questionCount', sheet.entries.length) }}</p>
      <p v-if="hasGaps" class="text-muted mb-8 text-sm">{{ t('archive.gapsNote') }}</p>
      <div v-else class="mb-8" />

      <ol class="flex flex-col gap-6">
        <li v-for="entry in sheet.entries" :key="entry.question.id">
          <UiCard>
            <div class="mb-3 flex flex-wrap items-center gap-2">
              <span class="font-display text-fg text-lg">{{ entry.no }}.</span>
              <UiBadge variant="neutral">{{ entry.question.level }}</UiBadge>
              <UiBadge v-if="entry.question.outdatedRules" variant="warning">
                {{ t('archive.outdatedBadge') }}
              </UiBadge>
            </div>

            <p v-if="entry.question.outdatedRules" class="text-muted mb-3 text-sm">
              {{ t('archive.outdatedNote') }}
            </p>

            <QuestionPreview :question="entry.question" :locale="currentLocale" />
          </UiCard>
        </li>
      </ol>
    </template>
  </section>
</template>
