<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n()
const localePath = useLocalePath()
const { user, isAdmin, signOut } = useAuth()

const localeOptions = computed(() => locales.value as { code: string; name: string }[])

async function switchLocale(code: string) {
  if (code === locale.value) return
  await setLocale(code as 'pl' | 'en')
}

async function onSignOut() {
  await signOut()
  await navigateTo(localePath('/'))
}
</script>

<template>
  <header class="border-border bg-bg border-b">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <NuxtLink :to="localePath('/')" class="text-fg flex items-center gap-3">
        <img src="/logo.png" :alt="t('app.name')" class="h-20 w-20 shrink-0" >
        <span class="font-display hidden text-base sm:inline lg:text-xl">{{ t('app.name') }}</span>
      </NuxtLink>

      <nav class="flex items-center gap-4 px-6">
        <div class="flex items-center gap-2">
          <button
            v-for="l in localeOptions"
            :key="l.code"
            type="button"
            :aria-label="l.name"
            :aria-pressed="locale === l.code"
            :title="l.name"
            :class="[
              'h-5 w-8 overflow-hidden rounded border transition',
              locale === l.code
                ? 'border-fg opacity-100'
                : 'border-border opacity-50 hover:opacity-100',
            ]"
            @click="switchLocale(l.code)"
          >
            <img :src="`/flags/${l.code}.svg`" :alt="l.name" class="h-full w-full object-cover" >
          </button>
        </div>

        <template v-if="user">
          <NuxtLink :to="localePath('/app')" class="text-fg text-sm">{{ t('nav.app') }}</NuxtLink>
          <NuxtLink v-if="isAdmin" :to="localePath('/admin')" class="text-fg text-sm">
            {{ t('nav.admin') }}
          </NuxtLink>
          <UiButton variant="ghost" size="sm" @click="onSignOut">
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
