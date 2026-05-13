<template>
  <div class="bg-bg text-fg flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-border text-muted border-t py-6 text-center text-sm">
      &copy; {{ new Date().getFullYear() }} Chess Arbiter
    </footer>
  </div>
</template>
