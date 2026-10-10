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
} from 'firebase/firestore'
import type { Question } from '~~/shared/types/question'
import type { CandidateAnswer, CandidateLevel, SessionQuestion } from '~~/shared/schemas/results'
import { DEFAULT_PASS_THRESHOLDS } from '~/utils/examScoring'
import type { CandidateResult, ExamSession } from '~/utils/examResults'

const OPTION_LETTERS = 'abcdefgh'.split('')
const STEM_PREVIEW = 90

function preview(stem: string) {
  const flat = stem.replace(/\s+/g, ' ').trim()
  return flat.length > STEM_PREVIEW ? `${flat.slice(0, STEM_PREVIEW - 1)}…` : flat
}

/**
 * Results of exams that were actually held — the admin-only `examSessions` collection with a
 * `results` subcollection, one document per candidate.
 */
export function useExamResults() {
  const { $firestore } = useNuxtApp()
  const { user } = useAuth()
  const firestore = $firestore as Firestore
  const sessions = collection(firestore, 'examSessions')

  function toSession(id: string, data: Record<string, unknown>): ExamSession {
    return {
      id,
      name: String(data.name ?? ''),
      date: String(data.date ?? ''),
      examId: String(data.examId ?? ''),
      questions: (data.questions as SessionQuestion[]) ?? [],
      passThresholds: (data.passThresholds as ExamSession['passThresholds']) ?? [],
    }
  }

  async function listSessions(): Promise<ExamSession[]> {
    const snap = await getDocs(query(sessions, orderBy('date', 'desc')))
    return snap.docs.map((d) => toSession(d.id, d.data()))
  }

  async function loadSession(id: string): Promise<ExamSession | null> {
    const snap = await getDoc(doc(sessions, id))
    return snap.exists() ? toSession(snap.id, snap.data()) : null
  }

  async function loadResults(sessionId: string): Promise<CandidateResult[]> {
    const snap = await getDocs(collection(sessions, sessionId, 'results'))
    return snap.docs
      .map((d) => {
        const data = d.data()
        return {
          id: d.id,
          candidate: String(data.candidate ?? ''),
          level: (data.level as CandidateLevel) ?? 'III',
          answers: (data.answers as Record<string, CandidateAnswer>) ?? {},
        }
      })
      .sort((a, b) => a.candidate.localeCompare(b.candidate, 'pl'))
  }

  /**
   * Starts a session from a saved exam, copying its questions as they are today: numbers, types,
   * correct letters, points and classes, plus the pass marks.
   */
  async function createSession(examId: string, name: string, date: string): Promise<string> {
    const examSnap = await getDoc(doc(firestore, 'exams', examId))
    if (!examSnap.exists()) throw new Error(`Exam ${examId} not found`)
    const exam = examSnap.data()
    const ids = (exam.selectedQuestionIds as string[]) ?? []
    const overrides = (exam.overrides as Record<string, Question>) ?? {}
    const points = (exam.points as Record<string, number>) ?? {}

    const questions: SessionQuestion[] = []
    for (const [index, id] of ids.entries()) {
      const stored = overrides[id] ?? (await getDoc(doc(firestore, 'questions', id))).data()
      if (!stored) continue
      const question = stored as Question
      const closed = question.type !== 'open-ended'
      questions.push({
        questionId: id,
        no: index + 1,
        type: question.type,
        level: question.level,
        points: points[id] ?? question.points ?? 1,
        correct: closed
          ? question.options.flatMap((o, i) => (o.isCorrect ? [OPTION_LETTERS[i]!] : []))
          : [],
        optionCount: closed ? question.options.length : 0,
        stem: preview(question.content.pl.stem),
      })
    }

    const ref = await addDoc(sessions, {
      name,
      date,
      examId,
      questions,
      passThresholds: exam.passThresholds ?? DEFAULT_PASS_THRESHOLDS,
      createdBy: user.value?.uid ?? 'unknown',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  }

  async function updateSession(id: string, fields: Partial<Pick<ExamSession, 'name' | 'date'>>) {
    await updateDoc(doc(sessions, id), { ...fields, updatedAt: serverTimestamp() })
  }

  async function deleteSession(id: string) {
    for (const r of (await getDocs(collection(sessions, id, 'results'))).docs)
      await deleteDoc(r.ref)
    await deleteDoc(doc(sessions, id))
  }

  /** Saves a candidate's sheet; creates it when `resultId` is not given. Returns its id. */
  async function saveResult(
    sessionId: string,
    result: Omit<CandidateResult, 'id'>,
    resultId?: string | null,
  ): Promise<string> {
    // JSON round trip drops `undefined` fields (an empty note), which a Firestore write rejects.
    const answers = JSON.parse(JSON.stringify(result.answers))
    const fields = {
      candidate: result.candidate.trim().toUpperCase(),
      level: result.level,
      answers,
    }
    const results = collection(sessions, sessionId, 'results')
    if (resultId) {
      await updateDoc(doc(results, resultId), { ...fields, updatedAt: serverTimestamp() })
      return resultId
    }
    const ref = await addDoc(results, {
      ...fields,
      createdBy: user.value?.uid ?? 'unknown',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  }

  async function deleteResult(sessionId: string, resultId: string) {
    await deleteDoc(doc(sessions, sessionId, 'results', resultId))
  }

  return {
    listSessions,
    loadSession,
    loadResults,
    createSession,
    updateSession,
    deleteSession,
    saveResult,
    deleteResult,
  }
}
