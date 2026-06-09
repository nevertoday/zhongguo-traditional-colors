---
name: xxd-ui-token
description: Convert Chinese traditional colors into practical UI design tokens. Use when a user asks for CSS variables, Tailwind theme colors, Figma variables, light and dark modes, semantic color roles, component states, or designer developer handoff based on Chinese traditional colors.
---

# xxd-ui-token

## Purpose

Use this skill when traditional colors need to enter a product interface or design system. The output must be usable by both designers and developers, not just look poetic.

## Pain Points This Solves

- Teams hand off HEX values without semantic roles, so developers hardcode colors inconsistently.
- Primitive colors and component states get mixed together, making dark mode and future redesigns brittle.
- Chinese traditional colors often need accessible, restrained UI mapping instead of decorative naming.

## Data Contract

- Use the bundled references inside this skill:
  - `references/chinese-color-master-list.md`: full 742-color Markdown source list.
  - `references/chinese-color-harmony.csv`: complete machine-readable harmony table for all 742 colors.
  - `references/chinese-color-harmony.md`: Markdown version of the same harmony relationships.
- Do not synthesize tints or alpha variants as standalone source colors unless the user explicitly asks for derived states.
- When contrast is uncertain, calculate it or route to `xxd-accessible-color` before claiming safety.
- Keep traditional color names as metadata; token names should be semantic.

## Token Architecture

Create tokens in layers:

- Primitive reference: `color.ref.ruban`, `color.ref.yuebai`, or similar project-color aliases.
- Semantic role: `color.bg.canvas`, `color.text.primary`, `color.action.primary`.
- Component role: `button.primary.bg`, `input.border.focus`, `tag.selected.bg` only when requested.
- Mode mapping: light and dark values point to project colors, not inverted values.

## Workflow

1. Identify interface context: content site, SaaS, dashboard, tool, mobile app, marketing page, or documentation.
2. Decide token scope:
   - Starter theme: core background, text, action, border, focus.
   - Product theme: states, alerts, selection, charts, overlays.
   - Migration: map existing CSS/Figma colors to semantic tokens first.
3. Build light mode around readability and white or pale canvas unless the product needs strong editorial contrast.
4. Build dark mode as its own mapping using project colors; do not invert.
5. Define state behavior for hover, active, selected, disabled, focus, success, warning, danger, and info only when needed.
6. Output in the requested format:
   - CSS variables by default.
   - Tailwind config when Tailwind is named.
   - Figma variables or token JSON when Figma/design tokens are named.

## Output Shape

- Token table: token, light value, dark value, Chinese color name, source role.
- Code block in the requested format.
- Component map: button, link, surface, input, selection, focus, alerts.
- Handoff notes: which tokens are stable, which are optional, and which pairs need contrast verification.
- Migration notes when the user provides existing colors.

Avoid names like `ancient-red` as final tokens unless they are only primitive references with semantic aliases above them.
