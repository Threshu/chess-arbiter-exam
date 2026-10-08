<script setup lang="ts">
import type { Level, Question, QuestionStatus, QuestionTypeId } from '~~/shared/types/question'
import type { Locale } from '~~/shared/types/user'
import { LEVELS, levelWithin } from '~~/shared/constants'

type Row = Question & { id: string }

interface Props {
  questions: Row[]
  selectedIds: string[]
  locale: Locale
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [id: string]
  preview: [question: Row]
  edit: [question: Row]
}>()

const { t } = useI18n()

const typeFilter = ref<QuestionTypeId | 'all'>('all')
const levelFilter = ref<Level | 'all'>('all')
const statusFilter = ref<QuestionStatus | 'all'>('all')
const search = ref('')
const tagFilter = ref<string[]>([])

const allTags = computed(() => {
  const set = new Set<string>()
  for (const r of props.questions) for (const tag of r.tags ?? []) set.add(tag)
  return Array.from(set).sort()
})

function toggleTagFilter(tag: string) {
  const i = tagFilter.value.indexOf(tag)
  if (i === -1) tagFilter.value = [...tagFilter.value, tag]
  else tagFilter.value = tagFilter.value.filter((t) => t !== tag)
}

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return props.questions.filter((r) => {
    if (typeFilter.value !== 'all' && r.type !== typeFilter.value) return false
    // An exam for a class covers the questions of the classes below it too.
    if (levelFilter.value !== 'all' && !levelWithin(r.level, levelFilter.value)) return false
    if (statusFilter.value !== 'all' && r.status !== statusFilter.value) return false
    if (tagFilter.value.length && !tagFilter.value.some((tag) => r.tags?.includes(tag))) {
      return false
    }
    if (term) {
      const stem = localized(r.content, props.locale).stem.toLowerCase()
      if (!stem.includes(term)) return false
    }
    return true
  })
})

function isSelected(id: string) {
  return props.selectedIds.includes(id)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-3">
      <select
        v-model="typeFilter"
        class="bg-bg text-fg border-border h-9 rounded-md border px-2 text-sm"
        :aria-label="t('questions.filters.type')"
      >
        <option value="all">{{ t('questions.filters.all') }}</option>
        <option value="single-choice">{{ t('questions.types.single-choice') }}</option>
        <option value="multi-choice">{{ t('questions.types.multi-choice') }}</option>
        <option value="open-ended">{{ t('questions.types.open-ended') }}</option>
      </select>
      <select
        v-model="levelFilter"
        class="bg-bg text-fg border-border h-9 rounded-md border px-2 text-sm"
        :aria-label="t('questions.filters.level')"
      >
        <option value="all">{{ t('questions.filters.all') }}</option>
        <option v-for="l in LEVELS" :key="l" :value="l">{{ t(`levels.${l}`) }}</option>
      </select>
      <select
        v-model="statusFilter"
        class="bg-bg text-fg border-border h-9 rounded-md border px-2 text-sm"
        :aria-label="t('questions.filters.status')"
      >
        <option value="all">{{ t('questions.filters.all') }}</option>
        <option value="draft">{{ t('questions.status.draft') }}</option>
        <option value="published">{{ t('questions.status.published') }}</option>
        <option value="archived">{{ t('questions.status.archived') }}</option>
      </select>
      <input
        v-model="search"
        type="search"
        :placeholder="t('questions.filters.search')"
        :aria-label="t('questions.filters.search')"
        class="bg-bg text-fg border-border h-9 min-w-[220px] flex-1 rounded-md border px-3 text-sm"
      >
    </div>

    <div v-if="allTags.length" class="flex flex-wrap gap-1.5">
      <button
        v-for="tag in allTags"
        :key="tag"
        type="button"
        :class="[
          'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
          tagFilter.includes(tag)
            ? 'border-primary bg-primary text-primary-fg'
            : 'border-border bg-bg text-muted hover:text-fg',
        ]"
        @click="toggleTagFilter(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <ul
      class="border-border flex max-h-[28rem] flex-col divide-y overflow-y-auto rounded-md border"
    >
      <li v-if="!filtered.length" class="text-muted p-4 text-sm">{{ t('questions.empty') }}</li>
      <li
        v-for="q in filtered"
        :key="q.id"
        role="checkbox"
        tabindex="0"
        :aria-checked="isSelected(q.id)"
        :aria-label="localized(q.content, locale).stem"
        :class="[
          'group flex cursor-pointer items-start gap-3 p-3 transition-colors select-none',
          'focus-visible:ring-primary focus-visible:-ring-offset-2 focus-visible:ring-2 focus-visible:outline-none',
          isSelected(q.id) ? 'bg-primary/5' : 'hover:bg-bg',
        ]"
        @click="emit('toggle', q.id)"
        @keydown.space.prevent="emit('toggle', q.id)"
        @keydown.enter.prevent="emit('toggle', q.id)"
      >
        <span
          aria-hidden="true"
          :class="[
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-150',
            isSelected(q.id)
              ? 'border-primary bg-primary'
              : 'border-border bg-bg group-hover:border-primary/60',
          ]"
        >
          <svg
            viewBox="0 0 24 24"
            :class="[
              'text-primary-fg h-3.5 w-3.5 transition-transform duration-150 ease-out',
              isSelected(q.id) ? 'scale-100' : 'scale-0',
            ]"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-fg line-clamp-2 text-sm">{{ localized(q.content, locale).stem }}</p>
          <div class="mt-1 flex flex-wrap gap-2">
            <UiBadge size="sm" variant="neutral">{{ t(`questions.types.${q.type}`) }}</UiBadge>
            <UiBadge size="sm" variant="info">{{ t(`levels.${q.level}`) }}</UiBadge>
            <UiBadge
              size="sm"
              :variant="
                q.status === 'published' ? 'success' : q.status === 'draft' ? 'warning' : 'neutral'
              "
            >
              {{ t(`questions.status.${q.status}`) }}
            </UiBadge>
            <UiBadge v-for="tag in q.tags" :key="tag" size="sm" variant="neutral">{{
              tag
            }}</UiBadge>
          </div>
        </div>
        <div class="flex shrink-0 gap-2">
          <UiButton variant="ghost" size="sm" @click.stop="emit('preview', q)">
            {{ t('examGenerator.picker.preview') }}
          </UiButton>
          <UiButton variant="ghost" size="sm" @click.stop="emit('edit', q)">
            {{ t('questions.actions.edit') }}
          </UiButton>
        </div>
      </li>
    </ul>
  </div>
</template>
