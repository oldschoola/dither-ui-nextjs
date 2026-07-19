---
id: TASK-10
title: 'Port app: docs pages + section packs'
status: Done
assignee: []
created_date: '2026-07-19 05:25'
labels: []
dependencies:
  - TASK-2
  - TASK-3
  - TASK-4
  - TASK-5
  - TASK-6
  - TASK-7
  - TASK-8
priority: medium
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Port the docs pages from src/pages/docs/ to dither-next/src/app/docs/ per CONVERSION-GUIDE.md §11.

Sources: DocsPage.vue, DemoCard.vue, PropsTable.vue, components/ (section packs), examples/ (section packs). Each section pack = self-contained component (sections + snippets + local state) + sibling *-nav.ts exporting nav items.

Route mapping: /docs → app/docs/page.tsx; /docs/<section> → app/docs/[section]/page.tsx (dynamic segment). Section ids are PERMANENT deep links — relabel freely but never rename an id.

Key contracts (src/pages/AGENTS.md):
- Sidebar IA: Overview · Handbook (Styling/Composition/Animation/Accessibility) · Examples · Components · Utils.
- Component section anatomy: <section id> → heading row (h2 + open-in-studio link) → muted description → DemoCard (Preview/Code tabs) → optional picker gallery → PropsTable.
- Galleries are PICKERS (aria-pressed buttons drive preview props; chart previews bump replay token). Code tabs computed from picked state.
- SNIPPETS/computed code must match what demo renders; API tables mirror actual kit prop defaults.
- Wayfinding: scroll-spy (IntersectionObserver, rootMargin -56px top) sets activeId + aria-current. Clean /docs/<id> AND legacy #/docs/<id> deep links both restore + shareable.
- Chrome: .chrome translucent header (scroll-edge fade, prefers-reduced-transparency).
- Chart sections link to /studio#new/<type> — keep in sync with CHART_TYPES.

DemoCard: Preview/Code tabs → client component. PropsTable: mirrors kit prop defaults. Legacy hash handling via <LegacyHashRedirect> client component (guide §11).

Depends on ALL kit groups (docs demos every component).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 app/docs/page.tsx + app/docs/[section]/page.tsx routes
- [x] #2 DemoCard Preview/Code tabs (client) + PropsTable
- [x] #3 Section packs keep self-contained shape + *-nav.ts
- [x] #4 Scroll-spy IntersectionObserver (rootMargin -56px) + aria-current
- [x] #5 Permanent section ids preserved
- [x] #6 Legacy #/docs/<id> deep links restore via <LegacyHashRedirect>
- [x] #7 Picker galleries drive preview props + replay token; code tabs match demo
- [x] #8 Chart sections link to /studio#new/<type>
<!-- AC:END -->

## Notes

Ported to `dither-next/src/views/docs/` (renamed from `src/pages/` — Next.js 15
auto-detects `src/pages/` as Pages Router and rejects non-route files like
`docs-data.ts`). All 10 Vue section packs + DocsPage chrome ported to .tsx.
`npx tsc --noEmit` green for all docs files; `npm run build` compiles
successfully (fails only on a pre-existing `hostRef` unused error in
`src/widgets/canvas/Canvas.tsx`, owned by port-appshell). Vue tree untouched.
