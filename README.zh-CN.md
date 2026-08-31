# 中国传统配色

简体中文 | [English](README.md) | [日本語](README.ja.md)

> 不是又一份“好看但不知道怎么用”的中国色色值表。
>
> 这是一张从 **找色、配色、试色到交付** 的中国传统色工作台：742 张高清色卡、8,904 组配色关系，还能把一个颜色直接放进网页、PPT、封面、UI 主题和终端里试。

[**在线开始试色 →**](https://colors.xiaoxiaodong.ai/) · [用一个颜色生成配色](https://colors.xiaoxiaodong.ai/generator.html) · [下载全部高清色卡](https://github.com/nevertoday/zhongguo-traditional-colors/releases/latest/download/zhongguo-traditional-colors-images.zip)

<p align="center">
  <a href="https://colors.xiaoxiaodong.ai/"><img src="docs/screenshots/home-gallery.png" alt="742 张中国传统色卡在线资料库"></a>
</p>

## 找到好看的中国色不难，难的是把它用对

真正做项目时，你很少只缺一个 HEX。更常见的是：

- 知道“月白”好看，却不知道它适合当背景、正文，还是点缀色；
- 选定了一个主色，还要在几百个颜色中反复试辅色；
- 色板单独看很和谐，一放到标题、按钮和正文上就发灰、抢戏或看不清；
- 设计定了，交给开发时却又要重新补 token、深色模式和对比度。

这个项目把这些原本分散的步骤接在一起：**先帮你找到颜色，再帮你判断它能不能真正落地。**

## 你正在做什么，就从哪里开始

| 你手上的任务 | 直接用 | 你会得到 |
| --- | --- | --- |
| 想找一个有名字、有气质的中国色 | [色卡资料库](https://colors.xiaoxiaodong.ai/#gallery) | 按色名、编号、HEX 或色相搜索，复制色值或下载原图 |
| 已经有主色，但不知道怎么配 | [配色生成器](https://colors.xiaoxiaodong.ai/generator.html) | 五色方案，可锁定、替换、轮换、复制与导出 |
| 不确定颜色放到成品里好不好看 | [场景试色](https://colors.xiaoxiaodong.ai/style-lab.html) | 直接看网页、PPT、封面、海报和品牌板效果 |
| 想看一个颜色的相邻、互补或明暗关系 | [配色灵感](https://colors.xiaoxiaodong.ai/palettes.html) | 8,904 组可浏览、随机、复制和收藏的配色 |
| 要做背景、正文或按钮组合 | [用途卡片](https://colors.xiaoxiaodong.ai/uses.html) | 双色实际版式预览与对比度判断 |
| 要把中国色用进产品 | [Theme Forge](https://colors.xiaoxiaodong.ai/theme-forge.html) | shadcn 浅色/深色语义主题、OKLCH 和 `globals.css` |
| 想把工作环境也换成中国色 | [终端配色](https://colors.xiaoxiaodong.ai/terminal.html) | 16 色 ANSI 与 Ghostty、Alacritty、kitty 等配置 |

## 不只给你灵感，还帮你看到落地效果

### 一个颜色，先放进真实场景再决定

<p align="center">
  <a href="https://colors.xiaoxiaodong.ai/style-lab.html"><img src="docs/screenshots/style-lab.png" alt="中国传统色场景试色工作台"></a>
</p>

同一个主色会被放到背景、标题、正文、按钮和点缀位置。你看的不再是一块孤立色样，而是它在网页、PPT、封面、海报和品牌板中的真实表现。

### 配色不靠猜，用关系缩小选择

<p align="center">
  <a href="https://colors.xiaoxiaodong.ai/palettes.html"><img src="docs/screenshots/palettes.png" alt="8,904 组中国传统色配色关系"></a>
</p>

每个颜色都有同类、邻近、互补、三角、冷暖、明暗、灰调和中性等关系。不必在 742 个颜色里盲试，可以先按配色逻辑缩小范围。

### 从色名走到开发能接的主题

Theme Forge 会把一个锚点色拆成完整的 shadcn 语义色角色，同时处理浅色/深色模式、OKLCH、组件预览和前景对比度，最后直接导出 `globals.css`。

[打开 Theme Forge 试试 →](https://colors.xiaoxiaodong.ai/theme-forge.html)

## 这个项目真正整理了什么

- **742 张高清 PNG 色卡**：编号与 [原始 742 色清单](docs/chinese-color-master-list.md) 一一对应，每张包含色名、HEX、RGB、CMYK、配色提示和气质关键词。
- **8,904 组可追溯的配色关系**：同时提供 [Markdown](docs/chinese-color-harmony.md) 和 [CSV](docs/chinese-color-harmony.csv)，方便阅读、程序处理和二次创作。
- **从参考到交付的工具**：色卡搜索、配色生成、场景试色、渐变、用途卡、shadcn 主题和终端配色都在同一个静态站点中。
- **收藏留在本机**：色卡、色板、用途卡和试色方案保存在浏览器本地，无需登录。
- **10 个可独立安装的 Agent Skills**：让 AI 按设计简报、色板、版面、token、可读性、品牌、图表、旧稿、内容系列和印刷生产继续往下做。

## 如果你用 Claude Code，可以把整套配色经验带走

仓库中的 `xxd-*` Skills 都自带完整的 742 色清单和配色关系，复制一个目录就能独立使用，无需联网取数据。

```bash
git clone https://github.com/nevertoday/zhongguo-traditional-colors.git
cp -r zhongguo-traditional-colors/skills/xxd-palette-builder ~/.claude/skills/
```

| 你卡在哪一步 | 用这个 Skill |
| --- | --- |
| “高级、东方、年轻”还只是模糊感觉 | [`xxd-color-brief`](skills/xxd-color-brief/SKILL.md) |
| 需要从主色收敛成可执行色板 | [`xxd-palette-builder`](skills/xxd-palette-builder/SKILL.md) |
| 有了色板，但不知道放在版面哪里 | [`xxd-palette-applier`](skills/xxd-palette-applier/SKILL.md) |
| 要交给开发，需要 UI token | [`xxd-ui-token`](skills/xxd-ui-token/SKILL.md) |
| 担心文字、按钮或图表看不清 | [`xxd-accessible-color`](skills/xxd-accessible-color/SKILL.md) |
| 要做长期品牌、图表、内容系列或印刷 | [查看全部 10 个 Skills](https://colors.xiaoxiaodong.ai/skills.html) |

## 先看看这些颜色

README 只展示 12 张代表色卡。完整 742 张可以在 [在线色卡库](https://colors.xiaoxiaodong.ai/#gallery)、`images/` 目录或 [Release ZIP](https://github.com/nevertoday/zhongguo-traditional-colors/releases/latest/download/zhongguo-traditional-colors-images.zip) 中查看。

<!-- gallery:start -->
<p align="center">
  <a href="images/001-乳白.png"><img src="thumbnails/color-card-001.jpg" width="180" alt="中国传统色 001-乳白"></a>
  <a href="images/035-秋葵黄.png"><img src="thumbnails/color-card-035.jpg" width="180" alt="中国传统色 035-秋葵黄"></a>
  <a href="images/080-琥珀黄.png"><img src="thumbnails/color-card-080.jpg" width="180" alt="中国传统色 080-琥珀黄"></a>
  <a href="images/135-朱红.png"><img src="thumbnails/color-card-135.jpg" width="180" alt="中国传统色 135-朱红"></a>
</p>

<p align="center">
  <a href="images/188-芙蓉红.png"><img src="thumbnails/color-card-188.jpg" width="180" alt="中国传统色 188-芙蓉红"></a>
  <a href="images/244-枣红.png"><img src="thumbnails/color-card-244.jpg" width="180" alt="中国传统色 244-枣红"></a>
  <a href="images/321-魏紫.png"><img src="thumbnails/color-card-321.jpg" width="180" alt="中国传统色 321-魏紫"></a>
  <a href="images/380-碧青.png"><img src="thumbnails/color-card-380.jpg" width="180" alt="中国传统色 380-碧青"></a>
</p>

<p align="center">
  <a href="images/424-月白.png"><img src="thumbnails/color-card-424.jpg" width="180" alt="中国传统色 424-月白"></a>
  <a href="images/443-翠蓝.png"><img src="thumbnails/color-card-443.jpg" width="180" alt="中国传统色 443-翠蓝"></a>
  <a href="images/490-荷叶绿.png"><img src="thumbnails/color-card-490.jpg" width="180" alt="中国传统色 490-荷叶绿"></a>
  <a href="images/533-黛蓝.png"><img src="thumbnails/color-card-533.jpg" width="180" alt="中国传统色 533-黛蓝"></a>
</p>

<!-- gallery:end -->

## 下载、本地运行与数据复用

原图共约 998 MB，为了不让仓库变得臃肿，完整图包通过 [GitHub Release](https://github.com/nevertoday/zhongguo-traditional-colors/releases/tag/v0.1.0) 分发。

- [下载全部高清 PNG](https://github.com/nevertoday/zhongguo-traditional-colors/releases/latest/download/zhongguo-traditional-colors-images.zip)
- [浏览原始 742 色清单](docs/chinese-color-master-list.md)
- [下载配色关系 CSV](docs/chinese-color-harmony.csv)

本项目是静态站点，本地预览只需：

```bash
npm run manifest
npm run readme
npm run start
```

然后打开 `http://localhost:5173`。新增或替换色卡后，再运行 `npm run manifest && npm run readme` 即可同步图片清单与 README 图廊。

## 使用边界

传统色色值在不同资料、屏幕、印刷工艺和材质上可能存在差异。这个项目适合查找、对比、试配和原型设计；正式印刷或生产前，仍应结合实际媒介打样校色。

## 贡献与许可

欢迎提交 Issue 或 Pull Request；新增色卡、修正色值、补充来源、改进工具和文档都很有价值。请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

项目使用 [MIT License](LICENSE) 开源。如果它帮你少做了一轮找图、抄色值和反复试色，欢迎 Star 或分享给正在做设计的人。

[![Star History Chart](https://api.star-history.com/svg?repos=nevertoday/zhongguo-traditional-colors&type=Date)](https://www.star-history.com/#nevertoday/zhongguo-traditional-colors&Date)
