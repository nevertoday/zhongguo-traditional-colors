/* 终端配色页面脚本 —— 消费 window.ZH_TERMINAL（terminal-tokens.js）、
   window.ZH_TERMINAL_SERIALIZE（三格式序列化）、window.ZH_PREVIEW_SYNTAX（构建期预切分的代码/md）。
   负责：把调色板灌成 CSS 变量驱动假终端、渲染色板带与标本、切标签与格式、复制/下载。 */
(function () {
  'use strict';
  const T = window.ZH_TERMINAL, SER = window.ZH_TERMINAL_SERIALIZE, SYN = window.ZH_PREVIEW_SYNTAX;
  if (!T || !SER) { console.error('[Terminal] 缺少 terminal-tokens.js / terminal-serialize.js'); return; }
  const root = document.querySelector('.term-root');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const ALL = T.ALL(), REC = T.REC;
  const term = $('[data-term]');
  let state = { id: null, mode: 'dark', tab: 'session', fmt: 'ghostty' };
  let current = null;

  /* ── 假终端「会话」标本（静态 HTML，靠 CSS 变量重染）── */
  const SESSION =
    `<span class="a-grn">guanxing</span><span class="a-dim">@</span><span class="a-blu">studio</span> <span class="a-cyn">~/works/zhongguo</span> <span class="a-dim">on</span> <span class="a-yel">main</span>\n` +
    `<span class="a-dim">$</span> ls --color\n` +
    `<span class="a-blu">assets</span>      <span class="a-blu">scripts</span>     <span class="a-cyn">README.md</span><span class="a-dim"> → readme.en.md</span>\n` +
    `<span class="a-blu">colors</span>      <span class="a-grn">build.sh</span>    <span class="a-red">images.zip</span>\n` +
    `<span class="a-blu">docs</span>        <span class="a-grn">serve</span>       <span class="a-mag">banner.png</span>\n` +
    `<span class="a-dim">$</span> git status -s\n` +
    `<span class="a-grn"> M</span> assets/js/terminal.js\n` +
    `<span class="a-grn">A </span>terminal.html\n` +
    `<span class="a-red"> D</span> legacy/old-theme.css\n` +
    `<span class="a-dim">$</span> git diff\n` +
    `<span class="a-cyn">@@ -14,7 +14,9 @@</span> <span class="a-mag">build</span>(anchorId, mode)\n` +
    `<span class="a-grn">+  const palette = ZH_TERMINAL.build(id, 'dark');</span>\n` +
    `<span class="a-red">-  const palette = legacyBuild(id);</span>\n` +
    `<span class="a-dim">$</span> npm run build\n` +
    `<span class="a-grn">✓</span> 16 ANSI + 4 UI 槽全部点名\n` +
    `<span class="a-yel">warning</span> bright_blue 微调以过对比度\n` +
    `<span class="a-red">error</span> 找不到模块 './ghost'  <span class="a-dim">(demo)</span>\n` +
    `<span class="a-dim">$</span> <span class="curs"> </span>`;

  // 代码 / Markdown 标本：构建期预切分，注入一次，之后只靠 CSS 变量重染。
  $('[data-pane="session"]').innerHTML = SESSION;
  if (SYN) {
    $('[data-pane="code"]').innerHTML = SYN.code ? SYN.code.html : '// preview-syntax.js 缺失';
    $('[data-pane="markdown"]').innerHTML = SYN.markdown ? SYN.markdown.html : '';
  }

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

    renderExport();
    term.style.animation = 'none'; void term.offsetWidth; term.style.animation = '';
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

  /* ── 终端标签切换 ── */
  root.querySelectorAll('.term-chrome [data-tab]').forEach(b => b.addEventListener('click', () => {
    state.tab = b.dataset.tab;
    root.querySelectorAll('.term-chrome [data-tab]').forEach(x => x.setAttribute('aria-selected', x === b));
    root.querySelectorAll('[data-pane]').forEach(pane => { pane.hidden = pane.dataset.pane !== state.tab; });
  }));

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
})();
