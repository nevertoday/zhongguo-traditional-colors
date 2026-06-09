---
name: xxd-existing-design-audit
description: Audit an existing design or color list and translate it into Chinese traditional colors. Use when a user provides screenshots, HEX values, CSS variables, brand colors, Figma styles, UI themes, posters, or asks what is wrong with a current palette and how to repair it using Chinese traditional colors.
---

# xxd-existing-design-audit

## Purpose

Use this skill when the user is not starting from zero. It should preserve what is working, identify the real color problems, and convert the palette into a cleaner Chinese traditional color system.

## Pain Points This Solves

- Existing designs often contain duplicate accents, hardcoded near-matches, and unclear role ownership.
- A full redesign can destroy brand recognition when a conservative repair would be better.
- Designers need to know whether to keep, merge, replace, or remove colors, not just see nearest matches.

## Data Contract

- Use the bundled references inside this skill for replacements:
  - `references/chinese-color-master-list.md`: full 742-color Markdown source list.
  - `references/chinese-color-harmony.csv`: complete machine-readable harmony table for all 742 colors.
  - `references/chinese-color-harmony.md`: Markdown version of the same harmony relationships.
- Separate user input colors from nearest traditional matches.
- Preserve brand recognition unless the user asks for a full redesign.
- For screenshots, only give exact matches when actual sampled HEX values are available; otherwise describe likely issues and request sampling for precision.

## Audit Workflow

1. Inventory the current palette:
   - Extract HEX values or list provided values.
   - Assign current roles: background, text, CTA, accent, border, status, chart, decoration.
   - Identify repeated near-colors and orphan colors with no clear role.
2. Diagnose root causes:
   - Too many accents.
   - Low contrast or unclear reading hierarchy.
   - Similar colors doing different jobs.
   - Same job using different colors.
   - Brand mood mismatch.
   - Light/dark mode mismatch.
   - Decorative color competing with function.
3. Map each input color to 1 to 3 nearest traditional colors.
4. Choose a repair level:
   - Conservative: only replace failures and near-duplicates.
   - Balanced: preserve recognition but rebuild roles.
   - Full system: create a traditional-color system when requested.
5. Assign actions: keep, merge, replace, remove, or reserve for accent.
6. Recommend the next skill only after the repair path is clear.

## Output Shape

- Current diagnosis: specific, non-judgmental, tied to roles.
- Inventory table: input HEX, current role, problem, nearest traditional color, confidence.
- Repair plan: keep, merge, replace, remove, or reserve.
- Final role palette: role, color name, HEX, usage.
- Migration notes: CSS/Figma/token names if relevant.
- Next step: `xxd-accessible-color`, `xxd-ui-token`, `xxd-brand-system`, or `xxd-palette-applier`.

Do not recommend a complete rebuild when a focused repair solves the problem.
