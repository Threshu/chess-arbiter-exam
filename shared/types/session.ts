export type ExamSessionStatus =
  | 'created'
  | 'active'
  | 'completed'
  | 'scored'
  | 'expired'
  | 'invalidated'

export type ExamEventType =
  | 'tab_blur'
  | 'tab_focus'
  | 'fullscreen_exit'
  | 'fullscreen_enter'
  | 'copy_attempt'
  | 'paste_attempt'
  | 'context_menu_attempt'
  | 'devtools_open_suspected'
  | 'heartbeat_late'
  | 'network_offline'

export interface ExamSessionResult {
  correctCount: number
  totalCount: number
  percentage: number
  passed: boolean
}

export interface ExamClientMeta {
  userAgent: string
  locale: string
  ipHash: string
}

export interface ExamSession {
  userId: string
  examId: string
  examSnapshotVersion: string
  status: ExamSessionStatus
  startedAt: unknown
  expiresAt: unknown
  submittedAt: unknown | null
  scoredAt: unknown | null
  questionOrder: string[]
  optionOrders: Record<string, string[]>
  result: ExamSessionResult | null
  lastHeartbeatAt: unknown
  clientMeta: ExamClientMeta
  invalidationReason?: string
  invalidatedBy?: string
}

export interface Answer {
  selectedOptionId: string
  answeredAt: unknown
  clientTimeSpentMs?: number
}

export interface ExamEvent {
  type: ExamEventType
  timestamp: unknown
  metadata?: Record<string, unknown>
}
