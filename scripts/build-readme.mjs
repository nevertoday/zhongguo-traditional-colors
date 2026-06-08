import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const manifestPath = path.join(root, "assets/data/images.js");
const columns = 4;
const siteUrl = "https://nevertoday.github.io/zhongguo-traditional-colors/";
const repoUrl = "https://github.com/nevertoday/zhongguo-traditional-colors";
const releaseUrl = `${repoUrl}/releases/tag/v0.1.0`;
const masterListPath = "docs/chinese-color-master-list.md";
const harmonyCsvPath = "docs/chinese-color-harmony.csv";
const authorUrl = "https://x.com/xiaoxiaodong01";

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

function languageSwitch(current) {
  const links = {
    zh: current === "zh" ? "简体中文" : "[简体中文](README.md)",
    en: current === "en" ? "English" : "[English](README.en.md)",
    ja: current === "ja" ? "日本語" : "[日本語](README.ja.md)",
  };

  return `${links.zh} | ${links.en} | ${links.ja}`;
}

function renderZh(project, images) {
  const totalMb = Math.round(project.totalBytes / 1024 / 1024);
  const zipUrl = `${repoUrl}/releases/latest/download/${project.archiveName}`;

  return `# 中国传统配色

${languageSwitch("zh")}

如果你在做设计、写内容、做课件、搭建网页主题，常常需要一套稳妥、好看、能直接使用的中国色参考，这个仓库就是为这件事整理的。

这里收录 ${project.count} 张中华传统色高清色卡，已按原始 742 色清单完整覆盖。每张色卡包含色名、HEX、RGB、CMYK、配色推荐和气质关键词。你可以在线浏览，也可以直接下载已经打包好的 ZIP，把它当作自己的传统色素材库。

## 快速入口

- [在线浏览色卡](${siteUrl})
- [直接下载完整 ZIP](${zipUrl})
- [查看 Release](${releaseUrl})
- [原始 742 色清单](${masterListPath})
- [742 色配色关系 CSV](${harmonyCsvPath})
- [作者 X 主页](${authorUrl})

## 这个项目能帮你什么

| 你需要 | 这里提供 |
| --- | --- |
| 快速找中国色参考 | ${project.count} 张高清 PNG 色卡 |
| 做设计和内容配图 | 可直接点击下载原图 |
| 搭建色彩资料库 | 文件名与 742 色清单一一对应 |
| 做网页、PPT、海报、课程素材 | README 全量预览，ZIP 一次下载 |
| 校对色名和色值 | 色名、HEX、RGB、CMYK 集中整理 |

原图约 ${totalMb} MB。ZIP 文件作为 GitHub Release 附件提供，不直接提交进仓库。

## 全部色卡

下面是完整 742 色预览，点击任意一张可以打开高清 PNG 原图。

<!-- gallery:start -->
${galleryRows(images, "zh")}

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

## 数据说明

图片文件统一按 \`NNN-颜色名.png\` 命名，编号与 [原始 742 色清单](${masterListPath}) 保持一致。当前图片与清单一一对应，共 ${project.count} 张高清 PNG 色卡。

## 项目结构

\`\`\`text
images/       高清 PNG 原图，共 ${project.count} 张
thumbnails/   README 预览缩略图，共 ${project.count} 张
docs/         README 使用的项目说明图片
assets/       静态站点样式、脚本和图片清单
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

这会重新生成 \`assets/data/images.js\` 和 README 图廊。新增图片时请同时补充对应 \`thumbnails/\` 缩略图，并保持 \`NNN-颜色名.png\` 的命名格式。

## 支持作者

这个传统色图片合集会继续保持免费开源。如果它帮你省了整理素材的时间，欢迎 Star、分享给需要的人，或者扫描下面的二维码打赏小小东一点算力，让他继续优化这份开放色库。反馈和 issue 同样有帮助。

<img src="docs/images/buy-me-a-coffee-qr.png" alt="赞赏小小东的二维码" width="220">

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

  return `# Chinese Traditional Colors

${languageSwitch("en")}

This repository is a practical archive for designers, educators, writers, front-end developers, and anyone who needs a reliable Chinese color reference that can be used immediately.

It contains ${project.count} high-resolution Chinese traditional color cards, aligned with the original 742-color list. Each card preserves the color name, HEX, RGB, CMYK, palette guidance, and mood keywords. Browse online, download individual images, or download the complete ZIP package from GitHub Releases.

## Quick Links

- [Browse the online gallery](${siteUrl})
- [Download the complete ZIP](${zipUrl})
- [View the Release](${releaseUrl})
- [Original 742-color list](${masterListPath})
- [742-color harmony CSV](${harmonyCsvPath})
- [Author on X](${authorUrl})

## What This Project Gives You

| Need | Provided here |
| --- | --- |
| A fast Chinese color reference | ${project.count} high-resolution PNG color cards |
| Visual material for design and content | Direct image preview and single-card download |
| A local color asset library | Filenames aligned with the 742-color source list |
| Web, slide, poster, and teaching assets | Full README preview plus one-click ZIP download |
| Color name and value checking | Centralized names, HEX, RGB, and CMYK references |

The original image set is about ${totalMb} MB. The ZIP is distributed as a GitHub Release asset instead of being committed to the repository.

## Full Gallery

The preview below includes all 742 colors. Click any card to open the high-resolution PNG.

<!-- gallery:start -->
${galleryRows(images, "en")}

<!-- gallery:end -->

## Why This Exists

Chinese traditional color references are scattered across the web. When making real work, people often still need to collect images, copy values, compare names, and organize files by hand. This project removes that repeated setup work so the archive can be used directly in design, teaching, writing, product UI, and open-data experiments.

Traditional colors are not only color values. They connect with craft, dyeing, mineral pigments, poetry, seasonal imagery, objects, and aesthetic order. Presenting them as browsable cards makes them easier to feel, compare, remember, and reuse.

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

This archive remains free and open source. If it saves you time, a Star, a share, a useful issue, or a small contribution toward compute for 小小东 all help the project keep improving.

<img src="docs/images/buy-me-a-coffee-qr.png" alt="Support 小小东 QR code" width="220">

## License

This project is released under the [MIT License](LICENSE).

Note: Traditional color values may vary across sources, screens, print processes, and materials. Treat this archive as an open reference and verify colors for production use.
`;
}

function renderJa(project, images) {
  const totalMb = Math.round(project.totalBytes / 1024 / 1024);
  const zipUrl = `${repoUrl}/releases/latest/download/${project.archiveName}`;

  return `# 中国伝統色

${languageSwitch("ja")}

このリポジトリは、デザイン、教材、記事、Web テーマ、文化研究でそのまま使える中国伝統色の資料アーカイブです。

${project.count} 枚の高解像度カラーカードを収録し、元の 742 色リストと対応させています。各カードには色名、HEX、RGB、CMYK、配色の参考、雰囲気のキーワードをまとめています。オンラインで閲覧でき、個別画像も完全 ZIP もダウンロードできます。

## クイックリンク

- [オンラインギャラリーを見る](${siteUrl})
- [完全 ZIP をダウンロード](${zipUrl})
- [Release を見る](${releaseUrl})
- [元の 742 色リスト](${masterListPath})
- [742 色配色 CSV](${harmonyCsvPath})
- [作者の X](${authorUrl})

## このプロジェクトでできること

| 目的 | 提供内容 |
| --- | --- |
| 中国色の参考をすばやく探す | ${project.count} 枚の高解像度 PNG カード |
| デザインや記事素材に使う | 画像プレビューと単体ダウンロード |
| ローカルの色資料庫を作る | 742 色リストに対応したファイル名 |
| Web、スライド、ポスター、教材に使う | README の全量プレビューと ZIP 一括ダウンロード |
| 色名と色値を確認する | 色名、HEX、RGB、CMYK の整理済みリファレンス |

元画像は約 ${totalMb} MB です。ZIP は GitHub Release の添付ファイルとして配布し、リポジトリ本体には含めていません。

## 全カラーギャラリー

以下は 742 色すべてのプレビューです。画像をクリックすると高解像度 PNG を開けます。

<!-- gallery:start -->
${galleryRows(images, "ja")}

<!-- gallery:end -->

## なぜ作ったのか

中国伝統色の資料は多く存在しますが、実際に制作で使うときには、画像を探し、色値を写し、名前を照合し、ファイルを整理する作業が何度も発生します。このプロジェクトはその準備作業をあらかじめ済ませ、デザイナー、教師、コンテンツ制作者、開発者がすぐに使える資料としてまとめています。

伝統色は単なる色値ではなく、器物、染織、鉱物顔料、詩歌、季節感、審美の秩序とも結びついています。カードとして並べることで、表だけでは見えにくい感覚や比較がしやすくなります。

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

このアーカイブは無料かつオープンソースで公開し続けます。役に立った場合は Star、共有、Issue、または小小東の継続的な改善に向けた算力支援が励みになります。

<img src="docs/images/buy-me-a-coffee-qr.png" alt="小小東を支援する QR コード" width="220">

## ライセンス

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。

注意：伝統色の色値は資料、画面、印刷、素材によって差が出る場合があります。このアーカイブはオープンな参考資料として利用し、実制作では媒体に合わせて確認してください。
`;
}

const { project, images } = await loadManifest();
await fs.writeFile(path.join(root, "README.md"), renderZh(project, images), "utf8");
await fs.writeFile(path.join(root, "README.en.md"), renderEn(project, images), "utf8");
await fs.writeFile(path.join(root, "README.ja.md"), renderJa(project, images), "utf8");
console.log(`Wrote ${project.count} images to README.md, README.en.md, README.ja.md`);
