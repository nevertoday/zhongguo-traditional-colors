/*
 * Theme Forge 核心 · 中国传统色 → shadcn 语义 token
 * ---------------------------------------------------------------
 * 设计哲学：「素地敷彩」。
 *   · 中性面（background/card/muted/secondary/border/foreground）从「全库真中性池」点名 —— 宣纸的白、墨的黑。
 *   · 颜色（primary/accent/destructive/chart-*）只从锚色的 harmony 取 —— 在该敷彩处敷彩。
 *   · 算法只剩两件兜底活：按明度从中性池取色、保证所有前景过 WCAG AA。
 *
 * 浏览器 window 模块（无打包）。依赖先行加载的 window.TRADITIONAL_COLOR_HARMONIES。
 * 暴露：window.ZH_THEME_FORGE = { build, SURF, ORDER, AA, oklchStr, contrast, REC, ALL }
 */
(function () {
  'use strict';
  const H = window.TRADITIONAL_COLOR_HARMONIES;
  if (!H) { console.error('[ThemeForge] 需要先加载 assets/data/harmonies.js'); return; }
  const REC = id => H[id];
  const ALL = Object.values(H);

  /* ── 色彩数学：sRGB ↔ OKLab/OKLCH，WCAG 对比度 ── */
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
  const oklchStr = hex => { const o = hexOklab(hex); const C = Math.hypot(o.a, o.b); let h = Math.atan2(o.b, o.a) * 180 / Math.PI; if (h < 0) h += 360;
    return `oklch(${o.L.toFixed(3)} ${C.toFixed(3)} ${h.toFixed(1)})`; };
  const relLum = hex => { const [r, g, b] = hexRgb(hex).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const contrast = (a, b) => { const l1 = relLum(a), l2 = relLum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  // 算法兜底：沿 OKLab 明度把文字色推到能过 AA。两个方向都试，谁先过用谁。
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

  /* ── 文化赤：给 destructive 用 ── */
  const RED = (function () {
    let best = null, score = 1e9;
    for (const c of ALL) { const { h, s, l } = c.hsl; if (s < 55) continue;
      const dh = Math.min(Math.abs(h - 12), Math.abs(h - 360 + 12)); const d = dh + Math.abs(l - 46) * 0.6;
      if (l >= 36 && l <= 58 && d < score) { score = d; best = c; } }
    return best || ALL[0];
  })();

  /* ── 锚色 harmony 候选合并 ── */
  function cands(rec, arrays) {
    const seen = new Set(), out = [];
    for (const k of arrays) for (const id of (rec[k] || [])) { if (seen.has(id) || !REC(id)) continue; seen.add(id); out.push(REC(id)); }
    return out.length ? out : [rec];
  }

  /* ── 脾气旋钮：各「面」角色的目标 OKLab 明度。改这里 = 改主题性格。 ── */
  const SURF = {
    light: { background: .96, card: 1, popover: 1, muted: .925, secondary: .905, border: .85, input: .85, foreground: .22 },
    dark:  { background: .16, card: .205, popover: .205, muted: .255, secondary: .29, border: .34, input: .34, foreground: .93 },
  };

  const ORDER = ['background', 'foreground', 'card', 'card-foreground', 'popover', 'primary', 'primary-foreground',
    'secondary', 'secondary-foreground', 'muted', 'muted-foreground', 'accent', 'accent-foreground',
    'destructive', 'destructive-foreground', 'border', 'input', 'ring', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'];
  // 哪些前景 token 要对哪个底色保证 AA
  const AA = { 'primary-foreground': 'primary', 'secondary-foreground': 'secondary', 'accent-foreground': 'accent',
    'destructive-foreground': 'destructive', 'card-foreground': 'card', 'muted-foreground': 'muted', 'foreground': 'background' };

  /* ── 核心：一个锚色 → 整套 token ── */
  function build(anchorId, mode) {
    const A = REC(anchorId);
    const aHue = (() => { const o = hexOklab(A.hex); let h = Math.atan2(o.b, o.a) * 180 / Math.PI; if (h < 0) h += 360; return h; })();
    const s = SURF[mode];
    const T = {};
    const named = (role, rec) => T[role] = { hex: rec.hex, name: rec.name, role, nudged: false };

    // 素地：中性面从全库点名
    for (const role of ['background', 'card', 'popover', 'muted', 'secondary', 'border', 'input', 'foreground'])
      named(role, pickNeutral(s[role], aHue));
    // 敷彩：颜色从锚色 harmony
    named('primary', mode === 'dark' ? (REC(A.lighter[0]) || A) : A);
    named('ring', T.primary);
    named('accent', cands(A, ['accent', 'splitComplementary'])[0]);
    named('destructive', RED);

    // 前景：算法兜底保证 AA
    const black = T.foreground.hex, white = T.background.hex;
    { const e = ensure(T.foreground.hex, T.background.hex); if (e.nudged) { T.foreground.hex = e.hex; T.foreground.name = null; T.foreground.nudged = true; } }
    const textRole = (role, bg) => {
      const base = contrast(black, bg) >= contrast(white, bg) ? black : white;
      const { hex, nudged } = ensure(base, bg);
      const name = hex === black ? T.foreground.name : hex === white ? T.background.name : null;
      T[role] = { hex, name, role, nudged: nudged || name === null };
    };
    textRole('card-foreground', T.card.hex);
    textRole('secondary-foreground', T.secondary.hex);
    textRole('primary-foreground', T.primary.hex);
    textRole('accent-foreground', T.accent.hex);
    textRole('destructive-foreground', T.destructive.hex);
    { const mf = pickNeutral(mode === 'dark' ? .66 : .46, aHue); const e = ensure(mf.hex, T.muted.hex);
      T['muted-foreground'] = { hex: e.hex, name: e.nudged ? null : mf.name, role: 'muted-foreground', nudged: e.nudged }; }

    // chart-1..5：锚色 + triadic/tetradic
    const chartIds = [anchorId, ...A.triadic, ...A.tetradic, ...A.analogous];
    const seen = new Set(), charts = [];
    for (const id of chartIds) { if (seen.has(id) || !REC(id)) continue; seen.add(id); charts.push(REC(id)); if (charts.length >= 5) break; }
    charts.forEach((c, i) => T['chart-' + (i + 1)] = { hex: c.hex, name: c.name, role: 'chart-' + (i + 1), nudged: false });
    return { anchor: A, tokens: T };
  }

  window.ZH_THEME_FORGE = { build, SURF, ORDER, AA, oklchStr, contrast, REC, ALL: () => ALL };
})();
