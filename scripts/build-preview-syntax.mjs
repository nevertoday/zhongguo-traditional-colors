/*
 * build-preview-syntax.mjs
 * ---------------------------------------------------------------
 * 构建期预切分（见 docs/adr/0002）。把终端配色预览要展示的两份样本：
 *   · 一份真实仓库源码（默认 scripts/build-color-pages.mjs —— 给中国色工具自己的引擎上色）
 *   · 一份代表性 Markdown 文档（AI 输出风格）
 * 一次性 tokenize 成带 token 类名的静态 HTML，写进 assets/data/preview-syntax.js。
 * 代码以「逐行」形式输出（code.lines），页面据此渲染 bat 风格行号栏。
 *
 * 运行时不跑任何高亮器：token 类名经 CSS 变量映射到当前 ANSI 色，换锚色只改几个 CSS 变量。
 * token→ANSI / md→ANSI 约定对齐 bat / glow 主流（见 CONTEXT.md）。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const VERSION = '20260615-1';
const CODE_FILE = 'scripts/build-color-pages.mjs';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const span = (cls, s) => `<span class="${cls}">${esc(s)}</span>`;

/* ── 极简 JS 词法（仅供展示，非编译级）→ 记号数组 [{cls,text}]（cls=null 表示纯文本）──
   类别 → ANSI：comment→bright_black, keyword→magenta, string→green,
   number/常量→yellow, fn→blue, type→cyan，其余（运算符/标点/变量）→foreground。 */
const KEYWORDS = new Set(('const let var function return if else for while do switch case break continue new ' +
  'typeof instanceof in of class extends import export from default try catch finally throw await async yield ' +
  'delete void this super static get set as').split(' '));
const CONSTS = new Set('true false null undefined NaN Infinity'.split(' '));

function lexJS(src) {
  const toks = []; let i = 0; const n = src.length;
  const isId = c => /[A-Za-z0-9_$]/.test(c);
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { let j = i; while (j < n && src[j] !== '\n') j++; toks.push({ cls: 'tok-comment', text: src.slice(i, j) }); i = j; continue; }
    if (c === '/' && src[i + 1] === '*') { let j = i + 2; while (j < n && !(src[j] === '*' && src[j + 1] === '/')) j++; j = Math.min(n, j + 2); toks.push({ cls: 'tok-comment', text: src.slice(i, j) }); i = j; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1; while (j < n) { if (src[j] === '\\') { j += 2; continue; } if (src[j] === c) { j++; break; } j++; }
      toks.push({ cls: 'tok-string', text: src.slice(i, j) }); i = j; continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
      let j = i; while (j < n && /[0-9a-fA-FxX._]/.test(src[j])) j++; toks.push({ cls: 'tok-number', text: src.slice(i, j) }); i = j; continue;
    }
    if (isId(c) && !/[0-9]/.test(c)) {
      let j = i; while (j < n && isId(src[j])) j++;
      const word = src.slice(i, j);
      let k = j; while (k < n && /\s/.test(src[k])) k++;
      const callish = src[k] === '(';
      const cls = KEYWORDS.has(word) ? 'tok-keyword' : CONSTS.has(word) ? 'tok-number'
        : /^[A-Z]/.test(word) ? 'tok-type' : callish ? 'tok-fn' : null;
      toks.push({ cls, text: word }); i = j; continue;
    }
    toks.push({ cls: null, text: c }); i++;
  }
  return toks;
}

// 记号 → 单串 HTML（用于 md 代码围栏）
const tokensToHTML = toks => toks.map(t => (t.cls ? span(t.cls, t.text) : esc(t.text))).join('');
// 记号 → 逐行 HTML 数组（每行独立合法，跨行块注释/模板串被安全切分到各行）
function tokensToLines(toks) {
  const lines = []; let cur = '';
  for (const t of toks) {
    const parts = t.text.split('\n');
    for (let p = 0; p < parts.length; p++) {
      if (p > 0) { lines.push(cur); cur = ''; }
      if (parts[p] !== '') cur += t.cls ? span(t.cls, parts[p]) : esc(parts[p]);
    }
  }
  lines.push(cur);
  return lines;
}

/* ── 代表性 Markdown 样本（AI 输出风格）── */
const MD_SAMPLE = `# 把生成的主题装进 Ghostty

挑一个中国传统色作**锚色**，本工具就为你点名出一整套 16 色 ANSI 调色板——
每个色都是有名有姓的传统色，没有凭空插值的颜色。

## 三步落地

1. 复制下方 \`Ghostty\` 配置块
2. 存成 \`~/.config/ghostty/themes/zhongguo\`
3. 在 \`config\` 里写 \`theme = zhongguo\`，重启即可

> 提示：所有 \`*-foreground\` 与背景的对比度都过了 **WCAG AA**，
> 注释灰也保证「暗而可辨」，长时间盯着不累眼。

\`\`\`js
// 锚色 → 调色板，全程 snap 真实命名色
const palette = ZH_TERMINAL.build(anchorId, 'dark');
for (const slot of palette.slots) {
  if (slot.nudged) console.warn('算法兜底:', slot.key);
}
\`\`\`

想换一套？回到[色卡库](https://colors.xiaoxiaodong.ai)再点一个锚色就好。`;

function renderMarkdown(md) {
  const inline = s => esc(s)
    .replace(/\*\*([^*]+)\*\*/g, (_, t) => `<span class="md-strong">${t}</span>`)
    .replace(/(^|[^*])\*([^*]+)\*/g, (_, p, t) => `${p}<span class="md-em">${t}</span>`)
    .replace(/`([^`]+)`/g, (_, t) => `<span class="md-code">${t}</span>`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t) => `<span class="md-link">${t}</span>`);
  const lines = md.split('\n'); const out = []; let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (ln.startsWith('```')) {
      let j = i + 1; const body = []; while (j < lines.length && !lines[j].startsWith('```')) body.push(lines[j++]);
      out.push(`<div class="md-codeblock">${tokensToHTML(lexJS(body.join('\n')))}</div>`); i = j + 1; continue;
    }
    if (/^#\s/.test(ln)) out.push(`<div class="md-h1">${inline(ln.slice(2))}</div>`);
    else if (/^##\s/.test(ln)) out.push(`<div class="md-h2">${inline(ln.slice(3))}</div>`);
    else if (/^>\s?/.test(ln)) out.push(`<div class="md-quote">${inline(ln.replace(/^>\s?/, ''))}</div>`);
    else if (/^\d+\.\s/.test(ln)) out.push(`<div class="md-li"><span class="md-bullet">${ln.match(/^\d+\./)[0]}</span> ${inline(ln.replace(/^\d+\.\s/, ''))}</div>`);
    else if (/^[-*]\s/.test(ln)) out.push(`<div class="md-li"><span class="md-bullet">•</span> ${inline(ln.slice(2))}</div>`);
    else if (ln.trim() === '') out.push('<div class="md-gap"></div>');
    else out.push(`<div class="md-p">${inline(ln)}</div>`);
    i++;
  }
  return out.join('\n');
}

/* ── 生成 ── */
const codeSrc = readFileSync(join(ROOT, CODE_FILE), 'utf8');
const codeLines = tokensToLines(lexJS(codeSrc));
const mdHtml = renderMarkdown(MD_SAMPLE);

const data = {
  version: VERSION,
  code: { file: CODE_FILE, lang: 'js', lineCount: codeLines.length, lines: codeLines },
  markdown: { html: mdHtml },
};

const banner = `/* Generated by scripts/build-preview-syntax.mjs (v${VERSION}). Do not edit by hand. */\n`;
writeFileSync(join(ROOT, 'assets/data/preview-syntax.js'), banner + `window.ZH_PREVIEW_SYNTAX = ${JSON.stringify(data)};\n`);
console.log(`✓ preview-syntax.js 生成：${CODE_FILE} ${data.code.lineCount} 行（逐行）+ Markdown 样本`);
