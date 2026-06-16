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
  // Claude Code 会话片段 —— 这才是本工具的主战场：满屏的「暗灰副文本 + 青/蓝路径 + 红绿 diff + 品红关键字」。
  // 用真实 Claude Code 的着色习惯摆一遍，让人当场判断这套板子盯一天累不累、diff 分不分得清。
  const CLAUDE =
    `<div class="out">` +
      `<span class="a-grn">●</span> 摸完依赖：色名作<span class="a-yel">行尾注释</span>会被 <span class="a-cyn">Ghostty</span> 并进取值 —— <span class="a-blu">terminal-serialize.js:29</span>\n` +
      `<span class="a-dim">  ⎿ 已确认 ghostty / kitty 都不支持行尾注释；alacritty(TOML) 支持。</span>\n` +
      `\n` +
      `<span class="a-grn">●</span> 把色名移到独立注释行。<span class="a-dim">Updated terminal-serialize.js · ↓ 1.8k tokens</span>\n` +
      `<span class="a-cyn">@@ -27,2 +28,4 @@</span> <span class="a-mag">function</span> <span class="a-blu">ghostty</span>(p)\n` +
      `<span class="a-red">-   palette = 0=#30161c  # 卵石紫</span>\n` +
      `<span class="a-grn">+   # 0 black · 卵石紫</span>\n` +
      `<span class="a-grn">+   palette = 0=#30161c</span>\n` +
      `\n` +
      `<span class="a-mag">✻</span> <span class="a-dim">Reticulating…  (12s · ↑ 2.1k tokens · esc to interrupt)</span>` +
    `</div>`;

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
    cmd('claude <span class="a-dim">"修复 Ghostty 配置导出"</span>'), CLAUDE,
    cmd('<span class="curs"> </span>'),
  ].join('\n');

  /* ── 渲染调色板 ── */
  function render() {
    const p = T.build(state.id, state.mode);
    current = p;
    root.dataset.mode = state.mode;
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

    // 三态：点名（精确库色）/ 微调（有名色，为可读性改过 hex）/ 兜底（无名，凭空算出）
    const adjusted = s => s.nudged && s.name, fabricated = s => s.nudged && !s.name;

    // 16 色板带（角标只标真·无名兜底；微调仍是有名色，不打标记保持整洁）
    $('[data-strip]').innerHTML = p.order.map((k, i) => {
      const t = p.ansi[k];
      const tag = t.nudged ? (t.name ? '微调' : '算法兜底') : '点名';
      return `<span class="chip${fabricated(t) ? ' nud' : ''}" title="${k} · ${t.name || '算法兜底'}（${tag}） ${t.hex.toUpperCase()}">`
        + `<i style="background:${t.hex}"></i><b>${i}</b></span>`;
    }).join('');

    // 标本（16 ANSI + 4 UI）
    $('[data-specimen]').innerHTML = p.slots.map(s => {
      const src = fabricated(s) ? `<span class="algo">算法兜底</span>`
        : adjusted(s) ? `<span class="nm">${s.name}</span><span class="adj" title="可溯源到该传统色，为可读性微调了色值">微调</span>`
        : `<span class="nm">${s.name || '—'}</span>`;
      const fl = T.floorFor(s.key, state.mode);
      const aa = fl ? `<span class="aa ${s.contrast >= fl ? 'ok' : 'no'}">${s.contrast.toFixed(1)}</span>` : '';
      return `<div class="sp"><i style="background:${s.hex}"></i>`
        + `<span class="role">${s.group === 'ui' ? s.key : s.key + ' · ' + s.idx}</span>`
        + `<span class="src">${src}</span>`
        + `<span class="right"><span class="ok">${s.hex.toUpperCase()}</span>${aa}</span></div>`;
    }).join('');

    const exact = p.slots.filter(s => !s.nudged).length;
    const adj = p.slots.filter(adjusted).length, fab = p.slots.filter(fabricated).length;
    const prov = `点名 ${exact}` + (adj ? ` · 微调 ${adj}` : '') + (fab ? ` · 兜底 ${fab}` : '');
    $('[data-stat]').textContent = `${p.slots.length} 槽 · ${prov}`;
    // fetch 屏的动态信息
    const ft = $('[data-fetch-theme]'); if (ft) ft.textContent = `${p.anchor.name} · NO.${p.anchor.id} · ${state.mode === 'dark' ? '暗色' : '亮色'}`;
    const fp = $('[data-fetch-prov]'); if (fp) fp.textContent = `16 ANSI + 4 UI · ${prov}`;

    renderExport();
    // 换锚色只重染 CSS 变量，不重放入场动画 —— 切换瞬时、顺滑。
  }

  /* ── 导出区 ── */
  function renderExport() {
    const out = SER.serialize(state.fmt, current);
    $('[data-css]').textContent = out.text;
    const f = SER.FORMATS.find(x => x.key === state.fmt);
    const cur = $('[data-fmt-current]'); if (cur) cur.textContent = f.label;     // 触发器已显示格式名
    const tip = $('[data-fmt-hint]'); if (tip) tip.textContent = f.hint || '';   // hd 行改显该格式的落地提示，不再重复格式名
    term.dataset.dl = out.filename;
  }

  /* ── 格式选择器：下拉 combobox（不平铺 tab；6 种格式 + 落地提示，全键盘可达）── */
  const fmtSelect = $('[data-fmt-select]'), fmtTrigger = $('[data-fmt-trigger]'), fmtMenu = $('[data-fmt-menu]');
  fmtMenu.innerHTML = SER.FORMATS.map(f =>
    `<li role="option" data-fmt="${f.key}" aria-selected="${f.key === state.fmt}" tabindex="-1">`
    + `<span class="fmt-lbl">${f.label}</span><span class="fmt-hint">${f.hint || ''}</span></li>`).join('');
  const fmtItems = () => [...fmtMenu.querySelectorAll('[role=option]')];
  function openFmt(open) {
    fmtMenu.hidden = !open;
    fmtTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    fmtSelect.classList.toggle('open', open);
    if (open) { (fmtMenu.querySelector('[aria-selected=true]') || fmtItems()[0]).focus(); }
  }
  function pickFmt(key) {
    state.fmt = key;
    fmtItems().forEach(x => x.setAttribute('aria-selected', String(x.dataset.fmt === key)));
    renderExport();
  }
  fmtTrigger.addEventListener('click', () => openFmt(fmtMenu.hidden));
  fmtTrigger.addEventListener('keydown', e => {
    if (['ArrowDown', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openFmt(true); }
  });
  fmtMenu.addEventListener('click', e => {
    const li = e.target.closest('[role=option]'); if (!li) return;
    pickFmt(li.dataset.fmt); openFmt(false); fmtTrigger.focus();
  });
  fmtMenu.addEventListener('keydown', e => {
    const items = fmtItems(), i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(items.length - 1, i + 1)].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(0, i - 1)].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickFmt(document.activeElement.dataset.fmt); openFmt(false); fmtTrigger.focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); openFmt(false); fmtTrigger.focus(); }
  });
  document.addEventListener('click', e => { if (!fmtSelect.contains(e.target)) openFmt(false); });
  fmtSelect.addEventListener('focusout', e => { if (!fmtSelect.contains(e.relatedTarget)) openFmt(false); });   // Tab 出去也收起

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

  // 复制 / 下载 —— 只在真正写入成功后才报「已复制」；
  // navigator.clipboard 在非 HTTPS / 旧浏览器下可能缺失或被拒，回退到 execCommand。
  async function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; }
    } catch (_) { /* 落到下面的兜底 */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '-9999px';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    } catch (_) { return false; }
  }
  const copyBtn = $('[data-copy]'), copyLabel = copyBtn.querySelector('[data-copy-label]');
  const COPY_LABEL = copyLabel.textContent;        // 固定默认文案，避免连点时把临时态当默认态回填
  let copyTimer = null;
  copyBtn.addEventListener('click', async () => {
    const ok = await copyText($('[data-css]').textContent);
    copyLabel.textContent = ok ? '已复制 ✓' : '复制失败 · 请手动选择';
    copyBtn.classList.toggle('done', ok);
    clearTimeout(copyTimer);                        // 连点时取消上一次的回填，状态不会被卡住
    copyTimer = setTimeout(() => { copyLabel.textContent = COPY_LABEL; copyBtn.classList.remove('done'); }, 1500);
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
