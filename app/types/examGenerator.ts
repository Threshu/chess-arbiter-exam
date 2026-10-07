import type { Locale } from '~~/shared/types/user'
import type { Question } from '~~/shared/types/question'

/**
 * The instruction printed under the candidate table on the WP exam sheets (WP 2025), used as the
 * default text for every new exam.
 */
export const DEFAULT_EXAM_INSTRUCTION_HTML =
  '<p><em>Jeżeli w pytaniu pojawia się reklamacja zawodnika i brak jest informacji o ' +
  'wcześniejszych zgłoszeniach należy przyjąć, że opisywana-reklamowana sytuacja jest pierwszą ' +
  'sytuacją w trakcie trwania partii. Jeśli nie wskazano inaczej to należy wybrać jedną ' +
  'prawidłową odpowiedź.</em></p>'

/** The class choice on the WP (district-class) exam sheets. */
export const DEFAULT_CLASS_OPTIONS = 'młodzieżową, trzecią, drugą'

/** Draft state of the exam generator; saved exams store exactly these fields. */
export interface ExamGeneratorState {
  examTitle: string
  /** Place and date printed on the right of the title line, e.g. "Poznań, 20.09.2025 r.". */
  dateline: string
  language: Locale
  /** Candidate box under the title: name, and the class being sat if `classOptions` is set. */
  showCandidateTable: boolean
  /** Comma-separated classes offered in the candidate box; empty leaves the class row out. */
  classOptions: string
  /** Free text under the candidate box — on the WP sheets, the instruction for candidates. */
  headerHtml: string
  footerHtml: string
  selectedQuestionIds: string[]
  /** Edited copies, keyed by question id — used only when generating the DOCX. */
  overrides: Record<string, Question>
  includeAnswerKey: boolean
}

export function createExamGeneratorState(): ExamGeneratorState {
  return {
    examTitle: '',
    dateline: '',
    language: 'pl',
    showCandidateTable: true,
    classOptions: DEFAULT_CLASS_OPTIONS,
    headerHtml: DEFAULT_EXAM_INSTRUCTION_HTML,
    footerHtml: '',
    selectedQuestionIds: [],
    overrides: {},
    includeAnswerKey: false,
  }
}
