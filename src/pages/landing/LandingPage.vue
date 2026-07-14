<script setup lang="ts">
import {
  Area,
  AreaChart,
  DitherButton,
  DitherGradient,
  type DitherColor,
} from "@dither-kit"

// One quiet, deterministic series — a single focal point.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const heroData = MONTHS.map((month, i) => ({
  month,
  v: 6 + Math.sin(i * 0.9) * 2.4 + Math.sin(i * 2.1) * 1.2,
}))
const heroConfig = { v: { color: "blue" as DitherColor } }
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background font-mono text-foreground antialiased">
    <!-- Header -->
    <header class="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-6 text-xs">
      <span class="tracking-tight">dither-ui</span>
      <a
        href="#/studio"
        class="text-muted-foreground transition-colors hover:text-foreground"
      >studio →</a>
    </header>

    <!-- Hero: one statement, one action, one visual. -->
    <main class="relative isolate flex flex-1 flex-col overflow-hidden">
      <DitherGradient from="blue" direction="up" :opacity="0.14" :cell="4" class="-z-10" />
      <div class="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 pt-24 sm:pt-32">
        <h1 class="max-w-xl text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.15] tracking-tight text-balance">
          A dithered UI toolkit for Vue.
        </h1>
        <p class="mt-5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
          Charts, buttons, avatars and gradients — rendered pixel by pixel on canvas.
        </p>
        <div class="mt-10">
          <a href="#/studio">
            <DitherButton color="blue" variant="gradient" class="px-6 py-3 text-[13px]">
              Open studio
            </DitherButton>
          </a>
        </div>

        <div class="mt-20 h-48 sm:mt-24 sm:h-64">
          <AreaChart
            :data="heroData"
            :config="heroConfig"
            :interactive="false"
            :margins="{ top: 8, right: 0, bottom: 0, left: 0 }"
          >
            <Area data-key="v" variant="gradient" />
          </AreaChart>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-border/60">
      <div class="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-6 text-[11px] text-muted-foreground">
        <span>© {{ new Date().getFullYear() }} dither-ui.com</span>
        <span>MIT</span>
      </div>
    </footer>
  </div>
</template>
