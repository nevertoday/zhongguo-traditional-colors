# Preview code/markdown highlighting: build-time pre-tokenization + CSS-variable recolor

The terminal theme tool's preview renders a ~500-line real code file and a representative Markdown document so the palette can be judged at realistic scale. To recolor that content live as the user changes anchors — across thousands of token nodes — without jank, and without violating the project's no-bundler/no-runtime-dependency rule, we pre-tokenize the samples **at build time** into static HTML with token-class spans (`<span class="tok-keyword">`, `tok-string`, md element classes, …), emitted into `assets/data/` with the standard "Do not edit by hand" header and cache-busting version. At runtime the page maps token classes to ANSI slots purely through CSS custom properties (`--tok-keyword: var(--ansi-magenta)`), so switching anchors only rewrites a handful of CSS variables on one container — one style recalc, zero node re-rendering. The code sample is dogfooded from this repo's own source; the token→ANSI and markdown→ANSI conventions follow `bat`/`LS_COLORS`/`glow` defaults.

## Considered Options

- **Runtime highlighter (highlight.js / Prism / Shiki).** Convenient, but pulls a bundled dependency into a deliberately dependency-free static site, and recoloring means either re-running the highlighter or rewriting inline styles on thousands of nodes per anchor change — janky at 500 lines.
- **Build-time pre-tokenization + CSS-var recolor (chosen).** Fits the existing generated-data pipeline (`scripts/build-*.mjs` → `assets/data/*.js`), keeps the runtime dependency-free, and makes recolor a single CSS-variable swap.

## Consequences

Adds a new build step and a generated artifact that must be regenerated when the sample source or token conventions change (one more link in the `prepare:release` chain). The set of highlightable token kinds is fixed at build time — fine, because the preview is a curated demo, not a general-purpose editor.
