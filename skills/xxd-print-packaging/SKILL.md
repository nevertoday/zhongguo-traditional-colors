---
name: xxd-print-packaging
description: Plan Chinese traditional color use for print, packaging, cultural products, and physical materials. Use when a user asks for packaging palettes, CMYK-aware guidance, product series colors, print risk, material fit, shelf impact, gift boxes, labels, stationery, books, or cultural merchandise.
---

# xxd-print-packaging

## Purpose

Use this skill when traditional colors must leave the screen. It should plan color for physical hierarchy, material behavior, production risk, and product-series recognition.

## Pain Points This Solves

- HEX colors do not guarantee printed results; CMYK conversion, spot color, substrate, coating, and lighting can change the look.
- Packaging must balance shelf recognition, information hierarchy, variant systems, and small-type readability.
- Cultural products often overuse "traditional" colors without production rules, making the result either dull or noisy.

## Data Contract

- Use the bundled references inside this skill:
  - `references/chinese-color-master-list.md`: full 742-color Markdown source list.
  - `references/chinese-color-harmony.csv`: complete machine-readable harmony table for all 742 colors.
  - `references/chinese-color-harmony.md`: Markdown version of the same harmony relationships.
- Include HEX for digital reference.
- Include CMYK only when available from the project data or user-provided production specs.
- If CMYK or spot specifications are unavailable, say the color must be proofed with printer profiles or physical proofs.
- Do not promise exact print output from HEX alone.

## Packaging Workflow

1. Identify production context:
   - Category: food, tea, fragrance, book, cultural product, stationery, gift, apparel, cosmetics.
   - Price position: mass, boutique, premium, ceremonial.
   - Material: uncoated paper, coated paper, cloth, ceramic, metal, plastic, wood, glass, label stock.
   - Finish: matte, gloss, foil, emboss, deboss, spot UV, ink coverage.
   - Series count and shelf environment.
2. Build physical color roles:
   - Large base.
   - Product identity color.
   - Information text.
   - Seal, label, or ceremonial accent.
   - Variant or flavor color.
   - Back/side-panel support.
3. Balance shelf impact and restraint:
   - Use vivid traditional colors sparingly unless the category requires fast recognition.
   - Keep small text on stable, high-contrast pairs.
   - Reserve high-cost finishes for identity or seal moments.
4. Add production cautions:
   - Pale colors losing contrast.
   - Dark colors filling in.
   - Coated and metallic shifts.
   - Rich color fields showing banding or registration issues.
   - Small type and barcode contrast.
5. Provide proofing checklist before production.

## Output Shape

- Packaging direction: category, price position, shelf strategy.
- Palette table: role, color name, HEX, ratio, material note, proofing risk.
- Panel plan: front, back, side, label, seal, variant.
- Series extension: how variants change while the master identity stays fixed.
- Production checklist: contrast, small type, material, finish, lighting, printer profile, proof approval.

Always state that final print color must be checked through proofs or printer profiles before production.
