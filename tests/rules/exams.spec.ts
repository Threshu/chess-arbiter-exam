import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

// Saved exams carry the answer key, so the one thing that must never regress is a student
// reading them.

let env: RulesTestEnvironment

const examId = 'exam-1'
const exam = {
  examTitle: 'Egzamin próbny',
  language: 'pl',
  headerHtml: '',
  footerHtml: '',
  selectedQuestionIds: ['q1', 'q2'],
  overrides: {},
  includeAnswerKey: true,
  createdBy: 'admin-uid',
}

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
    await setDoc(doc(ctx.firestore(), 'exams', examId), exam)
  })
})

describe('exams', () => {
  it('lets an admin read, create, update and delete an exam', async () => {
    const db = admin()
    await assertSucceeds(getDoc(doc(db, 'exams', examId)))
    await assertSucceeds(setDoc(doc(db, 'exams', 'exam-2'), exam))
    await assertSucceeds(updateDoc(doc(db, 'exams', examId), { examTitle: 'Zmieniony' }))
    await assertSucceeds(deleteDoc(doc(db, 'exams', examId)))
  })

  it('does not let a signed-in student read an exam', async () => {
    await assertFails(getDoc(doc(student(), 'exams', examId)))
  })

  it('does not let a signed-in student create, update or delete an exam', async () => {
    const db = student()
    await assertFails(setDoc(doc(db, 'exams', 'exam-2'), exam))
    await assertFails(updateDoc(doc(db, 'exams', examId), { examTitle: 'Zmieniony' }))
    await assertFails(deleteDoc(doc(db, 'exams', examId)))
  })

  it('does not let an anonymous visitor read an exam', async () => {
    await assertFails(getDoc(doc(anonymous(), 'exams', examId)))
  })
})
