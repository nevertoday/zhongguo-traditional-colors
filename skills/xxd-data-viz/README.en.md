<div align="center">

# xxd-data-viz

### Create chart palettes that preserve traditional-color identity and data clarity

<strong>English</strong> · <a href="README.md">简体中文</a>

</div>

## What it does

This Skill builds categorical, sequential, diverging, highlight, dashboard, map, and semantic palettes from Chinese traditional colors. It chooses colors by data meaning, distinguishability, ordering, and accessibility rather than treating a poster palette as chart-ready.

## Workflow

1. Identify the chart mode and what the data means.
2. Select colors for hue separation, monotonic lightness, balanced divergence, or quiet context.
3. Validate the palette against the requested background and series count.
4. Define grid, axis, legend, hover, selection, missing-data, and disabled states.
5. Add labels, markers, strokes, patterns, or direct annotation wherever hue alone is insufficient.

For more than 12 categories, grouping, sorting, filtering, or interaction is usually safer than adding more colors.

## Output

You receive a mode decision, ordered palette table with HEX values, usage and accessibility rules, and optional ECharts, D3, Chart.js, or CSV output.

## Install and use

```bash
npx skills add https://github.com/nevertoday/zhongguo-traditional-colors --skill xxd-data-viz
```

Invoke `$xxd-data-viz` with chart type, series count, background, data meaning, and target chart library when relevant.
