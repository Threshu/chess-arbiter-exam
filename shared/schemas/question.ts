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

export const questionTypeSchema = z.enum(['text', 'image', 'fen', 'pgn'])
export const levelSchema = z.enum(['NA', 'FA', 'IA'])
export const questionStatusSchema = z.enum(['draft', 'published', 'archived'])

export const questionSchema = z.object({
  type: questionTypeSchema,
  content: questionContentSchema,
  mediaUrl: z.string().url().optional(),
  fen: z.string().optional(),
  pgn: z.string().optional(),
  options: z.array(questionOptionSchema).min(2).max(8),
  topic: z.string().min(1),
  level: levelSchema,
  status: questionStatusSchema,
  version: z.number().int().nonnegative(),
  createdBy: z.string().min(1),
  createdAt: z.unknown(),
  updatedAt: z.unknown(),
})

export type QuestionInput = z.infer<typeof questionSchema>
export type QuestionOptionInput = z.infer<typeof questionOptionSchema>
