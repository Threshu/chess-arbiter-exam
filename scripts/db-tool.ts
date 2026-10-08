// Ad-hoc DB helper for direct Firestore reads/writes against the `questions` collection.
// Used interactively (by a developer or AI agent) to check for duplicates and insert/update
// questions without going through the browser UI. Mirrors scripts/grant-admin.ts's auth setup.
//
// Requires a service account JSON at .secrets/service-account.json (gitignored — see
// scripts/grant-admin.ts for how to obtain one). NEVER paste the key contents into chat/logs;
// place the downloaded file directly at that path.
//
// Usage:
//   pnpm tsx scripts/db-tool.ts search <term>
//   pnpm tsx scripts/db-tool.ts get <id>
//   pnpm tsx scripts/db-tool.ts insert <path-to-question.json>
//   pnpm tsx scripts/db-tool.ts update <id> <path-to-partial.json>
//   pnpm tsx scripts/db-tool.ts list [--type=single-choice] [--level=III] [--status=draft]
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { questionSchema } from '../shared/schemas/question.js'

const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH ?? '.secrets/service-account.json'
const serviceAccount = JSON.parse(readFileSync(resolve(SERVICE_ACCOUNT_PATH), 'utf8'))
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

type Locale = 'pl' | 'en'

function stemOf(doc: FirebaseFirestore.DocumentData, locale: Locale = 'pl') {
  return doc.content?.[locale]?.stem ?? doc.content?.en?.stem ?? doc.content?.pl?.stem ?? ''
}

function printRow(id: string, doc: FirebaseFirestore.DocumentData) {
  const stem = stemOf(doc)
  console.log(`${id}  [${doc.type}/${doc.level}/${doc.status}]  ${stem.slice(0, 90)}`)
}

async function cmdSearch(term: string) {
  const snap = await db.collection('questions').get()
  const needle = term.toLowerCase()
  let count = 0
  snap.forEach((d) => {
    const data = d.data()
    const haystack = `${stemOf(data, 'pl')} ${stemOf(data, 'en')}`.toLowerCase()
    if (haystack.includes(needle)) {
      printRow(d.id, data)
      count++
    }
  })
  console.log(`\n${count} match(es) for "${term}"`)
}

async function cmdList(filters: Record<string, string>) {
  let query: FirebaseFirestore.Query = db.collection('questions')
  for (const key of ['type', 'level', 'status'] as const) {
    if (filters[key]) query = query.where(key, '==', filters[key])
  }
  const snap = await query.get()
  snap.forEach((d) => printRow(d.id, d.data()))
  console.log(`\n${snap.size} question(s)`)
}

async function cmdGet(id: string) {
  const doc = await db.collection('questions').doc(id).get()
  if (!doc.exists) {
    console.log('Not found.')
    return
  }
  console.log(JSON.stringify(doc.data(), null, 2))
}

async function cmdInsert(jsonPath: string) {
  const raw = JSON.parse(readFileSync(resolve(jsonPath), 'utf8'))
  const payload = {
    version: 1,
    createdBy: 'script:db-tool',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    ...raw,
  }
  const parsed = questionSchema.safeParse(payload)
  if (!parsed.success) {
    console.error('Validation failed:', JSON.stringify(parsed.error.flatten(), null, 2))
    process.exitCode = 1
    return
  }
  const ref = await db.collection('questions').add(payload)
  console.log(`Inserted: ${ref.id}`)
}

async function cmdUpdate(id: string, jsonPath: string) {
  const raw = JSON.parse(readFileSync(resolve(jsonPath), 'utf8'))
  await db
    .collection('questions')
    .doc(id)
    .update({ ...raw, updatedAt: FieldValue.serverTimestamp() })
  console.log(`Updated: ${id}`)
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  switch (cmd) {
    case 'search':
      return cmdSearch(rest[0] ?? '')
    case 'get':
      return cmdGet(rest[0]!)
    case 'insert':
      return cmdInsert(rest[0]!)
    case 'update':
      return cmdUpdate(rest[0]!, rest[1]!)
    case 'list': {
      const filters: Record<string, string> = {}
      for (const arg of rest) {
        const m = /^--(\w+)=(.+)$/.exec(arg)
        if (m) filters[m[1]!] = m[2]!
      }
      return cmdList(filters)
    }
    default:
      console.log(
        'Usage: tsx scripts/db-tool.ts <search|get|insert|update|list> ...\nSee file header for details.',
      )
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
