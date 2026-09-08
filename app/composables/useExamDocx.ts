import { Chess } from 'chess.js'
import {
  AlignmentType,
  BorderStyle,
  Document,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  ImageRun,
  LineRuleType,
  Packer,
  Paragraph,
  TextRun,
  TextWrappingSide,
  TextWrappingType,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
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

const FONT_FAMILY = 'Tahoma'
// Font size is in half-points (docx convention): 22 = 11pt, applied document-wide.
const BODY_SIZE = 22
// Narrow page margins (twips): 720 = 0.5in on every side.
const PAGE_MARGIN = 720

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
    const image = new ImageRun({
      type: 'png',
      data: png,
      transformation: { width: DIAGRAM_PX, height: DIAGRAM_PX },
      floating: {
        horizontalPosition: {
          relative: HorizontalPositionRelativeFrom.MARGIN,
          align: HorizontalPositionAlign.RIGHT,
        },
        verticalPosition: {
          relative: VerticalPositionRelativeFrom.PARAGRAPH,
          align: VerticalPositionAlign.TOP,
        },
        wrap: { type: TextWrappingType.SQUARE, side: TextWrappingSide.LEFT },
        margins: { left: 228600, bottom: 228600 },
      },
    })
    return { image, moves, failed: false }
  } catch {
    return { image: null, moves: null, failed: true }
  }
}

async function questionParagraphs(
  question: Question,
  index: number,
  lang: 'pl' | 'en',
): Promise<Paragraph[]> {
  const content = localized(question.content, lang)
  const { image, moves, failed } = await buildDiagramImage(question)

  const stemChildren: (TextRun | ImageRun)[] = [
    new TextRun({ text: `${index + 1}. ${content.stem}`, bold: true, size: BODY_SIZE }),
  ]
  if (image) stemChildren.push(image)

  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: {
        before: SPACE_BEFORE_QUESTION,
        after: SPACE_AFTER_STEM,
        line: 264,
        lineRule: LineRuleType.AUTO,
      },
      children: stemChildren,
    }),
  ]

  if (failed) {
    paragraphs.push(
      new Paragraph({
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
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: SPACE_AFTER_STEM },
        children: [new TextRun({ text: moves, italics: true, size: BODY_SIZE })],
      }),
    )
  }

  if (question.type === 'single-choice' || question.type === 'multi-choice') {
    question.options.forEach((opt, i) => {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: SPACE_AFTER_OPTION },
          children: [
            new TextRun({
              text: `${OPTION_LETTERS[i]}) ${localized(opt.content, lang)}`,
              size: BODY_SIZE,
            }),
          ],
        }),
      )
    })
  } else {
    paragraphs.push(...openEndedAnswerSpace())
  }

  return paragraphs
}

function openEndedAnswerSpace(): Paragraph[] {
  const border = { style: BorderStyle.SINGLE, size: 6, color: 'BFBFBF' }
  return [
    new Paragraph({
      spacing: { after: SPACE_AFTER_OPTION },
      border: { top: border, bottom: border, left: border, right: border },
      children: Array.from({ length: 7 }, () => new TextRun({ break: 1, size: BODY_SIZE })),
    }),
  ]
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

    paragraphs.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: `${index + 1}. ${answer}`, bold: true, size: BODY_SIZE })],
      }),
    )

    const explanation = localized(question.content, lang).explanation
    if (explanation) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: SPACE_AFTER_OPTION },
          children: [new TextRun({ text: explanation, italics: true, size: BODY_SIZE })],
        }),
      )
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
  const children: Paragraph[] = []

  children.push(...htmlToDocxParagraphs(state.headerHtml))

  if (state.examTitle.trim()) {
    children.push(
      new Paragraph({
        spacing: { after: SPACE_AFTER_STEM },
        children: [new TextRun({ text: state.examTitle.trim(), bold: true, size: BODY_SIZE })],
      }),
    )
  }

  for (let i = 0; i < state.selectedQuestionIds.length; i++) {
    const question = resolve(state.selectedQuestionIds[i]!)
    if (!question) continue
    children.push(...(await questionParagraphs(question, i, state.language)))
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
