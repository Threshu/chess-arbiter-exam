import { nowWithSkew } from '~/utils/time'

// TODO(phase-4): wire to a server-time probe at session start and update skew
// continuously via heartbeat responses. For now this composable just renders
// the local clock plus a static skew offset.
export function useServerTime(serverSkewMs = 0) {
  const serverNow = ref(nowWithSkew(serverSkewMs))

  let raf: number | null = null
  function tick() {
    serverNow.value = nowWithSkew(serverSkewMs)
    raf = requestAnimationFrame(tick)
  }

  onMounted(() => {
    raf = requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => {
    if (raf !== null) cancelAnimationFrame(raf)
  })

  return { serverNow }
}
