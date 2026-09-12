<div align="center">

# xxd-print-packaging

### Plan traditional-color use for print, packaging, and physical materials

<strong>English</strong> · <a href="README.md">简体中文</a>

</div>

## What it does

This Skill plans color for packaging, books, stationery, gifts, cultural products, labels, apparel, cosmetics, and other physical surfaces. It accounts for hierarchy, substrate, finishes, production risk, shelf impact, and product-series recognition.

## Workflow

1. Define category, price position, material, finish, series size, and shelf environment.
2. Assign base, identity, text, seal, variant, and support roles.
3. Balance recognition with restraint and protect small-type contrast.
4. Flag shifts from paper, coating, metallic effects, ink coverage, registration, and lighting.
5. Provide a proofing checklist before production.

HEX values are digital references. CMYK or spot values are included only when production data is available; final color must be checked with printer profiles or physical proofs.

## Output

You receive a packaging direction, role palette with ratios and material notes, front/back/side panel plan, series extension rules, and a production checklist.

## Install and use

```bash
npx skills add https://github.com/nevertoday/zhongguo-traditional-colors --skill xxd-print-packaging
```

Invoke `$xxd-print-packaging` with product category, material, finish, package dimensions, series needs, and existing colors.
