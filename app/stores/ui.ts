import { defineStore } from 'pinia'

export type Toast = {
  id: string
  kind: 'info' | 'success' | 'warning' | 'danger'
  message: string
}

export type Theme = 'light' | 'dark'

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const theme = ref<Theme>('light')

  function pushToast(toast: Omit<Toast, 'id'>) {
    toasts.value.push({ id: crypto.randomUUID(), ...toast })
  }

  function dismissToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function setTheme(next: Theme) {
    theme.value = next
  }

  return { toasts, theme, pushToast, dismissToast, setTheme }
})
