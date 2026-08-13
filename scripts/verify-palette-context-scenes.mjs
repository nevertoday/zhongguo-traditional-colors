import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const js = readFileSync(join(root, 'assets/js/palettes.js'), 'utf8');
const css = readFileSync(join(root, 'assets/css/palettes.css'), 'utf8');

const failures = [];
const check = (label, condition) => {
  if (!condition) failures.push(label);
};

check('assets/js/palettes.js: must not define multi-scene list', !/\bCONTEXT_SCENES\b|\bDEMO_SCENES\b/.test(js));
check('assets/js/palettes.js: must not contain scene renderers', !/render(Web|Article|Social|Slide|Chart|Brand)ContextScene/.test(js));
check('assets/js/palettes.js: must not contain scene tab click handlers', !/data-context-scene|contextSceneTabs|selectContextScene/.test(js));
check('assets/js/palettes.js: missing single demo page renderer', /function\s+renderPaletteDemoPage\b/.test(js));
check('assets/js/palettes.js: renderPaletteDemoPage missing hero section', /function\s+renderPaletteDemoPage[\s\S]*palette-demo-hero/.test(js));
check('assets/js/palettes.js: renderPaletteDemoPage missing terminology cards section', /function\s+renderPaletteDemoPage[\s\S]*palette-demo-terms/.test(js));
check('assets/js/palettes.js: renderPaletteDemoPage missing philosophy section', /function\s+renderPaletteDemoPage[\s\S]*palette-demo-philosophy/.test(js));
check('assets/js/palettes.js: renderPaletteDemoPage missing about/newsletter section', /function\s+renderPaletteDemoPage[\s\S]*palette-demo-about/.test(js));
check('assets/js/palettes.js: renderPaletteDemoPage missing Chinese knowledge grid', /function\s+renderPaletteDemoPage[\s\S]*palette-demo-knowledge-grid/.test(js));
check('assets/js/palettes.js: renderPaletteDemoPage missing realistic typography specimen', /function\s+renderPaletteDemoPage[\s\S]*palette-demo-specimen/.test(js));
check('assets/js/palettes.js: ratio bars must set per-segment readable text color', /function\s+renderPaletteDemoPage[\s\S]*--ratio-bg:[\s\S]*--ratio-text:/.test(js));
check('assets/js/palettes.js: applyDemoPaletteRoles must set readable footer text', /function\s+applyDemoPaletteRoles[\s\S]*--demo-footer-text[\s\S]*readableTextColor/.test(js));
for (const phrase of ['色相', '明度', '纯度', '留白', '长期阅读', '传统色名']) {
  check(`assets/js/palettes.js: detailed Chinese demo copy missing ${phrase}`, js.includes(phrase));
}
check('assets/js/palettes.js: missing repeated hue panel renderer', /function\s+renderDemoSectionHues\b/.test(js));
check('assets/js/palettes.js: hue panel must include 本节用色', /function\s+renderDemoSectionHues[\s\S]*本节用色/.test(js));
check('assets/js/palettes.js: hue panel must include copy guidance', /function\s+renderDemoSectionHues[\s\S]*点击复制/.test(js));
check('assets/js/palettes.js: hue rows must copy hex by role', /data-demo-copy-hue/.test(js));
check('assets/js/palettes.js: selected palette must render single demo page', /function\s+selectDemoPalette[\s\S]*renderPaletteDemoPage\(/.test(js));

for (const variable of ['--demo-background', '--demo-headline', '--demo-paragraph', '--demo-button', '--demo-card']) {
  check(`assets/css/palettes.css: missing ${variable} usage`, css.includes(variable));
}
check('assets/css/palettes.css: missing long page section styles', /\.palette-demo-section\b/.test(css));
check('assets/css/palettes.css: missing hue panel styles', /\.demo-section-hues\b/.test(css));
check('assets/css/palettes.css: missing Chinese knowledge grid styles', /\.palette-demo-knowledge-grid\b/.test(css));
check('assets/css/palettes.css: missing realistic typography specimen styles', /\.palette-demo-specimen\b/.test(css));
check('assets/css/palettes.css: demo swatches must have exactly four color rows', /\.palette-demo-swatches\s*\{[\s\S]*grid-template-rows:\s*repeat\(4,\s*1fr\)/.test(css));
check('assets/css/palettes.css: ratio bars must use per-segment variables', /\.palette-demo-ratio span\s*\{[\s\S]*color:\s*var\(--ratio-text\)[\s\S]*background:\s*var\(--ratio-bg\)/.test(css));
check('assets/css/palettes.css: footer must use dedicated readable text variable', /\.palette-demo-footer\s*\{[\s\S]*color:\s*var\(--demo-footer-text\)/.test(css));
check('assets/css/palettes.css: demo shell left rail must be narrow', /grid-template-columns:\s*minmax\(88px,\s*120px\)\s+minmax\(0,\s*1fr\)/.test(css));
check('assets/css/palettes.css: demo rail items must not use text-list columns', !/\.palette-demo-item\s*\{[\s\S]*grid-template-columns:\s*76px\s+minmax\(0,\s*1fr\)/.test(css));
check('assets/css/palettes.css: must not style six scene components', !/\.context-(web|article|social|slide|chart|brand)\b/.test(css));

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Palette demo single-page verification passed.');
