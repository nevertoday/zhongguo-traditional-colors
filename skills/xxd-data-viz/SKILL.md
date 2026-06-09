---
name: xxd-data-viz
description: Create chart and data-visualization palettes from Chinese traditional colors. Use when a user needs categorical colors, sequential scales, diverging scales, ECharts/D3/Chart.js config, dashboard colors, map colors, legend rules, colorblind-aware chart palettes, or data visualization with Chinese traditional color identity.
---

# xxd-data-viz

## Overview

Build data visualization palettes that carry Chinese traditional color character without sacrificing legibility, category separation, or chart meaning.

## Data Rules

- Use only colors from `docs/chinese-color-master-list.md` and `docs/chinese-color-harmony.csv`.
- Do not treat poster palettes as chart palettes. Chart colors need distinctness and semantic ordering.
- For accessibility, do not rely on hue alone. Add label, order, pattern, stroke, or marker shape guidance when needed.

## Palette Modes

- Categorical: unrelated categories, 3 to 12 colors.
- Sequential: low to high values, ordered by lightness.
- Diverging: negative to positive, two sides plus neutral midpoint.
- Highlight: mostly neutral chart with one emphasized series.
- Dashboard semantic: success, warning, danger, info, neutral, selected.

## Workflow

1. Identify chart type and data meaning.
2. Choose palette mode from the list above.
3. Select colors for separation or order:
   - Categorical: avoid neighboring hues with similar lightness.
   - Sequential: prioritize monotonic lightness.
   - Diverging: balance perceived strength on both sides.
   - Highlight: keep non-highlight colors quiet.
4. Provide implementation output if requested: ECharts, D3 scale array, Chart.js colors, or CSV list.
5. Add legend and label rules.

## Output

Use this structure:

- Data context: chart type, number of series, background.
- Palette table: series/order, color name, HEX, role.
- Usage rules: legend, labels, hover/selection, grid/background.
- Accessibility notes: where labels, markers, or strokes are needed.
- Optional code: ECharts/D3/Chart.js when requested.

For charts with more than 12 categories, recommend grouping, sorting, or interaction instead of forcing too many colors.
