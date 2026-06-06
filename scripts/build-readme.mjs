import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const manifestPath = path.join(root, "assets/data/images.js");
const readmePath = path.join(root, "README.md");
const columns = 4;

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

function galleryRows(images) {
  const rows = [];

  for (let index = 0; index < images.length; index += columns) {
    const rowImages = images.slice(index, index + columns);
    const links = rowImages
      .map((image) => {
        const thumb = `thumbnails/color-card-${image.id}.jpg`;
        const title = image.file.replace(/\.[^.]+$/, "");
        const alt = `中国传统色 ${title}`;
        return `  <a href="${image.path}"><img src="${thumb}" width="180" alt="${alt}"></a>`;
      })
      .join("\n");

    rows.push(`<p align="center">\n${links}\n</p>`);
  }

  return rows.join("\n\n");
}

function renderReadme(project, images) {
  const totalMb = Math.round(project.totalBytes / 1024 / 1024);

  return `# 中国传统配色

如果你在做设计、写内容、做课件、搭建网页主题，常常需要一套稳妥、好看、能直接使用的中国色参考，这个仓库就是为这件事整理的。

这里收录 ${project.count} 张中华传统色高清色卡，已按原始 742 色清单完整覆盖。每张色卡包含色名、HEX、RGB、CMYK、配色推荐和气质关键词。你可以在线浏览，也可以下载 ZIP，把它当作自己的传统色素材库。

## 快速入口

- [在线浏览色卡](https://nevertoday.github.io/zhongguo-traditional-colors/)
- [下载全部高清图片 ZIP](https://github.com/nevertoday/zhongguo-traditional-colors/releases/latest/download/${project.archiveName})
- [完整图片包 Release 下载](https://github.com/nevertoday/zhongguo-traditional-colors/releases/tag/v0.1.0)
- [原始 742 色清单](docs/chinese-color-master-list.md)
- [作者 X 主页](https://x.com/xiaoxiaodong01)

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
${galleryRows(images)}

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

图片文件统一按 \`NNN-颜色名.png\` 命名，编号与 [原始 742 色清单](docs/chinese-color-master-list.md) 保持一致。当前图片与清单一一对应，共 ${project.count} 张高清 PNG 色卡。

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

也可以直接部署到 GitHub Pages。为了让浏览器端 ZIP 打包正常读取图片，请通过本地服务器或线上静态站访问，不建议直接用 \`file://\` 打开。

## 更新图片清单

新增、删除或替换 \`images/\` 中的图片后，运行：

\`\`\`bash
npm run manifest
npm run readme
\`\`\`

这会重新生成 \`assets/data/images.js\` 和 README 图廊。新增图片时请同时补充对应 \`thumbnails/\` 缩略图，并保持 \`NNN-颜色名.png\` 的命名格式。

## 支持作者

这个传统色图片合集会继续保持免费开源。如果它帮你省了整理素材的时间，欢迎 Star、分享给需要的人，或者扫描下面的 Buy Me a Coffee 二维码请作者喝杯咖啡。反馈和 issue 同样有帮助。

<img src="docs/images/buy-me-a-coffee-qr.png" alt="Buy Me a Coffee 支持二维码" width="220">

## 联系作者

可以通过作者 X 主页联系：[@xiaoxiaodong01](https://x.com/xiaoxiaodong01)。

## 贡献

欢迎提交 Issue 或 Pull Request。新增色卡、修正色值、补充来源、优化页面和完善文档都很有价值。开始前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

本项目使用 [MIT License](LICENSE) 开源。

请注意：传统色色值在不同资料、屏幕、印刷和材质中可能存在差异。本项目提供的是开放整理和学习资料，实际生产使用前应结合媒介校验。
`;
}

const { project, images } = await loadManifest();
await fs.writeFile(readmePath, renderReadme(project, images), "utf8");
