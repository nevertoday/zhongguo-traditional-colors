<div align="center">

# xxd-palette-builder

### Build practical role-based palettes from the Chinese traditional-color dataset

<strong>English</strong> · <a href="README.md">简体中文</a>

</div>

## What it does

This Skill turns a traditional color, HEX value, mood, brand, poster, UI, packaging, or content direction into one to three usable palettes with main, support, neutral, accent, warning, and background roles.

## Workflow

1. Classify the anchor by source, mood, and surface.
2. Choose a reliability, identity, contrast, or series strategy.
3. Build safe, character, and optional contrast directions.
4. Assign roles before presenting colors and add ratios and risk notes.
5. Select one recommendation unless alternatives are requested.

Every recommended HEX must exist in the current 742-color data. Outside HEX values are mapped to the nearest project color and clearly labeled as mappings.

## Output

Each option includes a name, use case, role table, HEX values, ratios, surface notes, risk notes, and a final pick. The next step is usually `$xxd-palette-applier`, `$xxd-ui-token`, `$xxd-accessible-color`, or `$xxd-print-packaging`.

## Install and use

```bash
npx skills add https://github.com/nevertoday/zhongguo-traditional-colors --skill xxd-palette-builder
```

Invoke `$xxd-palette-builder` with a color, HEX, mood, brand direction, reference, or target surface.
