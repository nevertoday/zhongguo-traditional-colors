# Chinese Traditional Colors

[简体中文](README.zh-CN.md) | English | [日本語](README.ja.md)

If you design interfaces, write visual content, build course material, or put together a cultural website, you often need Chinese colors that look good and can survive a real layout. This repository was organized for that moment.

It collects 742 high-resolution Chinese traditional color cards, mapped one by one to the original 742-color list. Each card keeps the color name, HEX, RGB, CMYK, palette notes, and mood keywords. The website is more than an image archive: you can search colors, test them in real scenes, generate palettes, browse harmony relationships, inspect gradient logic, build background/text usage cards, and save the colors or schemes you want to keep.

## Quick Links

- [Browse the online gallery](https://colors.xiaoxiaodong.ai/)
- [Open the scene testing workbench](https://colors.xiaoxiaodong.ai/style-lab.html)
- [Open the palette generator](https://colors.xiaoxiaodong.ai/generator.html)
- [Open the Chinese color palette board](https://colors.xiaoxiaodong.ai/palettes.html)
- [Open gradient logic cards](https://colors.xiaoxiaodong.ai/gradients.html)
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

## What You Can Do With It

| If you need to | You can use |
| --- | --- |
| Find a Chinese color reference fast | 742 high-resolution PNG color cards |
| Make visuals for design or content | Preview, copy, download, and favorite individual cards |
| Build a local color library | Filenames matched to the 742-color source list |
| Try colors in websites, slides, covers, posters, or brand boards | Scene testing maps one anchor color into background, title, body, button, and accent roles |
| Produce a usable palette quickly | The generator lets you lock, replace, rotate, copy, export, and favorite full schemes |
| Look for harmony and inspiration | Browse 8,904 palettes across same-color, analogous, complementary, triadic, warm/cool, light/dark, gray-tone, and neutral relationships |
| Understand one color as a gradient system | Each traditional color becomes light, anchor, nearby, deep, two-tone, and gradient-path cards |
| Test background/text/button use | Usage cards check contrast and support copy, remix, nearby-color replacement, and favorites |
| Keep the combinations that work | Favorites collect color cards, palettes, usage cards, generated schemes, and scene tests |
| Check names and values | Centralized color names, HEX, RGB, and CMYK references |
| Use traditional colors in a real project | 10 agent skills for practical design workflows |

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

These skills are not another explanation of color theory. They turn the 742-color list and harmony CSV into workflows a designer or builder can use right away. Each skill answers a real blocker: vague art direction, too many palette options, unclear layout placement, token handoff, readability checks, brand governance, chart encoding, legacy color cleanup, long-running content series, and print production.

Every `xxd-*` skill folder bundles the full `references/chinese-color-master-list.md`, `references/chinese-color-harmony.md`, and `references/chinese-color-harmony.csv`. You can take one skill into another project and still have the complete 742-color list plus every color's harmony relationships.

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

### How to choose a skill

If the direction is still vague, start with `xxd-color-brief`. If you already have a main color or a shortlist, use `xxd-palette-builder` to narrow it into a role-based palette, then use `xxd-palette-applier` to place it in a real layout. When the colors need to move into development, a team system, or production, continue with `xxd-ui-token`, `xxd-brand-system`, `xxd-data-viz`, or `xxd-print-packaging`. If you are dealing with old screenshots, CSS, or scattered HEX values, start with `xxd-existing-design-audit`. For long-running content series, start with `xxd-content-series`.

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
