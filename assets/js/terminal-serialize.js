/*
 * 终端调色板序列化 · 一份调色板 → Ghostty / Alacritty / kitty 配置文本
 * ---------------------------------------------------------------
 * 三种格式都是「16 ANSI + UI」同构，纯模板转译（见 docs/adr/0001、CONTEXT.md）。
 * 输入：window.ZH_TERMINAL.build() 的返回值（{anchor, mode, ansi, ui, order, ...}）。
 *
 * 浏览器 window 模块（无打包）。
 * 暴露：window.ZH_TERMINAL_SERIALIZE = { FORMATS, serialize }
 *   FORMATS: [{ key, label, lang, ext }]
 *   serialize(format, palette) -> { text, filename, lang }
 */
(function () {
  'use strict';
  const hx = t => t.hex.toLowerCase();
  // 用于文件名：去掉可能干扰文件系统的字符。
  const slug = p => `中国色-${p.anchor.name}-${p.mode === 'dark' ? '暗' : '亮'}`;
  // Claude Code 用法提示 —— 随配置一起带走，落到「粘完发现没生效」的那一刻正好能看到。
  const CLAUDE_TIP = '想用于 Claude Code？在其内 /theme → 选 Dark mode (ANSI colors only)，本配色才会接管它的灰字 / diff / 语法高亮（否则只改终端底色）。';
  const header = (p, comment) => {
    const a = p.anchor;
    return [
      `${comment} 中国传统色终端配色 · 锚色「${a.name}」 ${a.hex.toUpperCase()} · NO.${a.id} · ${p.mode === 'dark' ? '暗色' : '亮色'}`,
      `${comment} 由 colors.xiaoxiaodong.ai 终端配色生成 —— 正本清源：每色皆有名有姓的传统色`,
      `${comment} ${CLAUDE_TIP}`,
    ].join('\n');
  };
  // 一个槽的传统色名（兜底色无名）—— 用于注释。
  const desc = t => t.name || '算法兜底';

  /* ── Ghostty ──
     关键：Ghostty 不支持行尾注释，`#` 之后会被并进取值（palette = 0=#xxx  # 名 → 整段当色值 → config error）。
     因此色名一律单独占「上一行」注释，绝不与 key=value 同行。 */
  function ghostty(p) {
    const lines = [
      header(p, '#'),
      '# 注：Ghostty 不支持行尾注释，故每色的传统色名单独占上一行。',
      '',
      '# ── 16 色 ANSI ──',
    ];
    p.order.forEach((k, i) => { const t = p.ansi[k]; lines.push(`# ${i} ${k} · ${desc(t)}`, `palette = ${i}=${hx(t)}`); });
    lines.push(
      '',
      '# ── 界面 UI ──',
      `# background · ${desc(p.ui.background)}`,
      `background = ${hx(p.ui.background)}`,
      `# foreground · ${desc(p.ui.foreground)}`,
      `foreground = ${hx(p.ui.foreground)}`,
      `# cursor · ${desc(p.ui.cursor)}`,
      `cursor-color = ${hx(p.ui.cursor)}`,
      `cursor-text = ${hx(p.ui.background)}`,
      `# selection · ${desc(p.ui.selection)}`,
      `selection-background = ${hx(p.ui.selection)}`,
      `selection-foreground = ${hx(p.ui.foreground)}`,
    );
    return lines.join('\n') + '\n';
  }

  /* ── Alacritty（TOML, v0.13+）──
     TOML 支持行尾 `#` 注释，故色名可与取值同行（保留紧凑写法）。 */
  function alacritty(p) {
    const q = t => `"${hx(t)}"`;
    const grp = keys => keys.map(k => `${k.replace('bright_', '')} = ${q(p.ansi[k])}  # ${desc(p.ansi[k])}`).join('\n');
    const normal = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
    const bright = ['bright_black', 'bright_red', 'bright_green', 'bright_yellow', 'bright_blue', 'bright_magenta', 'bright_cyan', 'bright_white'];
    return [
      header(p, '#'), '',
      '[colors.primary]',
      `background = ${q(p.ui.background)}  # ${desc(p.ui.background)}`,
      `foreground = ${q(p.ui.foreground)}  # ${desc(p.ui.foreground)}`, '',
      '[colors.cursor]',
      `cursor = ${q(p.ui.cursor)}  # ${desc(p.ui.cursor)}`,
      `text = ${q(p.ui.background)}`, '',
      '[colors.selection]',
      `background = ${q(p.ui.selection)}  # ${desc(p.ui.selection)}`,
      `text = ${q(p.ui.foreground)}`, '',
      '[colors.normal]', grp(normal), '',
      '[colors.bright]', grp(bright), '',
    ].join('\n');
  }

  /* ── kitty ──
     关键：kitty 同样不支持行尾注释（`#` 必须是行首字符），故色名单独占上一行。 */
  function kitty(p) {
    const lines = [
      header(p, '#'),
      '# 注：kitty 不支持行尾注释，故每色的传统色名单独占上一行。',
      '',
      '# ── 界面 UI ──',
      `# background · ${desc(p.ui.background)}`,
      `background ${hx(p.ui.background)}`,
      `# foreground · ${desc(p.ui.foreground)}`,
      `foreground ${hx(p.ui.foreground)}`,
      `# cursor · ${desc(p.ui.cursor)}`,
      `cursor ${hx(p.ui.cursor)}`,
      `cursor_text_color ${hx(p.ui.background)}`,
      `# selection · ${desc(p.ui.selection)}`,
      `selection_background ${hx(p.ui.selection)}`,
      `selection_foreground ${hx(p.ui.foreground)}`,
      '',
      '# ── 16 色 ANSI ──',
    ];
    p.order.forEach((k, i) => { const t = p.ansi[k]; lines.push(`# ${i} ${k} · ${desc(t)}`, `color${i} ${hx(t)}`); });
    return lines.join('\n') + '\n';
  }

  /* ── iTerm2（.itermcolors，XML plist；分量为 0–1 实数）──
     plist 无 key=value 行注释概念，但 XML 注释 <!-- --> 合法且被解析器忽略，故色名走 XML 注释，不污染数据。 */
  function iterm2(p) {
    const comp = hex => { const h = hex.replace('#', ''); return [0, 2, 4].map(i => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(6)); };
    const block = (label, hex, name) => {
      const [r, g, b] = comp(hex);
      return (name ? `  <!-- ${name} -->\n` : '')
        + `  <key>${label}</key>\n  <dict>\n`
        + `    <key>Color Space</key>\n    <string>sRGB</string>\n`
        + `    <key>Red Component</key>\n    <real>${r}</real>\n`
        + `    <key>Green Component</key>\n    <real>${g}</real>\n`
        + `    <key>Blue Component</key>\n    <real>${b}</real>\n`
        + `    <key>Alpha Component</key>\n    <real>1</real>\n  </dict>`;
    };
    const lines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
      `<!-- 中国传统色终端配色 · 锚色「${p.anchor.name}」 ${p.anchor.hex.toUpperCase()} · NO.${p.anchor.id} · ${p.mode === 'dark' ? '暗色' : '亮色'} · colors.xiaoxiaodong.ai -->`,
      `<!-- ${CLAUDE_TIP} -->`,
      '<plist version="1.0">',
      '<dict>',
    ];
    p.order.forEach((k, i) => { const t = p.ansi[k]; lines.push(block(`Ansi ${i} Color`, hx(t), t.name)); });
    lines.push(
      block('Background Color', hx(p.ui.background), p.ui.background.name),
      block('Foreground Color', hx(p.ui.foreground), p.ui.foreground.name),
      block('Bold Color', hx(p.ui.foreground), null),
      block('Cursor Color', hx(p.ui.cursor), p.ui.cursor.name),
      block('Cursor Text Color', hx(p.ui.background), null),
      block('Selection Color', hx(p.ui.selection), p.ui.selection.name),
      block('Selected Text Color', hx(p.ui.foreground), null),
      '</dict>',
      '</plist>',
    );
    return lines.join('\n') + '\n';
  }

  /* ── WezTerm（color scheme TOML，置于 colors/ 目录）── */
  function wezterm(p) {
    const q = t => `"${hx(t)}"`;
    const normal = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
    const bright = ['bright_black', 'bright_red', 'bright_green', 'bright_yellow', 'bright_blue', 'bright_magenta', 'bright_cyan', 'bright_white'];
    const arr = keys => `[${keys.map(k => q(p.ansi[k])).join(', ')}]`;
    const names = keys => keys.map(k => desc(p.ansi[k])).join(' / ');
    return [
      header(p, '#'), '',
      '[metadata]',
      `name = "${slug(p)}"`, '',
      '[colors]',
      `foreground = ${q(p.ui.foreground)}  # ${desc(p.ui.foreground)}`,
      `background = ${q(p.ui.background)}  # ${desc(p.ui.background)}`,
      `cursor_bg = ${q(p.ui.cursor)}  # ${desc(p.ui.cursor)}`,
      `cursor_border = ${q(p.ui.cursor)}`,
      `cursor_fg = ${q(p.ui.background)}`,
      `selection_bg = ${q(p.ui.selection)}  # ${desc(p.ui.selection)}`,
      `selection_fg = ${q(p.ui.foreground)}`, '',
      `# ANSI 0-7 ：${names(normal)}`,
      `ansi = ${arr(normal)}`,
      `# ANSI 8-15：${names(bright)}`,
      `brights = ${arr(bright)}`, '',
    ].join('\n');
  }

  /* ── Windows Terminal（settings.json 的 schemes 数组项）──
     严格 JSON：不能带任何注释（吸取 Ghostty 教训，宁可不带色名也不产出会粘报错的配置）。
     色名靠工具右侧标本面板查看；magenta 在 WT 里叫 purple。 */
  function windowsTerminal(p) {
    const WT = { black: 'black', red: 'red', green: 'green', yellow: 'yellow', blue: 'blue', magenta: 'purple', cyan: 'cyan', white: 'white',
      bright_black: 'brightBlack', bright_red: 'brightRed', bright_green: 'brightGreen', bright_yellow: 'brightYellow',
      bright_blue: 'brightBlue', bright_magenta: 'brightPurple', bright_cyan: 'brightCyan', bright_white: 'brightWhite' };
    const obj = {
      name: slug(p),
      background: hx(p.ui.background), foreground: hx(p.ui.foreground),
      cursorColor: hx(p.ui.cursor), selectionBackground: hx(p.ui.selection),
    };
    for (const k of p.order) obj[WT[k]] = hx(p.ansi[k]);
    return JSON.stringify(obj, null, 2) + '\n';
  }

  /* ── Vim / Neovim colorscheme（同一套调色板 → 编辑器高亮）──
     双写 gui（真彩 hex）+ cterm（0-15 ANSI 索引），所以开 termguicolors 用精确 hex、
     16 色终端下复用你导出的终端调色板 —— 终端与编辑器一致。vim 8 / Neovim 通用。 */
  const vimName = p => `zhongguo-${p.anchor.id}-${p.mode === 'dark' ? 'dark' : 'light'}`;
  function vim(p) {
    const CC = window.ZH_COLOR_CORE;
    const A = p.ansi, dark = p.mode === 'dark', name = vimName(p);
    const idx = {}; p.order.forEach((k, i) => { idx[k] = i; });      // ANSI role → 0-15
    const FG = hx(p.ui.foreground), BG = hx(p.ui.background), SEL = hx(p.ui.selection);
    // 抬升面（CursorLine/Pmenu 等）：在 bg 上沿 OKLab 明度微调一档
    const surf = (() => { const o = CC.hexOklab(BG); return CC.oklabHex({ ...o, L: dark ? Math.min(1, o.L + 0.055) : Math.max(0, o.L - 0.05) }).toLowerCase(); })();
    const res = spec => {
      if (spec == null) return null;
      if (spec === 'FG') return { gui: FG, cterm: 'NONE' };
      if (spec === 'BG') return { gui: BG, cterm: 'NONE' };
      if (spec === 'SEL') return { gui: SEL, cterm: 8 };
      if (spec === 'SURF') return { gui: surf, cterm: 'NONE' };
      if (spec === 'SURF8') return { gui: surf, cterm: 8 };
      if (spec === 'CUR') return { gui: hx(p.ui.cursor), cterm: idx[p.anchorSlot] };   // 光标用锚色，与终端导出的 cursor 一致
      return { gui: hx(A[spec]), cterm: idx[spec] };                 // ANSI role
    };
    const hl = (g, f, b, a) => {
      const F = res(f), B = res(b), attr = a || 'NONE';
      return `hi ${g} guifg=${F ? F.gui : 'NONE'} guibg=${B ? B.gui : 'NONE'} gui=${attr} ctermfg=${F ? F.cterm : 'NONE'} ctermbg=${B ? B.cterm : 'NONE'} cterm=${attr}`;
    };
    // [组, 前景, 背景, 属性]；前景/背景可为 ANSI 键 / 'FG' 'BG' 'SEL' 'SURF' 'SURF8' / null
    const T = [
      ['Normal', 'FG', 'BG', null], ['NormalNC', 'FG', 'BG', null], ['NormalFloat', 'FG', 'SURF', null],
      ['Comment', 'bright_black', null, 'italic'],
      ['Constant', 'green', null, null], ['String', 'green', null, null], ['Character', 'green', null, null],
      ['Number', 'yellow', null, null], ['Boolean', 'yellow', null, null], ['Float', 'yellow', null, null],
      ['Identifier', 'cyan', null, null], ['Function', 'blue', null, null],
      ['Statement', 'magenta', null, null], ['Conditional', 'magenta', null, null], ['Repeat', 'magenta', null, null],
      ['Label', 'magenta', null, null], ['Operator', 'FG', null, null], ['Keyword', 'magenta', null, null], ['Exception', 'red', null, null],
      ['PreProc', 'yellow', null, null], ['Include', 'magenta', null, null], ['Define', 'magenta', null, null], ['Macro', 'magenta', null, null], ['PreCondit', 'yellow', null, null],
      ['Type', 'cyan', null, null], ['StorageClass', 'cyan', null, null], ['Structure', 'cyan', null, null], ['Typedef', 'cyan', null, null],
      ['Special', 'cyan', null, null], ['SpecialChar', 'red', null, null], ['Tag', 'cyan', null, null], ['Delimiter', 'FG', null, null], ['SpecialComment', 'bright_black', null, 'italic'], ['Debug', 'red', null, null],
      ['Underlined', 'blue', null, 'underline'], ['Ignore', 'bright_black', null, null], ['Error', 'bright_red', null, 'bold'], ['Todo', 'black', 'yellow', 'bold'],
      ['LineNr', 'bright_black', null, null], ['CursorLineNr', 'yellow', 'SURF', 'bold'], ['CursorLine', null, 'SURF', null], ['CursorColumn', null, 'SURF', null], ['ColorColumn', null, 'SURF8', null],
      ['Cursor', 'BG', 'CUR', null], ['lCursor', 'BG', 'CUR', null], ['TermCursor', 'BG', 'CUR', null], ['Visual', null, 'SEL', null], ['VisualNOS', null, 'SEL', null],
      ['Search', 'black', 'yellow', null], ['IncSearch', 'black', 'bright_yellow', 'bold'], ['CurSearch', 'black', 'bright_yellow', 'bold'], ['MatchParen', 'cyan', 'SURF8', 'bold'],
      ['Pmenu', 'FG', 'SURF8', null], ['PmenuSel', 'black', 'cyan', 'bold'], ['PmenuSbar', null, 'SURF8', null], ['PmenuThumb', null, 'bright_black', null], ['WildMenu', 'black', 'cyan', null],
      ['StatusLine', 'FG', 'SURF8', 'bold'], ['StatusLineNC', 'bright_black', 'SURF8', null], ['TabLine', 'bright_black', 'SURF8', null], ['TabLineSel', 'FG', 'SURF', 'bold'], ['TabLineFill', null, 'SURF8', null],
      ['VertSplit', 'bright_black', null, null], ['WinSeparator', 'bright_black', null, null], ['Folded', 'bright_black', 'SURF', 'italic'], ['FoldColumn', 'bright_black', null, null], ['SignColumn', 'bright_black', null, null],
      ['Title', 'blue', null, 'bold'], ['Directory', 'blue', null, null], ['NonText', 'bright_black', null, null], ['SpecialKey', 'bright_black', null, null], ['EndOfBuffer', 'bright_black', null, null],
      ['ErrorMsg', 'red', null, null], ['WarningMsg', 'yellow', null, null], ['ModeMsg', 'green', null, null], ['MoreMsg', 'green', null, null], ['Question', 'green', null, null], ['Conceal', 'bright_black', null, null],
      ['DiffAdd', 'green', 'SURF', null], ['DiffChange', 'yellow', 'SURF', null], ['DiffDelete', 'red', 'SURF', null], ['DiffText', 'blue', 'SURF8', 'bold'],
      ['diffAdded', 'green', null, null], ['diffRemoved', 'red', null, null], ['diffChanged', 'yellow', null, null],
      ['DiagnosticError', 'red', null, null], ['DiagnosticWarn', 'yellow', null, null], ['DiagnosticInfo', 'blue', null, null], ['DiagnosticHint', 'cyan', null, null], ['DiagnosticOk', 'green', null, null],
      ['GitSignsAdd', 'green', null, null], ['GitSignsChange', 'yellow', null, null], ['GitSignsDelete', 'red', null, null],
    ];
    // Treesitter / LSP：链接到上面的基础组，一套映射两边都好看
    const LINKS = [
      ['@comment', 'Comment'], ['@string', 'String'], ['@character', 'Character'], ['@number', 'Number'], ['@boolean', 'Boolean'], ['@float', 'Float'],
      ['@keyword', 'Keyword'], ['@conditional', 'Conditional'], ['@repeat', 'Repeat'], ['@operator', 'Operator'], ['@exception', 'Exception'],
      ['@function', 'Function'], ['@function.call', 'Function'], ['@method', 'Function'], ['@constructor', 'Special'],
      ['@variable', 'Identifier'], ['@variable.builtin', 'Special'], ['@property', 'Identifier'], ['@field', 'Identifier'], ['@parameter', 'Identifier'],
      ['@type', 'Type'], ['@type.builtin', 'Type'], ['@namespace', 'Type'], ['@constant', 'Constant'], ['@constant.builtin', 'Number'],
      ['@preproc', 'PreProc'], ['@include', 'Include'], ['@punctuation', 'Delimiter'], ['@tag', 'Tag'], ['@attribute', 'PreProc'],
      ['@lsp.type.class', 'Type'], ['@lsp.type.function', 'Function'], ['@lsp.type.variable', 'Identifier'], ['@lsp.type.keyword', 'Keyword'],
    ];
    const body = T.map(([g, f, b, a]) => hl(g, f, b, a)).join('\n');
    const links = LINKS.map(([a, b]) => `hi! link ${a} ${b}`).join('\n');
    const italics = T.filter(r => r[3] === 'italic').map(r => r[0]);   // 可一键关斜体的组
    return [
      `" 中国传统色 编辑器主题 · 锚色「${p.anchor.name}」 ${p.anchor.hex.toUpperCase()} · NO.${p.anchor.id} · ${dark ? '暗色' : '亮色'}`,
      `" 由 colors.xiaoxiaodong.ai 生成 —— gui(真彩 hex) + cterm(16 色 ANSI)，vim 8 / Neovim 通用。`,
      `" 装法：存为 ~/.vim/colors/${name}.vim 或 ~/.config/nvim/colors/${name}.vim，再 :colorscheme ${name}`,
      `" 16 色终端下请同时套用本工具导出的同名终端配色，cterm 部分才与真彩一致。`,
      '',
      `set background=${dark ? 'dark' : 'light'}`,
      'hi clear',
      'if exists("syntax_on") | syntax reset | endif',
      `let g:colors_name = "${name}"`,
      '',
      body,
      '',
      '" ── Treesitter / LSP（仅 Neovim：@ 与 . 在 vim 8 的组名里非法，会触发 W18）──',
      "if has('nvim')",
      links.split('\n').map(l => '  ' + l).join('\n'),
      'endif',
      '',
      '" 关斜体：在 :colorscheme 之前 let g:zhongguo_italic = 0',
      "if !get(g:, 'zhongguo_italic', 1)",
      italics.map(g => `  hi ${g} cterm=NONE gui=NONE`).join('\n'),
      'endif',
      '',
    ].join('\n');
  }

  const IMPL = { ghostty, alacritty, kitty, iterm2, wezterm, 'windows-terminal': windowsTerminal, vim };
  const FORMATS = [
    { key: 'ghostty', label: 'Ghostty', lang: 'ini', ext: 'conf', hint: '存为 theme 文件，config 里写 theme =' },
    { key: 'alacritty', label: 'Alacritty', lang: 'toml', ext: 'toml', hint: '导入 alacritty.toml（v0.13+）' },
    { key: 'kitty', label: 'kitty', lang: 'ini', ext: 'conf', hint: 'include 进 kitty.conf' },
    { key: 'iterm2', label: 'iTerm2', lang: 'xml', ext: 'itermcolors', hint: 'Preferences → Profiles → Colors 导入' },
    { key: 'wezterm', label: 'WezTerm', lang: 'toml', ext: 'toml', hint: '存到 colors/，color_scheme =' },
    { key: 'windows-terminal', label: 'Windows Terminal', lang: 'json', ext: 'json', hint: '粘进 settings.json 的 schemes 数组' },
    { key: 'vim', label: 'Vim / Neovim', lang: 'vim', ext: 'vim', hint: '编辑器主题 · 存到 colors/，:colorscheme', file: p => `${vimName(p)}.vim` },
  ];
  function serialize(format, palette) {
    const f = FORMATS.find(x => x.key === format);
    if (!f || !IMPL[format]) return null;
    // colorscheme 文件名须与 :colorscheme 名一致（ASCII），故 vim 自带 file()；其余沿用中文 slug。
    const filename = f.file ? f.file(palette) : `${slug(palette)}-${format}.${f.ext}`;
    return { text: IMPL[format](palette), filename, lang: f.lang };
  }

  window.ZH_TERMINAL_SERIALIZE = { FORMATS, serialize };
})();
