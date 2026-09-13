import { collection, getDocs, type Firestore } from 'firebase/firestore'
import type { Question } from '~~/shared/types/question'

export type ArchivedQuestion = Question & { id: string }

/**
 * Source codes that do not stand for an exam paper.
 *
 * `WP-luzne` collects the loose questions from `luzne_pytania_wp_*.pdf` — question sets that were
 * never sat as a sheet, so they have no meaningful numbering to reconstruct. A deny-list rather
 * than an allow-list, so a genuinely new exam shows up on its own after an import.
 */
const NON_EXAM_SOURCES = new Set(['WP-luzne'])

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
 * Admin-only: the pages using this sit behind the `admin` middleware, and Firestore rules let an
 * admin read drafts as well as published questions, so the archive shows every imported sheet
 * whatever its review status.
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

      const grouped = new Map<string, ExamSheet>()
      for (const doc of snap.docs) {
        const question = { id: doc.id, ...(doc.data() as Question) }
        for (const source of question.sources ?? []) {
          if (NON_EXAM_SOURCES.has(source.exam)) continue
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
