# Chinese Traditional Colors

[简体中文](README.md) | English | [日本語](README.ja.md)

This repository is a practical Chinese color workbench for designers, educators, writers, front-end developers, and anyone who needs reliable colors that can move from reference to real layouts.

It contains 742 high-resolution Chinese traditional color cards, aligned with the original 742-color list. Each card preserves the color name, HEX, RGB, CMYK, palette guidance, and mood keywords. The site now goes beyond an archive: you can browse cards, test colors in real layout scenes, generate palettes, explore harmony relationships, build usage cards, and save favorite colors or full schemes locally.

## Quick Links

- [Browse the online gallery](https://colors.xiaoxiaodong.ai/)
- [Open the scene testing workbench](https://colors.xiaoxiaodong.ai/style-lab.html)
- [Open the palette generator](https://colors.xiaoxiaodong.ai/generator.html)
- [Open the Chinese color palette board](https://colors.xiaoxiaodong.ai/palettes.html)
- [Open usage cards](https://colors.xiaoxiaodong.ai/uses.html)
- [Open local favorites](https://colors.xiaoxiaodong.ai/favorites.html)
- [Open Studio Skills](https://colors.xiaoxiaodong.ai/skills.html)
- [Download the complete ZIP](https://github.com/nevertoday/zhongguo-traditional-colors/releases/latest/download/zhongguo-traditional-colors-images.zip)
- [View the Release](https://github.com/nevertoday/zhongguo-traditional-colors/releases/tag/v0.1.0)
- [Original 742-color list](docs/chinese-color-master-list.md)
- [742-color harmony Markdown](docs/chinese-color-harmony.md)
- [742-color harmony CSV](docs/chinese-color-harmony.csv)
- [Practical Chinese color skills](#practical-chinese-color-skills)
- [Author on X](https://x.com/xiaoxiaodong01)

## What This Project Gives You

| Need | Provided here |
| --- | --- |
| A fast Chinese color reference | 742 high-resolution PNG color cards |
| Visual material for design and content | Preview, copy, download, and favorite individual cards |
| A local color asset library | Filenames aligned with the 742-color source list |
| Web, slide, cover, poster, and brand scenes | Scene testing maps an anchor color into background, title, body, button, and accent roles |
| Fast usable palette generation | The generator supports locking, replacing, rotating, copying, exporting, and favoriting complete schemes |
| Harmony exploration | Browse 8,904 palettes across same, analogous, complementary, triadic, temperature, light/dark, gray-tone, and neutral relationships |
| Background/text usage cards | Usage cards check contrast and support copying, remixing, and favoriting two-color schemes |
| Keeping useful choices | The favorites panel collects cards, palettes, usage cards, generated schemes, and scene tests |
| Color name and value checking | Centralized names, HEX, RGB, and CMYK references |
| Turning colors into real project decisions | 10 agent skills for practical design workflows |

The original image set is about 998 MB. The ZIP is distributed as a GitHub Release asset instead of being committed to the repository.

## Feature Screenshots

### [Browse Color Cards](https://colors.xiaoxiaodong.ai/#gallery)

<p align="center">
  <a href="https://colors.xiaoxiaodong.ai/#gallery"><img src="docs/screenshots/home-gallery.png" alt="Screenshot of the color-card gallery"></a>
</p>

Search all 742 cards by number, name, HEX, or hue. Each card supports previewing details, copying values, downloading the original PNG, and saving it locally.

### [Scene Testing](https://colors.xiaoxiaodong.ai/style-lab.html)

<p align="center">
  <a href="https://colors.xiaoxiaodong.ai/style-lab.html"><img src="docs/screenshots/style-lab.png" alt="Screenshot of the scene testing workbench"></a>
</p>

Pick one traditional color and see how it works across web, slide, cover, poster, and brand-board scenes as background, title, body, button, and accent roles.

### [Palette Generator](https://colors.xiaoxiaodong.ai/generator.html)

<p align="center">
  <a href="https://colors.xiaoxiaodong.ai/generator.html"><img src="docs/screenshots/generator.png" alt="Screenshot of the palette generator"></a>
</p>

Generate five-color schemes from an anchor color or generation mode, then lock, replace, rotate, reverse, copy, favorite, or export the full set.

### [Palette Inspiration](https://colors.xiaoxiaodong.ai/palettes.html)

<p align="center">
  <a href="https://colors.xiaoxiaodong.ai/palettes.html"><img src="docs/screenshots/palettes.png" alt="Screenshot of the palette inspiration board"></a>
</p>

Explore 8,904 harmony sets across same, analogous, complementary, triadic, temperature, light/dark, gray-tone, and neutral relationships, with copy, favorite, and shuffle actions.

### [Usage Cards](https://colors.xiaoxiaodong.ai/uses.html)

<p align="center">
  <a href="https://colors.xiaoxiaodong.ai/uses.html"><img src="docs/screenshots/uses.png" alt="Screenshot of usage cards"></a>
</p>

Build background/text two-color cards with layout previews, contrast checks, second-color search, copy, remix, and favorite actions.

### [Local Favorites](https://colors.xiaoxiaodong.ai/favorites.html)

<p align="center">
  <a href="https://colors.xiaoxiaodong.ai/favorites.html"><img src="docs/screenshots/favorites.png" alt="Screenshot of the local favorites panel"></a>
</p>

Review locally saved color cards, palettes, usage cards, generated schemes, and scene tests, with type filters, copy, open, and remove controls.

### [Studio Skills](https://colors.xiaoxiaodong.ai/skills.html)

<p align="center">
  <a href="https://colors.xiaoxiaodong.ai/skills.html"><img src="docs/screenshots/skills.png" alt="Screenshot of Studio Skills"></a>
</p>

Turn the 742-color list and harmony data into practical workflows for briefs, palettes, layout placement, tokens, accessibility, brand systems, charts, legacy audits, content series, and print production.

## Practical Chinese Color Skills

These skills turn the 742-color list and harmony CSV into practical design workflows. Each skill targets a distinct design blocker: fuzzy direction, too many palette choices, unclear placement, token handoff, readability, brand drift, chart encoding, legacy palette repair, content-series fatigue, and print uncertainty.

Every `xxd-*` skill folder bundles the full `references/chinese-color-master-list.md`, `references/chinese-color-harmony.md`, and `references/chinese-color-harmony.csv`, so a single skill can still access the complete 742-color list and per-color harmony relationships on its own.

| Skill | Use it for |
| --- | --- |
| [`xxd-color-brief`](skills/xxd-color-brief/SKILL.md) | Translate vague terms like premium, Eastern, young, or restrained into temperature, lightness, saturation, contrast, and risk constraints |
| [`xxd-palette-builder`](skills/xxd-palette-builder/SKILL.md) | Filter anchor colors, HEX values, moods, or contexts into a small role-based palette with ratios |
| [`xxd-palette-applier`](skills/xxd-palette-applier/SKILL.md) | Place colors into real layouts by deciding background, title, body, CTA, structure, and decoration roles |
| [`xxd-ui-token`](skills/xxd-ui-token/SKILL.md) | Convert traditional colors into primitive, semantic, component, and mode-aware UI tokens |
| [`xxd-accessible-color`](skills/xxd-accessible-color/SKILL.md) | Check text, button, state, and chart pairs with WCAG ratios and repair failures from the same color set |
| [`xxd-brand-system`](skills/xxd-brand-system/SKILL.md) | Build brand anchors, support colors, ratios, channel rules, forbidden combinations, and governance boundaries |
| [`xxd-data-viz`](skills/xxd-data-viz/SKILL.md) | Create chart colors by categorical, sequential, diverging, highlight, or semantic data meaning instead of poster palettes |
| [`xxd-existing-design-audit`](skills/xxd-existing-design-audit/SKILL.md) | Inventory legacy screenshots, CSS, Figma styles, or HEX lists and decide what to keep, merge, replace, or remove |
| [`xxd-content-series`](skills/xxd-content-series/SKILL.md) | Build fixed, variable, template, and rotation layers for social, editorial, course, and video series |
| [`xxd-print-packaging`](skills/xxd-print-packaging/SKILL.md) | Plan packaging, books, cultural goods, labels, and physical materials with CMYK, substrate, and proofing risks |

## Featured Color Preview

The README shows 24 representative cards so the page stays readable. Browse or download the complete 742-card archive through the [online gallery](https://colors.xiaoxiaodong.ai/#gallery), the `images/` directory, or the Release ZIP.

<!-- gallery:start -->
<p align="center">
  <a href="images/001-乳白.png"><img src="thumbnails/color-card-001.jpg" width="180" alt="Chinese traditional color 001-乳白"></a>
  <a href="images/035-秋葵黄.png"><img src="thumbnails/color-card-035.jpg" width="180" alt="Chinese traditional color 035-秋葵黄"></a>
  <a href="images/080-琥珀黄.png"><img src="thumbnails/color-card-080.jpg" width="180" alt="Chinese traditional color 080-琥珀黄"></a>
  <a href="images/135-朱红.png"><img src="thumbnails/color-card-135.jpg" width="180" alt="Chinese traditional color 135-朱红"></a>
</p>

<p align="center">
  <a href="images/188-芙蓉红.png"><img src="thumbnails/color-card-188.jpg" width="180" alt="Chinese traditional color 188-芙蓉红"></a>
  <a href="images/244-枣红.png"><img src="thumbnails/color-card-244.jpg" width="180" alt="Chinese traditional color 244-枣红"></a>
  <a href="images/321-魏紫.png"><img src="thumbnails/color-card-321.jpg" width="180" alt="Chinese traditional color 321-魏紫"></a>
  <a href="images/380-碧青.png"><img src="thumbnails/color-card-380.jpg" width="180" alt="Chinese traditional color 380-碧青"></a>
</p>

<p align="center">
  <a href="images/424-月白.png"><img src="thumbnails/color-card-424.jpg" width="180" alt="Chinese traditional color 424-月白"></a>
  <a href="images/443-翠蓝.png"><img src="thumbnails/color-card-443.jpg" width="180" alt="Chinese traditional color 443-翠蓝"></a>
  <a href="images/490-荷叶绿.png"><img src="thumbnails/color-card-490.jpg" width="180" alt="Chinese traditional color 490-荷叶绿"></a>
  <a href="images/533-黛蓝.png"><img src="thumbnails/color-card-533.jpg" width="180" alt="Chinese traditional color 533-黛蓝"></a>
</p>

<p align="center">
  <a href="images/580-松花.png"><img src="thumbnails/color-card-580.jpg" width="180" alt="Chinese traditional color 580-松花"></a>
  <a href="images/607-朱砂红.png"><img src="thumbnails/color-card-607.jpg" width="180" alt="Chinese traditional color 607-朱砂红"></a>
  <a href="images/628-玄青.png"><img src="thumbnails/color-card-628.jpg" width="180" alt="Chinese traditional color 628-玄青"></a>
  <a href="images/658-帝王紫.png"><img src="thumbnails/color-card-658.jpg" width="180" alt="Chinese traditional color 658-帝王紫"></a>
</p>

<p align="center">
  <a href="images/677-浅紫藤萝.png"><img src="thumbnails/color-card-677.jpg" width="180" alt="Chinese traditional color 677-浅紫藤萝"></a>
  <a href="images/695-霁蓝.png"><img src="thumbnails/color-card-695.jpg" width="180" alt="Chinese traditional color 695-霁蓝"></a>
  <a href="images/705-松花绿.png"><img src="thumbnails/color-card-705.jpg" width="180" alt="Chinese traditional color 705-松花绿"></a>
  <a href="images/720-胭脂泪.png"><img src="thumbnails/color-card-720.jpg" width="180" alt="Chinese traditional color 720-胭脂泪"></a>
</p>

<p align="center">
  <a href="images/729-汉绣绿.png"><img src="thumbnails/color-card-729.jpg" width="180" alt="Chinese traditional color 729-汉绣绿"></a>
  <a href="images/735-鎏金.png"><img src="thumbnails/color-card-735.jpg" width="180" alt="Chinese traditional color 735-鎏金"></a>
  <a href="images/741-青黛.png"><img src="thumbnails/color-card-741.jpg" width="180" alt="Chinese traditional color 741-青黛"></a>
  <a href="images/742-深绿.png"><img src="thumbnails/color-card-742.jpg" width="180" alt="Chinese traditional color 742-深绿"></a>
</p>

<!-- gallery:end -->

## Why This Exists

Chinese traditional color references are scattered across the web. When making real work, people often still need to collect images, copy values, compare names, and organize files by hand. This project removes that repeated setup work so the archive can be used directly in design, teaching, writing, product UI, and open-data experiments.

Traditional colors are not only color values. They connect with craft, dyeing, mineral pigments, poetry, seasonal imagery, objects, and aesthetic order. Presenting them as browsable cards makes them easier to feel, compare, remember, and reuse.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=nevertoday/zhongguo-traditional-colors&type=Date)](https://www.star-history.com/#nevertoday/zhongguo-traditional-colors&Date)

## Data Notes

Images use the `NNN-color-name.png` naming pattern and match the [original 742-color list](docs/chinese-color-master-list.md). The current archive contains 742 high-resolution PNG cards.

## Local Preview

```bash
npm run manifest
npm run readme
npm run start
```

Then open:

```text
http://localhost:5173
```

The complete ZIP is provided through GitHub Releases. Browser-side ZIP generation is kept only as a fallback and should be used through a local server or GitHub Pages, not through `file://`.

## Support

This archive remains free and open source. If it saves you time, a Star, a share, a useful issue, or buying 小小东 a coffee through Buy Me a Coffee all help the project keep improving.

<table>
  <tr>
    <td align="center" width="220">
      <img src="docs/images/buy-me-a-coffee-qr.png" alt="Support 小小东 through Buy Me a Coffee QR code" width="180"><br>
      <strong>Buy Me a Coffee</strong>
    </td>
  </tr>
</table>

## License

This project is released under the [MIT License](LICENSE).

Note: Traditional color values may vary across sources, screens, print processes, and materials. Treat this archive as an open reference and verify colors for production use.
