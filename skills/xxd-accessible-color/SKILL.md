---
name: xxd-accessible-color
description: Check and repair Chinese traditional color combinations for readability and accessibility. Use when a user asks whether text/background colors are readable, WCAG contrast is acceptable, a traditional color palette works in UI, buttons, charts, light mode, dark mode, or needs accessible alternatives.
---

# xxd-accessible-color

## Overview

Evaluate whether Chinese traditional color combinations can be used safely for text, controls, UI states, and data distinctions. Repair failing combinations using only colors from the project dataset.

## Data Rules

- Use `docs/chinese-color-master-list.md` and `docs/chinese-color-harmony.csv` for replacements.
- Use WCAG contrast ratios for text/background evaluation.
- For non-text UI boundaries and chart distinctions, also check whether color is the only cue. Recommend labels, shape, weight, underline, icons, or pattern when needed.
- Do not claim compliance without a ratio or an explicit "needs verification" note.

## Workflow

1. Identify use case: body text, large heading, button label, icon, focus ring, border, chart, status, or decorative color.
2. Build pairs:
   - Foreground/background pairs for text.
   - State pairs for buttons and interactive elements.
   - Adjacent swatches for charts or legends.
3. Calculate contrast ratio when HEX values are available.
4. Classify each pair:
   - Pass: usable as requested.
   - Conditional: usable only for large text, decoration, or non-critical UI.
   - Fail: needs replacement.
5. Repair failures by choosing nearby or harmony-related colors from the project dataset.
6. Add non-color cues when color alone carries meaning.

## Thresholds

- Normal text: target at least 4.5:1.
- Large text: target at least 3:1.
- UI components and graphical objects: target at least 3:1 when the contrast carries function.
- Do not use color alone to communicate required meaning.

## Output

Use this structure:

- Summary: pass/fail count and biggest risk.
- Pair table: foreground, background, role, ratio, status, recommendation.
- Repairs: original pair, replacement pair, why it preserves the visual direction.
- Usage rules: where each pair can and cannot be used.
- Non-color cue suggestions when status, chart, warning, or selection depends on color.

If no concrete HEX values are provided, ask for them or first run `xxd-palette-builder` to produce a testable palette.
