import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import cburnettCss from '~/assets/vendor/chessground-cburnett.css.txt?raw'

// `app/assets/vendor/chessground-cburnett.css.txt` is a copy of the piece-set stylesheet shipped
// with `chessground`; the package's own .css cannot be imported with `?raw` without breaking the
// production build (see the header of the vendored file). A copy can go stale on an upgrade, so
// pin it to the installed package here.
// Paths are resolved from the working directory rather than `import.meta.url`, which is not a
// file:// URL under the jsdom environment.
const read = (relative: string) => readFileSync(resolve(process.cwd(), relative), 'utf8')

describe('vendored cburnett piece set', () => {
  it('matches the stylesheet shipped with the installed chessground', () => {
    const vendored = read('app/assets/vendor/chessground-cburnett.css.txt')
    const upstream = read('node_modules/chessground/assets/chessground.cburnett.css')
    // The vendored file only prepends a provenance comment; the rules themselves must be identical.
    const normalise = (css: string) => css.replace(/\r\n/g, '\n')
    expect(normalise(vendored).endsWith(normalise(upstream))).toBe(true)
  })

  it('is importable with ?raw and yields a data URI for all twelve pieces', () => {
    const re =
      /piece\.(pawn|knight|bishop|rook|queen|king)\.(white|black)\s*\{\s*background-image:\s*url\('(data:[^']+)'\)/g
    // Guards the regression this vendored copy was introduced for: importing the package's .css
    // with `?raw` silently resolved to an empty string, leaving every diagram without pieces.
    expect([...cburnettCss.matchAll(re)]).toHaveLength(12)
  })
})
