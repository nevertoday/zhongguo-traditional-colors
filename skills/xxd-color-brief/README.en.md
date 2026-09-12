<div align="center">

# xxd-color-brief

### Turn vague visual direction into a practical traditional-color brief

<strong>English</strong> · <a href="README.md">简体中文</a>

</div>

## What it does

This Skill translates mood words, client feedback, references, and audience positioning into color constraints a designer can defend. It makes temperature, lightness, saturation, cultural signal, contrast, and risk observable before palette selection begins.

## Workflow

1. Identify the surface: brand, UI, poster, content series, chart, packaging, or audit.
2. Translate adjectives into measurable color constraints.
3. Detect conflicts such as “young and classical” or “premium but relaxed.”
4. Select three to five starting colors from the 742-color dataset with role hypotheses.
5. State concrete exclusions and recommend the next Skill.

The Skill does not build a complete palette unless requested. It prepares a brief that can move cleanly into `$xxd-palette-builder`, `$xxd-palette-applier`, `$xxd-ui-token`, or another specialized Skill.

## Output

You receive a project-facing brief name, a plain-language direction, a constraint table, starting colors with HEX values, an avoid list, and one recommended next step.

## Install and use

```bash
npx skills add https://github.com/nevertoday/zhongguo-traditional-colors --skill xxd-color-brief
```

Invoke `$xxd-color-brief` with mood words, audience, references, feedback, or an unclear visual direction.
