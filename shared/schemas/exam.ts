import { z } from 'zod'
import { bilingualStringSchema, levelSchema, questionSchema } from './question.js'

export const examStatusSchema = z.enum(['draft', 'published', 'archived'])
export const examLanguageSchema = z.enum(['pl', 'en', 'both'])

export const examSchema = z.object({
  title: bilingualStringSchema,
  description: bilingualStringSchema,
  questionIds: z.array(z.string().min(1)).min(1).max(200),
  durationMinutes: z.number().int().positive(),
  passThresholdPercent: z.number().min(0).max(100),
  maxAttempts: z.number().int().positive(),
  level: levelSchema,
  language: examLanguageSchema,
  status: examStatusSchema,
  availableFrom: z.unknown(),
  availableTo: z.unknown(),
  createdBy: z.string().min(1),
  createdAt: z.unknown(),
  updatedAt: z.unknown(),
  publishedAt: z.unknown().nullable(),
})

export const examSnapshotSchema = z.object({
  publishedAt: z.unknown(),
  questions: z.array(questionSchema),
})

export type ExamInput = z.infer<typeof examSchema>
export type ExamSnapshotInput = z.infer<typeof examSnapshotSchema>
