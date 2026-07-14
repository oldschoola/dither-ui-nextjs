<script setup lang="ts">
import { editor, selectArtboard } from "@/entities/editor"

const GLYPH: Record<string, string> = {
  area: "▲",
  line: "╱",
  bar: "▮",
  pie: "◕",
  radar: "◆",
}
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <p class="mb-1 px-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">artboards</p>
    <button
      v-for="a in editor.artboards"
      :key="a.id"
      type="button"
      class="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors"
      :class="
        editor.selectedArtboardId === a.id
          ? 'bg-accent/15 text-foreground'
          : 'text-muted-foreground hover:bg-card'
      "
      @click="selectArtboard(a.id)"
    >
      <span
        class="w-3 shrink-0 text-center text-[11px]"
        :class="editor.selectedArtboardId === a.id ? 'text-accent' : 'text-muted-foreground/70'"
        >{{ GLYPH[a.chart.type] }}</span
      >
      <span class="truncate">{{ a.name }}</span>
      <span class="ml-auto shrink-0 text-[10px] text-muted-foreground/60">{{ a.chart.type }}</span>
    </button>
  </div>
</template>
