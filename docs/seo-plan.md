# SEO 方案 · colors.xiaoxiaodong.ai

> 中华传统色色卡资料馆 — 专业 SEO 诊断与 90 天落地路线图
> 编制日期：2026-06-16

---

## 一、一句话结论

**站点的页面级 SEO（title / description / canonical / OG / JSON-LD / 静态可读的 742 个色卡页）已经做得很好——问题 100% 出在「收录与发现」，不是标记。** 当前 Google 仅收录首页（753 条 sitemap URL 对照），原因是三个叠加的硬伤，已逐一在仓库中核实：

| # | 根因 | 仓库证据 |
|---|------|---------|
| 1 | **Search Console 未验证** → 从未提交过 sitemap，也无法 Request Indexing | 所有页面 `<head>` 无 `google-site-verification`；SERP 显示「验证所有权」横幅 |
| 2 | **742 个色卡页是「爬虫孤儿」** → 唯一发现路径只剩 sitemap | `grep -c 'colors/[0-9]'` 在 `index.html` / `dictionary.html` / `explorer.html` 均为 **0**——首页色卡墙是 JS 渲染的 `<button>`，静态 HTML 里没有一条指向 `/colors/` 的 `<a href>` |
| 3 | **sitemap 无 `<lastmod>`** → 丢失 Google/Bing 真正使用的新鲜度排序信号 | `grep -c lastmod sitemap.xml` = **0** |

> 新域名 + 零外链 + 孤儿语料 + 未提交，叠加起来 = 几乎没有抓取预算 = 只收录首页。这正是观察到的症状。

**次要抑制因素**：742 个色卡页正文 ~90% 是模板，唯一变化的句子来自 `toneNote()` 的 20 句复用文案（177 个页面共用同一句），在新域名上易被判为「已抓取-未编入索引」的薄/重复内容。即使发现问题解决了，这一条也会拖后腿。

**另一个被埋没的资产**：GitHub 仓库有 **1,035 stars**，但 `repositoryTopics: null`——最便宜的可爬取外链通道完全闲置。

---

## 二、90 天路线图（按「先解锁收录」排序）

### 🚩 第 1 周 — 解锁收录（做完这几条，Google 才会开始抓 742 页）

| 优先级 | 行动 | 怎么做（含改动文件） | 工时 |
|--------|------|---------------------|------|
| **P0** | 验证 Google + Bing + 百度 站长平台并提交 sitemap | 首选在 `xiaoxiaodong.ai` 加 **DNS TXT** 验证（覆盖全子域，最稳）。或在 `index.html` `<head>` 加 `google-site-verification`/`msvalidate.01`/`baidu-site-verification` meta，并在 `scripts/build-color-pages.mjs`（~L317-339）色卡页模板里同步加上 → `npm run colorpages`。验证后提交 `sitemap.xml`，对首页、`dictionary.html`、`explorer.html` 及 10-20 个代表性色卡页执行 **URL Inspection → Request Indexing**。 | 低（外部配置） |
| **P0** | **消灭孤儿：让 hub 页输出指向 742 色卡页的服务端 `<a>` 链接** | 扩展 `scripts/build-color-pages.mjs`，额外生成静态 `colors/index.html`，内含全部 742 条真实 `<a href="NNN-名.html">名 HEX</a>`（无 JS 也可读）；在 `index.html`/`dictionary.html` 加显眼入口链到它；让 `dictionary.js` 在已有静态锚点上做渐进增强，而非从空 DOM 构建。把 `colors/index.html` 加进 `renderSitemap`。`npm run colorpages && npm run verify:colorpages`。 | 中（代码） |
| **P0** | sitemap 每条 URL 加 `<lastmod>` | `renderSitemap()`（`build-color-pages.mjs` ~L425）在每个 `<url>` 块插入 `<lastmod>${date}</lastmod>`（构建日期或每色源图 mtime）。扩展 `verify-color-pages.mjs` 断言 lastmod 存在以防回归。 | 低（代码） |
| **P1** | 修复 dictionary 详情链接 + 色卡页加「上一/下一色」「所属色系」链接 | `dictionary.js` L457、L657 把 `dictionary.html?q=NAME` 改为 `encodeURI('colors/'+slug+'.html')`（当前连 JS 路径都没引用可索引 URL）。`renderColorPage()` 加静态 prev/next-by-id `<a>` 保证全集可遍历。 | 低（代码） |
| **P1** | **激活 1,035 stars 的 GitHub 仓库作为发现通道** | `gh repo edit nevertoday/zhongguo-traditional-colors --add-topic chinese-colors,traditional-colors,color-palette,design-tools,中国传统色,color-tool,hex-colors,palette-generator,static-site`（github.com/topics/* 会被 Google 抓取，是最便宜的可爬外链）。README 顶部加 shields.io「Live site」徽章链到站点，三语 README 同步 + `npm run readme`。 | 低（运营） |

### 📈 第 2-4 周 — 覆盖率与内容

| 优先级 | 行动 | 要点 | 工时 |
|--------|------|------|------|
| **P1** | 生成 **8 个色系 hub 页**（红/橙/黄/绿/青/蓝/紫/中性） | `harmonies.js` 里每色已有 `hueFamily`（8 类合计 742），分组数据免费。生成 `colors/family-红色系.html` 等，内含该系全部色卡的静态 `<a>` 卡片；`colors/index.html` 链 8 个 hub。给 Googlebot 提供 首页→8 hub→色卡 的浅层抓取路径，同时是「中国传统红色 色值大全」这类可排名落地页。 | 中（代码） |
| **P1** | **让每个色卡页变独特**：扩写正文 + 加「关于「色名」」回答块 | `toneNote()` 扩成多句段落，结合 `hueFamily`+色温+明度/饱和度+**已算好的真实配色伙伴名**（如「与互补色『绀青 #4F84FF』搭配可做强调」），措辞按色相和邻色双重区分；meta description 尾巴也按色系+最近邻色变化（当前 742 页尾巴完全相同）。纯数据不杜撰。 | 中（代码） |
| **P1** | 色卡页加真实 `<img>` + 图片 sitemap（打开 Google 图片流量） | 色卡页当前 0 个 `<img>`（用 CSS 色块），`thumbnails/color-card-NNN.jpg` 已存在。在 hero 加 LCP `<img ... alt="中国传统色 名 HEX 色卡" fetchpriority="high">`；`renderSitemap` 的 `<urlset>` 加 `xmlns:image`，每色加 `<image:image>`。色卡站最自然的流量来源目前被完全放弃。 | 中（代码） |
| **P1** | Bing Webmaster + IndexNow 作为快速第二通道 | Bing 对新站收录比 Google 快，且是唯一吃 IndexNow 的引擎（还喂 ChatGPT/Copilot/DuckDuckGo）。生成 IndexNow key 提交到站点根，加 `scripts/ping-indexnow.mjs` + `npm run indexnow` 读 sitemap POST 到 api.indexnow.org，接进 `prepare:release`。 | 中（外部+代码） |
| **P2** | `dictionary.html` 补正文 + 加 CollectionPage/ItemList JSON-LD | 它是每个色卡页面包屑的 position 2、也是 SearchAction 目标，却 0 JSON-LD、仅 sr-only H1。加可见 H1「中国传统色 742 色色彩字典」+ 头部关键词正文 + CollectionPage(含 ItemList) 结构化数据。 | 中（代码） |
| **P2** | 加 Organization/Person 实体 + sameAs，并丰富色卡页 JSON-LD | WebSite 节点无 publisher，无法把 1,035-star 仓库 / X / 站点合并成一个品牌实体（新域名关键 E-E-A-T）。加 Organization+Person(小小东) `sameAs`，色卡页 JSON-LD 补 ImageObject、identifier、HEX/RGB/HSL/CMYK 的 PropertyValue。 | 中（代码） |
| **P2** | hub 页面瞄准 国风/古风 信息型查询 | `palettes.html`/`uses.html` 标题描述加「国风配色方案 / 古风色彩搭配 / 传统色RGB对照表」等中尾词角度。 | 中（内容） |

### 🌱 第 2-3 月 — 权重与规模

| 优先级 | 行动 | 要点 | 工时 |
|--------|------|------|------|
| **P1** | **首波外链与社区种子** | 已验证后：向 awesome-list（awesome-design/color/chinese）提 PR、上设计/工具目录、发 V2EX 分享创造 / 即刻 / 少数派、写一篇掘金技术文「我整理了 742 个中华传统色…」、小红书/B站可视化贴，Product Hunt + Show HN 同步launch。每周在 GSC/Bing 跟踪 referring domains。 | 高（运营） |
| **P2** | 补「释义/出处/寓意」数据集，提升内容天花板 | 当前无任何词源/文化含义数据（master-list 只有 名→HEX）。新建手工 `assets/data/color-lore.js`（仿 `harmony-usage.js` 模式），增量填充，`renderColorPage()` 有 lore 时才渲染「色名释义」H2。可吃下「色名 含义/由来」高意图查询。 | 高（内容） |
| **P2** | GitHub Actions：自动构建 + 部署后 IndexNow/百度 ping | 当前无 `.github/workflows`。加 `deploy.yml` 跑构建链并在成功后 ping IndexNow/百度主动推送，保留 CNAME。 | 中（外部） |
| **P3** | 补 DefinedTerm/DefinedTermSet、FAQPage、工具页 WebApplication JSON-LD | 站点本质是 色彩字典——DefinedTerm 是为它量身定制、对手极少用的 schema。9 个工具页当前 0 JSON-LD。 | 中（代码） |
| **P3** | OG 图优化 + 引入 WebP + 首页 LCP preload | og:image 指向 1086×1448 ~1.3MB 大图（社交抓取慢、裁剪差）；无 WebP；首页 hero 仅靠 deferred JS 渲染无 preload。 | 高（代码） |
| **P3** | **暂缓 i18n**，待 zh-CN 收录后再做 EN 试点 | 现在加 /en/ /ja/ 会把 URL 翻三倍到 ~2250，在主语种 742 页都未收录的域名上摊薄抓取预算。触发条件：GSC 显示中文页有实质收录与排名后，仅先上 `/en/index.html`+`/en/dictionary.html`（复用 README.en.md），双向 hreflang，**不镜像 742 色卡页**。 | 高（内容） |

---

## 三、成功度量（KPI）

- **收录（核心）**：以 GSC「已编入索引」数为准，**不要看 `site:` 估值**。目标——30 天：验证完成 + sitemap 提交 + 20-50 页收录；60 天：300+；90 天：742 中 600+ 收录。
- **发现健康度**：GSC「已抓取-未编入索引」「已发现-未编入索引」桶在孤儿链接修复 + 内容去重后逐周下降；抓取请求/天在提交 sitemap + IndexNow 后上升。
- **Bing/百度**：Bing 收录数与百度收录量并行增长；IndexNow 提交返回 200。
- **展现与点击**：GSC Performance 展现从近零起升；60 天出现首批长尾「色名 是什么颜色」「国风配色」查询展现，90 天出现首批点击。
- **图片搜索**：上线 `<img>` + 图片 sitemap 后，Google 图片出现色卡查询展现（此前结构性为零）。
- **外链**：referring domains 从 ~1（仓库）升到 90 天 5-10 个优质域。
- **回归安全**：扩展 `scripts/verify-color-pages.mjs` 断言 lastmod、每页带 alt 的 `<img>`、image sitemap 命名空间、prev/next + 色系 hub 链接——`prepare:release` 全程保持绿。

---

## 四、关键洞察（为什么是这个顺序）

1. **发现 > 标记**。页面 SEO 再好，没有可爬的 `<a href>` 入口 + 未验证 console，Google 就没有理由抓一个零权重新域名的内页。第 1 周三条 P0 是总开关。
2. **sitemap 不是内链替代品**。sitemap 只传「这里有 URL」，不传权重也不传锚文本。742 页必须有服务端 HTML 链接路径，否则在新域名上可能永远拿不到有意义的抓取预算。
3. **色系 hub 是免费的拓扑红利**。`hueFamily` 数据已存在，建 8 个 hub 既给爬虫浅层路径、又集中链接权重、还顺手造出可排名的聚合落地页——一举三得。
4. **1,035 stars 是已付费的发现资产**，加 topics + live 徽章几乎零成本即可激活。
