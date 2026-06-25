# GEO / AI-Search Analysis — colors.xiaoxiaodong.ai

> Audit date: 2026-06-25 · Surface scope: Google AI Overviews, Google AI Mode, ChatGPT search, Perplexity, Bing Copilot
> Framing per Google's primary source: **GEO is SEO applied to AI-search surfaces.** Findings below are SEO fundamentals scored against AI-citation selection logic, not a separate discipline.

## 1. GEO Readiness Score: **75 / 100**

| Criterion | Weight | Score | Notes |
|---|---|---|---|
| Citability | 25% | 21 | Color pages front-load a self-contained "X 是…" definition with hard data. Best-in-class. |
| Structural readability | 20% | 14 | Clean H1→H2, but no question headings, no FAQ, no value tables. |
| Multi-modal | 15% | 11 | Color-card images + interactive tools with alt text. No video. |
| Authority & brand | 20% | 10 | Author/Org schema present, but **no dates** and **weak external brand footprint**. |
| Technical accessibility | 20% | 19 | Static SSR, all crawlers allowed, llms.txt + sitemap. Near-perfect. |

The technical floor is excellent. The ceiling is held down by two things AI-search weights heavily: **content recency signals (dates)** and **off-site brand mentions** — neither of which more HTML can fix alone.

## 2. Platform Breakdown

| Platform | Est. readiness | Why |
|---|---|---|
| **Google AI Overviews** | Good once indexed | Cites pages that already rank. Schema + SSR + passage quality are in place; gated on classic ranking, which is currently weak (see §5). |
| **Google AI Mode** (Gemini 3.5 Flash) | Medium | Broader pool, but rewards **freshness + entity authority** — exactly the two gaps. Adding dates and brand presence moves this most. |
| **ChatGPT** | Low-medium | Leans Wikipedia (47.9%) + Reddit. No Wikipedia/Wikidata entity, thin community footprint. |
| **Perplexity** | Low-medium | Leans Reddit (46.7%). No community validation threads found. |
| **Bing Copilot** | Good | Static, clean, sitemap present. Add IndexNow (already noted in commit `af6b1f8`) to accelerate. |

## 3. AI Crawler Access Status — ✅ All allowed

`robots.txt` is `User-agent: * / Allow: /` + sitemap. This permits **GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, CCBot, Bytespider** — every AI crawler. No blocks. No action needed unless you want to *exclude* training crawlers (CCBot, anthropic-ai, Bytespider) — optional, and excluding them would *reduce* visibility, so leave as-is.

## 4. llms.txt Status — ✅ Present and well-formed

Both `/llms.txt` (893 B index) and `/llms-full.txt` (107 KB full 742-color table) exist, with title, `>` summary, sectioned key pages, and a pointer to the full data. This is a textbook implementation.

> ⚠️ Reality check (per Google/Mueller/Illyes + SE Ranking 300k-domain study): **no major AI search system currently uses llms.txt as a citation lever.** Keep it — it's cheap and correct — but do not expect ranking lift from it. It is not a substitute for the items in §8.

## 5. Brand Mention Analysis — ⚠️ The weakest axis

A search for the site's own core terms ("中国传统色 色卡") surfaces **competitors, not this site**: [zhongguose.com](https://zhongguose.com/en), [colors.ichuantong.cn](https://colors.ichuantong.cn/), [peiseka.com](https://peiseka.com/zhongguochuantongse.html), [vivacolor.art](https://vivacolor.art/). The only asset that ranks is the **GitHub repo**, not the deployed domain.

| Channel | Presence |
|---|---|
| Wikipedia / Wikidata | ❌ None |
| GitHub | ✅ [nevertoday/zhongguo-traditional-colors](https://github.com/nevertoday/zhongguo-traditional-colors) (indexed) |
| X/Twitter | ✅ Linked via `sameAs` (@xiaoxiaodong01) |
| Reddit / 知乎 / 小红书 / V2EX | ❌ None found |
| YouTube | ❌ None |

Since **brand mentions correlate ~3× more strongly with AI citation than backlinks** (Ahrefs, 75k brands), this is the single highest-leverage area — and it's off-site work, not code.

## 6. Passage-Level Citability — ✅ Strong on color pages

The color-page lede is the ideal AI-citation unit: front-loaded, self-contained, "X 是…" definition pattern, with quotable hard facts. Example from `001-乳白`:

> 「乳白」是中国传统色之一，属黄色系、暖调，色值 HEX #F9F4DC、RGB 249,244,220、HSL 50,71%,92%、CMYK 0,2,12,2。在黄色系的 63 种传统色中，它按色序排第 1 位。配色上，其互补方向可取「云峰灰 #C1C8D6」… 对比度约 15.7∶1，达到 WCAG AA 正文标准。

This is ~110 words, extractable without context, with a unique data point (contrast ratio) — exactly what gets cited. **742 pages of this is the project's GEO crown jewel.** The gap: the **homepage and hub pages lack an equivalent definition block** ("中国传统色是什么").

## 7. Server-Side Rendering Check — ✅ Pass

Confirmed via live fetch: color pages and homepage return full HTML body content server-side (static files, no framework). AI crawlers, which do not execute JS, get the complete content. The JS-only layers (gallery filtering, copy buttons) are progressive enhancement and do not gate content. This is the correct architecture.

## 8. Top 5 Highest-Impact Changes

1. **Add `datePublished` + `dateModified`** to color-page `CreativeWork` schema and a visible "更新于 YYYY-MM-DD" line. *Currently absent.* Recency is a ~3× citation multiplier and pages stale 6+ months lose eligibility. The generator already stamps a deterministic `lastmod` in the sitemap — reuse that value. **Code fix, high impact.**
2. **Seed off-site brand mentions** (off-code): a 知乎/小红书/Reddit r/design post, a V2EX share, and a **Wikidata item** for the project. This attacks the §5 gap that more HTML cannot.
3. **Add FAQ / question-based H3s** to color pages — e.g. 「乳白是什么颜色？」「乳白的互补色是什么？」「乳白的 RGB / CMYK 值是多少？」. Question headings match AI query patterns and each answer is already in your data. Generator-driven, scales to 742 pages.
4. **Render color values as a `<table>`**, not just prose/chips. Comparative tabular data is preferentially extracted by AI; the HEX/RGB/HSL/CMYK set is naturally tabular.
5. **Add a citable definition block to homepage + hub pages** ("中国传统色是什么 / 这个项目是什么") in the first 60 words, mirroring the color-page lede pattern, so the entry points are themselves citable.

## 9. Schema Recommendations

Already implemented and good: `WebSite` + `SearchAction`, `Organization`, `Person`, `BreadcrumbList`, `CreativeWork`, `DefinedTerm`, `ImageObject`. Add:

- **`datePublished` / `dateModified`** on `CreativeWork` (ties to §8.1).
- **`FAQPage`** on color pages once §8.3 questions exist.
- **`Dataset`** schema on `dictionary.html` / `colors/` describing the 742-color dataset (license MIT, creator, distribution → `llms-full.txt`) — strong entity signal for the collection as a whole.
- Add `colors.xiaoxiaodong.ai` itself (not just GitHub/X) and any Wikidata ID to every `sameAs`.

## 10. Content Reformatting Suggestions

- **Color pages:** keep the lede verbatim — it's the model. Append a 3–4 item FAQ block and convert the 色值 section to a table.
- **Homepage:** the current lede ("742 张传统色色卡。查色、复制、下载、配色，一页完成。") is a product tagline, not a citable definition. Add one sentence: "中国传统色是…，本站收录 742 种，每色含 HEX/RGB/HSL/CMYK 与同类、邻近、互补配色关系。"
- **Hub/family pages** (`family-yellow.html` etc.): add a 134–167-word intro per family ("黄色系传统色是…，本系收录 63 色，色相范围…") — currently they appear to be bare indexes (`<h2 class="sr-only">`), which wastes 8 high-relevance citable surfaces.

---

### Bottom line
The code-side GEO work is essentially done and done well — SSR, schema, llms.txt, canonical, sitemap all in place. The remaining gains are **(a) dates for recency**, **(b) FAQ + tables on the 742 pages**, and **(c) off-site brand mentions / a Wikidata entity**. Items (a) and (b) are generator changes; (c) is the highest-leverage and the only one that isn't code.

Sources: [zhongguose.com](https://zhongguose.com/en) · [colors.ichuantong.cn](https://colors.ichuantong.cn/) · [GitHub repo](https://github.com/nevertoday/zhongguo-traditional-colors/) · [peiseka.com](https://peiseka.com/zhongguochuantongse.html) · [vivacolor.art](https://vivacolor.art/)
