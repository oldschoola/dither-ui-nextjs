<script setup lang="ts">
import { computed, ref } from "vue"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  type ChartConfig,
  DitherAvatar,
  DitherButton,
  DitherGradient,
  Grid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  Sparkline,
  Tooltip,
  XAxis,
  YAxis,
} from "./components/dither-kit"
import ChartCard from "./marketing/ChartCard.vue"
import ControlPanel from "./marketing/ControlPanel.vue"
import { controls, DIRECTIONS, replay, VARIANTS } from "./marketing/controls"
import {
  avatarNames,
  marketConfig,
  marketData,
  revenueConfig,
  revenueData,
  skillConfig,
  skillData,
  sparkSeries,
  trafficData,
} from "./marketing/demo-data"
import { useTheme } from "./marketing/useTheme"

const { dark, toggle } = useTheme()

// Hero config tracks the color knob so the palette control reads live.
const heroConfig = computed<ChartConfig>(() => ({
  desktop: { label: "Desktop", color: controls.color },
  mobile: { label: "Mobile", color: "purple" },
}))

// Install block — package-manager tabs swap the runner prefix.
const PM = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx" } as const
type Pm = keyof typeof PM
const pm = ref<Pm>("npm")
const addTargets = ["area-chart", "bar-chart", "pie-chart", "radar-chart", "dither-kit"]
const commands = computed(() =>
  addTargets.map((t) => `${PM[pm.value]} @dither-kit/cli add ${t}`)
)
const copied = ref<string | null>(null)
async function copy(cmd: string) {
  try {
    await navigator.clipboard.writeText(cmd)
    copied.value = cmd
    setTimeout(() => {
      if (copied.value === cmd) copied.value = null
    }, 1400)
  } catch {
    copied.value = null
  }
}

const knobs = [
  { name: "variant", values: '"gradient" | "dotted" | "hatched" | "solid"' },
  { name: "bloom", values: '"off" | "low" | "high" | "aura" | { blur, brightness, … }' },
  { name: "stackType", values: '"default" | "stacked" | "percent"' },
  { name: "direction", values: '"up" | "down" | "left" | "right"  (DitherGradient)' },
  { name: "colors", values: "green blue purple pink orange red grey" },
  { name: "animate", values: "animationDuration + replayToken for entrance replay" },
  { name: "interactive", values: "false = decorative spark, no crosshair or tooltip" },
]
</script>

<template>
  <div class="min-h-screen bg-background font-mono text-foreground antialiased">
    <ControlPanel />

    <!-- Top bar -->
    <header
      class="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur"
    >
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <div class="flex items-center gap-2">
          <span class="inline-block size-3 rounded-[2px] bg-foreground" />
          <span class="text-sm tracking-tight">dither-kit</span>
          <span
            class="ml-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
            >vue</span
          >
        </div>
        <nav class="flex items-center gap-5 text-xs text-muted-foreground">
          <a href="#charts" class="hidden transition-colors hover:text-foreground sm:inline">charts</a>
          <a href="#primitives" class="hidden transition-colors hover:text-foreground sm:inline">primitives</a>
          <a href="#knobs" class="hidden transition-colors hover:text-foreground sm:inline">knobs</a>
          <a
            href="https://github.com/Boring-Software-Inc/dither-kit"
            class="transition-colors hover:text-foreground"
            >github</a
          >
          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-md border border-border transition-colors hover:text-foreground"
            :aria-label="dark ? 'Switch to light' : 'Switch to dark'"
            @click="toggle"
          >
            <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2">
              <template v-if="dark">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </template>
              <path v-else d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
            </svg>
          </button>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden border-b border-border">
      <DitherGradient :from="controls.color" direction="up" :opacity="0.4" bloom="low" />
      <div class="relative mx-auto max-w-5xl px-5 pb-14 pt-16">
        <h1 class="text-4xl tracking-tight sm:text-5xl">dither-kit</h1>
        <p class="mt-3 text-sm text-muted-foreground">
          five chart types, generative avatars, buttons, and gradient washes on
          one tiny canvas engine — a Vue 3 port.
        </p>
        <p class="mt-6 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
          Composable, <span class="text-foreground">dithered</span> charts with a
          children-as-config API. Ordered-dither fills that hold up in light and
          dark, entrance animations, a gliding scrub tooltip, selection, winking
          sparkles, and colour bloom.
        </p>

        <div class="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span>scrub it, hover a legend entry to spotlight, click to lock it</span>
          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-md border border-border transition-colors hover:text-foreground"
            aria-label="Replay"
            @click="replay()"
          >
            <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>

        <div
          class="relative mt-8 h-[320px] w-full rounded-xl border border-transparent bg-card/40 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.07)]"
        >
          <AreaChart
            :data="trafficData"
            :config="heroConfig"
            :bloom="controls.bloom"
            :stack-type="controls.stackType"
            :animate="controls.animate"
            :interactive="controls.interactive"
            :replay-token="controls.replayToken"
            bloom-on-hover
          >
            <Grid />
            <XAxis dataKey="month" />
            <YAxis />
            <Area dataKey="desktop" :variant="controls.variant" is-clickable />
            <Area dataKey="mobile" :variant="controls.variant" is-clickable />
            <Legend is-clickable />
            <Tooltip labelKey="month" />
          </AreaChart>
        </div>
      </div>
    </section>

    <!-- Install -->
    <section class="mx-auto max-w-5xl px-5 py-14">
      <div class="mb-5 flex items-end justify-between">
        <div>
          <h2 class="text-xl tracking-tight">install</h2>
          <p class="mt-1 text-xs text-muted-foreground">
            copy a component in — files land in <code>components/dither-kit/</code>.
          </p>
        </div>
        <div class="inline-flex rounded-md border border-border bg-background/60 p-0.5">
          <button
            v-for="k in (Object.keys(PM) as Pm[])"
            :key="k"
            type="button"
            class="rounded-[5px] px-2.5 py-1 text-[11px] leading-none transition-colors"
            :class="pm === k ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
            @click="pm = k"
          >
            {{ k }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <button
          v-for="cmd in commands"
          :key="cmd"
          type="button"
          class="group flex items-center justify-between rounded-md border border-border bg-card/40 px-3 py-2.5 text-left text-xs transition-colors hover:border-foreground/25"
          @click="copy(cmd)"
        >
          <span><span class="text-muted-foreground">$ </span>{{ cmd }}</span>
          <span class="text-[11px] text-muted-foreground">{{ copied === cmd ? "copied" : "copy" }}</span>
        </button>
      </div>
    </section>

    <!-- Charts -->
    <section id="charts" class="mx-auto max-w-5xl px-5 pb-6">
      <div class="mb-6 flex items-end justify-between">
        <h2 class="text-xl tracking-tight">charts</h2>
        <span class="text-xs text-muted-foreground">tweak these from the panel ↘</span>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard label="area" registry="area-chart" @replay="replay()">
          <AreaChart
            :data="trafficData"
            :config="heroConfig"
            :bloom="controls.bloom"
            :stack-type="controls.stackType"
            :animate="controls.animate"
            :interactive="controls.interactive"
            :replay-token="controls.replayToken"
          >
            <Grid />
            <XAxis dataKey="month" />
            <YAxis />
            <Area dataKey="mobile" :variant="controls.variant" is-clickable />
            <Area dataKey="desktop" :variant="controls.variant" is-clickable />
            <Legend is-clickable />
            <Tooltip labelKey="month" />
          </AreaChart>
        </ChartCard>

        <ChartCard label="line" registry="area-chart" @replay="replay()">
          <LineChart
            :data="trafficData"
            :config="heroConfig"
            :bloom="controls.bloom"
            :animate="controls.animate"
            :interactive="controls.interactive"
            :replay-token="controls.replayToken"
          >
            <Grid />
            <XAxis dataKey="month" />
            <YAxis />
            <Line dataKey="desktop" is-clickable />
            <Line dataKey="mobile" is-clickable />
            <Legend is-clickable />
            <Tooltip labelKey="month" />
          </LineChart>
        </ChartCard>

        <ChartCard label="bar" registry="bar-chart" @replay="replay()">
          <BarChart
            :data="revenueData"
            :config="revenueConfig"
            :bloom="controls.bloom"
            :stack-type="controls.stackType"
            :animate="controls.animate"
            :interactive="controls.interactive"
            :replay-token="controls.replayToken"
          >
            <Grid />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Bar dataKey="product" :variant="controls.variant" is-clickable />
            <Bar dataKey="services" :variant="controls.variant" is-clickable />
            <Legend is-clickable />
            <Tooltip labelKey="quarter" />
          </BarChart>
        </ChartCard>

        <ChartCard label="pie" registry="pie-chart" @replay="replay()">
          <PieChart
            :data="marketData"
            :config="marketConfig"
            data-key="value"
            name-key="name"
            :inner-radius="0.55"
            :bloom="controls.bloom"
            :animate="controls.animate"
            :replay-token="controls.replayToken"
          >
            <Pie :variant="controls.variant" />
            <Legend align="center" is-clickable />
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard label="radar" registry="radar-chart" @replay="replay()">
          <RadarChart
            :data="skillData"
            :config="skillConfig"
            name-key="axis"
            :bloom="controls.bloom"
            :animate="controls.animate"
            :replay-token="controls.replayToken"
          >
            <Radar dataKey="alpha" :variant="controls.variant" is-clickable />
            <Radar dataKey="beta" :variant="controls.variant" is-clickable />
            <Legend align="center" is-clickable />
            <Tooltip />
          </RadarChart>
        </ChartCard>

        <ChartCard label="sparkline" registry="area-chart" @replay="replay()">
          <div class="grid h-full grid-cols-2 gap-3">
            <div
              v-for="(c, i) in (['blue', 'green', 'purple', 'orange'] as const)"
              :key="c"
              class="flex flex-col justify-between rounded-lg border border-border p-3"
            >
              <span class="text-[11px] text-muted-foreground">metric {{ i + 1 }}</span>
              <div class="h-10">
                <Sparkline
                  :data="sparkSeries"
                  :color="c"
                  :variant="controls.variant"
                  :animate="controls.animate"
                  bloom="low"
                  bloom-on-hover
                />
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </section>

    <!-- Primitives -->
    <section id="primitives" class="mx-auto max-w-5xl px-5 py-14">
      <h2 class="text-xl tracking-tight">primitives</h2>
      <p class="mt-1 text-xs text-muted-foreground">standalone — install without the chart engine.</p>

      <!-- Fill variants -->
      <div class="mt-6">
        <p class="mb-3 text-[11px] uppercase tracking-widest text-muted-foreground">fill variants</p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            v-for="v in VARIANTS"
            :key="v"
            class="rounded-xl border border-transparent bg-card/40 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.07)]"
          >
            <div class="mb-2 flex items-center justify-between">
              <span class="text-xs text-foreground">{{ v }}</span>
              <span class="size-2 rounded-[1px]" :style="{ backgroundColor: 'var(--swatch-blue)' }" />
            </div>
            <div class="h-16">
              <Sparkline :data="sparkSeries" color="blue" :variant="v" bloom="low" />
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-6">
        <p class="mb-3 text-[11px] uppercase tracking-widest text-muted-foreground">DitherButton</p>
        <div class="flex flex-wrap items-center gap-3 rounded-xl border border-transparent bg-card/40 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.07)]">
          <DitherButton
            v-for="v in VARIANTS"
            :key="v"
            :variant="v"
            :color="controls.color"
            :bloom="controls.bloom === 'off' ? 'off' : 'low'"
            >{{ v }}</DitherButton
          >
          <span class="ml-2 text-[11px] text-muted-foreground">hover + press lift the dither</span>
        </div>
      </div>

      <!-- Gradient directions -->
      <div class="mt-6">
        <p class="mb-3 text-[11px] uppercase tracking-widest text-muted-foreground">DitherGradient — directions</p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div
            v-for="d in DIRECTIONS"
            :key="d"
            class="rounded-xl border border-transparent bg-card/40 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.07)]"
          >
            <span class="mb-2 block text-xs text-foreground">{{ d }}</span>
            <div class="relative h-24 overflow-hidden rounded-lg border border-border">
              <DitherGradient :from="controls.color" :direction="d" />
            </div>
          </div>
          <div class="rounded-xl border border-transparent bg-card/40 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.07)]">
            <span class="mb-2 block text-xs text-foreground">two-tone</span>
            <div class="relative h-24 overflow-hidden rounded-lg border border-border">
              <DitherGradient from="purple" to="pink" direction="down" />
            </div>
          </div>
        </div>
      </div>

      <!-- Avatars -->
      <div class="mt-6">
        <p class="mb-3 text-[11px] uppercase tracking-widest text-muted-foreground">DitherAvatar — generative from a name</p>
        <div class="flex flex-wrap gap-3 rounded-xl border border-transparent bg-card/40 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.07)]">
          <div
            v-for="name in avatarNames"
            :key="name"
            class="flex flex-col items-center gap-1.5"
            :title="name"
          >
            <DitherAvatar :name="name" :size="48" class="rounded-md" bloom="off" />
            <span class="max-w-[52px] truncate text-[10px] text-muted-foreground">{{ name.split(" ")[0] }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Knobs table -->
    <section id="knobs" class="mx-auto max-w-5xl px-5 pb-14">
      <h2 class="text-xl tracking-tight">knobs</h2>
      <p class="mt-1 text-xs text-muted-foreground">every prop, every value.</p>
      <div class="mt-5 overflow-hidden rounded-xl border border-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.07)]">
        <div
          v-for="(k, i) in knobs"
          :key="k.name"
          class="flex flex-col gap-1 px-4 py-3 text-xs sm:flex-row sm:items-center sm:gap-4"
          :class="i % 2 ? 'bg-card/20' : 'bg-card/40'"
        >
          <span class="w-28 shrink-0">
            <span class="rounded-md border border-border px-2 py-0.5 text-muted-foreground">{{ k.name }}</span>
          </span>
          <span class="text-pretty text-muted-foreground">{{ k.values }}</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative overflow-hidden border-t border-border">
      <DitherGradient from="purple" direction="up" :opacity="0.3" />
      <div class="relative mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-5 py-10 sm:flex-row sm:items-center">
        <div class="flex items-center gap-2">
          <span class="inline-block size-3 rounded-[2px] bg-foreground" />
          <span class="text-sm">dither-kit — vue</span>
        </div>
        <p class="text-xs text-muted-foreground">Vue port. Charts inspired by Evil Charts (evilcharts.com).</p>
      </div>
    </footer>
  </div>
</template>
