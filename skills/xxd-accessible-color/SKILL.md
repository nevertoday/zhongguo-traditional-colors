---
name: xxd-accessible-color
description: Check and repair Chinese traditional color combinations for readability and accessibility. Use when a user asks whether text, buttons, UI states, charts, light mode, dark mode, or traditional color palettes meet contrast and non-color-cue requirements.
---

# xxd-accessible-color

## Purpose

Use this skill when color beauty has to survive real reading, interaction, status, or chart use. It should return testable contrast decisions and repairs from the same 742-color system.

## Pain Points This Solves

- Traditional colors that look elegant can fail as body text, buttons, focus rings, or chart distinctions.
- Teams often use color alone to communicate status, selection, or error.
- Accessibility feedback is easy to make vague; this skill must give ratios, pass states, and concrete replacements.

## Data Contract

- Use the bundled references inside this skill for replacements:
  - `references/chinese-color-master-list.md`: full 742-color Markdown source list.
  - `references/chinese-color-harmony.csv`: complete machine-readable harmony table for all 742 colors.
  - `references/chinese-color-harmony.md`: Markdown version of the same harmony relationships.
- Use WCAG contrast ratios for text and UI pair evaluation.
- Do not claim compliance without a ratio or a clear "needs verification" note.
- For charts, status, and selections, check whether color is the only cue and add labels, shape, stroke, underline, icon, or pattern when needed.

## Evaluation Workflow

1. Identify the role:
   - Normal text, large text, button label, icon, focus ring, border, chart series, status, selection, or decoration.
2. Build test pairs:
   - Foreground/background for text.
   - State pairs for interactive elements.
   - Adjacent colors for charts and legends.
3. Calculate contrast when HEX values are available.
4. Classify:
   - Pass: usable as requested.
   - Conditional: usable for large text, decoration, non-critical marks, or with added cues.
   - Fail: needs replacement.
5. Repair failures:
   - Preserve the intended temperature and cultural signal where possible.
   - Prefer nearby, neutral, gray-toned, light, dark, or harmony-related project colors.
   - Keep the replacement inside the 742-color dataset.
6. Add non-color cues when meaning depends on status, selection, chart distinction, or warnings.

## Thresholds

- Normal text: target at least 4.5:1.
- Large text: target at least 3:1.
- UI components and graphical objects: target at least 3:1 when contrast carries function.
- Do not use color alone to communicate required meaning.

## Output Shape

- Summary: pass, conditional, fail counts and biggest risk.
- Pair table: foreground, background, role, ratio, status, recommendation.
- Repairs: original pair, replacement pair, why it preserves the direction.
- Usage rules: where each pair can and cannot be used.
- Non-color cue suggestions for charts, status, warning, or selection.

If no concrete HEX values are provided, ask for values or first run `xxd-palette-builder` to produce a testable palette.
