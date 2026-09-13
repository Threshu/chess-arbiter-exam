<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const localePath = useLocalePath()
const { sheets, loading, error, load } = useExamArchive()

onMounted(load)

const totalQuestions = computed(() =>
  sheets.value.reduce((sum, sheet) => sum + sheet.entries.length, 0),
)
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-10">
    <h1 class="font-display text-fg mb-2 text-3xl">{{ t('archive.title') }}</h1>
    <p class="text-muted mb-8">{{ t('archive.subtitle') }}</p>

    <p v-if="loading" class="text-muted">{{ t('archive.loading') }}</p>

    <UiCard v-else-if="error">
      <p class="text-fg">{{ t('archive.error') }}</p>
      <p class="text-muted mt-1 text-sm">{{ error }}</p>
    </UiCard>

    <UiCard v-else-if="!sheets.length">
      <p class="text-fg">{{ t('archive.empty') }}</p>
      <p class="text-muted mt-1 text-sm">{{ t('archive.emptyHint') }}</p>
    </UiCard>

    <template v-else>
      <p class="text-muted mb-4 text-sm">
        {{ t('archive.summary', { exams: sheets.length, questions: totalQuestions }) }}
      </p>

      <ul class="flex flex-col gap-3">
        <li v-for="sheet in sheets" :key="`${sheet.exam}-${sheet.year}`">
          <NuxtLink
            :to="localePath(`/app/archive/${encodeURIComponent(sheet.exam)}/${sheet.year}`)"
            class="block"
          >
            <UiCard class="hover:border-accent transition-colors">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p class="font-display text-fg text-xl">
                    {{ t(`archive.exams.${sheet.exam}`, sheet.exam) }} {{ sheet.year }}
                  </p>
                  <p class="text-muted mt-1 text-sm">
                    {{ t('archive.questionCount', sheet.entries.length) }}
                  </p>
                </div>
                <UiBadge v-if="sheet.outdatedCount" variant="warning">
                  {{ t('archive.outdatedCount', sheet.outdatedCount) }}
                </UiBadge>
              </div>
            </UiCard>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </section>
</template>
