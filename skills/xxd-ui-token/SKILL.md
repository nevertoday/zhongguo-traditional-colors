---
name: xxd-ui-token
description: Convert Chinese traditional colors into practical UI design tokens. Use when a user asks for CSS variables, Tailwind theme colors, Figma tokens, light and dark mode mapping, semantic UI roles, component color rules, or developer handoff based on Chinese traditional colors.
---

# xxd-ui-token

## Overview

Turn Chinese traditional colors into semantic UI tokens that designers and developers can actually use. This skill is for product interfaces, websites, tools, dashboards, and design systems.

## Data Rules

- Use only project colors from `docs/chinese-color-master-list.md` and `docs/chinese-color-harmony.csv`.
- Do not synthesize tints or alpha variants as standalone colors unless the user explicitly requests derived UI states.
- When contrast is uncertain, route to `xxd-accessible-color` or calculate contrast before claiming a text/background pair is safe.

## Token Model

Use semantic roles instead of decorative names:

- `color.bg.canvas`
- `color.bg.surface`
- `color.bg.subtle`
- `color.text.primary`
- `color.text.secondary`
- `color.text.inverse`
- `color.border.default`
- `color.action.primary`
- `color.action.hover`
- `color.action.active`
- `color.focus`
- `color.accent`
- `color.danger`, `color.warning`, `color.success`, `color.info` only when needed

## Workflow

1. Identify interface type: content site, SaaS, dashboard, creative tool, mobile app, or marketing page.
2. Choose light-mode tokens first. Avoid large dark blocks unless the product needs strong editorial contrast.
3. Create dark-mode equivalents using colors from the dataset, not inverted values.
4. Define component usage for buttons, links, cards, inputs, selection, focus, and alerts.
5. Output code in the requested format:
   - CSS variables by default.
   - Tailwind config if the user mentions Tailwind.
   - Figma token JSON if the user mentions Figma or design tokens.
6. Include a contrast warning list for any pair that needs verification.

## Output

Default output:

- Token table: token, light value, dark value, Chinese color name, role.
- CSS variables block.
- Component map: button, link, card/surface, input, selection, focus.
- Notes: accessibility risks, dark-mode risks, and where not to use accent colors.

Do not name tokens after visual intent like `ancient-red` or `pretty-blue` unless also providing semantic aliases.
