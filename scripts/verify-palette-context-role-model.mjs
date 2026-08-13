import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const js = readFileSync(join(root, 'assets/js/palettes.js'), 'utf8');
const readableTextColorBody = js.match(/function\s+readableTextColor[\s\S]*?\n\}/)?.[0] || '';

const failures = [];
const check = (label, condition) => {
  if (!condition) failures.push(label);
};

check('assets/js/palettes.js: missing DEMO_ROLES', /\bDEMO_ROLES\b/.test(js));
for (const role of ['background', 'headline', 'paragraph', 'button', 'buttonText', 'card', 'line', 'accent']) {
  check(`assets/js/palettes.js: DEMO_ROLES missing ${role}`, new RegExp(`key:\\s*['"]${role}['"]`).test(js));
}
check('assets/js/palettes.js: missing demoRolesForPalette', /function\s+demoRolesForPalette\b/.test(js));
check('assets/js/palettes.js: demoRolesForPalette must read palette.colors', /function\s+demoRolesForPalette[\s\S]*palette\.colors/.test(js));
check('assets/js/palettes.js: missing demoRoleByKey', /function\s+demoRoleByKey\b/.test(js));
check('assets/js/palettes.js: missing readablePairForRole', /function\s+readablePairForRole\b/.test(js));
check('assets/js/palettes.js: readableTextColor must compare real contrast', /contrastRatio/.test(readableTextColorBody));
check('assets/js/palettes.js: readablePairForRole must use contrastRatio', /function\s+readablePairForRole[\s\S]*contrastRatio/.test(js));
check('assets/js/palettes.js: readablePairForRole must enforce 4.5 contrast', /function\s+readablePairForRole[\s\S]*4\.5/.test(js));
check('assets/js/palettes.js: missing demoRatioForRelation', /function\s+demoRatioForRelation\b/.test(js));
for (const relation of ['curated', 'same', 'complementary', 'neutral']) {
  check(`assets/js/palettes.js: demoRatioForRelation missing ${relation}`, new RegExp(`${relation}:\\s*\\[`).test(js));
}
check('assets/js/palettes.js: missing demoUseCaseForPalette', /function\s+demoUseCaseForPalette\b/.test(js));
check('assets/js/palettes.js: demoUseCaseForPalette missing rationale', /rationale/.test(js));
check('assets/js/palettes.js: demoUseCaseForPalette missing risk', /risk/.test(js));
check('assets/js/palettes.js: demo roles missing sourceName', /sourceName/.test(js));
check('assets/js/palettes.js: demo roles missing sourceId', /sourceId/.test(js));
check('assets/js/palettes.js: demo roles missing hex', /\bhex\b/.test(js));
check('assets/js/palettes.js: must not invent fakeName', !/\bfakeName\b/.test(js));
check('assets/js/palettes.js: must not invent generatedName', !/\bgeneratedName\b/.test(js));
check('assets/js/palettes.js: missing demoRoleCssText', /function\s+demoRoleCssText\b/.test(js));
for (const variable of ['--demo-background', '--demo-headline', '--demo-button']) {
  check(`assets/js/palettes.js: demoRoleCssText missing ${variable}`, js.includes(variable));
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Palette demo role model verification passed.');
