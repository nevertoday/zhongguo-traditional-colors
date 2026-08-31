import { readFileSync } from 'node:fs';

const styles = readFileSync('assets/css/styles.css', 'utf8');
const generator = readFileSync('assets/css/generator.css', 'utf8');
const gradients = readFileSync('assets/css/gradients.css', 'utf8');
const palettes = readFileSync('assets/css/palettes.css', 'utf8');
const themeForge = readFileSync('assets/css/theme-forge.css', 'utf8');
const terminal = readFileSync('assets/css/terminal.css', 'utf8');

const failures = [];

function fail(message) {
  failures.push(message);
}

function rule(source, selectorPattern) {
  const pattern = selectorPattern instanceof RegExp
    ? selectorPattern
    : new RegExp(`${selectorPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{[^}]+\\}`, 's');
  return source.match(pattern)?.[0] || '';
}

const headerControls = rule(styles, /\.nav-icon-link,\s*\.theme-toggle,\s*\.nav-menu-toggle\s*\{[^}]+\}/s);
if (!/width:\s*40px\s*;/.test(headerControls) || !/min-height:\s*40px\s*;/.test(headerControls)) {
  fail('assets/css/styles.css: mobile header tools should use 40px tap targets by default');
}

const brandMark = rule(styles, '.brand-mark');
const brandIcon = rule(styles, '.brand-mark span');
if (!/min-height:\s*40px\s*;/.test(brandMark) || !/width:\s*40px\s*;/.test(brandIcon) || !/height:\s*40px\s*;/.test(brandIcon)) {
  fail('assets/css/styles.css: brand mark should be a stable 40px mobile tap target');
}

const scrollControls = rule(styles, '.scroll-control');
if (!/width:\s*(40|44)px\s*;/.test(scrollControls) || !/height:\s*(40|44)px\s*;/.test(scrollControls)) {
  fail('assets/css/styles.css: gallery scroll controls should use 40px tap targets');
}
if (/\.scroll-control\s*\{[^}]*width:\s*32px[^}]*height:\s*32px/s.test(styles)) {
  fail('assets/css/styles.css: gallery scroll controls should not shrink to 32px on mobile');
}

for (const [label, source, selector] of [
  ['dictionary hue buttons', styles, '.dictionary-huebar button'],
  ['gradient hue buttons', gradients, '.gradient-huebar button'],
]) {
  const text = rule(source, selector);
  if (!/min-height:\s*44px\s*;/.test(text) || !/white-space:\s*nowrap\s*;/.test(text)) {
    fail(`${label}: hue filter buttons should be stable 44px mobile tap targets`);
  }
}

const generatorMobile = generator.match(/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]+?\n\}/)?.[0] || '';
if (!/flex:\s*0\s+0\s+auto\s*;/.test(generatorMobile) || !/min-height:\s*44px\s*;/.test(generatorMobile)) {
  fail('assets/css/generator.css: mobile method buttons should not shrink below 44px tap targets');
}
if (!/width:\s*44px\s*;/.test(generatorMobile) || !/min-width:\s*44px\s*;/.test(generatorMobile)) {
  fail('assets/css/generator.css: mobile favorite action should use a 44px square tap target');
}

const gradientMobile = gradients.match(/@media\s*\(max-width:\s*480px\)\s*\{[\s\S]+?\n\}/)?.[0] || '';
if (!/\.gradient-pair\s*\{[^}]*min-height:\s*44px/s.test(gradientMobile) || !/\.gradient-path-track\s*\{[^}]*height:\s*28px/s.test(gradientMobile)) {
  fail('assets/css/gradients.css: mobile gradient pair buttons should have a 44px tap area');
}

const usesMobile = palettes.match(/@media\s*\(max-width:\s*640px\)\s*\{[\s\S]+?\n\}/)?.[0] || '';
if (!/\.use-modebar button,\s*\.use-huebar button\s*\{[^}]*min-width:\s*44px[^}]*min-height:\s*44px/s.test(usesMobile)) {
  fail('assets/css/palettes.css: mobile Uses controls should use 44px tap targets');
}

const themeMobile = themeForge.match(/@media\s*\(max-width:\s*920px\)\s*\{[\s\S]+?\n\}/)?.[0] || '';
for (const snippet of [
  '.tf-root .kpis{grid-template-columns:1fr}',
  '.tf-root .cols{grid-template-columns:1fr}',
  '.tf-root .grid4{grid-template-columns:repeat(2,minmax(0,1fr))}',
  '.tf-root .stage{overflow-x:hidden}',
]) {
  if (!themeMobile.replace(/\s+/g, '').includes(snippet.replace(/\s+/g, ''))) {
    fail(`assets/css/theme-forge.css: mobile rule missing ${snippet}`);
  }
}
if (!/\.tf-root \.quick button\s*\{[^}]*width:\s*40px[^}]*height:\s*40px/s.test(themeMobile) || !/\.tf-root \.tf-search\s*\{[^}]*min-height:\s*44px/s.test(themeMobile) || !/\.tf-root \.ghost\s*\{[^}]*min-height:\s*44px/s.test(themeMobile)) {
  fail('assets/css/theme-forge.css: mobile top bar controls should use 40-44px tap targets');
}

const terminalMobile = terminal.match(/@media\s*\(max-width:\s*1080px\)\s*\{[\s\S]+?\n\}/)?.[0] || '';
if (!/\.term-root \.quick button\s*\{[^}]*width:\s*40px[^}]*height:\s*40px/s.test(terminalMobile) || !/\.term-root \.tm-search\s*\{[^}]*min-height:\s*44px/s.test(terminalMobile) || !/\.term-root \.ghost,\s*\.term-root \.seg button\s*\{[^}]*min-height:\s*44px/s.test(terminalMobile)) {
  fail('assets/css/terminal.css: mobile top bar controls should use 40-44px tap targets');
}

const styleDockMobile = styles.match(/@media\s*\(max-width:\s*760px\)\s*\{[\s\S]+?body\[data-style-dock-collapsed="true"\]\s+\.style-lab-control\.style-lab-dock\s*\{[\s\S]+?\n\s*\}\n\}/)?.[0] || '';
if (!/right:\s*0\s*;/.test(styleDockMobile) || !/width:\s*100%\s*;/.test(styleDockMobile)) {
  fail('assets/css/styles.css: mobile style lab dock should stay inside viewport width');
}
if (!/grid-template-columns:\s*1fr\s*;/.test(styleDockMobile) || !/overflow-y:\s*auto\s*;/.test(styleDockMobile)) {
  fail('assets/css/styles.css: mobile style lab dock should stack and scroll vertically');
}

if (failures.length) {
  throw new Error(`Mobile layout verification failed:\n${failures.join('\n')}`);
}

console.log('Mobile layout verified.');
