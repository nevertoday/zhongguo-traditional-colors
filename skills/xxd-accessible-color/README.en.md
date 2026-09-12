<div align="center">

# xxd-accessible-color

### Check and repair traditional-color combinations for readable, accessible interfaces and charts

<strong>English</strong> · <a href="README.md">简体中文</a>

</div>

## What it does

This Skill tests Chinese traditional color combinations against real reading and interaction needs. It evaluates text, buttons, focus rings, borders, chart series, statuses, and selections, then proposes concrete repairs from the project's 742-color dataset.

## Workflow

1. Identify each color's role and its foreground/background pair.
2. Calculate WCAG contrast when HEX values are available.
3. Classify each pair as pass, conditional, or fail.
4. Replace failing pairs with nearby project colors while preserving the intended mood.
5. Add labels, icons, patterns, markers, or strokes when color alone is not enough.

Normal text targets 4.5:1, large text targets 3:1, and functional UI graphics target 3:1. The result always includes ratios or clearly marks values that still need verification.

## Output

You receive a pass/conditional/fail summary, a pair table, repair options, usage rules, and non-color cue recommendations for charts and states.

## Install and use

```bash
npx skills add https://github.com/nevertoday/zhongguo-traditional-colors --skill xxd-accessible-color
```

Invoke `$xxd-accessible-color` with HEX values, a palette, a screenshot with sampled colors, or a UI/chart description.

The bundled references live in `references/chinese-color-master-list.md`, `references/chinese-color-harmony.csv`, and `references/chinese-color-harmony.md`.
