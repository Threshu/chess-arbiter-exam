<script setup lang="ts">
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  type Firestore,
} from 'firebase/firestore'
import type { KnowledgeItem } from '~~/shared/types/assistant'

definePageMeta({ middleware: ['admin'], layout: 'admin' })

const { t } = useI18n()
const localePath = useLocalePath()
const { $firestore } = useNuxtApp()
const firestore = $firestore as Firestore

type Loaded = KnowledgeItem & { id: string }

const items = ref<Loaded[]>([])
const loading = ref(true)
const deleting = ref(false)
const deleteOpen = ref(false)
const deleteTarget = ref<Loaded | null>(null)

onMounted(async () => {
  const snap = await getDocs(
    query(collection(firestore, 'knowledgeBase'), orderBy('createdAt', 'desc')),
  )
  items.value = snap.docs.map((d) => ({ id: d.id, ...(d.data() as KnowledgeItem) }))
  loading.value = false
})

function askDelete(item: Loaded) {
  deleteTarget.value = item
  deleteOpen.value = true
}

async function confirmDelete() {
  const target = deleteTarget.value
  if (!target) return
  deleting.value = true
  try {
    await deleteDoc(doc(firestore, 'knowledgeBase', target.id))
    items.value = items.value.filter((i) => i.id !== target.id)
    deleteOpen.value = false
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <section class="max-w-4xl">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="font-display text-fg text-3xl">{{ t('knowledge.listTitle') }}</h1>
      <NuxtLink :to="localePath('/admin/knowledge/new')">
        <UiButton variant="primary">{{ t('knowledge.addNew') }}</UiButton>
      </NuxtLink>
    </div>

    <UiCard v-if="loading">
      <p class="text-muted">…</p>
    </UiCard>

    <UiCard v-else-if="items.length === 0">
      <p class="text-muted">{{ t('knowledge.empty') }}</p>
    </UiCard>

    <div v-else class="flex flex-col gap-3">
      <UiCard v-for="item in items" :key="item.id">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-fg font-medium">{{ item.title.pl }}</p>
            <p v-if="item.title.en !== item.title.pl" class="text-muted text-sm">
              {{ item.title.en }}
            </p>
            <p v-if="item.source" class="text-muted mt-1 text-sm">{{ item.source }}</p>
            <div v-if="item.tags?.length" class="mt-2 flex flex-wrap gap-1">
              <UiBadge v-for="tag in item.tags" :key="tag" variant="neutral">{{ tag }}</UiBadge>
            </div>
          </div>
          <button
            type="button"
            :title="t('knowledge.delete')"
            :aria-label="t('knowledge.delete')"
            class="border-border bg-bg text-muted hover:bg-danger/10 hover:text-danger hover:border-danger/40 focus-visible:ring-danger inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            @click="askDelete(item)"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
          </button>
        </div>
      </UiCard>
    </div>

    <UiConfirmDialog
      :open="deleteOpen"
      :title="t('knowledge.deleteDialog.title')"
      :description="
        t('knowledge.deleteDialog.description', { title: deleteTarget?.title.pl ?? '' })
      "
      :confirm-text="t('knowledge.deleteDialog.confirm')"
      variant="danger"
      :loading="deleting"
      @update:open="deleteOpen = $event"
      @confirm="confirmDelete"
    />
  </section>
</template>
