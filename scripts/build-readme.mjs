import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const manifestPath = path.join(root, "assets/data/images.js");
const columns = 4;
const featuredColorIds = [
  "001", "035", "080", "135",
  "188", "244", "321", "380",
  "424", "443", "490", "533",
  "580", "607", "628", "658",
  "677", "695", "705", "720",
  "729", "735", "741", "742",
];
const siteUrl = "https://colors.xiaoxiaodong.ai/";
const styleLabUrl = `${siteUrl}style-lab.html`;
const generatorUrl = `${siteUrl}generator.html`;
const paletteUrl = `${siteUrl}palettes.html`;
const gradientUrl = `${siteUrl}gradients.html`;
const usesUrl = `${siteUrl}uses.html`;
const favoritesUrl = `${siteUrl}favorites.html`;
const skillsUrl = `${siteUrl}skills.html`;
const repoUrl = "https://github.com/nevertoday/zhongguo-traditional-colors";
const releaseUrl = `${repoUrl}/releases/tag/v0.1.0`;
const masterListPath = "docs/chinese-color-master-list.md";
const harmonyCsvPath = "docs/chinese-color-harmony.csv";
const harmonyMarkdownPath = "docs/chinese-color-harmony.md";
const authorUrl = "https://x.com/xiaoxiaodong01";
const starHistoryImageUrl = "https://api.star-history.com/svg?repos=nevertoday/zhongguo-traditional-colors&type=Date";
const starHistoryUrl = "https://www.star-history.com/#nevertoday/zhongguo-traditional-colors&Date";

const featurePages = [
  {
    key: "gallery",
    image: "docs/screenshots/home-gallery.png",
    url: `${siteUrl}#gallery`,
    title: {
      zh: "浏览色卡",
      en: "Browse Color Cards",
      ja: "色カードを閲覧",
    },
    alt: {
      zh: "色卡资料库页面截图",
      en: "Screenshot of the color-card gallery",
      ja: "色カードギャラリーのスクリーンショット",
    },
    description: {
      zh: "按编号、色名、HEX 或色相快速筛选 742 张色卡；每张卡都能预览细节、复制色值、下载原图和加入收藏。",
      en: "Search all 742 cards by number, name, HEX, or hue. Each card supports previewing details, copying values, downloading the original PNG, and saving it locally.",
      ja: "742 枚の色カードを番号、色名、HEX、色相で検索できます。各カードは詳細プレビュー、色値コピー、原寸 PNG ダウンロード、ローカル保存に対応しています。",
    },
  },
  {
    key: "style-lab",
    image: "docs/screenshots/style-lab.png",
    url: styleLabUrl,
    title: {
      zh: "场景试色",
      en: "Scene Testing",
      ja: "シーン試色",
    },
    alt: {
      zh: "场景试色工作台页面截图",
      en: "Screenshot of the scene testing workbench",
      ja: "シーン試色ワークベンチのスクリーンショット",
    },
    description: {
      zh: "选择一个传统色后，直接查看它在网页、PPT、封面、海报和品牌板里的背景、标题、正文、按钮和点缀落位。",
      en: "Pick one traditional color and see how it works across web, slide, cover, poster, and brand-board scenes as background, title, body, button, and accent roles.",
      ja: "伝統色を 1 つ選び、Web、スライド、表紙、ポスター、ブランドボードの背景、タイトル、本文、ボタン、アクセントでの使い方を確認できます。",
    },
  },
  {
    key: "generator",
    image: "docs/screenshots/generator.png",
    url: generatorUrl,
    title: {
      zh: "配色生成",
      en: "Palette Generator",
      ja: "配色ジェネレーター",
    },
    alt: {
      zh: "配色生成器页面截图",
      en: "Screenshot of the palette generator",
      ja: "配色ジェネレーターのスクリーンショット",
    },
    description: {
      zh: "从锚点色或生成方式出发生成五色方案，支持锁定、替换、轮换、反转、复制整组、收藏和导出。",
      en: "Generate five-color schemes from an anchor color or generation mode, then lock, replace, rotate, reverse, copy, favorite, or export the full set.",
      ja: "アンカー色や生成方式から 5 色の配色を作成し、固定、差し替え、回転、反転、コピー、お気に入り、書き出しができます。",
    },
  },
  {
    key: "palettes",
    image: "docs/screenshots/palettes.png",
    url: paletteUrl,
    title: {
      zh: "配色灵感",
      en: "Palette Inspiration",
      ja: "配色インスピレーション",
    },
    alt: {
      zh: "配色灵感页面截图",
      en: "Screenshot of the palette inspiration board",
      ja: "配色インスピレーションボードのスクリーンショット",
    },
    description: {
      zh: "按同类、邻近、互补、三角、冷暖、明暗、灰调和中性等关系浏览 8,904 组配色，并可复制、收藏、随机换组。",
      en: "Explore 8,904 harmony sets across same, analogous, complementary, triadic, temperature, light/dark, gray-tone, and neutral relationships, with copy, favorite, and shuffle actions.",
      ja: "同系、隣接、補色、三角、寒暖、明暗、灰調、中性など 8,904 組の配色関係を閲覧し、コピー、保存、ランダム切り替えができます。",
    },
  },
  {
    key: "uses",
    image: "docs/screenshots/uses.png",
    url: usesUrl,
    title: {
      zh: "用途卡片",
      en: "Usage Cards",
      ja: "用途カード",
    },
    alt: {
      zh: "用途卡片页面截图",
      en: "Screenshot of usage cards",
      ja: "用途カードのスクリーンショット",
    },
    description: {
      zh: "把传统色组合成背景与文字双色卡片，提供字号/版式预览、对比度判断、搜索第二色、复制、换相近和收藏。",
      en: "Build background/text two-color cards with layout previews, contrast checks, second-color search, copy, remix, and favorite actions.",
      ja: "背景色と文字色の 2 色カードを作り、レイアウトプレビュー、コントラスト確認、2 色目検索、コピー、再生成、保存ができます。",
    },
  },
  {
    key: "favorites",
    image: "docs/screenshots/favorites.png",
    url: favoritesUrl,
    title: {
      zh: "收藏",
      en: "Local Favorites",
      ja: "ローカルお気に入り",
    },
    alt: {
      zh: "收藏面板页面截图",
      en: "Screenshot of the local favorites panel",
      ja: "ローカルお気に入りパネルのスクリーンショット",
    },
    description: {
      zh: "集中查看本机保存的色卡、配色、用途卡片、生成方案和场景试色；支持按类型筛选、复制、打开和移除。",
      en: "Review locally saved color cards, palettes, usage cards, generated schemes, and scene tests, with type filters, copy, open, and remove controls.",
      ja: "保存した色カード、配色、用途カード、生成スキーム、シーン試色をまとめて確認し、種類別フィルター、コピー、オープン、削除ができます。",
    },
  },
  {
    key: "skills",
    image: "docs/screenshots/skills.png",
    url: skillsUrl,
    title: {
      zh: "Studio Skills",
      en: "Studio Skills",
      ja: "Studio Skills",
    },
    alt: {
      zh: "Studio Skills 页面截图",
      en: "Screenshot of Studio Skills",
      ja: "Studio Skills のスクリーンショット",
    },
    description: {
      zh: "把 742 色清单和配色关系变成实战工作流：定方向、组色板、放版面、交 token、查可读、定品牌、做图表、修旧稿、做系列和进生产。",
      en: "Turn the 742-color list and harmony data into practical workflows for briefs, palettes, layout placement, tokens, accessibility, brand systems, charts, legacy audits, content series, and print production.",
      ja: "742 色リストと配色関係を、方向決め、色板作成、レイアウト配置、token、可読性、ブランド、図表、旧稿修正、シリーズ、印刷生産の実務フローに変換します。",
    },
  },
];

async function loadManifest() {
  const source = await fs.readFile(manifestPath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: manifestPath });
  return {
    project: sandbox.window.TRADITIONAL_COLOR_PROJECT,
    images: sandbox.window.TRADITIONAL_COLOR_IMAGES,
  };
}

function selectFeaturedImages(images) {
  const byId = new Map(images.map((image) => [image.id, image]));
  const selected = featuredColorIds.map((id) => byId.get(id)).filter(Boolean);
  return selected.length ? selected : images.slice(0, 24);
}

function galleryRows(images, locale) {
  const rows = [];
  const altPrefix = {
    zh: "中国传统色",
    en: "Chinese traditional color",
    ja: "中国伝統色",
  }[locale];

  for (let index = 0; index < images.length; index += columns) {
    const rowImages = images.slice(index, index + columns);
    const links = rowImages
      .map((image) => {
        const thumb = `thumbnails/color-card-${image.id}.jpg`;
        const title = image.file.replace(/\.[^.]+$/, "");
        return `  <a href="${image.path}"><img src="${thumb}" width="180" alt="${altPrefix} ${title}"></a>`;
      })
      .join("\n");

    rows.push(`<p align="center">\n${links}\n</p>`);
  }

  return rows.join("\n\n");
}

function featureGuide(locale) {
  return featurePages.map((feature) => `### [${feature.title[locale]}](${feature.url})

<p align="center">
  <a href="${feature.url}"><img src="${feature.image}" alt="${feature.alt[locale]}"></a>
</p>

${feature.description[locale]}`).join("\n\n");
}

function languageSwitch(current) {
  const links = {
    zh: current === "zh" ? "简体中文" : "[简体中文](README.zh-CN.md)",
    en: current === "en" ? "English" : "[English](README.md)",
    ja: current === "ja" ? "日本語" : "[日本語](README.ja.md)",
  };

  return `${links.zh} | ${links.en} | ${links.ja}`;
}

function starHistoryBlock() {
  return `[![Star History Chart](${starHistoryImageUrl})](${starHistoryUrl})`;
}

function renderZh(project, images) {
  const totalMb = Math.round(project.totalBytes / 1024 / 1024);
  const zipUrl = `${repoUrl}/releases/latest/download/${project.archiveName}`;
  const previewImages = selectFeaturedImages(images);

  return `# 中国传统配色

${languageSwitch("zh")}

如果你在做设计、写内容、做课件、搭建网页主题，常常需要一套稳妥、好看、能直接落版的中国色参考，这个仓库就是为这件事整理的。

这里收录 ${project.count} 张中华传统色高清色卡，已按原始 742 色清单完整覆盖。每张色卡包含色名、HEX、RGB、CMYK、配色推荐和气质关键词。现在它不只是素材库，也是一套可交互的中国色工作台：可以查色、试场景、生成色板、浏览配色关系、查看渐变逻辑、制作用途卡片，并把喜欢的色卡和整组方案收藏到本机。

## 快速入口

- [在线浏览色卡](${siteUrl})
- [场景试色工作台](${styleLabUrl})
- [中国色配色生成](${generatorUrl})
- [中国色配色灵感](${paletteUrl})
- [渐变逻辑卡片](${gradientUrl})
- [用途卡片](${usesUrl})
- [本机收藏面板](${favoritesUrl})
- [中国传统色 Studio Skills](${skillsUrl})
- [直接下载完整 ZIP](${zipUrl})
- [查看 Release](${releaseUrl})
- [原始 742 色清单](${masterListPath})
- [742 色配色方案 Markdown](${harmonyMarkdownPath})
- [742 色配色关系 CSV](${harmonyCsvPath})
- [中国传统色实战 Skills](#中国传统色实战-skills)
- [作者 X 主页](${authorUrl})

## 这个项目能帮你什么

| 你需要 | 这里提供 |
| --- | --- |
| 快速找中国色参考 | ${project.count} 张高清 PNG 色卡 |
| 做设计和内容配图 | 可直接预览、复制、下载、收藏单张色卡 |
| 搭建色彩资料库 | 文件名与 742 色清单一一对应 |
| 做网页、PPT、封面、海报、品牌板 | 场景试色会把主色拆成背景、标题、正文、按钮和点缀角色 |
| 快速产出一组可用 palette | 配色生成支持锁定、替换、轮换、复制、导出和收藏 |
| 找配色关系和灵感 | 按同类、邻近、互补、三角、冷暖、明暗、灰调等关系浏览 8,904 组配色 |
| 理解单色渐变逻辑 | 每个传统色生成浅阶、本色、邻近、深阶、双色切片和渐变路径 |
| 做背景/文字/按钮用途卡 | 用途卡片会检查对比度，并支持复制、换相近和收藏整组双色方案 |
| 留住喜欢的方案 | 收藏面板集中查看色卡、配色、用途卡片、生成方案和场景试色 |
| 校对色名和色值 | 色名、HEX、RGB、CMYK 集中整理 |
| 把传统色真正用进项目 | 10 个面向设计实战的 Agent Skills |

原图约 ${totalMb} MB。ZIP 文件作为 GitHub Release 附件提供，不直接提交进仓库。

## 功能截图导览

${featureGuide("zh")}

## 中国传统色实战 Skills

这些 skill 不是继续解释色彩理论，而是把 742 色清单和配色关系 CSV 转成设计师能直接使用的工作流。每个 skill 都对应一个真实工作阻塞点：方向太虚、色板太多、落位困难、Token 交付、可读性、品牌治理、图表编码、旧稿迁移、系列内容和印刷生产。

每个 \`xxd-*\` skill 目录都随包包含完整 \`references/chinese-color-master-list.md\`、\`references/chinese-color-harmony.md\` 和 \`references/chinese-color-harmony.csv\`，单独取用某个 skill 时也能访问完整 742 色清单和每个颜色的配色关系。

| Skill | 适合解决的问题 |
| --- | --- |
| [\`xxd-color-brief\`](skills/xxd-color-brief/SKILL.md) | 把“高级、东方、年轻、克制”这类模糊方向翻译成冷暖、明度、饱和度、对比和避坑约束 |
| [\`xxd-palette-builder\`](skills/xxd-palette-builder/SKILL.md) | 从锚点色、HEX、情绪或场景中筛出少量可执行 palette，并分配主辅点缀和比例 |
| [\`xxd-palette-applier\`](skills/xxd-palette-applier/SKILL.md) | 把一组颜色落到真实版面，决定背景、标题、正文、CTA、结构和装饰的位置 |
| [\`xxd-ui-token\`](skills/xxd-ui-token/SKILL.md) | 把传统色变成 primitive、semantic、component、mode 四层 UI token 和代码输出 |
| [\`xxd-accessible-color\`](skills/xxd-accessible-color/SKILL.md) | 用 WCAG ratio 检查文字、按钮、状态和图表，并用同库颜色修复失败组合 |
| [\`xxd-brand-system\`](skills/xxd-brand-system/SKILL.md) | 为长期品牌建立锚点色、支撑色、比例、渠道规则、禁用组合和治理边界 |
| [\`xxd-data-viz\`](skills/xxd-data-viz/SKILL.md) | 按分类、顺序、发散、高亮或语义状态生成图表色，而不是套海报色板 |
| [\`xxd-existing-design-audit\`](skills/xxd-existing-design-audit/SKILL.md) | 盘点旧稿、CSS、Figma styles 或 HEX 清单，判断保留、合并、替换或移除 |
| [\`xxd-content-series\`](skills/xxd-content-series/SKILL.md) | 为小红书、公众号、视频、课程和栏目建立固定层、变量层、模板层和轮换规则 |
| [\`xxd-print-packaging\`](skills/xxd-print-packaging/SKILL.md) | 面向包装、书籍、文创、标签和实体材质规划用色，并提示 CMYK、材质和打样风险 |

### 怎么选择这些 Skills

如果你还没有确定方向，先用 \`xxd-color-brief\`。如果已经有一个主色或一组候选色，用 \`xxd-palette-builder\` 收敛成色板，再用 \`xxd-palette-applier\` 放到真实版面。要交给开发、团队或生产环节时，再进入 \`xxd-ui-token\`、\`xxd-brand-system\`、\`xxd-data-viz\` 或 \`xxd-print-packaging\`。如果你手上是旧稿、旧 CSS 或散乱 HEX，先用 \`xxd-existing-design-audit\` 做盘点。长期内容矩阵则从 \`xxd-content-series\` 开始。

下面是每个 skill 的详细使用方案。每一项都按“它帮谁、解决什么、你要输入什么、会得到什么、怎么触发”来写，方便直接复制到自己的项目里改。

<details>
<summary><strong><code>xxd-color-brief</code>：把模糊审美词变成配色方向</strong></summary>

**利他价值**：帮客户、设计师和执行者先对齐判断语言，减少“我觉得不高级”“这个不够东方”这类主观拉扯。

**适合谁用**：项目刚启动的设计师、品牌负责人、内容团队、课程或活动视觉负责人。

**典型场景**：只有 moodboard、参考图、品牌关键词或客户口头反馈，还不适合直接选色。

**输入什么**：项目载体、目标人群、希望传递的气质、必须避开的感觉、已有参考图或竞品。

**得到什么**：冷暖、明度、饱和度、对比强度、风险边界、3 到 5 个起始传统色，以及下一步推荐使用的 skill。

**使用方式**：先让它输出方向简报，再把简报里的锚点色交给 \`xxd-palette-builder\` 生成具体色板。

示例触发：

<pre><code>/xxd-color-brief 为新中式茶饮品牌做年轻但不俗的配色方向，受众是 20-35 岁女性，避免廉价国潮感</code></pre>

[查看完整 Skill](skills/xxd-color-brief/SKILL.md)

</details>

<details>
<summary><strong><code>xxd-palette-builder</code>：从 742 色里筛出可执行色板</strong></summary>

**利他价值**：把选择困难变成少量可比较方案，让团队不用在几百个颜色里反复试错。

**适合谁用**：已经有锚点色、品牌关键词、HEX 清单、参考图或初步视觉方向的人。

**典型场景**：要做官网、封面、PPT、海报、包装或 UI，但不知道主色、辅色、点缀色怎么分配。

**输入什么**：锚点色或色名、用途、希望稳妥还是更有记忆点、浅色/深色偏好、禁用色或品牌限制。

**得到什么**：主色、辅色、背景色、强调色、推荐比例、替代方案、使用风险和可继续落版的色板。

**使用方式**：先选一个方向最明确的锚点色；如果没有锚点色，先用 \`xxd-color-brief\`。拿到色板后，用 \`xxd-palette-applier\` 判断具体放在哪里。

示例触发：

<pre><code>/xxd-palette-builder 以月白为锚点，为文化类网站首页生成主辅点缀色板，要求安静、有层次、适合长文阅读</code></pre>

[查看完整 Skill](skills/xxd-palette-builder/SKILL.md)

</details>

<details>
<summary><strong><code>xxd-palette-applier</code>：把色板放进真实版面</strong></summary>

**利他价值**：让颜色服务信息层级和阅读路径，而不是让所有颜色同时争抢注意力。

**适合谁用**：已经有色板，但不知道背景、标题、正文、按钮、边框、装饰分别用什么颜色的人。

**典型场景**：网页首屏、PPT 封面、课程详情页、文章长图、包装正反面或社媒模板。

**输入什么**：已有色板、页面结构、主要信息层级、用户最应该先看到什么、哪些区域需要克制。

**得到什么**：背景/内容/行动/结构/细节五类角色、面积比例、版面落点、错误用法和替代建议。

**使用方式**：先把色板中的每个颜色分配角色，再按面积比例落版；如果最后要交给开发，继续用 \`xxd-ui-token\`。

示例触发：

<pre><code>/xxd-palette-applier 把月白、黛蓝、绛紫、银朱这组传统色用到课程封面和详情页首屏，重点突出报名按钮</code></pre>

[查看完整 Skill](skills/xxd-palette-applier/SKILL.md)

</details>

<details>
<summary><strong><code>xxd-ui-token</code>：把传统色变成开发能接的 UI Token</strong></summary>

**利他价值**：让设计、开发和后续维护共用同一套命名规则，减少硬编码、返工和深色模式混乱。

**适合谁用**：做网站、App、后台、工具、设计系统、Figma variables 或 Tailwind 主题的人。

**典型场景**：设计稿已经定色，但开发需要 CSS variables、Tailwind config、Figma token 或浅深色模式规则。

**输入什么**：产品类型、已有色板、组件类型、浅色/深色模式要求、输出格式、需要保留的品牌色。

**得到什么**：primitive、semantic、component、mode 四层 token，默认 CSS variables，也可以改成 Tailwind 或 Figma 结构。

**使用方式**：先让它建立 token 命名和角色，再给开发接入。上线前建议再用 \`xxd-accessible-color\` 检查关键文本和按钮。

示例触发：

<pre><code>/xxd-ui-token 把这组中国传统色转成官网浅色和暗色模式 CSS variables，包含按钮、边框、背景、文本和焦点态</code></pre>

[查看完整 Skill](skills/xxd-ui-token/SKILL.md)

</details>

<details>
<summary><strong><code>xxd-accessible-color</code>：检查传统色是否真的读得清</strong></summary>

**利他价值**：照顾真实阅读者和操作场景，让传统色的美感不牺牲清晰度、可读性和可访问性。

**适合谁用**：需要检查正文、按钮、图表、状态提示、标签、焦点态或深色模式的人。

**典型场景**：颜色看起来很雅致，但文字压上去变浅，按钮不够明显，图表系列很难区分。

**输入什么**：前景色、背景色、用途、字号、是否为正文/按钮/状态/图表、是否需要通过 WCAG 标准。

**得到什么**：contrast ratio、通过/条件可用/失败判断、同库替代色、非颜色提示建议和修复方案。

**使用方式**：在页面上线、交付开发、制作图表或印刷小字前使用。失败组合不要硬撑，优先换同库替代色。

示例触发：

<pre><code>/xxd-accessible-color 检查 #F9F4DC 背景上的 #5C2223 正文和按钮文字是否适合网页阅读，并给出同库替代色</code></pre>

[查看完整 Skill](skills/xxd-accessible-color/SKILL.md)

</details>

<details>
<summary><strong><code>xxd-brand-system</code>：把一次配色沉淀成长期品牌规则</strong></summary>

**利他价值**：让团队有长期决策依据，减少每次活动、海报、官网或包装都重新争论颜色。

**适合谁用**：品牌升级、产品官网、社媒矩阵、包装系列、内容栏目或长期视觉系统负责人。

**典型场景**：已经有一组不错的中国传统色，但还没有品牌锚点、使用比例、渠道规则和禁用组合。

**输入什么**：行业、价格带、目标用户、竞品差异、品牌性格、主要渠道、已有色板或必须保留的颜色。

**得到什么**：品牌锚点色、支撑色、强调色、默认比例、渠道差异、禁用组合和后续 token 化建议。

**使用方式**：先用它确定长期规则，再把规则交给内容、设计和开发团队。需要落地 UI 时接 \`xxd-ui-token\`。

示例触发：

<pre><code>/xxd-brand-system 为文创香氛品牌建立传统色规范，覆盖官网、包装、小红书封面和线下展陈</code></pre>

[查看完整 Skill](skills/xxd-brand-system/SKILL.md)

</details>

<details>
<summary><strong><code>xxd-data-viz</code>：按数据含义生成传统色图表方案</strong></summary>

**利他价值**：让读者先看懂数据，再感受到中国传统色气质；图表颜色首先要服务理解。

**适合谁用**：做仪表盘、报告图表、地图、热力图、数据故事、课程数据页或可视化组件的人。

**典型场景**：海报色板直接放进图表后，分类分不清、顺序没轻重、正负发散没有中点。

**输入什么**：图表类型、系列数量、背景色、数据是分类/顺序/发散/高亮/语义状态中的哪一种。

**得到什么**：分类色数组、顺序色带、发散色带、高亮色、状态色，以及 ECharts、D3、Chart.js 可用格式。

**使用方式**：先判断数据关系，再让 skill 出色彩编码。不要把装饰色当图表色，必要时用 \`xxd-accessible-color\` 检查区分度。

示例触发：

<pre><code>/xxd-data-viz 为 7 个分类和一个高亮系列生成 ECharts 中国传统色数组，背景是浅色，要求分类容易区分</code></pre>

[查看完整 Skill](skills/xxd-data-viz/SKILL.md)

</details>

<details>
<summary><strong><code>xxd-existing-design-audit</code>：把旧稿和散乱 HEX 迁移到传统色体系</strong></summary>

**利他价值**：尊重旧项目里已经有效的识别资产，只清理真正造成混乱、重复或难维护的颜色。

**适合谁用**：手上有旧官网、旧 CSS、Figma styles、历史海报、品牌色表或一串散乱 HEX 的团队。

**典型场景**：旧稿颜色很多，没人知道哪些该保留、哪些该合并、哪些只是临时色。

**输入什么**：HEX 清单、截图描述、颜色当前用途、不能轻易改的颜色、希望迁移到传统色的程度。

**得到什么**：颜色盘点、相近传统色映射、保留/合并/替换/移除建议、迁移风险和执行顺序。

**使用方式**：先做审计，不要一上来全量替换。确认保留色后，再用 \`xxd-brand-system\` 或 \`xxd-ui-token\` 沉淀规则。

示例触发：

<pre><code>/xxd-existing-design-audit 审计这组 CSS 颜色，映射到最接近的中国传统色，并告诉我哪些应该保留或合并</code></pre>

[查看完整 Skill](skills/xxd-existing-design-audit/SKILL.md)

</details>

<details>
<summary><strong><code>xxd-content-series</code>：为长期内容建立统一但不疲劳的色彩系统</strong></summary>

**利他价值**：帮内容团队稳定生产，既保留栏目识别度，也降低每期重新设计封面和模板的压力。

**适合谁用**：小红书、公众号、视频封面、课程课件、newsletter、栏目海报和长期内容矩阵。

**典型场景**：每期都重新配色会散，完全固定又容易腻，团队难以长期执行同一套视觉语言。

**输入什么**：平台、栏目数量、更新节奏、模板类型、固定元素、可变化元素和希望形成的内容气质。

**得到什么**：固定层、变量层、模板层、栏目色、特殊期色、轮换规则和内容生产检查清单。

**使用方式**：先把栏目分层，再决定哪些颜色长期固定、哪些颜色轮换。需要做成品牌规范时接 \`xxd-brand-system\`。

示例触发：

<pre><code>/xxd-content-series 为小红书 5 个栏目做统一但不重复的封面色彩系统，每周更新 3 次，要求传统但不老气</code></pre>

[查看完整 Skill](skills/xxd-content-series/SKILL.md)

</details>

<details>
<summary><strong><code>xxd-print-packaging</code>：把屏幕色推进到包装和印刷生产</strong></summary>

**利他价值**：提前照顾印刷、材质、供应商和最终实物效果，减少交付后才发现色差或小字不可读的成本。

**适合谁用**：包装、书籍、礼盒、文创、标签、实体材料、展陈和需要给印刷方沟通的项目。

**典型场景**：屏幕 HEX 看起来很好，但实际受 CMYK、纸张、油墨、覆膜、烫金、光线和材质影响很大。

**输入什么**：品类、材质、工艺、预算/价格带、系列数量、是否需要专色、小字和条码区域要求。

**得到什么**：正背侧面板用色、系列变体规则、CMYK 风险、材质建议、小字和条码提醒、打样检查清单。

**使用方式**：先用它做生产前风险排查，再与供应商确认打样。不要直接把屏幕 HEX 当最终印刷值。

示例触发：

<pre><code>/xxd-print-packaging 为茶叶礼盒规划传统色、系列变体和印刷打样清单，材质是哑粉纸加局部烫金</code></pre>

[查看完整 Skill](skills/xxd-print-packaging/SKILL.md)

</details>

## 精选色卡预览

README 只展示 ${previewImages.length} 张代表性色卡，避免页面过长。完整 ${project.count} 张可以在 [在线色卡资料库](${siteUrl}#gallery)、\`images/\` 目录或 Release ZIP 中查看和下载。

<!-- gallery:start -->
${galleryRows(previewImages, "zh")}

<!-- gallery:end -->

## 为什么整理这个项目

中文世界里有很多传统色资料，但真正做东西时，经常还要自己到处找图、抄色值、对照色名、整理文件。这个项目把这些重复劳动提前做掉，让设计师、老师、内容创作者和开发者可以直接拿来参考、下载和二次整理。

中国传统色不只是一组漂亮色值，也连接着器物、织染、矿物颜料、诗词意象、节气物候和审美秩序。把它们做成一张张可浏览的色卡，会比单纯看表格更容易建立感觉，也更容易被更多人用起来。

## 适合谁用

- 设计师可以把它当作品牌配色、界面主题和视觉实验的参考板
- 内容创作者可以用它做封面、海报、长图和传统文化选题配图
- 老师和学生可以用它做色彩课程、美术教学、传统文化课件
- 前端开发者可以用它做主题页面、颜色工具、素材站和开放数据实验
- 对传统色感兴趣的人可以直接浏览，慢慢建立自己的色彩词汇

## Star History

${starHistoryBlock()}

## 数据说明

图片文件统一按 \`NNN-颜色名.png\` 命名，编号与 [原始 742 色清单](${masterListPath}) 保持一致。当前图片与清单一一对应，共 ${project.count} 张高清 PNG 色卡。

## 项目结构

\`\`\`text
images/       高清 PNG 原图，共 ${project.count} 张
thumbnails/   色卡预览缩略图，共 ${project.count} 张
docs/screenshots/ README 功能截图
docs/         README 使用的项目说明图片
assets/       静态站点样式、脚本和图片清单
skills/       面向设计实战的中国传统色 Agent Skills
scripts/      图片清单、README 和打包脚本
downloads/    本地生成的下载压缩包，不建议提交到 Git
\`\`\`

## 快速开始

本项目是静态站点，克隆后可以直接启动本地服务器：

\`\`\`bash
npm run manifest
npm run readme
npm run start
\`\`\`

然后访问：

\`\`\`text
http://localhost:5173
\`\`\`

也可以直接部署到 GitHub Pages。完整 ZIP 通过 Release 附件分发；浏览器备用打包需要通过本地服务器或线上静态站访问，不建议直接用 \`file://\` 打开。

## 更新图片清单

新增、删除或替换 \`images/\` 中的图片后，运行：

\`\`\`bash
npm run manifest
npm run readme
\`\`\`

这会重新生成 \`assets/data/images.js\` 和 README 精选图廊。新增图片时请同时补充对应 \`thumbnails/\` 缩略图，并保持 \`NNN-颜色名.png\` 的命名格式。

## 支持作者

这个传统色图片合集会继续保持免费开源。如果它帮你省了整理素材的时间，欢迎 Star、分享给需要的人，或者用微信、支付宝支持小小东继续维护。反馈和 issue 同样有帮助。

<table>
  <tr>
    <td align="center" width="220">
      <img src="docs/images/wechat-reward-qr.png" alt="微信打赏小小东的二维码" width="180"><br>
      <strong>微信</strong>
    </td>
    <td align="center" width="220">
      <img src="docs/images/alipay-reward-qr.png" alt="支付宝打赏小小东的二维码" width="180"><br>
      <strong>支付宝</strong>
    </td>
  </tr>
</table>

## 联系作者

可以通过作者 X 主页联系：[@xiaoxiaodong01](${authorUrl})。

## 贡献

欢迎提交 Issue 或 Pull Request。新增色卡、修正色值、补充来源、优化页面和完善文档都很有价值。开始前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

本项目使用 [MIT License](LICENSE) 开源。

请注意：传统色色值在不同资料、屏幕、印刷和材质中可能存在差异。本项目提供的是开放整理和学习资料，实际生产使用前应结合媒介校验。
`;
}

function renderEn(project, images) {
  const totalMb = Math.round(project.totalBytes / 1024 / 1024);
  const zipUrl = `${repoUrl}/releases/latest/download/${project.archiveName}`;
  const previewImages = selectFeaturedImages(images);

  return `# Chinese Traditional Colors

${languageSwitch("en")}

If you design interfaces, write visual content, build course material, or put together a cultural website, you often need Chinese colors that look good and can survive a real layout. This repository was organized for that moment.

It collects ${project.count} high-resolution Chinese traditional color cards, mapped one by one to the original 742-color list. Each card keeps the color name, HEX, RGB, CMYK, palette notes, and mood keywords. The website is more than an image archive: you can search colors, test them in real scenes, generate palettes, browse harmony relationships, inspect gradient logic, build background/text usage cards, and save the colors or schemes you want to keep.

## Quick Links

- [Browse the online gallery](${siteUrl})
- [Open the scene testing workbench](${styleLabUrl})
- [Open the palette generator](${generatorUrl})
- [Open the Chinese color palette board](${paletteUrl})
- [Open gradient logic cards](${gradientUrl})
- [Open usage cards](${usesUrl})
- [Open local favorites](${favoritesUrl})
- [Open Studio Skills](${skillsUrl})
- [Download the complete ZIP](${zipUrl})
- [View the Release](${releaseUrl})
- [Original 742-color list](${masterListPath})
- [742-color harmony Markdown](${harmonyMarkdownPath})
- [742-color harmony CSV](${harmonyCsvPath})
- [Practical Chinese color skills](#practical-chinese-color-skills)
- [Author on X](${authorUrl})

## What You Can Do With It

| If you need to | You can use |
| --- | --- |
| Find a Chinese color reference fast | ${project.count} high-resolution PNG color cards |
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

The original image set is about ${totalMb} MB. The ZIP is distributed as a GitHub Release asset instead of being committed to the repository.

## Feature Screenshots

${featureGuide("en")}

## Practical Chinese Color Skills

These skills are not another explanation of color theory. They turn the 742-color list and harmony CSV into workflows a designer or builder can use right away. Each skill answers a real blocker: vague art direction, too many palette options, unclear layout placement, token handoff, readability checks, brand governance, chart encoding, legacy color cleanup, long-running content series, and print production.

Every \`xxd-*\` skill folder bundles the full \`references/chinese-color-master-list.md\`, \`references/chinese-color-harmony.md\`, and \`references/chinese-color-harmony.csv\`. You can take one skill into another project and still have the complete 742-color list plus every color's harmony relationships.

| Skill | Use it for |
| --- | --- |
| [\`xxd-color-brief\`](skills/xxd-color-brief/SKILL.md) | Translate vague terms like premium, Eastern, young, or restrained into temperature, lightness, saturation, contrast, and risk constraints |
| [\`xxd-palette-builder\`](skills/xxd-palette-builder/SKILL.md) | Filter anchor colors, HEX values, moods, or contexts into a small role-based palette with ratios |
| [\`xxd-palette-applier\`](skills/xxd-palette-applier/SKILL.md) | Place colors into real layouts by deciding background, title, body, CTA, structure, and decoration roles |
| [\`xxd-ui-token\`](skills/xxd-ui-token/SKILL.md) | Convert traditional colors into primitive, semantic, component, and mode-aware UI tokens |
| [\`xxd-accessible-color\`](skills/xxd-accessible-color/SKILL.md) | Check text, button, state, and chart pairs with WCAG ratios and repair failures from the same color set |
| [\`xxd-brand-system\`](skills/xxd-brand-system/SKILL.md) | Build brand anchors, support colors, ratios, channel rules, forbidden combinations, and governance boundaries |
| [\`xxd-data-viz\`](skills/xxd-data-viz/SKILL.md) | Create chart colors by categorical, sequential, diverging, highlight, or semantic data meaning instead of poster palettes |
| [\`xxd-existing-design-audit\`](skills/xxd-existing-design-audit/SKILL.md) | Inventory legacy screenshots, CSS, Figma styles, or HEX lists and decide what to keep, merge, replace, or remove |
| [\`xxd-content-series\`](skills/xxd-content-series/SKILL.md) | Build fixed, variable, template, and rotation layers for social, editorial, course, and video series |
| [\`xxd-print-packaging\`](skills/xxd-print-packaging/SKILL.md) | Plan packaging, books, cultural goods, labels, and physical materials with CMYK, substrate, and proofing risks |

### How to choose a skill

If the direction is still vague, start with \`xxd-color-brief\`. If you already have a main color or a shortlist, use \`xxd-palette-builder\` to narrow it into a role-based palette, then use \`xxd-palette-applier\` to place it in a real layout. When the colors need to move into development, a team system, or production, continue with \`xxd-ui-token\`, \`xxd-brand-system\`, \`xxd-data-viz\`, or \`xxd-print-packaging\`. If you are dealing with old screenshots, CSS, or scattered HEX values, start with \`xxd-existing-design-audit\`. For long-running content series, start with \`xxd-content-series\`.

## Featured Color Preview

The README shows ${previewImages.length} representative cards so the page stays readable. Browse or download the complete ${project.count}-card archive through the [online gallery](${siteUrl}#gallery), the \`images/\` directory, or the Release ZIP.

<!-- gallery:start -->
${galleryRows(previewImages, "en")}

<!-- gallery:end -->

## Why This Exists

Chinese traditional color references are scattered across the web. When making real work, people often still need to collect images, copy values, compare names, and organize files by hand. This project removes that repeated setup work so the archive can be used directly in design, teaching, writing, product UI, and open-data experiments.

Traditional colors are not only color values. They connect with craft, dyeing, mineral pigments, poetry, seasonal imagery, objects, and aesthetic order. Presenting them as browsable cards makes them easier to feel, compare, remember, and reuse.

## Star History

${starHistoryBlock()}

## Data Notes

Images use the \`NNN-color-name.png\` naming pattern and match the [original 742-color list](${masterListPath}). The current archive contains ${project.count} high-resolution PNG cards.

## Local Preview

\`\`\`bash
npm run manifest
npm run readme
npm run start
\`\`\`

Then open:

\`\`\`text
http://localhost:5173
\`\`\`

The complete ZIP is provided through GitHub Releases. Browser-side ZIP generation is kept only as a fallback and should be used through a local server or GitHub Pages, not through \`file://\`.

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
`;
}

function renderJa(project, images) {
  const totalMb = Math.round(project.totalBytes / 1024 / 1024);
  const zipUrl = `${repoUrl}/releases/latest/download/${project.archiveName}`;
  const previewImages = selectFeaturedImages(images);

  return `# 中国伝統色

${languageSwitch("ja")}

このリポジトリは、デザイン、教材、記事、Web テーマ、文化研究でそのまま使える中国伝統色の資料兼ワークベンチです。

${project.count} 枚の高解像度カラーカードを収録し、元の 742 色リストと対応させています。各カードには色名、HEX、RGB、CMYK、配色の参考、雰囲気のキーワードをまとめています。現在のサイトでは、色カード閲覧だけでなく、実際のレイアウトでの試色、配色生成、配色関係の閲覧、グラデーションロジックの確認、用途カード作成、気に入った色や配色のローカル保存もできます。

## クイックリンク

- [オンラインギャラリーを見る](${siteUrl})
- [シーン試色ワークベンチを見る](${styleLabUrl})
- [配色ジェネレーターを見る](${generatorUrl})
- [中国色パレットボードを見る](${paletteUrl})
- [グラデーションロジックカードを見る](${gradientUrl})
- [用途カードを見る](${usesUrl})
- [ローカルお気に入りを見る](${favoritesUrl})
- [Studio Skills を見る](${skillsUrl})
- [完全 ZIP をダウンロード](${zipUrl})
- [Release を見る](${releaseUrl})
- [元の 742 色リスト](${masterListPath})
- [742 色配色 Markdown](${harmonyMarkdownPath})
- [742 色配色 CSV](${harmonyCsvPath})
- [実用向け中国色 Skills](#実用向け中国色-skills)
- [作者の X](${authorUrl})

## このプロジェクトでできること

| 目的 | 提供内容 |
| --- | --- |
| 中国色の参考をすばやく探す | ${project.count} 枚の高解像度 PNG カード |
| デザインや記事素材に使う | カードのプレビュー、コピー、単体ダウンロード、お気に入り保存 |
| ローカルの色資料ライブラリを作る | 742 色リストに対応したファイル名 |
| Web、スライド、表紙、ポスター、ブランド案に使う | シーン試色で主色を背景、タイトル、本文、ボタン、アクセントに分解 |
| すぐ使えるパレットを作る | 配色ジェネレーターで固定、差し替え、順序変更、コピー、書き出し、お気に入り保存 |
| 配色関係から探す | 同系、隣接、補色、三角、寒暖、明暗、灰調、中性など 8,904 組の配色を閲覧 |
| 単色のグラデーションを理解する | 各伝統色を浅階、本色、隣接、深階、2 tone、gradation のカードとして表示 |
| 背景/文字の用途を試す | 用途カードでコントラストを確認し、2 色スキームをコピー、再生成、お気に入り保存 |
| 良い組み合わせを残す | お気に入りパネルで色カード、パレット、用途カード、生成スキーム、シーン試色をまとめて管理 |
| 色名と色値を確認する | 色名、HEX、RGB、CMYK の整理済みリファレンス |
| 伝統色を実際の制作に落とし込む | 実務向けの Agent Skills 10 種 |

元画像は約 ${totalMb} MB です。ZIP は GitHub Release の添付ファイルとして配布し、リポジトリ本体には含めていません。

## 機能スクリーンショット

${featureGuide("ja")}

## 実用向け中国色 Skills

これらの skill は、742 色リストと配色 CSV を、デザイン実務で使えるワークフローに変換します。それぞれが別々の実務上の詰まりを扱います。方向性が曖昧、色板が多すぎる、配置できない、token 連携、可読性、ブランドのぶれ、図表の色分け、既存稿の修正、連載疲れ、印刷の不確実性です。

各 \`xxd-*\` skill フォルダには、完全な \`references/chinese-color-master-list.md\`、\`references/chinese-color-harmony.md\`、\`references/chinese-color-harmony.csv\` を同梱しています。単独で skill を使う場合でも、742 色リストと各色の配色関係を参照できます。

| Skill | 用途 |
| --- | --- |
| [\`xxd-color-brief\`](skills/xxd-color-brief/SKILL.md) | 高級、東洋的、若い、抑制的などの曖昧な語を、寒暖、明度、彩度、対比、リスク条件に翻訳 |
| [\`xxd-palette-builder\`](skills/xxd-palette-builder/SKILL.md) | アンカー色、HEX、ムード、用途から、役割と比率を持つ少数の実用 palette を選定 |
| [\`xxd-palette-applier\`](skills/xxd-palette-applier/SKILL.md) | 背景、タイトル、本文、CTA、構造、装飾として実際のレイアウトに色を配置 |
| [\`xxd-ui-token\`](skills/xxd-ui-token/SKILL.md) | 中国伝統色を primitive、semantic、component、mode 対応の UI token に変換 |
| [\`xxd-accessible-color\`](skills/xxd-accessible-color/SKILL.md) | 文字、ボタン、状態、図表の組み合わせを WCAG ratio で確認し、同じ色セットから修正 |
| [\`xxd-brand-system\`](skills/xxd-brand-system/SKILL.md) | ブランドの基準色、補助色、比率、チャネル規則、禁止組み合わせ、運用境界を設計 |
| [\`xxd-data-viz\`](skills/xxd-data-viz/SKILL.md) | ポスター色板ではなく、分類、連続、発散、強調、意味状態に合わせて図表色を作成 |
| [\`xxd-existing-design-audit\`](skills/xxd-existing-design-audit/SKILL.md) | 既存スクリーンショット、CSS、Figma styles、HEX リストを棚卸しし、保持、統合、置換、削除を判断 |
| [\`xxd-content-series\`](skills/xxd-content-series/SKILL.md) | SNS、記事、講座、動画シリーズ向けに固定層、可変層、テンプレート層、ローテーション規則を作成 |
| [\`xxd-print-packaging\`](skills/xxd-print-packaging/SKILL.md) | 包装、書籍、文創、ラベル、物理素材向けに CMYK、素材、校正リスクを含めて計画 |

## 代表色カードプレビュー

README ではページを読みやすく保つため、代表的な ${previewImages.length} 枚だけを掲載しています。完全な ${project.count} 枚は [オンラインギャラリー](${siteUrl}#gallery)、\`images/\` ディレクトリ、または Release ZIP から確認・ダウンロードできます。

<!-- gallery:start -->
${galleryRows(previewImages, "ja")}

<!-- gallery:end -->

## なぜ作ったのか

中国伝統色の資料は多く存在しますが、実際に制作で使うときには、画像を探し、色値を写し、名前を照合し、ファイルを整理する作業が何度も発生します。このプロジェクトはその準備作業をあらかじめ済ませ、デザイナー、教師、コンテンツ制作者、開発者がすぐに使える資料としてまとめています。

伝統色は単なる色値ではなく、器物、染織、鉱物顔料、詩歌、季節感、審美の秩序とも結びついています。カードとして並べることで、表だけでは見えにくい感覚や比較がしやすくなります。

## Star History

${starHistoryBlock()}

## データについて

画像は \`NNN-色名.png\` 形式で命名され、[元の 742 色リスト](${masterListPath}) と対応しています。現在のアーカイブには ${project.count} 枚の高解像度 PNG カードがあります。

## ローカルプレビュー

\`\`\`bash
npm run manifest
npm run readme
npm run start
\`\`\`

その後、次の URL を開きます。

\`\`\`text
http://localhost:5173
\`\`\`

完全 ZIP は GitHub Releases から配布しています。ブラウザ側の ZIP 生成は予備手段として残しており、使用する場合は \`file://\` ではなくローカルサーバーまたは GitHub Pages から開いてください。

## サポート

このアーカイブは無料かつオープンソースで公開し続けます。役に立った場合は Star、共有、Issue、または Buy Me a Coffee での支援が小小東の継続的な改善につながります。

<table>
  <tr>
    <td align="center" width="220">
      <img src="docs/images/buy-me-a-coffee-qr.png" alt="Buy Me a Coffee で小小東を支援する QR コード" width="180"><br>
      <strong>Buy Me a Coffee</strong>
    </td>
  </tr>
</table>

## ライセンス

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。

注意：伝統色の色値は資料、画面、印刷、素材によって差が出る場合があります。このアーカイブはオープンな参考資料として利用し、実制作では媒体に合わせて確認してください。
`;
}

const { project, images } = await loadManifest();
await fs.writeFile(path.join(root, "README.md"), renderEn(project, images), "utf8");
await fs.writeFile(path.join(root, "README.en.md"), renderEn(project, images), "utf8");
await fs.writeFile(path.join(root, "README.zh-CN.md"), renderZh(project, images), "utf8");
await fs.writeFile(path.join(root, "README.ja.md"), renderJa(project, images), "utf8");
console.log(`Wrote README files from ${project.count} images with ${selectFeaturedImages(images).length} featured cards`);
