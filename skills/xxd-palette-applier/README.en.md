<div align="center">

# xxd-palette-applier

### Apply a traditional-color palette to a real design surface

<strong>English</strong> · <a href="README.md">简体中文</a>

</div>

## What it does

This Skill decides where each color belongs, how much area it receives, and what it must not do on a poster, webpage, app, packaging layout, presentation, editorial page, or social cover.

## Workflow

1. Identify the surface and primary reading path.
2. Convert colors into ground, content, action, rhythm, and detail roles.
3. Put the strongest contrast on the most important message.
4. Set area ratios: large fields 50–75%, structure/content 15–35%, accents 3–10%, details under 3%.
5. Add surface-specific placement rules and misuse cases.

The Skill works after a palette exists. If a role is missing or unsafe, it says what must be repaired before inventing a new color.

## Output

You receive a surface diagnosis, role map with HEX values and ratios, reading path, placement rules, and three concrete misuse checks.

## Install and use

```bash
npx skills add https://github.com/nevertoday/zhongguo-traditional-colors --skill xxd-palette-applier
```

Invoke `$xxd-palette-applier` with an existing palette plus a screenshot, layout, platform, or surface description.
