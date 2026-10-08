import { describe, expect, it } from 'vitest'
import { questionPoints, scoreExam } from '~/utils/examScoring'
import { levelWithin } from '~~/shared/constants'

describe('levelWithin', () => {
  it('puts a question in the exams of its own class and every class above it', () => {
    expect(levelWithin('III', 'III')).toBe(true)
    expect(levelWithin('youth', 'II')).toBe(true)
    expect(levelWithin('II', 'III')).toBe(false)
    expect(levelWithin('national', 'FA')).toBe(true)
  })
})

describe('questionPoints', () => {
  it("prefers the exam's own setting, then the question's points, then 1", () => {
    expect(questionPoints('a', { points: 2 }, { a: 3 })).toBe(3)
    expect(questionPoints('a', { points: 2 }, {})).toBe(2)
    expect(questionPoints('a', {}, {})).toBe(1)
  })
})

describe('scoreExam', () => {
  const bank: Record<string, { level: 'III' | 'II'; points?: number }> = {
    q1: { level: 'III' },
    q2: { level: 'III' },
    calc: { level: 'II', points: 2 },
  }
  const ids = ['q1', 'q2', 'calc']
  const resolve = (id: string) => bank[id]

  it('leaves a higher-class task out of a lower class total and lists its number', () => {
    const [iii, ii] = scoreExam(ids, resolve, {}, [
      { level: 'III', percent: 80 },
      { level: 'II', percent: 85 },
    ])
    expect(iii).toMatchObject({ max: 2, excluded: [3] })
    expect(ii).toMatchObject({ max: 4, excluded: [] })
  })

  it('rounds the pass mark up, but not an exact result', () => {
    const many = Array.from({ length: 28 }, (_, i) => `q${i}`)
    const [s] = scoreExam(many, () => ({ level: 'III' }), {}, [{ level: 'III', percent: 80 }])
    expect(s!.required).toBe(23) // 22.4 → 23
    const twenty = many.slice(0, 20)
    const [e] = scoreExam(twenty, () => ({ level: 'III' }), {}, [{ level: 'II', percent: 85 }])
    expect(e!.required).toBe(17) // exactly 17
  })
})
