import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { deleteDoc, doc, getDoc, getDocs, collection, setDoc } from 'firebase/firestore'

// Exam results hold candidates' initials and answers, so only an admin may see or change them.

let env: RulesTestEnvironment

const session = { name: 'WP 2026', date: '2026-10-10', examId: 'exam-1', questions: [] }
const result = { candidate: 'SB', level: 'III', answers: {} }

const admin = () => env.authenticatedContext('admin-uid', { role: 'admin' }).firestore()
const student = () => env.authenticatedContext('student-uid', { role: 'student' }).firestore()
const anonymous = () => env.unauthenticatedContext().firestore()

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-chess-arbiter-exams',
    firestore: { rules: readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8') },
  })
})

afterAll(async () => {
  await env.cleanup()
})

beforeEach(async () => {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'examSessions', 's1'), session)
    await setDoc(doc(ctx.firestore(), 'examSessions', 's1', 'results', 'r1'), result)
  })
})

describe('examSessions', () => {
  it('lets an admin read and write sessions and results', async () => {
    const db = admin()
    await assertSucceeds(getDoc(doc(db, 'examSessions', 's1')))
    await assertSucceeds(getDocs(collection(db, 'examSessions', 's1', 'results')))
    await assertSucceeds(setDoc(doc(db, 'examSessions', 's1', 'results', 'r2'), result))
    await assertSucceeds(deleteDoc(doc(db, 'examSessions', 's1', 'results', 'r1')))
    await assertSucceeds(setDoc(doc(db, 'examSessions', 's2'), session))
  })

  it('does not let a student read or write sessions or results', async () => {
    const db = student()
    await assertFails(getDoc(doc(db, 'examSessions', 's1')))
    await assertFails(getDocs(collection(db, 'examSessions', 's1', 'results')))
    await assertFails(setDoc(doc(db, 'examSessions', 's1', 'results', 'r2'), result))
  })

  it('does not let an anonymous visitor read results', async () => {
    await assertFails(getDocs(collection(anonymous(), 'examSessions', 's1', 'results')))
  })
})
