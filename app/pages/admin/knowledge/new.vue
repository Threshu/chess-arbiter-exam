<script setup lang="ts">
import { addDoc, collection, serverTimestamp, type Firestore } from 'firebase/firestore'

definePageMeta({ middleware: ['admin'], layout: 'admin' })

const { t } = useI18n()
const localePath = useLocalePath()
const { $firestore } = useNuxtApp()
const { user } = useAuth()
const firestore = $firestore as Firestore

const saving = ref(false)
const errors = ref<Record<string, string>>({})

const form = reactive({
  titlePl: '',
  titleEn: '',
  contentPl: '',
  contentEn: '',
  source: '',
  tags: '',
})

function validate() {
  const e: Record<string, string> = {}
  if (!form.titlePl.trim()) e.titlePl = t('knowledge.form.errors.missingTitlePl')
  if (!form.titleEn.trim()) e.titleEn = t('knowledge.form.errors.missingTitleEn')
  if (!form.contentPl.trim()) e.contentPl = t('knowledge.form.errors.missingContentPl')
  if (!form.contentEn.trim()) e.contentEn = t('knowledge.form.errors.missingContentEn')
  errors.value = e
  return Object.keys(e).length === 0
}

async function save() {
  if (!validate() || !user.value) return
  saving.value = true
  try {
    const tags = form.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    await addDoc(collection(firestore, 'knowledgeBase'), {
      title: { pl: form.titlePl.trim(), en: form.titleEn.trim() },
      content: { pl: form.contentPl.trim(), en: form.contentEn.trim() },
      source: form.source.trim(),
      tags,
      createdBy: user.value.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    await navigateTo(localePath('/admin/knowledge'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="max-w-3xl">
    <div class="mb-6 flex items-center gap-3">
      <NuxtLink :to="localePath('/admin/knowledge')">
        <UiButton variant="ghost" size="sm">← {{ t('knowledge.form.backToList') }}</UiButton>
      </NuxtLink>
      <h1 class="font-display text-fg text-3xl">{{ t('knowledge.form.title') }}</h1>
    </div>

    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label for="knowledge-title-pl" class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('knowledge.form.titlePl') }}</span>
          <input
            id="knowledge-title-pl"
            v-model="form.titlePl"
            type="text"
            class="bg-bg text-fg border-border focus-visible:ring-primary rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            :class="errors.titlePl ? 'border-danger' : ''"
          >
          <p v-if="errors.titlePl" class="text-danger text-xs">{{ errors.titlePl }}</p>
        </label>

        <label for="knowledge-title-en" class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('knowledge.form.titleEn') }}</span>
          <input
            id="knowledge-title-en"
            v-model="form.titleEn"
            type="text"
            class="bg-bg text-fg border-border focus-visible:ring-primary rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            :class="errors.titleEn ? 'border-danger' : ''"
          >
          <p v-if="errors.titleEn" class="text-danger text-xs">{{ errors.titleEn }}</p>
        </label>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label for="knowledge-content-pl" class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('knowledge.form.contentPl') }}</span>
          <textarea
            id="knowledge-content-pl"
            v-model="form.contentPl"
            rows="8"
            class="bg-bg text-fg border-border focus-visible:ring-primary resize-y rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            :class="errors.contentPl ? 'border-danger' : ''"
          />
          <p v-if="errors.contentPl" class="text-danger text-xs">{{ errors.contentPl }}</p>
        </label>

        <label for="knowledge-content-en" class="flex flex-col gap-1.5">
          <span class="text-fg text-sm font-medium">{{ t('knowledge.form.contentEn') }}</span>
          <textarea
            id="knowledge-content-en"
            v-model="form.contentEn"
            rows="8"
            class="bg-bg text-fg border-border focus-visible:ring-primary resize-y rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            :class="errors.contentEn ? 'border-danger' : ''"
          />
          <p v-if="errors.contentEn" class="text-danger text-xs">{{ errors.contentEn }}</p>
        </label>
      </div>

      <label for="knowledge-source" class="flex flex-col gap-1.5">
        <span class="text-fg text-sm font-medium">{{ t('knowledge.form.source') }}</span>
        <input
          id="knowledge-source"
          v-model="form.source"
          type="text"
          :placeholder="t('knowledge.form.sourcePlaceholder')"
          class="bg-bg text-fg border-border focus-visible:ring-primary rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
      </label>

      <label for="knowledge-tags" class="flex flex-col gap-1.5">
        <span class="text-fg text-sm font-medium">{{ t('knowledge.form.tags') }}</span>
        <input
          id="knowledge-tags"
          v-model="form.tags"
          type="text"
          :placeholder="t('knowledge.form.tagsPlaceholder')"
          class="bg-bg text-fg border-border focus-visible:ring-primary rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
        <p class="text-muted text-xs">{{ t('knowledge.form.tagsHint') }}</p>
      </label>

      <div class="flex justify-end">
        <UiButton variant="primary" :loading="saving" @click="save">
          {{ t('knowledge.form.save') }}
        </UiButton>
      </div>
    </div>
  </section>
</template>
