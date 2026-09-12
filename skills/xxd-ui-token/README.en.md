<div align="center">

# xxd-ui-token

### Convert traditional colors into semantic UI tokens for light and dark modes

<strong>English</strong> · <a href="README.md">简体中文</a>

</div>

## What it does

This Skill turns Chinese traditional colors into a handoff-ready token system for CSS, Tailwind, Figma, and product interfaces. It separates primitive references from semantic roles and component states so teams can evolve the design safely.

## Workflow

1. Identify the interface and token scope.
2. Define primitive project-color references.
3. Map semantic roles such as canvas, text, action, border, focus, and status.
4. Build light and dark modes as intentional mappings; do not simply invert colors.
5. Add component states only when needed and flag pairs that require contrast verification.

Token names stay semantic (`color.text.primary`, `color.action.primary`); traditional names remain metadata or primitive aliases.

## Output

You receive a token table, requested CSS/Tailwind/Figma/JSON code, component mapping, handoff notes, and migration guidance for existing colors.

## Install and use

```bash
npx skills add https://github.com/nevertoday/zhongguo-traditional-colors --skill xxd-ui-token
```

Invoke `$xxd-ui-token` with an interface description, palette, existing CSS/Figma variables, and requested output format.
