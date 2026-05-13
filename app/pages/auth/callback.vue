<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

onMounted(async () => {
  await navigateTo(localePath('/app'))
})
</script>

<template>
  <section class="mx-auto max-w-md px-6 py-24 text-center">
    <p class="text-muted">{{ t('callback.verifying') }}</p>
  </section>
</template>
