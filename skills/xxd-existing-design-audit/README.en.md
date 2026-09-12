<div align="center">

# xxd-existing-design-audit

### Audit an existing design and repair its palette with Chinese traditional colors

<strong>English</strong> · <a href="README.md">简体中文</a>

</div>

## What it does

This Skill starts from screenshots, HEX values, CSS variables, Figma styles, brand colors, UI themes, or posters. It preserves what works, diagnoses role and contrast problems, and recommends a focused repair instead of an unnecessary redesign.

## Workflow

1. Inventory colors and assign current roles.
2. Find duplicate accents, weak hierarchy, contrast failures, and light/dark mismatches.
3. Map each input color to one to three nearest project colors.
4. Choose a conservative, balanced, or full-system repair level.
5. Mark each color keep, merge, replace, remove, or reserve.

Screenshot matches are exact only when sampled HEX values are supplied; otherwise the audit describes likely issues and asks for sampling when precision matters.

## Output

The result includes a diagnosis, inventory table, repair plan, final role palette, migration notes for CSS/Figma/tokens, and a recommended next Skill.

## Install and use

```bash
npx skills add https://github.com/nevertoday/zhongguo-traditional-colors --skill xxd-existing-design-audit
```

Invoke `$xxd-existing-design-audit` with a screenshot, color list, source file, design link, or current palette description.
