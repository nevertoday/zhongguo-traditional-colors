/* Theme Forge 页面脚本 —— 消费 window.ZH_THEME_FORGE（assets/js/theme-forge-tokens.js）。
   负责：把生成的 token 灌进装置预览、渲染标本与导出、切换四个视图、顶栏交互。 */
(function () {
  'use strict';
  const TF = window.ZH_THEME_FORGE;
  if (!TF) { console.error('[ThemeForge] 缺少 theme-forge-tokens.js'); return; }
  const ALL = TF.ALL();
  const REC = TF.REC;
  const { build, oklchStr, contrast, ORDER, AA } = TF;
  const root = document.querySelector('.tf-root');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const dev = $('[data-device]');
  let state = { id: null, mode: 'light', view: 'overview' };

  /* ── 渲染主题 ── */
  function render() {
    const { anchor, tokens } = build(state.id, state.mode);
    for (const k in tokens) dev.style.setProperty('--' + k, tokens[k].hex);

    $('[data-anchor-swatch]').style.background = anchor.hex;
    $('[data-anchor-name]').textContent = anchor.name;
    $('[data-anchor-id]').textContent = 'NO.' + anchor.id;
    $('[data-anchor-hex]').textContent = anchor.hex.toUpperCase();
    $('[data-anchor-oklch]').textContent = oklchStr(anchor.hex);

    $('[data-specimen]').innerHTML = ORDER.map(role => {
      const t = tokens[role]; if (!t) return '';
      const src = t.nudged ? `<span class="algo">算法兜底</span>` : `<span class="nm">${t.name || '—'}</span>`;
      let aa = '';
      if (AA[role] && tokens[AA[role]]) { const cr = contrast(t.hex, tokens[AA[role]].hex);
        aa = `<span class="aa ${cr >= 4.5 ? 'ok' : 'no'}">${cr >= 7 ? 'AAA' : cr >= 4.5 ? 'AA' : '✕'} ${cr.toFixed(1)}</span>`; }
      return `<div class="sp"><i style="background:${t.hex}"></i><span class="role">${role}</span>`
        + `<span class="src">${src}</span><span class="right"><span class="ok">${t.hex.toUpperCase()}</span>${aa}</span></div>`;
    }).join('');

    const cw = [28, 23, 20, 17, 12];
    $('[data-dist]').innerHTML = [1, 2, 3, 4, 5].map(i => `<span style="width:${cw[i - 1]}%;background:var(--chart-${i})"></span>`).join('');
    $('[data-chart-legend]').innerHTML = [1, 2, 3, 4, 5].map(i => { const t = tokens['chart-' + i]; return t ? `<span><i style="background:${t.hex}"></i>${t.name}</span>` : ''; }).join('');

    const both = { light: build(state.id, 'light').tokens, dark: build(state.id, 'dark').tokens };
    const block = toks => ORDER.map(r => toks[r] ? `  --${r}: ${oklchStr(toks[r].hex)};${toks[r].name ? '  <span class="c">/* ' + toks[r].name + ' */</span>' : ''}` : '').filter(Boolean).join('\n');
    $('[data-css]').innerHTML = `<span class="c">/* 中国传统色主题 · 锚色 ${anchor.name} ${anchor.hex.toUpperCase()} */</span>\n:root {\n  --radius: 0rem;\n${block(both.light)}\n}\n\n.dark {\n${block(both.dark)}\n}`;

    const tk = Object.values(tokens), algo = tk.filter(t => t.nudged).length;
    $('[data-stat]').textContent = `${tk.length} TOKENS · 点名 ${tk.length - algo} / 兜底 ${algo}`;

    dev.style.animation = 'none'; void dev.offsetWidth; dev.style.animation = '';
  }

  /* ── 视图切换（内容与主题无关，初始化一次） ── */
  const VIEWMETA = { overview: ['工作台 / 概览', '总览'], analytics: ['工作台 / 分析', '数据分析'], users: ['工作台 / 成员', '用户'], settings: ['工作台 / 偏好', '设置'] };
  function setView(v) {
    state.view = v;
    root.querySelectorAll('[data-view]').forEach(el => {
      if (el.tagName === 'SECTION') el.hidden = el.dataset.view !== v;
      else el.classList.toggle('on', el.dataset.view === v);
    });
    $('[data-dv-crumb]').textContent = VIEWMETA[v][0];
    $('[data-dv-title]').textContent = VIEWMETA[v][1];
  }
  root.querySelectorAll('.dv-nav [data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));

  // 周流量柱状图（峰值用 accent）
  (function () {
    const v = [42, 58, 49, 71, 63, 88, 76, 95, 68, 82, 74, 90]; const n = v.length, gap = 10, w = (600 - gap * (n - 1)) / n, mx = Math.max(...v);
    $('[data-bars]').innerHTML = `<g style="stroke:var(--border)" stroke-width="1"><line x1="0" y1="47" x2="600" y2="47"/><line x1="0" y1="94" x2="600" y2="94"/><line x1="0" y1="141" x2="600" y2="141"/></g>`
      + v.map((d, i) => { const h = d / mx * 150, x = i * (w + gap), y = 188 - h, peak = d === mx; return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" style="fill:var(--${peak ? 'accent' : 'primary'})"/>`; }).join('');
  })();
  // 流量来源
  (function () {
    const src = [['直接访问', 86], ['自然搜索', 64], ['社交媒体', 47], ['邮件', 29], ['广告', 18]];
    $('[data-toplist]').innerHTML = src.map((s, i) => `<div class="toprow"><i class="dot" style="background:var(--chart-${i + 1})"></i><div><div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:12px">${s[0]}</div><div class="bar"><i style="width:${s[1]}%"></i></div></div><span class="pct">${s[1]}%</span></div>`).join('');
  })();
  // 活跃热度（确定性 opacity，避免抖动）
  (function () { let h = ''; for (let i = 0; i < 80; i++) { const o = ((i * 53 + 17) % 100) / 100 * 0.85 + 0.12; h += `<i style="opacity:${o.toFixed(2)}"></i>`; } $('[data-heat]').innerHTML = h; })();
  // 用户列表
  (function () {
    const R = { admin: ['管理员', 'a'], editor: ['编辑', 's'], guest: ['访客', 'm'] };
    const S = { on: ['在线', '--chart-1'], off: ['离线', '--muted-foreground'], ban: ['封禁', '--destructive'] };
    const U = [['林', '林晚晴', 'wanqing@guanxing.cn', 'admin', 'on', '2 分钟前'], ['苏', '苏砚', 'su.yan@guanxing.cn', 'editor', 'on', '17 分钟前'],
      ['陈', '陈青禾', 'qinghe@guanxing.cn', 'editor', 'off', '3 小时前'], ['周', '周朗然', 'zhou@guanxing.cn', 'guest', 'off', '昨天'],
      ['吴', '吴朱砂', 'zhusha@guanxing.cn', 'admin', 'on', '刚刚'], ['郑', '郑黛', 'daidai@guanxing.cn', 'guest', 'ban', '6 天前'],
      ['何', '何湖蓝', 'hulan@guanxing.cn', 'editor', 'off', '上周']];
    $('[data-users]').innerHTML = U.map(u => `<tr>
      <td><span class="umember"><span class="uav">${u[0]}</span><span class="un">${u[1]}<br><small>${u[2]}</small></span></span></td>
      <td><span class="bdg ${R[u[3]][1]}">${R[u[3]][0]}</span></td>
      <td><span class="status"><i style="background:var(${S[u[4]][1]})"></i>${S[u[4]][0]}</span></td>
      <td style="color:var(--muted-foreground);font-size:12px">${u[5]}</td>
      <td><span class="rowact"><span class="ed">编辑</span><span class="rm">删除</span></span></td></tr>`).join('');
  })();
  // 设置里的小交互（纯展示）
  root.querySelectorAll('.swatchpick').forEach(p => p.addEventListener('click', e => { if (e.target.tagName === 'I') p.querySelectorAll('i').forEach(x => x.classList.toggle('on', x === e.target)); }));
  root.querySelectorAll('.optrow').forEach(r => r.addEventListener('click', e => { const o = e.target.closest('.opt'); if (o) r.querySelectorAll('.opt').forEach(x => x.classList.toggle('on', x === o)); }));
  root.querySelectorAll('.seg2').forEach(s => s.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') s.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === e.target)); }));
  root.querySelectorAll('.dv-scroll .tabs, .dv-scroll .chips').forEach(g => g.addEventListener('click', e => { const b = e.target.closest('button'); if (b) g.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); }));
  root.querySelectorAll('.sw').forEach(s => s.addEventListener('click', () => s.classList.toggle('off')));

  /* ── 顶栏交互 ── */
  function setAnchor(id) { if (REC(id)) { state.id = id; render(); } }
  const byName = {}; ALL.forEach(c => byName[c.name] = c.id);
  $('#tf-names').innerHTML = ALL.map(c => `<option value="${c.name}">${c.id} · ${c.hex}</option>`).join('');
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
  $('[data-copy]').addEventListener('click', function () {
    navigator.clipboard.writeText($('[data-css]').textContent);
    const label = this.querySelector('[data-copy-label]'); const prev = label.textContent;
    label.textContent = '已复制到剪贴板 ✓'; this.classList.add('done');
    setTimeout(() => { label.textContent = prev; this.classList.remove('done'); }, 1400);
  });

  const qWrap = $('[data-quick]');
  function syncQuick(id) { qWrap.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.qid === id)); }
  ['朱红', '群青', '藤黄', '黛蓝', '胭脂红', '竹青', '天青', '茜色', '黛紫', '绛紫'].map(n => byName[n]).filter(Boolean).forEach(id => {
    const c = REC(id); const b = document.createElement('button');
    b.style.background = c.hex; b.title = c.name + ' · ' + id; b.dataset.qid = id;
    b.addEventListener('click', () => { setAnchor(id); syncQuick(id); });
    qWrap.appendChild(b);
  });

  const startId = byName['竹青'] || (qWrap.querySelector('button') || {}).dataset?.qid || ALL[0].id;
  setAnchor(startId); syncQuick(startId); setView('overview');
})();
