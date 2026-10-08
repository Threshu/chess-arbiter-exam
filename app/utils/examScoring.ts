import { levelWithin, type Level } from '~~/shared/constants'
import type { Question } from '~~/shared/types/question'

/** A pass mark: the share of the points available to candidates for a class, in percent. */
export interface PassThreshold {
  level: Level
  percent: number
}

/** The pass marks used for the district-class exams (ZP): 80% for class III, 85% for class II. */
export const DEFAULT_PASS_THRESHOLDS: PassThreshold[] = [
  { level: 'III', percent: 80 },
  { level: 'II', percent: 85 },
]

export interface ClassScoring extends PassThreshold {
  /** Points available on this class's exam. */
  max: number
  /** The least score that passes. */
  required: number
  /** 1-based numbers of the questions that belong to a higher class and do not count here. */
  excluded: number[]
}

/** Points for a question on this exam: the exam's own setting, else the question's, else 1. */
export function questionPoints(
  id: string,
  question: Pick<Question, 'points'> | undefined,
  examPoints: Record<string, number>,
): number {
  return examPoints[id] ?? question?.points ?? 1
}

/**
 * Points available and the pass mark for each class. A class's exam covers only the questions of
 * that class and the ones below it, so a task meant for class II is left out of class III's total.
 */
export function scoreExam(
  ids: string[],
  resolve: (id: string) => Pick<Question, 'points' | 'level'> | undefined,
  examPoints: Record<string, number>,
  thresholds: PassThreshold[],
): ClassScoring[] {
  return thresholds.map((threshold) => {
    let max = 0
    const excluded: number[] = []
    ids.forEach((id, index) => {
      const question = resolve(id)
      if (!question) return
      if (levelWithin(question.level, threshold.level)) {
        max += questionPoints(id, question, examPoints)
      } else {
        excluded.push(index + 1)
      }
    })
    // Rounded up: a pass mark of 80% of 28 points (22.4) needs 23 points. The epsilon keeps an
    // exact result such as 85% of 20 = 17 from being lifted to 18 by floating-point error.
    const required = Math.ceil((max * threshold.percent) / 100 - 1e-9)
    return { ...threshold, max, required, excluded }
  })
}
