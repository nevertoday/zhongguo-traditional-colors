---
name: xxd-content-series
description: Design reusable Chinese traditional color systems for content series. Use when a user needs color rules for Xiaohongshu covers, WeChat articles, video thumbnails, course slides, newsletters, recurring columns, editorial series, carousels, or multi-part content that must stay recognizable over time.
---

# xxd-content-series

## Purpose

Use this skill when a creator needs repeated content to feel like one series while still giving each issue, column, or episode enough variation.

## Pain Points This Solves

- Content teams lose recognition when every cover uses a new palette.
- Repeating the exact same template creates fatigue and makes new posts hard to distinguish.
- Platform templates need fixed brand layers, variable topic layers, and rules simple enough to use every week.

## Data Contract

- Use the bundled references inside this skill:
  - `references/chinese-color-master-list.md`: full 742-color Markdown source list.
  - `references/chinese-color-harmony.csv`: complete machine-readable harmony table for all 742 colors.
  - `references/chinese-color-harmony.md`: Markdown version of the same harmony relationships.
- Give recurring colors stable roles.
- Avoid assigning too many equally strong colors to columns; recognition usually comes from stable structure plus controlled variation.

## Series Workflow

1. Identify the publishing system:
   - Platform: Xiaohongshu, WeChat, newsletter, video, PPT/course, blog, poster series.
   - Cadence: daily, weekly, seasonal, campaign, course module.
   - Number of columns, formats, or recurring segments.
   - Recognition goal: subtle author identity or strong cover identity.
2. Create the fixed layer:
   - Canvas/background family.
   - Title and body text colors.
   - Author mark or brand mark.
   - Date, issue number, tag, or category marker.
3. Create the variable layer:
   - Column accents.
   - Topic mood colors.
   - Seasonal rotation colors.
   - Special issue highlight color.
4. Define reusable templates:
   - Cover or thumbnail.
   - Carousel/list page.
   - Quote or key insight card.
   - Long-form header.
   - Course or episode divider.
5. Add anti-fatigue rules:
   - What may change every issue.
   - What changes only by column.
   - What must never change.
   - How to rotate accents without making the series look random.

## Output Shape

- Series identity: one paragraph focused on recognition and rhythm.
- Fixed layer: role, color name, HEX, why it stays stable.
- Variable layer: column/topic, color name, HEX, rotation rule.
- Template rules: cover, carousel, article header, quote card, divider.
- Publishing rules: cadence, rotation, special issues, fatigue limits.

If the user has only one post, use `xxd-palette-applier` unless they explicitly want a repeatable series.
