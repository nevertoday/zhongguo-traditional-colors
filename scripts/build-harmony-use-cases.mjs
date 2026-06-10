import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const imagesPath = path.join(root, "assets/data/images.js");
const harmoniesPath = path.join(root, "assets/data/harmonies.js");
const usagePath = path.join(root, "assets/data/harmony-usage.js");
const csvOutPath = path.join(root, "docs/chinese-color-harmony-use-cases.csv");
const markdownOutPath = path.join(root, "docs/chinese-color-harmony-use-cases.md");

const relationKeys = [
  "same",
  "analogous",
  "complementary",
  "splitComplementary",
  "triadic",
  "tetradic",
  "temperatureContrast",
  "lighter",
  "darker",
  "grayTone",
  "neutral",
];

function loadBrowserData(source, filename) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename });
  return sandbox.window;
}

function colorTitle(image) {
  return image.file.replace(/\.[^.]+$/, "");
}

function colorName(image) {
  return colorTitle(image).replace(/^\d{3}-/, "");
}

function labelColor(id, imageById) {
  const image = imageById.get(id);
  if (!image) return id;
  return `${image.id}-${colorName(image)} ${image.hex}`;
}

function listLabels(ids, imageById) {
  return ids.map((id) => labelColor(id, imageById)).join(" | ");
}

function lightnessLabel(lightness) {
  if (lightness >= 82) return "高明度";
  if (lightness >= 62) return "中高明度";
  if (lightness >= 42) return "中明度";
  if (lightness >= 26) return "中低明度";
  return "低明度";
}

function saturationLabel(saturation) {
  if (saturation >= 72) return "高饱和";
  if (saturation >= 42) return "中饱和";
  if (saturation >= 18) return "低饱和";
  return "近中性";
}

function anchorRole(key) {
  const roles = {
    same: "整套视觉的母色或系列识别色",
    analogous: "主视觉气质色，关系色负责柔和过渡",
    complementary: "主要识别色，互补色只放在必须被看见的位置",
    splitComplementary: "稳定主色，分裂互补色承担辅助强调和视觉装饰",
    triadic: "系列母色，其他三角色分配给栏目、章节或分类",
    tetradic: "复杂系统的主色，其他色先分配为辅色、状态色和结构色",
    temperatureContrast: "情绪基准色，另一侧色温负责制造对照",
    lighter: "识别色或标题色，明色关系色优先做背景和留白",
    darker: "气质来源色，暗色关系色优先做标题、正文和边界",
    grayTone: "识别色，灰调关系色负责降低噪声和承托信息",
    neutral: "主视觉色，中性色负责结构、留白和阅读秩序",
  };

  return roles[key] || "主色";
}

function anchorUseText(image, harmony, usage, relationColors, imageById) {
  const hsl = harmony.hsl || {};
  const tone = [
    harmony.hueFamily,
    harmony.temperature,
    Number.isFinite(hsl.l) ? lightnessLabel(hsl.l) : "",
    Number.isFinite(hsl.s) ? saturationLabel(hsl.s) : "",
  ].filter(Boolean).join("、");
  const samples = relationColors.slice(0, 3).map((id) => labelColor(id, imageById)).join(" / ");
  const relationTip = samples
    ? `本组可优先试 ${samples}，先小面积验证，再决定是否扩大。`
    : "当前关系色不足时，先用主色和中性色建立基础版面。";

  return `${colorTitle(image)} 属于 ${tone || "当前传统色"}。在「${usage.label}」里，建议把它作为${anchorRole(usage.key)}。${relationTip}`;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function csvRow(values) {
  return values.map(csvCell).join(",");
}

function markdownCell(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", "<br>");
}

function usageMatrix(usageList) {
  return [
    "| 配色逻辑 | 适合方向 | 典型场景 | 面积建议 | 风险提醒 |",
    "| --- | --- | --- | --- | --- |",
    ...usageList.map((usage) => `| ${markdownCell(`${usage.label} / ${usage.intent}`)} | ${markdownCell(usage.direction)} | ${markdownCell(usage.scenarios)} | ${markdownCell(usage.area)} | ${markdownCell(usage.risk)} |`),
  ].join("\n");
}

const [imagesSource, harmoniesSource, usageSource] = await Promise.all([
  fs.readFile(imagesPath, "utf8"),
  fs.readFile(harmoniesPath, "utf8"),
  fs.readFile(usagePath, "utf8"),
]);

const images = loadBrowserData(imagesSource, imagesPath).TRADITIONAL_COLOR_IMAGES || [];
const harmonies = loadBrowserData(harmoniesSource, harmoniesPath).TRADITIONAL_COLOR_HARMONIES || {};
const usageMap = loadBrowserData(usageSource, usagePath).TRADITIONAL_COLOR_HARMONY_USAGE || {};
const imageById = new Map(images.map((image) => [image.id, image]));
const usageList = relationKeys
  .map((key) => ({ key, ...usageMap[key] }))
  .filter((usage) => usage.label);

const headers = [
  "编号",
  "色名",
  "HEX",
  "H",
  "S",
  "L",
  "色相分类",
  "冷暖属性",
  "配色逻辑",
  "配色意图",
  "适合方向",
  "典型场景",
  "设计师用法",
  "普通人理解",
  "面积建议",
  "风险提醒",
  "交付物",
  "检查步骤",
  "推荐关系色",
  "当前色落地建议",
  "算法依据",
  "数据来源",
];

const rows = [csvRow(headers)];

for (const image of images.filter((item) => item.hex)) {
  const harmony = harmonies[image.id];
  if (!harmony) continue;

  for (const usage of usageList) {
    const relationColors = harmony[usage.key] || [];
    rows.push(csvRow([
      image.id,
      colorName(image),
      image.hex,
      harmony.hsl?.h ?? "",
      harmony.hsl?.s ?? "",
      harmony.hsl?.l ?? "",
      harmony.hueFamily,
      harmony.temperature,
      usage.label,
      usage.intent,
      usage.direction,
      usage.scenarios,
      usage.designerUse,
      usage.plainUse,
      usage.area,
      usage.risk,
      usage.deliverable,
      usage.checklist,
      listLabels(relationColors, imageById),
      anchorUseText(image, harmony, usage, relationColors, imageById),
      usage.method,
      "assets/data/harmonies.js + assets/data/harmony-usage.js",
    ]));
  }
}

const markdown = [
  "# 中国传统色配色用途说明",
  "",
  "这份说明由 `scripts/build-harmony-use-cases.mjs` 自动生成，和 `docs/chinese-color-harmony-use-cases.csv` 使用同一套用途数据。",
  "",
  "CSV 覆盖每个中国传统色与每一种配色逻辑：同类、邻近、互补、分裂互补、三角、四角、冷暖、明色、暗色、灰调、中性。每行都包含适合方向、典型场景、设计师用法、普通人理解、面积建议、风险提醒和当前色落地建议。",
  "",
  `- 颜色数量：${images.filter((item) => item.hex).length}`,
  `- 配色逻辑：${usageList.length}`,
  `- 表格行数：${rows.length - 1}`,
  "",
  "## 配色逻辑用途矩阵",
  "",
  usageMatrix(usageList),
  "",
  "## 使用方式",
  "",
  "1. 先在 CSV 中找到目标色名或编号。",
  "2. 再按“配色逻辑”筛选同类、互补、灰调等方向。",
  "3. 读取“当前色落地建议”和“面积建议”，决定哪些色用于背景、标题、正文、按钮或点缀。",
  "4. 如果要直接做图，请从“推荐关系色”中复制 1 到 3 个色值，先做小样验证可读性。",
  "",
].join("\n");

await fs.writeFile(csvOutPath, `${rows.join("\n")}\n`, "utf8");
await fs.writeFile(markdownOutPath, `${markdown}\n`, "utf8");

console.log(`Wrote ${rows.length - 1} use-case rows to ${path.relative(root, csvOutPath)} and ${path.relative(root, markdownOutPath)}`);
