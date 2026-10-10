import { z } from 'zod'
import { levelSchema } from './question.js'

/**
 * Wyniki przeprowadzonych egzaminow — tylko dla admina (`examSessions/{sid}` i podkolekcja `results`).
 *
 * Sesja to jeden przeprowadzony egzamin. Trzyma kopie pytan z dnia egzaminu (numer, typ, klasa,
 * poprawne litery, punkty), bo pytania w banku i zapisany egzamin moga sie potem zmienic, a wyniki
 * maja zostac porownywalne. `questionId` wskazuje pytanie w banku — po nim laczy sie statystyki tego
 * samego pytania z roznych egzaminow.
 */
export const sessionQuestionSchema = z.object({
  questionId: z.string().min(1),
  no: z.number().int().positive(),
  type: z.enum(['single-choice', 'multi-choice', 'open-ended']),
  level: levelSchema,
  points: z.number().positive(),
  /** Litery poprawnych odpowiedzi; puste dla pytan otwartych. */
  correct: z.array(z.string()),
  /** Liczba wariantow odpowiedzi (do siatki liter); 0 dla pytan otwartych. */
  optionCount: z.number().int().nonnegative(),
  /** Poczatek tresci — zeby w tabelach bylo widac, o co chodzi w pytaniu. */
  stem: z.string(),
})

export const examSessionSchema = z.object({
  name: z.string().min(1),
  /** Data egzaminu, YYYY-MM-DD. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  examId: z.string().min(1),
  questions: z.array(sessionQuestionSchema).min(1),
  passThresholds: z.array(z.object({ level: levelSchema, percent: z.number().min(0).max(100) })),
  createdBy: z.string().min(1),
  createdAt: z.unknown(),
  updatedAt: z.unknown(),
})

/** Klasy, na ktore zdaje sie egzamin okregowy (M / 3 / 2 w arkuszu). */
export const candidateLevelSchema = z.enum(['youth', 'III', 'II'])

export const candidateAnswerSchema = z.object({
  /** Zaznaczone litery (pytania zamkniete). */
  choice: z.array(z.string()).optional(),
  /** Przyznane punkty — przy zamknietych liczone z liter, ale do recznej zmiany. */
  points: z.number().min(0),
  /** Tresc odpowiedzi lub uwaga oceniajacego (zwykle przy pytaniach otwartych). */
  note: z.string().optional(),
})

export const candidateResultSchema = z.object({
  /** Inicjaly, np. "SB" — bez pelnych danych osobowych. */
  candidate: z.string().min(1).max(8),
  level: candidateLevelSchema,
  answers: z.record(z.string(), candidateAnswerSchema),
  createdBy: z.string().min(1),
  createdAt: z.unknown(),
  updatedAt: z.unknown(),
})

export type SessionQuestion = z.infer<typeof sessionQuestionSchema>
export type ExamSessionInput = z.infer<typeof examSessionSchema>
export type CandidateLevel = z.infer<typeof candidateLevelSchema>
export type CandidateAnswer = z.infer<typeof candidateAnswerSchema>
export type CandidateResultInput = z.infer<typeof candidateResultSchema>
