<script setup lang="ts">
defineProps<{ label: string; registry: string }>()
const emit = defineEmits<{ replay: [] }>()
</script>

<template>
  <div
    class="group relative flex flex-col rounded-xl border border-transparent bg-card/40 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.07)] transition-shadow hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14)]"
  >
    <div class="mb-3 flex items-center justify-between gap-3">
      <div class="flex items-baseline gap-2">
        <span class="font-mono text-sm text-foreground">{{ label }}</span>
        <span class="font-mono text-[11px] text-muted-foreground">{{ registry }}</span>
      </div>
      <button
        type="button"
        class="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Replay animation"
        @click="emit('replay')"
      >
        <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      </button>
    </div>
    <div class="relative h-56 w-full">
      <slot />
    </div>
  </div>
</template>
