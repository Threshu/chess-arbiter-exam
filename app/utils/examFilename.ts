/** Builds a safe, dated .docx filename from an admin-provided exam title. */
export function buildExamFilename(title: string, date = new Date()): string {
  const slug =
    title
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'egzamin'

  const iso = date.toISOString().slice(0, 10)
  return `${slug}-${iso}.docx`
}
