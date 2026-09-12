import { Chess } from 'chess.js'
// Reuse the same "cburnett" piece set already bundled with `chessground` (used for the
// on-screen board) so exported diagrams look identical instead of relying on system fonts.
// Loaded from a vendored copy rather than straight from the package - see the file header
// for why importing the package's .css with `?raw` breaks the production build.
import cburnettCss from '~/assets/vendor/chessground-cburnett.css.txt?raw'

const PIECE_NAME_TO_LETTER: Record<string, string> = {
  pawn: 'p',
  knight: 'n',
  bishop: 'b',
  rook: 'r',
  queen: 'q',
  king: 'k',
}

function parsePieceDataUris(css: string): Record<string, string> {
  const map: Record<string, string> = {}
  const re =
    /piece\.(pawn|knight|bishop|rook|queen|king)\.(white|black)\s*\{\s*background-image:\s*url\('([^']+)'\)/g
  for (const match of css.matchAll(re)) {
    const [, name, color, dataUri] = match
    const letter = PIECE_NAME_TO_LETTER[name!]
    map[`${color === 'white' ? 'w' : 'b'}${letter}`] = dataUri!
  }
  return map
}

const PIECE_DATA_URIS = parsePieceDataUris(cburnettCss)
const pieceImageCache = new Map<string, HTMLImageElement>()

async function getPieceImage(key: string): Promise<HTMLImageElement | null> {
  const dataUri = PIECE_DATA_URIS[key]
  if (!dataUri) return null
  let img = pieceImageCache.get(key)
  if (!img) {
    img = new Image()
    img.src = dataUri
    try {
      // Not every environment can decode the piece SVGs - jsdom, for instance, does not even
      // implement `decode()`. Losing a piece is bad, but losing the whole export over one image
      // is worse, so warn and let the board render without it.
      await img.decode()
    } catch (error) {
      console.warn(`[chessDiagramImage] could not decode piece "${key}"`, error)
      return null
    }
    pieceImageCache.set(key, img)
  }
  return img
}

const LIGHT_SQUARE = '#f0d9b5'
const DARK_SQUARE = '#b58863'

/** Renders a FEN position to a PNG (cburnett piece set) for embedding in exported documents. */
export async function fenToPngBytes(
  fen: string,
  orientation: 'white' | 'black' = 'white',
  size = 640,
): Promise<Uint8Array> {
  const board = new Chess(fen).board()

  const usedKeys = new Set<string>()
  for (const row of board) {
    for (const piece of row) {
      if (piece) usedKeys.add(`${piece.color}${piece.type}`)
    }
  }
  const images = new Map<string, HTMLImageElement>()
  await Promise.all(
    Array.from(usedKeys, async (key) => {
      const img = await getPieceImage(key)
      if (img) images.set(key, img)
    }),
  )

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  const squareSize = size / 8

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0
      ctx.fillStyle = isLight ? LIGHT_SQUARE : DARK_SQUARE
      const x = orientation === 'white' ? col : 7 - col
      const y = orientation === 'white' ? row : 7 - row
      ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize)

      const piece = board[row]?.[col]
      if (!piece) continue
      const img = images.get(`${piece.color}${piece.type}`)
      if (!img) continue
      ctx.drawImage(img, x * squareSize, y * squareSize, squareSize, squareSize)
    }
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Failed to encode diagram as PNG')
  return new Uint8Array(await blob.arrayBuffer())
}
