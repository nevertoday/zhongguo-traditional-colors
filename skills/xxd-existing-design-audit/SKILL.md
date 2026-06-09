---
name: xxd-existing-design-audit
description: Audit an existing design or color list and translate it into Chinese traditional colors. Use when a user provides screenshots, HEX values, brand colors, Figma descriptions, CSS variables, UI themes, posters, or asks what is wrong with a design palette and how to replace or repair it using Chinese traditional colors.
---

# xxd-existing-design-audit

## Overview

Diagnose a current palette, find the nearest Chinese traditional color matches, and propose a practical repair path. This is for improving existing work, not creating from a blank page.

## Data Rules

- Use only project colors from `docs/chinese-color-master-list.md` and `docs/chinese-color-harmony.csv` for replacements.
- If the user provides outside HEX values, clearly separate "input color" from "nearest traditional match".
- Preserve existing brand recognition unless the user asks for a full redesign.

## Workflow

1. Inventory the current palette:
   - Extract or list HEX values.
   - Assign current roles: background, text, CTA, accent, border, status, chart, decoration.
2. Diagnose problems:
   - Too many accents.
   - Low contrast.
   - Similar colors doing different jobs.
   - Brand mood mismatch.
   - Dark/light mode mismatch.
   - Decorative colors competing with function.
3. Map each input color to 1 to 3 nearest traditional colors.
4. Propose repairs:
   - Conservative: replace only the worst offenders.
   - Balanced: keep the brand direction, rebuild roles.
   - Full traditional-color system: when requested.
5. Recommend follow-up skill:
   - `xxd-accessible-color` for contrast.
   - `xxd-ui-token` for product UI.
   - `xxd-brand-system` for guidelines.

## Output

Use this structure:

- Current palette diagnosis: short, specific, non-judgmental.
- Match table: input HEX, current role, nearest traditional color name, HEX, confidence.
- Repair plan: keep, replace, merge, or remove.
- Final palette: role, color name, HEX, usage.
- Next implementation step.

When auditing a screenshot, describe visual issues first; only give exact matches when actual sampled HEX values are available.
