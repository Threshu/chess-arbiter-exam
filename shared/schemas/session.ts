import { z } from 'zod'

export const examSessionStatusSchema = z.enum([
  'created',
  'active',
  'completed',
  'scored',
  'expired',
  'invalidated',
])

export const examEventTypeSchema = z.enum([
  'tab_blur',
  'tab_focus',
  'fullscreen_exit',
  'fullscreen_enter',
  'copy_attempt',
  'paste_attempt',
  'context_menu_attempt',
  'devtools_open_suspected',
  'heartbeat_late',
  'network_offline',
])

export const examSessionResultSchema = z.object({
  correctCount: z.number().int().nonnegative(),
  totalCount: z.number().int().positive(),
  percentage: z.number().min(0).max(100),
  passed: z.boolean(),
})

export const examClientMetaSchema = z.object({
  userAgent: z.string(),
  locale: z.string(),
  ipHash: z.string(),
})

export const examSessionSchema = z.object({
  userId: z.string().min(1),
  examId: z.string().min(1),
  examSnapshotVersion: z.string().min(1),
  status: examSessionStatusSchema,
  startedAt: z.unknown(),
  expiresAt: z.unknown(),
  submittedAt: z.unknown().nullable(),
  scoredAt: z.unknown().nullable(),
  questionOrder: z.array(z.string()),
  optionOrders: z.record(z.string(), z.array(z.string())),
  result: examSessionResultSchema.nullable(),
  lastHeartbeatAt: z.unknown(),
  clientMeta: examClientMetaSchema,
  invalidationReason: z.string().optional(),
  invalidatedBy: z.string().optional(),
})

export const answerSchema = z.object({
  selectedOptionId: z.string().min(1),
  answeredAt: z.unknown(),
  clientTimeSpentMs: z.number().nonnegative().optional(),
})

export const examEventSchema = z.object({
  type: examEventTypeSchema,
  timestamp: z.unknown(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type ExamSessionInput = z.infer<typeof examSessionSchema>
export type AnswerInput = z.infer<typeof answerSchema>
export type ExamEventInput = z.infer<typeof examEventSchema>
