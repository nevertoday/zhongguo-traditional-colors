import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const manifestPath = path.join(root, "assets/data/images.js");
const csvOutPath = path.join(root, "docs/chinese-color-harmony.csv");
const markdownOutPath = path.join(root, "docs/chinese-color-harmony.md");
const browserDataOutPath = path.join(root, "assets/data/harmonies.js");

function loadManifestSource(source) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: manifestPath });
  return sandbox.window.TRADITIONAL_COLOR_IMAGES || [];
}

function colorTitle(image) {
  return image.file.replace(/\.[^.]+$/, "");
}

function colorName(image) {
  return colorTitle(image).replace(/^\d{3}-/, "");
}

function rgbFromHex(hex) {
  const match = hex?.match(/^#?([0-9a-f]{6})$/i);
  if (!match) return null;
  const value = match[1];
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function hslFromRgb({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === red) hue = ((green - blue) / delta) % 6;
    if (max === green) hue = (blue - red) / delta + 2;
    if (max === blue) hue = (red - green) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function pivotRgb(value) {
  const normalized = value / 255;
  return normalized > 0.04045
    ? ((normalized + 0.055) / 1.055) ** 2.4
    : normalized / 12.92;
}

function labFromRgb({ r, g, b }) {
  const red = pivotRgb(r);
  const green = pivotRgb(g);
  const blue = pivotRgb(b);

  const x = (red * 0.4124564) + (green * 0.3575761) + (blue * 0.1804375);
  const y = (red * 0.2126729) + (green * 0.7151522) + (blue * 0.072175);
  const z = (red * 0.0193339) + (green * 0.119192) + (blue * 0.9503041);

  const normalize = (value, reference) => {
    const ratio = value / reference;
    return ratio > 0.008856 ? Math.cbrt(ratio) : (7.787 * ratio) + (16 / 116);
  };

  const fx = normalize(x, 0.95047);
  const fy = normalize(y, 1);
  const fz = normalize(z, 1.08883);

  return {
    l: (116 * fy) - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

function labDistance(first, second) {
  return Math.sqrt(
    ((first.l - second.l) ** 2) +
    ((first.a - second.a) ** 2) +
    ((first.b - second.b) ** 2),
  );
}

function hueDistance(first, second) {
  const diff = Math.abs((((first - second) % 360) + 360) % 360);
  return Math.min(diff, 360 - diff);
}

function hueAt(hue, offset) {
  return (((hue + offset) % 360) + 360) % 360;
}

function hueFamily({ h, s }) {
  if (s < 12) return "中性色";
  if (h < 15 || h >= 345) return "红色系";
  if (h < 45) return "橙色系";
  if (h < 75) return "黄色系";
  if (h < 155) return "绿色系";
  if (h < 195) return "青色系";
  if (h < 255) return "蓝色系";
  if (h < 315) return "紫色系";
  return "红色系";
}

function temperature({ h, s }) {
  if (s < 12) return "中性";
  return h < 80 || h >= 330 ? "暖" : "冷";
}

function labelColor(color) {
  return `${color.id}-${color.name} ${color.hex}`;
}

function listLabels(colors) {
  return colors.map(labelColor).join(" | ");
}

function byScore(base, candidates, score, count) {
  const seen = new Set();
  return candidates
    .filter((item) => item.id !== base.id)
    .map((item) => ({ item, score: score(item) }))
    .filter(({ item }) => {
      if (seen.has(item.hex)) return false;
      seen.add(item.hex);
      return true;
    })
    .sort((first, second) => first.score - second.score || first.item.id.localeCompare(second.item.id))
    .slice(0, count)
    .map(({ item }) => item);
}

function targetHueColors(base, colors, targets, count, options = {}) {
  const { preferLightness = base.hsl.l, preferSaturation = base.hsl.s, minSaturation = 0 } = options;
  return byScore(base, colors.filter((item) => item.hsl.s >= minSaturation), (item) => {
    const hueScore = Math.min(...targets.map((target) => hueDistance(item.hsl.h, target))) * 2.8;
    const lightScore = Math.abs(item.hsl.l - preferLightness) * 0.72;
    const saturationScore = Math.abs(item.hsl.s - preferSaturation) * 0.38;
    const perceptualScore = labDistance(base.lab, item.lab) * 0.14;
    return hueScore + lightScore + saturationScore + perceptualScore;
  }, count);
}

function balancedTargetHueColors(base, colors, targetOffsets, count, options = {}) {
  const { preferLightness = base.hsl.l, preferSaturation = base.hsl.s, minSaturation = 0 } = options;
  const targets = targetOffsets.map((offset) => hueAt(base.hsl.h, offset));
  const selected = [];

  const addUnique = (items) => {
    const selectedIds = new Set(selected.map((item) => item.id));
    const selectedHexes = new Set(selected.map((item) => item.hex));
    for (const item of items) {
      if (selected.length >= count) break;
      if (selectedIds.has(item.id) || selectedHexes.has(item.hex)) continue;
      selected.push(item);
      selectedIds.add(item.id);
      selectedHexes.add(item.hex);
    }
  };

  const scoreAgainst = (targetsForScore) => (item) => {
    const hueScore = Math.min(...targetsForScore.map((target) => hueDistance(item.hsl.h, target))) * 2.8;
    const lightScore = Math.abs(item.hsl.l - preferLightness) * 0.72;
    const saturationScore = Math.abs(item.hsl.s - preferSaturation) * 0.38;
    const perceptualScore = labDistance(base.lab, item.lab) * 0.14;
    return hueScore + lightScore + saturationScore + perceptualScore;
  };

  const pool = colors.filter((item) => item.id !== base.id && item.hsl.s >= minSaturation);
  const perTarget = Math.max(1, Math.floor(count / targets.length));

  for (const target of targets) {
    addUnique(byScore(base, pool, scoreAgainst([target]), perTarget));
  }

  if (selected.length < count) {
    const selectedIds = new Set(selected.map((item) => item.id));
    addUnique(byScore(base, pool.filter((item) => !selectedIds.has(item.id)), scoreAgainst(targets), count - selected.length));
  }

  return selected.slice(0, count);
}

function fallbackFill(base, colors, selected, count) {
  if (selected.length >= count) return selected.slice(0, count);
  const selectedIds = new Set(selected.map((item) => item.id));
  const fallback = byScore(base, colors.filter((item) => !selectedIds.has(item.id)), (item) => labDistance(base.lab, item.lab), count - selected.length);
  return [...selected, ...fallback].slice(0, count);
}

function sameColors(base, colors) {
  const pool = base.hsl.s < 12
    ? colors.filter((item) => item.hsl.s < 16)
    : colors.filter((item) => item.hsl.s >= 12 && hueDistance(item.hsl.h, base.hsl.h) <= 16);
  return fallbackFill(base, colors, byScore(base, pool, (item) => {
    return labDistance(base.lab, item.lab) +
      (Math.abs(item.hsl.l - base.hsl.l) * 0.5) +
      (Math.abs(item.hsl.s - base.hsl.s) * 0.32);
  }, 3), 3);
}

function analogousColors(base, colors) {
  if (base.hsl.s < 12) return sameColors(base, colors);
  return balancedTargetHueColors(base, colors, [-30, 30], 4, { minSaturation: 8 });
}

function complementaryColors(base, colors) {
  return targetHueColors(base, colors, [hueAt(base.hsl.h, 180)], 3, {
    minSaturation: base.hsl.s < 12 ? 8 : 12,
  });
}

function splitComplementaryColors(base, colors) {
  return balancedTargetHueColors(base, colors, [150, 210], 4, {
    minSaturation: base.hsl.s < 12 ? 8 : 12,
  });
}

function triadicColors(base, colors) {
  return balancedTargetHueColors(base, colors, [120, 240], 4, {
    minSaturation: base.hsl.s < 12 ? 8 : 12,
  });
}

function tetradicColors(base, colors) {
  return balancedTargetHueColors(base, colors, [90, 180, 270], 4, {
    minSaturation: base.hsl.s < 12 ? 8 : 12,
  });
}

function temperatureContrastColors(base, colors) {
  const baseTemperature = temperature(base.hsl);
  const pool = baseTemperature === "暖"
    ? colors.filter((item) => temperature(item.hsl) === "冷")
    : baseTemperature === "冷"
      ? colors.filter((item) => temperature(item.hsl) === "暖")
      : colors.filter((item) => item.hsl.s >= 20);

  return byScore(base, pool, (item) => {
    const contrastHue = baseTemperature === "中性" ? 0 : -hueDistance(item.hsl.h, base.hsl.h) * 0.2;
    return Math.abs(item.hsl.l - base.hsl.l) * 0.82 +
      Math.abs(item.hsl.s - Math.max(base.hsl.s, 28)) * 0.28 +
      labDistance(base.lab, item.lab) * 0.16 +
      contrastHue;
  }, 3);
}

function lighterColors(base, colors) {
  const pool = colors.filter((item) => item.hsl.l > base.hsl.l + 10);
  return fallbackFill(base, colors, byScore(base, pool, (item) => {
    return hueDistance(item.hsl.h, base.hsl.h) * 0.9 +
      Math.abs(item.hsl.s - base.hsl.s) * 0.28 +
      Math.abs((item.hsl.l - base.hsl.l) - 22) * 0.7;
  }, 3), 3);
}

function darkerColors(base, colors) {
  const pool = colors.filter((item) => item.hsl.l < base.hsl.l - 10);
  return fallbackFill(base, colors, byScore(base, pool, (item) => {
    return hueDistance(item.hsl.h, base.hsl.h) * 0.9 +
      Math.abs(item.hsl.s - base.hsl.s) * 0.28 +
      Math.abs((base.hsl.l - item.hsl.l) - 24) * 0.7;
  }, 3), 3);
}

function grayToneColors(base, colors) {
  const pool = colors.filter((item) => item.hsl.s <= Math.min(30, Math.max(12, base.hsl.s - 12)));
  return fallbackFill(base, colors, byScore(base, pool, (item) => {
    return Math.abs(item.hsl.l - base.hsl.l) * 0.9 +
      hueDistance(item.hsl.h, base.hsl.h) * 0.18 +
      item.hsl.s * 0.28 +
      labDistance(base.lab, item.lab) * 0.08;
  }, 3), 3);
}

function neutralColors(base, colors) {
  const pool = colors.filter((item) => item.hsl.s < 14);
  return fallbackFill(base, colors, byScore(base, pool, (item) => {
    return Math.abs(item.hsl.l - base.hsl.l) * 0.9 +
      labDistance(base.lab, item.lab) * 0.2;
  }, 3), 3);
}

function roleColors(base, colors, groups) {
  const secondaryPool = [
    ...groups.analogous,
    ...groups.same,
    ...groups.neutral,
    ...groups.lighter,
    ...groups.darker,
  ];
  const accentPool = [
    ...groups.complementary,
    ...groups.splitComplementary,
    ...groups.triadic,
    ...groups.temperatureContrast,
  ];

  const secondary = byScore(base, secondaryPool, (item) => {
    return Math.abs(item.hsl.l - base.hsl.l) * 0.45 +
      Math.abs(item.hsl.s - base.hsl.s) * 0.25 +
      labDistance(base.lab, item.lab) * 0.12;
  }, 2);
  const accent = byScore(base, accentPool, (item) => {
    return -hueDistance(item.hsl.h, base.hsl.h) * 0.38 +
      Math.abs(item.hsl.l - 52) * 0.28 +
      Math.max(0, 42 - item.hsl.s) * 0.65;
  }, 2);

  return {
    secondary: fallbackFill(base, colors, secondary, 2),
    accent: fallbackFill(base, colors, accent, 2),
  };
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function csvRow(values) {
  return values.map(csvCell).join(",");
}

function markdownCell(value) {
  return String(value ?? "")
    .replaceAll(" | ", "<br>")
    .replaceAll("|", "\\|")
    .replaceAll("\n", "<br>");
}

function markdownTable(rows) {
  return [
    "| 配色逻辑 | 推荐传统色 |",
    "| --- | --- |",
    ...rows.map(([label, value]) => `| ${markdownCell(label)} | ${markdownCell(value)} |`),
  ].join("\n");
}

function markdownForHarmonies(harmonies) {
  const lines = [
    "# 中国传统色配色方案",
    "",
    "这份 Markdown 由 `scripts/build-color-harmonies.mjs` 自动生成，和 `chinese-color-harmony.csv` 使用同一套数据。",
    "",
    "每个颜色都只从当前 742 个中国传统色中推导搭配关系；算法按 HSL 色相角度建立关系，再用 Lab 感知距离、明度与饱和度排序，中性色按低饱和逻辑处理。",
    "",
    "## 快速说明",
    "",
    "- 同类色：色相接近或低饱和中性色相近的颜色。",
    "- 邻近色：色相角约在左右 30 度附近的颜色。",
    "- 互补色：色相角约 180 度的对照颜色。",
    "- 分裂互补：互补色左右两侧的颜色。",
    "- 三角色：色相角约 120 度、240 度的颜色。",
    "- 四角色：色相角约 90 度、180 度、270 度的颜色。",
    "- 冷暖、明暗、灰调、中性色：分别按色温、明度、低饱和灰调和中性色逻辑筛选。",
    "- 主辅点缀：以当前色为主色，给出更适合组合使用的辅助色和点缀色。",
    "",
    "## 颜色索引",
    "",
    harmonies.map((item) => `- [${item.id} ${item.name} ${item.hex}](#${item.anchor})`).join("\n"),
    "",
  ];

  for (const item of harmonies) {
    lines.push(
      `## ${item.id} ${item.name} ${item.hex}`,
      "",
      `- 色相：H ${item.hsl.h} / S ${item.hsl.s} / L ${item.hsl.l}`,
      `- 分类：${item.hueFamily}`,
      `- 冷暖：${item.temperature}`,
      "",
      markdownTable([
        ["同类色", item.same],
        ["邻近色", item.analogous],
        ["互补色", item.complementary],
        ["分裂互补", item.splitComplementary],
        ["三角色", item.triadic],
        ["四角色", item.tetradic],
        ["冷暖对照", item.temperatureContrast],
        ["明色搭配", item.lighter],
        ["暗色搭配", item.darker],
        ["灰调搭配", item.grayTone],
        ["中性色搭配", item.neutral],
        ["主色", item.main],
        ["辅色", item.secondary],
        ["点缀色", item.accent],
        ["主辅点缀方案", item.rolePlan],
      ]),
      "",
    );
  }

  while (lines.at(-1) === "") lines.pop();
  return `${lines.join("\n")}\n`;
}

function browserColor(color) {
  return color.id;
}

function browserDataForHarmonies(harmonies) {
  const compact = Object.fromEntries(harmonies.map((item) => [item.id, item.browser]));
  return [
    "/* Generated by scripts/build-color-harmonies.mjs. Do not edit by hand. */",
    `window.TRADITIONAL_COLOR_HARMONIES=${JSON.stringify(compact)};`,
    "",
  ].join("\n");
}

const manifest = await fs.readFile(manifestPath, "utf8");
const images = loadManifestSource(manifest);
const colors = images
  .filter((image) => image.hex)
  .map((image) => {
    const rgb = rgbFromHex(image.hex);
    const hsl = hslFromRgb(rgb);
    return {
      id: image.id,
      name: colorName(image),
      hex: image.hex.toUpperCase(),
      file: image.file,
      path: image.path,
      rgb,
      hsl,
      lab: labFromRgb(rgb),
    };
  });

const headers = [
  "编号",
  "色名",
  "HEX",
  "H",
  "S",
  "L",
  "色相分类",
  "冷暖属性",
  "同类色",
  "邻近色",
  "互补色",
  "分裂互补",
  "三角色",
  "四角色",
  "冷暖对照",
  "明色搭配",
  "暗色搭配",
  "灰调搭配",
  "中性色搭配",
  "主色",
  "辅色",
  "点缀色",
  "主辅点缀方案",
  "算法说明",
];

const rows = [csvRow(headers)];
const harmonies = [];

for (const base of colors) {
  const groups = {
    same: sameColors(base, colors),
    analogous: analogousColors(base, colors),
    complementary: complementaryColors(base, colors),
    splitComplementary: splitComplementaryColors(base, colors),
    triadic: triadicColors(base, colors),
    tetradic: tetradicColors(base, colors),
    temperatureContrast: temperatureContrastColors(base, colors),
    lighter: lighterColors(base, colors),
    darker: darkerColors(base, colors),
    grayTone: grayToneColors(base, colors),
    neutral: neutralColors(base, colors),
  };
  const roles = roleColors(base, colors, groups);
  const main = labelColor(base);
  const secondary = listLabels(roles.secondary);
  const accent = listLabels(roles.accent);
  const item = {
    id: base.id,
    name: base.name,
    hex: base.hex,
    hsl: base.hsl,
    hueFamily: hueFamily(base.hsl),
    temperature: temperature(base.hsl),
    same: listLabels(groups.same),
    analogous: listLabels(groups.analogous),
    complementary: listLabels(groups.complementary),
    splitComplementary: listLabels(groups.splitComplementary),
    triadic: listLabels(groups.triadic),
    tetradic: listLabels(groups.tetradic),
    temperatureContrast: listLabels(groups.temperatureContrast),
    lighter: listLabels(groups.lighter),
    darker: listLabels(groups.darker),
    grayTone: listLabels(groups.grayTone),
    neutral: listLabels(groups.neutral),
    main,
    secondary,
    accent,
    rolePlan: `主色：${main}；辅色：${secondary}；点缀色：${accent}`,
    note: "基于真实 742 色库；按 HSL 色相角度推导关系，再用 Lab 感知距离、明度与饱和度排序；中性色按低饱和逻辑处理",
    anchor: `${base.id}-${base.name.toLowerCase()}-${base.hex.replace("#", "").toLowerCase()}`,
    browser: {
      id: base.id,
      name: base.name,
      hex: base.hex,
      hsl: base.hsl,
      hueFamily: hueFamily(base.hsl),
      temperature: temperature(base.hsl),
      note: "基于真实 742 色库推导，按 HSL 色相、Lab 感知距离、明度与饱和度排序。",
      same: groups.same.map(browserColor),
      analogous: groups.analogous.map(browserColor),
      complementary: groups.complementary.map(browserColor),
      splitComplementary: groups.splitComplementary.map(browserColor),
      triadic: groups.triadic.map(browserColor),
      tetradic: groups.tetradic.map(browserColor),
      temperatureContrast: groups.temperatureContrast.map(browserColor),
      lighter: groups.lighter.map(browserColor),
      darker: groups.darker.map(browserColor),
      grayTone: groups.grayTone.map(browserColor),
      neutral: groups.neutral.map(browserColor),
      secondary: roles.secondary.map(browserColor),
      accent: roles.accent.map(browserColor),
    },
  };
  harmonies.push(item);

  rows.push(csvRow([
    item.id,
    item.name,
    item.hex,
    item.hsl.h,
    item.hsl.s,
    item.hsl.l,
    item.hueFamily,
    item.temperature,
    item.same,
    item.analogous,
    item.complementary,
    item.splitComplementary,
    item.triadic,
    item.tetradic,
    item.temperatureContrast,
    item.lighter,
    item.darker,
    item.grayTone,
    item.neutral,
    item.main,
    item.secondary,
    item.accent,
    item.rolePlan,
    item.note,
  ]));
}

await fs.writeFile(csvOutPath, `${rows.join("\n")}\n`, "utf8");
await fs.writeFile(markdownOutPath, markdownForHarmonies(harmonies), "utf8");
await fs.writeFile(browserDataOutPath, browserDataForHarmonies(harmonies), "utf8");
console.log(`Wrote ${colors.length} harmony rows to ${path.relative(root, csvOutPath)}, ${path.relative(root, markdownOutPath)} and ${path.relative(root, browserDataOutPath)}`);
