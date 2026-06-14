# SEO 说明与上线后操作

本项目的 SEO 资产由构建脚本自动生成，配合各页面的元信息标签。本文档说明结构、维护方式，以及上线后需要人工完成的一次性操作。

## 自动生成的内容

运行 `npm run colorpages`（已并入 `npm run prepare:release`）会生成：

- `colors/{编号}-{色名}.html` — 742 个颜色长尾页，每页含独立 `title` / `description` / `canonical` / Open Graph / Twitter Card / JSON-LD（BreadcrumbList + CreativeWork），以及指向相关颜色的内链网络。
- `colors/cards/{编号}.svg` — 每色一张 1200×630 分享卡（可作为社媒图或下载素材）。
- `sitemap.xml` — 7 个可索引主页面 + 742 个颜色页（共 749 条；`favorites.html` 因内容为本机收藏、对爬虫为空，已排除并标记 `noindex`）。

`robots.txt` 为静态文件，已声明 sitemap 位置。

数据更新（新增/重命名颜色）后，重新运行 `npm run colorpages && npm run verify:colorpages` 即可全量重建并校验。

## 各页面元信息

8 个主页面均已补齐 `canonical`、Open Graph、Twitter Card；首页额外带 `WebSite` + `SearchAction` JSON-LD（站内搜索框，指向 `dictionary.html?q=`，字典页已支持读取 `?q=` 预填搜索）。

## 上线后一次性操作（需账号权限，无法在仓库内完成）

1. **Google Search Console**
   - 打开 https://search.google.com/search-console ，添加资源 `https://colors.xiaoxiaodong.ai`。
   - 用 DNS（Cloudflare TXT 记录）或 HTML 标签验证域名所有权。
   - 在「站点地图」提交 `https://colors.xiaoxiaodong.ai/sitemap.xml`。

2. **Bing Webmaster Tools**
   - 打开 https://www.bing.com/webmasters ，可直接从 Google Search Console 导入，或手动提交同一 sitemap。

3. **Plausible 分析（可选但建议）**
   - 各页面已内置 Plausible 片段（`data-domain="colors.xiaoxiaodong.ai"`，无 Cookie、隐私友好）。
   - 需到 https://plausible.io 注册并添加该域名（或自建 Plausible 实例）后才会真正开始收集数据；在此之前该脚本不产生任何效果。
   - 若不打算使用，删除各页面 `<script defer data-domain=...>` 一行即可。

## 暂未启用：多语言 hreflang

README 有中/英/日三语，但站点页面目前仅中文。待出现真正的翻译页面后，再为对应页面加 `hreflang` 互链；在没有翻译页面时加 `hreflang` 反而有害，故当前不加。
