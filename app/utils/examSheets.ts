import type { Question } from '~~/shared/types/question'

export type SheetQuestion = Question & { id: string }

/**
 * Source codes that do not stand for an exam paper.
 *
 * `WP-luzne` collects the loose questions from `luzne_pytania_wp_*.pdf` — question sets that were
 * never sat as a sheet, so they have no meaningful numbering to reconstruct. A deny-list rather
 * than an allow-list, so a genuinely new exam shows up on its own after an import.
 */
export const NON_EXAM_SOURCES = new Set(['WP-luzne'])

/** One reconstructed exam sheet: every question that carries a `sources` entry for it. */
export interface ExamSheet {
  exam: string
  year: number
  /** Questions in the order they were printed on the original sheet. */
  entries: { no: number; question: SheetQuestion }[]
  /** How many of them answer according to rules that no longer apply. */
  outdatedCount: number
}

/**
 * Regroups questions by the exams they came from — the single place that turns `sources` into
 * sheets, used both by the exam archive and by the exam generator when it opens an archived exam.
 * Sheets are ordered newest first, entries by their number on the original sheet.
 */
export function groupIntoSheets(questions: SheetQuestion[]): ExamSheet[] {
  const grouped = new Map<string, ExamSheet>()
  for (const question of questions) {
    for (const source of question.sources ?? []) {
      if (NON_EXAM_SOURCES.has(source.exam)) continue
      const key = `${source.exam}::${source.year}`
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
  return [...grouped.values()].sort((a, b) => b.year - a.year || a.exam.localeCompare(b.exam))
}
