/* 终端配色页面脚本 —— 消费 window.ZH_TERMINAL（terminal-tokens.js）、
   window.ZH_TERMINAL_SERIALIZE（三格式序列化）、window.ZH_PREVIEW_SYNTAX（构建期预切分的代码/md）。
   负责：把调色板灌成 CSS 变量驱动的「一页连续假终端会话」、渲染色板带与标本、切格式、复制/下载。 */
(function () {
  'use strict';
  const T = window.ZH_TERMINAL, SER = window.ZH_TERMINAL_SERIALIZE, SYN = window.ZH_PREVIEW_SYNTAX;
  if (!T || !SER) { console.error('[Terminal] 缺少 terminal-tokens.js / terminal-serialize.js'); return; }
  const root = document.querySelector('.term-root');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const ALL = T.ALL(), REC = T.REC;
  const term = $('[data-term]');
  let state = { id: null, mode: 'dark', fmt: 'ghostty' };
  let current = null;

  /* ── 一页连续的「真终端会话」：fastfetch → ls → git → bat → glow，一路下滚，无 tab。──
     锚色在每行提示符 ❯ 上发光、贯穿全程；fetch 色块 + ls + git 把整套 16 色摊开，不再一片绿。
     fastfetch/ls/git 是终端逐格真渲染的东西（程序直接打 ANSI），1:1 忠实于导出的调色板；
     代码段诚实标注 bat --theme=ansi（唯有 16 色 ANSI 高亮才真的走这套板子）。全靠 CSS 变量重染。 */
  const LOGO = [
    ' ▄▄▄▄▄▄▄▄ ', '█        █', '█  ▄▄▄▄  █', '█  █  █  █',
    '█  █  █  █', '█  ▀▀▀▀  █', '█        █', ' ▀▀▀▀▀▀▀▀ ',
  ].join('\n');
  const blockRow = from => T.ANSI_ORDER.slice(from, from + 8).map(k => `<span style="background:var(--ansi-${k})"></span>`).join('');
  const PR = `<span class="a-grn">guanxing</span><span class="a-dim">@</span><span class="a-blu">studio</span> <span class="a-cyn">~/works/zhongguo</span> <span class="pr">❯</span> `;
  const cmd = c => `<div class="cmd">${PR}${c}</div>`;

  const FETCH =
    `<div class="fetch">` +
      `<pre class="logo">${LOGO}</pre>` +
      `<div class="finfo">` +
        `<div class="fhdr"><span class="a-grn">guanxing</span><span class="a-dim">@</span><span class="a-blu">studio</span></div>` +
        `<div class="frule">───────────────────────────</div>` +
        `<div class="frow"><span class="fk">OS</span>macOS 15.5 Sequoia</div>` +
        `<div class="frow"><span class="fk">Shell</span>zsh 5.9</div>` +
        `<div class="frow"><span class="fk">Terminal</span>Ghostty 1.0</div>` +
        `<div class="frow"><span class="fk">Theme</span><span data-fetch-theme>—</span></div>` +
        `<div class="frow"><span class="fk">Palette</span><span data-fetch-prov>—</span></div>` +
        `<div class="frow"><span class="fk">Font</span>Space Mono · 12pt</div>` +
        `<div class="fblocks"><div class="fbrow">${blockRow(0)}</div><div class="fbrow">${blockRow(8)}</div></div>` +
      `</div>` +
    `</div>`;
  // bat 代码片段：取真实文件中段、带真实行号；只展示一屏量，不做 480 行长滚。
  const cs = 17, cn = 44;
  const CODE = (SYN && SYN.code)
    ? `<div class="codeblk">` + SYN.code.lines.slice(cs, cs + cn).map((h, i) => `<div class="cl"><i>${cs + i + 1}</i><code>${h || ''}</code></div>`).join('') + `</div>`
    : '';
  const MD = (SYN && SYN.markdown) ? `<div class="md">${SYN.markdown.html}</div>` : '';

  $('[data-term-scroll]').innerHTML = [
    cmd('fastfetch'), FETCH,
    cmd('ls --color'),
    `<div class="out"><span class="a-blu">assets</span>   <span class="a-blu">colors</span>   <span class="a-blu">docs</span>   <span class="a-blu">scripts</span>   <span class="a-grn">build.sh</span>   <span class="a-grn">serve</span>\n<span class="a-cyn">README.md</span><span class="a-dim"> → readme.en.md</span>   <span class="a-red">images.zip</span>   <span class="a-mag">banner.png</span></div>`,
    cmd('git status -s'),
    `<div class="out"><span class="a-grn"> M</span> assets/js/terminal.js\n<span class="a-grn">A </span>terminal.html\n<span class="a-red"> D</span> legacy/old-theme.css</div>`,
    cmd('git diff'),
    `<div class="out"><span class="a-cyn">@@ -14,7 +14,9 @@</span> <span class="a-mag">build</span>(anchorId, mode)\n<span class="a-grn">+  const palette = ZH_TERMINAL.build(id, mode);</span>\n<span class="a-red">-  const palette = legacyBuild(id);</span></div>`,
    cmd('bat scripts/build-color-pages.mjs <span class="a-dim">--theme=ansi</span>'), CODE,
    cmd('glow README.md'), MD,
    cmd('<span class="curs"> </span>'),
  ].join('\n');

  /* ── 渲染调色板 ── */
  function render() {
    const p = T.build(state.id, state.mode);
    current = p;
    // 灌 CSS 变量（换锚色 = 改这几十个变量，零节点重渲染）
    term.style.setProperty('--term-bg', p.ui.background.hex);
    term.style.setProperty('--term-fg', p.ui.foreground.hex);
    term.style.setProperty('--term-cursor', p.ui.cursor.hex);
    term.style.setProperty('--term-sel', p.ui.selection.hex);
    term.style.setProperty('--term-anchor', p.anchor.hex);
    // 锚色的「可见版」= 锚色占的那个 ANSI 槽（保证过对比度），给标题/logo/md 标题用，避免暗锚色糊进底色。
    term.style.setProperty('--term-anchor-vivid', p.ansi[p.anchorSlot].hex);
    for (const k of T.ANSI_ORDER) term.style.setProperty('--ansi-' + k, p.ansi[k].hex);

    // 锚色卡
    $('[data-anchor-swatch]').style.background = p.anchor.hex;
    $('[data-anchor-name]').textContent = p.anchor.name;
    $('[data-anchor-id]').textContent = 'NO.' + p.anchor.id;
    $('[data-anchor-hex]').textContent = p.anchor.hex.toUpperCase();
    $('[data-anchor-oklch]').textContent = window.ZH_COLOR_CORE.oklchStr(p.anchor.hex);
    $('[data-anchor-slot]').textContent = '占 ' + p.anchorSlot + ' 槽';

    // 16 色板带
    $('[data-strip]').innerHTML = p.order.map((k, i) => {
      const t = p.ansi[k];
      return `<span class="chip${t.nudged ? ' nud' : ''}" title="${k} · ${t.name || '算法兜底'} ${t.hex.toUpperCase()}">`
        + `<i style="background:${t.hex}"></i><b>${i}</b></span>`;
    }).join('');

    // 标本（16 ANSI + 4 UI）
    $('[data-specimen]').innerHTML = p.slots.map(s => {
      const src = s.nudged ? `<span class="algo">算法兜底</span>` : `<span class="nm">${s.name || '—'}</span>`;
      const fl = T.floorFor(s.key, state.mode);
      const aa = fl ? `<span class="aa ${s.contrast >= fl ? 'ok' : 'no'}">${s.contrast.toFixed(1)}</span>` : '';
      return `<div class="sp"><i style="background:${s.hex}"></i>`
        + `<span class="role">${s.group === 'ui' ? s.key : s.key + ' · ' + s.idx}</span>`
        + `<span class="src">${src}</span>`
        + `<span class="right"><span class="ok">${s.hex.toUpperCase()}</span>${aa}</span></div>`;
    }).join('');

    const named = p.slots.filter(s => !s.nudged).length, nud = p.slots.length - named;
    $('[data-stat]').textContent = `${p.slots.length} 槽 · 点名 ${named} / 兜底 ${nud}`;
    // fetch 屏的动态信息
    const ft = $('[data-fetch-theme]'); if (ft) ft.textContent = `${p.anchor.name} · NO.${p.anchor.id} · ${state.mode === 'dark' ? '暗色' : '亮色'}`;
    const fp = $('[data-fetch-prov]'); if (fp) fp.textContent = `16 ANSI + 4 UI · 点名 ${named} / 兜底 ${nud}`;

    renderExport();
    // 换锚色只重染 CSS 变量，不重放入场动画 —— 切换瞬时、顺滑。
  }

  /* ── 导出区 ── */
  function renderExport() {
    const out = SER.serialize(state.fmt, current);
    $('[data-css]').textContent = out.text;
    $('[data-fmt-name]').textContent = SER.FORMATS.find(f => f.key === state.fmt).label;
    term.dataset.dl = out.filename;
  }
  // 格式标签
  $('[data-fmt-tabs]').innerHTML = SER.FORMATS.map(f =>
    `<button role="tab" data-fmt="${f.key}" aria-selected="${f.key === state.fmt}">${f.label}</button>`).join('');
  $('[data-fmt-tabs]').addEventListener('click', e => {
    const b = e.target.closest('[data-fmt]'); if (!b) return;
    state.fmt = b.dataset.fmt;
    $('[data-fmt-tabs]').querySelectorAll('[data-fmt]').forEach(x => x.setAttribute('aria-selected', x === b));
    renderExport();
  });

  /* ── 锚色交互 ── */
  function setAnchor(id) { if (REC(id)) { state.id = id; render(); } }
  const byName = {}; ALL.forEach(c => byName[c.name] = c.id);
  $('#tm-names').innerHTML = ALL.map(c => `<option value="${c.name}">${c.id} · ${c.hex}</option>`).join('');

  $('[data-search]').addEventListener('change', e => {
    const v = e.target.value.trim(); if (!v) return;
    const hit = byName[v] || (REC(v) ? v : null)
      || (ALL.find(c => c.hex.toLowerCase() === (v[0] === '#' ? v : '#' + v).toLowerCase()) || {}).id
      || (ALL.find(c => c.name.includes(v)) || {}).id;
    if (hit) { setAnchor(hit); syncQuick(hit); }
  });
  root.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    state.mode = b.dataset.mode;
    root.querySelectorAll('[data-mode]').forEach(x => x.setAttribute('aria-pressed', x === b));
    render();
  }));
  $('[data-random]').addEventListener('click', () => { const c = ALL[Math.floor(Math.random() * ALL.length)]; setAnchor(c.id); syncQuick(c.id); });

  // 复制 / 下载
  $('[data-copy]').addEventListener('click', function () {
    navigator.clipboard.writeText($('[data-css]').textContent);
    const label = this.querySelector('[data-copy-label]'); const prev = label.textContent;
    label.textContent = '已复制 ✓'; this.classList.add('done');
    setTimeout(() => { label.textContent = prev; this.classList.remove('done'); }, 1400);
  });
  $('[data-download]').addEventListener('click', () => {
    const blob = new Blob([$('[data-css]').textContent], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = term.dataset.dl || 'theme.conf';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  // 快捷锚色条
  const qWrap = $('[data-quick]');
  function syncQuick(id) { qWrap.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.qid === id)); }
  ['朱红', '群青', '藤黄', '竹青', '靛蓝', '鸦青', '绛紫', '石青', '胭脂', '栀子'].map(n => byName[n]).filter(Boolean).forEach(id => {
    const c = REC(id); const b = document.createElement('button');
    b.style.background = c.hex; b.title = c.name + ' · ' + id; b.dataset.qid = id;
    b.addEventListener('click', () => { setAnchor(id); syncQuick(id); });
    qWrap.appendChild(b);
  });

  const startId = byName['竹青'] || (qWrap.querySelector('button') || {}).dataset?.qid || ALL[0].id;
  setAnchor(startId); syncQuick(startId);

  /* ── 高度自适应：让整台装置（含 16 色板带）恰好落在视口内 ──
     CSS 的 calc(100vh - 24px) 没算上头部导航 + 引言的高度，会把色板带顶出视口。
     这里按 term-root 的真实顶距收口；窄屏（≤1080，堆叠布局）则交还给 CSS auto。 */
  function fitHeight() {
    if (window.innerWidth <= 1080) { root.style.height = ''; return; }
    const top = root.getBoundingClientRect().top;
    root.style.height = Math.max(620, Math.round(window.innerHeight - top - 16)) + 'px';
  }
  fitHeight();
  window.addEventListener('resize', fitHeight);
  window.addEventListener('load', fitHeight);   // 字体加载后引言高度可能微变，再收一次
})();
