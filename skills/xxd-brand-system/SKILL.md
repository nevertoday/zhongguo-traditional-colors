---
name: xxd-brand-system
description: Build a reusable brand color system from Chinese traditional colors. Use when a user needs brand palette rules, identity color strategy, usage proportions, brand guidelines, campaign-to-product consistency, naming rules, forbidden combinations, or a long-term visual system based on Chinese traditional colors.
---

# xxd-brand-system

## Overview

Create a brand-level color system that can survive more than one poster or one page. The output should help teams stay consistent across web, social, print, product, and campaign materials.

## Data Rules

- Use only colors from `docs/chinese-color-master-list.md` and `docs/chinese-color-harmony.csv`.
- Include color name and HEX for every color.
- If the user already has brand colors, map them to the nearest project colors and preserve brand recognition where possible.

## Workflow

1. Define the brand color position:
   - Category expectation.
   - Desired difference from competitors.
   - Brand temperament.
   - Primary media: digital, print, packaging, social, product UI.
2. Choose a core system:
   - Brand anchor: one recognizable color.
   - Support family: 2 to 4 quiet colors.
   - Accent: 1 or 2 high-attention colors.
   - Neutral base: background, text, borders.
3. Create usage rules:
   - Default ratio.
   - Hero usage.
   - Product UI usage.
   - Social and campaign usage.
   - Print or packaging usage when relevant.
4. Define forbidden uses. Name specific bad pairings or proportions.
5. Provide handoff tokens or references to `xxd-ui-token` when the brand will become an interface.

## Output

Use this structure:

- Brand color thesis: 2 to 4 sentences.
- Core palette table: role, color name, HEX, ratio, brand meaning, usage.
- Application rules: logo area, website, social cover, packaging, presentation, UI if relevant.
- Forbidden combinations: specific pair or use case and why.
- Handoff: token names or next skill to run.

Avoid vague brand language. Tie every color to a concrete brand behavior or surface.
