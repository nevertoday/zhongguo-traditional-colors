<div align="center">

# xxd-brand-system

### Build a reusable brand color system from Chinese traditional colors

<strong>English</strong> · <a href="README.md">简体中文</a>

</div>

## What it does

This Skill turns a palette into durable brand behavior for websites, products, social content, presentations, packaging, and offline materials. It defines a recognizable anchor, support family, neutral base, accents, ratios, forbidden combinations, and handoff rules.

## Workflow

1. Clarify category, audience, price position, cultural posture, and channels.
2. Choose an anchor color, two to four support colors, neutrals, and limited accents.
3. Assign roles and ratios for each channel.
4. Define what may change by campaign and what must remain stable.
5. Add ownership, review triggers, accessibility checks, and print checks.

Existing brand colors are mapped to the nearest project colors so recognition is preserved unless a full redesign is requested.

## Output

The result includes a brand thesis, role-based HEX palette, channel rules, forbidden uses, and handoff guidance. If the brand becomes an interface, continue with `$xxd-ui-token`; use `$xxd-accessible-color` for contrast checks.

## Install and use

```bash
npx skills add https://github.com/nevertoday/zhongguo-traditional-colors --skill xxd-brand-system
```

Invoke `$xxd-brand-system` with a brand brief, existing colors, channels, or reference materials.
