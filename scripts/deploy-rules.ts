// Wdraza firestore.rules na produkcje przez Admin SDK.
//
// Po co osobny skrypt: CI wdraza tylko hosting (FirebaseExtended/action-hosting-deploy), a Firebase
// CLI na maszynie deweloperskiej blokuje korporacyjny proxy. Admin SDK idzie tym samym kanalem co
// scripts/db-tool.ts, wiec dziala.
//
// Zawsze najpierw wypisuje roznice wzgledem regul aktualnie wdrozonych na produkcji. Z --dry-run
// na tym konczy. Reguly sa zmieniane atomowo — nowy ruleset zastepuje poprzedni w calosci.
//
// Wymaga klucza serwisowego w .secrets/service-account.json (gitignored).
// UWAGA: pisze na produkcje, nie ma srodowiska dev ani emulatora.
//
// Uzycie:
//   pnpm tsx scripts/deploy-rules.ts [--dry-run]
import { initializeApp, cert } from 'firebase-admin/app'
import { getSecurityRules } from 'firebase-admin/security-rules'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const RULES_PATH = 'firestore.rules'

function lines(source: string) {
  return source.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n')
}

/** Minimalny diff liniowy (LCS) — pliki regul maja kilkadziesiat linii, wiec wystarczy. */
function diff(before: string[], after: string[]) {
  const n = before.length
  const m = after.length
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i]![j] =
        before[i] === after[j]
          ? lcs[i + 1]![j + 1]! + 1
          : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!)
    }
  }
  const out: string[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (before[i] === after[j]) {
      i++
      j++
    } else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) {
      out.push(`- ${before[i++]}`)
    } else {
      out.push(`+ ${after[j++]}`)
    }
  }
  while (i < n) out.push(`- ${before[i++]}`)
  while (j < m) out.push(`+ ${after[j++]}`)
  return out
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  const sa = JSON.parse(readFileSync(resolve('.secrets/service-account.json'), 'utf8'))
  initializeApp({ credential: cert(sa) })
  const rules = getSecurityRules()

  const local = readFileSync(resolve(RULES_PATH), 'utf8')
  const current = await rules.getFirestoreRuleset()
  const deployed = current.source[0]?.content ?? ''

  const changes = diff(lines(deployed), lines(local))
  if (!changes.length) {
    console.log(`Reguly na produkcji sa identyczne z ${RULES_PATH} — nic do wdrozenia.`)
    return
  }

  console.log(`Roznice: produkcja (z ${current.createTime}) -> ${RULES_PATH}\n`)
  for (const line of changes) console.log(line)

  if (dryRun) {
    console.log('\n--dry-run — nic nie wdrozono.')
    return
  }

  const released = await rules.releaseFirestoreRulesetFromSource(local)
  console.log(`\nWdrozono ruleset ${released.name} (${released.createTime}).`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
