---
name: xxd-color-brief
description: Turn vague visual direction into a practical Chinese traditional color brief. Use when a user asks for Chinese traditional color direction, mood translation, project color positioning, or help converting words like 高级、东方、年轻、科技感、温柔、克制 into usable palette constraints before choosing colors.
---

# xxd-color-brief

## Overview

Create a decision-ready color brief before generating palettes. The output should help a designer understand what kind of Chinese traditional colors to use, what to avoid, and which palette workflow to run next.

## Data Rules

- Use only colors traceable to `docs/chinese-color-master-list.md` and `docs/chinese-color-harmony.csv`.
- When recommending a starting color, include color name, HEX, and why it matches the brief.
- If user input includes a HEX value outside the 742-color set, map it to the closest traditional colors and say it is a mapping, not a new source color.

## Workflow

1. Extract the real design job: brand, UI, poster, data, content series, packaging, or audit.
2. Translate adjectives into constraints: mood, temperature, contrast, saturation, brightness, and risk.
3. Choose 3 to 5 starting colors from the 742-color set. Prefer colors with enough contrast and clear role potential.
4. State what not to use. Avoid broad warnings; name the actual color family or usage risk.
5. Route the user to the next skill:
   - Palette generation: `xxd-palette-builder`
   - Placement rules: `xxd-palette-applier`
   - UI tokens: `xxd-ui-token`
   - Accessibility: `xxd-accessible-color`
   - Brand system: `xxd-brand-system`
   - Data visualization: `xxd-data-viz`
   - Existing design diagnosis: `xxd-existing-design-audit`
   - Content series: `xxd-content-series`
   - Print and packaging: `xxd-print-packaging`

## Output

Use this structure:

- Brief name: one short project-facing phrase.
- Visual position: 2 to 4 sentences in plain Chinese.
- Color constraints: temperature, contrast, saturation, brightness, usage risk.
- Starting colors: 3 to 5 rows with role, color name, HEX, reason.
- Avoid: 2 to 4 concrete avoidances.
- Next action: name the next skill and what it should produce.

Keep it short. This skill defines direction; it does not produce a full palette unless the user explicitly asks for one.
