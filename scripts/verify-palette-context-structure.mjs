import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const html = readFileSync(join(root, 'palettes.html'), 'utf8');
const js = readFileSync(join(root, 'assets/js/palettes.js'), 'utf8');
const css = readFileSync(join(root, 'assets/css/palettes.css'), 'utf8');
const packageJson = readFileSync(join(root, 'package.json'), 'utf8');
const seo = readFileSync(join(root, 'docs/SEO.md'), 'utf8');
const demoRailHtml = html.match(/<aside class="palette-demo-rail"[\s\S]*?<\/aside>/)?.[0] || '';
const demoRailRenderer = js.match(/function\s+renderDemoPaletteRail[\s\S]*?function\s+selectDemoPalette/)?.[0] || '';

const failures = [];
const check = (label, condition) => {
  if (!condition) failures.push(label);
};

[
  ['palettes.html: missing [data-view-mode="grid"]', /\bdata-view-mode="grid"/.test(html)],
  ['palettes.html: missing [data-view-mode="demo"]', /\bdata-view-mode="demo"/.test(html)],
  ['palettes.html: toolbar command labels need responsive wrappers', (html.match(/class="toolbar-label"/g) || []).length >= 4],
  ['palettes.html: missing #palette-demo-preview skip target', /id="palette-demo-preview"/.test(html)],
  ['palettes.html: skip link does not target #palette-demo-preview', /href="#palette-demo-preview"/.test(html)],
  ['palettes.html: missing .palette-demo-shell[data-demo-shell]', /class="[^"]*\bpalette-demo-shell\b[^"]*"[^>]*\bdata-demo-shell\b|data-demo-shell[^>]*class="[^"]*\bpalette-demo-shell\b/.test(html)],
  ['palettes.html: palette shell must expose view state hook', /class="[^"]*\bpalette-shell\b[^"]*"[^>]*\bdata-palette-shell\b|data-palette-shell[^>]*class="[^"]*\bpalette-shell\b/.test(html)],
  ['palettes.html: missing left .palette-demo-rail[data-demo-rail]', /class="[^"]*\bpalette-demo-rail\b[^"]*"[^>]*\bdata-demo-rail\b|data-demo-rail[^>]*class="[^"]*\bpalette-demo-rail\b/.test(html)],
  ['palettes.html: missing [data-demo-palette-list]', /\bdata-demo-palette-list\b/.test(html)],
  ['palettes.html: missing [data-demo-result-count]', /\bdata-demo-result-count\b/.test(html)],
  ['palettes.html: demo result count must be screen-reader only', /class="[^"]*\bsr-only\b[^"]*"[^>]*\bdata-demo-result-count\b|data-demo-result-count[^>]*class="[^"]*\bsr-only\b/.test(html)],
  ['palettes.html: demo rail must not keep visible panel head', !/\bpalette-demo-panel-head\b|\brail-title\b/.test(demoRailHtml)],
  ['palettes.html: missing right .palette-demo-page[data-demo-page]', /class="[^"]*\bpalette-demo-page\b[^"]*"[^>]*\bdata-demo-page\b|data-demo-page[^>]*class="[^"]*\bpalette-demo-page\b/.test(html)],
  ['palettes.html: missing [data-demo-empty]', /\bdata-demo-empty\b/.test(html)],
  ['palettes.html: empty state copy missing', /没有匹配的配色/.test(html)],
  ['palettes.html: missing existing [data-palette-grid]', /\bdata-palette-grid\b/.test(html)],
  ['palettes.html: missing existing [data-load-more]', /\bdata-load-more\b/.test(html)],
  ['palettes.html: must not contain scene tab mount', !/\bdata-context-scene-tabs\b|\bcontext-scene-tabs\b/.test(html)],
  ['palettes.html: must not contain separate role sidebar', !/\bdata-context-roles\b|\bcontext-roles\b/.test(html)],
  ['assets/js/palettes.js: missing demo view state', /\bcurrentViewMode\b/.test(js) && /demo/.test(js)],
  ['assets/js/palettes.js: setViewMode must update palette shell view state', /function\s+setViewMode[\s\S]*paletteShell[\s\S]*dataset\.view/.test(js)],
  ['assets/js/palettes.js: missing selectedDemoPaletteId state', /\bselectedDemoPaletteId\b/.test(js)],
  ['assets/js/palettes.js: missing renderDemoPaletteRail', /function\s+renderDemoPaletteRail\b/.test(js)],
  ['assets/js/palettes.js: missing bounded demo rail item selector', /function\s+demoPaletteRailItems\b/.test(js) && /DEMO_RAIL_LIMIT/.test(js)],
  ['assets/js/palettes.js: demo rail must deduplicate palette anchors', /function\s+demoPaletteRailItems[\s\S]*anchorId/.test(js)],
  ['assets/js/palettes.js: demo rail selection must stay inside filtered results', /function\s+renderDemoPaletteRail[\s\S]*palettes\.find\(\(palette\)\s*=>\s*palette\.id\s*===\s*selectedPaletteId\)[\s\S]*palettes\[0\]/.test(js)],
  ['assets/js/palettes.js: missing renderPaletteDemoPage', /function\s+renderPaletteDemoPage\b/.test(js)],
  ['assets/js/palettes.js: missing selectDemoPalette', /function\s+selectDemoPalette\b/.test(js)],
  ['assets/js/palettes.js: missing syncDemoUrlState', /function\s+syncDemoUrlState\b/.test(js)],
  ['assets/js/palettes.js: missing readDemoUrlState', /function\s+readDemoUrlState\b/.test(js)],
  ['assets/js/palettes.js: renderPalettes must not render hidden demo rail outside demo view', /function\s+renderPalettes[\s\S]*if\s*\(\s*currentViewMode\s*===\s*['"]demo['"]\s*\)\s*renderDemoPaletteRail\(\)/.test(js)],
  ['assets/js/palettes.js: missing demo palette item markup', /palette-demo-item/.test(js)],
  ['assets/js/palettes.js: missing demo palette swatch markup', /palette-demo-swatch/.test(js)],
  ['assets/js/palettes.js: demo rail item must expose accessible palette label', /aria-label="[^"]*\$\{escapeHtml\(palette\.anchor\.name\)/.test(demoRailRenderer)],
  ['assets/js/palettes.js: demo rail must not render visible palette title text', !/<strong>\$\{escapeHtml\(palette\.anchor\.name\)\}<\/strong>/.test(demoRailRenderer)],
  ['assets/js/palettes.js: demo rail must not render visible palette relation meta', !/<small>\$\{escapeHtml\(palette\.anchor\.hex\)\} \/ \$\{escapeHtml\(palette\.relationLabel\)\}<\/small>/.test(demoRailRenderer)],
  ['assets/js/palettes.js: missing keyboard handling', /keydown/.test(js)],
  ['assets/js/palettes.js: missing isolated demo rail scrolling', /function\s+scrollDemoPaletteIntoView\b/.test(js)],
  ['assets/js/palettes.js: demo palette selection must not scroll the document', !/function\s+selectDemoPalette[\s\S]*scrollIntoView/.test(js)],
  ['assets/js/palettes.js: must not define CONTEXT_SCENES', !/\bCONTEXT_SCENES\b/.test(js)],
  ['assets/js/palettes.js: must not keep currentContextScene', !/\bcurrentContextScene\b/.test(js)],
  ['assets/js/palettes.js: must not keep scene selection functions', !/\bselectContextScene\b|\brenderContextSceneTabs\b|\brenderContextScene\b/.test(js)],
  ['assets/js/palettes.js: URL state must not write scene param', !/params\.set\(['"]scene['"]/.test(js)],
  ['assets/css/palettes.css: missing .palette-demo-shell', /\.palette-demo-shell\b/.test(css)],
  ['assets/css/palettes.css: missing .palette-demo-rail', /\.palette-demo-rail\b/.test(css)],
  ['assets/css/palettes.css: missing .palette-demo-page', /\.palette-demo-page\b/.test(css)],
  ['assets/css/palettes.css: demo view must hide outer filter rail', /\.palette-shell\[data-view="demo"\][\s\S]*\.palette-rail[\s\S]*display:\s*none/.test(css)],
  ['assets/css/palettes.css: must not style scene tabs', !/\.context-scene-tab\b|\.context-scene-tabs\b/.test(css)],
  ['package.json: missing verify:palette-context script', /"verify:palette-context"\s*:/.test(packageJson)],
  ['docs/SEO.md: missing 单页配色演示 note', /单页配色演示/.test(seo)],
].forEach(([label, condition]) => check(label, condition));

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Palette demo structure verification passed.');
