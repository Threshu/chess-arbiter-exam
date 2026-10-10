import { describe, expect, it } from 'vitest'
import {
  autoPoints,
  candidateScore,
  parseLevelShort,
  questionStats,
  questionsAcrossSessions,
  resultsCsv,
  sessionSummary,
  type CandidateResult,
  type ExamSession,
} from '~/utils/examResults'
import type { SessionQuestion } from '~~/shared/schemas/results'

function q(no: number, extra: Partial<SessionQuestion> = {}): SessionQuestion {
  return {
    questionId: `q${no}`,
    no,
    type: 'single-choice',
    level: 'III',
    points: 1,
    correct: ['a'],
    optionCount: 3,
    stem: `Pytanie ${no}`,
    ...extra,
  }
}

const session: ExamSession = {
  id: 's1',
  name: 'WP 2026',
  date: '2026-10-10',
  examId: 'e1',
  questions: [
    q(1),
    q(2, { type: 'multi-choice', correct: ['a', 'c'] }),
    q(3, { type: 'open-ended', correct: [], optionCount: 0 }),
    q(4, { type: 'open-ended', correct: [], optionCount: 0, level: 'II', points: 2 }),
  ],
  passThresholds: [
    { level: 'III', percent: 75 },
    { level: 'II', percent: 80 },
  ],
}

function result(id: string, level: CandidateResult['level'], points: number[]): CandidateResult {
  return {
    id,
    candidate: id,
    level,
    answers: Object.fromEntries(points.map((p, i) => [`q${i + 1}`, { points: p }])),
  }
}

describe('autoPoints', () => {
  it('gives full points only for exactly the correct letters', () => {
    const multi = session.questions[1]!
    expect(autoPoints(multi, ['c', 'a'])).toBe(1)
    expect(autoPoints(multi, ['a'])).toBe(0)
    expect(autoPoints(multi, ['a', 'b', 'c'])).toBe(0)
    expect(autoPoints(session.questions[0]!, [])).toBe(0)
  })
})

describe('candidateScore', () => {
  it('marks class III and youth on the class III questions and pass mark only', () => {
    // max 3 (q1–q3), 75% → 2.25 → 3 needed
    expect(candidateScore(session, result('A', 'III', [1, 1, 0.5, 2]))).toMatchObject({
      total: 2.5,
      max: 3,
      required: 3,
      passed: false,
    })
    expect(candidateScore(session, result('B', 'youth', [1, 1, 1]))).toMatchObject({
      max: 3,
      passed: true,
    })
  })

  it('marks class II on every question, against its own pass mark', () => {
    // max 5, 80% → 4 needed
    expect(candidateScore(session, result('C', 'II', [1, 1, 0, 2]))).toMatchObject({
      total: 4,
      max: 5,
      required: 4,
      passed: true,
    })
  })
})

describe('questionStats and summaries', () => {
  const results = [result('A', 'III', [1, 0, 1]), result('B', 'II', [0, 1, 0.5, 1])]

  it('counts only the candidates who sat a question', () => {
    const stats = questionStats(session, results)
    expect(stats[3]).toMatchObject({ attempts: 1, average: 0.5, full: 0 })
    expect(stats[2]).toMatchObject({ attempts: 2, average: 0.75, full: 1 })
  })

  it('tallies the letters chosen', () => {
    const withChoice = [
      { ...results[0]!, answers: { q1: { points: 0, choice: ['b'] } } },
      { ...results[1]!, answers: { q1: { points: 1, choice: ['a'] } } },
    ]
    expect(questionStats(session, withChoice)[0]!.letters).toEqual({ a: 1, b: 1 })
  })

  it('summarises a session', () => {
    expect(sessionSummary(session, results)).toMatchObject({ candidates: 2, graded: 2, passed: 0 })
  })

  it('compares a question that appeared on two exams', () => {
    const rows = questionsAcrossSessions([
      { session, results },
      { session: { ...session, id: 's2' }, results: [result('C', 'III', [1])] },
    ])
    expect(rows.find((r) => r.questionId === 'q1')!.averages).toEqual([0.5, 1])
  })
})

describe('parseLevelShort and resultsCsv', () => {
  it('reads the M / 3 / 2 shorthand', () => {
    expect(parseLevelShort('m')).toBe('youth')
    expect(parseLevelShort('3')).toBe('III')
    expect(parseLevelShort('2')).toBe('II')
    expect(parseLevelShort('x')).toBeNull()
  })

  it('writes semicolon CSV with decimal commas, leaving out questions above the class', () => {
    const csv = resultsCsv(session, [result('A', 'III', [1, 0, 0.5, 2])])
    const [header, row] = csv.replace('﻿', '').split('\r\n')
    expect(header).toBe('Kandydat;Klasa;P1;P2;P3;P4;Suma;Maks.;Procent;Wynik')
    expect(row).toBe('A;3;1;0;0,5;;1,5;3;50;nie zdał')
  })
})
