import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import { FIRESTORE_REGION } from '../../../shared/constants.js'
import { assertAuthenticated, validate } from '../lib/auth.js'
import { db } from '../lib/admin.js'

const messageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string().min(1).max(4000),
})

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
  questionContext: z
    .object({
      stem: z.string().max(2000),
      explanation: z.string().max(2000).optional(),
      correctAnswer: z.string().max(1000).optional(),
      type: z.string(),
    })
    .nullish(),
  locale: z.enum(['pl', 'en']),
})

async function fetchKnowledge(locale: 'pl' | 'en'): Promise<string> {
  const snap = await db.collection('knowledgeBase').orderBy('createdAt', 'desc').limit(30).get()
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
}

function buildSystemPrompt(
  locale: 'pl' | 'en',
  questionCtx:
    | { stem: string; explanation?: string; correctAnswer?: string; type: string }
    | null
    | undefined,
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

export const askAssistant = onCall({ region: FIRESTORE_REGION }, async (request) => {
  assertAuthenticated(request)
  const { messages, questionContext, locale } = validate(inputSchema, request.data)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new HttpsError('internal', 'GEMINI_API_KEY not configured')

  const knowledge = questionContext ? '' : await fetchKnowledge(locale)
  const systemPrompt = buildSystemPrompt(locale, questionContext, knowledge)

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
    systemInstruction: systemPrompt,
  })

  const contents = messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }))

  let result
  try {
    result = await model.generateContent({
      contents,
      generationConfig: { maxOutputTokens: 1024, temperature: 0.4 },
    })
  } catch (err) {
    console.error('[askAssistant] Gemini error:', err)
    throw new HttpsError('internal', 'Gemini request failed')
  }

  const reply = result.response.text?.()?.trim() ?? ''
  if (!reply) throw new HttpsError('internal', 'Empty response from model')

  return { reply }
})
