---
id: TASK-9
title: 'Port app: landing page'
status: Done
assignee: []
created_date: '2026-07-19 05:25'
labels: []
dependencies:
  - TASK-2
  - TASK-3
  - TASK-7
priority: medium
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the landing page from src/pages/landing/ to dither-next/src/app/page.tsx per CONVERSION-GUIDE.md §11.

Source: src/pages/landing/LandingPage.vue (Japanese-minimal Ma/Kanso direction — one statement/action/visual).

Key contracts (from src/pages/AGENTS.md):
- Load choreography: .reveal stagger (0/90/180/300ms), disabled under prefers-reduced-motion.
- Sprite crops (public/faces.webp + public/sprites.webp) use MEASURED constants (FACES, emote boxes, FACE_Y/FACE_H) — port verbatim, never eyeball. faces.webp has transparency baked in; NO runtime getImageData chroma-keying.
- Emote hover reactions are CSS-only (.emote + .group:hover); no JS timers.
- Footer: cropped giant wordmark at text-foreground/[0.045].

Port: Server Component shell + client sections for canvas/reveal. Route: app/page.tsx. Keep all measured sprite constants. CSS reveal stagger via prefers-reduced-motion media query.

Depends on kit (Charts, Standalone, Feedback) being ported.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 app/page.tsx renders landing with Japanese-minimal restraint
- [x] #2 .reveal stagger ported, prefers-reduced-motion disabled
- [x] #3 Sprite measured constants (FACES/FACE_Y/FACE_H) ported verbatim
- [x] #4 Emote hover CSS-only, no JS timers
- [x] #5 Footer cropped wordmark token
