/*
 * 文字令牌 × 承载面的 WCAG AA 校验。
 *
 * 缘起：DESIGN.md 曾声称「muted/line 令牌已调到能在 --paper 上通过」，但 --muted
 * 实际压在三个面上（paper / panel / panel-soft），而最暗的 --panel-soft 才是约束点。
 * #777777 在三面上分别只有 4.17 / 4.48 / 3.86，三面皆不过 AA —— 一条只靠文档
 * 声明、无人看守的规则，撑了很久。这个脚本把那句声明变成门禁。
 */
import { readFileSync } from 'node:fs';

const source = readFileSync('assets/css/styles.css', 'utf8');

/* 取出 :root 与 :root[data-theme="dark"] 两个令牌块里的 --name: #hex; */
function tokensOf(selector) {
  const at = source.indexOf(selector);
  if (at === -1) throw new Error(`Cannot find token block for ${selector}.`);
  const block = source.slice(at, source.indexOf('}', at));
  const out = {};
  for (const [, name, hex] of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    out[name] = hex;
  }
  return out;
}

const srgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const relLum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (a, b) => {
  const x = relLum(srgb(a)), y = relLum(srgb(b));
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
};

/* 正文尺寸的文字一律 4.5。三个面都要过，最暗的那个才是约束点。 */
const TEXT = ['ink', 'ink-soft', 'muted'];
const SURFACES = ['paper', 'panel', 'panel-soft'];
const AA = 4.5;

const failures = [];
let checked = 0;

for (const [theme, selector] of [['light', ':root {'], ['dark', ':root[data-theme="dark"] {']]) {
  const t = tokensOf(selector);
  for (const text of TEXT) {
    for (const surface of SURFACES) {
      if (!t[text] || !t[surface]) throw new Error(`${theme}: missing --${text} or --${surface}.`);
      const ratio = contrast(t[text], t[surface]);
      checked++;
      if (ratio < AA) {
        failures.push(
          `  ${theme.padEnd(5)} --${text} ${t[text]} on --${surface} ${t[surface]} ` +
          `= ${ratio.toFixed(2)}:1  (needs ${AA})`
        );
      }
    }
  }
}

if (failures.length) {
  throw new Error(`Contrast verification failed (${failures.length}/${checked}):\n${failures.join('\n')}`);
}

console.log(`Contrast verification passed (${checked} text-on-surface pairs, AA ${AA}:1).`);
