import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const imagesPath = path.join(root, "assets/data/images.js");
const harmoniesPath = path.join(root, "assets/data/harmonies.js");

function loadBrowserData(filePath) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: filePath });
  return sandbox.window;
}

function colorName(image) {
  return image.file.replace(/\.[^.]+$/, "").replace(/^\d{3}-/, "");
}

function hueDistance(first, second) {
  const diff = Math.abs((((first - second) % 360) + 360) % 360);
  return Math.min(diff, 360 - diff);
}

function hueAt(hue, offset) {
  return (((hue + offset) % 360) + 360) % 360;
}

function colorTemperature(hsl) {
  if (hsl.s < 12) return "中性";
  return hsl.h < 80 || hsl.h >= 330 ? "暖" : "冷";
}

function targetDistance(base, item, offsets) {
  return Math.min(...offsets.map((offset) => hueDistance(item.hsl.h, hueAt(base.hsl.h, offset))));
}

function targetCoverage(base, items, offsets, tolerance = 55) {
  const covered = new Set();
  for (const item of items) {
    const distances = offsets.map((offset) => hueDistance(item.hsl.h, hueAt(base.hsl.h, offset)));
    const closest = Math.min(...distances);
    if (closest <= tolerance) covered.add(distances.indexOf(closest));
  }
  return covered.size;
}

function rowLabel(color) {
  return `${color.id}-${color.name} H${color.hsl.h}/S${color.hsl.s}/L${color.hsl.l}`;
}

const images = loadBrowserData(imagesPath).TRADITIONAL_COLOR_IMAGES.filter((image) => image.hex);
const harmonies = loadBrowserData(harmoniesPath).TRADITIONAL_COLOR_HARMONIES;
const colors = new Map(images.map((image) => {
  const harmony = harmonies[image.id];
  return [image.id, {
    id: image.id,
    name: colorName(image),
    hex: image.hex,
    hsl: harmony?.hsl || {},
  }];
}));

const failures = [];
const maxDistances = {
  analogous: { value: 0, row: "" },
  complementary: { value: 0, row: "" },
  splitComplementary: { value: 0, row: "" },
  triadic: { value: 0, row: "" },
  tetradic: { value: 0, row: "" },
};

function fail(key, base, item, reason, metric = "") {
  failures.push({
    key,
    base: rowLabel(base),
    item: item ? rowLabel(item) : "",
    reason,
    metric,
  });
}

function relationItems(base, key) {
  const ids = harmonies[base.id]?.[key] || [];
  return ids.map((id) => colors.get(id)).filter(Boolean);
}

function recordMax(key, base, item, offsets) {
  const distance = targetDistance(base, item, offsets);
  if (distance > maxDistances[key].value) {
    maxDistances[key] = {
      value: distance,
      row: `${rowLabel(base)} -> ${rowLabel(item)}`,
    };
  }
}

for (const base of colors.values()) {
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

  for (const key of relationKeys) {
    const items = relationItems(base, key);
    if (!items.length) fail(key, base, null, "关系色为空");

    for (const item of items) {
      if (item.id === base.id) fail(key, base, item, "不能包含当前色自己");

      if (key === "same") {
        if (base.hsl.s < 12 && item.hsl.s >= 20) fail(key, base, item, "中性色同类不应选高饱和颜色", `S ${item.hsl.s}`);
        if (base.hsl.s >= 12 && hueDistance(base.hsl.h, item.hsl.h) > 24) fail(key, base, item, "同类色色相距离过大", hueDistance(base.hsl.h, item.hsl.h));
      }

      if (key === "analogous" && base.hsl.s >= 12) {
        recordMax(key, base, item, [-30, 30]);
        const distance = targetDistance(base, item, [-30, 30]);
        if (distance > 42) fail(key, base, item, "邻近色偏离左右 30 度目标过多", distance);
      }

      if (key === "complementary") {
        recordMax(key, base, item, [180]);
        const distance = targetDistance(base, item, [180]);
        if (distance > 50) fail(key, base, item, "互补色偏离 180 度目标过多", distance);
      }

      if (key === "splitComplementary") {
        recordMax(key, base, item, [150, 210]);
        const distance = targetDistance(base, item, [150, 210]);
        if (distance > 50) fail(key, base, item, "分裂互补偏离 150/210 度目标过多", distance);
      }

      if (key === "triadic") {
        recordMax(key, base, item, [120, 240]);
        const distance = targetDistance(base, item, [120, 240]);
        if (distance > 50) fail(key, base, item, "三角色偏离 120/240 度目标过多", distance);
      }

      if (key === "tetradic") {
        recordMax(key, base, item, [90, 180, 270]);
        const distance = targetDistance(base, item, [90, 180, 270]);
        if (distance > 50) fail(key, base, item, "四角色偏离 90/180/270 度目标过多", distance);
      }

      if (key === "temperatureContrast") {
        const baseTemperature = colorTemperature(base.hsl);
        const itemTemperature = colorTemperature(item.hsl);
        if (baseTemperature !== "中性" && itemTemperature === baseTemperature) {
          fail(key, base, item, "冷暖对照不应选同色温", `${baseTemperature}/${itemTemperature}`);
        }
        if (baseTemperature === "中性" && item.hsl.s < 20) {
          fail(key, base, item, "中性色冷暖对照需要更明确的色彩", `S ${item.hsl.s}`);
        }
      }

      if (key === "lighter") {
        if (base.hsl.l <= 86 && item.hsl.l <= base.hsl.l) {
          fail(key, base, item, "非极亮主色的明色搭配应更亮", `L ${base.hsl.l}->${item.hsl.l}`);
        }
        if (base.hsl.l > 86 && item.hsl.l < 82) {
          fail(key, base, item, "极亮主色的明色搭配仍应保持高明度", `L ${item.hsl.l}`);
        }
      }

      if (key === "darker") {
        if (base.hsl.l >= 32 && item.hsl.l >= base.hsl.l) {
          fail(key, base, item, "非极暗主色的暗色搭配应更暗", `L ${base.hsl.l}->${item.hsl.l}`);
        }
        if (base.hsl.l < 32 && item.hsl.l > 32) {
          fail(key, base, item, "极暗主色的暗色搭配仍应保持低明度", `L ${item.hsl.l}`);
        }
      }

      if (key === "grayTone" && item.hsl.s > Math.min(34, Math.max(16, base.hsl.s))) {
        fail(key, base, item, "灰调搭配饱和度过高", `S ${base.hsl.s}->${item.hsl.s}`);
      }

      if (key === "neutral" && item.hsl.s >= 16) {
        fail(key, base, item, "中性色搭配饱和度过高", `S ${item.hsl.s}`);
      }
    }
  }

  const balancedRelations = [
    ["analogous", [-30, 30], 2],
    ["splitComplementary", [150, 210], 2],
    ["triadic", [120, 240], 2],
    ["tetradic", [90, 180, 270], 3],
  ];

  for (const [key, offsets, required] of balancedRelations) {
    if (key === "analogous" && base.hsl.s < 12) continue;
    const items = relationItems(base, key);
    const covered = targetCoverage(base, items, offsets);
    if (covered < required) {
      fail(key, base, null, `目标色相方向覆盖不足，应覆盖 ${required} 个方向`, `covered ${covered}`);
    }
  }
}

console.log(`Audited ${colors.size} colors and 11 harmony relations.`);
for (const [key, result] of Object.entries(maxDistances)) {
  console.log(`${key} max target distance: ${result.value}${result.row ? ` (${result.row})` : ""}`);
}

if (failures.length) {
  console.error(`Harmony audit failed with ${failures.length} issue(s).`);
  console.error(JSON.stringify(failures.slice(0, 80), null, 2));
  process.exit(1);
}

console.log("Harmony audit passed.");
