export function formatRemaining(ms: number): string {
  const clamped = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function nowWithSkew(skewMs: number): number {
  return Date.now() + skewMs
}
