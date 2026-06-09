---
name: xxd-palette-builder
description: Build complete practical palettes from the Chinese traditional color dataset. Use when a user needs main, support, accent, neutral, ratio, harmony, or role-based palette options from a traditional color, HEX, mood, brand, poster, UI, packaging, or content direction.
---

# xxd-palette-builder

## Purpose

Use this skill when the problem is choice. The user may like one color, a mood, or a reference, but still needs a small number of usable palettes with clear roles and tradeoffs.

## Pain Points This Solves

- Designers get too many attractive swatches and still do not know which combination is safest.
- Harmony tables are useful, but users need role assignment: main, support, neutral, accent, warning, and background.
- Chinese traditional colors can become decorative quickly unless proportion and surface risk are decided early.

## Data Contract

- Load the bundled `references/chinese-color-harmony.csv` before recommending combinations.
- Use `references/chinese-color-master-list.md` as the complete 742-color Markdown source list.
- Use `references/chinese-color-harmony.md` when a Markdown preview of the same harmony relationships is easier to inspect.
- Use the harmony columns selectively: `同类色`, `邻近色`, `互补色`, `分裂互补`, `三角色`, `四角色`, `冷暖对照`, `明色搭配`, `暗色搭配`, `灰调搭配`, `中性色搭配`, `主色`, `辅色`, and `点缀色`.
- Every recommended HEX must exist in the current 742-color data.
- If the user gives an outside HEX, map it to the nearest project color and say it is a match, not a source color.
- Prefer one strong recommendation over showing every possible harmony relation.

## Palette Decision Workflow

1. Classify the anchor:
   - Existing color or HEX: preserve recognition first.
   - Mood or adjectives: run a brief-like translation before picking.
   - Surface: choose by use case, not by beauty alone.
2. Pick a palette strategy:
   - Reliability: adjacent, gray-toned, neutral, and high readability.
   - Identity: one recognizable traditional anchor plus restrained support.
   - Contrast: complementary or split-complementary only when the design needs energy.
   - Series: stable neutrals plus rotating accents.
3. Build 1 to 3 options, each with a job:
   - Safe option: least likely to break layout or readability.
   - Character option: strongest Chinese traditional signal.
   - Contrast option: more memorable, higher risk.
4. Assign roles before presenting colors. Never output unordered swatches.
5. Add ratios and a usage warning for each option.
6. Select one final recommendation unless the user explicitly wants alternatives.

## Output Shape

For each palette:

- Palette name and best use case.
- Role table: role, color name, HEX, ratio, source relation, reason.
- Surface notes: background, text, CTA, accent, border, decoration, or packaging panel.
- Risk note: contrast, dark mode, print drift, over-saturation, cultural cliche, or weak hierarchy.
- Final pick: one palette with why it wins.
- Next skill: usually `xxd-palette-applier`, `xxd-ui-token`, `xxd-accessible-color`, or `xxd-print-packaging`.

Do not explain color theory unless it changes the recommendation.
