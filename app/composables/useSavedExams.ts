import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore'
import { createExamGeneratorState, type ExamGeneratorState } from '~/types/examGenerator'

export interface SavedExamSummary {
  id: string
  examTitle: string
  questionCount: number
  updatedAt: Date | null
}

function toStored(state: ExamGeneratorState): ExamGeneratorState {
  return {
    examTitle: state.examTitle,
    dateline: state.dateline,
    showCandidateTable: state.showCandidateTable,
    classOptions: state.classOptions,
    language: state.language,
    headerHtml: state.headerHtml,
    footerHtml: state.footerHtml,
    selectedQuestionIds: [...state.selectedQuestionIds],
    // Edited copies come from Firestore rows: they carry Timestamps and may hold undefined fields,
    // which a write rejects. The DOCX generator only needs the question content, so a JSON round
    // trip gives a clean, storable copy.
    overrides: JSON.parse(JSON.stringify(state.overrides)),
    includeAnswerKey: state.includeAnswerKey,
  }
}

/** Saved exams of the exam generator — the admin-only `exams` collection. */
export function useSavedExams() {
  const { $firestore } = useNuxtApp()
  const { user } = useAuth()
  const firestore = $firestore as Firestore
  const exams = collection(firestore, 'exams')

  async function list(): Promise<SavedExamSummary[]> {
    const snap = await getDocs(query(exams, orderBy('updatedAt', 'desc')))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        examTitle: (data.examTitle as string) ?? '',
        questionCount: ((data.selectedQuestionIds as string[] | undefined) ?? []).length,
        updatedAt: (data.updatedAt as Timestamp | undefined)?.toDate() ?? null,
      }
    })
  }

  async function load(id: string): Promise<ExamGeneratorState | null> {
    const snap = await getDoc(doc(exams, id))
    if (!snap.exists()) return null
    const data = snap.data()
    // Exams saved before a field existed get the same defaults as a new exam.
    const defaults = createExamGeneratorState()
    return {
      examTitle: data.examTitle ?? '',
      dateline: data.dateline ?? defaults.dateline,
      showCandidateTable: data.showCandidateTable ?? defaults.showCandidateTable,
      classOptions: data.classOptions ?? defaults.classOptions,
      language: data.language === 'en' ? 'en' : 'pl',
      headerHtml: data.headerHtml ?? '',
      footerHtml: data.footerHtml ?? '',
      selectedQuestionIds: data.selectedQuestionIds ?? [],
      overrides: data.overrides ?? {},
      includeAnswerKey: data.includeAnswerKey ?? false,
    }
  }

  /** Updates the exam when `id` is given, otherwise creates a new one. Returns the exam id. */
  async function save(state: ExamGeneratorState, id?: string | null): Promise<string> {
    const fields = toStored(state)
    if (id) {
      await updateDoc(doc(exams, id), { ...fields, updatedAt: serverTimestamp() })
      return id
    }
    const ref = await addDoc(exams, {
      ...fields,
      createdBy: user.value?.uid ?? 'unknown',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  }

  async function remove(id: string) {
    await deleteDoc(doc(exams, id))
  }

  return { list, load, save, remove }
}
