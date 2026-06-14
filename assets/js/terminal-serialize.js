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
  const idx = (p, key) => p.order.indexOf(key);
  // 用于文件名：去掉可能干扰文件系统的字符。
  const slug = p => `中国色-${p.anchor.name}-${p.mode === 'dark' ? '暗' : '亮'}`;
  const header = (p, comment) => {
    const a = p.anchor;
    return [
      `${comment} 中国传统色终端配色 · 锚色「${a.name}」 ${a.hex.toUpperCase()} · NO.${a.id} · ${p.mode === 'dark' ? '暗色' : '亮色'}`,
      `${comment} 由 colors.xiaoxiaodong.ai 终端配色生成 —— 正本清源：每色皆有名有姓的传统色`,
    ].join('\n');
  };

  /* ── Ghostty ── */
  function ghostty(p) {
    const lines = [header(p, '#'), ''];
    p.order.forEach((k, i) => { const t = p.ansi[k]; lines.push(`palette = ${i}=${hx(t)}${t.name ? `  # ${t.name}` : ''}`); });
    lines.push('');
    lines.push(`background = ${hx(p.ui.background)}`);
    lines.push(`foreground = ${hx(p.ui.foreground)}`);
    lines.push(`cursor-color = ${hx(p.ui.cursor)}`);
    lines.push(`cursor-text = ${hx(p.ui.background)}`);
    lines.push(`selection-background = ${hx(p.ui.selection)}`);
    lines.push(`selection-foreground = ${hx(p.ui.foreground)}`);
    return lines.join('\n') + '\n';
  }

  /* ── Alacritty（TOML, v0.13+）── */
  function alacritty(p) {
    const q = t => `"${hx(t)}"`;
    const grp = keys => keys.map(k => `${k.replace('bright_', '')} = ${q(p.ansi[k])}`).join('\n');
    const normal = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
    const bright = ['bright_black', 'bright_red', 'bright_green', 'bright_yellow', 'bright_blue', 'bright_magenta', 'bright_cyan', 'bright_white'];
    return [
      header(p, '#'), '',
      '[colors.primary]',
      `background = ${q(p.ui.background)}`,
      `foreground = ${q(p.ui.foreground)}`, '',
      '[colors.cursor]',
      `cursor = ${q(p.ui.cursor)}`,
      `text = ${q(p.ui.background)}`, '',
      '[colors.selection]',
      `background = ${q(p.ui.selection)}`,
      `text = ${q(p.ui.foreground)}`, '',
      '[colors.normal]', grp(normal), '',
      '[colors.bright]', grp(bright), '',
    ].join('\n');
  }

  /* ── kitty ── */
  function kitty(p) {
    const lines = [header(p, '#'), ''];
    lines.push(`background ${hx(p.ui.background)}`);
    lines.push(`foreground ${hx(p.ui.foreground)}`);
    lines.push(`cursor ${hx(p.ui.cursor)}`);
    lines.push(`cursor_text_color ${hx(p.ui.background)}`);
    lines.push(`selection_background ${hx(p.ui.selection)}`);
    lines.push(`selection_foreground ${hx(p.ui.foreground)}`);
    lines.push('');
    p.order.forEach((k, i) => { const t = p.ansi[k]; lines.push(`color${i} ${hx(t)}${t.name ? `  # ${t.name}` : ''}`); });
    return lines.join('\n') + '\n';
  }

  const IMPL = { ghostty, alacritty, kitty };
  const FORMATS = [
    { key: 'ghostty', label: 'Ghostty', lang: 'ini', ext: 'conf' },
    { key: 'alacritty', label: 'Alacritty', lang: 'toml', ext: 'toml' },
    { key: 'kitty', label: 'kitty', lang: 'ini', ext: 'conf' },
  ];
  function serialize(format, palette) {
    const f = FORMATS.find(x => x.key === format);
    if (!f || !IMPL[format]) return null;
    return { text: IMPL[format](palette), filename: `${slug(palette)}-${format}.${f.ext}`, lang: f.lang };
  }

  window.ZH_TERMINAL_SERIALIZE = { FORMATS, serialize };
})();
