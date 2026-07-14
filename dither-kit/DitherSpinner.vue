<script lang="ts">
import { rgb } from "./palette"
import type { Rgb } from "./palette"
import {
  BAYER4,
  fillOf,
  type PixelColor,
  pixelMatrixFromSeed,
  pixelPrefersReducedMotion,
  xorshift32,
} from "./pixel"

const CELL = 2
const TAU = Math.PI * 2
const ARC_DEFAULT = Math.PI * 1.5 // 270° of the ring

/** Spin character — seed varies rotation speed and arc sweep, so each seeded
 * spinner has its own cadence; the default stays a readable 270° at ~1 turn/1.6s. */
function spinFromSeed(seed: number) {
  const rand = xorshift32(Math.round(seed) ^ 0x2f72b4a1)
  return { speed: 0.003 + rand() * 0.004, arc: Math.PI * (1.2 + rand() * 0.6) }
}

/** One frame of the arc — a ~3-cell-thick ring band whose density fades from
 * the head to the tail through the Bayer matrix. */
function paintSpinner(
  ctx: CanvasRenderingContext2D,
  cells: number,
  fill: Rgb,
  start: number,
  matrix: number[][] = BAYER4,
  arc: number = ARC_DEFAULT
): void {
  ctx.clearRect(0, 0, cells, cells)
  const c = cells / 2
  const rOuter = c - 0.5
  const rInner = Math.max(1, rOuter - 3)
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const dx = x + 0.5 - c
      const dy = y + 0.5 - c
      const r = Math.hypot(dx, dy)
      if (r < rInner || r > rOuter) continue
      const rel = (Math.atan2(dy, dx) - start + TAU * 2) % TAU
      if (rel > arc) continue
      const density = 1 - 0.8 * (rel / arc)
      if (density <= matrix[y & 3][x & 3]) continue
      ctx.fillStyle = rgb(fill, 1, 0.4 + 0.6 * density)
      ctx.fillRect(x, y, 1, 1)
    }
  }
}
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue"

const props = withDefaults(
  defineProps<{
    size?: number
    color?: PixelColor
    seed?: number
  }>(),
  { size: 20, color: "blue" }
)

const spin = props.seed !== undefined ? spinFromSeed(props.seed) : { speed: 0.004, arc: ARC_DEFAULT }
const matrix = props.seed !== undefined ? pixelMatrixFromSeed(props.seed) : BAYER4

const canvasRef = ref<HTMLCanvasElement | null>(null)

let teardown: (() => void) | undefined

function init(): (() => void) | undefined {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext("2d")
  if (!canvas || !ctx) return undefined
  const fill = fillOf(props.color)
  const cells = Math.max(8, Math.round(props.size / CELL))
  canvas.width = cells
  canvas.height = cells

  let raf = 0
  let last = 0

  paintSpinner(ctx, cells, fill, -Math.PI / 2, matrix, spin.arc)

  if (!pixelPrefersReducedMotion()) {
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (now - last < 33) return // ~30fps
      last = now
      paintSpinner(ctx, cells, fill, (now * spin.speed) % TAU, matrix, spin.arc)
    }
    raf = requestAnimationFrame(frame)
  }

  return () => {
    if (raf) cancelAnimationFrame(raf)
  }
}

onMounted(() => {
  teardown = init()
})
watch(
  () => [props.size, props.color],
  () => {
    teardown?.()
    teardown = init()
  }
)
onBeforeUnmount(() => teardown?.())
</script>

<template>
  <span role="status" aria-label="Loading" class="inline-flex">
    <canvas
      ref="canvasRef"
      :style="{
        width: `${props.size}px`,
        height: `${props.size}px`,
        imageRendering: 'pixelated',
      }"
    />
  </span>
</template>
