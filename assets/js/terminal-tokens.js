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
  const { hexOklab, oklabHex, contrast, ensure, boostChroma, hueOf, chromaOf, hueDist, REC } = CC;
  const ALL = CC.ALL();

  /* ── 可读性契约（性格旋钮）── */
  const LEGIBILITY = {
    fgBg: 7,            // foreground vs background（终端长时阅读，逼近 AAA）
    chromatic: 4.5,     // 6 彩色 + 亮端 white/bright_white（暗底上必须跳得出来）
    chromaFloor: 0.06,  // 增彩兜底只救「接近中性」的彩色槽（如亮色青常掉到 0.04）；更跳靠打分优先真实饱和色（保名）
    dimGray: 3.0,       // bright_black 注释灰：Claude Code 的副文本主力，盯一天需略提到 3.0（仍偏暗但更耐读）
    cursor: 3.5,        // 光标块必须看得见
    selection: 4,       // 选中条上的正文（foreground）要可读
    selVisible: 1.9,    // 选区相对背景的最小对比：让高亮带本身看得见，不只是其上正文可读
    brightStep: 0.05,   // bright_X 相对常规色的最小 OKLab 明度提升：bright 必须「更亮」而非偏色
    anchorAvoid: 18,    // 非锚色彩色槽与锚色色相的最小间隔：锚色占一槽时把邻槽推开，防青绿/黄绿拥挤
    redGreenHue: 25,    // red 槽与 green 槽的最小 OKLab 色相分离（diff/git + 色盲）
  };

  /* ── 各槽目标 OKLab 明度（暗色优先；只有 bg/fg/彩色窗 随模式翻转，黑白端不翻转）── */
  const TSURF = {
    dark:  { bg: .165, fg: .90, black: .255, brightBlack: .50, white: .80, brightWhite: .965, colorWin: [.55, .82], sel: .33 },
    light: { bg: .965, fg: .25, black: .255, brightBlack: .52, white: .80, brightWhite: .965, colorWin: [.40, .62], sel: .82 },
  };

  /* ── 素地敷彩的「染色量」：在目标明度上注入的锚色彩度（OKLab）基准值，再乘以 DEPTH.mul。
     深色端（bg/black）可略重；浅色端（white/bright_white）彩度更显，要更轻；高亮条 sel 可稍重。 */
  const TINT = { bg: .020, fg: .015, black: .020, brightBlack: .024, light: .013, sel: .030 };

  /* ── 底色浓度三档（终端配色不必是「近黑」：Tomorrow Night Blue/Solarized 都是深彩底）。
     mul 放大整套素地的染色量；bgL 单独抬高 background 明度，让深彩底「读得出是颜色」而非死黑。
     对比度由明度主导，故加饱和几乎不损可读性（实测浅前景对比仍 ~14，底线才 7）。
     素=近黑微染（最冷静，底名多落玄黑）；中=深彩底（偏 Tomorrow Night Blue，默认）；浓=饱满深彩。 */
  const DEPTH = {
    plain:  { mul: 1.0, bgL: { dark: .165, light: .965 } },
    medium: { mul: 3.0, bgL: { dark: .200, light: .955 } },
    deep:   { mul: 5.0, bgL: { dark: .210, light: .945 } },
  };

  // 给合成的素地起名：取全库中 OKLab 最近的真传统色名（不限中性）。
  // 近黑档多落「玄黑」是该明度的真相；深彩档会落到真·深彩传统色（钢蓝/茄皮紫/云杉绿…），名字随锚色变多。
  const nearestColorName = hex => {
    const o = hexOklab(hex); let best = null, bd = Infinity;
    for (const x of LAB) { const d = Math.hypot(x.L - o.L, x.a - o.a, x.b - o.b); if (d < bd) { bd = d; best = x.rec; } }
    return best ? best.name : null;
  };

  /* ── 6 个 ANSI 色相槽的标准目标色相（取纯原色在 OKLab 下的色相）── */
  const HUE = { red: hueOf('#ff0000'), yellow: hueOf('#ffff00'), green: hueOf('#00ff00'),
                cyan: hueOf('#00ffff'), blue: hueOf('#0000ff'), magenta: hueOf('#ff00ff') };
  const CHROMA = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];

  const ANSI_ORDER = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
    'bright_black', 'bright_red', 'bright_green', 'bright_yellow', 'bright_blue', 'bright_magenta', 'bright_cyan', 'bright_white'];
  const UI_ORDER = ['background', 'foreground', 'cursor', 'selection'];

  // 预算全库的 OKLab 明度/a/b/彩度/色相，避免每槽重算。
  const LAB = ALL.map(c => { const o = hexOklab(c.hex); return { rec: c, L: o.L, a: o.a, b: o.b, C: chromaOf(c.hex), h: hueOf(c.hex) }; });

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

  /* ── 选定真实色后的收口：太灰则 OKLab 增彩、再保对比度。
     改了 hex 就标 nudged（微调）并清 id，但保留来源色名 —— 它仍可溯源到这支传统色，不是凭空兜底。 ── */
  function finishChromatic(rec, bgHex, targetHue) {
    let hex = rec.hex;
    const colorless = chromaOf(hex) < 1e-3;                     // 近乎纯灰：没有色相可放大，直接增彩只会得到灰色的「红/绿…」
    if (colorless) {                                           // → 在目标色相上合成最低彩度（中性家族锚色如「黑」才会走到）
      const o = hexOklab(hex), rad = targetHue * Math.PI / 180, c0 = LEGIBILITY.chromaFloor;
      hex = oklabHex({ L: o.L, a: c0 * Math.cos(rad), b: c0 * Math.sin(rad) });
    }
    const b = boostChroma(hex, LEGIBILITY.chromaFloor);        // 太灰（但有色相）→ 推到彩度下限（保色相/明度）
    const c = contrast(b.hex, bgHex) >= LEGIBILITY.chromatic ? { hex: b.hex, nudged: false } : ensure(b.hex, bgHex, LEGIBILITY.chromatic);
    const tweaked = colorless || b.boosted || c.nudged;
    // 合成了色相 → 不再是来源色，诚实去名（兜底）；仅增彩/提亮 → 保名（微调）
    return { hex: c.hex, name: colorless ? null : rec.name, id: tweaked ? null : rec.id, nudged: tweaked };
  }

  /* ── 从全库为某色相槽点名一个真实色 ── */
  function pickChromatic(targetHue, anchorHue, anchorTemp, family, bgHex, mode) {
    const [lo, hi] = TSURF[mode].colorWin;
    const floor = LEGIBILITY.chromaFloor;
    const scored = LAB.map(x => {
      let s = hueDist(x.h, targetHue);                          // 色相最近为主
      s -= Math.min(x.C, 0.2) * 55;                             // 奖励饱和：同窗内优先更跳的（治品红/青发灰）
      if (x.C < floor) s += (floor - x.C) * 900;                // 太灰强罚
      if (x.L < lo) s += (lo - x.L) * 130;                      // 落在明度窗外受罚
      if (x.L > hi) s += (x.L - hi) * 130;
      const da = hueDist(x.h, anchorHue);                       // 远离锚色色相：锚色占一槽，邻槽别挤上去（治青绿/黄绿拥挤）
      if (da < LEGIBILITY.anchorAvoid) s += (LEGIBILITY.anchorAvoid - da) * 9;
      if (family.has(x.rec.id)) s -= 16;                        // 锚色族加成：让一家人优先
      if (x.rec.temperature === anchorTemp) s -= 4;             // 冷暖对齐微加成
      return { x, s };
    }).filter(o => hueDist(o.x.h, targetHue) < 38)              // 锁死色相窗，绝不跑偏到别的色相
      .sort((a, b) => a.s - b.s);
    if (!scored.length) return null;
    // 色相窗内取过对比度的最优分；都不过取最优分。再统一收口（增彩 + 对比度兜底）。
    let chosen = null;
    for (const o of scored) if (contrast(o.x.rec.hex, bgHex) >= LEGIBILITY.chromatic) { chosen = o.x.rec; break; }
    return finishChromatic(chosen || scored[0].x.rec, bgHex, targetHue);
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
  function brighten(normal, bgHex) {
    const o = hexOklab(normal.hex), nL = o.L, nHue = hueOf(normal.hex), nC = Math.hypot(o.a, o.b);
    const step = LEGIBILITY.brightStep;
    const wantL = Math.min(0.9, nL + 0.16), minC = Math.max(0.05, nC * 0.5);
    const src = normal.id != null ? REC(normal.id) : null;
    const prefer = new Set(src && src.lighter ? src.lighter : []);
    // 候选必须真·更亮（ΔL≥step）且仍同色相（<18°，防 bright 偏色），否则不算
    const cand = LAB
      .filter(x => x.L >= nL + step && x.L <= 0.92 && x.C >= minC && hueDist(x.h, nHue) < 20 && contrast(x.rec.hex, bgHex) >= LEGIBILITY.chromatic)
      .map(x => ({ x, s: Math.abs(x.L - wantL) + hueDist(x.h, nHue) * 0.02 - Math.min(x.C, 0.15) * 0.25 - (prefer.has(x.rec.id) ? 0.06 : 0) }))
      .sort((a, b) => a.s - b.s)[0];
    if (cand) return named(cand.x.rec);
    const hex = oklabHex({ ...o, L: Math.min(0.9, nL + Math.max(step, 0.16)) });   // 兜底：纯提亮（精确保色相，保证更亮）
    const e = ensure(hex, bgHex, LEGIBILITY.chromatic);
    return { hex: e.hex, name: normal.name || null, id: null, nudged: true };       // 保留常规色名：bright 是「该色的亮版」，可溯源
  }

  /* ── 素地敷彩：从锚色合成一缕染色的表面色（近黑/深彩/近白）──
     旧法 pickNeutral 从「明度最近的固定 6 个中性色」里挑 —— 锚色只当 hue tiebreaker，
     于是 742 个锚色的 background/foreground/black/white… 全坍缩到 6 个值（占满屏 ~85% 面积却几乎不随锚色变）。
     新法：在 OKLCH 里按 目标明度 + 锚色色相 + 一缕彩度（tint，含 DEPTH.mul）合成表面 —— 每个锚色都不同（hex 不坍缩）。
     不向库 snap hex（库里近黑只 6 支，snap 会重新坍缩）；「起名」认领全库 OKLab 最近的真传统色，
     标 surface=true（素地：合成表面色，可溯源到该真色但 hex 调过，nudged，不计入「无名兜底」）。 */
  function surfaceFromAnchor(key, targetL, tint, aRec, bgHex, mode) {
    const rad = hueOf(aRec.hex) * Math.PI / 180;
    let hex = oklabHex({ L: targetL, a: tint * Math.cos(rad), b: tint * Math.sin(rad) });
    // 对比度兜底：floor 不满足才提亮/压暗（合成值通常已达标，这里只是守门）
    const floor = floorFor(key, mode);
    if (floor && contrast(hex, bgHex) < floor) hex = ensure(hex, bgHex, floor).hex;
    return { hex, name: nearestColorName(hex), id: null, nudged: true, surface: true };
  }

  /* ── 核心：一个锚色 → 一整套终端调色板（depth：plain/medium/deep 底色浓度）── */
  function build(anchorId, mode, depth) {
    const A = REC(anchorId);
    if (!A) return null;
    const aHue = hueOf(A.hex), aTemp = A.temperature, S = TSURF[mode];
    const D = DEPTH[depth] || DEPTH.medium;                     // 默认中等深彩
    const m = D.mul;

    // 1. 素地：从锚色合成染色表面（background 用 depth 抬高的明度 + 放大的染色量 → 深彩底；其余沿各自目标明度，染色量同乘 m）
    const bgSurf = surfaceFromAnchor('background', D.bgL[mode], TINT.bg * m, A, null, mode);
    const bgHex = bgSurf.hex;
    const ui = {
      background: bgSurf,
      foreground: surfaceFromAnchor('foreground', S.fg, TINT.fg * m, A, bgHex, mode),
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
    ansi.black = surfaceFromAnchor('black', S.black, TINT.black * m, A, bgHex, mode);
    ansi.white = surfaceFromAnchor('white', S.white, TINT.light * m, A, bgHex, mode);
    ansi.bright_black = surfaceFromAnchor('bright_black', S.brightBlack, TINT.brightBlack * m, A, bgHex, mode);
    ansi.bright_white = surfaceFromAnchor('bright_white', S.brightWhite, TINT.light * m, A, bgHex, mode);
    // 6. bright 彩色 = 常规彩色的更亮真实色
    for (const k of CHROMA) ansi['bright_' + k] = brighten(ansi[k], bgHex);

    // 7. 锚色露脸：cursor 用锚色槽的色（保证可见）；selection 取锚色暗/亮调，校验正文可读
    ui.cursor = { ...ansi[anchorSlot] };
    {
      const selN = surfaceFromAnchor('selection', S.sel, TINT.sel * m, A, bgHex, mode);   // 锚色染过的高亮条（合成）
      let selHex = selN.hex, nud = selN.nudged;
      // 先让高亮带相对背景可见（不止「其上正文可读」）
      if (contrast(selHex, bgHex) < LEGIBILITY.selVisible) {
        const e = ensure(selHex, bgHex, LEGIBILITY.selVisible);
        selHex = e.hex; if (e.nudged) nud = true;
      }
      // 再保证选中的正文（foreground）在其上可读
      if (contrast(ui.foreground.hex, selHex) < LEGIBILITY.selection) {
        const e = ensure(selHex, ui.foreground.hex, LEGIBILITY.selection);
        selHex = e.hex; if (e.nudged) nud = true;
      }
      ui.selection = { hex: selHex, name: nearestColorName(selHex), id: null, nudged: nud, surface: true };   // 素地·锚色染的高亮条（名认领全库最近真色）
    }

    // 汇总 provenance（16 ANSI + 4 UI）
    const slots = [];
    ANSI_ORDER.forEach((k, i) => { const t = ansi[k]; slots.push({ group: 'ansi', key: k, idx: i, ...t, contrast: +contrast(t.hex, bgHex).toFixed(2) }); });
    UI_ORDER.forEach(k => { const t = ui[k]; slots.push({ group: 'ui', key: k, ...t, contrast: +contrast(t.hex, bgHex).toFixed(2) }); });

    return { anchor: A, mode, ansi, ui, order: ANSI_ORDER, uiOrder: UI_ORDER, anchorSlot, slots };
  }

  window.ZH_TERMINAL = { build, ANSI_ORDER, UI_ORDER, LEGIBILITY, HUE, DEPTHS: Object.keys(DEPTH), floorFor, REC, ALL: () => ALL };
})();
