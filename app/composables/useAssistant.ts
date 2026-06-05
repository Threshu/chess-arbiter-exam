import { httpsCallable, type Functions } from 'firebase/functions'
import type {
  AskRequest,
  AskResponse,
  ChatMessage,
  QuestionContext,
} from '~~/shared/types/assistant'

export function useAssistant() {
  const { $firebaseFunctions } = useNuxtApp()
  const functions = $firebaseFunctions as Functions
  const askFn = httpsCallable<AskRequest, AskResponse>(functions, 'askAssistant')

  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function ask(
    content: string,
    opts?: { questionContext?: QuestionContext; locale?: 'pl' | 'en' },
  ) {
    if (loading.value || !content.trim()) return
    const userMessage: ChatMessage = { role: 'user', content: content.trim() }
    messages.value = [...messages.value, userMessage]
    loading.value = true
    error.value = null
    try {
      const response = await askFn({
        messages: messages.value,
        questionContext: opts?.questionContext,
        locale: opts?.locale ?? 'pl',
      })
      messages.value = [...messages.value, { role: 'model', content: response.data.reply }]
    } catch (e) {
      messages.value = messages.value.slice(0, -1)
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  function reset() {
    messages.value = []
    error.value = null
  }

  return {
    messages: readonly(messages),
    loading: readonly(loading),
    error: readonly(error),
    ask,
    reset,
  }
}
