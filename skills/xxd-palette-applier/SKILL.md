---
name: xxd-palette-applier
description: Apply Chinese traditional color palettes to concrete design surfaces. Use when a user already has colors or a palette and asks where each color should go in a poster, webpage, landing page, card, packaging layout, PPT page, social cover, editorial layout, or visual system.
---

# xxd-palette-applier

## Overview

Convert a palette into placement rules. The goal is to remove the common gap between "these colors are good" and "I know how to use them in the layout."

## Data Rules

- Use project colors from `docs/chinese-color-master-list.md` and `docs/chinese-color-harmony.csv`.
- If the palette came from another source, map its HEX values to the nearest project colors before giving final recommendations.
- Do not introduce extra colors unless the user asks for repair; if repair is needed, explain the replacement.

## Workflow

1. Identify the surface: UI, poster, PPT, packaging, editorial, content cover, or landing page.
2. Group the colors into roles:
   - Ground: background and large quiet fields.
   - Content: title, body, labels, captions.
   - Action: button, link, CTA, selected state.
   - Rhythm: dividers, blocks, secondary surfaces.
   - Detail: ornament, number, badge, highlight.
3. Define hierarchy. Assign the highest-contrast pair to the most important message.
4. Define proportional use:
   - Large field: 50% to 75%.
   - Content and structure: 15% to 35%.
   - Accent: 3% to 10%.
   - Point detail: under 3%.
5. Provide layout-specific instructions. Do not stop at generic role names.
6. Flag misuse: low contrast body text, too many accents, large-area vivid colors, or decorative colors competing with CTA.

## Output

Use this structure:

- Surface diagnosis: what this design surface needs from color.
- Role map: table of role, color name, HEX, component/area, ratio.
- Composition rule: where the eye should land first, second, third.
- Interaction or print note when relevant.
- Misuse checklist: 3 concrete things to avoid.

If the user provides a screenshot or design file description, start with the current hierarchy problem before recommending placement.
