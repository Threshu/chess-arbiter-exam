<script setup lang="ts">
import { Chessground } from 'chessground'
import type { Api } from 'chessground/api'
import type { Config } from 'chessground/config'

interface Props {
  fen?: string
  orientation?: 'white' | 'black'
  viewOnly?: boolean
  coordinates?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  orientation: 'white',
  viewOnly: true,
  coordinates: true,
})

const container = ref<HTMLDivElement | null>(null)
let cg: Api | null = null

function buildConfig(): Config {
  return {
    fen: props.fen,
    orientation: props.orientation,
    viewOnly: props.viewOnly,
    coordinates: props.coordinates,
    movable: { free: false, color: undefined },
    draggable: { enabled: !props.viewOnly },
  }
}

onMounted(() => {
  if (!container.value) return
  cg = Chessground(container.value, buildConfig())
})

watch(
  () => [props.fen, props.orientation, props.viewOnly],
  () => {
    cg?.set(buildConfig())
  },
)

onBeforeUnmount(() => {
  cg?.destroy()
  cg = null
})
</script>

<template>
  <div class="aspect-square w-full max-w-[420px]">
    <div ref="container" class="h-full w-full" />
  </div>
</template>
