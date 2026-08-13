# Happy Hues 式中国传统配色单页演示开发文档

**目标：** 在 `palettes.html` 中实现一个 Happy Hues 式栏目：左侧是可滚动的中国传统配色列表，右侧是一条完整的网页示例。选择任意配色后，右侧网页里的背景、标题、正文、按钮、卡片、标签、边线和“本节用色”色值面板同步更新。

**重要修正：** 本版本不做多场景系统，不做 web / article / social / PPT / chart / brand tabs，不做场景收藏，也不在 URL 中维护 `scene`。只有一个网页 demo。

**参考结构：**
- 左侧：极简配色 swatch 色带 rail，不显示卡片标题和说明文字，当前项高亮，支持筛选结果同步。
- 右侧：中文长网页 demo，包含首屏、术语/角色、色相/明度/纯度知识、面积逻辑、规范/表单、页脚。
- 每个大段后面都有“本节用色”，展示角色名、色块、HEX，点击复制。

**TDD 规则：**
- 先写验证脚本，确认失败。
- 再改 HTML / JS / CSS。
- 每一轮完成后运行专项验证和语法检查。
- 最后用浏览器 smoke test 验证视觉结构与交互。

## 50 项开发任务

- [x] 01. 明确新范围：只做左侧配色 rail + 右侧单页网页 demo。
- [x] 02. 标记旧六场景方案为废弃，不再扩展。
- [x] 03. 抽取 Happy Hues 可迁移结构：左侧色板、右侧长页、重复 section hues。
- [x] 04. 重写结构验证脚本，要求 `palette-demo-shell`、`palette-demo-rail`、`palette-demo-page`。
- [x] 05. 结构验证脚本禁止场景 tabs、场景侧栏和 `CONTEXT_SCENES`。
- [x] 06. 重写角色模型验证脚本，要求 `DEMO_ROLES` 和 `demoRolesForPalette`。
- [x] 07. 重写单页验证脚本，要求 `renderPaletteDemoPage` 和多段 demo section。
- [x] 08. 重写复制验证脚本，要求 `copyDemoHue`、CSS、JSON、说明复制。
- [x] 09. 重写响应式验证脚本，要求两列桌面和移动单列。
- [x] 10. 运行专项脚本，确认 RED 失败指向旧多场景残留。
- [x] 11. HTML 中把 skip link 改到 `#palette-demo-preview`。
- [x] 12. 工具栏按钮从“实景预览”改为“配色演示”。
- [x] 13. `data-view-mode` 从 `context` 改为 `demo`。
- [x] 14. HTML 中删除场景 tabs 挂载点。
- [x] 15. HTML 中删除独立角色侧栏。
- [x] 16. HTML 中新增左侧 `data-demo-palette-list`。
- [x] 17. HTML 中新增右侧 `data-demo-page`。
- [x] 18. HTML 中新增 `data-demo-empty`。
- [x] 19. HTML 中新增 `data-demo-toast`。
- [x] 20. JS 中删除 `CONTEXT_SCENES`。
- [x] 21. JS 中删除 `currentContextScene` 状态。
- [x] 22. JS 中新增 `selectedDemoPaletteId` 状态。
- [x] 23. JS 中新增网页元素角色 `DEMO_ROLES`。
- [x] 24. JS 中保留对比度兜底，保证按钮文字可读。
- [x] 25. JS 中新增 `demoRatioForRelation`。
- [x] 26. JS 中新增 `demoUseCaseForPalette`。
- [x] 27. JS 中新增 `demoRolesForPalette`。
- [x] 28. JS 中新增 `demoRoleCssText`。
- [x] 29. JS 中新增 `renderDemoSectionHues`。
- [x] 30. JS 中新增 `renderPaletteDemoPage`。
- [x] 31. 右侧 demo 首屏展示导航、标题、正文、按钮和图形色块。
- [x] 32. 右侧 demo 第二段展示传统配色网页角色卡。
- [x] 33. 右侧 demo 第三段展示面积比例和风险提醒。
- [x] 34. 右侧 demo 第四段展示规范复制与表单样式。
- [x] 35. 每个大段后追加“本节用色”面板。
- [x] 36. Hue row 使用真实角色色、角色名和 HEX。
- [x] 37. 点击 hue row 复制对应 HEX。
- [x] 38. 复制 CSS 输出 `.traditional-palette-demo` 变量。
- [x] 39. 复制 JSON 输出 paletteId、anchor、relation、roles，不含 scene。
- [x] 40. 复制说明输出锚点色、关系、面积建议、判断依据和风险提醒。
- [x] 41. JS 中新增 `renderDemoPaletteRail`。
- [x] 42. JS 中新增 `selectDemoPalette`。
- [x] 43. 选中左侧配色后同步更新右侧整条网页 demo。
- [x] 44. 筛选、搜索、随机刷新时同步刷新左侧 demo rail。
- [x] 45. URL 状态改为 `view=demo&palette={id}`。
- [x] 46. 兼容旧 `view=context` 入口，但进入后按 demo 视图渲染。
- [x] 47. CSS 新增桌面两列布局。
- [x] 48. CSS 新增移动端单列和横向色板 rail。
- [x] 49. CSS 删除旧多场景相关选择器。
- [x] 50. 完成专项验证、语法检查、既有回归和浏览器 smoke test。

### Review 补充验收（2026-08-13）

- 演示模式隐藏重复的大标题区，首屏直接进入搜索、色板 rail 与中文网站样张。
- 桌面命令收敛为图标工具栏；移动端保持单行四命令，不再堆叠四个大按钮。
- 390px 视口实测 `scrollWidth === clientWidth`，工具栏、演示页和每个 section 均未越界。
- 左侧 rail 固定最多 72 组，每组严格 4 色；切换配色时页面滚动位置不变，URL 与标题同步更新。

## 验证命令

```bash
npm run verify:palette-context
node --check assets/js/palettes.js
node scripts/verify-palette-card-copy.mjs
node scripts/verify-search-debounce.mjs
node scripts/verify-shared-chrome.mjs
node scripts/verify-mobile-layout.mjs
npm run verify:seo
```

## 验收标准

- `palettes.html?view=demo` 显示左侧配色列表和右侧单条网页 demo。
- 左侧配色列表是极简色带按钮，可见区域不展示配色名称、HEX 或关系说明；这些信息只进入 `aria-label`。
- 右侧内容必须是中文知识型长页，覆盖色相、明度、纯度、留白、长期阅读和传统色名。
- 页面中没有场景 tab。
- JS 中没有 `CONTEXT_SCENES`、`currentContextScene` 或场景 renderer。
- CSS 中没有旧场景选择器。
- 选择左侧任意配色后，右侧所有段落和“本节用色”同步换色。
- 点击“本节用色”中的任意行能复制该角色色值。
