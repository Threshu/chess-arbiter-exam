<template>
  <div class="bg-bg text-fg flex min-h-screen">
    <aside
      class="duration-base border-border bg-surface w-14 overflow-hidden border-r transition-[width] hover:w-56"
    >
      <div class="flex flex-col py-4">
        <div class="font-display px-4 pb-4 text-lg whitespace-nowrap">Admin</div>
        <nav class="flex flex-col gap-1 px-2 text-sm">
          <NuxtLink to="/admin" class="hover:bg-bg rounded-md px-2 py-1.5 whitespace-nowrap">
            Dashboard
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <div class="flex flex-1 flex-col">
      <AppHeader />
      <main class="flex-1 px-6 py-6">
        <slot />
      </main>
    </div>
  </div>
</template>
