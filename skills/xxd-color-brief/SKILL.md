---
name: xxd-color-brief
description: Turn vague visual direction into a practical Chinese traditional color brief. Use when a user has mood words, client feedback, audience positioning, references, or an unclear Chinese traditional color direction that must become palette constraints before choosing colors.
---

# xxd-color-brief

## Purpose

Use this skill before picking colors. Its job is to turn soft language like "高级", "东方", "年轻", "克制", "松弛", "科技感", or "不要太俗" into a brief that a designer can defend and reuse.

## Pain Points This Solves

- Stakeholders use adjectives, references, or dislikes, but the designer needs concrete color constraints.
- Moodboards create alignment, but they often stop before deciding hue, brightness, saturation, contrast, and usage risk.
- Teams jump into swatches too early and later argue because the success criteria were never named.

## Data Contract

- Use the bundled references inside this skill:
  - `references/chinese-color-master-list.md`: full 742-color Markdown source list.
  - `references/chinese-color-harmony.csv`: complete machine-readable harmony table for all 742 colors.
  - `references/chinese-color-harmony.md`: Markdown version of the same harmony relationships.
- Starting colors must include color name, HEX, and the reason they fit the brief.
- If the user provides an outside HEX, map it to the nearest project color and label it as a mapping.
- Do not produce a full palette unless the user explicitly asks; route to the next skill instead.

## Briefing Workflow

1. Identify the job behind the words: brand, UI, poster, data visualization, content series, packaging, or audit.
2. Translate each adjective into observable constraints:
   - Temperature: warm, cool, neutral, or controlled contrast.
   - Lightness: pale, mid, deep, or high-contrast.
   - Saturation: muted, clean, vivid, gray-toned, or ceremonial.
   - Cultural signal: historical, editorial, product, youthful, premium, festive, technical.
   - Risk: cliche, low readability, too decorative, too flat, too commercial, too nostalgic.
3. Detect conflicts. For example, "年轻又古典" needs a modern neutral base plus one traditional accent, not an all-antique palette.
4. Choose 3 to 5 starting colors from the 742-color set, each with a role hypothesis.
5. Name the avoid list as concrete color families, contrast levels, or usage patterns.
6. Route the next step:
   - Need actual color combinations: `xxd-palette-builder`
   - Need placement on a layout: `xxd-palette-applier`
   - Need UI variables: `xxd-ui-token`
   - Need contrast repair: `xxd-accessible-color`
   - Need long-term brand rules: `xxd-brand-system`
   - Need charts: `xxd-data-viz`
   - Need to repair existing work: `xxd-existing-design-audit`
   - Need repeated content: `xxd-content-series`
   - Need physical production: `xxd-print-packaging`

## Output Shape

- Brief name: one project-facing phrase.
- Design decision: 2 to 4 sentences explaining the color direction in plain Chinese.
- Constraint table: mood word, translated color constraint, risk if misread.
- Starting colors: role hypothesis, color name, HEX, why it belongs.
- Avoid list: 2 to 4 concrete exclusions.
- Next move: one recommended skill and what it should produce.

If the user only provides a mood word with no surface, state the missing surface and give a provisional brief instead of blocking.
