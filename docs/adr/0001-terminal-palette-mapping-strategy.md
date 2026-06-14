# Terminal palette mapping: anchor-family-first, global hue-fill, accept anchor-dependent quality

The terminal theme tool must produce a full 16-color ANSI palette (six required hue slots: red/green/yellow/blue/magenta/cyan) from the 中国传统色 system, which is organized around *one anchor + its harmony* — and a single anchor's harmony does not span the hue wheel. We chose to fill the palette in this order: (1) let the anchor and its harmony family claim whichever ANSI hue slots they naturally match (the anchor always occupies its own matching-hue slot — 朱砂→red, 竹青→green/cyan); (2) fill the remaining hue slots from the *global* 742-color library by nearest hue, biased toward the anchor's temperature/lightness so the fill-ins still read as "the same family"; (3) draw `background`/`foreground`/`cursor` from the 素地敷彩 global neutral pool. Every slot is snapped to a real, named library entry (see CONTEXT.md *Provenance-first*); the algorithm only nudges (兜底) when the legibility contract is physically unsatisfiable.

## Considered Options

- **Route 1 — anchor sets only the mood; all six hues picked globally by nearest-to-canonical-ANSI-hue.** Most reliable spectrum and *stable quality for any anchor*, but the anchor barely influences the six main colors — users would ask "why did I even pick an anchor?"
- **Route 2 (chosen) — anchor family first, then global fill with anchor-tinting.** The anchor genuinely leads the look.
- **Route 3 — hand-curated historical palettes (敦煌/青绿山水/釉色…) that already span the wheel.** Highest ceiling and best narrative, but breaks the "pick one anchor" UX shared with Theme Forge and can't auto-cover all 742 colors.

## Consequences

Output quality is deliberately **uneven across anchors**: a "正色" with a broad family (朱砂) yields a coherent, striking palette where the anchor claims several slots; an off-axis color (鸦青) may claim only its own slot with the rest globally filled, landing closer to Route 1's look. We accepted this non-determinism in exchange for the anchor truly leading the palette. If this trade later proves wrong, reversing to Route 1 changes every generated palette.
