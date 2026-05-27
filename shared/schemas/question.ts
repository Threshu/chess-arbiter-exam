import { z } from 'zod'

export const bilingualStringSchema = z.object({
  pl: z.string(),
  en: z.string(),
})

export const questionContentPartSchema = z.object({
  stem: z.string().min(1),
  explanation: z.string().optional(),
})

export const questionContentSchema = z.object({
  pl: questionContentPartSchema,
  en: questionContentPartSchema,
})

export const questionOptionSchema = z.object({
  id: z.string().min(1),
  content: bilingualStringSchema,
  isCorrect: z.boolean(),
})

export const diagramSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('fen'), fen: z.string().min(1) }),
  z.object({ kind: z.literal('pgn'), pgn: z.string().min(1) }),
])

export const levelSchema = z.enum(['NA', 'FA', 'IA'])
export const questionStatusSchema = z.enum(['draft', 'published', 'archived'])

const baseShape = {
  content: questionContentSchema,
  diagram: diagramSchema.optional(),
  level: levelSchema,
  status: questionStatusSchema,
  version: z.number().int().nonnegative(),
  createdBy: z.string().min(1),
  createdAt: z.unknown(),
  updatedAt: z.unknown(),
} as const

export const singleChoiceQuestionSchema = z
  .object({
    type: z.literal('single-choice'),
    options: z.array(questionOptionSchema).min(2).max(8),
    ...baseShape,
  })
  .refine((q) => q.options.filter((o) => o.isCorrect).length === 1, {
    message: 'Single-choice question must have exactly one correct option',
    path: ['options'],
  })

export const multiChoiceQuestionSchema = z
  .object({
    type: z.literal('multi-choice'),
    options: z.array(questionOptionSchema).min(2).max(8),
    ...baseShape,
  })
  .refine((q) => q.options.some((o) => o.isCorrect), {
    message: 'Multi-choice question must have at least one correct option',
    path: ['options'],
  })

export const openEndedQuestionSchema = z.object({
  type: z.literal('open-ended'),
  modelAnswer: bilingualStringSchema,
  ...baseShape,
})

export const questionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('single-choice'),
    options: z.array(questionOptionSchema).min(2).max(8),
    ...baseShape,
  }),
  z.object({
    type: z.literal('multi-choice'),
    options: z.array(questionOptionSchema).min(2).max(8),
    ...baseShape,
  }),
  openEndedQuestionSchema,
])

export type QuestionInput = z.infer<typeof questionSchema>
export type SingleChoiceInput = z.infer<typeof singleChoiceQuestionSchema>
export type MultiChoiceInput = z.infer<typeof multiChoiceQuestionSchema>
export type OpenEndedInput = z.infer<typeof openEndedQuestionSchema>
export type QuestionOptionInput = z.infer<typeof questionOptionSchema>
