import { describe, expect, it } from 'vitest'
import { groupIntoSheets, type SheetQuestion } from '~/utils/examSheets'

function question(
  id: string,
  sources: SheetQuestion['sources'],
  outdatedRules = false,
): SheetQuestion {
  return {
    id,
    type: 'open-ended',
    content: { pl: { stem: id }, en: { stem: id } },
    modelAnswer: { pl: '', en: '' },
    level: 'NA',
    status: 'draft',
    sources,
    outdatedRules,
    version: 1,
    createdBy: 'tester',
    createdAt: null,
    updatedAt: null,
  }
}

describe('groupIntoSheets', () => {
  it('orders a sheet by the original question numbers', () => {
    const [sheet] = groupIntoSheets([
      question('third', [{ exam: 'WP', year: 2025, no: 3 }]),
      question('first', [{ exam: 'WP', year: 2025, no: 1 }]),
    ])
    expect(sheet!.entries.map((e) => e.question.id)).toEqual(['first', 'third'])
  })

  it('puts a question that came back in later years on every sheet it appeared on', () => {
    const sheets = groupIntoSheets([
      question('repeat', [
        { exam: 'WP', year: 2023, no: 4 },
        { exam: 'WP', year: 2025, no: 2 },
      ]),
    ])
    expect(sheets.map((s) => `${s.exam} ${s.year}`)).toEqual(['WP 2025', 'WP 2023'])
  })

  it('leaves out collections of loose questions, which were never a sheet', () => {
    const sheets = groupIntoSheets([question('loose', [{ exam: 'WP-luzne', year: 2022, no: 7 }])])
    expect(sheets).toEqual([])
  })

  it('counts the questions answered under superseded rules', () => {
    const [sheet] = groupIntoSheets([
      question('old', [{ exam: 'WP', year: 2017, no: 1 }], true),
      question('current', [{ exam: 'WP', year: 2017, no: 2 }]),
    ])
    expect(sheet!.outdatedCount).toBe(1)
  })
})
