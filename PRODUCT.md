# PRODUCT.md — 中国传统色 Studio

## Register

**product** (design serves the product). The site is a set of color tools over a
742-color dataset; the surface in focus here, the 每日一色 playground, is a tool.
(The marketing-ish homepage is the one brand-leaning surface, but the default
register is product.)

## Users & Purpose

- **设计师 / 独立开发者**: need Chinese traditional colors they can actually ship
  (values, palettes, tokens, WCAG-safe pairings), fast.
- **小红书 / 公众号内容创作者**: need a good-looking, on-brand color graphic to
  post, without doing layout themselves.
- **文化爱好者**: browse and learn named traditional colors and their relationships.

Primary job on the 每日一色 page: pick a color (today's color, or browse) and walk
away with a shareable "传统色身份证" card + ready-to-post copy.

## Brand & Personality

Three words: **文化的、克制的、可信的** (cultural, restrained, trustworthy).

The identity is carried by the **named provenance** (every value traces to a real
library color) and **editorial restraint**, not by decoration. Warmth comes from
the serif Chinese type and the off-white paper ground, not from gradients or
effects.

## Anti-references

- Generic SaaS dashboards (gradient hero, rounded cards, icon grids).
- "国潮" kitsch: dragons, heavy gold, drop-shadowed red lanterns.
- Coolors/Adobe-style purely-algorithmic palette tools with no cultural meaning.
- Rounded-corner / glassmorphism / neon — the opposite of the sharp, paper-calm
  house style.

## Accessibility

- WCAG AA for all text (the project literally ships a WCAG-checking skill; the UI
  must hold itself to the same bar).
- Full light + dark support via `data-theme` (already a site-wide system).
- `prefers-reduced-motion` respected on every animation.
- Keyboard operable; visible focus (`outline: 2px solid var(--ink)`).

## Strategic design principles

1. **Provenance is the moat** — always show the color's real name; never invent.
2. **Belongs to the whole** — every page wears the same shell, tokens, and type.
   No bespoke per-page themes.
3. **Honest, not decorative** — restraint over ornament; the color is the hero.
