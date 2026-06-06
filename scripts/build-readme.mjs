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

一个面向设计、内容创作和前端开发的中华传统色图片库。仓库目前收录 ${project.count} 张高清色卡，已按原始 742 色清单完整覆盖，每张色卡都包含色名、HEX、RGB、CMYK、配色推荐和气质关键词。

README 下方完整展示全部缩略图，点击任意色卡可以打开高清 PNG 原图。需要一次性下载时，可以直接使用 Release 里的 ZIP 图片包。

## 快速入口

- [在线浏览色卡](https://nevertoday.github.io/zhongguo-traditional-colors/)
- [下载全部高清图片 ZIP](https://github.com/nevertoday/zhongguo-traditional-colors/releases/latest/download/${project.archiveName})
- [完整图片包 Release 下载](https://github.com/nevertoday/zhongguo-traditional-colors/releases/tag/v0.1.0)
- [原始 742 色清单](docs/chinese-color-master-list.md)
- [缺失颜色报告](docs/missing-colors.md)
- [作者 X 主页](https://x.com/xiaoxiaodong01)

## 当前状态

| 项目 | 数量 |
| --- | ---: |
| 原始颜色清单 | 742 |
| 已展示高清色卡 | ${project.count} |
| README 缩略图 | ${project.count} |
| 缺失颜色 | 0 |
| 重复覆盖 | 0 |

原图约 ${totalMb} MB。ZIP 文件作为 GitHub Release 附件提供，不直接提交进仓库。

## 全部色卡

<!-- gallery:start -->
${galleryRows(images)}

<!-- gallery:end -->

## 项目定位

中国传统色不只是一组漂亮色值，也连接着器物、织染、矿物颜料、诗词意象、节气物候和审美秩序。这个仓库把这些颜色整理成可浏览、可下载、可引用的开放素材，方便直接用于设计参考、教学演示、内容配图和前端项目。

适合用于：

- 设计灵感、品牌配色、界面主题和视觉实验
- 传统文化、色彩教育、美术教学和内容创作
- 前端项目、素材站、颜色工具和开放数据整理
- 色名、色值、配色关系和视觉语气校勘

## 数据说明

图片文件统一按 \`NNN-颜色名.png\` 命名，编号与 [原始 742 色清单](docs/chinese-color-master-list.md) 保持一致。当前审计结果为 742 张图片、742 个唯一颜色、0 个缺失、0 个重复，详细记录见 [缺失颜色报告](docs/missing-colors.md)。

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

这个传统色图片合集会继续保持免费开源。如果它帮你节省了整理、参考和使用传统色卡的时间，也愿意支持后续维护，可以扫描下面的 Buy Me a Coffee 二维码请作者喝杯咖啡。反馈、Star 和 issue 同样有帮助。

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
