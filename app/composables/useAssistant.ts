import { collection, getDocs, orderBy, limit, query, type Firestore } from 'firebase/firestore'
import type { ChatMessage, QuestionContext } from '~~/shared/types/assistant'

function buildSystemPrompt(
  locale: 'pl' | 'en',
  questionCtx: QuestionContext | null | undefined,
  knowledge: string,
): string {
  const pl = locale === 'pl'

  const base = pl
    ? 'Jesteś ekspertem z zakresu przepisów szachowych i procedur sędziowania FIDE. Pomagasz arbitrom i kandydatom na arbitrów przygotować się do egzaminów FIDE (poziomy NA, FA, IA). Odpowiadaj precyzyjnie, opierając się na Przepisach Szachowych FIDE i dobrych praktykach sędziowania. Jeśli temat wykracza poza Twoją wiedzę, powiedz to wprost zamiast zgadywać.'
    : 'You are an expert in FIDE Laws of Chess and arbiter procedures. You help arbiters and candidates prepare for FIDE exams (NA, FA, IA levels). Be precise and base your answers on the FIDE Laws of Chess and best arbitration practices. If the topic is outside your knowledge, say so directly rather than guessing.'

  const parts: string[] = [base]

  if (knowledge) {
    parts.push(
      pl ? `## Materiały szkoleniowe\n\n${knowledge}` : `## Training materials\n\n${knowledge}`,
    )
  }

  if (questionCtx) {
    const header = pl ? '## Kontekst bieżącego zadania' : '## Current question context'
    const questionLabel = pl ? 'Pytanie' : 'Question'
    const answerLabel = pl ? 'Poprawna odpowiedź' : 'Correct answer'
    const explLabel = pl ? 'Wyjaśnienie' : 'Explanation'

    let ctx = `${header}\n\n**${questionLabel}:** ${questionCtx.stem}`
    if (questionCtx.correctAnswer) ctx += `\n**${answerLabel}:** ${questionCtx.correctAnswer}`
    if (questionCtx.explanation) ctx += `\n**${explLabel}:** ${questionCtx.explanation}`
    parts.push(ctx)

    parts.push(
      pl
        ? 'Użytkownik może pytać o to konkretne zadanie sędziowskie. Wyjaśnij zasadę lub sytuację — nie przepisuj dosłownie podanej poprawnej odpowiedzi.'
        : 'The user may ask about this specific arbitration scenario. Explain the rule or situation — do not directly copy the given correct answer.',
    )
  }

  return parts.join('\n\n')
}

export function useAssistant() {
  const { $firestore } = useNuxtApp()
  const config = useRuntimeConfig()
  const { user } = useAuth()

  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchKnowledge(locale: 'pl' | 'en'): Promise<string> {
    try {
      const firestore = $firestore as Firestore
      const q = query(
        collection(firestore, 'knowledgeBase'),
        orderBy('createdAt', 'desc'),
        limit(30),
      )
      const snap = await getDocs(q)
      if (snap.empty) return ''
      return snap.docs
        .map((d) => {
          const data = d.data()
          const title = (data.title?.[locale] ?? data.title?.['pl'] ?? '') as string
          const content = (data.content?.[locale] ?? data.content?.['pl'] ?? '') as string
          const source = (data.source ?? '') as string
          return `### ${title}${source ? ` (${source})` : ''}\n${content}`
        })
        .join('\n\n---\n\n')
    } catch {
      return ''
    }
  }

  async function ask(
    content: string,
    opts?: { questionContext?: QuestionContext; locale?: 'pl' | 'en' },
  ) {
    if (loading.value || !content.trim() || !user.value) return
    const msgLocale = opts?.locale ?? 'pl'
    const userMessage: ChatMessage = { role: 'user', content: content.trim() }
    messages.value = [...messages.value, userMessage]
    loading.value = true
    error.value = null

    try {
      const knowledge = opts?.questionContext ? '' : await fetchKnowledge(msgLocale)
      const systemPrompt = buildSystemPrompt(msgLocale, opts?.questionContext ?? null, knowledge)

      const apiKey = config.public.geminiApiKey as string
      if (!apiKey) throw new Error('Gemini API key not configured')

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: messages.value.map((m) => ({
              role: m.role,
              parts: [{ text: m.content }],
            })),
            generationConfig: { maxOutputTokens: 1024, temperature: 0.4 },
          }),
        },
      )

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(
          (err as { error?: { message?: string } }).error?.message ?? `HTTP ${response.status}`,
        )
      }

      const data = (await response.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[]
      }
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
      if (!reply) throw new Error('Empty response from Gemini')
      messages.value = [...messages.value, { role: 'model', content: reply }]
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
