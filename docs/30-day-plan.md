<!-- 30 天执行计划 · 由战略文档(docs/product-strategy.md)拆解 · 2026-06-17 -->

# 中国传统色 · 30 天执行计划

> 目标里程碑：**飞轮第一次转起来。**
> daily-color-playground 接通真数据 + 进导航/sitemap/收藏，能一键导出字体正确的 PNG/SVG 卡（带水印回链）；skills 安装文档上线；稳定主键债还清；关键动作可度量。
>
> 原则：**冻结新工具。** 只做"出图 + 接通 playground + skills 装得起来 + 还主键债 + 可度量"五件事，把飞轮闭环。

依赖链总览：

```
C1 主键表 ──▶ C2 join守卫
   │           C3 CMYK入数据层 ──▶ A1 SVG卡 ──▶ A2 字体子集 ──▶ A3 导出 ──▶ A5 进站
   │                                  └────────▶ A4 接真数据 ──────────────┘
X1 埋点(随A3/B2落地)                 B1 安装文档(无依赖) · B2 复制提示词
```

---

## 执行状态总览（更新于 2026-06-17）

图例：✅ 已完成并提交 ｜ 🟦 部分完成 ｜ ⏸ 待浏览器验收 ｜ ⛔ 阻塞（缺工具/数据）｜ ⤵ 推迟

| 任务 | 状态 | commit / 说明 |
|---|---|---|
| **C1** 稳定主键表 + 去本机路径 | ✅ | `9e15f68` — id 从文件名前缀取；输出逐字节等价 |
| **C2** fail-loud join + verify 脚本 | ✅ | `9e15f68` — 改名/null hex 精确报错并 exit 1 |
| **C3** CMYK 落数据层（抽共享 util） | 🟦 | C3a CMYK 入数据层 ✅ `d4da4ce`；C3b 抽共享 util ⤵ 推迟（实为 7 文件全站重构，需浏览器回归） |
| **A1** SVG 卡片渲染器 | 🟦 | build-time 身份证卡 ✅ `ecff189`（名/HEX/RGB/CMYK/真实配色搭档）；交互三版式卡 ⏸ 待浏览器 |
| **A2** 中文字体子集化 | ⛔ | 环境无 `pyftsubset`/`fonttools`/`subset-font`，需先装工具 |
| **A3** PNG/SVG 一键导出 | ⏸ | 需浏览器验收视觉与字体 |
| **A4** playground 接真数据 | ⏸ | 需浏览器验收 |
| **A5** playground 进站 | ⏸ | 需浏览器验收 |
| **B1** skills 三语安装文档 | ✅ | `5f3b9fc` — README×3 + skills.html，shared-chrome 校验过 |
| **B2** 复制提示词按钮 | ⏸ | 改 3 个主力交互工具 JS，需浏览器回归 |
| **X1** Plausible 自定义事件 | ⏸ | 依赖 A3/B2 |
| **CI** 产物一致性守卫 | ✅ | `e0bcb40` — 漂移即 fail；顺带修复资产版本漂移 bug |

**已闭环**：地基周（C1/C2/C3a）+ 分发（B1）+ 出图地基（A1 build-time）+ CI。6 个 commit 全部在本地分支 `dev_foundation-stable-keys`，未 push、未开 PR。

**解锁剩余 A 线需要的输入**（用户决策项）：① 安装字体子集化工具（A2）；② 提供/确认拼音数据来源（"身份证"拼音）；③ 浏览器验收交互卡视觉（A3/A4/A5/B2）。这些是纯静态站在自动循环里无法自验证的部分。

---

## 第 1 周 — 地基（不先做，后面织的考据/SEO 全会随文件改名静默错位）

### ✅ C1 · master-list 升级为结构化主键表 + 去本机路径
> **状态：已完成 `9e15f68`。** 实现取舍：id 改从文件名 `NNN-` 前缀取（稳定键），join 改为按位 + 校验名一致；输出逐字节等价。
- **做什么**：`docs/chinese-color-master-list.md` 从纯文本升级为结构化（`stableId · 色名 · HEX · pinyin`），色 id 不再依赖目录中文排序动态生成。顺手把第 5 行作者本机绝对路径 `/Users/admin/Desktop/...` 换成仓库内相对说明。
- **文件**：`docs/chinese-color-master-list.md`、`scripts/build-manifest.mjs`、`scripts/organize-color-images.mjs`
- **验收**：每个色有稳定 id；重跑构建后 `assets/data/images.js` 等产物内容等价（回归通过）。
- **工作量**：M ｜ **依赖**：无

### ✅ C2 · join 失败从「静默 null」改为「构建失败」+ verify-manifest-join.mjs
> **状态：已完成 `9e15f68`。** 已测试：改名→build 报 `name drift No.011` exit 1；null hex→verify 报错 exit 1。已纳入 `prepare:release`。
- **做什么**：当前 HEX 靠"文件名色名 == master-list 色名"字符串精确匹配，匹配不上时 `hex=null` 静默无告警。改为构建期直接 fail，并仿现有 28 个 `verify-*.mjs` 写一个 `verify-manifest-join.mjs` 纳入 CI 前置。
- **文件**：`scripts/build-manifest.mjs`、`scripts/verify-manifest-join.mjs`(新)、`package.json`
- **验收**：故意改错一个色卡文件名 → 构建报错并指出是哪个色 join 失败。
- **工作量**：S ｜ **依赖**：C1

### 🟦 C3 · CMYK 落数据层（抽共享 util，兑现 README 承诺）
> **状态：部分完成。** C3a CMYK 落数据层 ✅ `d4da4ce`（与前端公式逐位一致，verify 校验一致性）。C3b 抽共享 util ⤵ 推迟——`rgbFromHex/hslFromRgb/cmykFromRgb` 实际重复在 **7 个**浏览器模块里（多在 IIFE 内有意封装），抽取是全站重构、纯静态站无法回归验证，不在自动循环里冒险。
- **做什么**：把 `app.js`/`dictionary.js` 中重复的 `cmykFromRgb` 抽进 `color-core.js`，构建期把 CMYK 算进 `images.js` 数据，兑现 README "每张色卡含 CMYK"。
- **文件**：`assets/js/color-core.js`、`assets/js/app.js`、`assets/js/dictionary.js`、`scripts/build-manifest.mjs`、`assets/data/images.js`(产物)
- **验收**：色卡详情的 CMYK 取自数据层而非前端现算；无重复实现。
- **工作量**：S–M ｜ **依赖**：C1

---

## 第 2 周 — 出图引擎（飞轮传播侧的总开关；全站当前零位图导出）

### 🟦 A1 · SVG 卡片渲染器（单源，三版式）
> **状态：build-time 版已完成 `ecff189`。** 扩展了已有 `colors/cards/*.svg` 生成器为「传统色身份证」：名/色系冷暖/HEX/RGB/CMYK + 真实配色搭档色块（辅色+点缀，来自 harmony，provenance 吻合）；742 张 XML 良构。交互三版式卡（小红书/方形/公众号横版）⏸ 待浏览器验收。
- **做什么**：写共享模块 `share-card.js`，从一个色的数据生成 SVG 卡（小红书竖版 / 方形 / 公众号横版），与现成 `colors/cards/*.svg` 管线同构。**不要把 HTML/CSS 卡片画进 Canvas**（Canvas 画不了 DOM，会要手写持续漂移的平行排版引擎）。
- **文件**：`assets/js/share-card.js`(新)、对应 css
- **验收**：给定色号渲染出三版式 SVG，含 色名/拼音/HEX/RGB/CMYK/搭档/用法/水印。
- **工作量**：L ｜ **依赖**：C3

### ⛔ A2 · 中文字体子集化打包（防豆腐块）
> **状态：阻塞。** 环境无 `pyftsubset`/`fonttools`/`subset-font`，需先安装字体子集化工具。
- **做什么**：用 Noto Serif SC，子集化只保留 742 色名出现过的汉字 + 拼音/数字，打成 woff2 内联/打包；导出前 `await document.fonts.ready`。
- **文件**：`assets/fonts/`(新)、字体子集构建脚本
- **验收**：在不装中文字体的环境（CI / Windows）导出 PNG，色名字体正确、不出豆腐块。
- **工作量**：M ｜ **依赖**：A1

### ⏸ A3 · PNG / SVG 一键导出按钮组件
> **状态：待浏览器验收**（导出视觉与字体正确性需在浏览器里确认）。
- **做什么**：序列化 SVG → 浏览器 `canvas.drawImage` 渲染成 PNG 下载；同时提供 SVG 直接下载（设计师更爱矢量）。封装成可复用导出组件。
- **文件**：`assets/js/share-card.js`、导出按钮共享组件
- **验收**：点一下得到 PNG + SVG 两种下载，均含 `colors.xiaoxiaodong.ai` 水印（带 UTM）。
- **工作量**：M ｜ **依赖**：A1、A2

---

## 第 3 周 — 激活 daily-color-playground（把孤儿原型接进飞轮）

### ⏸ A4 · 接真实 742 数据，弃用硬编码
> **状态：待浏览器验收**（playground 是交互页，需浏览器验证）。数据层已就绪（images.js 现含 cmyk + 真实 harmony 搭档）。
- **做什么**：`daily-color-playground.html` 弃用 166 处硬编码 hex，改用 `assets/data/images.js` + `harmonies.js`；意象文案用 `confidence` 字段诚实处理（无考据则留白 / 标"民间色名"，**把诚实做成 IP 调性**）。
- **文件**：`daily-color-playground.html`
- **验收**：742 色全可选；配色搭档来自真实 harmony；无硬编码 hex。
- **工作量**：M ｜ **依赖**：A1

### ⏸ A5 · playground 进站（导航 + sitemap + 收藏 + 水印回链）
> **状态：待浏览器验收**（依赖 A3/A4）。
- **做什么**：接 `shared-chrome.js` 进主导航；加进 `sitemap.xml`（目前漏收=自废 SEO 入口）；接 `favorites-store.js` 可收藏今日色；导出图固定印水印回链。
- **文件**：`daily-color-playground.html`、`assets/js/shared-chrome.js`、`sitemap.xml`(或其构建)、`assets/js/favorites-store.js`
- **验收**：从主导航可进；sitemap 含该页；能收藏；导出图带 UTM 回链。配 `verify-*.mjs`。
- **工作量**：M ｜ **依赖**：A3、A4

---

## 第 4 周 — skills 装得起来 + 可度量 + 收尾

### ✅ B1 · skills 安装文档（看得到 → 装得上）
> **状态：已完成 `5f3b9fc`。** 三语 README（zh/en/ja，经 build-readme.mjs）+ skills.html 都加了 Claude Code 安装说明（`cp` 到 `~/.claude/skills/`）；不提 Cursor；shared-chrome 校验通过。
- **做什么**：`skills.html` 顶部 + 三语 README 加 Claude Code 安装说明（`SKILL.md` 本就是 Claude 原生格式，`cp` 到 `~/.claude/skills` 即可）。**诚实：不提 Cursor**（无 skill 安装机制）。
- **文件**：`skills.html`、`README.md/.zh-CN/.en/.ja`、`scripts/build-readme.mjs`
- **验收**：用户照做能装上任一 xxd skill 并成功触发。
- **工作量**：S ｜ **依赖**：无（可与第 1 周并行）

### ⏸ B2 · "复制提示词"按钮（站内选色 → 直通 AI 工作流）
> **状态：待浏览器验收**（改 3 个主力交互工具 JS，纯静态站无法回归验证）。
- **做什么**：`generator` / `palettes` / `theme-forge` 加按钮，把当前选中色拼成纯文本提示词（如"我选了这些传统色 [色名+HEX]，请用 /xxd-ui-token 帮我生成 token"）。纯 client-side。
- **文件**：`generator.js`、`palettes.js`、`theme-forge.js` + 共享 util
- **验收**：点击复制到剪贴板，有"已复制"反馈。
- **工作量**：S–M ｜ **依赖**：无

### ⏸ X1 · Plausible 自定义事件埋点（让飞轮转速可观测）
> **状态：待解锁**（依赖 A3/B2——要先有动作才有事件可埋）。
- **做什么**：Plausible 已装但只采 PV。给关键动作加 custom events：`export-png` / `export-svg` / `copy-prompt` / `favorite` / `theme-forge-export` / `terminal-export`。
- **文件**：埋点共享 util + 各工具 js（随 A3/A5/B2 落地）
- **验收**：Plausible 后台能看到各事件计数；可算"导出动作数 / 访问"。
- **工作量**：S ｜ **依赖**：A3、B2（要先有动作才有事件可埋）

### ✅ CI（可选，若时间允许）· GitHub Action 守产物一致性
> **状态：已完成 `e0bcb40`。** `.github/workflows/verify.yml`：重建所有确定性产物 + 漂移即 fail + 跑 verify/audit。顺带修复了一处真实的资产版本漂移 bug（build-color-pages 版本常量落后于已提交页面，重跑会静默回退 742 页）。已本地模拟通过。
- **做什么**：`.github/workflows` 加一个 action，PR 跑 `prepare:release` 非图部分 + 全部 `verify-*.mjs`，产物 drift 即 fail。保护本月地基工作，为后续社区贡献考据铺路。
- **文件**：`.github/workflows/verify.yml`(新)、`CONTRIBUTING.md`
- **验收**：改了数据但忘重跑构建的 PR 会被 CI 拦下。
- **工作量**：S–M ｜ **依赖**：C2

---

## 明确不在 30 天内（避免范围蔓延）

| 推后项 | 归属 | 为什么不在 30 天 |
|---|---|---|
| 配色体检卡（粘 HEX→WCAG→742 最近合规替换） | 90 天 D | 真差异化但工程量 L，要先把出图地基打好 |
| 文化考据数据层（带置信度策展层） | 90 天 E | 是内容工程不是代码工程，30–50 个 verified 色需人工策展 |
| 导出扩面 ASE / tokens.json | 90 天 F | ASE 是二进制大端格式，非"加 switch"，单独立项 |
| 收藏升级"工作台" / 系列识别色 / 图表配色器 | 储备 | 依赖出图能力先验证留存 |
| 跨端同步 / 账号 / 订阅（任何后端） | 验证留存后 | 与零运维冲突最大，先用前端 import/export 缓解 |

---

## 验收：月底飞轮转起来的信号

- 🟦 能从网页产出一张**印着色名/HEX/CMYK + 真实配色搭档 + 水印回链**的成品图——build-time 身份证卡已达成（`colors/cards/*.svg`）；交互版「可发小红书、字体不崩」待 A2/A3 浏览器验收。
- ✅ 用户能照文档**装上并触发**任一 xxd skill（B1）。
- ⏸ Plausible 能看到各类**导出/复制动作计数**（传播系数 K 可观测）——依赖 A3/B2（X1）。
- ✅ 改色卡文件名会被**构建/CI 拦下**，地基不再是流沙（C1/C2 + CI）。
