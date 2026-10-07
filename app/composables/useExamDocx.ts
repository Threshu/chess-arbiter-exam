import { Chess } from 'chess.js'
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeightRule,
  ImageRun,
  LineRuleType,
  Packer,
  Paragraph,
  Table,
  TableBorders,
  TableCell,
  TableLayoutType,
  TableRow,
  TabStopType,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx'
import { buildExamFilename } from '~/utils/examFilename'
import { fenToPngBytes } from '~/utils/chessDiagramImage'
import { htmlToDocxParagraphs } from '~/utils/htmlToDocxBlocks'
import { localized } from '~/utils/localized'
import type { ExamGeneratorState } from '~/types/examGenerator'
import type { Question } from '~~/shared/types/question'

const DEFAULT_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const OPTION_LETTERS = 'abcdefgh'.split('')
const DIAGRAM_PX = 260

// The face of the WP exam sheets, so a generated exam looks like the papers it continues.
const FONT_FAMILY = 'Trebuchet MS'
// Font size is in half-points (docx convention): 22 = 11pt, applied document-wide.
const BODY_SIZE = 22
// Narrow page margins (twips): 720 = 0.5in on every side.
const PAGE_MARGIN = 720
// A4 in twips, set explicitly so the column widths below are computed against a known page.
const PAGE_WIDTH = 11906
const PAGE_HEIGHT = 16838
const CONTENT_WIDTH = PAGE_WIDTH - 2 * PAGE_MARGIN
// A question with a diagram is a two-column row: the 260 px board is 260 / 96 in = 3900 twips wide,
// and the column adds a gutter so the text never runs up against it.
const DIAGRAM_COLUMN = 4200
const TEXT_COLUMN = CONTENT_WIDTH - DIAGRAM_COLUMN
// Blank lines left under an open-ended question for the handwritten answer.
const ANSWER_SPACE_LINES = 7

// Sheet header, measured on WP 2025: title line in 11 pt italics, candidate box and instruction in
// 10 pt, the box's label column about a third of the width, each row about 29 pt high.
const HEADER_TITLE_SIZE = 22
const HEADER_SIZE = 20
const CANDIDATE_LABEL_COLUMN = 3300
const CANDIDATE_ROW_HEIGHT = 580
// Text inset from the box's left edge, as on the WP sheet (about 6 pt).
const CANDIDATE_CELL_MARGINS = { left: 115, right: 115 }
const CANDIDATE_LABELS = {
  pl: { name: 'Imię i nazwisko:', classes: 'Egzamin na klasę:' },
  en: { name: 'Name:', classes: 'Exam for class:' },
} as const

// Spacing is in twentieths of a point (dxa): 240 = 12pt.
const SPACE_BEFORE_QUESTION = 480
const SPACE_AFTER_STEM = 240
const SPACE_AFTER_OPTION = 120

export type LoadedQuestion = Question & { id: string }

async function buildDiagramImage(question: Question): Promise<{
  image: ImageRun | null
  moves: string | null
  failed: boolean
}> {
  if (!question.diagram) return { image: null, moves: null, failed: false }
  try {
    let fen = question.diagram.kind === 'fen' ? question.diagram.fen : DEFAULT_START_FEN
    let moves: string | null = null

    if (question.diagram.kind === 'pgn') {
      const chess = new Chess()
      chess.loadPgn(question.diagram.pgn)
      moves = chess.history().join(' ')
      fen = chess.header().FEN ?? DEFAULT_START_FEN
    }

    const png = await fenToPngBytes(fen)
    // Inline rather than floating — a floating image reserves no vertical space, so a short question let
    // the next one start beside its board, the next board overlapped it, and Word never carried
    // the image to a new page together with its question.
    const image = new ImageRun({
      type: 'png',
      data: png,
      transformation: { width: DIAGRAM_PX, height: DIAGRAM_PX },
    })
    return { image, moves, failed: false }
  } catch {
    return { image: null, moves: null, failed: true }
  }
}

interface LinesOptions {
  bold?: boolean
  italics?: boolean
  justified?: boolean
  /** Space before the first line and after the last one. */
  before?: number
  after?: number
  /** Whether the last line is kept on the same page as whatever follows it. */
  keepWithNext?: boolean
}

/**
 * One paragraph per line of `text`. `docx` would print a raw `\n` as a space, and a manual line
 * break inside a justified paragraph makes Word stretch the line before it across the full width;
 * the last line of a paragraph is never stretched, so separate paragraphs keep every line natural.
 */
function lineParagraphs(text: string, options: LinesOptions = {}): Paragraph[] {
  const lines = text.split('\n')
  return lines.map(
    (line, i) =>
      new Paragraph({
        alignment: options.justified ? AlignmentType.JUSTIFIED : undefined,
        keepNext: i < lines.length - 1 || !!options.keepWithNext,
        keepLines: true,
        spacing: {
          before: i === 0 ? (options.before ?? 0) : 0,
          after: i === lines.length - 1 ? (options.after ?? 0) : 0,
          line: 264,
          lineRule: LineRuleType.AUTO,
        },
        children: [
          new TextRun({
            text: line,
            bold: options.bold,
            italics: options.italics,
            size: BODY_SIZE,
          }),
        ],
      }),
  )
}

/**
 * The question's own paragraphs, without the diagram. Each one is kept with the next, so the stem
 * never ends up on a different page from its options or its answer space.
 */
function questionBodyParagraphs(
  question: Question,
  index: number,
  lang: 'pl' | 'en',
  moves: string | null,
  failed: boolean,
): Paragraph[] {
  const content = localized(question.content, lang)
  const paragraphs: Paragraph[] = lineParagraphs(`${index + 1}. ${content.stem}`, {
    bold: true,
    justified: true,
    before: SPACE_BEFORE_QUESTION,
    after: SPACE_AFTER_STEM,
    keepWithNext: true,
  })

  if (failed) {
    paragraphs.push(
      new Paragraph({
        keepNext: true,
        spacing: { after: SPACE_AFTER_STEM },
        children: [
          new TextRun({
            text: '[Nie udało się wyrenderować diagramu]',
            italics: true,
            size: BODY_SIZE,
          }),
        ],
      }),
    )
  }

  if (moves) {
    paragraphs.push(
      ...lineParagraphs(moves, {
        italics: true,
        justified: true,
        after: SPACE_AFTER_STEM,
        keepWithNext: true,
      }),
    )
  }

  if (question.type === 'single-choice' || question.type === 'multi-choice') {
    question.options.forEach((opt, i) => {
      paragraphs.push(
        ...lineParagraphs(`${OPTION_LETTERS[i]}) ${localized(opt.content, lang)}`, {
          justified: true,
          after: SPACE_AFTER_OPTION,
          keepWithNext: i < question.options.length - 1,
        }),
      )
    })
  } else {
    paragraphs.push(openEndedAnswerSpace())
  }

  return paragraphs
}

/**
 * A question without a diagram is plain paragraphs. A question with one is a borderless two-column
 * table — text on the left, board on the right, both top-aligned — whose single row may not split,
 * so a question that does not fit moves to the next page as a whole.
 */
async function questionBlocks(
  question: Question,
  index: number,
  lang: 'pl' | 'en',
): Promise<(Paragraph | Table)[]> {
  const { image, moves, failed } = await buildDiagramImage(question)
  const body = questionBodyParagraphs(question, index, lang, moves, failed)
  if (!image) return body

  return [
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [TEXT_COLUMN, DIAGRAM_COLUMN],
      layout: TableLayoutType.FIXED,
      borders: TableBorders.NONE,
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: TEXT_COLUMN, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              children: body,
            }),
            new TableCell({
              width: { size: DIAGRAM_COLUMN, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  // Same space before as the stem, so the board's top lines up with the question.
                  spacing: { before: SPACE_BEFORE_QUESTION },
                  children: [image],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Word merges tables that touch into one, so consecutive diagram questions became a single
    // table and could not be moved around separately. An empty paragraph keeps them apart.
    new Paragraph({ spacing: { before: 0, after: 0 }, children: [] }),
  ]
}

/** Blank space for the handwritten answer — deliberately no frame around it. */
function openEndedAnswerSpace(): Paragraph {
  return new Paragraph({
    spacing: { after: SPACE_AFTER_OPTION },
    children: Array.from(
      { length: ANSWER_SPACE_LINES },
      () => new TextRun({ break: 1, size: BODY_SIZE }),
    ),
  })
}

/** "Title ……… Place, date" — the first line of a WP sheet, the date flush right. */
function titleLine(state: ExamGeneratorState): Paragraph | null {
  const title = state.examTitle.trim()
  const dateline = state.dateline.trim()
  if (!title && !dateline) return null
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }],
    spacing: { after: 480 },
    children: [
      new TextRun({ text: title, italics: true, size: HEADER_TITLE_SIZE }),
      ...(dateline
        ? [new TextRun({ text: `\t${dateline}`, italics: true, size: HEADER_TITLE_SIZE })]
        : []),
    ],
  })
}

/**
 * The candidate box of a WP sheet: a framed two-row table, the label column in bold, rows split by
 * a horizontal rule but no vertical one. The class row lists the classes evenly with empty boxes.
 */
function candidateTable(state: ExamGeneratorState): Table | null {
  if (!state.showCandidateTable) return null
  const labels = CANDIDATE_LABELS[state.language]
  const classes = state.classOptions
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
  const valueWidth = CONTENT_WIDTH - CANDIDATE_LABEL_COLUMN
  const line = { style: BorderStyle.SINGLE, size: 6, color: '000000' }
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }

  const row = (label: string, value: Paragraph) =>
    new TableRow({
      height: { value: CANDIDATE_ROW_HEIGHT, rule: HeightRule.ATLEAST },
      children: [
        new TableCell({
          width: { size: CANDIDATE_LABEL_COLUMN, type: WidthType.DXA },
          margins: CANDIDATE_CELL_MARGINS,
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              children: [new TextRun({ text: label, bold: true, size: HEADER_SIZE })],
            }),
          ],
        }),
        new TableCell({
          width: { size: valueWidth, type: WidthType.DXA },
          margins: CANDIDATE_CELL_MARGINS,
          verticalAlign: VerticalAlign.CENTER,
          children: [value],
        }),
      ],
    })

  const rows = [row(labels.name, new Paragraph({}))]
  if (classes.length) {
    const step = Math.floor(valueWidth / classes.length)
    rows.push(
      row(
        labels.classes,
        new Paragraph({
          tabStops: classes
            .slice(1)
            .map((_, i) => ({ type: TabStopType.LEFT, position: step * (i + 1) })),
          children: classes.map(
            (c, i) => new TextRun({ text: `${i ? '\t' : ''}□ ${c}`, size: HEADER_SIZE }),
          ),
        }),
      ),
    )
  }

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CANDIDATE_LABEL_COLUMN, valueWidth],
    layout: TableLayoutType.FIXED,
    borders: {
      top: line,
      bottom: line,
      left: line,
      right: line,
      insideHorizontal: line,
      insideVertical: none,
    },
    rows,
  })
}

function answerKeyParagraphs(
  ids: string[],
  resolve: (id: string) => LoadedQuestion | undefined,
  lang: 'pl' | 'en',
): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      pageBreakBefore: true,
      spacing: { after: SPACE_AFTER_STEM },
      children: [new TextRun({ text: 'Klucz odpowiedzi', bold: true, size: BODY_SIZE })],
    }),
  ]

  ids.forEach((id, index) => {
    const question = resolve(id)
    if (!question) return

    const answer =
      question.type === 'open-ended'
        ? localized(question.modelAnswer, lang)
        : question.options
            .map((o, i) => (o.isCorrect ? OPTION_LETTERS[i] : null))
            .filter((v): v is string => v !== null)
            .join(', ')

    paragraphs.push(...lineParagraphs(`${index + 1}. ${answer}`, { bold: true, after: 80 }))

    const explanation = localized(question.content, lang).explanation
    if (explanation) {
      paragraphs.push(...lineParagraphs(explanation, { italics: true, after: SPACE_AFTER_OPTION }))
    }
  })

  return paragraphs
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Builds the `docx` Document for the given draft state — pure, no browser side effects. */
export async function buildExamDocument(
  state: ExamGeneratorState,
  questionsById: Record<string, LoadedQuestion>,
): Promise<Document> {
  const resolve = (id: string) =>
    (state.overrides[id] as LoadedQuestion | undefined) ?? questionsById[id]
  const children: (Paragraph | Table)[] = []

  // Laid out like a WP sheet: title and date, candidate box, then the free text under the box.
  const title = titleLine(state)
  if (title) children.push(title)
  const candidates = candidateTable(state)
  if (candidates) children.push(candidates)
  children.push(...htmlToDocxParagraphs(state.headerHtml, { size: HEADER_SIZE, spaceBefore: 40 }))

  for (let i = 0; i < state.selectedQuestionIds.length; i++) {
    const question = resolve(state.selectedQuestionIds[i]!)
    if (!question) continue
    children.push(...(await questionBlocks(question, i, state.language)))
  }

  children.push(...htmlToDocxParagraphs(state.footerHtml))

  if (state.includeAnswerKey) {
    children.push(...answerKeyParagraphs(state.selectedQuestionIds, resolve, state.language))
  }

  return new Document({
    styles: {
      default: {
        document: { run: { font: FONT_FAMILY, size: BODY_SIZE } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
            margin: {
              top: PAGE_MARGIN,
              right: PAGE_MARGIN,
              bottom: PAGE_MARGIN,
              left: PAGE_MARGIN,
            },
          },
        },
        children,
      },
    ],
  })
}

/** Assembles the selected questions + custom text into a downloadable .docx — nothing is persisted. */
export function useExamDocx() {
  async function generateExamDocx(
    state: ExamGeneratorState,
    questionsById: Record<string, LoadedQuestion>,
  ) {
    const doc = await buildExamDocument(state, questionsById)
    const blob = await Packer.toBlob(doc)
    triggerDownload(blob, buildExamFilename(state.examTitle))
  }

  return { generateExamDocx }
}
