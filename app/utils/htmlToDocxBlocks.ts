import { AlignmentType, HeadingLevel, Paragraph, TextRun } from 'docx'

const HEADING_LEVELS: Record<string, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  H1: HeadingLevel.HEADING_1,
  H2: HeadingLevel.HEADING_2,
  H3: HeadingLevel.HEADING_3,
}

// Inherits font/size from the Document's default style (set in useExamDocx.ts).
const PARAGRAPH_SPACING = { after: 160 }

function convertInline(node: Node, bold = false, italic = false, size?: number): TextRun[] {
  const runs: TextRun[] = []
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? ''
      if (text) runs.push(new TextRun({ text, bold, italics: italic, size }))
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element
      const tag = el.tagName
      const nextBold = bold || tag === 'STRONG' || tag === 'B'
      const nextItalic = italic || tag === 'EM' || tag === 'I'
      runs.push(...convertInline(el, nextBold, nextItalic, size))
    }
  }
  return runs
}

export interface HtmlToDocxOptions {
  /** Font size in half-points; omitted, text inherits the document default. */
  size?: number
  /** Extra space before the first paragraph, in twentieths of a point. */
  spaceBefore?: number
}

/**
 * Converts Tiptap-generated HTML into `docx` paragraphs (headings, bold/italic, lists). Body
 * paragraphs are justified, like the running text of the WP exam sheets.
 */
export function htmlToDocxParagraphs(html: string, options: HtmlToDocxOptions = {}): Paragraph[] {
  if (!html.trim()) return []
  const { size, spaceBefore } = options

  const body = new DOMParser().parseFromString(html, 'text/html').body
  const paragraphs: Paragraph[] = []

  for (const node of Array.from(body.children)) {
    const tag = node.tagName

    if (tag in HEADING_LEVELS) {
      paragraphs.push(
        new Paragraph({
          heading: HEADING_LEVELS[tag],
          spacing: PARAGRAPH_SPACING,
          children: convertInline(node),
        }),
      )
    } else if (tag === 'UL' || tag === 'OL') {
      Array.from(node.children)
        .filter((li) => li.tagName === 'LI')
        .forEach((li, index) => {
          const children =
            tag === 'OL'
              ? [
                  new TextRun({ text: `${index + 1}. `, size }),
                  ...convertInline(li, false, false, size),
                ]
              : convertInline(li, false, false, size)
          paragraphs.push(
            new Paragraph(
              tag === 'UL'
                ? { bullet: { level: 0 }, spacing: PARAGRAPH_SPACING, children }
                : { spacing: PARAGRAPH_SPACING, children },
            ),
          )
        })
    } else if (tag === 'P' || tag === 'BLOCKQUOTE') {
      const children = convertInline(node, false, tag === 'BLOCKQUOTE', size)
      if (children.length) {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: PARAGRAPH_SPACING,
            children,
          }),
        )
      }
    } else {
      const text = node.textContent?.trim()
      if (text) {
        paragraphs.push(
          new Paragraph({ spacing: PARAGRAPH_SPACING, children: [new TextRun({ text })] }),
        )
      }
    }
  }

  if (spaceBefore && paragraphs.length) {
    // Paragraph options are fixed once built, so the gap above the block is a spacer paragraph.
    paragraphs.unshift(new Paragraph({ spacing: { before: spaceBefore, after: 0 }, children: [] }))
  }
  return paragraphs
}
