import { levelWithin, type Level } from '~~/shared/constants'
import type { PassThreshold } from '~/utils/examScoring'
import type { CandidateAnswer, CandidateLevel, SessionQuestion } from '~~/shared/schemas/results'

export interface ExamSession {
  id: string
  name: string
  date: string
  examId: string
  questions: SessionQuestion[]
  passThresholds: PassThreshold[]
}

export interface CandidateResult {
  id: string
  candidate: string
  level: CandidateLevel
  answers: Record<string, CandidateAnswer>
}

/**
 * The class whose question set and pass mark a candidate is marked against. The youth class sits the
 * same district exam as class III, with the same pass mark.
 */
export function markingLevel(level: CandidateLevel): Level {
  return level === 'youth' ? 'III' : level
}

/** Full points for exactly the correct letters, nothing otherwise — partial answers score 0. */
export function autoPoints(question: SessionQuestion, choice: string[]): number {
  if (question.type === 'open-ended' || !choice.length) return 0
  const given = [...new Set(choice)].sort().join(',')
  return given === [...question.correct].sort().join(',') ? question.points : 0
}

export interface CandidateScore {
  total: number
  max: number
  percent: number
  /** Pass mark in points, or null when the exam sets none for the candidate's class. */
  required: number | null
  passed: boolean | null
}

/** Score on the questions of the candidate's class and below, against that class's pass mark. */
export function candidateScore(session: ExamSession, result: CandidateResult): CandidateScore {
  const level = markingLevel(result.level)
  let total = 0
  let max = 0
  for (const q of session.questions) {
    if (!levelWithin(q.level, level)) continue
    max += q.points
    total += result.answers[q.questionId]?.points ?? 0
  }
  const threshold = session.passThresholds.find((t) => t.level === level)
  const required = threshold ? Math.ceil((max * threshold.percent) / 100 - 1e-9) : null
  return {
    total,
    max,
    percent: max ? (total / max) * 100 : 0,
    required,
    passed: required === null ? null : total >= required,
  }
}

export interface QuestionStats {
  question: SessionQuestion
  /** Candidates who sat this question (its class is within theirs). */
  attempts: number
  /** Average share of the question's points, 0–1. */
  average: number
  /** Candidates with full points. */
  full: number
  /** How often each letter was chosen (closed questions). */
  letters: Record<string, number>
}

export function questionStats(session: ExamSession, results: CandidateResult[]): QuestionStats[] {
  return session.questions.map((question) => {
    const takers = results.filter((r) => levelWithin(question.level, markingLevel(r.level)))
    const letters: Record<string, number> = {}
    let points = 0
    let full = 0
    for (const r of takers) {
      const answer = r.answers[question.questionId]
      points += answer?.points ?? 0
      if ((answer?.points ?? 0) >= question.points) full++
      for (const letter of answer?.choice ?? []) letters[letter] = (letters[letter] ?? 0) + 1
    }
    return {
      question,
      attempts: takers.length,
      average: takers.length ? points / (takers.length * question.points) : 0,
      full,
      letters,
    }
  })
}

export interface SessionSummary {
  candidates: number
  averagePercent: number
  passed: number
  /** Candidates with a pass mark set for their class. */
  graded: number
}

export function sessionSummary(session: ExamSession, results: CandidateResult[]): SessionSummary {
  const scores = results.map((r) => candidateScore(session, r))
  const graded = scores.filter((s) => s.passed !== null)
  return {
    candidates: results.length,
    averagePercent: scores.length ? scores.reduce((a, s) => a + s.percent, 0) / scores.length : 0,
    passed: graded.filter((s) => s.passed).length,
    graded: graded.length,
  }
}

export interface QuestionAcrossSessions {
  questionId: string
  stem: string
  /** Per session (same order as given): average share of points, or null if not on that exam. */
  averages: (number | null)[]
}

/** The same bank question on different exams, for questions that appeared on at least two. */
export function questionsAcrossSessions(
  sessions: { session: ExamSession; results: CandidateResult[] }[],
): QuestionAcrossSessions[] {
  const byQuestion = new Map<string, QuestionAcrossSessions>()
  sessions.forEach(({ session, results }, index) => {
    for (const stat of questionStats(session, results)) {
      const id = stat.question.questionId
      const row = byQuestion.get(id) ?? {
        questionId: id,
        stem: stat.question.stem,
        averages: sessions.map(() => null),
      }
      row.averages[index] = stat.attempts ? stat.average : null
      byQuestion.set(id, row)
    }
  })
  return [...byQuestion.values()].filter((r) => r.averages.filter((a) => a !== null).length >= 2)
}

const LEVEL_SHORT: Record<CandidateLevel, string> = { youth: 'M', III: '3', II: '2' }

export function levelShort(level: CandidateLevel): string {
  return LEVEL_SHORT[level]
}

/** Parses the M / 3 / 2 shorthand used on the sheets. */
export function parseLevelShort(value: string): CandidateLevel | null {
  const v = value.trim().toUpperCase()
  if (v === 'M') return 'youth'
  if (v === '3' || v === 'III') return 'III'
  if (v === '2' || v === 'II') return 'II'
  return null
}

function csvCell(value: string | number): string {
  const text = typeof value === 'number' ? String(value).replace('.', ',') : value
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/**
 * The results as CSV for Excel: semicolons and decimal commas as a Polish Excel expects, with a BOM
 * so it reads the file as UTF-8. One row per candidate, one column per question (points).
 */
export function resultsCsv(session: ExamSession, results: CandidateResult[]): string {
  const header = [
    'Kandydat',
    'Klasa',
    ...session.questions.map((q) => `P${q.no}`),
    'Suma',
    'Maks.',
    'Procent',
    'Wynik',
  ]
  const rows = results.map((r) => {
    const score = candidateScore(session, r)
    return [
      r.candidate,
      levelShort(r.level),
      ...session.questions.map((q) =>
        levelWithin(q.level, markingLevel(r.level)) ? (r.answers[q.questionId]?.points ?? 0) : '',
      ),
      score.total,
      score.max,
      Math.round(score.percent * 10) / 10,
      score.passed === null ? '' : score.passed ? 'zdał' : 'nie zdał',
    ]
  })
  return '﻿' + [header, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n')
}
