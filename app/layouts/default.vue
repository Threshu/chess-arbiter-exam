<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="bg-bg text-fg flex min-h-screen flex-col">
    <ClientOnly>
      <AppHeader />
      <template #fallback>
        <div class="border-border bg-bg h-[80px] border-b" />
      </template>
    </ClientOnly>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-border text-muted border-t py-6 text-sm">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between"
      >
        <p>&copy; {{ new Date().getFullYear() }} {{ t('app.name') }}. {{ t('footer.rights') }}</p>
        <nav class="flex gap-4">
          <NuxtLink :to="localePath('/legal/tos')" class="hover:text-fg">{{
            t('nav.tos')
          }}</NuxtLink>
          <NuxtLink :to="localePath('/legal/privacy')" class="hover:text-fg">{{
            t('nav.privacy')
          }}</NuxtLink>
          <NuxtLink :to="localePath('/legal/cookies')" class="hover:text-fg">{{
            t('nav.cookies')
          }}</NuxtLink>
        </nav>
      </div>
    </footer>
  </div>
</template>
