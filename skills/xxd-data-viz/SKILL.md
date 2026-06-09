---
name: xxd-data-viz
description: Create chart and data visualization palettes from Chinese traditional colors. Use when a user needs categorical, sequential, diverging, highlight, dashboard, map, ECharts, D3, Chart.js, or colorblind-aware data palettes with Chinese traditional color identity.
---

# xxd-data-viz

## Purpose

Use this skill when colors must encode data. It should not turn a poster palette into a chart palette; it must choose colors by data meaning, distinguishability, ordering, and accessibility.

## Pain Points This Solves

- Attractive palettes fail charts because categories are not distinct or values are not ordered by lightness.
- Designers mix categorical, sequential, and diverging color logic in one chart.
- Chart color often relies on hue alone, which weakens accessibility and makes legends harder to read.

## Data Contract

- Use the bundled references inside this skill:
  - `references/chinese-color-master-list.md`: full 742-color Markdown source list.
  - `references/chinese-color-harmony.csv`: complete machine-readable harmony table for all 742 colors.
  - `references/chinese-color-harmony.md`: Markdown version of the same harmony relationships.
- Do not treat all harmony colors as chart-ready; validate distinctness or ordering for the chart mode.
- Do not rely on hue alone. Add label, order, pattern, stroke, marker shape, direct labeling, or interaction guidance when needed.

## Chart Mode Workflow

1. Identify data meaning before picking colors:
   - Categorical: unrelated groups.
   - Sequential: low to high values.
   - Diverging: two directions around a meaningful midpoint.
   - Highlight: one or two emphasized series against quiet context.
   - Dashboard semantic: success, warning, danger, info, selected, neutral.
2. Choose selection criteria:
   - Categorical: maximize hue and lightness separation.
   - Sequential: monotonic lightness is more important than poetic harmony.
   - Diverging: balance perceived strength on both sides and reserve a neutral midpoint.
   - Highlight: keep background series quiet and the target unmistakable.
3. Build the palette from project colors only.
4. Add chart implementation details:
   - Background/grid/axis color.
   - Legend or direct labels.
   - Hover and selection color.
   - Missing data and disabled series.
5. If requested, output ECharts, D3, Chart.js, or CSV arrays.

## Output Shape

- Data context: chart type, series count, background, data meaning.
- Mode decision: categorical, sequential, diverging, highlight, or semantic.
- Palette table: order or series, color name, HEX, role, reason.
- Usage rules: legend, labels, grid, hover, selection, missing data.
- Accessibility notes: where labels, markers, strokes, or patterns are required.
- Optional code in the requested chart format.

For charts with more than 12 categories, recommend grouping, sorting, filtering, or interaction rather than forcing more colors.
