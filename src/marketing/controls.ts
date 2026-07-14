import { reactive } from "vue"
import type {
  AreaVariant,
  BloomLevel,
  DitherColor,
  StackType,
} from "../components/dither-kit"

/** Shared live controls — the floating dial writes here, every chart reads it.
 * One source of truth so "tweak these charts from the panel" actually works. */
export const controls = reactive({
  variant: "gradient" as AreaVariant,
  bloom: "low" as BloomLevel,
  stackType: "default" as StackType,
  color: "blue" as DitherColor,
  animate: true,
  interactive: true,
  replayToken: 0,
})

export function replay() {
  controls.replayToken += 1
}

export const VARIANTS: AreaVariant[] = ["gradient", "dotted", "hatched", "solid"]
export const BLOOMS: BloomLevel[] = ["off", "low", "high", "aura"]
export const STACKS: StackType[] = ["default", "stacked", "percent"]
export const COLORS: DitherColor[] = [
  "green",
  "blue",
  "purple",
  "pink",
  "orange",
  "red",
  "grey",
]
export const DIRECTIONS = ["up", "down", "left", "right"] as const
