<script setup lang="ts">
import type { Level, QuestionTypeId } from '~~/shared/types/question'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const localePath = useLocalePath()

const level = ref<Level | 'all'>('all')
const type = ref<QuestionTypeId | 'all'>('all')
const limit = ref<number | 'all'>('all')

function start() {
  const query: Record<string, string> = {}
  if (level.value !== 'all') query.level = level.value
  if (type.value !== 'all') query.type = type.value
  if (limit.value !== 'all') query.limit = String(limit.value)
  navigateTo({ path: localePath('/app/practice/session'), query })
}
</script>

<template>
  <section class="mx-auto max-w-2xl px-6 py-10">
    <h1 class="font-display text-fg mb-6 text-3xl">{{ t('practice.setupTitle') }}</h1>

    <UiCard>
      <form class="flex flex-col gap-5" @submit.prevent="start">
        <label for="practice-level" class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('practice.filterLevel') }}</span>
          <select
            id="practice-level"
            v-model="level"
            class="bg-bg text-fg border-border h-10 rounded-md border px-3 text-base"
          >
            <option value="all">{{ t('practice.filterAll') }}</option>
            <option value="NA">NA</option>
            <option value="FA">FA</option>
            <option value="IA">IA</option>
          </select>
        </label>

        <label for="practice-type" class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('practice.filterType') }}</span>
          <select
            id="practice-type"
            v-model="type"
            class="bg-bg text-fg border-border h-10 rounded-md border px-3 text-base"
          >
            <option value="all">{{ t('practice.filterAll') }}</option>
            <option value="single-choice">{{ $t('admin.questions.types.single-choice') }}</option>
            <option value="multi-choice">{{ $t('admin.questions.types.multi-choice') }}</option>
            <option value="open-ended">{{ $t('admin.questions.types.open-ended') }}</option>
          </select>
        </label>

        <label for="practice-limit" class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('practice.filterLimit') }}</span>
          <select
            id="practice-limit"
            v-model="limit"
            class="bg-bg text-fg border-border h-10 rounded-md border px-3 text-base"
          >
            <option value="all">{{ t('practice.filterLimitAll') }}</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </label>

        <UiButton variant="primary" size="lg" type="submit" @click="start">
          {{ t('practice.start') }}
        </UiButton>
      </form>
    </UiCard>
  </section>
</template>
