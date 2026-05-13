import type { Bilingual, Level, Question } from './question.js'

export type ExamStatus = 'draft' | 'published' | 'archived'

export type ExamLanguage = 'pl' | 'en' | 'both'

export interface Exam {
  title: Bilingual<string>
  description: Bilingual<string>
  questionIds: string[]
  durationMinutes: number
  passThresholdPercent: number
  maxAttempts: number
  level: Level
  language: ExamLanguage
  status: ExamStatus
  availableFrom: unknown
  availableTo: unknown
  createdBy: string
  createdAt: unknown
  updatedAt: unknown
  publishedAt: unknown | null
}

export interface ExamSnapshot {
  publishedAt: unknown
  questions: Question[]
}
