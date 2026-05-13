<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n()
const localePath = useLocalePath()
const { user, isAdmin, signOut } = useAuth()

const availableLocales = computed(() =>
  (locales.value as { code: string; name: string }[]).filter((l) => l.code !== locale.value),
)

async function switchLocale(code: string) {
  await setLocale(code as 'pl' | 'en')
}
</script>

<template>
  <header class="border-border bg-bg border-b">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <NuxtLink :to="localePath('/')" class="font-display text-fg text-xl">
        {{ t('app.name') }}
      </NuxtLink>

      <nav class="flex items-center gap-4">
        <NuxtLink :to="localePath('/about')" class="text-muted hover:text-fg text-sm">
          {{ t('nav.about') }}
        </NuxtLink>

        <div class="flex items-center gap-1 text-sm">
          <span class="text-muted">{{ t('languageToggle.label') }}:</span>
          <button
            v-for="l in availableLocales"
            :key="l.code"
            type="button"
            class="text-muted hover:text-fg underline-offset-2 hover:underline"
            @click="switchLocale(l.code)"
          >
            {{ l.name }}
          </button>
        </div>

        <template v-if="user">
          <NuxtLink :to="localePath('/app')" class="text-fg text-sm">{{ t('nav.app') }}</NuxtLink>
          <NuxtLink v-if="isAdmin" :to="localePath('/admin')" class="text-fg text-sm">
            {{ t('nav.admin') }}
          </NuxtLink>
          <UiButton variant="ghost" size="sm" @click="signOut()">
            {{ t('nav.logout') }}
          </UiButton>
        </template>
        <template v-else>
          <UiButton variant="secondary" size="sm" @click="navigateTo(localePath('/auth/login'))">
            {{ t('nav.login') }}
          </UiButton>
        </template>
      </nav>
    </div>
  </header>
</template>
