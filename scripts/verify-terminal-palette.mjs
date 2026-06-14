/*
 * verify-terminal-palette.mjs —— 终端配色契约校验（standalone，无依赖）
 * ---------------------------------------------------------------
 * 断言（见 docs/adr/0001 + CONTEXT.md）：
 *   1. 16 ANSI + 4 UI 槽全部非空；
 *   2. 可读性契约（LEGIBILITY）逐槽成立（按模式分档）+ 选区正文可读 + red≠green 可区分；
 *   3. 正本清源：点名槽必须引用真实库色（id→hex 一致），兜底率在阈值内；
 *   4. 锚色露脸：锚色占自己同色相槽、并兼任 cursor；
 *   5. 三格式可解析：Ghostty palette= / Alacritty TOML（内置真解析器）/ kitty color0..15。
 * 默认锚色 + 朱红/竹青/鸦青 × 暗·亮，外加全库 742 × 2 压力扫描。
 * 通过打印确认；任一断言失败即 throw（退出码非 0）。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(ROOT, p), 'utf8');

// 在沙箱里加载浏览器 window 全局（与站点运行时同一套代码）。
const ctx = { window: {}, console };
vm.createContext(ctx);
for (const f of ['assets/data/harmonies.js', 'assets/data/preview-syntax.js', 'assets/js/color-core.js', 'assets/js/terminal-tokens.js', 'assets/js/terminal-serialize.js'])
  vm.runInContext(read(f), ctx);
const T = ctx.window.ZH_TERMINAL, CC = ctx.window.ZH_COLOR_CORE, SER = ctx.window.ZH_TERMINAL_SERIALIZE;

const failures = [];
const fail = m => failures.push(m);
const HEX = /^#[0-9a-fA-F]{6}$/;

/* ── 内置极简 TOML 解析器（真解析，malformed 即 throw）── */
function parseTOML(src) {
  const root = {}; let cur = root;
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;                  // 注释行整行以 # 开头（值里的 "#hex" 不受影响）
    if (line.startsWith('[')) {
      const end = line.indexOf(']'); if (end < 0) throw new Error('TOML: 未闭合表头 ' + line);
      cur = root; for (const seg of line.slice(1, end).split('.')) { cur[seg] = cur[seg] || {}; cur = cur[seg]; }
      continue;
    }
    const eq = line.indexOf('='); if (eq < 0) throw new Error('TOML: 非法行 ' + line);
    let val = line.slice(eq + 1).trim();
    if (val[0] === '"') { if (val[val.length - 1] !== '"') throw new Error('TOML: 未闭合字符串 ' + line); val = val.slice(1, -1); }
    cur[line.slice(0, eq).trim()] = val;
  }
  return root;
}

/* ── 单个调色板的契约校验 ── */
function checkPalette(label, p, mode) {
  if (!p) { fail(`${label}: build() 返回空`); return; }
  const bg = p.ui.background.hex;
  // 1. 槽完整
  if (p.slots.length !== 20) fail(`${label}: 槽数 ${p.slots.length} ≠ 20`);
  for (const s of p.slots) if (!HEX.test(s.hex)) fail(`${label}: ${s.key} hex 非法/空 = ${s.hex}`);
  // 2. 可读性契约
  for (const s of p.slots) {
    if (s.group === 'ui' && s.key === 'selection') continue;      // 选区单独查
    const fl = T.floorFor(s.key, mode);
    if (fl && CC.contrast(s.hex, bg) < fl - 0.01) fail(`${label}: ${s.key} 对比度 ${CC.contrast(s.hex, bg).toFixed(2)} < ${fl}`);
  }
  const selC = CC.contrast(p.ui.foreground.hex, p.ui.selection.hex);
  if (selC < T.LEGIBILITY.selection - 0.01) fail(`${label}: 选区正文对比度 ${selC.toFixed(2)} < ${T.LEGIBILITY.selection}`);
  const rg = CC.hueDist(CC.hueOf(p.ansi.red.hex), CC.hueOf(p.ansi.green.hex));
  if (rg < T.LEGIBILITY.redGreenHue) fail(`${label}: red↔green 色相分离 ${rg.toFixed(0)}° < ${T.LEGIBILITY.redGreenHue}°`);
  // 3. 正本清源：点名槽 id→hex 一致
  for (const s of p.slots) {
    if (s.nudged) continue;
    if (s.id == null) { fail(`${label}: ${s.key} 未标兜底却无 id`); continue; }
    const rec = T.REC(s.id);
    if (!rec) fail(`${label}: ${s.key} id=${s.id} 不存在`);
    else if (rec.hex.toLowerCase() !== s.hex.toLowerCase()) fail(`${label}: ${s.key} 点名色 ${s.id} hex 不一致 (${rec.hex} vs ${s.hex})`);
  }
  // 4. 锚色露脸
  if (p.ui.cursor.hex !== p.ansi[p.anchorSlot].hex) fail(`${label}: cursor 未取锚色槽`);
}

/* ── 三格式可解析 ── */
function checkFormats(label, p) {
  // Ghostty
  const g = SER.serialize('ghostty', p).text;
  for (let i = 0; i < 16; i++) if (!new RegExp(`palette = ${i}=#[0-9a-f]{6}`).test(g)) fail(`${label}/ghostty: 缺 palette ${i}`);
  for (const k of ['background', 'foreground', 'cursor-color', 'selection-background']) if (!new RegExp(`${k} = #[0-9a-f]{6}`).test(g)) fail(`${label}/ghostty: 缺 ${k}`);
  // Alacritty（真 TOML 解析）
  try {
    const t = SER.serialize('alacritty', p).text; const o = parseTOML(t);
    const need = [o?.colors?.primary?.background, o?.colors?.primary?.foreground, o?.colors?.cursor?.cursor, o?.colors?.selection?.background];
    for (const k of ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']) { need.push(o?.colors?.normal?.[k], o?.colors?.bright?.[k]); }
    for (const v of need) if (!HEX.test(v || '')) fail(`${label}/alacritty: 缺/非法色值 ${v}`);
  } catch (e) { fail(`${label}/alacritty: TOML 解析失败 — ${e.message}`); }
  // kitty
  const k = SER.serialize('kitty', p).text;
  for (let i = 0; i < 16; i++) if (!new RegExp(`color${i} #[0-9a-f]{6}`).test(k)) fail(`${label}/kitty: 缺 color${i}`);
  for (const key of ['background', 'foreground', 'cursor', 'selection_background']) if (!new RegExp(`${key} #[0-9a-f]{6}`).test(k)) fail(`${label}/kitty: 缺 ${key}`);
}

/* ── 命名样例（朱砂在库中不存在，用最近正色 朱红 替代）── */
const byName = {}; for (const c of T.ALL()) byName[c.name] = c.id;
const cases = [['竹青(默认)', byName['竹青']], ['朱红', byName['朱红']], ['竹青', byName['竹青']], ['鸦青', byName['鸦青']]];
for (const [nm, id] of cases) {
  if (!id) { fail(`样例色 ${nm} 不存在`); continue; }
  for (const mode of ['dark', 'light']) {
    const p = T.build(id, mode);
    checkPalette(`${nm}/${mode}`, p, mode);
    checkFormats(`${nm}/${mode}`, p);
  }
}

/* ── 全库压力扫描 ── */
let sweepErr = 0, slotN = 0, nud = 0, contractFail = 0;
for (const c of T.ALL()) for (const mode of ['dark', 'light']) {
  let p; try { p = T.build(c.id, mode); } catch (e) { sweepErr++; continue; }
  const bg = p.ui.background.hex;
  for (const s of p.slots) {
    slotN++; if (s.nudged) nud++;
    if (s.group === 'ui' && s.key === 'selection') continue;
    const fl = T.floorFor(s.key, mode);
    if (fl && CC.contrast(s.hex, bg) < fl - 0.01) contractFail++;
  }
  if (CC.contrast(p.ui.foreground.hex, p.ui.selection.hex) < T.LEGIBILITY.selection - 0.01) contractFail++;
}
if (sweepErr) fail(`全库扫描: ${sweepErr} 例抛错`);
if (contractFail) fail(`全库扫描: ${contractFail} 处契约违例`);
const nudRate = nud / slotN;
if (nudRate > 0.08) fail(`全库兜底率 ${(nudRate * 100).toFixed(2)}% 超过 8% 阈值`);

if (failures.length) {
  console.error('终端配色校验失败:\n' + failures.slice(0, 40).map(f => '  ✗ ' + f).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`终端配色校验通过：4 命名样例 × 暗/亮 契约+三格式解析，全库 ${T.ALL().length}×2 扫描 0 抛错 0 违例，兜底率 ${(nudRate * 100).toFixed(2)}%。`);
}
