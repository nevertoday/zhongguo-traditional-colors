# 中国传统色 · 色彩工具集

A static site for browsing 742 named Chinese traditional colors and turning them into usable color artifacts. This glossary covers the shared vocabulary across the site's color-generation tools (Theme Forge, and the in-design terminal theme tool).

## Language

### Color library

**Anchor**:
The single Chinese traditional color a user picks as the seed of a generated artifact. Every tool starts from one anchor.
_Avoid_: base color, seed color, primary (在 shadcn 语境里 primary 是产物里的一个角色,不是输入)

**Harmony**:
The pre-computed set of relationship arrays attached to each color in `TRADITIONAL_COLOR_HARMONIES` (same / analogous / complementary / triadic / lighter / darker / neutral / accent …). The relationships are between *real library entries*, never invented colors.

**点名 (named pick)** vs **兜底 (algorithmic fallback)**:
A token/slot is *点名* when it maps to a real, named library entry; it is *兜底* when the algorithm had to nudge a color (e.g. shift OKLab lightness to pass a contrast threshold) and the result is no longer a verbatim library color. Tools must label which is which.

### Artifacts

**Theme Forge tokens**:
A full shadcn semantic token set (background/foreground/primary/muted/accent/destructive/border/chart-*, light+dark, OKLCH) generated from one anchor via the 素地敷彩 principle. Produced by the existing `theme-forge.html` tool.

**Terminal palette** (in design):
The artifact the terminal theme tool produces: the fixed terminal contract of **16 ANSI colors** (8 normal + 8 bright: black/red/green/yellow/blue/magenta/cyan/white) plus the UI colors `background` / `foreground` / `cursor` / `selection`. This is a different artifact from Theme Forge tokens — a different contract, a different mapping problem.
_Avoid_: "theme" unqualified (overloaded — say *terminal palette* or *Theme Forge tokens*)

**ANSI slot**:
One of the 16 fixed positions in a terminal palette that demand specific *hues* (a red, a green, a yellow, a blue, a magenta, a cyan, plus black/white anchors of the dark/light ends). The terminal contract forces all six hue slots to be filled — unlike Theme Forge, where a single anchor's harmony suffices.

**Terminal theme tool** (`terminal.html`, nav 「终端配色」, in design):
The site page that produces a terminal palette from one anchor and serializes it to the supported terminal formats. Lives alongside `theme-forge.html` as a peer tool (different artifact, different preview device, different audience). First-release formats: **Ghostty** (lead), **Alacritty**, **kitty** — all "16 + UI" isomorphic, pure-template serialized from one palette. Delivery is copy-first (one code box + copy button per format) plus per-format file download (`.conf`/`.toml`); no zip.
_Avoid_: calling it "Theme Forge" (separate tool)

**Anchor presence contract (锚色露脸契约)**:
For the terminal palette, the anchor is guaranteed visible in three places so "I picked 朱砂" actually feels like 朱砂: (1) `cursor` + `selection` use the anchor (or the contrast-safe member of its family); (2) the anchor occupies *its own matching-hue ANSI slot* — 朱砂 fills the red slot, 竹青 fills the green/cyan slot, etc. (NOT always red); (3) `background` carries a faint warm/cool bias toward the anchor — a tint on near-black, never a saturated ground.

**Dark-first, dual output**:
The terminal palette is designed dark-first (terminals are overwhelmingly dark), then the same named picks are re-emitted as a light variant by flipping the 素地敷彩 lightness steps. Light is second priority but comes out of the same palette at no extra authoring cost.

## Principles

**Provenance-first (正本清源)**:
For the terminal palette, every ANSI/UI slot must map to a *real, named* traditional color (点名), snapped to a genuine `TRADITIONAL_COLOR_HARMONIES` entry — never freely interpolated. The `bright_*` slots, which want brighter/punchier colors than the generally muted traditional palette offers, accept the *nearest real color* (and only fall back to 兜底 nudging when legibility demands it). The named provenance is the product's moat over a generic theme generator.

**素地敷彩 (plain ground, then color)**:
Theme Forge's mapping principle — neutrals (surfaces) come from a global low-chroma named-neutral pool by target lightness; colors (roles) come from the anchor's harmony. See `theme-forge` memory.
