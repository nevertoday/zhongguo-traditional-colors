---
name: xxd-print-packaging
description: Plan Chinese traditional color use for print, packaging, cultural products, and physical materials. Use when a user asks for packaging palettes, CMYK-aware color guidance, product series colors, print risk, material fit, shelf impact, gift boxes, labels, stationery, books, or cultural merchandise using Chinese traditional colors.
---

# xxd-print-packaging

## Overview

Apply Chinese traditional colors to physical media where screen HEX is not enough. This skill focuses on packaging hierarchy, material behavior, CMYK risk, and series recognition.

## Data Rules

- Use only colors from `docs/chinese-color-master-list.md` and `docs/chinese-color-harmony.csv`.
- Include HEX for digital reference and CMYK when available from the source color card or project data. If CMYK is unavailable, say it must be production-proofed.
- Do not promise exact print output from HEX alone.

## Workflow

1. Identify product context:
   - Category: food, tea, fragrance, book, cultural product, stationery, gift, apparel, cosmetics.
   - Price position: mass, boutique, premium, ceremonial.
   - Material: paper, cloth, ceramic, metal, plastic, wood, glass.
   - Series count and shelf environment.
2. Build packaging roles:
   - Large base.
   - Product identity color.
   - Information text.
   - Seal/label/accent.
   - Series variant color.
3. Balance shelf impact and traditional restraint. Use vivid colors sparingly unless the category needs immediate attention.
4. Add print cautions:
   - Light colors losing contrast.
   - Dark colors filling in.
   - Metallic or coated material shifts.
   - Small text contrast.
5. Provide proofing checklist.

## Output

Use this structure:

- Packaging direction: category and shelf strategy.
- Palette table: role, color name, HEX, suggested ratio, material note.
- Front/back/side panel usage.
- Series extension rules.
- Print proof checklist: contrast, small type, material, finish, lighting.

Always say that final print color must be checked with proofs or printer profiles before production.
