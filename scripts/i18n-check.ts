import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(process.cwd(), 'i18n', 'locales')
const LOCALES = ['pl', 'en'] as const

type KeySet = Set<string>

function walkObject(obj: unknown, prefix: string, out: KeySet) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    out.add(prefix)
    return
  }
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    walkObject(v, prefix ? `${prefix}.${k}` : k, out)
  }
}

function readKeys(locale: string): Map<string, KeySet> {
  const dir = join(ROOT, locale)
  const result = new Map<string, KeySet>()
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
  for (const file of files) {
    const path = join(dir, file)
    if (!statSync(path).isFile()) continue
    const raw = readFileSync(path, 'utf8')
    const parsed = JSON.parse(raw)
    const keys = new Set<string>()
    walkObject(parsed, '', keys)
    result.set(file, keys)
  }
  return result
}

function diff(a: KeySet, b: KeySet): { onlyInA: string[]; onlyInB: string[] } {
  const onlyInA: string[] = []
  const onlyInB: string[] = []
  for (const k of a) if (!b.has(k)) onlyInA.push(k)
  for (const k of b) if (!a.has(k)) onlyInB.push(k)
  return { onlyInA, onlyInB }
}

function main() {
  const sets = LOCALES.map((l) => [l, readKeys(l)] as const)
  const [base, ...rest] = sets
  if (!base) throw new Error('No base locale')

  const baseLocale = base[0]
  const baseKeys = base[1]

  let failed = false

  const allFiles = new Set<string>()
  for (const [, m] of sets) for (const f of m.keys()) allFiles.add(f)

  for (const file of allFiles) {
    const baseSet = baseKeys.get(file)
    if (!baseSet) {
      console.error(`✖ ${baseLocale}/${file} is missing`)
      failed = true
      continue
    }
    for (const [locale, m] of rest) {
      const otherSet = m.get(file)
      if (!otherSet) {
        console.error(`✖ ${locale}/${file} is missing`)
        failed = true
        continue
      }
      const { onlyInA, onlyInB } = diff(baseSet, otherSet)
      if (onlyInA.length || onlyInB.length) {
        failed = true
        console.error(`✖ ${file} key drift between ${baseLocale} and ${locale}`)
        if (onlyInA.length) console.error(`  only in ${baseLocale}: ${onlyInA.join(', ')}`)
        if (onlyInB.length) console.error(`  only in ${locale}: ${onlyInB.join(', ')}`)
      }
    }
  }

  if (failed) {
    console.error('\ni18n key sets do not match.')
    process.exit(1)
  }
  console.log('✓ i18n keys are in sync across PL and EN.')
}

main()
