export type QuestionType = 'text' | 'image' | 'fen' | 'pgn'

export type Level = 'NA' | 'FA' | 'IA'

export type QuestionStatus = 'draft' | 'published' | 'archived'

export interface Bilingual<T> {
  pl: T
  en: T
}

export interface QuestionContentPart {
  stem: string
  explanation?: string
}

export interface QuestionOption {
  id: string
  content: Bilingual<string>
  isCorrect: boolean
}

export interface Question {
  type: QuestionType
  content: Bilingual<QuestionContentPart>
  mediaUrl?: string
  fen?: string
  pgn?: string
  options: QuestionOption[]
  topic: string
  level: Level
  status: QuestionStatus
  version: number
  createdBy: string
  createdAt: unknown
  updatedAt: unknown
}
