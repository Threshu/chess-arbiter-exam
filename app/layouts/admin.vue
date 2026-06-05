<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

type NavItem = { key: 'dashboard' | 'questions' | 'knowledge'; to: string; label: string }

const nav = computed<NavItem[]>(() => [
  { key: 'dashboard', to: localePath('/admin'), label: t('nav.dashboard') },
  { key: 'questions', to: localePath('/admin/questions'), label: t('nav.questions') },
  { key: 'knowledge', to: localePath('/admin/knowledge'), label: t('nav.knowledge') },
])
</script>

<template>
  <div class="bg-bg text-fg flex min-h-screen">
    <aside
      class="duration-base border-border bg-surface group w-16 overflow-hidden border-r transition-[width] hover:w-56"
    >
      <div class="flex flex-col py-3">
        <div
          class="flex items-center justify-center gap-3 pb-3 whitespace-nowrap group-hover:justify-start group-hover:px-3"
        >
          <img src="/logo.png" alt="" class="h-12 w-12 shrink-0" >
          <span class="font-display text-fg hidden text-lg group-hover:inline">Admin</span>
        </div>

        <nav class="flex flex-col gap-1 px-2 text-sm">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            :title="item.label"
            class="text-muted hover:bg-bg hover:text-fg flex items-center justify-center gap-3 rounded-md p-2 whitespace-nowrap transition-colors group-hover:justify-start"
            active-class="bg-bg text-fg font-medium"
          >
            <span class="flex h-6 w-6 shrink-0 items-center justify-center">
              <svg
                v-if="item.key === 'dashboard'"
                viewBox="0 0 24 24"
                class="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M4 5c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1V5zm0 10c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1v-4zm10-10c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1h-4c-.6 0-1-.4-1-1V5zm0 10c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1h-4c-.6 0-1-.4-1-1v-4z"
                />
              </svg>
              <svg
                v-else-if="item.key === 'questions'"
                viewBox="0 0 24 24"
                class="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M3 5h2v2H3V5zm0 6h2v2H3v-2zm0 6h2v2H3v-2zm4-12h14v2H7V5zm0 6h14v2H7v-2zm0 6h14v2H7v-2z"
                />
              </svg>
              <svg
                v-else-if="item.key === 'knowledge'"
                viewBox="0 0 24 24"
                class="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"
                />
              </svg>
            </span>
            <span class="hidden group-hover:inline">{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <div class="flex flex-1 flex-col">
      <ClientOnly>
        <AppHeader />
        <template #fallback>
          <div class="border-border bg-bg h-[80px] border-b" />
        </template>
      </ClientOnly>
      <main class="flex-1 px-6 py-6">
        <slot />
      </main>
    </div>
  </div>
</template>
