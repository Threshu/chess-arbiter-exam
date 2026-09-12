// Hurtowy import pytan do kolekcji `questions`.
//
// Waliduje CALA partie schematem Zod przed jakimkolwiek zapisem — jesli choc jedno pytanie
// jest niepoprawne, nie zapisuje niczego. Zapis idzie jednym batchem, wiec jest atomowy.
//
// Wymaga klucza serwisowego w .secrets/service-account.json (gitignored — patrz grant-admin.ts).
// UWAGA: pisze na produkcje, nie ma srodowiska dev ani emulatora.
//
// Uzycie:
//   pnpm tsx scripts/bulk-import.ts <sciezka-do-tablicy-pytan.json> [--dry-run]
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { questionSchema } from '../shared/schemas/question.js'

const CREATED_BY = 'script:bulk-import'

async function main() {
  const jsonPath = process.argv[2]
  const dryRun = process.argv.includes('--dry-run')
  if (!jsonPath) {
    console.error('Podaj sciezke do pliku JSON z tablica pytan.')
    process.exitCode = 1
    return
  }

  const rows = JSON.parse(readFileSync(resolve(jsonPath), 'utf8')) as Record<string, unknown>[]
  if (!Array.isArray(rows)) {
    console.error('Plik musi zawierac tablice pytan.')
    process.exitCode = 1
    return
  }

  const prepared = rows.map((raw) => ({
    version: 1,
    createdBy: CREATED_BY,
    ...raw,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }))

  let bad = 0
  prepared.forEach((p, i) => {
    const parsed = questionSchema.safeParse(p)
    if (!parsed.success) {
      bad++
      const issues = parsed.error.issues.map((x) => `${x.path.join('.')}: ${x.message}`)
      console.error(`[${i}] ODRZUCONE: ${JSON.stringify(issues)}`)
    }
  })
  if (bad > 0) {
    console.error(
      `\n${bad} z ${prepared.length} pytan nie przeszlo walidacji — nie zapisuje niczego.`,
    )
    process.exitCode = 1
    return
  }
  console.log(`Walidacja OK: ${prepared.length} pytan.`)

  if (dryRun) {
    console.log('--dry-run — nic nie zapisano.')
    return
  }

  const sa = JSON.parse(readFileSync(resolve('.secrets/service-account.json'), 'utf8'))
  initializeApp({ credential: cert(sa) })
  const db = getFirestore()

  const batch = db.batch()
  const ids: string[] = []
  for (const p of prepared) {
    const ref = db.collection('questions').doc()
    batch.set(ref, p)
    ids.push(ref.id)
  }
  await batch.commit()

  console.log(`Wstawiono ${ids.length} pytan:`)
  ids.forEach((id, i) => {
    const stem = (prepared[i] as { content: { pl: { stem: string } } }).content.pl.stem
    console.log(`  ${id}  ${stem.slice(0, 70)}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
