---
name: xxd-palette-builder
description: Build complete practical palettes from the Chinese traditional color dataset. Use when a user needs a project-ready palette, main/support/accent colors, color ratios, alternate schemes, or wants to turn one Chinese traditional color, HEX, mood, brand, poster, UI, or packaging direction into usable color combinations.
---

# xxd-palette-builder

## Overview

Generate complete palettes from the 742-color dataset and harmony CSV. This is for choosing the actual colors, not explaining color theory.

## Data Rules

- Load `docs/chinese-color-harmony.csv` first. Use its `主色`, `辅色`, `点缀色`, `同类色`, `邻近色`, `互补色`, `冷暖对照`, `明色搭配`, `暗色搭配`, `灰调搭配`, and `中性色搭配` columns.
- Verify every recommended HEX exists in the current 742-color data. Do not invent derived tints.
- For outside HEX input, map to the nearest listed color and label it as a match.
- Prefer palette usefulness over showing every harmony type.

## Palette Types

Choose one type based on the user need:

- Quiet system: neutral background, restrained main color, low-saturation support.
- Expressive campaign: strong main color, clear accent, controlled contrast.
- Editorial culture: paper-like background, ink-like text, one poetic accent.
- Digital product: semantic roles, contrast-safe text/background pairs.
- Premium packaging: deep base, metallic or warm accent, soft support.

## Workflow

1. Identify the surface and risk: screen, print, social image, data viz, brand system, or packaging.
2. Select one anchor color from the dataset.
3. Build 2 or 3 palette options:
   - Safe option: high usability, lower contrast drama.
   - Character option: stronger Chinese traditional identity.
   - Contrast option: more visual energy, only if the task needs it.
4. Assign roles. Never output a palette as unordered swatches.
5. Add proportions. Use concrete percentages.
6. Include a "do not use like this" note for each palette.

## Output

For each palette, provide:

- Palette name.
- Best use case.
- Color table: role, color name, HEX, ratio, why.
- Usage notes: background, title, body text, controls, accent, decoration.
- Risk note: contrast, print drift, over-saturation, cultural cliche, or dark-mode issue.
- Next skill suggestion: usually `xxd-palette-applier`, `xxd-ui-token`, or `xxd-accessible-color`.

Keep the final recommendation to 1 palette unless the user asks for alternatives.
