/**
 * Article texts of the FIDE Laws of Chess in force from 1 January 2023, keyed by article number:
 * - PL: the PZSzach translation (pzszach.pl, "2023-tlumaczenie-FIDE-Laws-of-Chess.pdf"),
 * - EN: the Laws as printed in the FIDE Arbiters' Manual 2026, without the Manual's commentary.
 * Both use the 2023 numbering (e.g. Appendix A.5.2, not the A.4.2 of the 2018 translation).
 */
export type LawTexts = Record<string, string>

export interface LawQuote {
  number: string
  text: string
}

const NUMBER = String.raw`(?:[AB]\.)?\d{1,2}(?:\.\d{1,2}){1,3}|[AB]\.\d{1,2}`
// "art. 9.4", "Art. 7.5.5", "artykułów 4.1–4.7", "Aneks A.3", "Aneksu A.5.5", "Appendix A.5.2"
const CITATION = new RegExp(
  String.raw`(?:\bart(?:\.|ykuł\w*|icles?)|\bAneks\w*|\bZałącznik\w*|\bAppendix)\s*` +
    String.raw`((?:${NUMBER})(?:\s*(?:,|i|oraz|lub|albo|and|or|w związku z(?: Aneksem)?|read with)\s*(?:art\.\s*)?(?:${NUMBER}))*)`,
  'giu',
)
// An appendix number on its own, e.g. "(A.5.2)" — unambiguous, unlike a bare "7.3".
const BARE_APPENDIX = /(?<![\w.])([AB]\.\d{1,2}(?:\.\d{1,2}){0,3})(?![\w.])/gu
const NUMBER_IN_LIST = new RegExp(NUMBER, 'gu')

/** Article numbers cited in `text`, in order of first appearance, without repeats. */
export function citedArticles(text: string): string[] {
  const found: { at: number; number: string }[] = []
  for (const match of text.matchAll(CITATION)) {
    const list = match[1]!
    const listStart = match.index! + match[0].indexOf(list)
    for (const n of list.matchAll(NUMBER_IN_LIST))
      found.push({ at: listStart + n.index!, number: n[0] })
  }
  for (const match of text.matchAll(BARE_APPENDIX))
    found.push({ at: match.index!, number: match[1]! })
  found.sort((a, b) => a.at - b.at)
  return [...new Set(found.map((f) => f.number))]
}

function isWithin(child: string, parent: string) {
  return child.startsWith(`${parent}.`)
}

/**
 * The texts of the cited articles. An article is quoted with its sub-points (art. 4.3 needs 4.3.1–4.3.3
 * to make sense); a cited sub-point already covered by a quoted parent is not repeated. A sub-point that
 * continues its parent's sentence ("9.2 … when the same position: 9.2.1 is about to appear …") is preceded
 * by that lead-in. Numbers that are not in the Laws (a typo, or a regulation outside them) are skipped.
 */
export function lawQuotes(numbers: string[], laws: LawTexts): LawQuote[] {
  const known = numbers.filter((n) => n in laws || Object.keys(laws).some((k) => isWithin(k, n)))
  const roots = known.filter((n) => !known.some((other) => other !== n && isWithin(n, other)))
  const quoted = new Set<string>()
  const quotes: LawQuote[] = []
  const add = (number: string) => {
    if (quoted.has(number) || !laws[number]) return
    quoted.add(number)
    quotes.push({ number, text: laws[number] })
  }
  for (const root of roots) {
    const parent = root.includes('.') ? root.slice(0, root.lastIndexOf('.')) : ''
    if (laws[parent]?.trimEnd().endsWith(':')) add(parent)
    for (const k of Object.keys(laws)) if (k === root || isWithin(k, root)) add(k)
  }
  return quotes
}

/** Loads the article texts; split out of the main bundle, as only the DOCX answer key needs them. */
export async function loadLaws(lang: 'pl' | 'en'): Promise<LawTexts> {
  const module =
    lang === 'pl'
      ? await import('~/data/laws/laws-pl-2023.json')
      : await import('~/data/laws/laws-en-2023.json')
  return module.default as LawTexts
}
