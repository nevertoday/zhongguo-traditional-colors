# 中国传统配色

简体中文 | [English](README.en.md) | [日本語](README.ja.md)

如果你在做设计、写内容、做课件、搭建网页主题，常常需要一套稳妥、好看、能直接使用的中国色参考，这个仓库就是为这件事整理的。

这里收录 742 张中华传统色高清色卡，已按原始 742 色清单完整覆盖。每张色卡包含色名、HEX、RGB、CMYK、配色推荐和气质关键词。你可以在线浏览，也可以直接下载已经打包好的 ZIP，把它当作自己的传统色素材库。

## 快速入口

- [在线浏览色卡](https://nevertoday.github.io/zhongguo-traditional-colors/)
- [直接下载完整 ZIP](https://github.com/nevertoday/zhongguo-traditional-colors/releases/latest/download/zhongguo-traditional-colors-images.zip)
- [查看 Release](https://github.com/nevertoday/zhongguo-traditional-colors/releases/tag/v0.1.0)
- [原始 742 色清单](docs/chinese-color-master-list.md)
- [742 色配色方案 Markdown](docs/chinese-color-harmony.md)
- [742 色配色关系 CSV](docs/chinese-color-harmony.csv)
- [中国传统色实战 Skills](#中国传统色实战-skills)
- [作者 X 主页](https://x.com/xiaoxiaodong01)

## 这个项目能帮你什么

| 你需要 | 这里提供 |
| --- | --- |
| 快速找中国色参考 | 742 张高清 PNG 色卡 |
| 做设计和内容配图 | 可直接点击下载原图 |
| 搭建色彩资料库 | 文件名与 742 色清单一一对应 |
| 做网页、PPT、海报、课程素材 | README 全量预览，ZIP 一次下载 |
| 校对色名和色值 | 色名、HEX、RGB、CMYK 集中整理 |
| 把传统色真正用进项目 | 10 个面向设计实战的 Agent Skills |

原图约 998 MB。ZIP 文件作为 GitHub Release 附件提供，不直接提交进仓库。

## 中国传统色实战 Skills

这些 skill 不是继续解释色彩理论，而是把 742 色清单和配色关系 CSV 转成设计师能直接使用的工作流。每个 skill 都对应一个真实工作阻塞点：方向太虚、色板太多、落位困难、Token 交付、可读性、品牌治理、图表编码、旧稿迁移、系列内容和印刷生产。

每个 `xxd-*` skill 目录都随包包含完整 `references/chinese-color-master-list.md`、`references/chinese-color-harmony.md` 和 `references/chinese-color-harmony.csv`，单独取用某个 skill 时也能访问完整 742 色清单和每个颜色的配色关系。

| Skill | 适合解决的问题 |
| --- | --- |
| [`xxd-color-brief`](skills/xxd-color-brief/SKILL.md) | 把“高级、东方、年轻、克制”这类模糊方向翻译成冷暖、明度、饱和度、对比和避坑约束 |
| [`xxd-palette-builder`](skills/xxd-palette-builder/SKILL.md) | 从锚点色、HEX、情绪或场景中筛出少量可执行 palette，并分配主辅点缀和比例 |
| [`xxd-palette-applier`](skills/xxd-palette-applier/SKILL.md) | 把一组颜色落到真实版面，决定背景、标题、正文、CTA、结构和装饰的位置 |
| [`xxd-ui-token`](skills/xxd-ui-token/SKILL.md) | 把传统色变成 primitive、semantic、component、mode 四层 UI token 和代码输出 |
| [`xxd-accessible-color`](skills/xxd-accessible-color/SKILL.md) | 用 WCAG ratio 检查文字、按钮、状态和图表，并用同库颜色修复失败组合 |
| [`xxd-brand-system`](skills/xxd-brand-system/SKILL.md) | 为长期品牌建立锚点色、支撑色、比例、渠道规则、禁用组合和治理边界 |
| [`xxd-data-viz`](skills/xxd-data-viz/SKILL.md) | 按分类、顺序、发散、高亮或语义状态生成图表色，而不是套海报色板 |
| [`xxd-existing-design-audit`](skills/xxd-existing-design-audit/SKILL.md) | 盘点旧稿、CSS、Figma styles 或 HEX 清单，判断保留、合并、替换或移除 |
| [`xxd-content-series`](skills/xxd-content-series/SKILL.md) | 为小红书、公众号、视频、课程和栏目建立固定层、变量层、模板层和轮换规则 |
| [`xxd-print-packaging`](skills/xxd-print-packaging/SKILL.md) | 面向包装、书籍、文创、标签和实体材质规划用色，并提示 CMYK、材质和打样风险 |

### 怎么选择这些 Skills

如果你还没有确定方向，先用 `xxd-color-brief`。如果已经有一个主色或一组候选色，用 `xxd-palette-builder` 收敛成色板，再用 `xxd-palette-applier` 放到真实版面。要交给开发、团队或生产环节时，再进入 `xxd-ui-token`、`xxd-brand-system`、`xxd-data-viz` 或 `xxd-print-packaging`。如果你手上是旧稿、旧 CSS 或散乱 HEX，先用 `xxd-existing-design-audit` 做盘点。长期内容矩阵则从 `xxd-content-series` 开始。

下面是每个 skill 的详细使用方案。每一项都按“它帮谁、解决什么、你要输入什么、会得到什么、怎么触发”来写，方便直接复制到自己的项目里改。

<details>
<summary><strong><code>xxd-color-brief</code>：把模糊审美词变成配色方向</strong></summary>

**利他价值**：帮客户、设计师和执行者先对齐判断语言，减少“我觉得不高级”“这个不够东方”这类主观拉扯。

**适合谁用**：项目刚启动的设计师、品牌负责人、内容团队、课程或活动视觉负责人。

**典型场景**：只有 moodboard、参考图、品牌关键词或客户口头反馈，还不适合直接选色。

**输入什么**：项目载体、目标人群、希望传递的气质、必须避开的感觉、已有参考图或竞品。

**得到什么**：冷暖、明度、饱和度、对比强度、风险边界、3 到 5 个起始传统色，以及下一步推荐使用的 skill。

**使用方式**：先让它输出方向简报，再把简报里的锚点色交给 `xxd-palette-builder` 生成具体色板。

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

**使用方式**：先选一个方向最明确的锚点色；如果没有锚点色，先用 `xxd-color-brief`。拿到色板后，用 `xxd-palette-applier` 判断具体放在哪里。

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

**使用方式**：先把色板中的每个颜色分配角色，再按面积比例落版；如果最后要交给开发，继续用 `xxd-ui-token`。

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

**使用方式**：先让它建立 token 命名和角色，再给开发接入。上线前建议再用 `xxd-accessible-color` 检查关键文本和按钮。

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

**使用方式**：先用它确定长期规则，再把规则交给内容、设计和开发团队。需要落地 UI 时接 `xxd-ui-token`。

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

**使用方式**：先判断数据关系，再让 skill 出色彩编码。不要把装饰色当图表色，必要时用 `xxd-accessible-color` 检查区分度。

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

**使用方式**：先做审计，不要一上来全量替换。确认保留色后，再用 `xxd-brand-system` 或 `xxd-ui-token` 沉淀规则。

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

**使用方式**：先把栏目分层，再决定哪些颜色长期固定、哪些颜色轮换。需要做成品牌规范时接 `xxd-brand-system`。

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

## 全部色卡

下面是完整 742 色预览，点击任意一张可以打开高清 PNG 原图。

<!-- gallery:start -->
<p align="center">
  <a href="images/001-乳白.png"><img src="thumbnails/color-card-001.jpg" width="180" alt="中国传统色 001-乳白"></a>
  <a href="images/002-杏仁黄.png"><img src="thumbnails/color-card-002.jpg" width="180" alt="中国传统色 002-杏仁黄"></a>
  <a href="images/003-茉莉黄.png"><img src="thumbnails/color-card-003.jpg" width="180" alt="中国传统色 003-茉莉黄"></a>
  <a href="images/004-麦秆黄.png"><img src="thumbnails/color-card-004.jpg" width="180" alt="中国传统色 004-麦秆黄"></a>
</p>

<p align="center">
  <a href="images/005-油菜花黄.png"><img src="thumbnails/color-card-005.jpg" width="180" alt="中国传统色 005-油菜花黄"></a>
  <a href="images/006-佛手黄.png"><img src="thumbnails/color-card-006.jpg" width="180" alt="中国传统色 006-佛手黄"></a>
  <a href="images/007-篾黄.png"><img src="thumbnails/color-card-007.jpg" width="180" alt="中国传统色 007-篾黄"></a>
  <a href="images/008-葵扇黄.png"><img src="thumbnails/color-card-008.jpg" width="180" alt="中国传统色 008-葵扇黄"></a>
</p>

<p align="center">
  <a href="images/009-柠檬黄.png"><img src="thumbnails/color-card-009.jpg" width="180" alt="中国传统色 009-柠檬黄"></a>
  <a href="images/010-金瓜黄.png"><img src="thumbnails/color-card-010.jpg" width="180" alt="中国传统色 010-金瓜黄"></a>
  <a href="images/011-藤黄.png"><img src="thumbnails/color-card-011.jpg" width="180" alt="中国传统色 011-藤黄"></a>
  <a href="images/012-酪黄.png"><img src="thumbnails/color-card-012.jpg" width="180" alt="中国传统色 012-酪黄"></a>
</p>

<p align="center">
  <a href="images/013-香水玫瑰黄.png"><img src="thumbnails/color-card-013.jpg" width="180" alt="中国传统色 013-香水玫瑰黄"></a>
  <a href="images/014-淡密黄.png"><img src="thumbnails/color-card-014.jpg" width="180" alt="中国传统色 014-淡密黄"></a>
  <a href="images/015-大豆黄.png"><img src="thumbnails/color-card-015.jpg" width="180" alt="中国传统色 015-大豆黄"></a>
  <a href="images/016-素馨黄.png"><img src="thumbnails/color-card-016.jpg" width="180" alt="中国传统色 016-素馨黄"></a>
</p>

<p align="center">
  <a href="images/017-向日葵黄.png"><img src="thumbnails/color-card-017.jpg" width="180" alt="中国传统色 017-向日葵黄"></a>
  <a href="images/018-雅梨黄.png"><img src="thumbnails/color-card-018.jpg" width="180" alt="中国传统色 018-雅梨黄"></a>
  <a href="images/019-黄连黄.png"><img src="thumbnails/color-card-019.jpg" width="180" alt="中国传统色 019-黄连黄"></a>
  <a href="images/020-金盏黄.png"><img src="thumbnails/color-card-020.jpg" width="180" alt="中国传统色 020-金盏黄"></a>
</p>

<p align="center">
  <a href="images/021-蛋壳黄.png"><img src="thumbnails/color-card-021.jpg" width="180" alt="中国传统色 021-蛋壳黄"></a>
  <a href="images/022-肉色.png"><img src="thumbnails/color-card-022.jpg" width="180" alt="中国传统色 022-肉色"></a>
  <a href="images/023-鹅掌黄.png"><img src="thumbnails/color-card-023.jpg" width="180" alt="中国传统色 023-鹅掌黄"></a>
  <a href="images/024-鸡蛋黄.png"><img src="thumbnails/color-card-024.jpg" width="180" alt="中国传统色 024-鸡蛋黄"></a>
</p>

<p align="center">
  <a href="images/025-鼬黄.png"><img src="thumbnails/color-card-025.jpg" width="180" alt="中国传统色 025-鼬黄"></a>
  <a href="images/026-榴萼黄.png"><img src="thumbnails/color-card-026.jpg" width="180" alt="中国传统色 026-榴萼黄"></a>
  <a href="images/027-淡橘橙.png"><img src="thumbnails/color-card-027.jpg" width="180" alt="中国传统色 027-淡橘橙"></a>
  <a href="images/028-枇杷黄.png"><img src="thumbnails/color-card-028.jpg" width="180" alt="中国传统色 028-枇杷黄"></a>
</p>

<p align="center">
  <a href="images/029-橙皮黄.png"><img src="thumbnails/color-card-029.jpg" width="180" alt="中国传统色 029-橙皮黄"></a>
  <a href="images/030-北瓜黄.png"><img src="thumbnails/color-card-030.jpg" width="180" alt="中国传统色 030-北瓜黄"></a>
  <a href="images/031-杏黄.png"><img src="thumbnails/color-card-031.jpg" width="180" alt="中国传统色 031-杏黄"></a>
  <a href="images/032-雄黄.png"><img src="thumbnails/color-card-032.jpg" width="180" alt="中国传统色 032-雄黄"></a>
</p>

<p align="center">
  <a href="images/033-万寿菊黄.png"><img src="thumbnails/color-card-033.jpg" width="180" alt="中国传统色 033-万寿菊黄"></a>
  <a href="images/034-菊蕾白.png"><img src="thumbnails/color-card-034.jpg" width="180" alt="中国传统色 034-菊蕾白"></a>
  <a href="images/035-秋葵黄.png"><img src="thumbnails/color-card-035.jpg" width="180" alt="中国传统色 035-秋葵黄"></a>
  <a href="images/036-硫华黄.png"><img src="thumbnails/color-card-036.jpg" width="180" alt="中国传统色 036-硫华黄"></a>
</p>

<p align="center">
  <a href="images/037-柚黄.png"><img src="thumbnails/color-card-037.jpg" width="180" alt="中国传统色 037-柚黄"></a>
  <a href="images/038-芒果黄.png"><img src="thumbnails/color-card-038.jpg" width="180" alt="中国传统色 038-芒果黄"></a>
  <a href="images/039-蒿黄.png"><img src="thumbnails/color-card-039.jpg" width="180" alt="中国传统色 039-蒿黄"></a>
  <a href="images/040-姜黄.png"><img src="thumbnails/color-card-040.jpg" width="180" alt="中国传统色 040-姜黄"></a>
</p>

<p align="center">
  <a href="images/041-香蕉黄.png"><img src="thumbnails/color-card-041.jpg" width="180" alt="中国传统色 041-香蕉黄"></a>
  <a href="images/042-草黄.png"><img src="thumbnails/color-card-042.jpg" width="180" alt="中国传统色 042-草黄"></a>
  <a href="images/043-新禾绿.png"><img src="thumbnails/color-card-043.jpg" width="180" alt="中国传统色 043-新禾绿"></a>
  <a href="images/044-月灰.png"><img src="thumbnails/color-card-044.jpg" width="180" alt="中国传统色 044-月灰"></a>
</p>

<p align="center">
  <a href="images/045-淡灰绿.png"><img src="thumbnails/color-card-045.jpg" width="180" alt="中国传统色 045-淡灰绿"></a>
  <a href="images/046-草灰绿.png"><img src="thumbnails/color-card-046.jpg" width="180" alt="中国传统色 046-草灰绿"></a>
  <a href="images/047-苔绿.png"><img src="thumbnails/color-card-047.jpg" width="180" alt="中国传统色 047-苔绿"></a>
  <a href="images/048-碧螺春绿.png"><img src="thumbnails/color-card-048.jpg" width="180" alt="中国传统色 048-碧螺春绿"></a>
</p>

<p align="center">
  <a href="images/049-燕羽灰.png"><img src="thumbnails/color-card-049.jpg" width="180" alt="中国传统色 049-燕羽灰"></a>
  <a href="images/050-蟹壳灰.png"><img src="thumbnails/color-card-050.jpg" width="180" alt="中国传统色 050-蟹壳灰"></a>
  <a href="images/051-潭水绿.png"><img src="thumbnails/color-card-051.jpg" width="180" alt="中国传统色 051-潭水绿"></a>
  <a href="images/052-橄榄绿.png"><img src="thumbnails/color-card-052.jpg" width="180" alt="中国传统色 052-橄榄绿"></a>
</p>

<p align="center">
  <a href="images/053-蚌肉白.png"><img src="thumbnails/color-card-053.jpg" width="180" alt="中国传统色 053-蚌肉白"></a>
  <a href="images/054-豆汁黄.png"><img src="thumbnails/color-card-054.jpg" width="180" alt="中国传统色 054-豆汁黄"></a>
  <a href="images/055-淡茧黄.png"><img src="thumbnails/color-card-055.jpg" width="180" alt="中国传统色 055-淡茧黄"></a>
  <a href="images/056-乳鸭黄.png"><img src="thumbnails/color-card-056.jpg" width="180" alt="中国传统色 056-乳鸭黄"></a>
</p>

<p align="center">
  <a href="images/057-荔肉白.png"><img src="thumbnails/color-card-057.jpg" width="180" alt="中国传统色 057-荔肉白"></a>
  <a href="images/058-象牙黄.png"><img src="thumbnails/color-card-058.jpg" width="180" alt="中国传统色 058-象牙黄"></a>
  <a href="images/059-炒米黄.png"><img src="thumbnails/color-card-059.jpg" width="180" alt="中国传统色 059-炒米黄"></a>
  <a href="images/060-鹦鹉冠黄.png"><img src="thumbnails/color-card-060.jpg" width="180" alt="中国传统色 060-鹦鹉冠黄"></a>
</p>

<p align="center">
  <a href="images/061-木瓜黄.png"><img src="thumbnails/color-card-061.jpg" width="180" alt="中国传统色 061-木瓜黄"></a>
  <a href="images/062-浅烙黄.png"><img src="thumbnails/color-card-062.jpg" width="180" alt="中国传统色 062-浅烙黄"></a>
  <a href="images/063-莲子白.png"><img src="thumbnails/color-card-063.jpg" width="180" alt="中国传统色 063-莲子白"></a>
  <a href="images/064-谷黄.png"><img src="thumbnails/color-card-064.jpg" width="180" alt="中国传统色 064-谷黄"></a>
</p>

<p align="center">
  <a href="images/065-栀子黄.png"><img src="thumbnails/color-card-065.jpg" width="180" alt="中国传统色 065-栀子黄"></a>
  <a href="images/066-芥黄.png"><img src="thumbnails/color-card-066.jpg" width="180" alt="中国传统色 066-芥黄"></a>
  <a href="images/067-银鼠灰.png"><img src="thumbnails/color-card-067.jpg" width="180" alt="中国传统色 067-银鼠灰"></a>
  <a href="images/068-尘灰.png"><img src="thumbnails/color-card-068.jpg" width="180" alt="中国传统色 068-尘灰"></a>
</p>

<p align="center">
  <a href="images/069-枯绿.png"><img src="thumbnails/color-card-069.jpg" width="180" alt="中国传统色 069-枯绿"></a>
  <a href="images/070-鲛青.png"><img src="thumbnails/color-card-070.jpg" width="180" alt="中国传统色 070-鲛青"></a>
  <a href="images/071-粽叶绿.png"><img src="thumbnails/color-card-071.jpg" width="180" alt="中国传统色 071-粽叶绿"></a>
  <a href="images/072-灰绿.png"><img src="thumbnails/color-card-072.jpg" width="180" alt="中国传统色 072-灰绿"></a>
</p>

<p align="center">
  <a href="images/073-鹤灰.png"><img src="thumbnails/color-card-073.jpg" width="180" alt="中国传统色 073-鹤灰"></a>
  <a href="images/074-淡松烟.png"><img src="thumbnails/color-card-074.jpg" width="180" alt="中国传统色 074-淡松烟"></a>
  <a href="images/075-暗海水绿.png"><img src="thumbnails/color-card-075.jpg" width="180" alt="中国传统色 075-暗海水绿"></a>
  <a href="images/076-棕榈绿.png"><img src="thumbnails/color-card-076.jpg" width="180" alt="中国传统色 076-棕榈绿"></a>
</p>

<p align="center">
  <a href="images/077-米色.png"><img src="thumbnails/color-card-077.jpg" width="180" alt="中国传统色 077-米色"></a>
  <a href="images/078-淡肉色.png"><img src="thumbnails/color-card-078.jpg" width="180" alt="中国传统色 078-淡肉色"></a>
  <a href="images/079-麦芽糖黄.png"><img src="thumbnails/color-card-079.jpg" width="180" alt="中国传统色 079-麦芽糖黄"></a>
  <a href="images/080-琥珀黄.png"><img src="thumbnails/color-card-080.jpg" width="180" alt="中国传统色 080-琥珀黄"></a>
</p>

<p align="center">
  <a href="images/081-甘草黄.png"><img src="thumbnails/color-card-081.jpg" width="180" alt="中国传统色 081-甘草黄"></a>
  <a href="images/082-初熟杏黄.png"><img src="thumbnails/color-card-082.jpg" width="180" alt="中国传统色 082-初熟杏黄"></a>
  <a href="images/083-浅驼色.png"><img src="thumbnails/color-card-083.jpg" width="180" alt="中国传统色 083-浅驼色"></a>
  <a href="images/084-沙石黄.png"><img src="thumbnails/color-card-084.jpg" width="180" alt="中国传统色 084-沙石黄"></a>
</p>

<p align="center">
  <a href="images/085-虎皮黄.png"><img src="thumbnails/color-card-085.jpg" width="180" alt="中国传统色 085-虎皮黄"></a>
  <a href="images/086-土黄.png"><img src="thumbnails/color-card-086.jpg" width="180" alt="中国传统色 086-土黄"></a>
  <a href="images/087-百灵鸟灰.png"><img src="thumbnails/color-card-087.jpg" width="180" alt="中国传统色 087-百灵鸟灰"></a>
  <a href="images/088-山鸡黄.png"><img src="thumbnails/color-card-088.jpg" width="180" alt="中国传统色 088-山鸡黄"></a>
</p>

<p align="center">
  <a href="images/089-龟背黄.png"><img src="thumbnails/color-card-089.jpg" width="180" alt="中国传统色 089-龟背黄"></a>
  <a href="images/090-苍黄.png"><img src="thumbnails/color-card-090.jpg" width="180" alt="中国传统色 090-苍黄"></a>
  <a href="images/091-莱阳梨黄.png"><img src="thumbnails/color-card-091.jpg" width="180" alt="中国传统色 091-莱阳梨黄"></a>
  <a href="images/092-蜴蜊绿.png"><img src="thumbnails/color-card-092.jpg" width="180" alt="中国传统色 092-蜴蜊绿"></a>
</p>

<p align="center">
  <a href="images/093-松鼠灰.png"><img src="thumbnails/color-card-093.jpg" width="180" alt="中国传统色 093-松鼠灰"></a>
  <a href="images/094-橄榄灰.png"><img src="thumbnails/color-card-094.jpg" width="180" alt="中国传统色 094-橄榄灰"></a>
  <a href="images/095-蟹壳绿.png"><img src="thumbnails/color-card-095.jpg" width="180" alt="中国传统色 095-蟹壳绿"></a>
  <a href="images/096-古铜绿.png"><img src="thumbnails/color-card-096.jpg" width="180" alt="中国传统色 096-古铜绿"></a>
</p>

<p align="center">
  <a href="images/097-焦茶绿.png"><img src="thumbnails/color-card-097.jpg" width="180" alt="中国传统色 097-焦茶绿"></a>
  <a href="images/098-粉白.png"><img src="thumbnails/color-card-098.jpg" width="180" alt="中国传统色 098-粉白"></a>
  <a href="images/099-落英淡粉.png"><img src="thumbnails/color-card-099.jpg" width="180" alt="中国传统色 099-落英淡粉"></a>
  <a href="images/100-瓜瓤粉.png"><img src="thumbnails/color-card-100.jpg" width="180" alt="中国传统色 100-瓜瓤粉"></a>
</p>

<p align="center">
  <a href="images/101-蜜黄.png"><img src="thumbnails/color-card-101.jpg" width="180" alt="中国传统色 101-蜜黄"></a>
  <a href="images/102-金叶黄.png"><img src="thumbnails/color-card-102.jpg" width="180" alt="中国传统色 102-金叶黄"></a>
  <a href="images/103-金莺黄.png"><img src="thumbnails/color-card-103.jpg" width="180" alt="中国传统色 103-金莺黄"></a>
  <a href="images/104-鹿角棕.png"><img src="thumbnails/color-card-104.jpg" width="180" alt="中国传统色 104-鹿角棕"></a>
</p>

<p align="center">
  <a href="images/105-凋叶棕.png"><img src="thumbnails/color-card-105.jpg" width="180" alt="中国传统色 105-凋叶棕"></a>
  <a href="images/106-玳瑁黄.png"><img src="thumbnails/color-card-106.jpg" width="180" alt="中国传统色 106-玳瑁黄"></a>
  <a href="images/107-软木黄.png"><img src="thumbnails/color-card-107.jpg" width="180" alt="中国传统色 107-软木黄"></a>
  <a href="images/108-风帆黄.png"><img src="thumbnails/color-card-108.jpg" width="180" alt="中国传统色 108-风帆黄"></a>
</p>

<p align="center">
  <a href="images/109-桂皮淡棕.png"><img src="thumbnails/color-card-109.jpg" width="180" alt="中国传统色 109-桂皮淡棕"></a>
  <a href="images/110-猴毛灰.png"><img src="thumbnails/color-card-110.jpg" width="180" alt="中国传统色 110-猴毛灰"></a>
  <a href="images/111-山鸡褐.png"><img src="thumbnails/color-card-111.jpg" width="180" alt="中国传统色 111-山鸡褐"></a>
  <a href="images/112-驼色.png"><img src="thumbnails/color-card-112.jpg" width="180" alt="中国传统色 112-驼色"></a>
</p>

<p align="center">
  <a href="images/113-茶褐.png"><img src="thumbnails/color-card-113.jpg" width="180" alt="中国传统色 113-茶褐"></a>
  <a href="images/114-古铜褐.png"><img src="thumbnails/color-card-114.jpg" width="180" alt="中国传统色 114-古铜褐"></a>
  <a href="images/115-荷花白.png"><img src="thumbnails/color-card-115.jpg" width="180" alt="中国传统色 115-荷花白"></a>
  <a href="images/116-玫瑰粉.png"><img src="thumbnails/color-card-116.jpg" width="180" alt="中国传统色 116-玫瑰粉"></a>
</p>

<p align="center">
  <a href="images/117-橘橙.png"><img src="thumbnails/color-card-117.jpg" width="180" alt="中国传统色 117-橘橙"></a>
  <a href="images/118-美人焦橙.png"><img src="thumbnails/color-card-118.jpg" width="180" alt="中国传统色 118-美人焦橙"></a>
  <a href="images/119-润红.png"><img src="thumbnails/color-card-119.jpg" width="180" alt="中国传统色 119-润红"></a>
  <a href="images/120-淡桃红.png"><img src="thumbnails/color-card-120.jpg" width="180" alt="中国传统色 120-淡桃红"></a>
</p>

<p align="center">
  <a href="images/121-海螺橙.png"><img src="thumbnails/color-card-121.jpg" width="180" alt="中国传统色 121-海螺橙"></a>
  <a href="images/122-桃红.png"><img src="thumbnails/color-card-122.jpg" width="180" alt="中国传统色 122-桃红"></a>
  <a href="images/123-颊红.png"><img src="thumbnails/color-card-123.jpg" width="180" alt="中国传统色 123-颊红"></a>
  <a href="images/124-淡罂粟红.png"><img src="thumbnails/color-card-124.jpg" width="180" alt="中国传统色 124-淡罂粟红"></a>
</p>

<p align="center">
  <a href="images/125-晨曦红.png"><img src="thumbnails/color-card-125.jpg" width="180" alt="中国传统色 125-晨曦红"></a>
  <a href="images/126-蟹壳红.png"><img src="thumbnails/color-card-126.jpg" width="180" alt="中国传统色 126-蟹壳红"></a>
  <a href="images/127-金莲花橙.png"><img src="thumbnails/color-card-127.jpg" width="180" alt="中国传统色 127-金莲花橙"></a>
  <a href="images/128-草莓红.png"><img src="thumbnails/color-card-128.jpg" width="180" alt="中国传统色 128-草莓红"></a>
</p>

<p align="center">
  <a href="images/129-龙睛鱼红.png"><img src="thumbnails/color-card-129.jpg" width="180" alt="中国传统色 129-龙睛鱼红"></a>
  <a href="images/130-蜻蜓红.png"><img src="thumbnails/color-card-130.jpg" width="180" alt="中国传统色 130-蜻蜓红"></a>
  <a href="images/131-大红.png"><img src="thumbnails/color-card-131.jpg" width="180" alt="中国传统色 131-大红"></a>
  <a href="images/132-柿红.png"><img src="thumbnails/color-card-132.jpg" width="180" alt="中国传统色 132-柿红"></a>
</p>

<p align="center">
  <a href="images/133-榴花红.png"><img src="thumbnails/color-card-133.jpg" width="180" alt="中国传统色 133-榴花红"></a>
  <a href="images/134-银朱.png"><img src="thumbnails/color-card-134.jpg" width="180" alt="中国传统色 134-银朱"></a>
  <a href="images/135-朱红.png"><img src="thumbnails/color-card-135.jpg" width="180" alt="中国传统色 135-朱红"></a>
  <a href="images/136-鲑鱼红.png"><img src="thumbnails/color-card-136.jpg" width="180" alt="中国传统色 136-鲑鱼红"></a>
</p>

<p align="center">
  <a href="images/137-金黄.png"><img src="thumbnails/color-card-137.jpg" width="180" alt="中国传统色 137-金黄"></a>
  <a href="images/138-鹿皮褐.png"><img src="thumbnails/color-card-138.jpg" width="180" alt="中国传统色 138-鹿皮褐"></a>
  <a href="images/139-醉瓜肉.png"><img src="thumbnails/color-card-139.jpg" width="180" alt="中国传统色 139-醉瓜肉"></a>
  <a href="images/140-麂棕.png"><img src="thumbnails/color-card-140.jpg" width="180" alt="中国传统色 140-麂棕"></a>
</p>

<p align="center">
  <a href="images/141-淡银灰.png"><img src="thumbnails/color-card-141.jpg" width="180" alt="中国传统色 141-淡银灰"></a>
  <a href="images/142-淡赭.png"><img src="thumbnails/color-card-142.jpg" width="180" alt="中国传统色 142-淡赭"></a>
  <a href="images/143-槟榔综.png"><img src="thumbnails/color-card-143.jpg" width="180" alt="中国传统色 143-槟榔综"></a>
  <a href="images/144-银灰.png"><img src="thumbnails/color-card-144.jpg" width="180" alt="中国传统色 144-银灰"></a>
</p>

<p align="center">
  <a href="images/145-海鸥灰.png"><img src="thumbnails/color-card-145.jpg" width="180" alt="中国传统色 145-海鸥灰"></a>
  <a href="images/146-淡咖啡.png"><img src="thumbnails/color-card-146.jpg" width="180" alt="中国传统色 146-淡咖啡"></a>
  <a href="images/147-岩石棕.png"><img src="thumbnails/color-card-147.jpg" width="180" alt="中国传统色 147-岩石棕"></a>
  <a href="images/148-芒果棕.png"><img src="thumbnails/color-card-148.jpg" width="180" alt="中国传统色 148-芒果棕"></a>
</p>

<p align="center">
  <a href="images/149-石板灰.png"><img src="thumbnails/color-card-149.jpg" width="180" alt="中国传统色 149-石板灰"></a>
  <a href="images/150-珠母灰.png"><img src="thumbnails/color-card-150.jpg" width="180" alt="中国传统色 150-珠母灰"></a>
  <a href="images/151-丁香棕.png"><img src="thumbnails/color-card-151.jpg" width="180" alt="中国传统色 151-丁香棕"></a>
  <a href="images/152-咖啡.png"><img src="thumbnails/color-card-152.jpg" width="180" alt="中国传统色 152-咖啡"></a>
</p>

<p align="center">
  <a href="images/153-筍皮棕.png"><img src="thumbnails/color-card-153.jpg" width="180" alt="中国传统色 153-筍皮棕"></a>
  <a href="images/154-燕颔红.png"><img src="thumbnails/color-card-154.jpg" width="180" alt="中国传统色 154-燕颔红"></a>
  <a href="images/155-玉粉红.png"><img src="thumbnails/color-card-155.jpg" width="180" alt="中国传统色 155-玉粉红"></a>
  <a href="images/156-金驼.png"><img src="thumbnails/color-card-156.jpg" width="180" alt="中国传统色 156-金驼"></a>
</p>

<p align="center">
  <a href="images/157-铁棕.png"><img src="thumbnails/color-card-157.jpg" width="180" alt="中国传统色 157-铁棕"></a>
  <a href="images/158-蛛网灰.png"><img src="thumbnails/color-card-158.jpg" width="180" alt="中国传统色 158-蛛网灰"></a>
  <a href="images/159-淡可可棕.png"><img src="thumbnails/color-card-159.jpg" width="180" alt="中国传统色 159-淡可可棕"></a>
  <a href="images/160-中红灰.png"><img src="thumbnails/color-card-160.jpg" width="180" alt="中国传统色 160-中红灰"></a>
</p>

<p align="center">
  <a href="images/161-淡土黄.png"><img src="thumbnails/color-card-161.jpg" width="180" alt="中国传统色 161-淡土黄"></a>
  <a href="images/162-淡豆沙.png"><img src="thumbnails/color-card-162.jpg" width="180" alt="中国传统色 162-淡豆沙"></a>
  <a href="images/163-椰壳棕.png"><img src="thumbnails/color-card-163.jpg" width="180" alt="中国传统色 163-椰壳棕"></a>
  <a href="images/164-淡铁灰.png"><img src="thumbnails/color-card-164.jpg" width="180" alt="中国传统色 164-淡铁灰"></a>
</p>

<p align="center">
  <a href="images/165-中灰驼.png"><img src="thumbnails/color-card-165.jpg" width="180" alt="中国传统色 165-中灰驼"></a>
  <a href="images/166-淡栗棕.png"><img src="thumbnails/color-card-166.jpg" width="180" alt="中国传统色 166-淡栗棕"></a>
  <a href="images/167-可可棕.png"><img src="thumbnails/color-card-167.jpg" width="180" alt="中国传统色 167-可可棕"></a>
  <a href="images/168-柞叶棕.png"><img src="thumbnails/color-card-168.jpg" width="180" alt="中国传统色 168-柞叶棕"></a>
</p>

<p align="center">
  <a href="images/169-野蔷薇红.png"><img src="thumbnails/color-card-169.jpg" width="180" alt="中国传统色 169-野蔷薇红"></a>
  <a href="images/170-菠萝红.png"><img src="thumbnails/color-card-170.jpg" width="180" alt="中国传统色 170-菠萝红"></a>
  <a href="images/171-藕荷.png"><img src="thumbnails/color-card-171.jpg" width="180" alt="中国传统色 171-藕荷"></a>
  <a href="images/172-陶瓷红.png"><img src="thumbnails/color-card-172.jpg" width="180" alt="中国传统色 172-陶瓷红"></a>
</p>

<p align="center">
  <a href="images/173-晓灰.png"><img src="thumbnails/color-card-173.jpg" width="180" alt="中国传统色 173-晓灰"></a>
  <a href="images/174-余烬红.png"><img src="thumbnails/color-card-174.jpg" width="180" alt="中国传统色 174-余烬红"></a>
  <a href="images/175-火砖红.png"><img src="thumbnails/color-card-175.jpg" width="180" alt="中国传统色 175-火砖红"></a>
  <a href="images/176-火泥棕.png"><img src="thumbnails/color-card-176.jpg" width="180" alt="中国传统色 176-火泥棕"></a>
</p>

<p align="center">
  <a href="images/177-绀红.png"><img src="thumbnails/color-card-177.jpg" width="180" alt="中国传统色 177-绀红"></a>
  <a href="images/178-橡树棕.png"><img src="thumbnails/color-card-178.jpg" width="180" alt="中国传统色 178-橡树棕"></a>
  <a href="images/179-海报灰.png"><img src="thumbnails/color-card-179.jpg" width="180" alt="中国传统色 179-海报灰"></a>
  <a href="images/180-玫瑰灰.png"><img src="thumbnails/color-card-180.jpg" width="180" alt="中国传统色 180-玫瑰灰"></a>
</p>

<p align="center">
  <a href="images/181-火山棕.png"><img src="thumbnails/color-card-181.jpg" width="180" alt="中国传统色 181-火山棕"></a>
  <a href="images/182-豆沙.png"><img src="thumbnails/color-card-182.jpg" width="180" alt="中国传统色 182-豆沙"></a>
  <a href="images/183-淡米粉.png"><img src="thumbnails/color-card-183.jpg" width="180" alt="中国传统色 183-淡米粉"></a>
  <a href="images/184-初桃粉红.png"><img src="thumbnails/color-card-184.jpg" width="180" alt="中国传统色 184-初桃粉红"></a>
</p>

<p align="center">
  <a href="images/185-介壳淡粉红.png"><img src="thumbnails/color-card-185.jpg" width="180" alt="中国传统色 185-介壳淡粉红"></a>
  <a href="images/186-淡藏花红.png"><img src="thumbnails/color-card-186.jpg" width="180" alt="中国传统色 186-淡藏花红"></a>
  <a href="images/187-瓜瓤红.png"><img src="thumbnails/color-card-187.jpg" width="180" alt="中国传统色 187-瓜瓤红"></a>
  <a href="images/188-芙蓉红.png"><img src="thumbnails/color-card-188.jpg" width="180" alt="中国传统色 188-芙蓉红"></a>
</p>

<p align="center">
  <a href="images/189-莓酱红.png"><img src="thumbnails/color-card-189.jpg" width="180" alt="中国传统色 189-莓酱红"></a>
  <a href="images/190-法螺红.png"><img src="thumbnails/color-card-190.jpg" width="180" alt="中国传统色 190-法螺红"></a>
  <a href="images/191-落霞红.png"><img src="thumbnails/color-card-191.jpg" width="180" alt="中国传统色 191-落霞红"></a>
  <a href="images/192-淡玫瑰灰.png"><img src="thumbnails/color-card-192.jpg" width="180" alt="中国传统色 192-淡玫瑰灰"></a>
</p>

<p align="center">
  <a href="images/193-蟹蝥红.png"><img src="thumbnails/color-card-193.jpg" width="180" alt="中国传统色 193-蟹蝥红"></a>
  <a href="images/194-火岩棕.png"><img src="thumbnails/color-card-194.jpg" width="180" alt="中国传统色 194-火岩棕"></a>
  <a href="images/195-赭石.png"><img src="thumbnails/color-card-195.jpg" width="180" alt="中国传统色 195-赭石"></a>
  <a href="images/196-暗驼棕.png"><img src="thumbnails/color-card-196.jpg" width="180" alt="中国传统色 196-暗驼棕"></a>
</p>

<p align="center">
  <a href="images/197-酱棕.png"><img src="thumbnails/color-card-197.jpg" width="180" alt="中国传统色 197-酱棕"></a>
  <a href="images/198-栗棕.png"><img src="thumbnails/color-card-198.jpg" width="180" alt="中国传统色 198-栗棕"></a>
  <a href="images/199-洋水仙红.png"><img src="thumbnails/color-card-199.jpg" width="180" alt="中国传统色 199-洋水仙红"></a>
  <a href="images/200-谷鞘红.png"><img src="thumbnails/color-card-200.jpg" width="180" alt="中国传统色 200-谷鞘红"></a>
</p>

<p align="center">
  <a href="images/201-苹果红.png"><img src="thumbnails/color-card-201.jpg" width="180" alt="中国传统色 201-苹果红"></a>
  <a href="images/202-铁水红.png"><img src="thumbnails/color-card-202.jpg" width="180" alt="中国传统色 202-铁水红"></a>
  <a href="images/203-桂红.png"><img src="thumbnails/color-card-203.jpg" width="180" alt="中国传统色 203-桂红"></a>
  <a href="images/204-极光红.png"><img src="thumbnails/color-card-204.jpg" width="180" alt="中国传统色 204-极光红"></a>
</p>

<p align="center">
  <a href="images/205-粉红.png"><img src="thumbnails/color-card-205.jpg" width="180" alt="中国传统色 205-粉红"></a>
  <a href="images/206-舌红.png"><img src="thumbnails/color-card-206.jpg" width="180" alt="中国传统色 206-舌红"></a>
  <a href="images/207-曲红.png"><img src="thumbnails/color-card-207.jpg" width="180" alt="中国传统色 207-曲红"></a>
  <a href="images/208-红汞红.png"><img src="thumbnails/color-card-208.jpg" width="180" alt="中国传统色 208-红汞红"></a>
</p>

<p align="center">
  <a href="images/209-淡绯.png"><img src="thumbnails/color-card-209.jpg" width="180" alt="中国传统色 209-淡绯"></a>
  <a href="images/210-无花果红.png"><img src="thumbnails/color-card-210.jpg" width="180" alt="中国传统色 210-无花果红"></a>
  <a href="images/211-榴子红.png"><img src="thumbnails/color-card-211.jpg" width="180" alt="中国传统色 211-榴子红"></a>
  <a href="images/212-胭脂红.png"><img src="thumbnails/color-card-212.jpg" width="180" alt="中国传统色 212-胭脂红"></a>
</p>

<p align="center">
  <a href="images/213-合欢红.png"><img src="thumbnails/color-card-213.jpg" width="180" alt="中国传统色 213-合欢红"></a>
  <a href="images/214-春梅红.png"><img src="thumbnails/color-card-214.jpg" width="180" alt="中国传统色 214-春梅红"></a>
  <a href="images/215-香叶红.png"><img src="thumbnails/color-card-215.jpg" width="180" alt="中国传统色 215-香叶红"></a>
  <a href="images/216-珊瑚红.png"><img src="thumbnails/color-card-216.jpg" width="180" alt="中国传统色 216-珊瑚红"></a>
</p>

<p align="center">
  <a href="images/217-萝卜红.png"><img src="thumbnails/color-card-217.jpg" width="180" alt="中国传统色 217-萝卜红"></a>
  <a href="images/218-淡茜红.png"><img src="thumbnails/color-card-218.jpg" width="180" alt="中国传统色 218-淡茜红"></a>
  <a href="images/219-艳红.png"><img src="thumbnails/color-card-219.jpg" width="180" alt="中国传统色 219-艳红"></a>
  <a href="images/220-淡菽红.png"><img src="thumbnails/color-card-220.jpg" width="180" alt="中国传统色 220-淡菽红"></a>
</p>

<p align="center">
  <a href="images/221-鱼鳃红.png"><img src="thumbnails/color-card-221.jpg" width="180" alt="中国传统色 221-鱼鳃红"></a>
  <a href="images/222-樱桃红.png"><img src="thumbnails/color-card-222.jpg" width="180" alt="中国传统色 222-樱桃红"></a>
  <a href="images/223-淡蕊香红.png"><img src="thumbnails/color-card-223.jpg" width="180" alt="中国传统色 223-淡蕊香红"></a>
  <a href="images/224-石竹红.png"><img src="thumbnails/color-card-224.jpg" width="180" alt="中国传统色 224-石竹红"></a>
</p>

<p align="center">
  <a href="images/225-草茉莉红.png"><img src="thumbnails/color-card-225.jpg" width="180" alt="中国传统色 225-草茉莉红"></a>
  <a href="images/226-茶花红.png"><img src="thumbnails/color-card-226.jpg" width="180" alt="中国传统色 226-茶花红"></a>
  <a href="images/227-枸枢红.png"><img src="thumbnails/color-card-227.jpg" width="180" alt="中国传统色 227-枸枢红"></a>
  <a href="images/228-秋海棠红.png"><img src="thumbnails/color-card-228.jpg" width="180" alt="中国传统色 228-秋海棠红"></a>
</p>

<p align="center">
  <a href="images/229-丽春红.png"><img src="thumbnails/color-card-229.jpg" width="180" alt="中国传统色 229-丽春红"></a>
  <a href="images/230-夕阳红.png"><img src="thumbnails/color-card-230.jpg" width="180" alt="中国传统色 230-夕阳红"></a>
  <a href="images/231-鹤顶红.png"><img src="thumbnails/color-card-231.jpg" width="180" alt="中国传统色 231-鹤顶红"></a>
  <a href="images/232-鹅血石红.png"><img src="thumbnails/color-card-232.jpg" width="180" alt="中国传统色 232-鹅血石红"></a>
</p>

<p align="center">
  <a href="images/233-覆盆子红.png"><img src="thumbnails/color-card-233.jpg" width="180" alt="中国传统色 233-覆盆子红"></a>
  <a href="images/234-貂紫.png"><img src="thumbnails/color-card-234.jpg" width="180" alt="中国传统色 234-貂紫"></a>
  <a href="images/235-暗玉紫.png"><img src="thumbnails/color-card-235.jpg" width="180" alt="中国传统色 235-暗玉紫"></a>
  <a href="images/236-栗紫.png"><img src="thumbnails/color-card-236.jpg" width="180" alt="中国传统色 236-栗紫"></a>
</p>

<p align="center">
  <a href="images/237-葡萄酱紫.png"><img src="thumbnails/color-card-237.jpg" width="180" alt="中国传统色 237-葡萄酱紫"></a>
  <a href="images/238-牡丹粉红.png"><img src="thumbnails/color-card-238.jpg" width="180" alt="中国传统色 238-牡丹粉红"></a>
  <a href="images/239-山茶红.png"><img src="thumbnails/color-card-239.jpg" width="180" alt="中国传统色 239-山茶红"></a>
  <a href="images/240-海棠红.png"><img src="thumbnails/color-card-240.jpg" width="180" alt="中国传统色 240-海棠红"></a>
</p>

<p align="center">
  <a href="images/241-玉红.png"><img src="thumbnails/color-card-241.jpg" width="180" alt="中国传统色 241-玉红"></a>
  <a href="images/242-高粱红.png"><img src="thumbnails/color-card-242.jpg" width="180" alt="中国传统色 242-高粱红"></a>
  <a href="images/243-满江红.png"><img src="thumbnails/color-card-243.jpg" width="180" alt="中国传统色 243-满江红"></a>
  <a href="images/244-枣红.png"><img src="thumbnails/color-card-244.jpg" width="180" alt="中国传统色 244-枣红"></a>
</p>

<p align="center">
  <a href="images/245-葡萄紫.png"><img src="thumbnails/color-card-245.jpg" width="180" alt="中国传统色 245-葡萄紫"></a>
  <a href="images/246-酱紫.png"><img src="thumbnails/color-card-246.jpg" width="180" alt="中国传统色 246-酱紫"></a>
  <a href="images/247-淡曙红.png"><img src="thumbnails/color-card-247.jpg" width="180" alt="中国传统色 247-淡曙红"></a>
  <a href="images/248-唐菖蒲红.png"><img src="thumbnails/color-card-248.jpg" width="180" alt="中国传统色 248-唐菖蒲红"></a>
</p>

<p align="center">
  <a href="images/249-鹅冠红.png"><img src="thumbnails/color-card-249.jpg" width="180" alt="中国传统色 249-鹅冠红"></a>
  <a href="images/250-莓红.png"><img src="thumbnails/color-card-250.jpg" width="180" alt="中国传统色 250-莓红"></a>
  <a href="images/251-枫叶红.png"><img src="thumbnails/color-card-251.jpg" width="180" alt="中国传统色 251-枫叶红"></a>
  <a href="images/252-苋菜红.png"><img src="thumbnails/color-card-252.jpg" width="180" alt="中国传统色 252-苋菜红"></a>
</p>

<p align="center">
  <a href="images/253-烟红.png"><img src="thumbnails/color-card-253.jpg" width="180" alt="中国传统色 253-烟红"></a>
  <a href="images/254-暗紫苑红.png"><img src="thumbnails/color-card-254.jpg" width="180" alt="中国传统色 254-暗紫苑红"></a>
  <a href="images/255-殷红.png"><img src="thumbnails/color-card-255.jpg" width="180" alt="中国传统色 255-殷红"></a>
  <a href="images/256-猪肝紫.png"><img src="thumbnails/color-card-256.jpg" width="180" alt="中国传统色 256-猪肝紫"></a>
</p>

<p align="center">
  <a href="images/257-金鱼紫.png"><img src="thumbnails/color-card-257.jpg" width="180" alt="中国传统色 257-金鱼紫"></a>
  <a href="images/258-草珠红.png"><img src="thumbnails/color-card-258.jpg" width="180" alt="中国传统色 258-草珠红"></a>
  <a href="images/259-淡绛红.png"><img src="thumbnails/color-card-259.jpg" width="180" alt="中国传统色 259-淡绛红"></a>
  <a href="images/260-品红.png"><img src="thumbnails/color-card-260.jpg" width="180" alt="中国传统色 260-品红"></a>
</p>

<p align="center">
  <a href="images/261-凤仙花红.png"><img src="thumbnails/color-card-261.jpg" width="180" alt="中国传统色 261-凤仙花红"></a>
  <a href="images/262-粉团花红.png"><img src="thumbnails/color-card-262.jpg" width="180" alt="中国传统色 262-粉团花红"></a>
  <a href="images/263-夹竹桃红.png"><img src="thumbnails/color-card-263.jpg" width="180" alt="中国传统色 263-夹竹桃红"></a>
  <a href="images/264-榲桲红.png"><img src="thumbnails/color-card-264.jpg" width="180" alt="中国传统色 264-榲桲红"></a>
</p>

<p align="center">
  <a href="images/265-姜红.png"><img src="thumbnails/color-card-265.jpg" width="180" alt="中国传统色 265-姜红"></a>
  <a href="images/266-莲瓣红.png"><img src="thumbnails/color-card-266.jpg" width="180" alt="中国传统色 266-莲瓣红"></a>
  <a href="images/267-水红.png"><img src="thumbnails/color-card-267.jpg" width="180" alt="中国传统色 267-水红"></a>
  <a href="images/268-报春红.png"><img src="thumbnails/color-card-268.jpg" width="180" alt="中国传统色 268-报春红"></a>
</p>

<p align="center">
  <a href="images/269-月季红.png"><img src="thumbnails/color-card-269.jpg" width="180" alt="中国传统色 269-月季红"></a>
  <a href="images/270-豇豆红.png"><img src="thumbnails/color-card-270.jpg" width="180" alt="中国传统色 270-豇豆红"></a>
  <a href="images/271-霞光红.png"><img src="thumbnails/color-card-271.jpg" width="180" alt="中国传统色 271-霞光红"></a>
  <a href="images/272-松叶牡丹红.png"><img src="thumbnails/color-card-272.jpg" width="180" alt="中国传统色 272-松叶牡丹红"></a>
</p>

<p align="center">
  <a href="images/273-喜蛋红.png"><img src="thumbnails/color-card-273.jpg" width="180" alt="中国传统色 273-喜蛋红"></a>
  <a href="images/274-鼠鼻红.png"><img src="thumbnails/color-card-274.jpg" width="180" alt="中国传统色 274-鼠鼻红"></a>
  <a href="images/275-尖晶玉红.png"><img src="thumbnails/color-card-275.jpg" width="180" alt="中国传统色 275-尖晶玉红"></a>
  <a href="images/276-山黎豆红.png"><img src="thumbnails/color-card-276.jpg" width="180" alt="中国传统色 276-山黎豆红"></a>
</p>

<p align="center">
  <a href="images/277-锦葵红.png"><img src="thumbnails/color-card-277.jpg" width="180" alt="中国传统色 277-锦葵红"></a>
  <a href="images/278-鼠背灰.png"><img src="thumbnails/color-card-278.jpg" width="180" alt="中国传统色 278-鼠背灰"></a>
  <a href="images/279-甘蔗紫.png"><img src="thumbnails/color-card-279.jpg" width="180" alt="中国传统色 279-甘蔗紫"></a>
  <a href="images/280-石竹紫.png"><img src="thumbnails/color-card-280.jpg" width="180" alt="中国传统色 280-石竹紫"></a>
</p>

<p align="center">
  <a href="images/281-苍蝇灰.png"><img src="thumbnails/color-card-281.jpg" width="180" alt="中国传统色 281-苍蝇灰"></a>
  <a href="images/282-卵石紫.png"><img src="thumbnails/color-card-282.jpg" width="180" alt="中国传统色 282-卵石紫"></a>
  <a href="images/283-李紫.png"><img src="thumbnails/color-card-283.jpg" width="180" alt="中国传统色 283-李紫"></a>
  <a href="images/284-茄皮紫.png"><img src="thumbnails/color-card-284.jpg" width="180" alt="中国传统色 284-茄皮紫"></a>
</p>

<p align="center">
  <a href="images/285-吊钟花红.png"><img src="thumbnails/color-card-285.jpg" width="180" alt="中国传统色 285-吊钟花红"></a>
  <a href="images/286-兔眼红.png"><img src="thumbnails/color-card-286.jpg" width="180" alt="中国传统色 286-兔眼红"></a>
  <a href="images/287-紫荆红.png"><img src="thumbnails/color-card-287.jpg" width="180" alt="中国传统色 287-紫荆红"></a>
  <a href="images/288-菜头紫.png"><img src="thumbnails/color-card-288.jpg" width="180" alt="中国传统色 288-菜头紫"></a>
</p>

<p align="center">
  <a href="images/289-鹞冠紫.png"><img src="thumbnails/color-card-289.jpg" width="180" alt="中国传统色 289-鹞冠紫"></a>
  <a href="images/290-葡萄酒红.png"><img src="thumbnails/color-card-290.jpg" width="180" alt="中国传统色 290-葡萄酒红"></a>
  <a href="images/291-磨石紫.png"><img src="thumbnails/color-card-291.jpg" width="180" alt="中国传统色 291-磨石紫"></a>
  <a href="images/292-檀紫.png"><img src="thumbnails/color-card-292.jpg" width="180" alt="中国传统色 292-檀紫"></a>
</p>

<p align="center">
  <a href="images/293-火鹅紫.png"><img src="thumbnails/color-card-293.jpg" width="180" alt="中国传统色 293-火鹅紫"></a>
  <a href="images/294-墨紫.png"><img src="thumbnails/color-card-294.jpg" width="180" alt="中国传统色 294-墨紫"></a>
  <a href="images/295-晶红.png"><img src="thumbnails/color-card-295.jpg" width="180" alt="中国传统色 295-晶红"></a>
  <a href="images/296-扁豆花红.png"><img src="thumbnails/color-card-296.jpg" width="180" alt="中国传统色 296-扁豆花红"></a>
</p>

<p align="center">
  <a href="images/297-白芨红.png"><img src="thumbnails/color-card-297.jpg" width="180" alt="中国传统色 297-白芨红"></a>
  <a href="images/298-嫩菱红.png"><img src="thumbnails/color-card-298.jpg" width="180" alt="中国传统色 298-嫩菱红"></a>
  <a href="images/299-菠根红.png"><img src="thumbnails/color-card-299.jpg" width="180" alt="中国传统色 299-菠根红"></a>
  <a href="images/300-酢酱草红.png"><img src="thumbnails/color-card-300.jpg" width="180" alt="中国传统色 300-酢酱草红"></a>
</p>

<p align="center">
  <a href="images/301-洋葱紫.png"><img src="thumbnails/color-card-301.jpg" width="180" alt="中国传统色 301-洋葱紫"></a>
  <a href="images/302-海象紫.png"><img src="thumbnails/color-card-302.jpg" width="180" alt="中国传统色 302-海象紫"></a>
  <a href="images/303-绀紫.png"><img src="thumbnails/color-card-303.jpg" width="180" alt="中国传统色 303-绀紫"></a>
  <a href="images/304-古铜紫.png"><img src="thumbnails/color-card-304.jpg" width="180" alt="中国传统色 304-古铜紫"></a>
</p>

<p align="center">
  <a href="images/305-石蕊红.png"><img src="thumbnails/color-card-305.jpg" width="180" alt="中国传统色 305-石蕊红"></a>
  <a href="images/306-芍药耕红.png"><img src="thumbnails/color-card-306.jpg" width="180" alt="中国传统色 306-芍药耕红"></a>
  <a href="images/307-藏花红.png"><img src="thumbnails/color-card-307.jpg" width="180" alt="中国传统色 307-藏花红"></a>
  <a href="images/308-初荷红.png"><img src="thumbnails/color-card-308.jpg" width="180" alt="中国传统色 308-初荷红"></a>
</p>

<p align="center">
  <a href="images/309-马鞭草紫.png"><img src="thumbnails/color-card-309.jpg" width="180" alt="中国传统色 309-马鞭草紫"></a>
  <a href="images/310-丁香淡紫.png"><img src="thumbnails/color-card-310.jpg" width="180" alt="中国传统色 310-丁香淡紫"></a>
  <a href="images/311-丹紫红.png"><img src="thumbnails/color-card-311.jpg" width="180" alt="中国传统色 311-丹紫红"></a>
  <a href="images/312-玫瑰红.png"><img src="thumbnails/color-card-312.jpg" width="180" alt="中国传统色 312-玫瑰红"></a>
</p>

<p align="center">
  <a href="images/313-淡牵牛紫.png"><img src="thumbnails/color-card-313.jpg" width="180" alt="中国传统色 313-淡牵牛紫"></a>
  <a href="images/314-凤信紫.png"><img src="thumbnails/color-card-314.jpg" width="180" alt="中国传统色 314-凤信紫"></a>
  <a href="images/315-萝兰紫.png"><img src="thumbnails/color-card-315.jpg" width="180" alt="中国传统色 315-萝兰紫"></a>
  <a href="images/316-玫瑰紫.png"><img src="thumbnails/color-card-316.jpg" width="180" alt="中国传统色 316-玫瑰紫"></a>
</p>

<p align="center">
  <a href="images/317-藤萝紫.png"><img src="thumbnails/color-card-317.jpg" width="180" alt="中国传统色 317-藤萝紫"></a>
  <a href="images/318-槿紫.png"><img src="thumbnails/color-card-318.jpg" width="180" alt="中国传统色 318-槿紫"></a>
  <a href="images/319-蕈紫.png"><img src="thumbnails/color-card-319.jpg" width="180" alt="中国传统色 319-蕈紫"></a>
  <a href="images/320-桔梗紫.png"><img src="thumbnails/color-card-320.jpg" width="180" alt="中国传统色 320-桔梗紫"></a>
</p>

<p align="center">
  <a href="images/321-魏紫.png"><img src="thumbnails/color-card-321.jpg" width="180" alt="中国传统色 321-魏紫"></a>
  <a href="images/322-芝兰紫.png"><img src="thumbnails/color-card-322.jpg" width="180" alt="中国传统色 322-芝兰紫"></a>
  <a href="images/323-菱锰红.png"><img src="thumbnails/color-card-323.jpg" width="180" alt="中国传统色 323-菱锰红"></a>
  <a href="images/324-龙须红.png"><img src="thumbnails/color-card-324.jpg" width="180" alt="中国传统色 324-龙须红"></a>
</p>

<p align="center">
  <a href="images/325-蓟粉红.png"><img src="thumbnails/color-card-325.jpg" width="180" alt="中国传统色 325-蓟粉红"></a>
  <a href="images/326-电气石红.png"><img src="thumbnails/color-card-326.jpg" width="180" alt="中国传统色 326-电气石红"></a>
  <a href="images/327-樱草紫.png"><img src="thumbnails/color-card-327.jpg" width="180" alt="中国传统色 327-樱草紫"></a>
  <a href="images/328-芦穗灰.png"><img src="thumbnails/color-card-328.jpg" width="180" alt="中国传统色 328-芦穗灰"></a>
</p>

<p align="center">
  <a href="images/329-隐红灰.png"><img src="thumbnails/color-card-329.jpg" width="180" alt="中国传统色 329-隐红灰"></a>
  <a href="images/330-苋菜紫.png"><img src="thumbnails/color-card-330.jpg" width="180" alt="中国传统色 330-苋菜紫"></a>
  <a href="images/331-芦灰.png"><img src="thumbnails/color-card-331.jpg" width="180" alt="中国传统色 331-芦灰"></a>
  <a href="images/332-暮云灰.png"><img src="thumbnails/color-card-332.jpg" width="180" alt="中国传统色 332-暮云灰"></a>
</p>

<p align="center">
  <a href="images/333-斑鸠灰.png"><img src="thumbnails/color-card-333.jpg" width="180" alt="中国传统色 333-斑鸠灰"></a>
  <a href="images/334-淡藤萝紫.png"><img src="thumbnails/color-card-334.jpg" width="180" alt="中国传统色 334-淡藤萝紫"></a>
  <a href="images/335-淡青紫.png"><img src="thumbnails/color-card-335.jpg" width="180" alt="中国传统色 335-淡青紫"></a>
  <a href="images/336-青蛤壳紫.png"><img src="thumbnails/color-card-336.jpg" width="180" alt="中国传统色 336-青蛤壳紫"></a>
</p>

<p align="center">
  <a href="images/337-豆蔻紫.png"><img src="thumbnails/color-card-337.jpg" width="180" alt="中国传统色 337-豆蔻紫"></a>
  <a href="images/338-扁豆紫.png"><img src="thumbnails/color-card-338.jpg" width="180" alt="中国传统色 338-扁豆紫"></a>
  <a href="images/339-芥花紫.png"><img src="thumbnails/color-card-339.jpg" width="180" alt="中国传统色 339-芥花紫"></a>
  <a href="images/340-青莲.png"><img src="thumbnails/color-card-340.jpg" width="180" alt="中国传统色 340-青莲"></a>
</p>

<p align="center">
  <a href="images/341-芓紫.png"><img src="thumbnails/color-card-341.jpg" width="180" alt="中国传统色 341-芓紫"></a>
  <a href="images/342-葛巾紫.png"><img src="thumbnails/color-card-342.jpg" width="180" alt="中国传统色 342-葛巾紫"></a>
  <a href="images/343-牵牛紫.png"><img src="thumbnails/color-card-343.jpg" width="180" alt="中国传统色 343-牵牛紫"></a>
  <a href="images/344-紫灰.png"><img src="thumbnails/color-card-344.jpg" width="180" alt="中国传统色 344-紫灰"></a>
</p>

<p align="center">
  <a href="images/345-龙睛鱼紫.png"><img src="thumbnails/color-card-345.jpg" width="180" alt="中国传统色 345-龙睛鱼紫"></a>
  <a href="images/346-荸荠紫.png"><img src="thumbnails/color-card-346.jpg" width="180" alt="中国传统色 346-荸荠紫"></a>
  <a href="images/347-古鼎灰.png"><img src="thumbnails/color-card-347.jpg" width="180" alt="中国传统色 347-古鼎灰"></a>
  <a href="images/348-乌梅紫.png"><img src="thumbnails/color-card-348.jpg" width="180" alt="中国传统色 348-乌梅紫"></a>
</p>

<p align="center">
  <a href="images/349-深牵牛紫.png"><img src="thumbnails/color-card-349.jpg" width="180" alt="中国传统色 349-深牵牛紫"></a>
  <a href="images/350-银白.png"><img src="thumbnails/color-card-350.jpg" width="180" alt="中国传统色 350-银白"></a>
  <a href="images/351-芡食白.png"><img src="thumbnails/color-card-351.jpg" width="180" alt="中国传统色 351-芡食白"></a>
  <a href="images/352-远山紫.png"><img src="thumbnails/color-card-352.jpg" width="180" alt="中国传统色 352-远山紫"></a>
</p>

<p align="center">
  <a href="images/353-淡蓝紫.png"><img src="thumbnails/color-card-353.jpg" width="180" alt="中国传统色 353-淡蓝紫"></a>
  <a href="images/354-山梗紫.png"><img src="thumbnails/color-card-354.jpg" width="180" alt="中国传统色 354-山梗紫"></a>
  <a href="images/355-螺甸紫.png"><img src="thumbnails/color-card-355.jpg" width="180" alt="中国传统色 355-螺甸紫"></a>
  <a href="images/356-玛瑙灰.png"><img src="thumbnails/color-card-356.jpg" width="180" alt="中国传统色 356-玛瑙灰"></a>
</p>

<p align="center">
  <a href="images/357-野菊紫.png"><img src="thumbnails/color-card-357.jpg" width="180" alt="中国传统色 357-野菊紫"></a>
  <a href="images/358-满天星紫.png"><img src="thumbnails/color-card-358.jpg" width="180" alt="中国传统色 358-满天星紫"></a>
  <a href="images/359-锌灰.png"><img src="thumbnails/color-card-359.jpg" width="180" alt="中国传统色 359-锌灰"></a>
  <a href="images/360-野葡萄紫.png"><img src="thumbnails/color-card-360.jpg" width="180" alt="中国传统色 360-野葡萄紫"></a>
</p>

<p align="center">
  <a href="images/361-剑锋紫.png"><img src="thumbnails/color-card-361.jpg" width="180" alt="中国传统色 361-剑锋紫"></a>
  <a href="images/362-龙葵紫.png"><img src="thumbnails/color-card-362.jpg" width="180" alt="中国传统色 362-龙葵紫"></a>
  <a href="images/363-暗龙胆紫.png"><img src="thumbnails/color-card-363.jpg" width="180" alt="中国传统色 363-暗龙胆紫"></a>
  <a href="images/364-晶石紫.png"><img src="thumbnails/color-card-364.jpg" width="180" alt="中国传统色 364-晶石紫"></a>
</p>

<p align="center">
  <a href="images/365-暗蓝紫.png"><img src="thumbnails/color-card-365.jpg" width="180" alt="中国传统色 365-暗蓝紫"></a>
  <a href="images/366-景泰蓝.png"><img src="thumbnails/color-card-366.jpg" width="180" alt="中国传统色 366-景泰蓝"></a>
  <a href="images/367-尼罗蓝.png"><img src="thumbnails/color-card-367.jpg" width="180" alt="中国传统色 367-尼罗蓝"></a>
  <a href="images/368-远天蓝.png"><img src="thumbnails/color-card-368.jpg" width="180" alt="中国传统色 368-远天蓝"></a>
</p>

<p align="center">
  <a href="images/369-星蓝.png"><img src="thumbnails/color-card-369.jpg" width="180" alt="中国传统色 369-星蓝"></a>
  <a href="images/370-羽扇豆蓝.png"><img src="thumbnails/color-card-370.jpg" width="180" alt="中国传统色 370-羽扇豆蓝"></a>
  <a href="images/371-花青.png"><img src="thumbnails/color-card-371.jpg" width="180" alt="中国传统色 371-花青"></a>
  <a href="images/372-睛蓝.png"><img src="thumbnails/color-card-372.jpg" width="180" alt="中国传统色 372-睛蓝"></a>
</p>

<p align="center">
  <a href="images/373-虹蓝.png"><img src="thumbnails/color-card-373.jpg" width="180" alt="中国传统色 373-虹蓝"></a>
  <a href="images/374-湖水蓝.png"><img src="thumbnails/color-card-374.jpg" width="180" alt="中国传统色 374-湖水蓝"></a>
  <a href="images/375-秋波蓝.png"><img src="thumbnails/color-card-375.jpg" width="180" alt="中国传统色 375-秋波蓝"></a>
  <a href="images/376-涧石蓝.png"><img src="thumbnails/color-card-376.jpg" width="180" alt="中国传统色 376-涧石蓝"></a>
</p>

<p align="center">
  <a href="images/377-潮蓝.png"><img src="thumbnails/color-card-377.jpg" width="180" alt="中国传统色 377-潮蓝"></a>
  <a href="images/378-群青.png"><img src="thumbnails/color-card-378.jpg" width="180" alt="中国传统色 378-群青"></a>
  <a href="images/379-霁青.png"><img src="thumbnails/color-card-379.jpg" width="180" alt="中国传统色 379-霁青"></a>
  <a href="images/380-碧青.png"><img src="thumbnails/color-card-380.jpg" width="180" alt="中国传统色 380-碧青"></a>
</p>

<p align="center">
  <a href="images/381-宝石蓝.png"><img src="thumbnails/color-card-381.jpg" width="180" alt="中国传统色 381-宝石蓝"></a>
  <a href="images/382-天蓝.png"><img src="thumbnails/color-card-382.jpg" width="180" alt="中国传统色 382-天蓝"></a>
  <a href="images/383-柏林蓝.png"><img src="thumbnails/color-card-383.jpg" width="180" alt="中国传统色 383-柏林蓝"></a>
  <a href="images/384-海青.png"><img src="thumbnails/color-card-384.jpg" width="180" alt="中国传统色 384-海青"></a>
</p>

<p align="center">
  <a href="images/385-钴蓝.png"><img src="thumbnails/color-card-385.jpg" width="180" alt="中国传统色 385-钴蓝"></a>
  <a href="images/386-鸢尾蓝.png"><img src="thumbnails/color-card-386.jpg" width="180" alt="中国传统色 386-鸢尾蓝"></a>
  <a href="images/387-牵牛花蓝.png"><img src="thumbnails/color-card-387.jpg" width="180" alt="中国传统色 387-牵牛花蓝"></a>
  <a href="images/388-飞燕草蓝.png"><img src="thumbnails/color-card-388.jpg" width="180" alt="中国传统色 388-飞燕草蓝"></a>
</p>

<p align="center">
  <a href="images/389-品蓝.png"><img src="thumbnails/color-card-389.jpg" width="180" alt="中国传统色 389-品蓝"></a>
  <a href="images/390-银鱼白.png"><img src="thumbnails/color-card-390.jpg" width="180" alt="中国传统色 390-银鱼白"></a>
  <a href="images/391-安安蓝.png"><img src="thumbnails/color-card-391.jpg" width="180" alt="中国传统色 391-安安蓝"></a>
  <a href="images/392-鱼尾灰.png"><img src="thumbnails/color-card-392.jpg" width="180" alt="中国传统色 392-鱼尾灰"></a>
</p>

<p align="center">
  <a href="images/393-鲸鱼灰.png"><img src="thumbnails/color-card-393.jpg" width="180" alt="中国传统色 393-鲸鱼灰"></a>
  <a href="images/394-海参灰.png"><img src="thumbnails/color-card-394.jpg" width="180" alt="中国传统色 394-海参灰"></a>
  <a href="images/395-沙鱼灰.png"><img src="thumbnails/color-card-395.jpg" width="180" alt="中国传统色 395-沙鱼灰"></a>
  <a href="images/396-钢蓝.png"><img src="thumbnails/color-card-396.jpg" width="180" alt="中国传统色 396-钢蓝"></a>
</p>

<p align="center">
  <a href="images/397-云水蓝.png"><img src="thumbnails/color-card-397.jpg" width="180" alt="中国传统色 397-云水蓝"></a>
  <a href="images/398-晴山蓝.png"><img src="thumbnails/color-card-398.jpg" width="180" alt="中国传统色 398-晴山蓝"></a>
  <a href="images/399-靛青.png"><img src="thumbnails/color-card-399.jpg" width="180" alt="中国传统色 399-靛青"></a>
  <a href="images/400-大理石灰.png"><img src="thumbnails/color-card-400.jpg" width="180" alt="中国传统色 400-大理石灰"></a>
</p>

<p align="center">
  <a href="images/401-海涛蓝.png"><img src="thumbnails/color-card-401.jpg" width="180" alt="中国传统色 401-海涛蓝"></a>
  <a href="images/402-蝶翅蓝.png"><img src="thumbnails/color-card-402.jpg" width="180" alt="中国传统色 402-蝶翅蓝"></a>
  <a href="images/403-海军蓝.png"><img src="thumbnails/color-card-403.jpg" width="180" alt="中国传统色 403-海军蓝"></a>
  <a href="images/404-水牛灰.png"><img src="thumbnails/color-card-404.jpg" width="180" alt="中国传统色 404-水牛灰"></a>
</p>

<p align="center">
  <a href="images/405-牛角灰.png"><img src="thumbnails/color-card-405.jpg" width="180" alt="中国传统色 405-牛角灰"></a>
  <a href="images/406-燕颔蓝.png"><img src="thumbnails/color-card-406.jpg" width="180" alt="中国传统色 406-燕颔蓝"></a>
  <a href="images/407-云峰白.png"><img src="thumbnails/color-card-407.jpg" width="180" alt="中国传统色 407-云峰白"></a>
  <a href="images/408-井天蓝.png"><img src="thumbnails/color-card-408.jpg" width="180" alt="中国传统色 408-井天蓝"></a>
</p>

<p align="center">
  <a href="images/409-云山蓝.png"><img src="thumbnails/color-card-409.jpg" width="180" alt="中国传统色 409-云山蓝"></a>
  <a href="images/410-釉蓝.png"><img src="thumbnails/color-card-410.jpg" width="180" alt="中国传统色 410-釉蓝"></a>
  <a href="images/411-鸥蓝.png"><img src="thumbnails/color-card-411.jpg" width="180" alt="中国传统色 411-鸥蓝"></a>
  <a href="images/412-搪磁蓝.png"><img src="thumbnails/color-card-412.jpg" width="180" alt="中国传统色 412-搪磁蓝"></a>
</p>

<p align="center">
  <a href="images/413-月影白.png"><img src="thumbnails/color-card-413.jpg" width="180" alt="中国传统色 413-月影白"></a>
  <a href="images/414-星灰.png"><img src="thumbnails/color-card-414.jpg" width="180" alt="中国传统色 414-星灰"></a>
  <a href="images/415-淡蓝灰.png"><img src="thumbnails/color-card-415.jpg" width="180" alt="中国传统色 415-淡蓝灰"></a>
  <a href="images/416-鷃蓝.png"><img src="thumbnails/color-card-416.jpg" width="180" alt="中国传统色 416-鷃蓝"></a>
</p>

<p align="center">
  <a href="images/417-嫩灰.png"><img src="thumbnails/color-card-417.jpg" width="180" alt="中国传统色 417-嫩灰"></a>
  <a href="images/418-战舰灰.png"><img src="thumbnails/color-card-418.jpg" width="180" alt="中国传统色 418-战舰灰"></a>
  <a href="images/419-瓦罐灰.png"><img src="thumbnails/color-card-419.jpg" width="180" alt="中国传统色 419-瓦罐灰"></a>
  <a href="images/420-青灰.png"><img src="thumbnails/color-card-420.jpg" width="180" alt="中国传统色 420-青灰"></a>
</p>

<p align="center">
  <a href="images/421-鸽蓝.png"><img src="thumbnails/color-card-421.jpg" width="180" alt="中国传统色 421-鸽蓝"></a>
  <a href="images/422-钢青.png"><img src="thumbnails/color-card-422.jpg" width="180" alt="中国传统色 422-钢青"></a>
  <a href="images/423-暗蓝.png"><img src="thumbnails/color-card-423.jpg" width="180" alt="中国传统色 423-暗蓝"></a>
  <a href="images/424-月白.png"><img src="thumbnails/color-card-424.jpg" width="180" alt="中国传统色 424-月白"></a>
</p>

<p align="center">
  <a href="images/425-海天蓝.png"><img src="thumbnails/color-card-425.jpg" width="180" alt="中国传统色 425-海天蓝"></a>
  <a href="images/426-清水蓝.png"><img src="thumbnails/color-card-426.jpg" width="180" alt="中国传统色 426-清水蓝"></a>
  <a href="images/427-瀑布蓝.png"><img src="thumbnails/color-card-427.jpg" width="180" alt="中国传统色 427-瀑布蓝"></a>
  <a href="images/428-蔚蓝.png"><img src="thumbnails/color-card-428.jpg" width="180" alt="中国传统色 428-蔚蓝"></a>
</p>

<p align="center">
  <a href="images/429-孔雀蓝.png"><img src="thumbnails/color-card-429.jpg" width="180" alt="中国传统色 429-孔雀蓝"></a>
  <a href="images/430-甸子蓝.png"><img src="thumbnails/color-card-430.jpg" width="180" alt="中国传统色 430-甸子蓝"></a>
  <a href="images/431-石绿.png"><img src="thumbnails/color-card-431.jpg" width="180" alt="中国传统色 431-石绿"></a>
  <a href="images/432-竹篁绿.png"><img src="thumbnails/color-card-432.jpg" width="180" alt="中国传统色 432-竹篁绿"></a>
</p>

<p align="center">
  <a href="images/433-粉绿.png"><img src="thumbnails/color-card-433.jpg" width="180" alt="中国传统色 433-粉绿"></a>
  <a href="images/434-美蝶绿.png"><img src="thumbnails/color-card-434.jpg" width="180" alt="中国传统色 434-美蝶绿"></a>
  <a href="images/435-毛绿.png"><img src="thumbnails/color-card-435.jpg" width="180" alt="中国传统色 435-毛绿"></a>
  <a href="images/436-蔻梢绿.png"><img src="thumbnails/color-card-436.jpg" width="180" alt="中国传统色 436-蔻梢绿"></a>
</p>

<p align="center">
  <a href="images/437-麦苗绿.png"><img src="thumbnails/color-card-437.jpg" width="180" alt="中国传统色 437-麦苗绿"></a>
  <a href="images/438-蛙绿.png"><img src="thumbnails/color-card-438.jpg" width="180" alt="中国传统色 438-蛙绿"></a>
  <a href="images/439-铜绿.png"><img src="thumbnails/color-card-439.jpg" width="180" alt="中国传统色 439-铜绿"></a>
  <a href="images/440-竹绿.png"><img src="thumbnails/color-card-440.jpg" width="180" alt="中国传统色 440-竹绿"></a>
</p>

<p align="center">
  <a href="images/441-蓝绿.png"><img src="thumbnails/color-card-441.jpg" width="180" alt="中国传统色 441-蓝绿"></a>
  <a href="images/442-穹灰.png"><img src="thumbnails/color-card-442.jpg" width="180" alt="中国传统色 442-穹灰"></a>
  <a href="images/443-翠蓝.png"><img src="thumbnails/color-card-443.jpg" width="180" alt="中国传统色 443-翠蓝"></a>
  <a href="images/444-胆矾蓝.png"><img src="thumbnails/color-card-444.jpg" width="180" alt="中国传统色 444-胆矾蓝"></a>
</p>

<p align="center">
  <a href="images/445-樫鸟蓝.png"><img src="thumbnails/color-card-445.jpg" width="180" alt="中国传统色 445-樫鸟蓝"></a>
  <a href="images/446-闪蓝.png"><img src="thumbnails/color-card-446.jpg" width="180" alt="中国传统色 446-闪蓝"></a>
  <a href="images/447-冰山蓝.png"><img src="thumbnails/color-card-447.jpg" width="180" alt="中国传统色 447-冰山蓝"></a>
  <a href="images/448-虾壳青.png"><img src="thumbnails/color-card-448.jpg" width="180" alt="中国传统色 448-虾壳青"></a>
</p>

<p align="center">
  <a href="images/449-晚波蓝.png"><img src="thumbnails/color-card-449.jpg" width="180" alt="中国传统色 449-晚波蓝"></a>
  <a href="images/450-蜻蜓蓝.png"><img src="thumbnails/color-card-450.jpg" width="180" alt="中国传统色 450-蜻蜓蓝"></a>
  <a href="images/451-玉鈫蓝.png"><img src="thumbnails/color-card-451.jpg" width="180" alt="中国传统色 451-玉鈫蓝"></a>
  <a href="images/452-垩灰.png"><img src="thumbnails/color-card-452.jpg" width="180" alt="中国传统色 452-垩灰"></a>
</p>

<p align="center">
  <a href="images/453-夏云灰.png"><img src="thumbnails/color-card-453.jpg" width="180" alt="中国传统色 453-夏云灰"></a>
  <a href="images/454-苍蓝.png"><img src="thumbnails/color-card-454.jpg" width="180" alt="中国传统色 454-苍蓝"></a>
  <a href="images/455-黄昏灰.png"><img src="thumbnails/color-card-455.jpg" width="180" alt="中国传统色 455-黄昏灰"></a>
  <a href="images/456-灰蓝.png"><img src="thumbnails/color-card-456.jpg" width="180" alt="中国传统色 456-灰蓝"></a>
</p>

<p align="center">
  <a href="images/457-深灰蓝.png"><img src="thumbnails/color-card-457.jpg" width="180" alt="中国传统色 457-深灰蓝"></a>
  <a href="images/458-玉簪绿.png"><img src="thumbnails/color-card-458.jpg" width="180" alt="中国传统色 458-玉簪绿"></a>
  <a href="images/459-青矾绿.png"><img src="thumbnails/color-card-459.jpg" width="180" alt="中国传统色 459-青矾绿"></a>
  <a href="images/460-草原远绿.png"><img src="thumbnails/color-card-460.jpg" width="180" alt="中国传统色 460-草原远绿"></a>
</p>

<p align="center">
  <a href="images/461-梧枝绿.png"><img src="thumbnails/color-card-461.jpg" width="180" alt="中国传统色 461-梧枝绿"></a>
  <a href="images/462-浪花绿.png"><img src="thumbnails/color-card-462.jpg" width="180" alt="中国传统色 462-浪花绿"></a>
  <a href="images/463-海王绿.png"><img src="thumbnails/color-card-463.jpg" width="180" alt="中国传统色 463-海王绿"></a>
  <a href="images/464-亚丁绿.png"><img src="thumbnails/color-card-464.jpg" width="180" alt="中国传统色 464-亚丁绿"></a>
</p>

<p align="center">
  <a href="images/465-镍灰.png"><img src="thumbnails/color-card-465.jpg" width="180" alt="中国传统色 465-镍灰"></a>
  <a href="images/466-明灰.png"><img src="thumbnails/color-card-466.jpg" width="180" alt="中国传统色 466-明灰"></a>
  <a href="images/467-淡绿灰.png"><img src="thumbnails/color-card-467.jpg" width="180" alt="中国传统色 467-淡绿灰"></a>
  <a href="images/468-飞泉绿.png"><img src="thumbnails/color-card-468.jpg" width="180" alt="中国传统色 468-飞泉绿"></a>
</p>

<p align="center">
  <a href="images/469-狼烟灰.png"><img src="thumbnails/color-card-469.jpg" width="180" alt="中国传统色 469-狼烟灰"></a>
  <a href="images/470-绿灰.png"><img src="thumbnails/color-card-470.jpg" width="180" alt="中国传统色 470-绿灰"></a>
  <a href="images/471-苍绿.png"><img src="thumbnails/color-card-471.jpg" width="180" alt="中国传统色 471-苍绿"></a>
  <a href="images/472-深海绿.png"><img src="thumbnails/color-card-472.jpg" width="180" alt="中国传统色 472-深海绿"></a>
</p>

<p align="center">
  <a href="images/473-长石灰.png"><img src="thumbnails/color-card-473.jpg" width="180" alt="中国传统色 473-长石灰"></a>
  <a href="images/474-苷蓝绿.png"><img src="thumbnails/color-card-474.jpg" width="180" alt="中国传统色 474-苷蓝绿"></a>
  <a href="images/475-莽丛绿.png"><img src="thumbnails/color-card-475.jpg" width="180" alt="中国传统色 475-莽丛绿"></a>
  <a href="images/476-淡翠绿.png"><img src="thumbnails/color-card-476.jpg" width="180" alt="中国传统色 476-淡翠绿"></a>
</p>

<p align="center">
  <a href="images/477-明绿.png"><img src="thumbnails/color-card-477.jpg" width="180" alt="中国传统色 477-明绿"></a>
  <a href="images/478-田园绿.png"><img src="thumbnails/color-card-478.jpg" width="180" alt="中国传统色 478-田园绿"></a>
  <a href="images/479-翠绿.png"><img src="thumbnails/color-card-479.jpg" width="180" alt="中国传统色 479-翠绿"></a>
  <a href="images/480-淡绿.png"><img src="thumbnails/color-card-480.jpg" width="180" alt="中国传统色 480-淡绿"></a>
</p>

<p align="center">
  <a href="images/481-葱绿.png"><img src="thumbnails/color-card-481.jpg" width="180" alt="中国传统色 481-葱绿"></a>
  <a href="images/482-孔雀绿.png"><img src="thumbnails/color-card-482.jpg" width="180" alt="中国传统色 482-孔雀绿"></a>
  <a href="images/483-艾绿.png"><img src="thumbnails/color-card-483.jpg" width="180" alt="中国传统色 483-艾绿"></a>
  <a href="images/484-蟾绿.png"><img src="thumbnails/color-card-484.jpg" width="180" alt="中国传统色 484-蟾绿"></a>
</p>

<p align="center">
  <a href="images/485-宫殿绿.png"><img src="thumbnails/color-card-485.jpg" width="180" alt="中国传统色 485-宫殿绿"></a>
  <a href="images/486-松霜绿.png"><img src="thumbnails/color-card-486.jpg" width="180" alt="中国传统色 486-松霜绿"></a>
  <a href="images/487-蛋白石绿.png"><img src="thumbnails/color-card-487.jpg" width="180" alt="中国传统色 487-蛋白石绿"></a>
  <a href="images/488-薄荷绿.png"><img src="thumbnails/color-card-488.jpg" width="180" alt="中国传统色 488-薄荷绿"></a>
</p>

<p align="center">
  <a href="images/489-瓦松绿.png"><img src="thumbnails/color-card-489.jpg" width="180" alt="中国传统色 489-瓦松绿"></a>
  <a href="images/490-荷叶绿.png"><img src="thumbnails/color-card-490.jpg" width="180" alt="中国传统色 490-荷叶绿"></a>
  <a href="images/491-田螺绿.png"><img src="thumbnails/color-card-491.jpg" width="180" alt="中国传统色 491-田螺绿"></a>
  <a href="images/492-白屈菜绿.png"><img src="thumbnails/color-card-492.jpg" width="180" alt="中国传统色 492-白屈菜绿"></a>
</p>

<p align="center">
  <a href="images/493-河豚灰.png"><img src="thumbnails/color-card-493.jpg" width="180" alt="中国传统色 493-河豚灰"></a>
  <a href="images/494-蒽油绿.png"><img src="thumbnails/color-card-494.jpg" width="180" alt="中国传统色 494-蒽油绿"></a>
  <a href="images/495-槲寄生绿.png"><img src="thumbnails/color-card-495.jpg" width="180" alt="中国传统色 495-槲寄生绿"></a>
  <a href="images/496-云杉绿.png"><img src="thumbnails/color-card-496.jpg" width="180" alt="中国传统色 496-云杉绿"></a>
</p>

<p align="center">
  <a href="images/497-嫩菊绿.png"><img src="thumbnails/color-card-497.jpg" width="180" alt="中国传统色 497-嫩菊绿"></a>
  <a href="images/498-艾背绿.png"><img src="thumbnails/color-card-498.jpg" width="180" alt="中国传统色 498-艾背绿"></a>
  <a href="images/499-嘉陵水绿.png"><img src="thumbnails/color-card-499.jpg" width="180" alt="中国传统色 499-嘉陵水绿"></a>
  <a href="images/500-玉髓绿.png"><img src="thumbnails/color-card-500.jpg" width="180" alt="中国传统色 500-玉髓绿"></a>
</p>

<p align="center">
  <a href="images/501-鲜绿.png"><img src="thumbnails/color-card-501.jpg" width="180" alt="中国传统色 501-鲜绿"></a>
  <a href="images/502-宝石绿.png"><img src="thumbnails/color-card-502.jpg" width="180" alt="中国传统色 502-宝石绿"></a>
  <a href="images/503-海沬绿.png"><img src="thumbnails/color-card-503.jpg" width="180" alt="中国传统色 503-海沬绿"></a>
  <a href="images/504-姚黄.png"><img src="thumbnails/color-card-504.jpg" width="180" alt="中国传统色 504-姚黄"></a>
</p>

<p align="center">
  <a href="images/505-橄榄石绿.png"><img src="thumbnails/color-card-505.jpg" width="180" alt="中国传统色 505-橄榄石绿"></a>
  <a href="images/506-水绿.png"><img src="thumbnails/color-card-506.jpg" width="180" alt="中国传统色 506-水绿"></a>
  <a href="images/507-芦苇绿.png"><img src="thumbnails/color-card-507.jpg" width="180" alt="中国传统色 507-芦苇绿"></a>
  <a href="images/508-槐花黄绿.png"><img src="thumbnails/color-card-508.jpg" width="180" alt="中国传统色 508-槐花黄绿"></a>
</p>

<p align="center">
  <a href="images/509-苹果绿.png"><img src="thumbnails/color-card-509.jpg" width="180" alt="中国传统色 509-苹果绿"></a>
  <a href="images/510-芽绿.png"><img src="thumbnails/color-card-510.jpg" width="180" alt="中国传统色 510-芽绿"></a>
  <a href="images/511-蝶黄.png"><img src="thumbnails/color-card-511.jpg" width="180" alt="中国传统色 511-蝶黄"></a>
  <a href="images/512-橄榄黄绿.png"><img src="thumbnails/color-card-512.jpg" width="180" alt="中国传统色 512-橄榄黄绿"></a>
</p>

<p align="center">
  <a href="images/513-鹦鹉绿.png"><img src="thumbnails/color-card-513.jpg" width="180" alt="中国传统色 513-鹦鹉绿"></a>
  <a href="images/514-油绿.png"><img src="thumbnails/color-card-514.jpg" width="180" alt="中国传统色 514-油绿"></a>
  <a href="images/515-象牙白.png"><img src="thumbnails/color-card-515.jpg" width="180" alt="中国传统色 515-象牙白"></a>
  <a href="images/516-汉白玉.png"><img src="thumbnails/color-card-516.jpg" width="180" alt="中国传统色 516-汉白玉"></a>
</p>

<p align="center">
  <a href="images/517-雪白.png"><img src="thumbnails/color-card-517.jpg" width="180" alt="中国传统色 517-雪白"></a>
  <a href="images/518-鱼肚白.png"><img src="thumbnails/color-card-518.jpg" width="180" alt="中国传统色 518-鱼肚白"></a>
  <a href="images/519-珍珠灰.png"><img src="thumbnails/color-card-519.jpg" width="180" alt="中国传统色 519-珍珠灰"></a>
  <a href="images/520-浅灰.png"><img src="thumbnails/color-card-520.jpg" width="180" alt="中国传统色 520-浅灰"></a>
</p>

<p align="center">
  <a href="images/521-铅灰.png"><img src="thumbnails/color-card-521.jpg" width="180" alt="中国传统色 521-铅灰"></a>
  <a href="images/522-中灰.png"><img src="thumbnails/color-card-522.jpg" width="180" alt="中国传统色 522-中灰"></a>
  <a href="images/523-瓦灰.png"><img src="thumbnails/color-card-523.jpg" width="180" alt="中国传统色 523-瓦灰"></a>
  <a href="images/524-夜灰.png"><img src="thumbnails/color-card-524.jpg" width="180" alt="中国传统色 524-夜灰"></a>
</p>

<p align="center">
  <a href="images/525-雁灰.png"><img src="thumbnails/color-card-525.jpg" width="180" alt="中国传统色 525-雁灰"></a>
  <a href="images/526-深灰.png"><img src="thumbnails/color-card-526.jpg" width="180" alt="中国传统色 526-深灰"></a>
  <a href="images/527-蓝翠竹.png"><img src="thumbnails/color-card-527.jpg" width="180" alt="中国传统色 527-蓝翠竹"></a>
  <a href="images/528-云青灰.png"><img src="thumbnails/color-card-528.jpg" width="180" alt="中国传统色 528-云青灰"></a>
</p>

<p align="center">
  <a href="images/529-黑.png"><img src="thumbnails/color-card-529.jpg" width="180" alt="中国传统色 529-黑"></a>
  <a href="images/530-普鲁士蓝.png"><img src="thumbnails/color-card-530.jpg" width="180" alt="中国传统色 530-普鲁士蓝"></a>
  <a href="images/531-山岚.png"><img src="thumbnails/color-card-531.jpg" width="180" alt="中国传统色 531-山岚"></a>
  <a href="images/532-綟绶.png"><img src="thumbnails/color-card-532.jpg" width="180" alt="中国传统色 532-綟绶"></a>
</p>

<p align="center">
  <a href="images/533-黛蓝.png"><img src="thumbnails/color-card-533.jpg" width="180" alt="中国传统色 533-黛蓝"></a>
  <a href="images/534-烟紫.png"><img src="thumbnails/color-card-534.jpg" width="180" alt="中国传统色 534-烟紫"></a>
  <a href="images/535-暮山紫.png"><img src="thumbnails/color-card-535.jpg" width="180" alt="中国传统色 535-暮山紫"></a>
  <a href="images/536-月白天青.png"><img src="thumbnails/color-card-536.jpg" width="180" alt="中国传统色 536-月白天青"></a>
</p>

<p align="center">
  <a href="images/537-翠微.png"><img src="thumbnails/color-card-537.jpg" width="180" alt="中国传统色 537-翠微"></a>
  <a href="images/538-紫云.png"><img src="thumbnails/color-card-538.jpg" width="180" alt="中国传统色 538-紫云"></a>
  <a href="images/539-青霜.png"><img src="thumbnails/color-card-539.jpg" width="180" alt="中国传统色 539-青霜"></a>
  <a href="images/540-梅子青.png"><img src="thumbnails/color-card-540.jpg" width="180" alt="中国传统色 540-梅子青"></a>
</p>

<p align="center">
  <a href="images/541-火焰红.png"><img src="thumbnails/color-card-541.jpg" width="180" alt="中国传统色 541-火焰红"></a>
  <a href="images/542-琥珀.png"><img src="thumbnails/color-card-542.jpg" width="180" alt="中国传统色 542-琥珀"></a>
  <a href="images/543-浅褐色.png"><img src="thumbnails/color-card-543.jpg" width="180" alt="中国传统色 543-浅褐色"></a>
  <a href="images/544-烟青.png"><img src="thumbnails/color-card-544.jpg" width="180" alt="中国传统色 544-烟青"></a>
</p>

<p align="center">
  <a href="images/545-苍碧.png"><img src="thumbnails/color-card-545.jpg" width="180" alt="中国传统色 545-苍碧"></a>
  <a href="images/546-月华.png"><img src="thumbnails/color-card-546.jpg" width="180" alt="中国传统色 546-月华"></a>
  <a href="images/547-绫素白.png"><img src="thumbnails/color-card-547.jpg" width="180" alt="中国传统色 547-绫素白"></a>
  <a href="images/548-墨韵黑.png"><img src="thumbnails/color-card-548.jpg" width="180" alt="中国传统色 548-墨韵黑"></a>
</p>

<p align="center">
  <a href="images/549-夜筵青.png"><img src="thumbnails/color-card-549.jpg" width="180" alt="中国传统色 549-夜筵青"></a>
  <a href="images/550-霜白.png"><img src="thumbnails/color-card-550.jpg" width="180" alt="中国传统色 550-霜白"></a>
  <a href="images/551-秋香.png"><img src="thumbnails/color-card-551.jpg" width="180" alt="中国传统色 551-秋香"></a>
  <a href="images/552-绯红.png"><img src="thumbnails/color-card-552.jpg" width="180" alt="中国传统色 552-绯红"></a>
</p>

<p align="center">
  <a href="images/553-霞绯.png"><img src="thumbnails/color-card-553.jpg" width="180" alt="中国传统色 553-霞绯"></a>
  <a href="images/554-鸦青.png"><img src="thumbnails/color-card-554.jpg" width="180" alt="中国传统色 554-鸦青"></a>
  <a href="images/555-玄黑.png"><img src="thumbnails/color-card-555.jpg" width="180" alt="中国传统色 555-玄黑"></a>
  <a href="images/556-黛青.png"><img src="thumbnails/color-card-556.jpg" width="180" alt="中国传统色 556-黛青"></a>
</p>

<p align="center">
  <a href="images/557-缃绮.png"><img src="thumbnails/color-card-557.jpg" width="180" alt="中国传统色 557-缃绮"></a>
  <a href="images/558-烟褐.png"><img src="thumbnails/color-card-558.jpg" width="180" alt="中国传统色 558-烟褐"></a>
  <a href="images/559-柳苍.png"><img src="thumbnails/color-card-559.jpg" width="180" alt="中国传统色 559-柳苍"></a>
  <a href="images/560-蟹壳青.png"><img src="thumbnails/color-card-560.jpg" width="180" alt="中国传统色 560-蟹壳青"></a>
</p>

<p align="center">
  <a href="images/561-雪青.png"><img src="thumbnails/color-card-561.jpg" width="180" alt="中国传统色 561-雪青"></a>
  <a href="images/562-云蓝.png"><img src="thumbnails/color-card-562.jpg" width="180" alt="中国传统色 562-云蓝"></a>
  <a href="images/563-梅红.png"><img src="thumbnails/color-card-563.jpg" width="180" alt="中国传统色 563-梅红"></a>
  <a href="images/564-柳绿.png"><img src="thumbnails/color-card-564.jpg" width="180" alt="中国传统色 564-柳绿"></a>
</p>

<p align="center">
  <a href="images/565-绀碧.png"><img src="thumbnails/color-card-565.jpg" width="180" alt="中国传统色 565-绀碧"></a>
  <a href="images/566-月蓝.png"><img src="thumbnails/color-card-566.jpg" width="180" alt="中国传统色 566-月蓝"></a>
  <a href="images/567-霜蓝.png"><img src="thumbnails/color-card-567.jpg" width="180" alt="中国传统色 567-霜蓝"></a>
  <a href="images/568-松墨.png"><img src="thumbnails/color-card-568.jpg" width="180" alt="中国传统色 568-松墨"></a>
</p>

<p align="center">
  <a href="images/569-竹青.png"><img src="thumbnails/color-card-569.jpg" width="180" alt="中国传统色 569-竹青"></a>
  <a href="images/570-湖蓝.png"><img src="thumbnails/color-card-570.jpg" width="180" alt="中国传统色 570-湖蓝"></a>
  <a href="images/571-潆青.png"><img src="thumbnails/color-card-571.jpg" width="180" alt="中国传统色 571-潆青"></a>
  <a href="images/572-霜青.png"><img src="thumbnails/color-card-572.jpg" width="180" alt="中国传统色 572-霜青"></a>
</p>

<p align="center">
  <a href="images/573-烟萦紫.png"><img src="thumbnails/color-card-573.jpg" width="180" alt="中国传统色 573-烟萦紫"></a>
  <a href="images/574-缥缃.png"><img src="thumbnails/color-card-574.jpg" width="180" alt="中国传统色 574-缥缃"></a>
  <a href="images/575-露碧.png"><img src="thumbnails/color-card-575.jpg" width="180" alt="中国传统色 575-露碧"></a>
  <a href="images/576-绀青.png"><img src="thumbnails/color-card-576.jpg" width="180" alt="中国传统色 576-绀青"></a>
</p>

<p align="center">
  <a href="images/577-柳黄.png"><img src="thumbnails/color-card-577.jpg" width="180" alt="中国传统色 577-柳黄"></a>
  <a href="images/578-槐黄.png"><img src="thumbnails/color-card-578.jpg" width="180" alt="中国传统色 578-槐黄"></a>
  <a href="images/579-缥色.png"><img src="thumbnails/color-card-579.jpg" width="180" alt="中国传统色 579-缥色"></a>
  <a href="images/580-松花.png"><img src="thumbnails/color-card-580.jpg" width="180" alt="中国传统色 580-松花"></a>
</p>

<p align="center">
  <a href="images/581-缥碧.png"><img src="thumbnails/color-card-581.jpg" width="180" alt="中国传统色 581-缥碧"></a>
  <a href="images/582-荷绿.png"><img src="thumbnails/color-card-582.jpg" width="180" alt="中国传统色 582-荷绿"></a>
  <a href="images/583-檀褐.png"><img src="thumbnails/color-card-583.jpg" width="180" alt="中国传统色 583-檀褐"></a>
  <a href="images/584-月魄.png"><img src="thumbnails/color-card-584.jpg" width="180" alt="中国传统色 584-月魄"></a>
</p>

<p align="center">
  <a href="images/585-滢蓝.png"><img src="thumbnails/color-card-585.jpg" width="180" alt="中国传统色 585-滢蓝"></a>
  <a href="images/586-湖绿.png"><img src="thumbnails/color-card-586.jpg" width="180" alt="中国传统色 586-湖绿"></a>
  <a href="images/587-枫丹.png"><img src="thumbnails/color-card-587.jpg" width="180" alt="中国传统色 587-枫丹"></a>
  <a href="images/588-雾绡.png"><img src="thumbnails/color-card-588.jpg" width="180" alt="中国传统色 588-雾绡"></a>
</p>

<p align="center">
  <a href="images/589-樱粉.png"><img src="thumbnails/color-card-589.jpg" width="180" alt="中国传统色 589-樱粉"></a>
  <a href="images/590-霜紫.png"><img src="thumbnails/color-card-590.jpg" width="180" alt="中国传统色 590-霜紫"></a>
  <a href="images/591-缥青.png"><img src="thumbnails/color-card-591.jpg" width="180" alt="中国传统色 591-缥青"></a>
  <a href="images/592-瑶碧.png"><img src="thumbnails/color-card-592.jpg" width="180" alt="中国传统色 592-瑶碧"></a>
</p>

<p align="center">
  <a href="images/593-墨玉.png"><img src="thumbnails/color-card-593.jpg" width="180" alt="中国传统色 593-墨玉"></a>
  <a href="images/594-莹翠.png"><img src="thumbnails/color-card-594.jpg" width="180" alt="中国传统色 594-莹翠"></a>
  <a href="images/595-茜色.png"><img src="thumbnails/color-card-595.jpg" width="180" alt="中国传统色 595-茜色"></a>
  <a href="images/596-鹅黄.png"><img src="thumbnails/color-card-596.jpg" width="180" alt="中国传统色 596-鹅黄"></a>
</p>

<p align="center">
  <a href="images/597-霜华.png"><img src="thumbnails/color-card-597.jpg" width="180" alt="中国传统色 597-霜华"></a>
  <a href="images/598-粉色.png"><img src="thumbnails/color-card-598.jpg" width="180" alt="中国传统色 598-粉色"></a>
  <a href="images/599-天青.png"><img src="thumbnails/color-card-599.jpg" width="180" alt="中国传统色 599-天青"></a>
  <a href="images/600-天水碧.png"><img src="thumbnails/color-card-600.jpg" width="180" alt="中国传统色 600-天水碧"></a>
</p>

<p align="center">
  <a href="images/601-檀色.png"><img src="thumbnails/color-card-601.jpg" width="180" alt="中国传统色 601-檀色"></a>
  <a href="images/602-霜色.png"><img src="thumbnails/color-card-602.jpg" width="180" alt="中国传统色 602-霜色"></a>
  <a href="images/603-橙色.png"><img src="thumbnails/color-card-603.jpg" width="180" alt="中国传统色 603-橙色"></a>
  <a href="images/604-奶橙色.png"><img src="thumbnails/color-card-604.jpg" width="180" alt="中国传统色 604-奶橙色"></a>
</p>

<p align="center">
  <a href="images/605-黛绿.png"><img src="thumbnails/color-card-605.jpg" width="180" alt="中国传统色 605-黛绿"></a>
  <a href="images/606-勃艮第红.png"><img src="thumbnails/color-card-606.jpg" width="180" alt="中国传统色 606-勃艮第红"></a>
  <a href="images/607-朱砂红.png"><img src="thumbnails/color-card-607.jpg" width="180" alt="中国传统色 607-朱砂红"></a>
  <a href="images/608-朱墙.png"><img src="thumbnails/color-card-608.jpg" width="180" alt="中国传统色 608-朱墙"></a>
</p>

<p align="center">
  <a href="images/609-东方既白.png"><img src="thumbnails/color-card-609.jpg" width="180" alt="中国传统色 609-东方既白"></a>
  <a href="images/610-藕丝.png"><img src="thumbnails/color-card-610.jpg" width="180" alt="中国传统色 610-藕丝"></a>
  <a href="images/611-奶黄色.png"><img src="thumbnails/color-card-611.jpg" width="180" alt="中国传统色 611-奶黄色"></a>
  <a href="images/612-浅栗棕.png"><img src="thumbnails/color-card-612.jpg" width="180" alt="中国传统色 612-浅栗棕"></a>
</p>

<p align="center">
  <a href="images/613-浅绛.png"><img src="thumbnails/color-card-613.jpg" width="180" alt="中国传统色 613-浅绛"></a>
  <a href="images/614-缁.png"><img src="thumbnails/color-card-614.jpg" width="180" alt="中国传统色 614-缁"></a>
  <a href="images/615-緅.png"><img src="thumbnails/color-card-615.jpg" width="180" alt="中国传统色 615-緅"></a>
  <a href="images/616-缊.png"><img src="thumbnails/color-card-616.jpg" width="180" alt="中国传统色 616-缊"></a>
</p>

<p align="center">
  <a href="images/617-青组缨.png"><img src="thumbnails/color-card-617.jpg" width="180" alt="中国传统色 617-青组缨"></a>
  <a href="images/618-爵弁.png"><img src="thumbnails/color-card-618.jpg" width="180" alt="中国传统色 618-爵弁"></a>
  <a href="images/619-玄色.png"><img src="thumbnails/color-card-619.jpg" width="180" alt="中国传统色 619-玄色"></a>
  <a href="images/620-黛紫.png"><img src="thumbnails/color-card-620.jpg" width="180" alt="中国传统色 620-黛紫"></a>
</p>

<p align="center">
  <a href="images/621-浅肤色.png"><img src="thumbnails/color-card-621.jpg" width="180" alt="中国传统色 621-浅肤色"></a>
  <a href="images/622-海棠.png"><img src="thumbnails/color-card-622.jpg" width="180" alt="中国传统色 622-海棠"></a>
  <a href="images/623-黛青山.png"><img src="thumbnails/color-card-623.jpg" width="180" alt="中国传统色 623-黛青山"></a>
  <a href="images/624-银红.png"><img src="thumbnails/color-card-624.jpg" width="180" alt="中国传统色 624-银红"></a>
</p>

<p align="center">
  <a href="images/625-蓝色.png"><img src="thumbnails/color-card-625.jpg" width="180" alt="中国传统色 625-蓝色"></a>
  <a href="images/626-绛紫.png"><img src="thumbnails/color-card-626.jpg" width="180" alt="中国传统色 626-绛紫"></a>
  <a href="images/627-醋.png"><img src="thumbnails/color-card-627.jpg" width="180" alt="中国传统色 627-醋"></a>
  <a href="images/628-玄青.png"><img src="thumbnails/color-card-628.jpg" width="180" alt="中国传统色 628-玄青"></a>
</p>

<p align="center">
  <a href="images/629-霜叶红.png"><img src="thumbnails/color-card-629.jpg" width="180" alt="中国传统色 629-霜叶红"></a>
  <a href="images/630-竹月.png"><img src="thumbnails/color-card-630.jpg" width="180" alt="中国传统色 630-竹月"></a>
  <a href="images/631-银褐.png"><img src="thumbnails/color-card-631.jpg" width="180" alt="中国传统色 631-银褐"></a>
  <a href="images/632-荞麦.png"><img src="thumbnails/color-card-632.jpg" width="180" alt="中国传统色 632-荞麦"></a>
</p>

<p align="center">
  <a href="images/633-茶粉绿.png"><img src="thumbnails/color-card-633.jpg" width="180" alt="中国传统色 633-茶粉绿"></a>
  <a href="images/634-长春花蓝.png"><img src="thumbnails/color-card-634.jpg" width="180" alt="中国传统色 634-长春花蓝"></a>
  <a href="images/635-青骊.png"><img src="thumbnails/color-card-635.jpg" width="180" alt="中国传统色 635-青骊"></a>
  <a href="images/636-荞麦棕.png"><img src="thumbnails/color-card-636.jpg" width="180" alt="中国传统色 636-荞麦棕"></a>
</p>

<p align="center">
  <a href="images/637-纯衣.png"><img src="thumbnails/color-card-637.jpg" width="180" alt="中国传统色 637-纯衣"></a>
  <a href="images/638-緇.png"><img src="thumbnails/color-card-638.jpg" width="180" alt="中国传统色 638-緇"></a>
  <a href="images/639-纁裳.png"><img src="thumbnails/color-card-639.jpg" width="180" alt="中国传统色 639-纁裳"></a>
  <a href="images/640-韎韐.png"><img src="thumbnails/color-card-640.jpg" width="180" alt="中国传统色 640-韎韐"></a>
</p>

<p align="center">
  <a href="images/641-纁屦.png"><img src="thumbnails/color-card-641.jpg" width="180" alt="中国传统色 641-纁屦"></a>
  <a href="images/642-皮弁.png"><img src="thumbnails/color-card-642.jpg" width="180" alt="中国传统色 642-皮弁"></a>
  <a href="images/643-素衣.png"><img src="thumbnails/color-card-643.jpg" width="180" alt="中国传统色 643-素衣"></a>
  <a href="images/644-素积.png"><img src="thumbnails/color-card-644.jpg" width="180" alt="中国传统色 644-素积"></a>
</p>

<p align="center">
  <a href="images/645-缁带.png"><img src="thumbnails/color-card-645.jpg" width="180" alt="中国传统色 645-缁带"></a>
  <a href="images/646-素鞸.png"><img src="thumbnails/color-card-646.jpg" width="180" alt="中国传统色 646-素鞸"></a>
  <a href="images/647-白屦.png"><img src="thumbnails/color-card-647.jpg" width="180" alt="中国传统色 647-白屦"></a>
  <a href="images/648-缁絇繶纯.png"><img src="thumbnails/color-card-648.jpg" width="180" alt="中国传统色 648-缁絇繶纯"></a>
</p>

<p align="center">
  <a href="images/649-黄裳.png"><img src="thumbnails/color-card-649.jpg" width="180" alt="中国传统色 649-黄裳"></a>
  <a href="images/650-青絇繶纯.png"><img src="thumbnails/color-card-650.jpg" width="180" alt="中国传统色 650-青絇繶纯"></a>
  <a href="images/651-浅灰蓝.png"><img src="thumbnails/color-card-651.jpg" width="180" alt="中国传统色 651-浅灰蓝"></a>
  <a href="images/652-官绿.png"><img src="thumbnails/color-card-652.jpg" width="180" alt="中国传统色 652-官绿"></a>
</p>

<p align="center">
  <a href="images/653-明黄.png"><img src="thumbnails/color-card-653.jpg" width="180" alt="中国传统色 653-明黄"></a>
  <a href="images/654-玉青.png"><img src="thumbnails/color-card-654.jpg" width="180" alt="中国传统色 654-玉青"></a>
  <a href="images/655-暖灰.png"><img src="thumbnails/color-card-655.jpg" width="180" alt="中国传统色 655-暖灰"></a>
  <a href="images/656-墨色.png"><img src="thumbnails/color-card-656.jpg" width="180" alt="中国传统色 656-墨色"></a>
</p>

<p align="center">
  <a href="images/657-宝蓝.png"><img src="thumbnails/color-card-657.jpg" width="180" alt="中国传统色 657-宝蓝"></a>
  <a href="images/658-帝王紫.png"><img src="thumbnails/color-card-658.jpg" width="180" alt="中国传统色 658-帝王紫"></a>
  <a href="images/659-暗金.png"><img src="thumbnails/color-card-659.jpg" width="180" alt="中国传统色 659-暗金"></a>
  <a href="images/660-灰橙色.png"><img src="thumbnails/color-card-660.jpg" width="180" alt="中国传统色 660-灰橙色"></a>
</p>

<p align="center">
  <a href="images/661-茜红.png"><img src="thumbnails/color-card-661.jpg" width="180" alt="中国传统色 661-茜红"></a>
  <a href="images/662-烟蓝.png"><img src="thumbnails/color-card-662.jpg" width="180" alt="中国传统色 662-烟蓝"></a>
  <a href="images/663-落霞.png"><img src="thumbnails/color-card-663.jpg" width="180" alt="中国传统色 663-落霞"></a>
  <a href="images/664-纁色.png"><img src="thumbnails/color-card-664.jpg" width="180" alt="中国传统色 664-纁色"></a>
</p>

<p align="center">
  <a href="images/665-緅色.png"><img src="thumbnails/color-card-665.jpg" width="180" alt="中国传统色 665-緅色"></a>
  <a href="images/666-雾霾蓝.png"><img src="thumbnails/color-card-666.jpg" width="180" alt="中国传统色 666-雾霾蓝"></a>
  <a href="images/667-浅薄荷绿.png"><img src="thumbnails/color-card-667.jpg" width="180" alt="中国传统色 667-浅薄荷绿"></a>
  <a href="images/668-丁香紫.png"><img src="thumbnails/color-card-668.jpg" width="180" alt="中国传统色 668-丁香紫"></a>
</p>

<p align="center">
  <a href="images/669-烟粉.png"><img src="thumbnails/color-card-669.jpg" width="180" alt="中国传统色 669-烟粉"></a>
  <a href="images/670-灰粉.png"><img src="thumbnails/color-card-670.jpg" width="180" alt="中国传统色 670-灰粉"></a>
  <a href="images/671-棉花糖白.png"><img src="thumbnails/color-card-671.jpg" width="180" alt="中国传统色 671-棉花糖白"></a>
  <a href="images/672-金棕.png"><img src="thumbnails/color-card-672.jpg" width="180" alt="中国传统色 672-金棕"></a>
</p>

<p align="center">
  <a href="images/673-复方甘草.png"><img src="thumbnails/color-card-673.jpg" width="180" alt="中国传统色 673-复方甘草"></a>
  <a href="images/674-天际灰.png"><img src="thumbnails/color-card-674.jpg" width="180" alt="中国传统色 674-天际灰"></a>
  <a href="images/675-藕粉.png"><img src="thumbnails/color-card-675.jpg" width="180" alt="中国传统色 675-藕粉"></a>
  <a href="images/676-紫藤萝.png"><img src="thumbnails/color-card-676.jpg" width="180" alt="中国传统色 676-紫藤萝"></a>
</p>

<p align="center">
  <a href="images/677-浅紫藤萝.png"><img src="thumbnails/color-card-677.jpg" width="180" alt="中国传统色 677-浅紫藤萝"></a>
  <a href="images/678-粉紫藤萝.png"><img src="thumbnails/color-card-678.jpg" width="180" alt="中国传统色 678-粉紫藤萝"></a>
  <a href="images/679-白雪藤.png"><img src="thumbnails/color-card-679.jpg" width="180" alt="中国传统色 679-白雪藤"></a>
  <a href="images/680-凝脂莲青.png"><img src="thumbnails/color-card-680.jpg" width="180" alt="中国传统色 680-凝脂莲青"></a>
</p>

<p align="center">
  <a href="images/681-焦绿.png"><img src="thumbnails/color-card-681.jpg" width="180" alt="中国传统色 681-焦绿"></a>
  <a href="images/682-奶油白.png"><img src="thumbnails/color-card-682.jpg" width="180" alt="中国传统色 682-奶油白"></a>
  <a href="images/683-浅豆绿.png"><img src="thumbnails/color-card-683.jpg" width="180" alt="中国传统色 683-浅豆绿"></a>
  <a href="images/684-茉莉白.png"><img src="thumbnails/color-card-684.jpg" width="180" alt="中国传统色 684-茉莉白"></a>
</p>

<p align="center">
  <a href="images/685-芝麻黑.png"><img src="thumbnails/color-card-685.jpg" width="180" alt="中国传统色 685-芝麻黑"></a>
  <a href="images/686-流黄.png"><img src="thumbnails/color-card-686.jpg" width="180" alt="中国传统色 686-流黄"></a>
  <a href="images/687-柠檬绿.png"><img src="thumbnails/color-card-687.jpg" width="180" alt="中国传统色 687-柠檬绿"></a>
  <a href="images/688-青绿.png"><img src="thumbnails/color-card-688.jpg" width="180" alt="中国传统色 688-青绿"></a>
</p>

<p align="center">
  <a href="images/689-木色.png"><img src="thumbnails/color-card-689.jpg" width="180" alt="中国传统色 689-木色"></a>
  <a href="images/690-高级灰.png"><img src="thumbnails/color-card-690.jpg" width="180" alt="中国传统色 690-高级灰"></a>
  <a href="images/691-云峰灰.png"><img src="thumbnails/color-card-691.jpg" width="180" alt="中国传统色 691-云峰灰"></a>
  <a href="images/692-檀香紫.png"><img src="thumbnails/color-card-692.jpg" width="180" alt="中国传统色 692-檀香紫"></a>
</p>

<p align="center">
  <a href="images/693-松烟墨.png"><img src="thumbnails/color-card-693.jpg" width="180" alt="中国传统色 693-松烟墨"></a>
  <a href="images/694-杏子.png"><img src="thumbnails/color-card-694.jpg" width="180" alt="中国传统色 694-杏子"></a>
  <a href="images/695-霁蓝.png"><img src="thumbnails/color-card-695.jpg" width="180" alt="中国传统色 695-霁蓝"></a>
  <a href="images/696-靛蓝.png"><img src="thumbnails/color-card-696.jpg" width="180" alt="中国传统色 696-靛蓝"></a>
</p>

<p align="center">
  <a href="images/697-玫红色.png"><img src="thumbnails/color-card-697.jpg" width="180" alt="中国传统色 697-玫红色"></a>
  <a href="images/698-新绿.png"><img src="thumbnails/color-card-698.jpg" width="180" alt="中国传统色 698-新绿"></a>
  <a href="images/699-杏子灰.png"><img src="thumbnails/color-card-699.jpg" width="180" alt="中国传统色 699-杏子灰"></a>
  <a href="images/700-玉色.png"><img src="thumbnails/color-card-700.jpg" width="180" alt="中国传统色 700-玉色"></a>
</p>

<p align="center">
  <a href="images/701-霜地.png"><img src="thumbnails/color-card-701.jpg" width="180" alt="中国传统色 701-霜地"></a>
  <a href="images/702-黛绿色.png"><img src="thumbnails/color-card-702.jpg" width="180" alt="中国传统色 702-黛绿色"></a>
  <a href="images/703-茜裙.png"><img src="thumbnails/color-card-703.jpg" width="180" alt="中国传统色 703-茜裙"></a>
  <a href="images/704-黛色.png"><img src="thumbnails/color-card-704.jpg" width="180" alt="中国传统色 704-黛色"></a>
</p>

<p align="center">
  <a href="images/705-松花绿.png"><img src="thumbnails/color-card-705.jpg" width="180" alt="中国传统色 705-松花绿"></a>
  <a href="images/706-灰色.png"><img src="thumbnails/color-card-706.jpg" width="180" alt="中国传统色 706-灰色"></a>
  <a href="images/707-白色.png"><img src="thumbnails/color-card-707.jpg" width="180" alt="中国传统色 707-白色"></a>
  <a href="images/708-马尔斯绿.png"><img src="thumbnails/color-card-708.jpg" width="180" alt="中国传统色 708-马尔斯绿"></a>
</p>

<p align="center">
  <a href="images/709-藕丝秋半.png"><img src="thumbnails/color-card-709.jpg" width="180" alt="中国传统色 709-藕丝秋半"></a>
  <a href="images/710-浅蓝.png"><img src="thumbnails/color-card-710.jpg" width="180" alt="中国传统色 710-浅蓝"></a>
  <a href="images/711-湘蓝.png"><img src="thumbnails/color-card-711.jpg" width="180" alt="中国传统色 711-湘蓝"></a>
  <a href="images/712-荔色.png"><img src="thumbnails/color-card-712.jpg" width="180" alt="中国传统色 712-荔色"></a>
</p>

<p align="center">
  <a href="images/713-鸦青色.png"><img src="thumbnails/color-card-713.jpg" width="180" alt="中国传统色 713-鸦青色"></a>
  <a href="images/714-杏粉.png"><img src="thumbnails/color-card-714.jpg" width="180" alt="中国传统色 714-杏粉"></a>
  <a href="images/715-浅杏粉.png"><img src="thumbnails/color-card-715.jpg" width="180" alt="中国传统色 715-浅杏粉"></a>
  <a href="images/716-米白.png"><img src="thumbnails/color-card-716.jpg" width="180" alt="中国传统色 716-米白"></a>
</p>

<p align="center">
  <a href="images/717-梨花白.png"><img src="thumbnails/color-card-717.jpg" width="180" alt="中国传统色 717-梨花白"></a>
  <a href="images/718-荠麦绿.png"><img src="thumbnails/color-card-718.jpg" width="180" alt="中国传统色 718-荠麦绿"></a>
  <a href="images/719-蓼蓝青.png"><img src="thumbnails/color-card-719.jpg" width="180" alt="中国传统色 719-蓼蓝青"></a>
  <a href="images/720-胭脂泪.png"><img src="thumbnails/color-card-720.jpg" width="180" alt="中国传统色 720-胭脂泪"></a>
</p>

<p align="center">
  <a href="images/721-藕荷色.png"><img src="thumbnails/color-card-721.jpg" width="180" alt="中国传统色 721-藕荷色"></a>
  <a href="images/722-杏子阴.png"><img src="thumbnails/color-card-722.jpg" width="180" alt="中国传统色 722-杏子阴"></a>
  <a href="images/723-浅苋菜紫.png"><img src="thumbnails/color-card-723.jpg" width="180" alt="中国传统色 723-浅苋菜紫"></a>
  <a href="images/724-社红配.png"><img src="thumbnails/color-card-724.jpg" width="180" alt="中国传统色 724-社红配"></a>
</p>

<p align="center">
  <a href="images/725-猩红.png"><img src="thumbnails/color-card-725.jpg" width="180" alt="中国传统色 725-猩红"></a>
  <a href="images/726-莺儿.png"><img src="thumbnails/color-card-726.jpg" width="180" alt="中国传统色 726-莺儿"></a>
  <a href="images/727-青蓝.png"><img src="thumbnails/color-card-727.jpg" width="180" alt="中国传统色 727-青蓝"></a>
  <a href="images/728-苍筤.png"><img src="thumbnails/color-card-728.jpg" width="180" alt="中国传统色 728-苍筤"></a>
</p>

<p align="center">
  <a href="images/729-汉绣绿.png"><img src="thumbnails/color-card-729.jpg" width="180" alt="中国传统色 729-汉绣绿"></a>
  <a href="images/730-汉绣红.png"><img src="thumbnails/color-card-730.jpg" width="180" alt="中国传统色 730-汉绣红"></a>
  <a href="images/731-藕丝秋.png"><img src="thumbnails/color-card-731.jpg" width="180" alt="中国传统色 731-藕丝秋"></a>
  <a href="images/732-墨绿.png"><img src="thumbnails/color-card-732.jpg" width="180" alt="中国传统色 732-墨绿"></a>
</p>

<p align="center">
  <a href="images/733-荼蘼白.png"><img src="thumbnails/color-card-733.jpg" width="180" alt="中国传统色 733-荼蘼白"></a>
  <a href="images/734-石青.png"><img src="thumbnails/color-card-734.jpg" width="180" alt="中国传统色 734-石青"></a>
  <a href="images/735-鎏金.png"><img src="thumbnails/color-card-735.jpg" width="180" alt="中国传统色 735-鎏金"></a>
  <a href="images/736-墨黑.png"><img src="thumbnails/color-card-736.jpg" width="180" alt="中国传统色 736-墨黑"></a>
</p>

<p align="center">
  <a href="images/737-藕丝秋色.png"><img src="thumbnails/color-card-737.jpg" width="180" alt="中国传统色 737-藕丝秋色"></a>
  <a href="images/738-胭脂晕.png"><img src="thumbnails/color-card-738.jpg" width="180" alt="中国传统色 738-胭脂晕"></a>
  <a href="images/739-鸦黄.png"><img src="thumbnails/color-card-739.jpg" width="180" alt="中国传统色 739-鸦黄"></a>
  <a href="images/740-翠青.png"><img src="thumbnails/color-card-740.jpg" width="180" alt="中国传统色 740-翠青"></a>
</p>

<p align="center">
  <a href="images/741-青黛.png"><img src="thumbnails/color-card-741.jpg" width="180" alt="中国传统色 741-青黛"></a>
  <a href="images/742-深绿.png"><img src="thumbnails/color-card-742.jpg" width="180" alt="中国传统色 742-深绿"></a>
</p>

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

[![Star History Chart](https://api.star-history.com/svg?repos=nevertoday/zhongguo-traditional-colors&type=Date)](https://www.star-history.com/#nevertoday/zhongguo-traditional-colors&Date)

## 数据说明

图片文件统一按 `NNN-颜色名.png` 命名，编号与 [原始 742 色清单](docs/chinese-color-master-list.md) 保持一致。当前图片与清单一一对应，共 742 张高清 PNG 色卡。

## 项目结构

```text
images/       高清 PNG 原图，共 742 张
thumbnails/   README 预览缩略图，共 742 张
docs/         README 使用的项目说明图片
assets/       静态站点样式、脚本和图片清单
skills/       面向设计实战的中国传统色 Agent Skills
scripts/      图片清单、README 和打包脚本
downloads/    本地生成的下载压缩包，不建议提交到 Git
```

## 快速开始

本项目是静态站点，克隆后可以直接启动本地服务器：

```bash
npm run manifest
npm run readme
npm run start
```

然后访问：

```text
http://localhost:5173
```

也可以直接部署到 GitHub Pages。完整 ZIP 通过 Release 附件分发；浏览器备用打包需要通过本地服务器或线上静态站访问，不建议直接用 `file://` 打开。

## 更新图片清单

新增、删除或替换 `images/` 中的图片后，运行：

```bash
npm run manifest
npm run readme
```

这会重新生成 `assets/data/images.js` 和 README 图廊。新增图片时请同时补充对应 `thumbnails/` 缩略图，并保持 `NNN-颜色名.png` 的命名格式。

## 支持作者

这个传统色图片合集会继续保持免费开源。如果它帮你省了整理素材的时间，欢迎 Star、分享给需要的人，或者扫描下面的二维码打赏小小东一点算力，让他继续优化这份开放色库。反馈和 issue 同样有帮助。

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
    <td align="center" width="220">
      <img src="docs/images/buy-me-a-coffee-qr.png" alt="通过 Buy Me a Coffee 请小小东喝咖啡的二维码" width="180"><br>
      <strong>请喝咖啡</strong>
    </td>
  </tr>
</table>

## 联系作者

可以通过作者 X 主页联系：[@xiaoxiaodong01](https://x.com/xiaoxiaodong01)。

## 贡献

欢迎提交 Issue 或 Pull Request。新增色卡、修正色值、补充来源、优化页面和完善文档都很有价值。开始前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

本项目使用 [MIT License](LICENSE) 开源。

请注意：传统色色值在不同资料、屏幕、印刷和材质中可能存在差异。本项目提供的是开放整理和学习资料，实际生产使用前应结合媒介校验。
