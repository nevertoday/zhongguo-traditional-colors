/*
 * 终端配色核心 · 中国传统色 → 终端调色板（16 ANSI + UI）
 * ---------------------------------------------------------------
 * 设计依据：docs/adr/0001（映射策略）+ CONTEXT.md（正本清源 / 锚色露脸契约）。
 *
 * 映射顺序（正本清源 —— 全程 snap 真实命名色，只有契约物理不可满足时才兜底）：
 *   1. 素地敷彩：background/foreground/cursor/selection 从全库中性池按明度点名，染锚色冷暖；
 *   2. 锚色露脸：锚色占「自己同色相」的那个 ANSI 槽，并兼任 cursor/selection；
 *   3. 全库补色：其余色相槽从全库按「色相最近 + 锚色族加成 + 冷暖对齐」选真实色；
 *   4. bright_*：取常规色的 lighter[0]（真实色），空则全库同色相更亮色，再不行才 OKLab 提亮兜底；
 *      bright_black/black/white/bright_white 走中性池相邻明度档。
 *
 * 可读性契约集中在 LEGIBILITY（「性格旋钮」），违则换真实色 → 换不到才兜底。
 *
 * 浏览器 window 模块（无打包）。依赖 window.ZH_COLOR_CORE（color-core.js）。
 * 暴露：window.ZH_TERMINAL = { build, ANSI_ORDER, UI_ORDER, LEGIBILITY, HUE, REC, ALL, floorFor }
 */
(function () {
  'use strict';
  const CC = window.ZH_COLOR_CORE;
  if (!CC) { console.error('[Terminal] 需要先加载 assets/js/color-core.js'); return; }
  const { hexOklab, oklabHex, contrast, ensure, hueOf, chromaOf, hueDist, pickNeutral, REC } = CC;
  const ALL = CC.ALL();

  /* ── 可读性契约（性格旋钮）── */
  const LEGIBILITY = {
    fgBg: 7,          // foreground vs background（终端长时阅读，逼近 AAA）
    chromatic: 4.5,   // 6 彩色 + 亮端 white/bright_white（暗底上必须跳得出来）
    dimGray: 2.5,     // bright_black 注释灰：暗但可辨
    cursor: 3.5,      // 光标块必须看得见
    selection: 4,     // 选中条上的正文（foreground）要可读
    redGreenHue: 25,  // red 槽与 green 槽的最小 OKLab 色相分离（diff/git + 色盲）
  };

  /* ── 各槽目标 OKLab 明度（暗色优先；只有 bg/fg/彩色窗 随模式翻转，黑白端不翻转）── */
  const TSURF = {
    dark:  { bg: .165, fg: .90, black: .255, brightBlack: .50, white: .80, brightWhite: .965, colorWin: [.55, .82], sel: .33 },
    light: { bg: .965, fg: .25, black: .255, brightBlack: .52, white: .80, brightWhite: .965, colorWin: [.40, .62], sel: .82 },
  };

  /* ── 6 个 ANSI 色相槽的标准目标色相（取纯原色在 OKLab 下的色相）── */
  const HUE = { red: hueOf('#ff0000'), yellow: hueOf('#ffff00'), green: hueOf('#00ff00'),
                cyan: hueOf('#00ffff'), blue: hueOf('#0000ff'), magenta: hueOf('#ff00ff') };
  const CHROMA = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];

  const ANSI_ORDER = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
    'bright_black', 'bright_red', 'bright_green', 'bright_yellow', 'bright_blue', 'bright_magenta', 'bright_cyan', 'bright_white'];
  const UI_ORDER = ['background', 'foreground', 'cursor', 'selection'];

  // 预算全库的 OKLab 明度/彩度/色相，避免每槽重算。
  const LAB = ALL.map(c => ({ rec: c, L: hexOklab(c.hex).L, C: chromaOf(c.hex), h: hueOf(c.hex) }));

  const labL = hex => hexOklab(hex).L;
  const named = rec => ({ hex: rec.hex, name: rec.name, id: rec.id, nudged: false });

  // 每个槽对 background 的对比度下限（亮端中性只在暗色模式下要求；暗端 black 永不要求）。
  function floorFor(key, mode) {
    if (key === 'background') return 0;
    if (key === 'foreground') return LEGIBILITY.fgBg;
    if (key === 'cursor') return LEGIBILITY.cursor;
    if (key === 'selection') return 0;                          // 选中条单独按「正文可读」校验
    if (key === 'black') return 0;                              // 暗端锚点，贴底是设计本意
    if (key === 'bright_black') return LEGIBILITY.dimGray;
    if (key === 'white' || key === 'bright_white') return mode === 'dark' ? LEGIBILITY.chromatic : 0;
    return LEGIBILITY.chromatic;                                // 6 彩色（含 bright_*）
  }

  /* ── 从全库为某色相槽点名一个真实色 ── */
  function pickChromatic(targetHue, anchorHue, anchorTemp, family, bgHex, mode) {
    const [lo, hi] = TSURF[mode].colorWin;
    const scored = LAB.map(x => {
      let s = hueDist(x.h, targetHue);                          // 色相最近为主
      if (x.C < 0.06) s += (0.06 - x.C) * 700;                  // 太灰的不要（终端要跳）
      if (x.L < lo) s += (lo - x.L) * 130;                      // 落在明度窗外受罚
      if (x.L > hi) s += (x.L - hi) * 130;
      if (family.has(x.rec.id)) s -= 16;                        // 锚色族加成：让一家人优先
      if (x.rec.temperature === anchorTemp) s -= 4;             // 冷暖对齐微加成
      return { x, s };
    }).filter(o => hueDist(o.x.h, targetHue) < 38)              // 锁死色相窗，绝不跑偏到别的色相
      .sort((a, b) => a.s - b.s);
    // 色相窗内，取过对比度的最优分；都不过则取最优分再 OKLab 兜底。
    for (const o of scored) if (contrast(o.x.rec.hex, bgHex) >= LEGIBILITY.chromatic) return named(o.x.rec);
    if (!scored.length) return null;
    const e = ensure(scored[0].x.rec.hex, bgHex, LEGIBILITY.chromatic);
    return { hex: e.hex, name: scored[0].x.rec.name, id: scored[0].x.rec.id, nudged: e.nudged };
  }

  /* ── 锚色占自己的同色相槽（露脸契约）── */
  function placeAnchor(A, bgHex) {
    if (contrast(A.hex, bgHex) >= LEGIBILITY.chromatic) return named(A);
    // 先在锚色家族里找一支过对比度、且仍是同色相的真实色（依旧点名）
    const aHue = hueOf(A.hex);
    const fam = [...(A.lighter || []), ...(A.darker || []), ...(A.same || [])].map(REC).filter(Boolean);
    for (const c of fam) if (contrast(c.hex, bgHex) >= LEGIBILITY.chromatic && hueDist(hueOf(c.hex), aHue) < 42) return named(c);
    const e = ensure(A.hex, bgHex, LEGIBILITY.chromatic);       // 实在不行才提亮兜底
    return { hex: e.hex, name: A.name, id: A.id, nudged: true };
  }

  /* ── bright_X：常规色 → 更亮但「保色」的真实色 → OKLab 提亮兜底 ──
     关键：bright 要更亮/更跳，但必须仍是同一个颜色 —— 不能褪成粉白（明度设上限、饱和度设下限）。
     候选取自全库同色相更亮色，并对锚色族的 lighter 给一点偏好；按「贴近目标明度 + 偏饱和」打分。 */
  function brighten(normal, bgHex, mode) {
    const o = hexOklab(normal.hex), nL = o.L, nHue = hueOf(normal.hex), nC = Math.hypot(o.a, o.b);
    const wantL = Math.min(0.88, nL + 0.14), minC = Math.max(0.05, nC * 0.5);
    const src = normal.id != null ? REC(normal.id) : null;
    const prefer = new Set(src && src.lighter ? src.lighter : []);
    const cand = LAB
      .filter(x => x.L > nL + 0.015 && x.L <= 0.9 && x.C >= minC && hueDist(x.h, nHue) < 26 && contrast(x.rec.hex, bgHex) >= LEGIBILITY.chromatic)
      .map(x => ({ x, s: Math.abs(x.L - wantL) + hueDist(x.h, nHue) * 0.012 - Math.min(x.C, 0.15) * 0.25 - (prefer.has(x.rec.id) ? 0.06 : 0) }))
      .sort((a, b) => a.s - b.s)[0];
    if (cand) return named(cand.x.rec);
    const hex = oklabHex({ ...o, L: Math.min(0.86, nL + 0.16) });   // 兜底：提亮但保色保色相
    const e = ensure(hex, bgHex, LEGIBILITY.chromatic);
    return { hex: e.hex, name: null, id: null, nudged: true };
  }

  // 中性槽点名 + 按 floor 兜底。
  function neutralSlot(key, targetL, anchorHue, bgHex, mode) {
    const n = pickNeutral(targetL, anchorHue);
    const floor = floorFor(key, mode);
    if (floor && contrast(n.hex, bgHex) < floor) {
      const e = ensure(n.hex, bgHex, floor);
      return { hex: e.hex, name: e.nudged ? null : n.name, id: e.nudged ? null : n.id, nudged: e.nudged };
    }
    return named(n);
  }

  /* ── 核心：一个锚色 → 一整套终端调色板 ── */
  function build(anchorId, mode) {
    const A = REC(anchorId);
    if (!A) return null;
    const aHue = hueOf(A.hex), aTemp = A.temperature, S = TSURF[mode];

    // 1. 素地：background / foreground
    const bg = pickNeutral(S.bg, aHue);
    const bgHex = bg.hex;
    const fgN = pickNeutral(S.fg, aHue);
    const fgE = ensure(fgN.hex, bgHex, LEGIBILITY.fgBg);
    const ui = {
      background: named(bg),
      foreground: { hex: fgE.hex, name: fgE.nudged ? null : fgN.name, id: fgE.nudged ? null : fgN.id, nudged: fgE.nudged },
    };

    // 2. 锚色族（用于补色加成）
    const family = new Set([anchorId, ...(A.same || []), ...(A.analogous || []), ...(A.lighter || []), ...(A.darker || []),
      ...(A.complementary || []), ...(A.splitComplementary || []), ...(A.triadic || []), ...(A.tetradic || []),
      ...(A.secondary || []), ...(A.accent || []), ...(A.temperatureContrast || [])]);

    // 3. 锚色占哪个色相槽
    let anchorSlot = CHROMA[0], best = Infinity;
    for (const k of CHROMA) { const d = hueDist(aHue, HUE[k]); if (d < best) { best = d; anchorSlot = k; } }

    // 4. 6 个彩色槽
    const ansi = {};
    for (const k of CHROMA) {
      ansi[k] = k === anchorSlot ? placeAnchor(A, bgHex) : pickChromatic(HUE[k], aHue, aTemp, family, bgHex, mode);
    }
    // 5. 中性端（黑/白/亮黑/亮白）
    ansi.black = neutralSlot('black', S.black, aHue, bgHex, mode);
    ansi.white = neutralSlot('white', S.white, aHue, bgHex, mode);
    ansi.bright_black = neutralSlot('bright_black', S.brightBlack, aHue, bgHex, mode);
    ansi.bright_white = neutralSlot('bright_white', S.brightWhite, aHue, bgHex, mode);
    // 6. bright 彩色 = 常规彩色的更亮真实色
    for (const k of CHROMA) ansi['bright_' + k] = brighten(ansi[k], bgHex, mode);

    // 7. 锚色露脸：cursor 用锚色槽的色（保证可见）；selection 取锚色暗/亮调，校验正文可读
    ui.cursor = { ...ansi[anchorSlot] };
    {
      const selN = pickNeutral(S.sel, aHue);                    // 锚色染过的中性条
      let selHex = selN.hex, selName = selN.name, selId = selN.id, nud = false;
      if (contrast(ui.foreground.hex, selHex) < LEGIBILITY.selection) {
        const e = ensure(selHex, ui.foreground.hex, LEGIBILITY.selection);
        selHex = e.hex; nud = e.nudged; if (e.nudged) { selName = null; selId = null; }
      }
      ui.selection = { hex: selHex, name: selName, id: selId, nudged: nud };
    }

    // 汇总 provenance（16 ANSI + 4 UI）
    const slots = [];
    ANSI_ORDER.forEach((k, i) => { const t = ansi[k]; slots.push({ group: 'ansi', key: k, idx: i, ...t, contrast: +contrast(t.hex, bgHex).toFixed(2) }); });
    UI_ORDER.forEach(k => { const t = ui[k]; slots.push({ group: 'ui', key: k, ...t, contrast: +contrast(t.hex, bgHex).toFixed(2) }); });

    return { anchor: A, mode, ansi, ui, order: ANSI_ORDER, uiOrder: UI_ORDER, anchorSlot, slots };
  }

  window.ZH_TERMINAL = { build, ANSI_ORDER, UI_ORDER, LEGIBILITY, HUE, floorFor, REC, ALL: () => ALL };
})();
