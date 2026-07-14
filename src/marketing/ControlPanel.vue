<script setup lang="ts">
import { ref } from "vue"
import {
  BLOOMS,
  COLORS,
  controls,
  replay,
  STACKS,
  VARIANTS,
} from "./controls"
import Segmented from "./Segmented.vue"

const open = ref(true)
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 w-[min(92vw,340px)]">
    <!-- Collapsed dial -->
    <button
      v-if="!open"
      type="button"
      class="ml-auto flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_24px_-8px_rgba(0,0,0,0.6)] transition-colors hover:border-foreground/30"
      aria-label="Open controls"
      @click="open = true"
    >
      <span class="grid grid-cols-2 gap-0.5">
        <span class="size-1.5 rounded-[1px] bg-current" />
        <span class="size-1.5 rounded-[1px] bg-current opacity-50" />
        <span class="size-1.5 rounded-[1px] bg-current opacity-50" />
        <span class="size-1.5 rounded-[1px] bg-current" />
      </span>
    </button>

    <!-- Panel -->
    <div
      v-else
      class="rounded-xl border border-border bg-card/95 p-3 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_40px_-12px_rgba(0,0,0,0.7)]"
    >
      <div class="mb-3 flex items-center justify-between">
        <span class="font-mono text-xs tracking-tight text-foreground"
          >knobs</span
        >
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            @click="replay()"
          >
            replay
          </button>
          <button
            type="button"
            class="flex size-6 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Collapse controls"
            @click="open = false"
          >
            ×
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2.5">
        <Segmented v-model="controls.variant" :options="VARIANTS" label="variant" />
        <Segmented v-model="controls.bloom" :options="BLOOMS" label="bloom" />
        <Segmented v-model="controls.stackType" :options="STACKS" label="stack" />

        <div class="flex items-center gap-2">
          <span class="w-16 shrink-0 text-[11px] text-muted-foreground">color</span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="c in COLORS"
              :key="c"
              type="button"
              class="size-5 rounded-[4px] border transition-transform hover:scale-110"
              :class="controls.color === c ? 'border-foreground' : 'border-border'"
              :style="{ backgroundColor: `var(--swatch-${c})` }"
              :title="c"
              :aria-label="c"
              @click="controls.color = c"
            />
          </div>
        </div>

        <div class="flex items-center gap-4 pt-0.5">
          <label class="flex cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground">
            <input v-model="controls.animate" type="checkbox" class="accent-foreground" />
            animate
          </label>
          <label class="flex cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground">
            <input v-model="controls.interactive" type="checkbox" class="accent-foreground" />
            interactive
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
