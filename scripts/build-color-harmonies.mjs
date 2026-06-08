import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const manifestPath = path.join(root, "assets/data/images.js");
const outPath = path.join(root, "docs/chinese-color-harmony.csv");

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
  return targetHueColors(base, colors, [hueAt(base.hsl.h, -30), hueAt(base.hsl.h, 30)], 4, { minSaturation: 8 });
}

function complementaryColors(base, colors) {
  return targetHueColors(base, colors, [hueAt(base.hsl.h, 180)], 3, {
    minSaturation: base.hsl.s < 12 ? 8 : 12,
  });
}

function splitComplementaryColors(base, colors) {
  return targetHueColors(base, colors, [hueAt(base.hsl.h, 150), hueAt(base.hsl.h, 210)], 4, {
    minSaturation: base.hsl.s < 12 ? 8 : 12,
  });
}

function triadicColors(base, colors) {
  return targetHueColors(base, colors, [hueAt(base.hsl.h, 120), hueAt(base.hsl.h, 240)], 4, {
    minSaturation: base.hsl.s < 12 ? 8 : 12,
  });
}

function tetradicColors(base, colors) {
  return targetHueColors(base, colors, [hueAt(base.hsl.h, 90), hueAt(base.hsl.h, 180), hueAt(base.hsl.h, 270)], 4, {
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

  rows.push(csvRow([
    base.id,
    base.name,
    base.hex,
    base.hsl.h,
    base.hsl.s,
    base.hsl.l,
    hueFamily(base.hsl),
    temperature(base.hsl),
    listLabels(groups.same),
    listLabels(groups.analogous),
    listLabels(groups.complementary),
    listLabels(groups.splitComplementary),
    listLabels(groups.triadic),
    listLabels(groups.tetradic),
    listLabels(groups.temperatureContrast),
    listLabels(groups.lighter),
    listLabels(groups.darker),
    listLabels(groups.grayTone),
    listLabels(groups.neutral),
    main,
    secondary,
    accent,
    `主色：${main}；辅色：${secondary}；点缀色：${accent}`,
    "基于真实 742 色库；按 HSL 色相角度推导关系，再用 Lab 感知距离、明度与饱和度排序；中性色按低饱和逻辑处理",
  ]));
}

await fs.writeFile(outPath, `${rows.join("\n")}\n`, "utf8");
console.log(`Wrote ${colors.length} harmony rows to ${path.relative(root, outPath)}`);
