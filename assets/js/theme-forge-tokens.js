/*
 * Theme Forge 核心 · 中国传统色 → shadcn 语义 token
 * ---------------------------------------------------------------
 * 设计哲学：「素地敷彩」。
 *   · 中性面（background/card/muted/secondary/border/foreground）从「全库真中性池」点名 —— 宣纸的白、墨的黑。
 *   · 颜色（primary/accent/destructive/chart-*）只从锚色的 harmony 取 —— 在该敷彩处敷彩。
 *   · 算法只剩两件兜底活：按明度从中性池取色、保证所有前景过 WCAG AA。
 *
 * 浏览器 window 模块（无打包）。依赖先行加载的 window.TRADITIONAL_COLOR_HARMONIES
 * 与共享内核 window.ZH_COLOR_CORE（assets/js/color-core.js）。
 * 暴露：window.ZH_THEME_FORGE = { build, SURF, ORDER, AA, oklchStr, contrast, REC, ALL }
 */
(function () {
  'use strict';
  const CC = window.ZH_COLOR_CORE;
  if (!CC) { console.error('[ThemeForge] 需要先加载 assets/js/color-core.js'); return; }
  // 色彩数学 / 中性池 / 对比度兜底 —— 全部来自共享内核。
  const { hexOklab, oklchStr, contrast, ensure, pickNeutral, REC } = CC;
  const ALL = CC.ALL();

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
