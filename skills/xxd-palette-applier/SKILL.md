---
name: xxd-palette-applier
description: Apply Chinese traditional color palettes to concrete design surfaces. Use when a user has colors but needs placement rules for a poster, webpage, landing page, app screen, card, packaging layout, PPT, social cover, editorial page, or visual system.
---

# xxd-palette-applier

## Purpose

Use this skill after a palette exists. Its job is to decide where each color goes, how much area it gets, and what it is not allowed to do.

## Pain Points This Solves

- A palette looks good as swatches but fails once placed into a real layout.
- Designers often overuse the most beautiful color, making CTA, title, decoration, and background compete.
- Different surfaces need different placement logic; a poster rule should not be copied directly into a UI or PPT deck.

## Data Contract

- Use the bundled references inside this skill:
  - `references/chinese-color-master-list.md`: full 742-color Markdown source list.
  - `references/chinese-color-harmony.csv`: complete machine-readable harmony table for all 742 colors.
  - `references/chinese-color-harmony.md`: Markdown version of the same harmony relationships.
- If a palette came from outside the project, map its HEX values to nearest traditional colors before final placement.
- Do not add colors unless repairing a real failure; explain every replacement.
- If the user provides a screenshot or layout description, diagnose the current hierarchy before suggesting placement.

## Surface-Specific Workflow

1. Identify the surface and the primary reading path:
   - Poster or cover: first glance, title, secondary text, signature/detail.
   - Website or app: canvas, surface, text, action, state, focus.
   - PPT or editorial: page rhythm, headline, body, callout, diagram.
   - Packaging: front panel, product name, variant, legal text, seal, side panel.
2. Convert colors into job roles:
   - Ground: large quiet fields.
   - Content: title, body, label, caption.
   - Action: CTA, link, selected state, active object.
   - Rhythm: section bands, dividers, cards, repeated structure.
   - Detail: ornament, number, badge, stamp, small highlight.
3. Set a hierarchy ladder. The strongest contrast belongs to the most important message, not the prettiest color.
4. Assign area ratios:
   - Large field: 50% to 75%.
   - Structure and content: 15% to 35%.
   - Accent: 3% to 10%.
   - Detail: under 3%.
5. Add placement constraints for the specific surface.
6. List the misuse cases that would break the design.

## Output Shape

- Surface diagnosis: what this layout needs from color.
- Role map: role, color name, HEX, component or area, ratio.
- Reading path: where the eye lands first, second, third.
- Placement rules: surface-specific instructions, not generic color labels.
- Misuse checklist: 3 concrete failures to avoid.
- Follow-up: accessibility, token, brand, or print skill if needed.

If the palette cannot safely support the requested layout, say which role is missing before inventing fixes.
