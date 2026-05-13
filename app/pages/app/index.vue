<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="font-display text-fg mb-4 text-3xl">
      Hello, {{ user?.displayName ?? user?.email ?? 'student' }}
    </h1>
    <p class="text-muted">Your dashboard will appear here as features land.</p>
  </section>
</template>
