import type { Locale } from '~~/shared/types/user'
import type { Question } from '~~/shared/types/question'

/** Client-only draft state for the exam generator — never persisted to Firestore. */
export interface ExamGeneratorState {
  examTitle: string
  language: Locale
  headerHtml: string
  footerHtml: string
  selectedQuestionIds: string[]
  /** Session-only edited copies, keyed by question id — used only when generating the DOCX. */
  overrides: Record<string, Question>
  includeAnswerKey: boolean
}

export function createExamGeneratorState(): ExamGeneratorState {
  return {
    examTitle: '',
    language: 'pl',
    headerHtml: '',
    footerHtml: '',
    selectedQuestionIds: [],
    overrides: {},
    includeAnswerKey: false,
  }
}
