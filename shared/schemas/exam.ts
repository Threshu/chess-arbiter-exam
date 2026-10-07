import { z } from 'zod'

/**
 * Egzamin zapisany w generatorze — kolekcja `exams`, dostepna wylacznie dla admina, bo moze
 * zawierac klucz odpowiedzi.
 *
 * Pola odpowiadaja 1:1 stanowi generatora (`ExamGeneratorState`), zeby wczytanie egzaminu bylo
 * zwyklym przepisaniem wartosci. Pytania sa referencjami do kolekcji `questions` w kolejnosci
 * z arkusza; `overrides` to kopie edytowane "tylko w tym dokumencie", zapisywane razem z egzaminem.
 */
export const savedExamSchema = z.object({
  examTitle: z.string(),
  // Opcjonalne, bo dodane po pierwszych zapisanych egzaminach — przy wczytaniu dostaja domyslne.
  dateline: z.string().optional(),
  showCandidateTable: z.boolean().optional(),
  classOptions: z.string().optional(),
  language: z.enum(['pl', 'en']),
  headerHtml: z.string(),
  footerHtml: z.string(),
  selectedQuestionIds: z.array(z.string().min(1)),
  overrides: z.record(z.string(), z.unknown()),
  includeAnswerKey: z.boolean(),
  createdBy: z.string().min(1),
  createdAt: z.unknown(),
  updatedAt: z.unknown(),
})

export type SavedExamInput = z.infer<typeof savedExamSchema>
