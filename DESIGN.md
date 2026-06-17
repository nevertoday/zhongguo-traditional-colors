# DESIGN.md — 中国传统色 Studio

Captured from the live design system in `assets/css/styles.css` + `assets/js/shared-chrome.js`. Source of truth for keeping new surfaces on-brand.

## Theme

Editorial, paper-calm, sharp. A warm off-white ground with near-black ink and a
serif Chinese display face. Light by default, full dark variant. The color
content is the only saturation on the page; chrome stays neutral.

`color-scheme` light by default; `:root[data-theme="dark"]` flips the ramp.
Theme is restored from `localStorage('theme')` by an inline head script and
toggled by the shared header's `[data-theme-toggle]`.

## Color (CSS custom properties — always use tokens, never hard-code)

| Token | Light | Role |
|---|---|---|
| `--ink` | `#111111` | primary text, borders, primary button bg |
| `--ink-soft` | `#4b4b4b` | secondary text |
| `--muted` | `#777777` | tertiary text / captions |
| `--paper` | `#f7f7f4` | body background (warm off-white) |
| `--panel` | `#ffffff` | raised surfaces |
| `--panel-soft` | `#f0eee9` | inset / secondary surfaces |
| `--line-soft` / `--line` / `--line-strong` | `#e9e4da`→`#aaa093` | hairlines → strong borders |
| `--wash-yellow/green/red/blue` | tints | category wash backgrounds |
| `--hover-bg` / `--hover-text` | `#111` / `#f7f7f4` | invert-on-hover for buttons |
| `--shadow-card` / `--shadow-soft` | soft 8% | elevation |

Dark theme provides the same token names; reference tokens and dark "just works".
Body text ≥ 4.5:1; the muted/line tokens are tuned to pass on `--paper`.

## Typography

- `--font-title`: `"Noto Serif SC", "Source Han Serif SC", "Songti SC", serif` — headings, color names (display weight 900).
- `--font-body`: `"Avenir Next", "PingFang SC", sans-serif` — UI / prose.
- `--font-rounded`: `"M PLUS Rounded 1c", sans-serif` — numeric/value chips (hex/rgb/cmyk), labels.
- Webfonts: Google Fonts `Noto Serif SC` (500–900) + `M PLUS Rounded 1c` (400/500/700).
- Scale: h1 5.4rem/900, h2 2.35rem/700, h3 1.18rem/700, all `--font-title`, `text-wrap: balance`.

## Components

- **Buttons** `.button` + `.button-primary` (ink fill, `--inverse` text) / `.button-secondary` (transparent, `--line-strong` border). `min-height:46px`, `padding:11px 16px`, **no border-radius**, invert to `--hover-bg`/`--hover-text` on hover, `translateY(-1px)` lift.
- **Focus**: `outline: 2px solid var(--ink); outline-offset: 3px` on every interactive element.
- **Shared chrome**: `<header class="site-header">` (brand + nav + GitHub + theme toggle) and `<footer class="site-footer">`, injected by replacing `[data-shared-header]` / `[data-shared-footer]`; set `data-current-page` on `<body>`. Sub-dir pages set `data-base="../"`.
- **Icons**: Iconify (`iconify-icon`), 18px in buttons, `currentColor`.

## Layout

- Max content width `--content: 1240px`.
- **Sharp corners are a hard rule** — `verify-color-pages.mjs` fails on any `border-radius` except `50%` (circles). No rounded rectangles anywhere.
- Section `scroll-margin-top: 82px` (under the sticky header).

## Motion

- Easing tokens: `--ease-out-quart` `cubic-bezier(.25,1,.5,1)`, `--ease-out-quint`, `--ease-out-expo`. **No bounce/elastic.**
- Durations 150–300ms for state changes.
- `@media (prefers-reduced-motion: reduce)` alternative required.
