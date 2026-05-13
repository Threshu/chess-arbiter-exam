<template>
  <div class="bg-bg text-fg min-h-screen">
    <header class="border-border border-b">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <div class="text-muted text-sm">
          <slot name="progress" />
        </div>
        <div class="font-mono text-lg">
          <slot name="timer" />
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-3xl px-6 py-10">
      <slot />
    </main>
  </div>
</template>
