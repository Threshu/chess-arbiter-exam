<script setup lang="ts">
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore'
import type { Level, Question, QuestionStatus, QuestionTypeId } from '~~/shared/types/question'

definePageMeta({ middleware: ['admin'], layout: 'admin' })

const { t, locale } = useI18n()
const localePath = useLocalePath()
const { $firestore } = useNuxtApp()
const firestore = $firestore as Firestore

type Row = Question & { id: string }
const rows = ref<Row[]>([])
const loading = ref(true)

const typeFilter = ref<QuestionTypeId | 'all'>('all')
const levelFilter = ref<Level | 'all'>('all')
const statusFilter = ref<QuestionStatus | 'all'>('all')
const search = ref('')

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return rows.value.filter((r) => {
    if (typeFilter.value !== 'all' && r.type !== typeFilter.value) return false
    if (levelFilter.value !== 'all' && r.level !== levelFilter.value) return false
    if (statusFilter.value !== 'all' && r.status !== statusFilter.value) return false
    if (term) {
      const stems = `${r.content.pl.stem} ${r.content.en.stem}`.toLowerCase()
      if (!stems.includes(term)) return false
    }
    return true
  })
})

let unsubscribe: Unsubscribe | null = null

onMounted(() => {
  const q = query(collection(firestore, 'questions'), orderBy('createdAt', 'desc'))
  unsubscribe = onSnapshot(q, (snap) => {
    rows.value = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Question) }))
    loading.value = false
  })
})

onBeforeUnmount(() => {
  unsubscribe?.()
})

async function togglePublish(row: Row) {
  const next = row.status === 'published' ? 'draft' : 'published'
  await updateDoc(doc(firestore, 'questions', row.id), {
    status: next,
    updatedAt: serverTimestamp(),
  })
}

const deleteOpen = ref(false)
const deleteTarget = ref<Row | null>(null)
const deleting = ref(false)

const deleteStem = computed(() => {
  const target = deleteTarget.value
  if (!target) return ''
  const stem = localized(target.content, locale.value as 'pl' | 'en').stem
  return stem.length > 80 ? `${stem.slice(0, 80)}…` : stem
})

function askDelete(row: Row) {
  deleteTarget.value = row
  deleteOpen.value = true
}

async function confirmDelete() {
  const target = deleteTarget.value
  if (!target) return
  deleting.value = true
  try {
    await deleteDoc(doc(firestore, 'questions', target.id))
    deleteOpen.value = false
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

const statusVariant: Record<QuestionStatus, 'success' | 'warning' | 'neutral'> = {
  published: 'success',
  draft: 'warning',
  archived: 'neutral',
}
</script>

<template>
  <section class="w-full">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="font-display text-fg text-3xl">{{ t('questions.listTitle') }}</h1>
      <NuxtLink :to="localePath('/admin/questions/new')">
        <UiButton variant="primary">{{ t('questions.addNew') }}</UiButton>
      </NuxtLink>
    </div>

    <div class="mb-4 flex flex-wrap gap-3">
      <select
        v-model="typeFilter"
        class="bg-bg text-fg border-border h-9 rounded-md border px-2 text-sm"
        :aria-label="t('questions.filters.type')"
      >
        <option value="all">
          {{ t('questions.filters.type') }}: {{ t('questions.filters.all') }}
        </option>
        <option value="single-choice">{{ t('questions.types.single-choice') }}</option>
        <option value="multi-choice">{{ t('questions.types.multi-choice') }}</option>
        <option value="open-ended">{{ t('questions.types.open-ended') }}</option>
      </select>

      <select
        v-model="levelFilter"
        class="bg-bg text-fg border-border h-9 rounded-md border px-2 text-sm"
        :aria-label="t('questions.filters.level')"
      >
        <option value="all">
          {{ t('questions.filters.level') }}: {{ t('questions.filters.all') }}
        </option>
        <option value="NA">NA</option>
        <option value="FA">FA</option>
        <option value="IA">IA</option>
      </select>

      <select
        v-model="statusFilter"
        class="bg-bg text-fg border-border h-9 rounded-md border px-2 text-sm"
        :aria-label="t('questions.filters.status')"
      >
        <option value="all">
          {{ t('questions.filters.status') }}: {{ t('questions.filters.all') }}
        </option>
        <option value="draft">{{ t('questions.status.draft') }}</option>
        <option value="published">{{ t('questions.status.published') }}</option>
        <option value="archived">{{ t('questions.status.archived') }}</option>
      </select>

      <input
        v-model="search"
        type="search"
        :placeholder="t('questions.filters.search')"
        :aria-label="t('questions.filters.search')"
        class="bg-bg text-fg border-border h-9 min-w-[240px] flex-1 rounded-md border px-3 text-sm"
      >
    </div>

    <UiCard v-if="loading">
      <p class="text-muted">…</p>
    </UiCard>

    <UiCard v-else-if="filtered.length === 0">
      <p class="text-muted">{{ t('questions.empty') }}</p>
    </UiCard>

    <UiCard v-else>
      <table class="w-full table-fixed text-left text-sm">
        <colgroup>
          <col style="width: 55%" >
          <col style="width: 11%" >
          <col style="width: 7%" >
          <col style="width: 14%" >
          <col style="width: 13%" >
        </colgroup>
        <thead class="text-muted border-border border-b">
          <tr>
            <th class="py-2 pr-4 text-xs font-medium tracking-wide uppercase">
              {{ t('questions.columns.stem') }}
            </th>
            <th class="py-2 pr-4 text-xs font-medium tracking-wide uppercase">
              {{ t('questions.columns.type') }}
            </th>
            <th class="py-2 pr-4 text-xs font-medium tracking-wide uppercase">
              {{ t('questions.columns.level') }}
            </th>
            <th class="py-2 pr-4 text-xs font-medium tracking-wide uppercase">
              {{ t('questions.columns.status') }}
            </th>
            <th class="py-2 pr-0 text-right text-xs font-medium tracking-wide uppercase">
              {{ t('questions.columns.actions') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in filtered"
            :key="row.id"
            class="border-border border-b align-top last:border-0"
          >
            <td class="py-3 pr-4">
              <p class="text-fg line-clamp-3 text-sm">
                {{ localized(row.content, locale as 'pl' | 'en').stem }}
              </p>
            </td>
            <td class="py-3 pr-4">
              <span class="text-muted text-xs">{{ t(`questions.types.${row.type}`) }}</span>
            </td>
            <td class="py-3 pr-4 text-sm">{{ row.level }}</td>
            <td class="py-3 pr-4">
              <UiBadge :variant="statusVariant[row.status]" dot>
                {{ t(`questions.status.${row.status}`) }}
              </UiBadge>
            </td>
            <td class="py-3 pr-0">
              <div class="flex justify-end gap-1.5">
                <NuxtLink :to="localePath(`/admin/questions/${row.id}/edit`)">
                  <button
                    type="button"
                    :title="t('questions.actions.edit')"
                    :aria-label="t('questions.actions.edit')"
                    class="border-border bg-bg text-muted hover:bg-surface hover:text-fg focus-visible:ring-primary inline-flex h-8 w-8 items-center justify-center rounded-md border transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </button>
                </NuxtLink>

                <button
                  type="button"
                  :title="
                    row.status === 'published'
                      ? t('questions.actions.unpublish')
                      : t('questions.actions.publish')
                  "
                  :aria-label="
                    row.status === 'published'
                      ? t('questions.actions.unpublish')
                      : t('questions.actions.publish')
                  "
                  class="border-border bg-bg text-muted hover:bg-surface hover:text-fg focus-visible:ring-primary inline-flex h-8 w-8 items-center justify-center rounded-md border transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  @click="togglePublish(row)"
                >
                  <svg
                    v-if="row.status === 'published'"
                    viewBox="0 0 24 24"
                    class="h-4 w-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    class="h-4 w-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  :title="t('questions.actions.delete')"
                  :aria-label="t('questions.actions.delete')"
                  class="border-border bg-bg text-muted hover:bg-danger/10 hover:text-danger hover:border-danger/40 focus-visible:ring-danger inline-flex h-8 w-8 items-center justify-center rounded-md border transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  @click="askDelete(row)"
                >
                  <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </UiCard>

    <UiConfirmDialog
      :open="deleteOpen"
      :title="t('questions.deleteDialog.title')"
      :description="t('questions.deleteDialog.description', { stem: deleteStem })"
      :confirm-text="t('questions.deleteDialog.confirm')"
      variant="danger"
      :loading="deleting"
      @update:open="deleteOpen = $event"
      @confirm="confirmDelete"
    />
  </section>
</template>
