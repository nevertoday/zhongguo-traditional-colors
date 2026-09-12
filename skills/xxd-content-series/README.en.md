<div align="center">

# xxd-content-series

### Design a reusable traditional-color system for recurring content

<strong>English</strong> · <a href="README.md">简体中文</a>

</div>

## What it does

This Skill helps Xiaohongshu covers, WeChat articles, video thumbnails, newsletters, courses, carousels, and recurring columns feel like one recognizable series without making every issue identical.

## Workflow

1. Define platforms, cadence, formats, columns, and recognition goals.
2. Build a fixed layer for canvas, typography, marks, dates, and category labels.
3. Build a variable layer for topics, columns, seasons, and special issues.
4. Specify cover, carousel, article-header, quote-card, and divider templates.
5. Set anti-fatigue rules: what changes each issue, by column, or never.

Recurring colors keep stable roles. Strong traditional colors are rotated with restraint so the series stays recognizable rather than random or repetitive.

## Output

The result includes series identity, fixed and variable color layers with HEX values, template rules, rotation guidance, and publishing limits.

## Install and use

```bash
npx skills add https://github.com/nevertoday/zhongguo-traditional-colors --skill xxd-content-series
```

Invoke `$xxd-content-series` with the platform, content formats, cadence, existing brand colors, and desired variation.
