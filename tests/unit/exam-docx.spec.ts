import { describe, expect, it } from 'vitest'
import { buildExamFilename } from '~/utils/examFilename'
import { htmlToDocxParagraphs } from '~/utils/htmlToDocxBlocks'
import { createExamGeneratorState } from '~/types/examGenerator'
import { buildExamDocument, type LoadedQuestion } from '~/composables/useExamDocx'
import { Packer } from 'docx'
import JSZip from 'jszip'

const openEndedQuestion: LoadedQuestion = {
  id: 'q-open',
  type: 'open-ended',
  content: { pl: { stem: 'Jaka jest kara za spóźnienie?' }, en: { stem: 'What is the penalty?' } },
  modelAnswer: { pl: 'Upomnienie ustne.', en: 'A verbal warning.' },
  level: 'NA',
  status: 'published',
  version: 1,
  createdBy: 'tester',
  createdAt: null,
  updatedAt: null,
}

const singleChoiceQuestion: LoadedQuestion = {
  id: 'q-single',
  type: 'single-choice',
  content: {
    pl: { stem: 'Ile pionków ma każda strona?' },
    en: { stem: 'How many pawns per side?' },
  },
  options: [
    { id: 'a', content: { pl: '6', en: '6' }, isCorrect: false },
    { id: 'b', content: { pl: '8', en: '8' }, isCorrect: true },
  ],
  level: 'NA',
  status: 'published',
  version: 1,
  createdBy: 'tester',
  createdAt: null,
  updatedAt: null,
}

const diagramQuestion: LoadedQuestion = {
  id: 'q-diagram',
  type: 'single-choice',
  content: { pl: { stem: 'Czyj ruch?' }, en: { stem: 'Whose move?' } },
  diagram: { kind: 'fen', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
  options: [
    { id: 'a', content: { pl: 'Białych', en: 'White' }, isCorrect: true },
    { id: 'b', content: { pl: 'Czarnych', en: 'Black' }, isCorrect: false },
  ],
  level: 'NA',
  status: 'published',
  version: 1,
  createdBy: 'tester',
  createdAt: null,
  updatedAt: null,
}

async function docxContainsText(buffer: Buffer, text: string) {
  const zip = await JSZip.loadAsync(buffer)
  const xml = await zip.file('word/document.xml')?.async('string')
  return xml?.includes(text) ?? false
}

describe('buildExamFilename', () => {
  it('slugifies the title and appends an ISO date', () => {
    const date = new Date('2026-09-07T00:00:00Z')
    expect(buildExamFilename('Egzamin NA – Wrzesień 2026', date)).toBe(
      'egzamin-na-wrzesien-2026-2026-09-07.docx',
    )
  })

  it('falls back to a default name for an empty title', () => {
    const date = new Date('2026-01-01T00:00:00Z')
    expect(buildExamFilename('   ', date)).toBe('egzamin-2026-01-01.docx')
  })
})

describe('htmlToDocxParagraphs', () => {
  it('returns an empty array for empty input', () => {
    expect(htmlToDocxParagraphs('')).toEqual([])
  })

  it('converts headings, paragraphs and lists into the expected number of paragraphs', () => {
    const html =
      '<h2>Instrukcje</h2><p>Proszę <strong>uważnie</strong> czytać.</p><ul><li>A</li><li>B</li></ul>'
    const paragraphs = htmlToDocxParagraphs(html)
    // 1 heading + 1 paragraph + 2 list items = 4
    expect(paragraphs).toHaveLength(4)
  })
})

describe('buildExamDocument', () => {
  it('assembles a valid .docx containing question stems, options and header/footer text', async () => {
    const state = createExamGeneratorState()
    state.examTitle = 'Egzamin testowy'
    state.headerHtml = '<p>Nagłówek testowy</p>'
    state.footerHtml = '<p>Stopka testowa</p>'
    state.selectedQuestionIds = [singleChoiceQuestion.id, openEndedQuestion.id]
    state.includeAnswerKey = true

    const questionsById = {
      [singleChoiceQuestion.id]: singleChoiceQuestion,
      [openEndedQuestion.id]: openEndedQuestion,
    }

    const doc = await buildExamDocument(state, questionsById)
    const buffer = await Packer.toBuffer(doc)
    expect(buffer.byteLength).toBeGreaterThan(0)

    await expect(docxContainsText(buffer, 'Nagłówek testowy')).resolves.toBe(true)
    await expect(docxContainsText(buffer, 'Stopka testowa')).resolves.toBe(true)
    await expect(docxContainsText(buffer, 'Ile pionków ma każda strona')).resolves.toBe(true)
    await expect(docxContainsText(buffer, 'Jaka jest kara za sp')).resolves.toBe(true)
    await expect(docxContainsText(buffer, 'Klucz odpowiedzi')).resolves.toBe(true)
  })

  it('omits the answer key section when includeAnswerKey is false', async () => {
    const state = createExamGeneratorState()
    state.selectedQuestionIds = [singleChoiceQuestion.id]
    state.includeAnswerKey = false

    const doc = await buildExamDocument(state, { [singleChoiceQuestion.id]: singleChoiceQuestion })
    const buffer = await Packer.toBuffer(doc)

    await expect(docxContainsText(buffer, 'Klucz odpowiedzi')).resolves.toBe(false)
  })

  it('skips unresolvable question ids without throwing', async () => {
    const state = createExamGeneratorState()
    state.selectedQuestionIds = ['missing-id']

    const doc = await buildExamDocument(state, {})
    const buffer = await Packer.toBuffer(doc)
    expect(buffer.byteLength).toBeGreaterThan(0)
  })

  it('produces a valid, openable package even when a question has a FEN diagram', async () => {
    const state = createExamGeneratorState()
    state.selectedQuestionIds = [diagramQuestion.id]

    const doc = await buildExamDocument(state, { [diagramQuestion.id]: diagramQuestion })
    const buffer = await Packer.toBuffer(doc)
    const zip = await JSZip.loadAsync(buffer)

    // Regression guard: a previously missing `type` on ImageRun produced a
    // `media/*.undefined` part with no declared content type, corrupting the .docx.
    const mediaFiles = Object.keys(zip.files).filter((name) => name.startsWith('word/media/'))
    expect(mediaFiles.length).toBeGreaterThan(0)
    for (const name of mediaFiles) expect(name).not.toMatch(/\.undefined$/)

    const contentTypes = await zip.file('[Content_Types].xml')?.async('string')
    expect(contentTypes).toContain('Extension="png"')
  }, 15000) // first call warms up the native `canvas` addon, which can be slow
})

describe('buildExamDocument layout', () => {
  async function documentXml(selected: LoadedQuestion[]) {
    const state = createExamGeneratorState()
    // Only the questions are under test here — the candidate box is a table of its own.
    state.showCandidateTable = false
    state.selectedQuestionIds = selected.map((q) => q.id)
    const doc = await buildExamDocument(state, Object.fromEntries(selected.map((q) => [q.id, q])))
    const zip = await JSZip.loadAsync(await Packer.toBuffer(doc))
    return (await zip.file('word/document.xml')?.async('string')) ?? ''
  }

  // A table per diagram question could not be moved in Word with Backspace, and touching tables
  // merged into one. The board floats beside plain paragraphs and a clearing break ends the question.
  it('floats a diagram beside plain paragraphs and clears it before the next question', async () => {
    const xml = await documentXml([diagramQuestion, { ...diagramQuestion, id: 'q-diagram-2' }])
    expect(xml).not.toContain('<w:tbl>')
    expect(xml.match(/<wp:anchor/g)).toHaveLength(2)
    expect(xml.match(/<w:br w:type="textWrapping" w:clear="all"\/>/g)).toHaveLength(2)
  }, 15000)

  it('tells a multi-choice question apart unless the stem already asks for all answers', async () => {
    const multi: LoadedQuestion = {
      ...singleChoiceQuestion,
      id: 'q-multi',
      type: 'multi-choice',
      content: { pl: { stem: 'Które kończą partię?' }, en: { stem: 'Which end the game?' } },
    }
    const explicit: LoadedQuestion = {
      ...multi,
      id: 'q-multi-explicit',
      content: { pl: { stem: 'Zaznacz wszystkie, które kończą partię.' }, en: { stem: 'x' } },
    }
    expect(await documentXml([multi])).toContain('zaznacz wszystkie poprawne odpowiedzi')
    expect(await documentXml([explicit])).not.toContain('zaznacz wszystkie poprawne odpowiedzi')
    expect(await documentXml([singleChoiceQuestion])).not.toContain('zaznacz wszystkie poprawne')
  })

  it('lays out a question without a diagram as plain paragraphs', async () => {
    const xml = await documentXml([openEndedQuestion])
    expect(xml).not.toContain('<w:tbl>')
  })

  it('leaves the answer space of an open-ended question unframed', async () => {
    const xml = await documentXml([openEndedQuestion])
    expect(xml).not.toContain('<w:pBdr>')
  })

  // A raw newline printed as a space; a manual break inside a justified paragraph stretched the
  // line before it across the page. Each line is its own paragraph instead.
  it('puts each line of a multi-line stem in its own paragraph', async () => {
    const multiline: LoadedQuestion = {
      ...openEndedQuestion,
      id: 'q-multiline',
      content: { pl: { stem: 'Pierwsza linia\nDruga linia' }, en: { stem: 'First\nSecond' } },
    }
    const xml = await documentXml([multiline])
    const first = xml.indexOf('Pierwsza linia')
    const second = xml.indexOf('Druga linia')
    expect(first).toBeGreaterThan(-1)
    expect(second).toBeGreaterThan(first)
    const between = xml.slice(first, second)
    expect(between).toContain('</w:p>')
    expect(between).not.toContain('<w:br/>')
  })
})

describe('buildExamDocument sheet header', () => {
  async function headerXml(edit: (state: ReturnType<typeof createExamGeneratorState>) => void) {
    const state = createExamGeneratorState()
    edit(state)
    const doc = await buildExamDocument(state, {})
    const zip = await JSZip.loadAsync(await Packer.toBuffer(doc))
    return (await zip.file('word/document.xml')?.async('string')) ?? ''
  }

  // Laid out like WP 2025: title and date, then the candidate box, then the instruction.
  it('prints the title line, then the candidate box, then the text under it', async () => {
    const xml = await headerXml((s) => {
      s.examTitle = 'Egzamin na sędziego szachowego klasy okręgowej'
      s.dateline = 'Poznań, 20.09.2025 r.'
    })
    const title = xml.indexOf('Egzamin na sędziego szachowego klasy okręgowej')
    const date = xml.indexOf('Poznań, 20.09.2025 r.')
    const table = xml.indexOf('<w:tbl>')
    const instruction = xml.indexOf('Jeżeli w pytaniu pojawia się reklamacja')
    expect(title).toBeGreaterThan(-1)
    expect(date).toBeGreaterThan(title)
    expect(table).toBeGreaterThan(date)
    expect(instruction).toBeGreaterThan(table)
  })

  it('frames the candidate box without a vertical rule between its columns', async () => {
    const xml = await headerXml(() => {})
    expect(xml).toContain('Imię i nazwisko:')
    expect(xml).toContain('Egzamin na klasę:')
    expect(xml).toContain('□ młodzieżową')
    expect(xml).toMatch(/<w:insideV w:val="none"/)
  })

  it('drops the class row when no classes are listed, and the box when it is switched off', async () => {
    const noClasses = await headerXml((s) => (s.classOptions = ''))
    expect(noClasses).toContain('Imię i nazwisko:')
    expect(noClasses).not.toContain('Egzamin na klasę:')
    const noBox = await headerXml((s) => (s.showCandidateTable = false))
    expect(noBox).not.toContain('Imię i nazwisko:')
  })
})
