export type QuestionTypeId = 'single-choice' | 'multi-choice' | 'open-ended'

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

export type Diagram = { kind: 'fen'; fen: string } | { kind: 'pgn'; pgn: string }

interface QuestionBase {
  content: Bilingual<QuestionContentPart>
  diagram?: Diagram
  level: Level
  status: QuestionStatus
  version: number
  createdBy: string
  createdAt: unknown
  updatedAt: unknown
}

export interface SingleChoiceQuestion extends QuestionBase {
  type: 'single-choice'
  options: QuestionOption[]
}

export interface MultiChoiceQuestion extends QuestionBase {
  type: 'multi-choice'
  options: QuestionOption[]
}

export interface OpenEndedQuestion extends QuestionBase {
  type: 'open-ended'
  modelAnswer: Bilingual<string>
}

export type Question = SingleChoiceQuestion | MultiChoiceQuestion | OpenEndedQuestion

export type ClosedQuestion = SingleChoiceQuestion | MultiChoiceQuestion

export function isClosedQuestion(q: Question): q is ClosedQuestion {
  return q.type === 'single-choice' || q.type === 'multi-choice'
}
