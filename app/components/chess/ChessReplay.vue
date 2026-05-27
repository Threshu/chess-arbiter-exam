<script setup lang="ts">
import { Chess, type Move } from 'chess.js'

interface Props {
  pgn: string
  orientation?: 'white' | 'black'
}

const props = withDefaults(defineProps<Props>(), { orientation: 'white' })

const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const parseError = ref<string | null>(null)
const moves = ref<Move[]>([])
const moveIndex = ref(0)

function parse() {
  try {
    parseError.value = null
    const chess = new Chess()
    chess.loadPgn(props.pgn)
    moves.value = chess.history({ verbose: true })
    moveIndex.value = 0
  } catch (e) {
    parseError.value = e instanceof Error ? e.message : 'Invalid PGN'
    moves.value = []
  }
}

watch(() => props.pgn, parse, { immediate: true })

const currentFen = computed(() => {
  if (moves.value.length === 0) return startFen
  const c = new Chess()
  for (let i = 0; i < moveIndex.value; i++) {
    const m = moves.value[i]
    if (m) c.move({ from: m.from, to: m.to, promotion: m.promotion })
  }
  return c.fen()
})

const lastMoveSan = computed(() =>
  moveIndex.value > 0 ? moves.value[moveIndex.value - 1]?.san : null,
)

function start() {
  moveIndex.value = 0
}
function prev() {
  if (moveIndex.value > 0) moveIndex.value--
}
function next() {
  if (moveIndex.value < moves.value.length) moveIndex.value++
}
function end() {
  moveIndex.value = moves.value.length
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'Home') start()
  else if (e.key === 'End') end()
}
</script>

<template>
  <div
    role="slider"
    :aria-valuenow="moveIndex"
    :aria-valuemin="0"
    :aria-valuemax="moves.length"
    aria-label="Chess position"
    class="flex flex-col gap-3"
    tabindex="0"
    @keydown="onKey"
  >
    <ChessBoard :fen="currentFen" :orientation="orientation" />

    <div v-if="parseError" class="text-danger text-sm">{{ parseError }}</div>

    <div v-else class="flex items-center justify-center gap-2">
      <UiButton size="sm" variant="ghost" :disabled="moveIndex === 0" @click="start">⏮</UiButton>
      <UiButton size="sm" variant="ghost" :disabled="moveIndex === 0" @click="prev">◀</UiButton>
      <span class="text-muted min-w-[80px] self-center text-center text-sm tabular-nums">
        {{ moveIndex }}/{{ moves.length }}
        <span v-if="lastMoveSan" class="text-fg ml-1">({{ lastMoveSan }})</span>
      </span>
      <UiButton size="sm" variant="ghost" :disabled="moveIndex === moves.length" @click="next"
        >▶</UiButton
      >
      <UiButton size="sm" variant="ghost" :disabled="moveIndex === moves.length" @click="end"
        >⏭</UiButton
      >
    </div>
  </div>
</template>
