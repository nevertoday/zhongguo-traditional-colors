---
name: xxd-content-series
description: Design reusable Chinese traditional color systems for content series. Use when a user needs colors for Xiaohongshu covers, WeChat articles, video thumbnails, course slides, newsletters, column identities, recurring social posts, editorial series, or multi-part content that must stay recognizable over time.
---

# xxd-content-series

## Overview

Create a color system for repeated content, not a one-off cover. The output should help creators keep a series recognizable while allowing each episode or column to feel distinct.

## Data Rules

- Use only colors from `docs/chinese-color-master-list.md` and `docs/chinese-color-harmony.csv`.
- Give every recurring color a stable role.
- For series with many columns, avoid assigning too many equally strong colors.

## Workflow

1. Identify content rhythm:
   - Platform: Xiaohongshu, WeChat, newsletter, video, PPT/course, blog, poster series.
   - Number of columns or recurring formats.
   - Desired recognition level: calm brand system or strong cover identity.
2. Define the persistent layer:
   - Background family.
   - Title color.
   - Brand mark or author mark color.
   - Number/date/tag color.
3. Define variable layer:
   - Column colors.
   - Topic accent colors.
   - Seasonal or campaign colors.
4. Provide templates:
   - Cover.
   - Long-form article header.
   - Quote or key insight card.
   - List or carousel page.
5. Add rules for avoiding fatigue: rotate accents, keep backgrounds stable, cap strong colors.

## Output

Use this structure:

- Series identity: one paragraph.
- Persistent palette: role, color name, HEX, usage.
- Column or topic palette: column, color name, HEX, rule.
- Layout color rules: cover, carousel, article header, quote card.
- Rotation rules: what changes each issue and what must stay fixed.

If the user has only one post, use `xxd-palette-applier` instead unless they explicitly want a repeatable series system.
