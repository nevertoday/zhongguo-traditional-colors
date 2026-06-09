---
name: xxd-brand-system
description: Build a reusable brand color system from Chinese traditional colors. Use when a user needs brand palette governance, color rules, identity consistency, usage ratios, forbidden combinations, cross-channel guidance, or long-term visual rules based on Chinese traditional colors.
---

# xxd-brand-system

## Purpose

Use this skill when color must become brand behavior, not just a campaign palette. It should help a team stay recognizable across website, social, product, packaging, presentation, and offline materials.

## Pain Points This Solves

- Brand colors drift when every designer or campaign picks a different "Chinese" feeling.
- A palette without governance cannot tell teams what to use for hero moments, product UI, social covers, or print.
- Brand systems fail when they only describe meaning, not ratios, forbidden uses, and handoff rules.

## Data Contract

- Use the bundled references inside this skill:
  - `references/chinese-color-master-list.md`: full 742-color Markdown source list.
  - `references/chinese-color-harmony.csv`: complete machine-readable harmony table for all 742 colors.
  - `references/chinese-color-harmony.md`: Markdown version of the same harmony relationships.
- Include color name and HEX for every color.
- If the user has existing brand colors, map them to nearest project colors and preserve recognition unless a full redesign is requested.
- If the brand becomes an interface, hand off token work to `xxd-ui-token`.

## Brand System Workflow

1. Define brand pressure:
   - Category norms and expected colors.
   - Desired difference from competitors.
   - Price position and cultural posture.
   - Primary channels: product, website, social, print, packaging, events.
2. Decide the color governance model:
   - Anchor color: the brand's most recognizable traditional color.
   - Support family: 2 to 4 quiet colors for depth and flexibility.
   - Neutral base: canvas, text, borders, captions.
   - Accent colors: 1 or 2 high-attention colors with strict limits.
3. Assign usage by channel:
   - Website and landing pages.
   - Product UI.
   - Social and campaign assets.
   - Decks and documents.
   - Packaging or print when relevant.
4. Create rules:
   - Default ratio and hero ratio.
   - Which colors may touch the logo.
   - Which colors can carry text.
   - Which combinations are forbidden.
   - What a campaign may change without breaking the brand.
5. Add governance notes: owner, review trigger, and when to run accessibility or print checks.

## Output Shape

- Brand color thesis: concrete, channel-aware, not poetic filler.
- Core palette: role, color name, HEX, ratio, brand job, channel.
- Channel rules: website, product UI, social, deck, packaging, print if relevant.
- Forbidden combinations: specific pair, proportion, or use case with reason.
- Handoff: token names, audit rules, or next skill.

Tie every color to a brand behavior. Avoid vague claims like "高级感" unless you translate it into use rules.
