/*
 * 共享色彩内核 · Shared color core
 * ---------------------------------------------------------------
 * 从 theme-forge-tokens.js 抽出的纯色彩工具，供 Theme Forge 与 终端配色 两个工具复用：
 *   · sRGB ↔ OKLab/OKLCH 互转、WCAG 相对亮度与对比度、ensure() 明度兜底；
 *   · 全库「真中性池」（低彩度命名色）与按明度 + 锚色色相亲和的 pickNeutral；
 *   · hueOf/chromaOf/hueDist 等几何助手。
 *
 * 浏览器 window 模块（无打包）。依赖先行加载的 window.TRADITIONAL_COLOR_HARMONIES。
 * 暴露：window.ZH_COLOR_CORE = {
 *   hexRgb, hexOklab, oklabHex, oklchStr, relLum, contrast, ensure,
 *   hueOf, chromaOf, hueDist, NEUTRALS, pickNeutral, REC, ALL
 * }
 */
(function () {
  'use strict';
  const H = window.TRADITIONAL_COLOR_HARMONIES;
  if (!H) { console.error('[ColorCore] 需要先加载 assets/data/harmonies.js'); return; }
  const REC = id => H[id];
  const ALL = Object.values(H);

  /* ── 色彩数学：sRGB ↔ OKLab/OKLCH ── */
  const hexRgb = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const gam = c => { c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.round(Math.min(1, Math.max(0, c)) * 255); };
  function hexOklab(hex) {
    const [r, g, b] = hexRgb(hex).map(lin);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return { L: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
             a: 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
             b: 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s };
  }
  function oklabHex({ L, a, b }) {
    const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
    return '#' + [gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
                  gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
                  gam(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)]
                 .map(v => v.toString(16).padStart(2, '0')).join('');
  }
  const hueOf = hex => { const o = hexOklab(hex); let h = Math.atan2(o.b, o.a) * 180 / Math.PI; if (h < 0) h += 360; return h; };
  const chromaOf = hex => { const o = hexOklab(hex); return Math.hypot(o.a, o.b); };
  const oklchStr = hex => { const o = hexOklab(hex); const C = Math.hypot(o.a, o.b); let h = Math.atan2(o.b, o.a) * 180 / Math.PI; if (h < 0) h += 360;
    return `oklch(${o.L.toFixed(3)} ${C.toFixed(3)} ${h.toFixed(1)})`; };

  /* ── WCAG 相对亮度与对比度 ── */
  const relLum = hex => { const [r, g, b] = hexRgb(hex).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const contrast = (a, b) => { const l1 = relLum(a), l2 = relLum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

  // 算法兜底：沿 OKLab 明度把色推到能过目标对比度。两个方向都试，谁先过用谁；都不过取最优努力值。
  function ensure(textHex, bgHex, target = 4.5) {
    if (contrast(textHex, bgHex) >= target) return { hex: textHex, nudged: false };
    const o0 = hexOklab(textHex);
    let best = { hex: textHex, c: contrast(textHex, bgHex) };
    for (const dir of [-1, 1]) for (let i = 1; i <= 26; i++) {
      const o = { ...o0, L: Math.min(1, Math.max(0, o0.L + dir * 0.04 * i)) };
      const h = oklabHex(o), c = contrast(h, bgHex);
      if (c >= target) return { hex: h, nudged: true };
      if (c > best.c) best = { hex: h, c };
    }
    return { hex: best.hex, nudged: true };
  }

  /* ── 全库「真中性池」：低彩度命名色（月白/象牙白/镍灰/玄黑…），可按明度点名 ── */
  const NEUTRALS = ALL.map(c => { const o = hexOklab(c.hex); const C = Math.hypot(o.a, o.b);
      let h = Math.atan2(o.b, o.a) * 180 / Math.PI; if (h < 0) h += 360; return { ...c, L: o.L, C, h }; })
    .filter(n => n.C < 0.045);
  const hueDist = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
  // 取目标明度的中性色：明度最近的几个里，再挑色相最贴锚色的 —— 给素地留一缕锚色的呼吸。
  function pickNeutral(targetL, anchorHue) {
    const near = [...NEUTRALS].sort((a, b) => Math.abs(a.L - targetL) - Math.abs(b.L - targetL)).slice(0, 6);
    near.sort((a, b) => hueDist(a.h, anchorHue) - hueDist(b.h, anchorHue));
    return near[0];
  }

  window.ZH_COLOR_CORE = {
    hexRgb, hexOklab, oklabHex, oklchStr, hueOf, chromaOf,
    relLum, contrast, ensure, hueDist, NEUTRALS, pickNeutral,
    REC, ALL: () => ALL,
  };
})();
