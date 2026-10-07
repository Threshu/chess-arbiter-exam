import { collection, getDocs, type Firestore } from 'firebase/firestore'
import type { Question } from '~~/shared/types/question'
import { groupIntoSheets, type ExamSheet } from '~/utils/examSheets'

export type { ExamSheet } from '~/utils/examSheets'

/**
 * Reads the question bank and regroups it by the exams the questions came from.
 *
 * Admin-only: the pages using this sit behind the `admin` middleware, and Firestore rules let an
 * admin read drafts as well as published questions, so the archive shows every imported sheet
 * whatever its review status. The grouping itself lives in `groupIntoSheets`, shared with the
 * exam generator.
 */
export function useExamArchive() {
  const { $firestore } = useNuxtApp()
  const firestore = $firestore as Firestore

  const sheets = ref<ExamSheet[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      const snap = await getDocs(collection(firestore, 'questions'))
      sheets.value = groupIntoSheets(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Question) })),
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
