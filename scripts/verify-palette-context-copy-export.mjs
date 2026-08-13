import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const html = readFileSync(join(root, 'palettes.html'), 'utf8');
const js = readFileSync(join(root, 'assets/js/palettes.js'), 'utf8');

const failures = [];
const check = (label, condition) => {
  if (!condition) failures.push(label);
};

check('palettes.html: missing [data-demo-toast]', /\bdata-demo-toast\b/.test(html));
check('palettes.html: demo toast missing role=status', /\bdata-demo-toast\b[^>]*\brole="status"/.test(html) || /\brole="status"[^>]*\bdata-demo-toast\b/.test(html));
check('palettes.html: demo toast missing aria-live=polite', /\bdata-demo-toast\b[^>]*\baria-live="polite"/.test(html) || /\baria-live="polite"[^>]*\bdata-demo-toast\b/.test(html));

for (const functionName of ['copyDemoHue', 'copyDemoCssVars', 'copyDemoJsonTokens', 'copyDemoBrief']) {
  check(`assets/js/palettes.js: missing ${functionName}`, new RegExp(`function\\s+${functionName}\\b`).test(js));
}
check('assets/js/palettes.js: copyDemoHue must use clipboard', /function\s+copyDemoHue[\s\S]*(navigator\.clipboard\.writeText|writeClipboard)/.test(js));
check('assets/js/palettes.js: copyDemoHue must include sourceName', /function\s+copyDemoHue[\s\S]*sourceName/.test(js));
check('assets/js/palettes.js: copyDemoHue must include hex', /function\s+copyDemoHue[\s\S]*hex/.test(js));
check('assets/js/palettes.js: CSS export missing traditional-palette-demo', /traditional-palette-demo/.test(js));
check('assets/js/palettes.js: CSS export missing --demo-background', /function\s+copyDemoCssVars[\s\S]*--demo-background/.test(js));
check('assets/js/palettes.js: JSON export missing roles', /function\s+demoJsonTokens[\s\S]*roles/.test(js));
check('assets/js/palettes.js: JSON export missing paletteId', /function\s+demoJsonTokens[\s\S]*paletteId/.test(js));
check('assets/js/palettes.js: JSON export must not include scene', !/function\s+demoJsonTokens[\s\S]*scene/.test(js));
for (const phrase of ['锚点色', '配色关系', '面积建议', '风险提醒']) {
  check(`assets/js/palettes.js: brief export missing ${phrase}`, js.includes(phrase));
}
check('assets/js/palettes.js: missing demo hue copy row hook', /data-demo-copy-hue/.test(js));
check('assets/js/palettes.js: must not keep context favorite for scene', !/contextFavoriteId|toggleContextFavorite|收藏场景/.test(js));
check('assets/js/palettes.js: demo page copy must not mention scenes', !/六个场景|场景切换|多场景/.test(js));

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Palette demo copy/export verification passed.');
