<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()
const { messages, loading, error, ask } = useAssistant()

async function onSend(content: string) {
  await ask(content, { locale: locale.value as 'pl' | 'en' })
}
</script>

<template>
  <section class="mx-auto flex max-w-2xl flex-col px-6 py-10" style="height: calc(100vh - 80px)">
    <h1 class="font-display text-fg mb-1 text-3xl">{{ t('assistant.pageTitle') }}</h1>
    <p class="text-muted mb-6 text-sm">{{ t('assistant.pageSubtitle') }}</p>
    <div class="border-border flex-1 overflow-hidden rounded-lg border">
      <AssistantChat
        :messages="messages"
        :loading="loading"
        :error="error"
        :placeholder="t('assistant.inputPlaceholder')"
        :empty-text="t('assistant.emptyState')"
        :disclaimer="t('assistant.disclaimer')"
        @send="onSend"
      />
    </div>
  </section>
</template>
