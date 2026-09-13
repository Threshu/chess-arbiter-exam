import { getCurrentUser } from 'vuefire'
import { getIdTokenResult } from 'firebase/auth'
import { collection, getDocs, query, where, type Firestore } from 'firebase/firestore'
import type { Question } from '~~/shared/types/question'

export type ArchivedQuestion = Question & { id: string }

/** One reconstructed exam sheet: every question that carries a `sources` entry for it. */
export interface ExamSheet {
  exam: string
  year: number
  /** Questions in the order they were printed on the original sheet. */
  entries: { no: number; question: ArchivedQuestion }[]
  /** How many of them answer according to rules that no longer apply. */
  outdatedCount: number
}

function sheetId(exam: string, year: number) {
  return `${exam}::${year}`
}

/**
 * Reads the question bank and regroups it by the exams the questions came from.
 *
 * Firestore rules let an admin read every question but everyone else only the published ones, and
 * a query that could return a draft is rejected outright rather than filtered — hence the two
 * shapes of the query. For a student the archive therefore fills up as questions get published,
 * and sheets show gaps in the numbering until then.
 */
export function useExamArchive() {
  const { $firestore } = useNuxtApp()
  const firestore = $firestore as Firestore

  const sheets = ref<ExamSheet[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  /**
   * Resolved here rather than through `useAuth().isAdmin`, whose claims arrive from an async
   * watcher: reading it on mount is a race that would quietly narrow an admin's archive to the
   * published questions only.
   */
  async function isAdminNow() {
    const user = await getCurrentUser()
    if (!user) return false
    const token = await getIdTokenResult(user)
    return token.claims.role === 'admin'
  }

  async function load() {
    loading.value = true
    error.value = null
    try {
      const questions = collection(firestore, 'questions')
      const snap = await getDocs(
        (await isAdminNow())
          ? query(questions)
          : query(questions, where('status', '==', 'published')),
      )

      const grouped = new Map<string, ExamSheet>()
      for (const doc of snap.docs) {
        const question = { id: doc.id, ...(doc.data() as Question) }
        for (const source of question.sources ?? []) {
          const key = sheetId(source.exam, source.year)
          let sheet = grouped.get(key)
          if (!sheet) {
            sheet = { exam: source.exam, year: source.year, entries: [], outdatedCount: 0 }
            grouped.set(key, sheet)
          }
          sheet.entries.push({ no: source.no, question })
          if (question.outdatedRules) sheet.outdatedCount += 1
        }
      }

      for (const sheet of grouped.values()) sheet.entries.sort((a, b) => a.no - b.no)
      sheets.value = [...grouped.values()].sort(
        (a, b) => b.year - a.year || a.exam.localeCompare(b.exam),
      )
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : String(cause)
      sheets.value = []
    } finally {
      loading.value = false
    }
  }

  function findSheet(exam: string, year: number) {
    return sheets.value.find((s) => s.exam === exam && s.year === year) ?? null
  }

  return { sheets, loading, error, load, findSheet }
}
