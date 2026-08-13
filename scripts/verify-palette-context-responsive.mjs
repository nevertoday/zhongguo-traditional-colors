import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const css = readFileSync(join(root, 'assets/css/palettes.css'), 'utf8');

const failures = [];
const check = (label, condition) => {
  if (!condition) failures.push(label);
};

check('assets/css/palettes.css: missing .palette-demo-shell', /\.palette-demo-shell\b/.test(css));
check('assets/css/palettes.css: .palette-demo-shell must use grid', /\.palette-demo-shell\s*\{[\s\S]*display:\s*grid/.test(css));
check('assets/css/palettes.css: .palette-demo-shell must be two columns', /\.palette-demo-shell\s*\{[\s\S]*grid-template-columns:\s*minmax\([^;]+?\)\s+minmax\(/.test(css));
check('assets/css/palettes.css: missing .palette-demo-rail-list', /\.palette-demo-rail-list\b/.test(css));
check('assets/css/palettes.css: missing .palette-demo-page', /\.palette-demo-page\b/.test(css));
check('assets/css/palettes.css: rail needs sticky max-height', /\.palette-demo-rail\s*\{[\s\S]*position:\s*sticky[\s\S]*max-height/.test(css));
check('assets/css/palettes.css: page must scroll as a long document', /\.palette-demo-page\s*\{[\s\S]*overflow:\s*hidden/.test(css) && /\.palette-demo-section\b/.test(css));
check('assets/css/palettes.css: missing max-width 860px media query', /@media\s*\(max-width:\s*860px\)/.test(css));
check('assets/css/palettes.css: mobile demo shell must become single-column', /@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*\.palette-demo-shell\s*\{[\s\S]*grid-template-columns:\s*1fr/.test(css));
check('assets/css/palettes.css: mobile rail list must scroll horizontally', /@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*\.palette-demo-rail-list\s*\{[\s\S]*(grid-auto-flow:\s*column|overflow-x:\s*auto)/.test(css));
check('assets/css/palettes.css: demo view must compact the repeated page hero', /\.palette-shell\[data-view="demo"\]\s+\.palette-hero\s*\{[\s\S]*display:\s*none/.test(css));
check('assets/css/palettes.css: demo view toolbar must be compact', /\.palette-shell\[data-view="demo"\]\s+\.palette-toolbar\s*\{[\s\S]*margin:/.test(css));
check('assets/css/palettes.css: mobile demo toolbar must use one icon command row', /@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*\.palette-shell\[data-view="demo"\]\s+\.palette-toolbar\s*\{[\s\S]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/.test(css));
check('assets/css/palettes.css: mobile demo search must span the toolbar', /@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*\.palette-shell\[data-view="demo"\]\s+\.palette-search\s*\{[\s\S]*grid-column:\s*1\s*\/\s*-1/.test(css));
check('assets/css/palettes.css: mobile demo rail must have a bounded width', /@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*\.palette-demo-rail-list\s*\{[\s\S]*width:\s*100%[\s\S]*max-width:\s*100%/.test(css));
check('assets/css/palettes.css: mobile demo page must prevent horizontal overflow', /@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*\.palette-demo-page\s*\{[\s\S]*width:\s*100%[\s\S]*max-width:\s*100%/.test(css));
check('assets/css/palettes.css: missing touch target min-height 44px', /min-height:\s*44px/.test(css));
check('assets/css/palettes.css: missing reduced motion media query', /@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css));
check('assets/css/palettes.css: reduced motion must disable demo transitions', /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*\.palette-demo[\s\S]*transition:\s*none/.test(css));

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Palette demo responsive verification passed.');
